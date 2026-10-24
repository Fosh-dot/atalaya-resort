import { Router } from "express";
import { createContactMessage } from "./contactController.js";

const router = Router();

router.post("/", createContactMessage);

export default router;
