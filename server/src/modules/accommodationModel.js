import pool from "../database/db.js";

export async function getAllAccommodations() {
  const [rows] = await pool.execute(
    `SELECT
       id,
       name,
       slug,
       accommodation_type,
       description,
       price_per_night,
       max_adults,
       max_children,
       size_sqm,
       publication_status
     FROM accommodations
     WHERE publication_status = ?
     ORDER BY id DESC`,
    ["published"],
  );

  return rows;
}

export async function getAccommodationBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT
       id,
       name,
       slug,
       accommodation_type,
       description,
       price_per_night,
       max_adults,
       max_children,
       size_sqm,
       publication_status
     FROM accommodations
     WHERE slug = ?
       AND publication_status = ?
     LIMIT 1`,
    [slug, "published"],
  );

  return rows[0] || null;
}
