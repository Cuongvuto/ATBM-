// controllers/orderController.js
const db = require('../config/db');

// --- HÀM LẤY TẤT CẢ ĐƠN HÀNG (CHO ADMIN) ---
const getAllOrders = async (req, res) => {
    try {
        const sql = `
            SELECT
                o.id, o.user_id,
                o.shipping_full_name, o.shipping_address, o.shipping_phone,
                o.status, o.items_price, o.shipping_price, o.total_price,
                o.payment_method, o.shipping_method,
                o.is_paid, o.paid_at, o.created_at, o.note,
                u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        const [orders] = await db.query(sql);

        const formattedOrders = orders.map(order => ({
            ...order,
            user_display_name: order.shipping_full_name || order.user_email || 'N/A',
            total_amount: order.total_price
        }));

        res.status(200).json({
            message: 'Lấy danh sách đơn hàng thành công',
            data: formattedOrders
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
    }
};

// --- HÀM TẠO ĐƠN HÀNG ---
const createOrder = async (req, res) => {
    const {
        userId, items,
        shippingAddress, shippingPhone, shippingFullName,
        paymentMethod, shippingMethod,
        itemsPrice, shippingPrice, totalPrice,
        note
     } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Bạn phải đăng nhập để đặt hàng.' });
    }

    if (!items || items.length === 0 || !totalPrice || !shippingAddress || !shippingPhone || !shippingFullName ) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: Sản phẩm, Tổng tiền, Địa chỉ, SĐT, Tên người nhận.' });
    }

    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insert vào bảng orders
        const orderSql = `
            INSERT INTO orders (
                user_id, voucher_id, shipping_full_name, shipping_address, shipping_phone,
                status, items_price, shipping_price, total_price, payment_method, shipping_method,
                is_paid, paid_at, note, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const initialStatus = paymentMethod === 'cod' ? 'processing' : 'pending';
        const isPaid = paymentMethod !== 'cod';
        const paidAt = isPaid ? new Date() : null;
        const voucherId = null;

        const [orderResult] = await connection.query(orderSql, [
            userId, voucherId, shippingFullName, shippingAddress, shippingPhone,
            initialStatus, itemsPrice, shippingPrice, totalPrice, paymentMethod, shippingMethod,
            isPaid ? 1 : 0, paidAt, note
        ]);
        const orderId = orderResult.insertId;

        // 2. Insert vào bảng order_items (ĐÃ SỬA)
         if (items && items.length > 0) {
            // Thêm 'price_at_purchase' vào danh sách cột
            const itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price, price_at_purchase) VALUES ?';
            
            // Thêm item.price vào cả hai cột 'price' và 'price_at_purchase'
            const itemValues = items.map(item => [
                orderId, 
                item.productId, 
                item.quantity, 
                item.price, // Giá trị cho cột 'price'
                item.price  // Giá trị cho cột 'price_at_purchase'
            ]);
            
            // Dòng 92 của bạn
            await connection.query(itemSql, [itemValues]);
         } else {
             await connection.rollback();
             console.warn(`Attempted to create order ${orderId} without items.`);
             return res.status(400).json({ message: 'Đơn hàng phải có ít nhất một sản phẩm.' });
         }

        await connection.commit();

        res.status(201).json({
            message: 'Đặt hàng thành công',
            orderId: orderId,
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Lỗi khi tạo đơn hàng:', error); // Lỗi sẽ được log chi tiết ở đây
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng. Vui lòng thử lại.' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// --- HÀM CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (CHO ADMIN) ---
const updateOrderStatus = async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'failed'];
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: 'Trạng thái cập nhật không hợp lệ.' });
    }

    try {
        const sql = 'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await db.query(sql, [status, orderId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng để cập nhật.' });
        }

        res.status(200).json({ message: `Cập nhật trạng thái đơn hàng ${orderId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${orderId}:`, error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


// --- HÀM LẤY CHI TIẾT ĐƠN HÀNG ---
const getOrderById = async (req, res) => {
    const orderId = req.params.id;
    try {
         const orderSql = `
            SELECT
                o.id, o.user_id,
                o.shipping_full_name, o.shipping_address, o.shipping_phone,
                o.status, o.items_price, o.shipping_price, o.total_price,
                o.payment_method, o.shipping_method,
                o.is_paid, o.paid_at, o.created_at, o.updated_at, o.note,
                u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `;
        const [orderDetails] = await db.query(orderSql, [orderId]);

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
        }

        // Sửa lại để lấy cả 'price' và 'price_at_purchase' nếu cần
        const itemsSql = `
            SELECT oi.product_id, oi.quantity, oi.price, oi.price_at_purchase, p.name as product_name, p.image_url as product_image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;
        const [orderItems] = await db.query(itemsSql, [orderId]);

        res.status(200).json({
            message: 'Lấy chi tiết đơn hàng thành công',
            data: {
                ...orderDetails[0],
                items: orderItems
            }
        });

    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết đơn hàng ${orderId}:`, error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Export các hàm
module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderById
};