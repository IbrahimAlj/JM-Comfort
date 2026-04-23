-- Migration 008: Add address column to customers table

ALTER TABLE customers
  ADD COLUMN address VARCHAR(255) NULL;
