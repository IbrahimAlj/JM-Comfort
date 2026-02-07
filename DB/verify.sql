-- COMMANDS TO RUN TO VERIFY TABLES EXISTENCE WHEN NEW USER CONNECTS 

USE jm_comfort;      
SELECT DATABASE();
SHOW TABLES;

-- Verify appointments table structure
DESCRIBE appointments;

-- Verify contact_leads table structure
DESCRIBE contact_leads;

-- Confirm timestamps are being recorded
SELECT id, email, status, created_at, updated_at
FROM contact_leads
ORDER BY created_at DESC
LIMIT 5;

-- Confirm UNIQUE dedupe_hash index exists
SHOW INDEX FROM contact_leads;
