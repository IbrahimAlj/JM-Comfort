-- Migration 007: Add preferred_date, preferred_time_slot, and address to contact_leads
-- Supports quote form submissions with scheduling preferences and address

ALTER TABLE contact_leads
  ADD COLUMN preferred_date DATE NULL,
  ADD COLUMN preferred_time_slot VARCHAR(50) NULL,
  ADD COLUMN address VARCHAR(255) NULL;
