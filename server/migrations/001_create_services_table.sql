-- Migration: Create Services Table
-- Description: Creates the services table for storing HVAC service offerings
-- Date: 2026-02-20

/*
==================================================
Migration: 001_create_services_table.sql
Ticket: JMHABIBI1-171
Description:
Creates the services table and service_features table
for storing HVAC service offerings.

Tables Created:
1. services
   - id (Primary Key)
   - name
   - slug (Unique)
   - short_description
   - full_description
   - price_starting
   - price_description
   - image_url
   - is_active
   - created_at
   - updated_at

2. service_features
   - id (Primary Key)
   - service_id (Foreign Key → services.id)
   - feature_text
   - display_order
   - created_at

Indexes:
- idx_slug
- idx_is_active
- idx_service_id

Relationship:
One-to-many:
One service → Many features

==================================================
*/

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  price_starting DECIMAL(10, 2),
  price_description VARCHAR(255),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active)
);

-- Create service_features table (one-to-many relationship)
CREATE TABLE IF NOT EXISTS service_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  feature_text VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service_id (service_id)
);

-- Insert sample data for testing
INSERT INTO services (name, slug, short_description, full_description, price_starting, price_description, image_url, is_active) 
VALUES 
  ('HVAC Repair', 'hvac-repair', 'Fast and reliable HVAC repair services', 'Our expert technicians provide comprehensive HVAC repair services to get your system running smoothly again.', 89.00, 'Diagnostic fee, repair costs vary based on issue', '/images/hvac-repair.jpg', TRUE),
  ('HVAC Maintenance', 'hvac-maintenance', 'Keep your system running efficiently', 'Regular maintenance is key to extending the life of your HVAC system.', 129.00, 'Annual maintenance plan available', '/images/hvac-maintenance.jpg', TRUE),
  ('HVAC Installation', 'hvac-installation', 'Professional installation of new systems', 'Whether you are building new or replacing an old system, our installation experts will help you.', 3500.00, 'Price varies based on system size and type', '/images/hvac-installation.jpg', TRUE);

-- Insert sample features
INSERT INTO service_features (service_id, feature_text, display_order) 
VALUES 
  (1, 'Emergency 24/7 repair services', 1),
  (1, 'Certified and experienced technicians', 2),
  (1, 'All brands and models serviced', 3),
  (1, 'Same-day service available', 4),
  (1, 'Warranty on all repairs', 5),
  (2, 'Seasonal tune-ups', 1),
  (2, 'Filter replacement', 2),
  (2, 'System efficiency optimization', 3),
  (2, 'Priority scheduling', 4),
  (2, 'Discounts on repairs', 5),
  (3, 'Free in-home consultation', 1),
  (3, 'Energy-efficient system options', 2),
  (3, 'Professional installation', 3),
  (3, 'System warranty included', 4),
  (3, 'Financing options available', 5);