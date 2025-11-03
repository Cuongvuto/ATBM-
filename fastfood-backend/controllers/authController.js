// fastfood-backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- HÀM ĐĂNG KÝ ---
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body; // Lấy fullName

    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: họ tên, email, mật khẩu.' });
    }

    try {
        // Kiểm tra email tồn tại
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email đã được đăng ký.' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới (sử dụng cột 'full_name' và 'password_hash')
        const sql = 'INSERT INTO users (full_name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())'; // Sử dụng password_hash
        const defaultRole = 'user';
        const [result] = await db.query(sql, [fullName, email, hashedPassword, defaultRole]);
        const newUserId = result.insertId;

        // Tạo JWT
        const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Lấy lại thông tin user vừa tạo
        const [newUser] = await db.query('SELECT id, full_name, email, role FROM users WHERE id = ?', [newUserId]);

        // Trả về kết quả
        res.status(201).json({
            message: 'Đăng ký thành công',
            token,
            data: newUser[0]
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
};

// --- HÀM ĐĂNG NHẬP (ĐÃ CẬP NHẬT) ---
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
    }

    try {
        // Lấy user bao gồm cả cột password_hash
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        const user = users[0];

        // Kiểm tra xem cột password_hash có giá trị không
        if (!user.password_hash) { // <-- KIỂM TRA TÊN CỘT ĐÚNG
             console.error(`Lỗi: User ${email} không có password_hash trong database.`);
             return res.status(500).json({ message: 'Lỗi cấu hình tài khoản.' });
        }

        // So sánh mật khẩu nhập vào với cột password_hash
        const isMatch = await bcrypt.compare(password, user.password_hash); // <-- SỬ DỤNG TÊN CỘT ĐÚNG
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Trả về response
        res.json({
            message: 'Đăng nhập thành công',
            token,
            data: {
                id: user.id,
                full_name: user.full_name, // Dùng full_name
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
};

// --- HÀM LẤY THÔNG TIN USER HIỆN TẠI (SAU KHI ĐÃ XÁC THỰC) ---
const getUserProfile = async (req, res) => {
    // req.user được cung cấp bởi middleware 'protect'
    if (req.user) {
        // req.user chứa { id, full_name, email, role }
        res.status(200).json({
            message: 'Lấy thông tin người dùng thành công',
            data: req.user
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }
};

// Export các hàm
module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};