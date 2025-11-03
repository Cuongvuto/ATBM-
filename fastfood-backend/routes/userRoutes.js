// fastfood-backend/routes/userRoutes.js
const express = require('express');
const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Cần middleware

const router = express.Router();

// Các route này cần được bảo vệ và chỉ admin mới được truy cập

// Route GET /api/users (Lấy danh sách users)
router.route('/').get(/*protect, admin,*/ getAllUsers);

// Route PUT /api/users/:id/role (Cập nhật role)
router.route('/:id/role').put(/*protect, admin,*/ updateUserRole);

// Route DELETE /api/users/:id (Xóa user)
router.route('/:id').delete(/*protect, admin,*/ deleteUser);

module.exports = router;