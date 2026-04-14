-- Migration: Create UAT Feedback Table
-- Description: Creates the uat_feedback table for storing client review feedback during UAT
-- Date: 2026-03-20

/*
==================================================
Migration: 002_create_uat_feedback_table.sql
Ticket: JMHABIBI-208
Description:
Creates the uat_feedback table for storing client
feedback submissions collected during user acceptance testing.

Tables Created:
1. uat_feedback
   - id (Primary Key)
   - feedback_text (required)
   - created_at

Indexes:
- idx_uat_feedback_created_at

==================================================
*/

CREATE TABLE IF NOT EXISTS uat_feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  feedback_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uat_feedback_created_at (created_at)
);
