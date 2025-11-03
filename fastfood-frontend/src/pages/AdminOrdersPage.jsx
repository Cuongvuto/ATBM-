// src/pages/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, IconButton, CircularProgress, Alert, Chip,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote'; // Icon for updating status
import apiClient from '../api/axiosConfig';

// Hàm để lấy màu sắc chip dựa trên trạng thái
const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
        case 'processing':
            return 'warning';
        case 'paid':
        case 'shipped':
            return 'info';
        case 'delivered':
        case 'completed':
            return 'success';
        case 'cancelled':
        case 'failed':
            return 'error';
        default:
            return 'default';
    }
};

// Hàm để hiển thị tên trạng thái dễ đọc
const getStatusDisplayName = (status) => {
    const statusMap = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        paid: 'Đã thanh toán',
        shipped: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy',
        failed: 'Thất bại',
    };
    return statusMap[status?.toLowerCase()] || status || 'Không rõ';
};


function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm fetch đơn hàng
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            
            const response = await apiClient.get('/orders'); // Endpoint lấy danh sách đơn hàng
            setOrders(response.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách đơn hàng.');
            console.error("Lỗi tải đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewDetails = (id) => {
        // TODO: Chuyển hướng hoặc mở modal xem chi tiết đơn hàng
        alert(`Xem chi tiết đơn hàng ID: ${id} (chưa cài đặt)`);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        // TODO: Gọi API backend để cập nhật trạng thái đơn hàng
        console.log(`Cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}`);
        try {
            
            await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
            alert(` Đã cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}. `);
            // Fetch lại danh sách đơn hàng sau khi cập nhật thành công
            fetchOrders();
        } catch (err) {
             console.error("Lỗi cập nhật trạng thái:", err);
             alert('Cập nhật trạng thái thất bại.');
        }
    };

    return (
        <> {/* Chỉ cần Fragment vì Box layout đã có ở AdminLayout */}
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quản Lý Đơn Hàng
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2 }}>
                <TableContainer>
                    <Table stickyHeader aria-label="orders table">
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: 'grey.200' } }}>
                                <TableCell>ID Đơn Hàng</TableCell>
                                <TableCell>Người Đặt</TableCell> {/* Cần join bảng users */}
                                <TableCell>Ngày Đặt</TableCell>
                                <TableCell align="right">Tổng Tiền (VNĐ)</TableCell>
                                <TableCell>Trạng Thái</TableCell>
                                <TableCell align="center">Cập nhật TT</TableCell>
                                <TableCell align="center">Chi Tiết</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}>Không có đơn hàng nào.</TableCell></TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow hover key={order.id}>
                                        <TableCell sx={{ fontWeight: 500 }}>#{order.id}</TableCell>
                                        <TableCell>{order.user_name || order.user_email || 'Khách vãng lai'}</TableCell> {/* Hiển thị tên hoặc email */}
                                        <TableCell>{new Date(order.created_at).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell align="right">{parseInt(order.total_amount).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusDisplayName(order.status)}
                                                color={getStatusChipColor(order.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                         <TableCell align="center">
                                            {/* Select để đổi trạng thái */}
                                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                                {/* <InputLabel>Đổi TT</InputLabel> */}
                                                <Select
                                                    value={order.status || ''}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Update Status' }}
                                                >
                                                     {/* Các lựa chọn trạng thái */}
                                                     <MenuItem value="pending">Chờ xử lý</MenuItem>
                                                     <MenuItem value="processing">Đang xử lý</MenuItem>
                                                     <MenuItem value="shipped">Đang giao</MenuItem>
                                                     <MenuItem value="delivered">Đã giao</MenuItem>
                                                     <MenuItem value="completed">Hoàn thành</MenuItem>
                                                     <MenuItem value="cancelled">Đã hủy</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton color="info" size="small" onClick={() => handleViewDetails(order.id)}>
                                                <VisibilityIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                 {/* Có thể thêm phân trang (Pagination) ở đây nếu cần */}
            </Paper>
        </>
    );
}

export default AdminOrdersPage;