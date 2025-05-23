const User = require('../models/User');
require('dotenv').config();
const sequelize = require('../config/database');

async function deleteUserByEmail(email) {
  try {
    await sequelize.sync();
    
    if (!email) {
      console.error('No email provided. Usage: node deleteUser.js email@example.com');
      return;
    }
    
    console.log(`Attempting to delete user with email: ${email}`);
    
    // Find the user first
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return;
    }
    
    // Don't allow deleting the main admin
    if (user.email === 'admin@example.com') {
      console.log('Cannot delete the main admin user!');
      return;
    }
    
    // Delete the user
    await user.destroy();
    console.log(`Successfully deleted user with email: ${email}`);
    
  } catch (err) {
    console.error('Error deleting user:', err);
  } finally {
    await sequelize.close();
  }
}

// Get email from command line argument
const email = process.argv[2];

// Run if executed directly
if (require.main === module) {
  deleteUserByEmail(email)
    .then(() => console.log('User deletion operation completed.'))
    .catch(err => console.error('Error:', err));
}

module.exports = deleteUserByEmail; 