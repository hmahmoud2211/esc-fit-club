const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Failed to load products', error: err.message });
    }
});

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Failed to load product', error: err.message });
    }
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
    try {
        console.log('Create product request from user:', req.user ? req.user.email : 'unknown');
        console.log('User role:', req.user ? req.user.role : 'unknown');
        console.log('Product data:', req.body);
        
        // Check if user exists and has admin role
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Admin role required.' });
        }

        const product = await Product.create(req.body);
        console.log('Product created:', product.id);
        res.status(201).json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(400).json({ message: 'Failed to save product', error: err.message });
    }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user exists and has admin role
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Admin role required.' });
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        await product.update(req.body);
        res.json(product);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ message: 'Failed to update product', error: err.message });
    }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user exists and has admin role
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Admin role required.' });
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(400).json({ message: 'Failed to delete product', error: err.message });
    }
});

module.exports = router; 