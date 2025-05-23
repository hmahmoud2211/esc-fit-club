const mysql = require('mysql2/promise');

async function createDatabase() {
  // Connection without database name to create the database
  const connection = await mysql.createConnection({
    host: 'esc.cp8w0220u9dr.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'ESCwear2025'
  });

  try {
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    console.log('Creating database so_web...');
    await connection.query('CREATE DATABASE IF NOT EXISTS so_web');
    console.log('Database so_web created or already exists');
    
    // Don't need to use USE command here since Sequelize will handle this
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

createDatabase(); 