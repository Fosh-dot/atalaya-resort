import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pool from "../database/db.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

dotenv.config();

const rl = readline.createInterface({ input, output });

async function createAdmin() {
  try {
    const [existingAdmins] = await pool.execute(
      "SELECT COUNT(*) AS total FROM admins",
    );

    if (Number(existingAdmins[0].total) > 0) {
      console.log("An administrator already exists. Setup is disabled.");
      return;
    }

    const name = (
      await rl.question("Administrator full name: ")
    ).trim();

    const email = (
      await rl.question("Administrator email: ")
    ).trim().toLowerCase();

    const password = await rl.question(
      "Create administrator password (minimum 12 characters): ",
    );

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid name and email address.");
    }

    if (password.length < 12) {
      throw new Error("Password must contain at least 12 characters.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.execute(
      `INSERT INTO admins
        (full_name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, 'admin', TRUE)`,
      [name, email, passwordHash],
    );

    console.log("\nAdministrator created successfully!");
    console.log(`Login email: ${email}`);
    console.log("Keep your password private.");
  } catch (error) {
    console.error("\nAdministrator setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await pool.end();
  }
}

await createAdmin();