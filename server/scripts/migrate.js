// Migration script to create images table
require('dotenv').config();
const mysql = require('mysql2/promise');

const createImagesTable = `
CREATE TABLE IF NOT EXISTS images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  s3_url TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INT,
  height INT,
  upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(255),
  category ENUM('gallery','installation','repair','maintenance','before_after','testimonial') NOT NULL DEFAULT 'gallery',
  description TEXT,
  alt_text VARCHAR(255),
  project_id BIGINT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX (category),
  INDEX (upload_date),
  INDEX (is_active),
  INDEX (project_id),
  
  CONSTRAINT ftk_images_project FOREIGN KEY (project_id)
    REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL
);
`;

async function runMigration() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'jm_comfort',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected successfully!');
    console.log('Creating images table...');

    await connection.query(createImagesTable);

    console.log(' Images table created successfully!');
    
    // Verify the table was created
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'images'"
    );
    
    if (tables.length > 0) {
      console.log(' Verified: images table exists');
      
      // Show table structure
      const [columns] = await connection.query(
        "DESCRIBE images"
      );
      console.log('\nTable structure:');
      console.table(columns);
    }

  } catch (error) {
    console.error(' Migration failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the migration
runMigration();
