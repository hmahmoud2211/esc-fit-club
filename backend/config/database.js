const { Sequelize } = require('sequelize');

const DB_NAME = 'so_web'; // Change this to your desired database name if needed
console.log('Connecting to MySQL database:', DB_NAME);

console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_DIALECT:', process.env.MYSQL_DIALECT);

const sequelize = new Sequelize(
    DB_NAME,         // database name
    'root',           // username
    'Hazem@2003',     // password
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

module.exports = sequelize; 