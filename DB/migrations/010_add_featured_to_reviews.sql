-- Migration 010: Add featured flag to reviews for homepage testimonials
-- Admin can mark up to 3 reviews as featured; HeroBanner renders these.

ALTER TABLE reviews
  ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE AFTER published;

CREATE INDEX idx_reviews_featured ON reviews (featured);
