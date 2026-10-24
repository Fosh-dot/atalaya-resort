import pool from "../database/db.js";

const allowedTypes = ["room", "villa"];
const allowedStatuses = ["draft", "published", "unpublished"];

function validateAccommodation(body) {
  const {
    name,
    slug,
    accommodation_type,
    description = null,
    price_per_night,
    max_adults,
    max_children = 0,
    size_sqm = null,
    publication_status = "draft",
  } = body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 150 ||
    typeof slug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 180
  ) {
    return "Enter a valid accommodation name and URL slug.";
  }

  if (!allowedTypes.includes(accommodation_type)) {
    return "Accommodation type must be room or villa.";
  }

  if (
    price_per_night === undefined ||
    price_per_night === null ||
    price_per_night === "" ||
    !Number.isFinite(Number(price_per_night)) ||
    Number(price_per_night) <= 0
  ) {
    return "Enter a valid price per night.";
  }

  if (
    !Number.isInteger(Number(max_adults)) ||
    Number(max_adults) < 1 ||
    !Number.isInteger(Number(max_children)) ||
    Number(max_children) < 0
  ) {
    return "Enter valid adult and child capacity values.";
  }

  if (
    size_sqm !== null &&
    size_sqm !== "" &&
    (!Number.isFinite(Number(size_sqm)) || Number(size_sqm) <= 0)
  ) {
    return "Size must be a positive number.";
  }

  if (!allowedStatuses.includes(publication_status)) {
    return "Invalid publication status.";
  }

  if (description !== null && typeof description !== "string") {
    return "Description must be text.";
  }

  return null;
}

function normalizeAccommodation(body) {
  return {
    name: body.name.trim(),
    slug: body.slug,
    accommodation_type: body.accommodation_type,
    description: body.description?.trim() || null,
    price_per_night: Number(body.price_per_night),
    max_adults: Number(body.max_adults),
    max_children: Number(body.max_children ?? 0),
    size_sqm:
      body.size_sqm === null ||
      body.size_sqm === undefined ||
      body.size_sqm === ""
        ? null
        : Number(body.size_sqm),
    publication_status: body.publication_status || "draft",
  };
}

// GET /api/admin/accommodations
export async function listAdminAccommodations(req, res, next) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        name,
        slug,
        accommodation_type,
        description,
        price_per_night,
        max_adults,
        max_children,
        size_sqm,
        publication_status,
        created_at,
        updated_at
      FROM accommodations
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/admin/accommodations
export async function createAccommodation(req, res, next) {
  try {
    const validationError = validateAccommodation(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const accommodation = normalizeAccommodation(req.body);

    const [result] = await pool.execute(
      `INSERT INTO accommodations (
        name,
        slug,
        accommodation_type,
        description,
        price_per_night,
        max_adults,
        max_children,
        size_sqm,
        publication_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        accommodation.name,
        accommodation.slug,
        accommodation.accommodation_type,
        accommodation.description,
        accommodation.price_per_night,
        accommodation.max_adults,
        accommodation.max_children,
        accommodation.size_sqm,
        accommodation.publication_status,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Accommodation created successfully.",
      data: {
        id: result.insertId,
        ...accommodation,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An accommodation with this slug already exists.",
      });
    }

    return next(error);
  }
}

// PATCH /api/admin/accommodations/:id
export async function updateAccommodation(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid accommodation ID.",
      });
    }

    const validationError = validateAccommodation(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const accommodation = normalizeAccommodation(req.body);

    const [result] = await pool.execute(
      `UPDATE accommodations
       SET
         name = ?,
         slug = ?,
         accommodation_type = ?,
         description = ?,
         price_per_night = ?,
         max_adults = ?,
         max_children = ?,
         size_sqm = ?,
         publication_status = ?
       WHERE id = ?`,
      [
        accommodation.name,
        accommodation.slug,
        accommodation.accommodation_type,
        accommodation.description,
        accommodation.price_per_night,
        accommodation.max_adults,
        accommodation.max_children,
        accommodation.size_sqm,
        accommodation.publication_status,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      const [existing] = await pool.execute(
        "SELECT id FROM accommodations WHERE id = ? LIMIT 1",
        [id],
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Accommodation not found.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Accommodation updated successfully.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An accommodation with this slug already exists.",
      });
    }

    return next(error);
  }
}
