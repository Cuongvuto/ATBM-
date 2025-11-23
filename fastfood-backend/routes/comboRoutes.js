// fastfood-backend/routes/comboRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllCombos,
    getAllCombosAdmin,
    getComboById,
    createCombo,
    updateCombo,
    deleteCombo
} = require('../controllers/comboController');

// const { protect, admin } = require('../middleware/authMiddleware'); // Sẽ dùng sau

// === ADMIN ROUTES (Các route cụ thể phải đặt trước) ===
// GET /api/combos/admin
router.route('/admin')
    .get(getAllCombosAdmin); // <-- ĐÃ ĐƯỢC CHUYỂN LÊN TRÊN

// === PUBLIC & ADMIN ROUTES ===

// GET (Public) và POST (Admin) cho /api/combos
router.route('/')
    .get(getAllCombos)
    .post(createCombo); // (Tạm thời chưa bảo vệ)

// GET (Public), PUT (Admin), DELETE (Admin) cho /api/combos/:id
router.route('/:id')
    .get(getComboById)
    .put(updateCombo)     // (Tạm thời chưa bảo vệ)
    .delete(deleteCombo); // (Tạm thời chưa bảo vệ)

module.exports = router;