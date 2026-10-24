import pool from "../database/db.js";

const DEFAULT_SETTINGS = {
  resort_name: "Atalaya Resort",
  contact_email: "",
  contact_phone: "",
  address: "",
  booking_policy: "",
  payment_instructions: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  account_currency: "PHP",
};

const ALLOWED_FIELDS = Object.keys(DEFAULT_SETTINGS);

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// GET /api/admin/settings
export async function getAdminSettings(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT setting_key, setting_value
       FROM resort_settings`,
    );

    const settings = { ...DEFAULT_SETTINGS };

    for (const row of rows) {
      if (ALLOWED_FIELDS.includes(row.setting_key)) {
        settings[row.setting_key] = row.setting_value ?? "";
      }
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/settings
export async function updateAdminSettings(req, res, next) {
  const body = req.body || {};
  const settings = {};

  for (const field of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      if (typeof body[field] !== "string") {
        return sendError(res, 400, `The ${field} setting must be a string.`);
      }

      settings[field] = body[field].trim();
    }
  }

  if (Object.keys(settings).length === 0) {
    return sendError(res, 400, "No valid settings were provided.");
  }

  if (settings.resort_name !== undefined && !settings.resort_name) {
    return sendError(res, 400, "Resort name cannot be empty.");
  }

  if (settings.contact_email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(settings.contact_email)) {
      return sendError(res, 400, "Enter a valid contact email address.");
    }
  }

  if (
    settings.account_currency !== undefined &&
    !["PHP", "USD"].includes(settings.account_currency)
  ) {
    return sendError(res, 400, "Unsupported payment currency.");
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    for (const [key, value] of Object.entries(settings)) {
      await connection.execute(
        `INSERT INTO resort_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE
           setting_value = VALUES(setting_value),
           updated_at = CURRENT_TIMESTAMP`,
        [key, value],
      );
    }

    await connection.commit();

    const [rows] = await connection.execute(
      `SELECT setting_key, setting_value
       FROM resort_settings`,
    );

    const savedSettings = { ...DEFAULT_SETTINGS };

    for (const row of rows) {
      if (ALLOWED_FIELDS.includes(row.setting_key)) {
        savedSettings[row.setting_key] = row.setting_value ?? "";
      }
    }

    return res.status(200).json({
      success: true,
      message: "Resort settings saved successfully.",
      data: savedSettings,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
