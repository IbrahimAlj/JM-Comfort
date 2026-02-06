-- Migration: Add end_at, notes, and updated_at columns to appointments table
-- Run this if the appointments table already exists from the previous schema

USE jm_comfort;

-- Add end_at column for appointment end time
ALTER TABLE appointments
  ADD COLUMN end_at DATETIME NOT NULL AFTER scheduled_at;

-- Add notes column
ALTER TABLE appointments
  ADD COLUMN notes TEXT AFTER status;

-- Add updated_at column
ALTER TABLE appointments
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Add index on end_at for availability queries
ALTER TABLE appointments
  ADD INDEX (end_at);
