import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getAdminSettings,
  updateAdminSettings,
} from "./adminSettingsController.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getAdminSettings);
router.put("/", updateAdminSettings);

export default router;
