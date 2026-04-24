-- Migration 012: Add zip column to contact_leads
-- Quote form captures ZIP separately from street address.

ALTER TABLE contact_leads
  ADD COLUMN IF NOT EXISTS zip VARCHAR(10) NULL AFTER address;
