import pool from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import path from "node:path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedPaymentMethods = new Set([
  "bank_transfer",
  "cash_deposit",
  "other",
]);

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);

function uploadToCloudinary(file, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "raw",
        type: "authenticated",
        overwrite: false,
        context: {
          original_filename: path.basename(file.originalname),
        },
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
}

async function deleteCloudinaryFile(publicId) {
  if (!publicId) return;

  await cloudinary.uploader
    .destroy(publicId, {
      resource_type: "raw",
      type: "authenticated",
      invalidate: true,
    })
    .catch((error) => {
      console.error("Could not clean up Cloudinary receipt:", error.message);
    });
}

// POST /api/payments/:paymentId/slip
export async function uploadPaymentSlip(req, res, next) {
  let uploadedPublicId;

  try {
    const paymentId = Number(req.params.paymentId);

    if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please select a payment receipt to upload.",
      });
    }

    const extension = path.extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.has(file.mimetype) ||
      !allowedExtensions.has(extension)
    ) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG, WebP, and PDF receipts are allowed.",
      });
    }

    const paymentMethod = String(req.body.payment_method || "")
      .trim()
      .toLowerCase();

    const transactionReference = String(
      req.body.transaction_reference || "",
    ).trim();

    const paymentDate = String(req.body.payment_date || "").trim();

    if (!allowedPaymentMethods.has(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid payment method.",
      });
    }

    if (!transactionReference || transactionReference.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid transaction reference.",
      });
    }

    const validDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(paymentDate);
    const parsedDate = validDateFormat
      ? new Date(`${paymentDate}T00:00:00.000Z`)
      : null;

    if (
      !parsedDate ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== paymentDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid payment date.",
      });
    }

    const connection = await pool.getConnection();
    let transactionStarted = false;

    try {
      await connection.beginTransaction();
      transactionStarted = true;

      const [payments] = await connection.execute(
        `SELECT id, payment_status
         FROM payments
         WHERE id = ?
         FOR UPDATE`,
        [paymentId],
      );

      if (payments.length === 0) {
        await connection.rollback();
        transactionStarted = false;

        return res.status(404).json({
          success: false,
          message: "Payment record not found.",
        });
      }

      if (!["pending", "rejected"].includes(payments[0].payment_status)) {
        await connection.rollback();
        transactionStarted = false;

        return res.status(409).json({
          success: false,
          message: "This payment cannot accept another receipt.",
        });
      }

      const publicId = `payment-receipts/${randomUUID()}`;

      const cloudinaryResult = await uploadToCloudinary(file, publicId);
      uploadedPublicId = cloudinaryResult.public_id;

      const [result] = await connection.execute(
        `INSERT INTO payment_slips (
           payment_id,
           file_path,
           original_filename,
           mime_type,
           file_size
         ) VALUES (?, ?, ?, ?, ?)`,
        [
          paymentId,
          uploadedPublicId,
          path.basename(file.originalname),
          file.mimetype,
          file.size,
        ],
      );

      await connection.execute(
        `UPDATE payments
         SET payment_method = ?,
             transaction_reference = ?,
             payment_date = ?,
             payment_status = 'under_review',
             rejection_reason = NULL
         WHERE id = ?`,
        [paymentMethod, transactionReference, paymentDate, paymentId],
      );

      await connection.commit();
      transactionStarted = false;
      uploadedPublicId = undefined;

      return res.status(201).json({
        success: true,
        message: "Payment details and receipt submitted successfully.",
        data: {
          slipId: result.insertId,
          paymentId,
          paymentMethod,
          transactionReference,
          paymentDate,
          paymentStatus: "under_review",
        },
      });
    } catch (error) {
      if (transactionStarted) {
        await connection.rollback().catch(() => {});
      }

      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    if (uploadedPublicId) {
      await deleteCloudinaryFile(uploadedPublicId);
    }

    next(error);
  }
}
