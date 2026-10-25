import express from "express";
import cors from "cors";
import helmet from "helmet";

import accommodationRoutes from "./modules/accommodationRoutes.js";
import authRoutes from "./modules/auth/authRoutes.js";
import adminAccommodationRoutes from "./modules/adminAccommodationRoutes.js";
import adminAccommodationUnitRoutes from "./modules/accommodationUnitRoutes.js";
import paymentRoutes from "./modules/paymentRoutes.js";
import bookingRoutes from "./modules/bookingRoutes.js";
import adminPaymentRoutes from "./modules/adminPaymentRoutes.js";
import adminBookingRoutes from "./modules/adminBookingRoutes.js";
import adminSettingsRoutes from "./modules/adminSettingsRoutes.js";
import publicSettingsRoutes from "./modules/publicSettingsRoutes.js";
import contactRoutes from "./modules/contactRoutes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = [
  "https://atalayaresort.online",
  "https://www.atalayaresort.online",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));

app.use(
  express.urlencoded({
    extended: false,
    limit: "100kb",
  }),
);

// ======================================================
// API HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Atalaya Resort API is running.",
  });
});

// ======================================================
// PUBLIC ROUTES
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/public/settings", publicSettingsRoutes);

// ======================================================
// BOOKING AND PAYMENT ROUTES
// ======================================================

app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);

// ======================================================
// ADMIN ROUTES
// ======================================================

app.use("/api/admin/accommodations", adminAccommodationRoutes);
app.use("/api/admin/accommodation-units", adminAccommodationUnitRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

// ======================================================
// HANDLE UNKNOWN ENDPOINTS
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// ======================================================
// CENTRAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Request error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected server error occurred."
        : err.message,
  });
});

export default app;
