-- Migration 013: availability slots for the Request-a-Quote flow.
-- Admin defines available date/time slots; customers pick one when submitting
-- a quote request; a pending appointment is created automatically.

CREATE TABLE IF NOT EXISTS availability_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  booked_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_slot (slot_date, start_time),
  INDEX idx_slot_date (slot_date),
  INDEX idx_slot_active (is_active)
);
