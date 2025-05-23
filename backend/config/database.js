const { Sequelize } = require('sequelize');

// Database name - keep existing name
const DB_NAME = process.env.MYSQL_DATABASE || 'so_web';
console.log('Connecting to MySQL database:', DB_NAME);

// Log environment variables
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_DIALECT:', process.env.MYSQL_DIALECT);

// Connect to the RDS database using environment variables with fallbacks
const sequelize = new Sequelize(
    DB_NAME,
    process.env.MYSQL_USER || 'admin',
    process.env.MYSQL_PASSWORD || 'ESCwear2025',
    {
        host: process.env.MYSQL_HOST || 'esc.cp8w0220u9dr.eu-north-1.rds.amazonaws.com',
        dialect: process.env.MYSQL_DIALECT || 'mysql',
        logging: false,
    }
);

module.exports = sequelize; 