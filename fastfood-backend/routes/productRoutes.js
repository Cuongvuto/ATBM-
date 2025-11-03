// routes/productRoutes.js
const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
// Giả sử bạn có middleware để xác thực admin (cần tạo sau)
// const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Route lấy danh sách sản phẩm (công khai) và tạo sản phẩm (admin)
router.route('/')
    .get(getAllProducts)
    // .post(protect, admin, createProduct); // Cần middleware protect và admin
    .post(createProduct); // Tạm thời cho phép tạo mà không cần xác thực admin

// Route lấy, cập nhật, xóa sản phẩm theo ID (lấy: công khai, sửa/xóa: admin)
router.route('/:id')
    .get(getProductById)
    // .put(protect, admin, updateProduct) // Cần middleware protect và admin
    .put(updateProduct) // Tạm thời cho phép sửa mà không cần xác thực admin
    // .delete(protect, admin, deleteProduct); // Cần middleware protect và admin
    .delete(deleteProduct); // Tạm thời cho phép xóa mà không cần xác thực admin

module.exports = router;