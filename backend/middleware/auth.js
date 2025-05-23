const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ensure JWT_SECRET is available
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET || 'super_secret_key_12345';
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    console.log('JWT verification attempt with secret:', secret ? 'Secret exists' : 'No secret');
    return secret;
};

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        
        if (!token) {
            console.log('Authorization header missing or empty');
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }
        
        // Verify token using consistent secret
        const decoded = jwt.verify(token, getJwtSecret());
        console.log('JWT decoded:', decoded);
        
        if (!decoded.user || !decoded.user.id) {
            console.log('JWT missing user data:', decoded);
            return res.status(401).json({ message: 'Invalid token format' });
        }
        
        // Find user using Sequelize
        const user = await User.findByPk(decoded.user.id);
        
        if (!user) {
            console.log('User not found for id:', decoded.user.id);
            return res.status(401).json({ message: 'User not found' });
        }

        console.log('User authenticated:', user.email, 'Role:', user.role);
        
        // Add user to request object
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        
        // Provide more specific error messages
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        
        res.status(401).json({ message: 'Authentication failed', error: err.message });
    }
};

module.exports = auth; 