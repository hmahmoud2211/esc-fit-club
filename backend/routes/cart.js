const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get cart items
router.get('/', async (req, res) => {
    try {
        // In a real application, you might want to store cart in the database
        // For now, we'll just return the cart from the session
        res.json(req.session.cart || { items: [], total: 0 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Initialize cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = { items: [], total: 0 };
        }

        // Check if item already exists in cart
        const existingItem = req.session.cart.items.find(
            item => item.product._id.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            req.session.cart.items.push({
                product: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    images: product.images
                },
                quantity
            });
        }

        // Update cart total
        req.session.cart.total = req.session.cart.items.reduce(
            (total, item) => total + (item.product.price * item.quantity),
            0
        );

        res.json(req.session.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update cart item quantity
router.put('/update/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (!req.session.cart) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        const itemIndex = req.session.cart.items.findIndex(
            item => item.product._id.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            req.session.cart.items.splice(itemIndex, 1);
        } else {
            req.session.cart.items[itemIndex].quantity = quantity;
        }

        // Update cart total
        req.session.cart.total = req.session.cart.items.reduce(
            (total, item) => total + (item.product.price * item.quantity),
            0
        );

        res.json(req.session.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        if (!req.session.cart) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        req.session.cart.items = req.session.cart.items.filter(
            item => item.product._id.toString() !== productId
        );

        // Update cart total
        req.session.cart.total = req.session.cart.items.reduce(
            (total, item) => total + (item.product.price * item.quantity),
            0
        );

        res.json(req.session.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Clear cart
router.delete('/clear', async (req, res) => {
    try {
        req.session.cart = { items: [], total: 0 };
        res.json(req.session.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 