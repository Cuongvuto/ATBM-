// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Stack } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// 1. Import thêm useLocation
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { cartItems } = useCart();
    const { isLoggedIn, logout } = useAuth();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const navigate = useNavigate();
    const location = useLocation(); // 2. Lấy thông tin vị trí (URL) hiện tại

    // 3. Tạo hàm xử lý khi bấm vào icon giỏ hàng
    const handleCartClick = () => {
        if (isLoggedIn) {
            navigate('/cart');
        } else {
            navigate('/login');
        }
    };

    // 4. Hàm helper để xác định style (in đậm/mờ)
    const getLinkStyle = (path) => {
        const currentPath = location.pathname;

        // Kiểu style khi link được active (in đậm)
        const activeStyle = {
            color: 'text.primary',
            fontWeight: 600
        };
        // Kiểu style khi link không active
        const inactiveStyle = {
            color: 'text.secondary'
        };

        // Trường hợp đặc biệt cho Home: phải khớp chính xác
        if (path === '/') {
            return currentPath === '/' ? activeStyle : inactiveStyle;
        }
        
        // Các link khác: chỉ cần URL "bắt đầu bằng" (để /menu/burger vẫn highlight /menu)
        return currentPath.startsWith(path) ? activeStyle : inactiveStyle;
    };

    return (
        <AppBar position="sticky" sx={{ bgcolor: 'white', px: { xs: 2, md: 10 } }}>
            <Toolbar sx={{ py: 2 }}>
                <Typography variant="h5" component={RouterLink} to="/" sx={{ flexGrow: 1, fontWeight: 'bold', textDecoration: 'none', color: 'text.primary' }}>
                    TASTY
                </Typography>
                <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                    
                    {/* 5. Áp dụng hàm getLinkStyle vào các nút */}
                    <Button component={RouterLink} to="/" sx={getLinkStyle('/')}>
                        Home
                    </Button>
                    <Button component={RouterLink} to="/menu" sx={getLinkStyle('/menu')}>
                        Menu
                    </Button>
                    <Button component={RouterLink} to="/about" sx={getLinkStyle('/about')}>
                        About Us
                    </Button>
                    
                    <IconButton onClick={handleCartClick} sx={{ color: 'text.primary' }}>
                        <Badge badgeContent={totalItems} color="primary">
                            <ShoppingCartOutlinedIcon />
                        </Badge>
                    </IconButton>
                </Stack>
                <Box sx={{ ml: 3 }}>
                    {isLoggedIn ? (
                        <Button variant="contained" onClick={logout}>
                            Logout
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={1.5}>
                            <Button variant="outlined" component={RouterLink} to="/login">
                                Login
                            </Button>
                            <Button variant="contained" component={RouterLink} to="/register">
                                Sign Up
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;