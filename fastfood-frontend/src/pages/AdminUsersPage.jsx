// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, IconButton, CircularProgress, Alert, Chip, Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon for adding user (optional)
import apiClient from '../api/axiosConfig';

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm fetch users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // **API BACKEND CẦN CÓ:** GET /api/users (chỉ admin mới được gọi)
            const response = await apiClient.get('/users'); // Endpoint lấy danh sách users
            setUsers(response.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách người dùng.');
            console.error("Lỗi tải người dùng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditUser = (id) => {
        // TODO: Chuyển hướng hoặc mở modal sửa thông tin user (ví dụ: đổi role)
        alert(`Sửa người dùng ID: ${id} (chưa cài đặt)`);
    };

     const handleToggleAdmin = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        console.log(`Đổi quyền user ${id} thành ${newRole}`);
        try {
            // **API BACKEND CẦN CÓ:** PUT /api/users/:id/role { role: newRole }
            // await apiClient.put(`/users/${id}/role`, { role: newRole });
             alert(`(Mô phỏng) Đổi quyền user ${id} thành ${newRole}. Cần API backend.`);
            // Fetch lại danh sách user sau khi cập nhật
            fetchUsers();
        } catch (err) {
            console.error("Lỗi đổi quyền user:", err);
            alert('Đổi quyền thất bại.');
        }
    };

    const handleDeleteUser = async (id) => {
        // TODO: Gọi API xóa user (cẩn thận!)
        console.log('Xóa người dùng ID:', id);
        if (window.confirm(`Bạn có chắc muốn xóa người dùng ID ${id}? Hành động này không thể hoàn tác!`)) {
            try {
              
                await apiClient.delete(`/users/${id}`);
                 alert(` Đã xóa người dùng ${id}`);
                 // Fetch lại danh sách user
                 fetchUsers();
            } catch (err) {
                console.error("Lỗi xóa user:", err);
                alert('Xóa người dùng thất bại.');
            }
        }
    };

     const handleAddUser = () => {
        // TODO: Chuyển hướng hoặc mở modal thêm người dùng mới
        alert('Thêm người dùng mới (chưa cài đặt)');
    };

    return (
        <> {/* Chỉ cần Fragment */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                 <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                    Quản Lý Người Dùng
                </Typography>
                 {/* <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddUser}
                >
                    Thêm Người Dùng
                </Button> */}
            </Box>


            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2 }}>
                <TableContainer>
                    <Table stickyHeader aria-label="users table">
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: 'grey.200' } }}>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell align="center">Cấp quyền Admin</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
                            ) : users.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Không có người dùng nào.</TableCell></TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow hover key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role === 'admin' ? 'Admin' : 'User'}
                                                color={user.role === 'admin' ? 'error' : 'success'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch
                                                checked={user.role === 'admin'}
                                                onChange={() => handleToggleAdmin(user.id, user.role)}
                                                color="error" // Màu đỏ cho quyền admin
                                                // disabled={user.email === 'adminvuto@gmail.com'} // Tùy chọn: Không cho thay đổi quyền của super admin
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {/* <IconButton color="warning" size="small" onClick={() => handleEditUser(user.id)}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton> */}
                                             {/* Cẩn thận khi thêm nút xóa user */}
                                            <IconButton color="error" size="small" onClick={() => handleDeleteUser(user.id)}>
                                                <DeleteIcon fontSize="small"/>
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

export default AdminUsersPage;