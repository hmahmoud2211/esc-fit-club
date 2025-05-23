const User = require('../models/User');
require('dotenv').config();
const sequelize = require('../config/database');

async function listAllUsers() {
  try {
    await sequelize.sync();
    
    console.log('Connecting to database to check users...');
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    
    console.log('\n===== EXISTING USERS IN DATABASE =====');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
    
    console.log('\n===== CHECK SPECIFIC EMAIL =====');
    const emailToCheck = process.argv[2]; // Get email from command line argument
    
    if (emailToCheck) {
      const existingUser = await User.findOne({ 
        where: { email: emailToCheck },
        attributes: ['id', 'name', 'email', 'role', 'createdAt']
      });
      
      if (existingUser) {
        console.log(`User with email "${emailToCheck}" FOUND in database:`);
        console.log(existingUser.toJSON());
      } else {
        console.log(`User with email "${emailToCheck}" NOT FOUND in database.`);
        console.log('You should be able to register with this email.');
      }
    } else {
      console.log('No email provided to check. Run with: node checkUsers.js your.email@example.com');
    }
    
  } catch (err) {
    console.error('Error checking users:', err);
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  listAllUsers()
    .then(() => console.log('Done checking users.'))
    .catch(err => console.error('Error:', err));
}

module.exports = listAllUsers; 