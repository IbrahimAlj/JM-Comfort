USE jm_comfort;

CREATE TABLE IF NOT EXISTS contact_leads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  name VARCHAR(200),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  lead_type VARCHAR(50) DEFAULT 'contact',
  service_type VARCHAR(100),
  message TEXT,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  dedupe_hash VARCHAR(64) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_lead_type (lead_type),
  INDEX idx_created_at (created_at)
);
