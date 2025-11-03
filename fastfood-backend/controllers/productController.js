// controllers/productController.js
const db = require('../config/db');

// === LẤY DANH SÁCH SẢN PHẨM ===
const getAllProducts = async (req, res) => {
    try {
        const { category, search, is_hot, include_unavailable } = req.query; // Thêm include_unavailable

        let sql = `
            SELECT
                p.id, p.name, p.description, p.price, p.image_url,
                p.category_id, p.is_available, p.is_hot,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        const params = [];
        let conditions = [];

        // Bỏ lọc is_available=TRUE mặc định
        // Chỉ lọc nếu không có yêu cầu xem cả sản phẩm ẩn (từ admin)
        if (include_unavailable !== 'true') {
            conditions.push('p.is_available = TRUE');
        }

        // Lọc theo danh mục
        if (category) {
            conditions.push('c.slug = ?');
            params.push(category);
        }

        // Lọc theo tìm kiếm
        if (search) {
            conditions.push('p.name LIKE ?');
            params.push(`%${search}%`);
        }

        // Lọc sản phẩm Hot
        if (is_hot === 'true') {
            conditions.push('p.is_hot = TRUE');
        }

        // Nối các điều kiện
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        // Thêm sắp xếp
        sql += ' ORDER BY p.id ASC';

        const [products] = await db.query(sql, params);

        res.status(200).json({
            message: 'Lấy danh sách sản phẩm thành công',
            data: products
        });

    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// === LẤY SẢN PHẨM THEO ID ===
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        // Thêm JOIN để lấy category_name
        const sql = `
            SELECT
                p.id, p.name, p.description, p.price, p.image_url,
                p.category_id, p.is_available, p.is_hot,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [products] = await db.query(sql, [productId]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json({ message: 'Lấy sản phẩm thành công', data: products[0] });
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// === TẠO SẢN PHẨM MỚI ===
const createProduct = async (req, res) => {
    // Thêm is_available và is_hot từ req.body
    const { name, description, price, category_id, image_url, is_available = true, is_hot = false } = req.body;

    // Validate dữ liệu cơ bản (có thể thêm validate chi tiết hơn)
    if (!name || !price || !category_id || !image_url) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: tên, giá, danh mục, hình ảnh.' });
    }

    try {
        // Thêm is_available, is_hot vào câu lệnh INSERT
        const sql = `
            INSERT INTO products
            (name, description, price, category_id, image_url, is_available, is_hot)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        // Đảm bảo giá trị boolean được chuyển đổi đúng (MySQL thường dùng 1/0)
        const params = [
            name, description, price, category_id, image_url,
            is_available ? 1 : 0, // Chuyển boolean sang 1/0
            is_hot ? 1 : 0         // Chuyển boolean sang 1/0
        ];
        const [result] = await db.query(sql, params);

        // Lấy lại sản phẩm vừa tạo để trả về (bao gồm cả category name)
        const [newProduct] = await db.query(`
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Tạo sản phẩm thành công',
            data: newProduct[0] // Trả về thông tin sản phẩm đầy đủ
        });
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// === CẬP NHẬT SẢN PHẨM ===
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    // Lấy tất cả các trường có thể cập nhật từ body
    const { name, description, price, category_id, image_url, is_available, is_hot } = req.body;

    // Validate dữ liệu cơ bản
    if (!name || price === undefined || category_id === undefined || !image_url) {
         return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: tên, giá, danh mục, hình ảnh.' });
    }

    try {
        // Kiểm tra sản phẩm có tồn tại không
        const [existing] = await db.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại để cập nhật.' });
        }

        const sql = `
            UPDATE products SET
                name = ?,
                description = ?,
                price = ?,
                category_id = ?,
                image_url = ?,
                is_available = ?,
                is_hot = ?
            WHERE id = ?
        `;
         // Đảm bảo giá trị boolean được chuyển đổi đúng
        const params = [
            name, description, price, category_id, image_url,
            is_available ? 1 : 0,
            is_hot ? 1 : 0,
            productId
        ];
        await db.query(sql, params);

         // Lấy lại sản phẩm vừa cập nhật để trả về
        const [updatedProduct] = await db.query(`
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?`,
            [productId]
        );

        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct[0]
        });
    } catch (error) {
        console.error(`Lỗi khi cập nhật sản phẩm ID ${productId}:`, error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// === XÓA SẢN PHẨM ===
const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        // Kiểm tra sản phẩm có tồn tại không
        const [existing] = await db.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại để xóa.' });
        }

        const sql = 'DELETE FROM products WHERE id = ?';
        await db.query(sql, [productId]);

        res.status(200).json({ message: `Xóa sản phẩm ID ${productId} thành công` });
        // Hoặc trả về status 204 No Content nếu không cần message
        // res.status(204).send();
    } catch (error) {
        console.error(`Lỗi khi xóa sản phẩm ID ${productId}:`, error);
        // Xử lý lỗi khóa ngoại nếu có (ví dụ: sản phẩm nằm trong đơn hàng)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') { // Mã lỗi khóa ngoại MySQL
             return res.status(400).json({ message: 'Không thể xóa sản phẩm vì nó đang tồn tại trong đơn hàng hoặc bảng khác.' });
        }
        res.status(500).json({ message: 'Lỗi server' });
    }
};


// Xuất các hàm controller
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct, // Thêm hàm mới
    deleteProduct  // Thêm hàm mới
};