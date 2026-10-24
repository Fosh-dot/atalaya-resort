import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import pool from "../database/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Private payment-slip storage directory.
const PRIVATE_UPLOADS_DIR = path.resolve(__dirname, "../../private_uploads");

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// GET /api/admin/payments
// List payments for the admin dashboard.
export async function listAdminPayments(req, res, next) {
  try {
    const [payments] = await pool.execute(`
      SELECT
        p.id,
        p.booking_id,
        b.booking_reference,
        b.booking_status,
        b.check_in,
        b.check_out,
        b.currency AS booking_currency,
        b.total_amount,
        b.amount_paid,
        g.full_name AS guest_name,
        g.email AS guest_email,
        g.phone AS guest_phone,
        p.amount,
        p.currency,
        p.payment_method,
        p.transaction_reference,
        p.payment_date,
        p.payment_status AS payment_status,
        p.rejection_reason,
        p.submitted_at,
        p.verified_at,
        ps.id AS slip_id,
        ps.original_filename AS slip_filename,
        ps.mime_type AS slip_mime_type,
        ps.file_size AS slip_file_size,
        ps.uploaded_at AS slip_uploaded_at
      FROM payments p
      INNER JOIN bookings b
        ON b.id = p.booking_id
      INNER JOIN guests g
        ON g.id = b.guest_id
      LEFT JOIN payment_slips ps
        ON ps.payment_id = p.id
      ORDER BY p.submitted_at DESC, p.id DESC
    `);

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/payments/:paymentId/slip
// View a private payment slip.
export async function viewPaymentSlip(req, res, next) {
  try {
    const paymentId = Number(req.params.paymentId);

    if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
      return sendError(res, 400, "Invalid payment ID.");
    }

    const [rows] = await pool.execute(
      `
      SELECT
        ps.id,
        ps.file_path,
        ps.original_filename,
        ps.mime_type
      FROM payment_slips ps
      INNER JOIN payments p
        ON p.id = ps.payment_id
      WHERE p.id = ?
      ORDER BY ps.uploaded_at DESC, ps.id DESC
      LIMIT 1
      `,
      [paymentId],
    );

    if (rows.length === 0) {
      return sendError(res, 404, "Payment slip not found.");
    }

    const slip = rows[0];
    const storedPath = String(slip.file_path || "");

    if (!storedPath || path.isAbsolute(storedPath)) {
      return sendError(res, 404, "The payment slip file could not be located.");
    }

    const filePath = path.resolve(PRIVATE_UPLOADS_DIR, storedPath);
    const relativePath = path.relative(PRIVATE_UPLOADS_DIR, filePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return sendError(res, 400, "Invalid payment slip file path.");
    }

    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      return sendError(
        res,
        404,
        "The payment slip file is missing from storage.",
      );
    }

    const allowedMimeTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ]);

    const mimeType = allowedMimeTypes.has(slip.mime_type)
      ? slip.mime_type
      : "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Disposition", "inline");

    return res.sendFile(filePath, (error) => {
      if (error && !res.headersSent) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/admin/payments/:paymentId/verify
// Verify a submitted payment without automatically confirming
// the associated booking.
export async function verifyAdminPayment(req, res, next) {
  const paymentId = Number(req.params.paymentId);

  if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
    return sendError(res, 400, "Invalid payment ID.");
  }

  let connection;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    const [payments] = await connection.execute(
      `
      SELECT
        p.id,
        p.booking_id,
        p.amount,
        p.payment_status AS payment_status,
        b.total_amount,
        b.amount_paid,
        b.currency AS booking_currency,
        p.currency AS payment_currency
      FROM payments p
      INNER JOIN bookings b
        ON b.id = p.booking_id
      WHERE p.id = ?
      FOR UPDATE
      `,
      [paymentId],
    );

    if (payments.length === 0) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 404, "Payment not found.");
    }

    const payment = payments[0];

    if (payment.payment_status === "verified") {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 409, "This payment has already been verified.");
    }

    if (payment.payment_status !== "under_review") {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 409, "Only payments under review can be verified.");
    }

    const [slips] = await connection.execute(
      `
      SELECT id
      FROM payment_slips
      WHERE payment_id = ?
      LIMIT 1
      `,
      [paymentId],
    );

    if (slips.length === 0) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "A payment slip must be submitted before verification.",
      );
    }

    const amount = Number(payment.amount);
    const totalAmount = Number(payment.total_amount);
    const amountPaid = Number(payment.amount_paid);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0 ||
      !Number.isFinite(amountPaid) ||
      amountPaid < 0
    ) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "The payment or booking amount is not configured correctly.",
      );
    }

    if (
      !payment.payment_currency ||
      payment.payment_currency !== payment.booking_currency
    ) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "The payment currency does not match the booking currency.",
      );
    }

    // Update the payment and booking amount in one transaction.
    // Booking confirmation remains a separate admin action.
    const [updateResult] = await connection.execute(
      `
      UPDATE payments
      SET payment_status = 'verified',
          rejection_reason = NULL,
          verified_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND payment_status = 'under_review'
      `,
      [paymentId],
    );

    if (updateResult.affectedRows !== 1) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "The payment status changed. Refresh and review it again.",
      );
    }

    await connection.execute(
      `
      UPDATE bookings
      SET amount_paid = amount_paid + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [amount, payment.booking_id],
    );

    await connection.commit();
    transactionStarted = false;

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully. Review the booking before confirming it.",
      data: {
        paymentId,
        bookingId: payment.booking_id,
        paymentStatus: "verified",
        bookingConfirmationRequired: true,
      },
    });
  } catch (error) {
    if (connection && transactionStarted) {
      await connection.rollback();
    }

    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// PATCH /api/admin/payments/:paymentId/reject
// Reject a payment and record the administrator's reason.
export async function rejectAdminPayment(req, res, next) {
  const paymentId = Number(req.params.paymentId);

  const reason =
    typeof req.body?.reason === "string" ? req.body.reason.trim() : "";

  if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
    return sendError(res, 400, "Invalid payment ID.");
  }

  if (reason.length < 5 || reason.length > 1000) {
    return sendError(
      res,
      400,
      "Provide a rejection reason between 5 and 1000 characters.",
    );
  }

  let connection;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    const [payments] = await connection.execute(
      `
      SELECT
        p.id,
        p.booking_id,
        p.payment_status AS payment_status,
        b.booking_status
      FROM payments p
      INNER JOIN bookings b
        ON b.id = p.booking_id
      WHERE p.id = ?
      FOR UPDATE
      `,
      [paymentId],
    );

    if (payments.length === 0) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 404, "Payment not found.");
    }

    const payment = payments[0];

    if (payment.payment_status === "verified") {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "A verified payment cannot be rejected. A separate reversal process is required.",
      );
    }

    if (
      payment.payment_status !== "under_review" &&
      payment.payment_status !== "pending"
    ) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "This payment cannot be rejected in its current status.",
      );
    }

    const [updateResult] = await connection.execute(
      `
      UPDATE payments
      SET payment_status = 'rejected',
          rejection_reason = ?,
          verified_at = NULL
      WHERE id = ?
        AND payment_status IN ('pending', 'under_review')
      `,
      [reason, paymentId],
    );

    if (updateResult.affectedRows !== 1) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "The payment status changed. Refresh and review it again.",
      );
    }

    // The booking status is intentionally unchanged.
    // Review the booking separately.

    await connection.commit();
    transactionStarted = false;

    return res.status(200).json({
      success: true,
      message: "Payment rejected successfully.",
      data: {
        paymentId,
        bookingId: payment.booking_id,
        paymentStatus: "rejected",
        rejectionReason: reason,
      },
    });
  } catch (error) {
    if (connection && transactionStarted) {
      await connection.rollback();
    }

    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
