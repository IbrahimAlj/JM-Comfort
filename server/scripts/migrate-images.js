require("dotenv").config({ path: "../../.env" });
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  let connection;

  try {
    console.log("Connecting to database...");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || "jm_comfort",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    console.log("Connected successfully.");

    const sqlPath = path.join(__dirname, "../../DB/migrations/002_create_images_table.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Running images table migration...");
    await connection.query(sql);
    console.log("Images table created successfully.");

    const [tables] = await connection.query("SHOW TABLES LIKE 'images'");
    if (tables.length > 0) {
      console.log("Verified: images table exists.");
    }
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

runMigration();
