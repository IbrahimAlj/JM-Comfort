-- Migration 006: Add reviewer_name and reviewer_email columns to reviews table
-- Allows public review submission without requiring a customer account

ALTER TABLE reviews MODIFY COLUMN customer_id BIGINT NULL;

ALTER TABLE reviews
  ADD COLUMN reviewer_name VARCHAR(100) NULL AFTER customer_id,
  ADD COLUMN reviewer_email VARCHAR(100) NULL AFTER reviewer_name;
