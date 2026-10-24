import { Router } from "express";
import paymentUpload from "../middleware/paymentUpload.js";
import { uploadPaymentSlip } from "./paymentController.js";

const router = Router();

router.post(
  "/:paymentId/slip",
  paymentUpload.single("receipt"),
  uploadPaymentSlip,
);

export default router;
