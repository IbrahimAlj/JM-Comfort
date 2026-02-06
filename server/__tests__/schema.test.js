const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "..", "DB", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

describe("Appointments table schema", () => {
  test("appointments table exists in schema", () => {
    expect(schema).toContain("CREATE TABLE IF NOT EXISTS appointments");
  });

  test("has id primary key", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    expect(tableMatch).not.toBeNull();
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("id BIGINT PRIMARY KEY AUTO_INCREMENT");
  });

  test("has customer_id foreign key", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("customer_id BIGINT NOT NULL");
    expect(tableBody).toContain("CONSTRAINT ftk_appts_customer FOREIGN KEY (customer_id)");
    expect(tableBody).toContain("REFERENCES customers(id)");
  });

  test("has project_id foreign key (nullable)", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("project_id BIGINT NULL");
    expect(tableBody).toContain("CONSTRAINT ftk_appts_project FOREIGN KEY (project_id)");
    expect(tableBody).toContain("REFERENCES projects(id)");
  });

  test("has scheduled_at datetime", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("scheduled_at DATETIME NOT NULL");
  });

  test("has end_at datetime", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("end_at DATETIME NOT NULL");
  });

  test("has status enum with correct values", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("status ENUM('scheduled','completed','cancelled','no_show')");
  });

  test("has notes text column", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("notes TEXT");
  });

  test("has created_at and updated_at timestamps", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
    expect(tableBody).toContain("updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
  });

  test("has appropriate indexes", () => {
    const tableMatch = schema.match(
      /CREATE TABLE IF NOT EXISTS appointments\s*\(([\s\S]*?)\);/
    );
    const tableBody = tableMatch[1];
    expect(tableBody).toContain("INDEX (customer_id)");
    expect(tableBody).toContain("INDEX (project_id)");
    expect(tableBody).toContain("INDEX (scheduled_at)");
    expect(tableBody).toContain("INDEX (end_at)");
  });
});

describe("Migration file", () => {
  const migrationPath = path.join(
    __dirname, "..", "..", "DB", "migrations", "001_add_appointments_columns.sql"
  );

  test("migration file exists", () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
  });

  test("migration adds end_at column", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");
    expect(migration).toContain("ADD COLUMN end_at DATETIME NOT NULL");
  });

  test("migration adds notes column", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");
    expect(migration).toContain("ADD COLUMN notes TEXT");
  });

  test("migration adds updated_at column", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");
    expect(migration).toContain("ADD COLUMN updated_at TIMESTAMP");
  });

  test("migration adds end_at index", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");
    expect(migration).toContain("ADD INDEX (end_at)");
  });
});
