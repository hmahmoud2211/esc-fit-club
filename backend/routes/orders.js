const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const orders = await Order.findAll();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get orders for current user
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.user.id } });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const order = await Order.create({
            userId: req.user.id,
            ...req.body
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create order', error: err.message });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is admin or order owner
        if (order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order status (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        await order.update(req.body);
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update order', error: err.message });
    }
});

// Delete order (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        await order.destroy();
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to delete order', error: err.message });
    }
});

module.exports = router; 