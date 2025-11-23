// routes/orderRoutes.js
const express = require('express');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');
// const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- USER ROUTES ---
router.route('/').post(createOrder);

// --- ADMIN ROUTES ---
router.route('/').get(getAllOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
