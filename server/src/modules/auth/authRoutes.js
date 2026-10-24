import { Router } from "express";
import { loginAdmin, loginLimiter } from "./authController.js";

const router = Router();

router.post("/login", loginLimiter, loginAdmin);

export default router;
