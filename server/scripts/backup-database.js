#!/usr/bin/env node

/**
 * Database Backup Script for JM Comfort
 *
 * Creates a mysqldump backup of the configured database.
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

const { execFile } = require("child_process");
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

function runMysqldump(outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      `--host=${DB_HOST}`,
      `--port=${DB_PORT}`,
      `--user=${DB_USER}`,
      "--single-transaction",
      "--routines",
      "--triggers",
      `--result-file=${outputPath}`,
      DB_NAME,
    ];

    const env = { ...process.env, MYSQL_PWD: DB_PASS };

    log(`Starting mysqldump for database: ${DB_NAME}`);
    log(`Host: ${DB_HOST}:${DB_PORT}`);
    log(`Output: ${outputPath}`);

    execFile("mysqldump", args, { env }, (error, stdout, stderr) => {
      if (error) {
        reject(
          new Error(`mysqldump failed: ${error.message}\nStderr: ${stderr}`)
        );
        return;
      }
      if (stderr && !stderr.includes("Warning")) {
        log(`mysqldump stderr: ${stderr}`);
      }
      resolve(outputPath);
    });
  });
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
    log(`Cleaned up ${removed} backup(s) older than ${BACKUP_RETENTION_DAYS} days`);
  } else {
    log("No old backups to clean up");
  }
}

async function main() {
  log("=== JM Comfort Database Backup ===");

  try {
    validateConfig();
    ensureBackupDir();

    const filename = generateBackupFilename();
    const outputPath = path.join(BACKUP_DIR, filename);

    await runMysqldump(outputPath);

    // Verify the backup file was created and has content
    const stats = fs.statSync(outputPath);
    if (stats.size === 0) {
      throw new Error("Backup file is empty — mysqldump may have failed silently");
    }

    log(`Backup completed successfully: ${filename}`);
    log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Clean up old backups based on retention policy
    cleanOldBackups();

    log("=== Backup finished ===");
    process.exit(0);
  } catch (error) {
    logError(error.message);
    log("=== Backup FAILED ===");
    process.exit(1);
  }
}

main();
