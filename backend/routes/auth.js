const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../config/database');

// Ensure JWT_SECRET is available
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET || 'super_secret_key_12345';
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    console.log('JWT signing with secret:', secret ? 'Secret exists' : 'No secret');
    return secret;
};

// Register user
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { name, email, password, role = 'user' } = req.body;
    console.log(`Registration attempt for email: ${email}`);

    try {
        // Case-insensitive search for email
        let user = await User.findOne({ 
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('email')), 
                sequelize.fn('LOWER', email)
            )
        });
        
        if (user) {
            console.log(`Registration failed: Email ${email} already exists (ID: ${user.id})`);
            return res.status(400).json({ msg: `User with email ${email} already exists` });
        }

        // Create new user
        user = await User.create({
            name,
            email,
            password,
            role
        });
        console.log('User created:', user.toJSON());

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            getJwtSecret(),
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT sign error:', err);
                    throw err;
                }
                res.json({ 
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Registration error:', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ msg: `User with email ${email} already exists` });
        }
        res.status(500).json({ msg: 'Server error during registration' });
    }
});

// Login user
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    try {
        let user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`Login failed: No user found with email ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Login failed: Invalid password for ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log(`Login successful for user: ${email} (ID: ${user.id}, Role: ${user.role})`);
        
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            getJwtSecret(),
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT sign error:', err);
                    throw err;
                }
                res.json({ 
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error during login' });
    }
});

module.exports = router; 