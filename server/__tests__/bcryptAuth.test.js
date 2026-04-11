const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

describe("Bcrypt Password Hashing", () => {
  const plainPassword = "mySecurePassword123";

  test("bcrypt.hash() produces a hash, not plain text", async () => {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(plainPassword);
    expect(hash.length).toBeGreaterThan(50);
  });

  test("bcrypt.compare() returns true for correct password", async () => {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    const result = await bcrypt.compare(plainPassword, hash);
    expect(result).toBe(true);
  });

  test("bcrypt.compare() returns false for incorrect password", async () => {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    const result = await bcrypt.compare("wrongPassword", hash);
    expect(result).toBe(false);
  });

  test("hash uses salt rounds of 10", async () => {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    expect(hash).toMatch(/^\$2[aby]?\$10\$/);
  });

  test("same password produces different hashes each time", async () => {
    const hash1 = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    const hash2 = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    expect(hash1).not.toBe(hash2);
  });
});