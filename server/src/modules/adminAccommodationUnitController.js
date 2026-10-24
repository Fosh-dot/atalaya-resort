import pool from "../database/db.js";

// GET /api/admin/accommodations/:accommodationId/units
export async function listAccommodationUnits(req, res, next) {
  try {
    const accommodationId = Number(req.params.accommodationId);

    if (!Number.isSafeInteger(accommodationId) || accommodationId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid accommodation ID.",
      });
    }

    const [accommodations] = await pool.execute(
      "SELECT id, name FROM accommodations WHERE id = ? LIMIT 1",
      [accommodationId],
    );

    if (accommodations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found.",
      });
    }

    const [units] = await pool.execute(
      `SELECT
         id,
         accommodation_id,
         unit_name,
         unit_status,
         created_at
       FROM accommodation_units
       WHERE accommodation_id = ?
       ORDER BY id DESC`,
      [accommodationId],
    );

    return res.status(200).json({
      success: true,
      accommodation: accommodations[0],
      data: units,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/accommodations/:accommodationId/units
export async function createAccommodationUnit(req, res, next) {
  try {
    const accommodationId = Number(req.params.accommodationId);
    const { unit_name } = req.body;

    if (!Number.isSafeInteger(accommodationId) || accommodationId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid accommodation ID.",
      });
    }

    if (
      typeof unit_name !== "string" ||
      !unit_name.trim() ||
      unit_name.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid unit name of up to 150 characters.",
      });
    }

    const [accommodations] = await pool.execute(
      "SELECT id FROM accommodations WHERE id = ? LIMIT 1",
      [accommodationId],
    );

    if (accommodations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO accommodation_units
         (accommodation_id, unit_name, unit_status)
       VALUES (?, ?, 'available')`,
      [accommodationId, unit_name.trim()],
    );

    return res.status(201).json({
      success: true,
      message: "Accommodation unit created successfully.",
      data: {
        id: result.insertId,
        accommodation_id: accommodationId,
        unit_name: unit_name.trim(),
        unit_status: "available",
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This unit name already exists for the accommodation.",
      });
    }

    next(error);
  }
}

// PATCH /api/admin/accommodations/units/:unitId/status
export async function updateAccommodationUnitStatus(req, res, next) {
  try {
    const unitId = Number(req.params.unitId);
    const { unit_status } = req.body;

    const allowedStatuses = ["available", "maintenance", "inactive"];

    if (!Number.isSafeInteger(unitId) || unitId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid unit ID.",
      });
    }

    if (!allowedStatuses.includes(unit_status)) {
      return res.status(400).json({
        success: false,
        message: "Unit status must be available, maintenance, or inactive.",
      });
    }

    const [result] = await pool.execute(
      `UPDATE accommodation_units
       SET unit_status = ?
       WHERE id = ?`,
      [unit_status, unitId],
    );

    if (result.affectedRows === 0) {
      const [existing] = await pool.execute(
        "SELECT id FROM accommodation_units WHERE id = ? LIMIT 1",
        [unitId],
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Accommodation unit not found.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Accommodation unit status updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}
