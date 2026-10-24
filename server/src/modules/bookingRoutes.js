import { Router } from "express";

import {
  getBooking,
  getBookingPaymentSummary,
  createBooking,
} from "./bookingController.js";

const router = Router();

// Create a new booking.
router.post("/", createBooking);

// Look up a booking by its reference.
router.get("/:bookingReference", getBooking);

// Retrieve a booking's payment summary.
router.get("/:bookingReference/payments", getBookingPaymentSummary);

export default router;
