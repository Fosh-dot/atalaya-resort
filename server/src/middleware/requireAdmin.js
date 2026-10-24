import jwt from "jsonwebtoken";
import pool from "../database/db.js";

export async function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization;

  // Ensure the request includes a Bearer token.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  // Ensure JWT authentication is configured.
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured.",
    });
  }

  try {
    // Verify the token's signature, expiry, issuer, and audience.
    const payload = jwt.verify(token, secret, {
      issuer: "atalaya-resort-api",
      audience: "atalaya-resort-admin",
    });

    // Ensure the token contains a valid administrator identity.
    const adminId = Number(payload.sub);

    if (
      payload.role !== "admin" ||
      !Number.isSafeInteger(adminId) ||
      adminId < 1
    ) {
      return res.status(403).json({
        success: false,
        message: "Administrator access required.",
      });
    }

    // Verify that the administrator still exists and is active in MySQL.
    const [admins] = await pool.execute(
      `SELECT id, email, role, is_active
       FROM admins
       WHERE id = ?
       LIMIT 1`,
      [adminId],
    );

    const admin = admins[0];

    if (!admin || !admin.is_active || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Administrator account is unavailable.",
      });
    }

    // Attach the verified administrator to the request.
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    return next();
  } catch (error) {
    // Handle invalid or expired tokens separately from database errors.
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or has expired.",
      });
    }

    // Pass unexpected database or server errors to Express.
    return next(error);
  }
}
