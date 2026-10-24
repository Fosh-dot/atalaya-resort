import { Router } from "express";

import { requireAdmin } from "../middleware/requireAdmin.js";

import {
  listAdminBookings,
  getAdminBooking,
  updateAdminBookingStatus,
} from "./adminBookingController.js";

const router = Router();

// Protect every booking management endpoint.
router.use(requireAdmin);

// GET /api/admin/bookings
router.get("/", listAdminBookings);

// GET /api/admin/bookings/:bookingId
router.get("/:bookingId", getAdminBooking);

// PATCH /api/admin/bookings/:bookingId/status
router.patch("/:bookingId/status", updateAdminBookingStatus);

export default router;
