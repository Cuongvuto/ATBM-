// routes/orderRoutes.js
const express = require('express');
const {
    createOrder,
    getAllOrders,      // <-- Import function to get all orders
    getOrderById,      // <-- Import function to get order by ID
    updateOrderStatus  // <-- Import function to update status
} = require('../controllers/orderController');
// Import middleware for protecting routes and checking admin status (create these later)
// const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- USER ROUTES ---
// POST /api/orders : Create a new order (requires user to be logged in)
// router.route('/').post(protect, createOrder); // Use protect middleware later
router.route('/').post(createOrder); // Temporarily allow without login for testing

// --- ADMIN ROUTES ---
// GET /api/orders : Get all orders (requires admin)
// router.route('/').get(protect, admin, getAllOrders); // Use protect & admin middleware later
router.route('/').get(getAllOrders); // Temporarily allow without admin check for testing

// GET /api/orders/:id : Get single order details (requires admin or the user who owns the order)
// router.route('/:id').get(protect, getOrderById); // Use protect middleware later
router.route('/:id').get(getOrderById); // Temporarily allow without login for testing

// PUT /api/orders/:id/status : Update order status (requires admin)
// router.route('/:id/status').put(protect, admin, updateOrderStatus); // Use protect & admin middleware later
router.route('/:id/status').put(updateOrderStatus); // Temporarily allow without admin check for testing


module.exports = router;