import { Router } from "express";

import { requireAdmin } from "../middleware/requireAdmin.js";

import {
  listAdminAccommodations,
  createAccommodation,
  updateAccommodation,
} from "./adminAccommodationController.js";

import {
  listAccommodationUnits,
  createAccommodationUnit,
  updateAccommodationUnitStatus,
} from "./adminAccommodationUnitController.js";

const router = Router();

// All routes in this file require administrator authentication.
router.use(requireAdmin);

// Accommodation management
router.get("/", listAdminAccommodations);
router.post("/", createAccommodation);
router.patch("/:id", updateAccommodation);

// Individual room and villa unit management
router.get("/:accommodationId/units", listAccommodationUnits);

router.post("/:accommodationId/units", createAccommodationUnit);

router.patch("/units/:unitId/status", updateAccommodationUnitStatus);

export default router;
