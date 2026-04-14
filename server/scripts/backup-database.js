#!/usr/bin/env node

/**
 * Database Backup Script for JM Comfort
 *
 * Creates a SQL backup of the configured database using mysql2.
 * No external MySQL CLI tools required.
 * Backup files are stored in server/scripts/backups/ with timestamp naming.
 *
 * Usage:
 *   node server/scripts/backup-database.js
 *   npm run db:backup  (from server/)
 *
 * Environment variables (from .env):
 *   DB_HOST     - Database host
 *   DB_PORT     - Database port (default: 3306)
 *   DB_NAME     - Database name
 *   DB_USER     - Database user
 *   DB_PASS     - Database password
 *   BACKUP_DIR  - Custom backup directory (optional, defaults to server/scripts/backups)
 *   BACKUP_RETENTION_DAYS - Days to keep old backups (optional, default: 30)
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT || "3306";
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const BACKUP_DIR =
  process.env.BACKUP_DIR || path.resolve(__dirname, "backups");
const BACKUP_RETENTION_DAYS = parseInt(
  process.env.BACKUP_RETENTION_DAYS || "30",
  10
);

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`);
}

function validateConfig() {
  const missing = [];
  if (!DB_HOST) missing.push("DB_HOST");
  if (!DB_NAME) missing.push("DB_NAME");
  if (!DB_USER) missing.push("DB_USER");
  if (!DB_PASS) missing.push("DB_PASS");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Check your .env file or environment configuration."
    );
  }
}

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    log(`Created backup directory: ${BACKUP_DIR}`);
  }
}

function generateBackupFilename() {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");
  return `${DB_NAME}_backup_${timestamp}.sql`;
}

function escapeValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "1" : "0";
  if (val instanceof Date) {
    return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
  }
  if (Buffer.isBuffer(val)) {
    return `X'${val.toString("hex")}'`;
  }
  const escaped = String(val)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
  return `'${escaped}'`;
}

async function dumpDatabase(connection, outputPath) {
  const lines = [];

  lines.push(`-- JM Comfort Database Backup`);
  lines.push(`-- Generated: ${new Date().toISOString()}`);
  lines.push(`-- Database: ${DB_NAME}`);
  lines.push(`-- Host: ${DB_HOST}:${DB_PORT}`);
  lines.push("");
  lines.push(`SET FOREIGN_KEY_CHECKS = 0;`);
  lines.push("");

  // Get all tables
  const [tables] = await connection.query("SHOW TABLES");
  const tableKey = Object.keys(tables[0])[0];
  const tableNames = tables.map((row) => row[tableKey]);

  log(`Found ${tableNames.length} table(s) to back up`);

  for (const tableName of tableNames) {
    log(`  Backing up table: ${tableName}`);

    // Get CREATE TABLE statement
    const [createResult] = await connection.query(
      `SHOW CREATE TABLE \`${tableName}\``
    );
    const createStatement = createResult[0]["Create Table"];

    lines.push(`-- -------------------------------------------`);
    lines.push(`-- Table: ${tableName}`);
    lines.push(`-- -------------------------------------------`);
    lines.push(`DROP TABLE IF EXISTS \`${tableName}\`;`);
    lines.push(`${createStatement};`);
    lines.push("");

    // Get row data
    const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);

    if (rows.length > 0) {
      const columns = Object.keys(rows[0]);
      const columnList = columns.map((c) => `\`${c}\``).join(", ");

      for (const row of rows) {
        const values = columns.map((col) => escapeValue(row[col])).join(", ");
        lines.push(
          `INSERT INTO \`${tableName}\` (${columnList}) VALUES (${values});`
        );
      }
      lines.push("");
      log(`    ${rows.length} row(s) exported`);
    } else {
      lines.push(`-- (empty table)`);
      lines.push("");
      log(`    0 rows (empty table)`);
    }
  }

  lines.push(`SET FOREIGN_KEY_CHECKS = 1;`);
  lines.push("");

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
}

function cleanOldBackups() {
  if (BACKUP_RETENTION_DAYS <= 0) {
    log("Backup retention disabled (BACKUP_RETENTION_DAYS <= 0)");
    return;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - BACKUP_RETENTION_DAYS);

  const files = fs.readdirSync(BACKUP_DIR);
  let removed = 0;

  for (const file of files) {
    if (!file.endsWith(".sql")) continue;

    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);

    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filePath);
      log(`Removed old backup: ${file}`);
      removed++;
    }
  }

  if (removed > 0) {
    log(
      `Cleaned up ${removed} backup(s) older than ${BACKUP_RETENTION_DAYS} days`
    );
  } else {
    log("No old backups to clean up");
  }
}

async function main() {
  log("=== JM Comfort Database Backup ===");

  let connection;
  try {
    validateConfig();
    ensureBackupDir();

    const filename = generateBackupFilename();
    const outputPath = path.join(BACKUP_DIR, filename);

    log(`Connecting to database: ${DB_NAME}`);
    log(`Host: ${DB_HOST}:${DB_PORT}`);

    connection = await mysql.createConnection({
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASS,
      ssl: { rejectUnauthorized: false },
    });

    log("Connected successfully");

    await dumpDatabase(connection, outputPath);

    // Verify the backup file was created and has content
    const stats = fs.statSync(outputPath);
    if (stats.size === 0) {
      throw new Error("Backup file is empty — export may have failed");
    }

    log(`Backup completed successfully: ${filename}`);
    log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Clean up old backups based on retention policy
    cleanOldBackups();

    log("=== Backup finished ===");
  } catch (error) {
    logError(error.message);
    log("=== Backup FAILED ===");
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
