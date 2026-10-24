import pool from "../database/db.js";

const BOOKING_STATUSES = new Set([
  "pending",
  "awaiting_payment",
  "under_review",
  "confirmed",
  "cancelled",
  "rejected",
]);

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// GET /api/admin/bookings
// Retrieve bookings for the admin dashboard.
export async function listAdminBookings(req, res, next) {
  try {
    const { status, search } = req.query;

    let sql = `
      SELECT
        b.id,
        b.booking_reference,
        b.guest_id,
        g.full_name AS guest_name,
        g.email AS guest_email,
        g.phone AS guest_phone,
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
        b.updated_at,
        (
          SELECT COUNT(*)
          FROM booking_items bi
          WHERE bi.booking_id = b.id
        ) AS accommodation_count
      FROM bookings b
      INNER JOIN guests g
        ON g.id = b.guest_id
      WHERE 1 = 1
    `;

    const params = [];

    if (status) {
      if (!BOOKING_STATUSES.has(status)) {
        return sendError(res, 400, "Invalid booking status.");
      }

      sql += " AND b.booking_status = ?";
      params.push(status);
    }

    if (search) {
      const term = String(search).trim().slice(0, 150);

      if (term) {
        sql += `
          AND (
            b.booking_reference LIKE ?
            OR g.full_name LIKE ?
            OR g.email LIKE ?
          )
        `;

        const searchTerm = `%${term}%`;

        params.push(searchTerm, searchTerm, searchTerm);
      }
    }

    sql += " ORDER BY b.created_at DESC, b.id DESC LIMIT 200";

    const [bookings] = await pool.execute(sql, params);

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/bookings/:bookingId
// Retrieve one booking with its guest, accommodation and payment details.
export async function getAdminBooking(req, res, next) {
  try {
    const bookingId = Number(req.params.bookingId);

    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    const [bookings] = await pool.execute(
      `
      SELECT
        b.id,
        b.booking_reference,
        b.guest_id,
        g.full_name AS guest_name,
        g.email AS guest_email,
        g.phone AS guest_phone,
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
      INNER JOIN guests g
        ON g.id = b.guest_id
      WHERE b.id = ?
      LIMIT 1
      `,
      [bookingId],
    );

    if (bookings.length === 0) {
      return sendError(res, 404, "Booking not found.");
    }

    const booking = bookings[0];

    const [items] = await pool.execute(
      `
      SELECT
        bi.id,
        bi.accommodation_unit_id,
        bi.nightly_rate,
        bi.nights,
        bi.line_total,
        u.unit_name,
        a.id AS accommodation_id,
        a.name AS accommodation_name,
        a.accommodation_type
      FROM booking_items bi
      INNER JOIN accommodation_units u
        ON u.id = bi.accommodation_unit_id
      INNER JOIN accommodations a
        ON a.id = u.accommodation_id
      WHERE bi.booking_id = ?
      ORDER BY bi.id ASC
      `,
      [bookingId],
    );

    const [payments] = await pool.execute(
      `
      SELECT
        p.id,
        p.amount,
        p.currency,
        p.method,
        p.transaction_reference,
        p.payment_date,
        p.status AS payment_status,
        p.rejection_reason,
        p.submitted_at,
        p.verified_at,
        ps.id AS slip_id,
        ps.original_filename AS slip_filename,
        ps.mime_type AS slip_mime_type,
        ps.file_size AS slip_file_size,
        ps.uploaded_at AS slip_uploaded_at
      FROM payments p
      LEFT JOIN payment_slips ps
        ON ps.payment_id = p.id
      WHERE p.booking_id = ?
      ORDER BY p.submitted_at DESC, p.id DESC
      `,
      [bookingId],
    );

    return res.status(200).json({
      success: true,
      data: {
        ...booking,
        accommodations: items,
        payments,
      },
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/admin/bookings/:bookingId/status
// Confirm, cancel or reject a booking.
export async function updateAdminBookingStatus(req, res, next) {
  const bookingId = Number(req.params.bookingId);

  const requestedStatus =
    typeof req.body?.status === "string" ? req.body.status.trim() : "";

  if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
    return sendError(res, 400, "Invalid booking ID.");
  }

  const allowedTransitions = new Set(["confirmed", "cancelled", "rejected"]);

  if (!allowedTransitions.has(requestedStatus)) {
    return sendError(
      res,
      400,
      "Status must be confirmed, cancelled or rejected.",
    );
  }

  let connection;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    const [rows] = await connection.execute(
      `
      SELECT
        id,
        booking_reference,
        booking_status,
        currency,
        total_amount,
        amount_paid,
        expires_at
      FROM bookings
      WHERE id = ?
      FOR UPDATE
      `,
      [bookingId],
    );

    if (rows.length === 0) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 404, "Booking not found.");
    }

    const booking = rows[0];
    const currentStatus = booking.booking_status;

    if (currentStatus === requestedStatus) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 409, `This booking is already ${requestedStatus}.`);
    }

    if (currentStatus === "cancelled" || currentStatus === "rejected") {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        409,
        "A cancelled or rejected booking cannot be changed through this endpoint.",
      );
    }

    if (requestedStatus === "confirmed") {
      if (
        currentStatus !== "under_review" &&
        currentStatus !== "awaiting_payment" &&
        currentStatus !== "pending"
      ) {
        await connection.rollback();
        transactionStarted = false;

        return sendError(
          res,
          409,
          "This booking cannot be confirmed from its current status.",
        );
      }

      const totalAmount = Number(booking.total_amount);
      const amountPaid = Number(booking.amount_paid);

      if (
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
          "The booking amount has not been configured correctly.",
        );
      }

      // Require the booking to be fully paid until the resort
      // establishes an approved deposit or partial-payment policy.
      if (amountPaid < totalAmount) {
        await connection.rollback();
        transactionStarted = false;

        return sendError(
          res,
          409,
          "The recorded payment does not cover the booking total.",
        );
      }

      const [verifiedPayments] = await connection.execute(
        `
        SELECT COALESCE(SUM(amount), 0) AS verified_amount
        FROM payments
        WHERE booking_id = ?
          AND status = 'verified'
          AND currency = ?
        `,
        [bookingId, booking.currency],
      );

      const verifiedAmount = Number(verifiedPayments[0]?.verified_amount ?? 0);

      if (!Number.isFinite(verifiedAmount) || verifiedAmount < totalAmount) {
        await connection.rollback();
        transactionStarted = false;

        return sendError(
          res,
          409,
          "Verified payments do not cover the booking total.",
        );
      }

      // Confirm only if every selected unit is still valid and
      // no other active booking overlaps the requested dates.
      const [conflicts] = await connection.execute(
        `
        SELECT bi.accommodation_unit_id
        FROM booking_items bi
        INNER JOIN bookings other_booking
          ON other_booking.id = bi.booking_id
        WHERE bi.booking_id = ?
          AND (
            other_booking.booking_status = 'confirmed'
            OR (
              other_booking.booking_status = 'under_review'
              AND other_booking.id <> ?
            )
            OR (
              other_booking.booking_status IN (
                'pending',
                'awaiting_payment'
              )
              AND other_booking.expires_at IS NOT NULL
              AND other_booking.expires_at > CURRENT_TIMESTAMP
              AND other_booking.id <> ?
            )
          )
        LIMIT 1
        `,
        [bookingId, bookingId, bookingId],
      );

      if (conflicts.length > 0) {
        await connection.rollback();
        transactionStarted = false;

        return sendError(
          res,
          409,
          "The booking has an accommodation availability conflict.",
        );
      }

      const [units] = await connection.execute(
        `
        SELECT
          u.id,
          u.unit_status,
          a.publication_status
        FROM booking_items bi
        INNER JOIN accommodation_units u
          ON u.id = bi.accommodation_unit_id
        INNER JOIN accommodations a
          ON a.id = u.accommodation_id
        WHERE bi.booking_id = ?
        `,
        [bookingId],
      );

      if (units.length === 0) {
        await connection.rollback();
        transactionStarted = false;

        return sendError(res, 409, "This booking has no accommodation items.");
      }

      const invalidUnit = units.some(
        (unit) =>
          unit.unit_status !== "available" ||
          unit.publication_status !== "published",
      );

      if (invalidUnit) {
        await connection.rollback();
        transactionStarted = false;

        return sendError(
          res,
          409,
          "One or more selected accommodations are no longer available.",
        );
      }
    }

    await connection.execute(
      `
      UPDATE bookings
      SET booking_status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [requestedStatus, bookingId],
    );

    await connection.commit();
    transactionStarted = false;

    return res.status(200).json({
      success: true,
      message: `Booking ${requestedStatus} successfully.`,
      data: {
        id: booking.id,
        bookingReference: booking.booking_reference,
        previousStatus: currentStatus,
        bookingStatus: requestedStatus,
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
