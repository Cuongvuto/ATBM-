// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, IconButton, CircularProgress, Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // <-- Khởi tạo navigate

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming your API returns category_name via JOIN
                const response = await apiClient.get('/products');
                setProducts(response.data.data);
            } catch (err) {
                setError('Không thể tải danh sách sản phẩm.');
                console.error("Lỗi tải sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Navigate to the add product page
    const handleAddProduct = () => {
        navigate('/admin/products/add');
    };

    // Navigate to the edit product page
    const handleEditProduct = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    // Placeholder delete logic (replace with API call)
    const handleDeleteProduct = async (id) => {
        console.log('Xóa sản phẩm ID:', id);
        if (window.confirm(`Bạn có chắc muốn xóa sản phẩm ID ${id}?`)) {
            // alert(`Chức năng Xóa sản phẩm ${id} chưa được cài đặt.`); // Remove this placeholder
             try {
                 setLoading(true); // Optional: show loading indicator during delete
                 // **Uncomment and adjust when backend API is ready**
                 // await apiClient.delete(`/products/${id}`);
                 // setProducts(prevProducts => prevProducts.filter(p => p.id !== id)); // Update state after successful delete
                 alert(`(Mô phỏng) Đã xóa sản phẩm ${id}. Cần API backend để xóa thật.`); // Temporary feedback
             } catch (err) {
                 setError('Xóa sản phẩm thất bại.');
                 console.error("Lỗi xóa sản phẩm:", err);
             } finally {
                 setLoading(false); // Stop loading indicator
             }
        }
    };

    // The Admin layout (Sidebar + Main container) is handled by AdminRoute/AdminLayout
    // This component only renders the content *inside* the main area
    return (
        <> {/* Use Fragment as outer container is handled by layout */}
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Danh Sách Sản Phẩm
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Add New Button */}
            <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddProduct} // Correct handler
                sx={{ mb: 3 }}
            >
                Thêm mới
            </Button>

            {/* Products Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2 }}>
                <TableContainer>
                    <Table stickyHeader aria-label="product table">
                        <TableHead>
                             <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: 'grey.200' } }}>
                                <TableCell>ID</TableCell>
                                <TableCell>Mã SP</TableCell>
                                <TableCell>Tên Sản Phẩm</TableCell>
                                <TableCell>Loại Sản Phẩm</TableCell>
                                <TableCell align="right">Đơn Giá (VNĐ)</TableCell>
                                <TableCell>Ghi Chú</TableCell>
                                <TableCell>Hình Ảnh</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        Không có sản phẩm nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow hover key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        {/* Simple generated code */}
                                        <TableCell>SP{String(product.id).padStart(3, '0')}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                                        {/* Ensure API provides category_name */}
                                        <TableCell>{product.category_name || 'N/A'}</TableCell>
                                        <TableCell align="right">{parseInt(product.price).toLocaleString('vi-VN')}</TableCell>
                                        {/* Description with tooltip for overflow */}
                                        <TableCell
                                            sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                                            title={product.description}
                                        >
                                            {product.description}
                                        </TableCell>
                                        {/* Product Image Thumbnail */}
                                        <TableCell>
                                            <Box
                                                component="img"
                                                src={product.image_url || '/placeholder.jpg'}
                                                alt={product.name}
                                                sx={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 1 }}
                                            />
                                        </TableCell>
                                        {/* Action Buttons */}
                                        <TableCell align="center">
                                            <IconButton
                                                color="warning"
                                                size="small"
                                                onClick={() => handleEditProduct(product.id)} // Correct handler
                                                aria-label="edit"
                                            >
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteProduct(product.id)} // Correct handler
                                                aria-label="delete"
                                            >
                                                <DeleteIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                 {/* Consider adding Pagination component here if needed */}
            </Paper>
        </>
    );
}

export default AdminDashboard;