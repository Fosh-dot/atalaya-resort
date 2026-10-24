import { Router } from "express";

import {
  listAccommodationUnits,
  createAccommodationUnit,
  updateAccommodationUnitStatus,
} from "./accommodationUnitController.js";

import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", requireAdmin, listAccommodationUnits);
router.post("/", requireAdmin, createAccommodationUnit);
router.patch("/:id/status", requireAdmin, updateAccommodationUnitStatus);

export default router;
