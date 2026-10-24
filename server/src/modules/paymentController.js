import pool from "../database/db.js";
import fs from "node:fs/promises";
import path from "node:path";
import { uploadDirectory } from "../middleware/paymentUpload.js";

// POST /api/payments/:paymentId/slip
export async function uploadPaymentSlip(req, res, next) {
  let uploadedFilePath;

  try {
    const paymentId = Number(req.params.paymentId);

    if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a payment receipt to upload.",
      });
    }

    uploadedFilePath = req.file.path;

    // Read payment details submitted by the guest.
    const paymentMethod = String(req.body.payment_method || "")
      .trim()
      .toLowerCase();

    const transactionReference = String(
      req.body.transaction_reference || "",
    ).trim();

    const paymentDate = String(req.body.payment_date || "").trim();

    const allowedPaymentMethods = ["bank_transfer", "cash_deposit", "other"];

    // Validate payment details.
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      await fs.unlink(uploadedFilePath).catch(() => {});
      uploadedFilePath = undefined;

      return res.status(400).json({
        success: false,
        message: "Please select a valid payment method.",
      });
    }

    if (!transactionReference || transactionReference.length > 150) {
      await fs.unlink(uploadedFilePath).catch(() => {});
      uploadedFilePath = undefined;

      return res.status(400).json({
        success: false,
        message: "Please enter a valid transaction reference.",
      });
    }

    // Require a valid YYYY-MM-DD date.
    const validDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(paymentDate);
    const parsedDate = validDateFormat
      ? new Date(`${paymentDate}T00:00:00.000Z`)
      : null;

    if (
      !parsedDate ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== paymentDate
    ) {
      await fs.unlink(uploadedFilePath).catch(() => {});
      uploadedFilePath = undefined;

      return res.status(400).json({
        success: false,
        message: "Please provide a valid payment date.",
      });
    }

    // Check that the payment exists and can accept a receipt.
    const [payments] = await pool.execute(
      `SELECT id, payment_status
       FROM payments
       WHERE id = ?
       LIMIT 1`,
      [paymentId],
    );

    if (payments.length === 0) {
      await fs.unlink(uploadedFilePath).catch(() => {});
      uploadedFilePath = undefined;

      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    if (!["pending", "rejected"].includes(payments[0].payment_status)) {
      await fs.unlink(uploadedFilePath).catch(() => {});
      uploadedFilePath = undefined;

      return res.status(409).json({
        success: false,
        message: "This payment cannot accept another receipt.",
      });
    }

    const relativeFilePath = path
      .relative(uploadDirectory, uploadedFilePath)
      .split(path.sep)
      .join("/");

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Lock the payment row to prevent concurrent submissions.
      const [lockedPayments] = await connection.execute(
        `SELECT id, payment_status
         FROM payments
         WHERE id = ?
         FOR UPDATE`,
        [paymentId],
      );

      if (
        lockedPayments.length === 0 ||
        !["pending", "rejected"].includes(lockedPayments[0].payment_status)
      ) {
        await connection.rollback();

        await fs.unlink(uploadedFilePath).catch(() => {});
        uploadedFilePath = undefined;

        return res.status(409).json({
          success: false,
          message: "This payment can no longer accept a receipt.",
        });
      }

      // Save the uploaded receipt.
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
          relativeFilePath,
          path.basename(req.file.originalname),
          req.file.mimetype,
          req.file.size,
        ],
      );

      // Save the guest's payment details.
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

      // The uploaded file is now associated with the database record.
      uploadedFilePath = undefined;

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
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    if (uploadedFilePath) {
      await fs.unlink(uploadedFilePath).catch(() => {});
    }

    next(error);
  }
}
