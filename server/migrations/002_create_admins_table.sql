-- Migration: Create Admins Table
-- Description: Creates the admins table for secure admin user management
-- Date: 2026-04-10
-- Ticket: JMHABIBI-243 / JMHABIBI-244 / JMHABIBI-245

/*
==================================================
Migration: 002_create_admins_table.sql
Ticket: JMHABIBI-243
Description:
Creates the admins table for storing admin user credentials.
Passwords are stored as bcrypt hashes (cost factor 10).
The migrate-passwords.js script handles migrating any
existing plain-text passwords to bcrypt hashes.

Table Created:
1. admins
   - id            (Primary Key, auto-increment)
   - username      (Unique, max 50 chars)
   - email         (Unique, max 100 chars)
   - password      (VARCHAR 255 — bcrypt hash)
   - created_at
   - updated_at
==================================================
*/

CREATE TABLE IF NOT EXISTS admins (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email    (email)
);
