import pool from "../database/db.js";

// GET /api/admin/accommodation-units
export async function listAccommodationUnits(req, res, next) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        u.id,
        u.accommodation_id,
        a.name AS accommodation_name,
        u.unit_name,
        u.unit_status,
        u.created_at
      FROM accommodation_units u
      JOIN accommodations a
        ON a.id = u.accommodation_id
      ORDER BY a.name, u.unit_name
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/admin/accommodation-units
export async function createAccommodationUnit(req, res, next) {
  try {
    const { accommodation_id, unit_name } = req.body;

    const accommodationId = Number(accommodation_id);
    const unitName =
      typeof unit_name === "string" ? unit_name.trim() : "";

    if (
      !Number.isSafeInteger(accommodationId) ||
      accommodationId < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Select a valid accommodation type.",
      });
    }

    if (!unitName || unitName.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid physical unit name.",
      });
    }

    const [accommodations] = await pool.execute(
      `SELECT id
       FROM accommodations
       WHERE id = ?
       LIMIT 1`,
      [accommodationId],
    );

    if (accommodations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Accommodation type not found.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO accommodation_units (
        accommodation_id,
        unit_name,
        unit_status
      ) VALUES (?, ?, 'available')`,
      [accommodationId, unitName],
    );

    return res.status(201).json({
      success: true,
      message: "Physical accommodation unit registered successfully.",
      data: {
        id: result.insertId,
        accommodation_id: accommodationId,
        unit_name: unitName,
        unit_status: "available",
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This unit may already be registered.",
      });
    }

    return next(error);
  }
}

// PATCH /api/admin/accommodation-units/:id/status
export async function updateAccommodationUnitStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { unit_status } = req.body;

    const allowedStatuses = [
      "available",
      "maintenance",
      "inactive",
    ];

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid physical unit ID.",
      });
    }

    if (!allowedStatuses.includes(unit_status)) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid unit status.",
      });
    }

    const [result] = await pool.execute(
      `UPDATE accommodation_units
       SET unit_status = ?
       WHERE id = ?`,
      [unit_status, id],
    );

    if (result.affectedRows === 0) {
      const [existing] = await pool.execute(
        `SELECT id
         FROM accommodation_units
         WHERE id = ?
         LIMIT 1`,
        [id],
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Physical accommodation unit not found.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Physical unit status updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
}