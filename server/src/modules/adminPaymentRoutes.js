import { Router } from "express";

import { requireAdmin } from "../middleware/requireAdmin.js";

import {
  listAdminPayments,
  viewPaymentSlip,
  verifyAdminPayment,
  rejectAdminPayment,
} from "./adminPaymentController.js";

const router = Router();

// Every endpoint in this router requires admin authentication.
router.use(requireAdmin);

router.get("/", listAdminPayments);

router.get("/:paymentId/slip", viewPaymentSlip);

router.patch("/:paymentId/verify", verifyAdminPayment);

router.patch("/:paymentId/reject", rejectAdminPayment);

export default router;
