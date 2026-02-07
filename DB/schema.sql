CREATE DATABASE IF NOT EXISTS jm_comfort
CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- database name
USE jm_comfort;

-- KEEP THE IF NOT EXISTS FOR SAFETY 

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL, -- every project must have a customer (Can have more than one)
  name VARCHAR(50) NOT NULL,
  -- description TEXT, if we want a description 
  status ENUM('planned','in_progress','completed','cancelled') NOT NULL DEFAULT 'planned',
  start_date DATE, end_date DATE,  -- varibales for later 
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (customer_id), INDEX (status),
  CONSTRAINT ftk_projects_customer FOREIGN KEY (customer_id)
    REFERENCES customers(id) ON UPDATE CASCADE ON DELETE RESTRICT
    -- if linked to a current project, can't delete. 
);

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  project_id BIGINT NULL,
  scheduled_at DATETIME NOT NULL,
  status ENUM('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
  -- if we want notes under appointments: notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (customer_id), INDEX (project_id), INDEX (scheduled_at),
  
  CONSTRAINT ftk_appts_customer FOREIGN KEY (customer_id)
    REFERENCES customers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ftk_appts_project FOREIGN KEY (project_id)
    REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL
    -- if linked to an appointment can't delete.
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  project_id BIGINT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (customer_id), INDEX (project_id), INDEX (rating),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT ftk_reviews_customer FOREIGN KEY (customer_id)
   REFERENCES customers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ftk_reviews_project FOREIGN KEY (project_id)
   REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- contact_leads table for storing contact & quote requests
CREATE TABLE IF NOT EXISTS contact_leads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  first_name VARCHAR(50),
  last_name  VARCHAR(50),
  name       VARCHAR(120),
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(50),
  
  lead_type  ENUM('contact','quote') NOT NULL DEFAULT 'contact',
  service_type VARCHAR(80),
  message    TEXT,

  status     ENUM('new','reviewed','closed') NOT NULL DEFAULT 'new',

  dedupe_hash CHAR(64) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX (email),
  INDEX (status),
  INDEX (created_at),
  UNIQUE KEY ux_contact_leads_dedupe (dedupe_hash)
);