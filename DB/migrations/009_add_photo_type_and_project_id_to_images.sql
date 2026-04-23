-- Migration 009: Add photo_type and project_id to images table
-- Supports before/after photo labeling and project grouping in the gallery

ALTER TABLE images
  ADD COLUMN photo_type ENUM('before', 'after', 'general') NOT NULL DEFAULT 'general',
  ADD COLUMN project_id BIGINT NULL,
  ADD INDEX (project_id),
  ADD INDEX (photo_type),
  ADD CONSTRAINT fk_images_project FOREIGN KEY (project_id)
    REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;
