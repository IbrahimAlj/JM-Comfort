const { sanitizeInput, isValidEmail, formatDate } = require("../utils/helpers");

describe("sanitizeInput", () => {
  test("strips HTML tags from string", () => {
    expect(sanitizeInput("<script>alert('xss')</script>hello")).toBe("&lt;script&gt;alert('xss')&lt;/script&gt;hello");
  });

  test("handles null input", () => {
    expect(sanitizeInput(null)).toBe("");
  });

  test("handles undefined input", () => {
    expect(sanitizeInput(undefined)).toBe("");
  });

  test("preserves valid text", () => {
    expect(sanitizeInput("Hello World")).toBe("Hello World");
  });

  test("trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  test("returns non-string values as-is", () => {
    expect(sanitizeInput(42)).toBe(42);
    expect(sanitizeInput(true)).toBe(true);
  });
});

describe("isValidEmail", () => {
  test("accepts valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  test("accepts email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  test("rejects email without @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  test("rejects email without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  test("rejects email without extension", () => {
    expect(isValidEmail("user@example")).toBe(false);
  });

  test("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("rejects null", () => {
    expect(isValidEmail(null)).toBe(false);
  });

  test("rejects undefined", () => {
    expect(isValidEmail(undefined)).toBe(false);
  });

  test("rejects email with spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
  });
});

describe("formatDate", () => {
  test("formats a valid date string", () => {
    expect(formatDate("2026-04-10")).toBe("2026-04-10");
  });

  test("formats a Date object", () => {
    expect(formatDate(new Date("2026-01-15"))).toBe("2026-01-15");
  });

  test("handles leap year date", () => {
    expect(formatDate("2024-02-29")).toBe("2024-02-29");
  });

  test("returns null for invalid date", () => {
    expect(formatDate("not-a-date")).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(formatDate("")).toBeNull();
  });

  test("handles epoch timestamp", () => {
    expect(formatDate(0)).toBe("1970-01-01");
  });
});