-- Migration: Create images table for gallery image metadata
-- Run this after the base schema has been applied

USE jm_comfort;

CREATE TABLE IF NOT EXISTS images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  s3_key VARCHAR(500) NOT NULL,
  s3_url TEXT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX (uploaded_at),
  INDEX (is_active)
);
