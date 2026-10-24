import { randomUUID } from "node:crypto";
import pool from "../database/db.js";
import { getBookingByReference, getBookingPayments } from "./bookingModel.js";

const BOOKING_CURRENCY = process.env.BOOKING_CURRENCY || "PHP";

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function getNights(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00.000Z`);
  const end = new Date(`${checkOut}T00:00:00.000Z`);

  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function toMoney(cents) {
  return (cents / 100).toFixed(2);
}

// ======================================================
// GET /api/bookings/:bookingReference
// ======================================================

export async function getBooking(req, res, next) {
  try {
    const { bookingReference } = req.params;

    if (
      typeof bookingReference !== "string" ||
      !/^AT-[A-F0-9]{16}$/.test(bookingReference)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking reference.",
      });
    }

    const booking = await getBookingByReference(bookingReference);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        bookingReference: booking.booking_reference,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        adults: booking.adults,
        children: booking.children,
        currency: booking.currency,
        subtotal: booking.subtotal,
        taxes: booking.taxes,
        fees: booking.fees,
        totalAmount: booking.total_amount,
        amountPaid: booking.amount_paid,
        status: booking.booking_status,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// GET /api/bookings/:bookingReference/payments
// ======================================================

export async function getBookingPaymentSummary(req, res, next) {
  try {
    const { bookingReference } = req.params;

    if (
      typeof bookingReference !== "string" ||
      !/^AT-[A-F0-9]{16}$/.test(bookingReference)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking reference.",
      });
    }

    const booking = await getBookingByReference(bookingReference);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const payments = await getBookingPayments(booking.id);

    return res.status(200).json({
      success: true,
      data: {
        bookingReference: booking.booking_reference,
        payments: payments.map((payment) => ({
          paymentId: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.payment_status,
          submittedAt: payment.submitted_at,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// POST /api/bookings
//
// Physical units are not required.
// Overlapping bookings are allowed.
// Payment plans:
//   full    = 100%
//   deposit = 60%
// ======================================================

export async function createBooking(req, res, next) {
  let connection;
  let transactionStarted = false;

  try {
    const {
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      adults,
      children = 0,
      accommodationId,
      quantity = 1,
      paymentPlan = "full",
    } = req.body ?? {};

    // --------------------------------------------------
    // 1. Validate guest details
    // --------------------------------------------------

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      fullName.trim().length > 200 ||
      typeof email !== "string" ||
      email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof phone !== "string" ||
      !phone.trim() ||
      phone.trim().length > 40
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid name, email, and phone number.",
      });
    }

    // --------------------------------------------------
    // 2. Validate payment plan
    // --------------------------------------------------

    if (!["full", "deposit"].includes(paymentPlan)) {
      return res.status(400).json({
        success: false,
        message: "Choose either full payment or a 60% deposit.",
      });
    }

    // --------------------------------------------------
    // 3. Validate dates
    // --------------------------------------------------

    const today = new Date().toISOString().slice(0, 10);

    if (
      !isValidDate(checkIn) ||
      !isValidDate(checkOut) ||
      checkIn <= today ||
      checkOut <= checkIn
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid future check-in and check-out dates.",
      });
    }

    const nights = getNights(checkIn, checkOut);

    if (nights < 1) {
      return res.status(400).json({
        success: false,
        message: "The stay must be at least one night.",
      });
    }

    // --------------------------------------------------
    // 4. Validate guest counts and quantity
    // --------------------------------------------------

    if (
      !Number.isSafeInteger(adults) ||
      adults < 1 ||
      adults > 100 ||
      !Number.isSafeInteger(children) ||
      children < 0 ||
      children > 100 ||
      !Number.isSafeInteger(accommodationId) ||
      accommodationId < 1 ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provide valid guest counts, accommodation type, and quantity.",
      });
    }

    if (!/^[A-Z]{3}$/.test(BOOKING_CURRENCY)) {
      return res.status(503).json({
        success: false,
        message: "The booking currency is not configured correctly.",
      });
    }

    // --------------------------------------------------
    // 5. Connect to database and start transaction
    // --------------------------------------------------

    connection = await pool.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    // --------------------------------------------------
    // 6. Retrieve accommodation and price
    // --------------------------------------------------

    const [accommodations] = await connection.execute(
      `SELECT
         id,
         name,
         price_per_night,
         max_adults,
         max_children,
         publication_status
       FROM accommodations
       WHERE id = ?
       LIMIT 1
       FOR UPDATE`,
      [accommodationId],
    );

    const accommodation = accommodations[0];

    if (!accommodation || accommodation.publication_status !== "published") {
      await connection.rollback();
      transactionStarted = false;

      return res.status(404).json({
        success: false,
        message: "This accommodation is not available for booking.",
      });
    }

    const nightlyRate = Number(accommodation.price_per_night);

    if (!Number.isFinite(nightlyRate) || nightlyRate <= 0) {
      await connection.rollback();
      transactionStarted = false;

      return res.status(503).json({
        success: false,
        message: "The price for this accommodation is not configured.",
      });
    }

    const nightlyRateCents = Math.round(nightlyRate * 100);

    // --------------------------------------------------
    // 7. Validate guest capacity
    //
    // No physical units are queried or assigned.
    // Overlapping bookings are allowed.
    // --------------------------------------------------

    const maxAdults = Number(accommodation.max_adults) * quantity;
    const maxChildren = Number(accommodation.max_children) * quantity;

    if (
      !Number.isFinite(maxAdults) ||
      !Number.isFinite(maxChildren) ||
      adults > maxAdults ||
      children > maxChildren
    ) {
      await connection.rollback();
      transactionStarted = false;

      return res.status(400).json({
        success: false,
        message:
          "The selected accommodation quantity cannot accommodate this group.",
        data: {
          maximumAdults: maxAdults,
          maximumChildren: maxChildren,
        },
      });
    }

    // --------------------------------------------------
    // 8. Find or create guest
    // --------------------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    const [existingGuests] = await connection.execute(
      `SELECT id
       FROM guests
       WHERE email = ?
       LIMIT 1
       FOR UPDATE`,
      [normalizedEmail],
    );

    let guestId;

    if (existingGuests.length > 0) {
      guestId = existingGuests[0].id;

      await connection.execute(
        `UPDATE guests
         SET full_name = ?, phone = ?
         WHERE id = ?`,
        [fullName.trim(), phone.trim(), guestId],
      );
    } else {
      const [guestResult] = await connection.execute(
        `INSERT INTO guests (
           full_name,
           email,
           phone
         )
         VALUES (?, ?, ?)`,
        [fullName.trim(), normalizedEmail, phone.trim()],
      );

      guestId = guestResult.insertId;
    }

    // --------------------------------------------------
    // 9. Calculate booking price and initial payment
    // --------------------------------------------------

    const subtotalCents = nightlyRateCents * nights * quantity;

    const taxesCents = 0;
    const feesCents = 0;

    const totalCents = subtotalCents + taxesCents + feesCents;

    if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
      throw new Error("The booking total exceeds the supported amount.");
    }

    const subtotal = toMoney(subtotalCents);
    const taxes = toMoney(taxesCents);
    const fees = toMoney(feesCents);
    const totalAmount = toMoney(totalCents);

    // Full payment = 100%.
    // Deposit = 60%.
    const initialPaymentCents =
      paymentPlan === "deposit"
        ? Math.ceil((totalCents * 60) / 100)
        : totalCents;

    const initialPaymentAmount = toMoney(initialPaymentCents);

    const remainingBalance = toMoney(totalCents - initialPaymentCents);

    // --------------------------------------------------
    // 10. Create booking
    // --------------------------------------------------

    const bookingReference = `AT-${randomUUID()
      .replace(/-/g, "")
      .slice(0, 16)
      .toUpperCase()}`;

    const [bookingResult] = await connection.execute(
      `INSERT INTO bookings (
         booking_reference,
         guest_id,
         check_in,
         check_out,
         adults,
         children,
         currency,
         subtotal,
         taxes,
         fees,
         total_amount,
         amount_paid,
         booking_status,
         expires_at
       )
       VALUES (
         ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, 0,
         'pending',
         DATE_ADD(NOW(), INTERVAL 30 MINUTE)
       )`,
      [
        bookingReference,
        guestId,
        checkIn,
        checkOut,
        adults,
        children,
        BOOKING_CURRENCY,
        subtotal,
        taxes,
        fees,
        totalAmount,
      ],
    );

    const bookingId = bookingResult.insertId;

    // --------------------------------------------------
    // 11. Create initial payment record
    // --------------------------------------------------

    const [paymentResult] = await connection.execute(
      `INSERT INTO payments (
     booking_id,
     amount,
     currency,
     payment_method,
     transaction_reference,
     payment_date,
     payment_status
   )
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        initialPaymentAmount,
        BOOKING_CURRENCY,
        "bank_transfer",
        "PENDING",
        checkIn,
        "pending",
      ],
    );

    const paymentId = paymentResult.insertId;

    // --------------------------------------------------
    // 12. Save booking item without a physical unit
    // --------------------------------------------------

    await connection.execute(
      `INSERT INTO booking_items (
         booking_id,
         accommodation_unit_id,
         nightly_rate,
         nights,
         line_total
       )
       VALUES (?, NULL, ?, ?, ?)`,
      [bookingId, toMoney(nightlyRateCents), nights, toMoney(subtotalCents)],
    );

    // --------------------------------------------------
    // 13. Commit transaction
    // --------------------------------------------------

    await connection.commit();
    transactionStarted = false;

    // --------------------------------------------------
    // 14. Return booking and payment details
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Your reservation has been submitted. Await resort review and payment instructions.",
      data: {
        bookingReference,
        paymentId,
        accommodation: accommodation.name,
        quantity,
        units: [],
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        currency: BOOKING_CURRENCY,
        nightlyRate: toMoney(nightlyRateCents),
        subtotal,
        taxes,
        fees,
        totalAmount,
        paymentPlan,
        initialPaymentAmount,
        remainingBalance,
        amountPaid: "0.00",
        status: "pending",
        expiresInMinutes: 30,
      },
    });
  } catch (error) {
    if (connection && transactionStarted) {
      await connection.rollback().catch(() => {});
      transactionStarted = false;
    }

    return next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
