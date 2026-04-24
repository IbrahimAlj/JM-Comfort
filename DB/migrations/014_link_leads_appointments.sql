-- Migration 014: tie quote leads to the appointment + slot that was chosen.
-- Adds appointment approval fields if they don't already exist, and FK columns
-- linking contact_leads -> availability_slots and appointments -> contact_leads.

ALTER TABLE contact_leads
  ADD COLUMN availability_slot_id BIGINT NULL,
  ADD INDEX idx_lead_slot (availability_slot_id),
  ADD CONSTRAINT fk_lead_slot FOREIGN KEY (availability_slot_id)
    REFERENCES availability_slots(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- Expand appointment status enum + approval bookkeeping (idempotent-ish:
-- running on a DB that already has these will error safely and can be ignored).
ALTER TABLE appointments
  MODIFY COLUMN status ENUM(
    'pending',
    'approved',
    'rejected',
    'scheduled',
    'completed',
    'cancelled',
    'no_show'
  ) NOT NULL DEFAULT 'pending';

ALTER TABLE appointments
  ADD COLUMN approved_by BIGINT NULL AFTER status,
  ADD COLUMN approved_at TIMESTAMP NULL AFTER approved_by,
  ADD COLUMN rejection_reason TEXT NULL AFTER approved_at,
  ADD COLUMN lead_id BIGINT NULL,
  ADD INDEX idx_appt_lead (lead_id),
  ADD CONSTRAINT fk_appt_lead FOREIGN KEY (lead_id)
    REFERENCES contact_leads(id) ON UPDATE CASCADE ON DELETE SET NULL;
