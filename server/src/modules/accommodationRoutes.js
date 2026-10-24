import { Router } from "express";

import {
  listAccommodations,
  getAccommodation,
} from "./accommodationController.js";

import { checkAvailability } from "./availabilityController.js";

const router = Router();

// Availability must appear before /:slug.
router.get("/availability", checkAvailability);

router.get("/", listAccommodations);

router.get("/:slug", getAccommodation);

export default router;
