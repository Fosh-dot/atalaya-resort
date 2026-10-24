import pool from "../database/db.js";

// GET /api/accommodations/availability
export async function checkAvailability(req, res, next) {
  try {
    const { checkIn, checkOut, adults = "1", children = "0" } = req.query;

    // Validate date format.
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (
      typeof checkIn !== "string" ||
      typeof checkOut !== "string" ||
      !datePattern.test(checkIn) ||
      !datePattern.test(checkOut)
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide checkIn and checkOut dates in YYYY-MM-DD format.",
      });
    }

    // Reject invalid calendar dates, not just invalid formats.
    const isValidDate = (value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      return res.status(400).json({
        success: false,
        message: "Provide valid calendar dates.",
      });
    }

    if (checkIn <= new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({
        success: false,
        message: "Check-in must be a future date.",
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    const adultCount = Number(adults);
    const childCount = Number(children);

    if (
      !Number.isSafeInteger(adultCount) ||
      adultCount < 1 ||
      adultCount > 100 ||
      !Number.isSafeInteger(childCount) ||
      childCount < 0 ||
      childCount > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid adult and child counts.",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT
        a.id AS accommodation_id,
        a.name,
        a.slug,
        a.accommodation_type,
        a.description,
        a.max_adults,
        a.max_children,
        a.size_sqm,
        u.id AS unit_id,
        u.unit_name
      FROM accommodations a
      INNER JOIN accommodation_units u
        ON u.accommodation_id = a.id
      WHERE a.publication_status = 'published'
        AND u.unit_status = 'available'
        AND a.max_adults >= ?
        AND a.max_children >= ?
        AND NOT EXISTS (
          SELECT 1
          FROM booking_items bi
          INNER JOIN bookings b
            ON b.id = bi.booking_id
          WHERE bi.accommodation_unit_id = u.id
            AND b.check_in < ?
            AND b.check_out > ?
            AND (
              b.booking_status = 'confirmed'
              OR (
                b.booking_status IN (
                  'pending',
                  'awaiting_payment',
                  'under_review'
                )
                AND (
                  b.expires_at IS NULL
                  OR b.expires_at > NOW()
                  OR b.booking_status = 'under_review'
                )
              )
            )
        )
      ORDER BY a.id, u.id
      `,
      [adultCount, childCount, checkOut, checkIn],
    );

    // Group available units under their accommodation type.
    const accommodations = new Map();

    for (const row of rows) {
      if (!accommodations.has(row.accommodation_id)) {
        accommodations.set(row.accommodation_id, {
          id: row.accommodation_id,
          name: row.name,
          slug: row.slug,
          type: row.accommodation_type,
          description: row.description,
          maxAdults: row.max_adults,
          maxChildren: row.max_children,
          sizeSqm: row.size_sqm,
          availableUnits: [],
        });
      }

      accommodations.get(row.accommodation_id).availableUnits.push({
        id: row.unit_id,
        name: row.unit_name,
      });
    }

    return res.status(200).json({
      success: true,
      data: Array.from(accommodations.values()),
    });
  } catch (error) {
    return next(error);
  }
}
