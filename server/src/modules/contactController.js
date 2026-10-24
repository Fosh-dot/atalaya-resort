import pool from "../database/db.js";

export async function createContactMessage(req, res, next) {
  try {
    const { firstName, lastName, email, phone, message, promotionalEmails } =
      req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO contact_messages
       (first_name, last_name, email, phone, message, promotional_emails)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        phone?.trim() || null,
        message.trim(),
        promotionalEmails ? 1 : 0,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    next(error);
  }
}
