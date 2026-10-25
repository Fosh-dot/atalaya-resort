import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Certificate: server/certs/isrgrootx1.pem
const caCertPath = path.resolve(__dirname, "../../certs/isrgrootx1.pem");

// Diagnostic checks
console.log("TiDB host:", process.env.DB_HOST || "(not configured)");
console.log("CA certificate exists:", fs.existsSync(caCertPath));

if (process.env.DB_HOST && !fs.existsSync(caCertPath)) {
  throw new Error(`TiDB CA certificate not found at: ${caCertPath}`);
}

// Load the CA certificate for remote database connections
const sslConfig = process.env.DB_HOST
  ? {
      ca: fs.readFileSync(caCertPath, "utf8"),
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "atalaya",
  user: process.env.DB_USER || "atalaya_app",
  password: process.env.DB_PASSWORD,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  charset: "utf8mb4",
});

export async function checkDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.query("SELECT 1");
    return true;
  } finally {
    connection.release();
  }
}

export default pool;
