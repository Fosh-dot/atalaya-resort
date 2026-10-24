import { Router } from "express";
import pool from "../database/db.js";

const router = Router();

const PUBLIC_SETTINGS = [
  "resort_name",
  "payment_instructions",
  "bank_name",
  "account_name",
  "account_number",
  "account_currency",
];

router.get("/", async (req, res, next) => {
  try {
    const placeholders = PUBLIC_SETTINGS.map(() => "?").join(", ");

    const [rows] = await pool.execute(
      `SELECT setting_key, setting_value
       FROM resort_settings
       WHERE setting_key IN (${placeholders})`,
      PUBLIC_SETTINGS,
    );

    const settings = {};

    for (const key of PUBLIC_SETTINGS) {
      settings[key] = "";
    }

    settings.account_currency = "PHP";
    settings.resort_name = "Atalaya Resort";

    for (const row of rows) {
      settings[row.setting_key] = row.setting_value ?? "";
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
