'use strict';

/**
 * JMHABIBI-245 — Jest tests for migrate-passwords.js
 *
 * All tests use mock DB data — no real database connection is made.
 * bcryptjs.hash is mocked so tests run fast and deterministically.
 */

// Mock bcryptjs before the module under test is loaded.
// hash() returns a predictable fake bcrypt-formatted string.
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue(
    '$2b$10$mockhashresult0000000000000000000000000000000000000000'
  ),
}));

const bcryptjs              = require('bcryptjs');
const { isBcryptHash, migratePasswords } = require('./migrate-passwords');

// ── Test helper ───────────────────────────────────────────────────────────────

/**
 * Build a minimal fake mysql2 pool.
 * SELECT queries return the provided rows array.
 * UPDATE queries return a success result without touching a real DB.
 *
 * @param {object[]} rows  - fake admin rows (id, username, password)
 */
function makePool(rows) {
  return {
    query: jest.fn((sql, _params) => {
      if (/^\s*SELECT/i.test(sql)) {
        // mysql2 returns [rows, fields]; we only need the rows element
        return Promise.resolve([rows]);
      }
      // UPDATE / other DML
      return Promise.resolve([{ affectedRows: 1 }]);
    }),
  };
}

// ── isBcryptHash ─────────────────────────────────────────────────────────────

describe('isBcryptHash', () => {
  test('returns true for a valid $2b$ prefixed hash', () => {
    expect(
      isBcryptHash('$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
    ).toBe(true);
  });

  test('returns true for a valid $2a$ prefixed hash', () => {
    expect(
      isBcryptHash('$2a$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012')
    ).toBe(true);
  });

  test('returns false for a plain-text password', () => {
    expect(isBcryptHash('password123')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(isBcryptHash('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(isBcryptHash(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isBcryptHash(undefined)).toBe(false);
  });

  test('returns false for a number', () => {
    expect(isBcryptHash(12345)).toBe(false);
  });
});

// ── migratePasswords ─────────────────────────────────────────────────────────

describe('migratePasswords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Test 1: plain-text password is detected and hashed ────────────────────

  test('plain-text password is detected and hashed in the DB', async () => {
    const rows = [{ id: 1, username: 'admin', password: 'plaintext123' }];
    const pool = makePool(rows);

    const result = await migratePasswords(pool);

    // Return values
    expect(result.migrated).toBe(1);
    expect(result.skipped).toBe(0);

    // bcryptjs.hash should have been called with the original plain-text value
    expect(bcryptjs.hash).toHaveBeenCalledTimes(1);
    expect(bcryptjs.hash).toHaveBeenCalledWith('plaintext123', 10);

    // Two DB queries: SELECT then UPDATE
    expect(pool.query).toHaveBeenCalledTimes(2);

    const [updateSql, updateParams] = pool.query.mock.calls[1];
    expect(updateSql).toMatch(/UPDATE admins SET password/i);
    // The value written to the DB should look like a bcrypt hash
    expect(isBcryptHash(updateParams[0])).toBe(true);
    // The row id should be passed correctly
    expect(updateParams[1]).toBe(1);
  });

  // ── Test 2: already-hashed password is skipped ────────────────────────────

  test('already-hashed password is skipped — not double-hashed', async () => {
    const existingHash =
      '$2b$10$existinghashvalue000000000000000000000000000000000000';
    const rows = [{ id: 1, username: 'admin', password: existingHash }];
    const pool = makePool(rows);

    const result = await migratePasswords(pool);

    expect(result.migrated).toBe(0);
    expect(result.skipped).toBe(1);

    // bcryptjs.hash must NOT have been called
    expect(bcryptjs.hash).not.toHaveBeenCalled();

    // Only the SELECT query — no UPDATE
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toMatch(/^\s*SELECT/i);
  });

  // ── Test 3: dry-run makes NO DB writes ────────────────────────────────────

  test('dry-run flag prevents any DB writes', async () => {
    const rows = [
      { id: 1, username: 'alice', password: 'plaintextAlice' },
      { id: 2, username: 'bob',   password: 'plaintextBob'   },
    ];
    const pool = makePool(rows);

    const result = await migratePasswords(pool, { dryRun: true });

    // Both admins are counted as "would be migrated"
    expect(result.migrated).toBe(2);
    expect(result.skipped).toBe(0);

    // No hashing in dry-run
    expect(bcryptjs.hash).not.toHaveBeenCalled();

    // Only the SELECT — zero UPDATE calls
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toMatch(/^\s*SELECT/i);
  });

  // ── Test 4: summary counts are correct ────────────────────────────────────

  test('summary returns correct migrated and skipped counts', async () => {
    const existingHash =
      '$2b$10$existinghashvalue000000000000000000000000000000000000';
    const rows = [
      { id: 1, username: 'plain1',  password: 'plaintextOne' },
      { id: 2, username: 'plain2',  password: 'plaintextTwo' },
      { id: 3, username: 'hashed1', password: existingHash   },
    ];
    const pool = makePool(rows);

    const result = await migratePasswords(pool);

    expect(result.migrated).toBe(2);
    expect(result.skipped).toBe(1);
  });
});
