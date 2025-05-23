const User = require('./models/User');
require('dotenv').config();
const sequelize = require('./config/database');

const createAdmin = async () => {
    try {
        await sequelize.sync();
        // Check if admin already exists
        let admin = await User.findOne({ where: { email: 'admin@example.com' } });
        if (admin) {
            console.log('Admin user already exists, updating password...');
            admin.password = 'admin123'; // This will be hashed by the hook
            admin.role = 'admin';
            await admin.save();
            console.log('Admin user password updated!');
        } else {
            // Create admin user
            admin = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123', // This will be hashed by the hook
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }
        console.log('Admin credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('You can now log in with these credentials');
    } catch (err) {
        console.error('Error creating admin user:', err);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

// Run if this file is executed directly
if (require.main === module) {
    createAdmin();
}

module.exports = createAdmin; 