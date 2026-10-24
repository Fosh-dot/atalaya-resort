import pool from "../database/db.js";

export async function getBookingByReference(bookingReference) {
  const [rows] = await pool.execute(
    `SELECT
       b.id,
       b.booking_reference,
       b.guest_id,
       b.check_in,
       b.check_out,
       b.adults,
       b.children,
       b.currency,
       b.subtotal,
       b.taxes,
       b.fees,
       b.total_amount,
       b.amount_paid,
       b.booking_status,
       b.expires_at,
       b.created_at,
       b.updated_at
     FROM bookings b
     WHERE b.booking_reference = ?
     LIMIT 1`,
    [bookingReference],
  );

  return rows[0] || null;
}

export async function getBookingPayments(bookingId) {
  const [rows] = await pool.execute(
    `SELECT
       id,
       booking_id,
       amount,
       currency,
       payment_method,
       transaction_reference,
       payment_date,
       payment_status,
       rejection_reason,
       submitted_at,
       verified_at
     FROM payments
     WHERE booking_id = ?
     ORDER BY id DESC`,
    [bookingId],
  );

  return rows;
}
