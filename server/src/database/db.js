import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "atalaya_resort",
  user: process.env.DB_USER || "atalaya_app",
  password: process.env.DB_PASSWORD,
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
