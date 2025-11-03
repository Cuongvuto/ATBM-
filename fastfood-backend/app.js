// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// === 1. IMPORT ROUTES ===
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// === 2. MIDDLEWARES ===
app.use(cors());
app.use(express.json());
// Dòng này sẽ làm cho thư mục 'public' có thể truy cập được từ trình duyệt
app.use(express.static('public'));

// === 3. ROUTES ===
app.get('/', (req, res) => {
  res.send('API đang chạy...');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/users', userRoutes);

// === 4. MIDDLEWARE XỬ LÝ LỖI ===
// Middleware xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
    const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Chỉ hiển thị stack trace khi ở môi trường development (nếu muốn)
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;