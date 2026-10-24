import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");

const { checkDatabaseConnection, default: pool } =
  await import("./database/db.js");

const PORT = Number(process.env.PORT || 5000);

let server;

async function startServer() {
  try {
    await checkDatabaseConnection();

    console.log("MySQL database connection successful.");

    server = app.listen(PORT, () => {
      console.log(`Atalaya API running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start the API:", error.message);

    process.exitCode = 1;
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  } else {
    await pool.end();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

await startServer();
