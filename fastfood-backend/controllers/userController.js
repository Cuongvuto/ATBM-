// fastfood-backend/controllers/userController.js
const db = require('../config/db');

// --- HÀM LẤY TẤT CẢ NGƯỜI DÙNG (CHO ADMIN) ---
const getAllUsers = async (req, res) => {
    try {
        // Sử dụng đúng tên cột 'full_name'
        const sql = 'SELECT id, full_name, email, role, created_at FROM users ORDER BY id ASC'; // <-- SỬA Ở ĐÂY
        const [users] = await db.query(sql);

        // Map dữ liệu để cung cấp trường 'name' nhất quán cho frontend
        const formattedUsers = users.map(user => ({
            ...user,
            // Sử dụng đúng tên cột 'full_name'
            name: user.full_name // <-- SỬA Ở ĐÂY
        }));

        res.status(200).json({
            message: 'Lấy danh sách người dùng thành công',
            data: formattedUsers // Gửi dữ liệu đã format
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
    }
};

// --- HÀM CẬP NHẬT VAI TRÒ NGƯỜI DÙNG (CHO ADMIN) ---
const updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    // Kiểm tra giá trị role hợp lệ
    if (!role || (role !== 'admin' && role !== 'user')) {
        return res.status(400).json({ message: 'Vai trò cập nhật không hợp lệ (chỉ chấp nhận "admin" hoặc "user").' });
    }

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
        }

        // Cập nhật role và updated_at
        const sql = 'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?'; // <-- Thêm updated_at
        const [result] = await db.query(sql, [role, userId]);

        res.status(200).json({ message: `Cập nhật vai trò người dùng ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi cập nhật vai trò người dùng ${userId}:`, error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- HÀM XÓA NGƯỜI DÙNG (CHO ADMIN - CẨN THẬN!) ---
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Kiểm tra user tồn tại
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại để xóa.' });
        }

        const sql = 'DELETE FROM users WHERE id = ?';
        await db.query(sql, [userId]);

        res.status(200).json({ message: `Xóa người dùng ID ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi xóa người dùng ID ${userId}:`, error);
        // Xử lý lỗi khóa ngoại (nếu user có đơn hàng...)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ message: 'Không thể xóa người dùng này vì họ có dữ liệu liên quan (ví dụ: đơn hàng).' });
        }
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Export các hàm
module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
};