'use strict';

/**
 * JMHABIBI-245 — Password Migration Script
 *
 * One-time script to hash any existing plain-text admin passwords
 * in the database.  Safe to run multiple times (idempotent).
 *
 * Usage:
 *   node scripts/migrate-passwords.js            # live run
 *   node scripts/migrate-passwords.js --dry-run  # preview only, no DB writes
 */

const bcryptjs = require('bcryptjs');
const mysql    = require('mysql2/promise');
require('dotenv').config();

const SALT_ROUNDS = 10;

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the value looks like a bcrypt hash.
 * bcrypt hashes start with "$2b$" or "$2a$" followed by the cost factor.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[ab]\$\d{2}\$/.test(value);
}

// ── Core migration ───────────────────────────────────────────────────────────

/**
 * Read all admin users, hash any plain-text passwords, and update the DB.
 *
 * @param {import('mysql2/promise').Pool} pool  - mysql2 connection pool
 * @param {{ dryRun?: boolean }} [options]
 * @returns {Promise<{ migrated: number, skipped: number }>}
 */
async function migratePasswords(pool, { dryRun = false } = {}) {
  if (dryRun) {
    console.log('[DRY RUN] No changes will be made to the database.\n');
  }

  const [admins] = await pool.query(
    'SELECT id, username, password FROM admins'
  );

  let migrated = 0;
  let skipped  = 0;

  for (const admin of admins) {
    if (isBcryptHash(admin.password)) {
      console.log(`Skipped   ${admin.username} - already hashed`);
      skipped++;
    } else {
      if (!dryRun) {
        const hash = await bcryptjs.hash(admin.password, SALT_ROUNDS);
        await pool.query(
          'UPDATE admins SET password = ? WHERE id = ?',
          [hash, admin.id]
        );
        console.log(`Migrated  ${admin.username}`);
      } else {
        console.log(`[DRY RUN] Would migrate ${admin.username}`);
      }
      migrated++;
    }
  }

  console.log('\nMigration Summary:');
  console.log(`  Migrated : ${migrated}`);
  console.log(`  Skipped  : ${skipped}`);

  return { migrated, skipped };
}

module.exports = { isBcryptHash, migratePasswords };

// ── Entry point (only runs when executed directly) ────────────────────────────

if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');

  const pool = mysql.createPool({
    host:             process.env.DB_HOST,
    port:             Number(process.env.DB_PORT) || 3306,
    database:         process.env.DB_NAME,
    user:             process.env.DB_USER,
    password:         process.env.DB_PASS || process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit:  10,
    queueLimit:       0,
  });

  migratePasswords(pool, { dryRun })
    .then(() => pool.end())
    .catch(err => {
      console.error('Migration failed:', err.message);
      process.exit(1);
    });
}
