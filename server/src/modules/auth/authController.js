import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import pool from "../../database/db.js";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

export async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [admins] = await pool.execute(
      `SELECT id, email, password_hash, role, is_active
       FROM admins
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail],
    );

    const admin = admins[0];

    if (!admin || !admin.is_active) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const token = jwt.sign(
      {
        role: admin.role,
      },
      secret,
      {
        subject: String(admin.id),
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        issuer: "atalaya-resort-api",
        audience: "atalaya-resort-admin",
      },
    );

    await pool.execute("UPDATE admins SET last_login_at = NOW() WHERE id = ?", [
      admin.id,
    ]);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
