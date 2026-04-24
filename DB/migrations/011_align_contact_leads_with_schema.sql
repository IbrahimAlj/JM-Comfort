-- Migration 011: Align contact_leads with application expectations
-- Adds columns referenced by leads route (message, status, source, dedupe_hash,
-- preferred_date, preferred_time_slot) and relaxes NOT NULL on identity fields
-- so quote/contact submissions without every name field succeed.

ALTER TABLE contact_leads
  ADD COLUMN IF NOT EXISTS message TEXT NULL,
  ADD COLUMN IF NOT EXISTS status ENUM('new','reviewed','closed') NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS source VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS preferred_date DATE NULL,
  ADD COLUMN IF NOT EXISTS preferred_time_slot VARCHAR(50) NULL,
  ADD COLUMN IF NOT EXISTS dedupe_hash CHAR(64) NULL;

UPDATE contact_leads
  SET dedupe_hash = SHA2(CONCAT(IFNULL(email,''), IFNULL(phone,''), id), 256)
  WHERE dedupe_hash IS NULL;

ALTER TABLE contact_leads
  MODIFY COLUMN dedupe_hash CHAR(64) NOT NULL,
  MODIFY COLUMN first_name VARCHAR(50) NULL,
  MODIFY COLUMN last_name  VARCHAR(50) NULL,
  MODIFY COLUMN name       VARCHAR(120) NULL,
  MODIFY COLUMN phone      VARCHAR(50) NULL,
  MODIFY COLUMN service_type VARCHAR(80) NULL,
  MODIFY COLUMN address    VARCHAR(255) NULL;

ALTER TABLE contact_leads
  ADD UNIQUE KEY ux_contact_leads_dedupe (dedupe_hash),
  ADD INDEX idx_contact_leads_status (status);
