import React, { useState } from 'react';
import {
    Card, CardMedia, CardContent, Typography, Box, Button, IconButton, Stack,
    useTheme, Tooltip, Badge, Skeleton, CircularProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon cho giá
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import Link

function ProductCard({ product }) {
    const theme = useTheme();
    const [quantity, setQuantity] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false); // Cho skeleton
    const [adding, setAdding] = useState(false); // Loading cho button
    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        setAdding(true);
        try {
            // Giả sử addToCart trả về Promise (nếu có)
            await addToCart(product, quantity);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ:", error);
        } finally {
            // Dùng setTimeout nhỏ để tạo cảm giác loading
            setTimeout(() => setAdding(false), 300);
        }
    };

    const handleQuantityChange = (delta) => {
        setQuantity(q => Math.max(1, q + delta));
    };

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
        return null; // Hoặc trả về một Skeleton Card
    }

    return (
        <Badge
            badgeContent={product.is_hot ? "Hot" : null} // Đã sửa thành is_hot
            color="error"
            sx={{ width: '100%' }}
        >
            <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 380, md: 400 }, // Tăng chiều cao một chút
                borderRadius: '24px', // Bo góc lớn hơn
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)', // Shadow nhẹ
                border: `1px solid ${theme.palette.grey[200]}`, // Border mỏng
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`, // Gradient nền nhẹ
                transition: 'all 0.4s ease-in-out', // Transition mượt
                overflow: 'hidden', // Để overlay không tràn
                '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)', // Nổi lên mạnh hơn
                    boxShadow: `0 16px 48px ${theme.palette.primary.main}20`, // Glow với màu primary
                    borderColor: theme.palette.primary.main, // Border highlight
                },
                position: 'relative',
            }}>

                {/* 2. THÊM COMPONENT={LINK} VÀ TO={...} VÀO ĐÂY */}
                <Box
                    component={Link} // Làm cho Box hoạt động như Link
                    to={`/product/${product.id}`} // Đường dẫn đến trang chi tiết
                    sx={{
                        position: 'relative',
                        height: 200,
                        overflow: 'hidden',
                        display: 'block' // Cần thiết cho Link hoạt động đúng
                    }}>
                    {!imageLoaded && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            sx={{
                                animation: 'shimmer 1.5s infinite linear',
                                '@keyframes shimmer': {
                                    '0%': { backgroundPosition: '-200px 0' },
                                    '100%': { backgroundPosition: '200px 0' },
                                    background: `linear-gradient(90deg, ${theme.palette.grey[300]} 25%, ${theme.palette.grey[100]} 50%, ${theme.palette.grey[300]} 75%)`,
                                    backgroundSize: '200px 100%',
                                },
                            }}
                        />
                    )}
                    <CardMedia
                        component="img"
                        image={product.image_url}
                        alt={`Hình ảnh sản phẩm ${product.name}`}
                        onLoad={() => setImageLoaded(true)}
                        sx={{
                            height: '100%',
                            // width: '100%', // Đã bỏ
                            objectFit: 'cover', // <-- GIẢI PHÁP VÀNG
                            objectPosition: 'center', // <-- Căn giữa ảnh
                            transition: 'transform 0.4s ease-in-out',
                            '&:hover': { transform: 'scale(1.1)' }, // Zoom ảnh
                            display: imageLoaded ? 'block' : 'none', // Ẩn khi chưa load
                        }}
                    />
                </Box>

                {/* Nội dung card */}
                <CardContent sx={{
                    textAlign: 'center',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 3, // Padding lớn hơn
                    position: 'relative',
                    zIndex: 2,
                }}>
                    <Box>
                        <Tooltip title={product.description || product.name} arrow>
                            {/* 3. THÊM COMPONENT={LINK} VÀ TO={...} VÀO ĐÂY */}
                            <Typography
                                component={Link} // Làm Typography hoạt động như Link
                                to={`/product/${product.id}`} // Đường dẫn đến trang chi tiết
                                gutterBottom
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary', // Màu chữ link
                                    textDecoration: 'none', // Bỏ gạch chân
                                    '&:hover': {
                                        color: 'primary.main', // Đổi màu khi hover
                                    },
                                    // Chống tràn văn bản
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block', // Cần thiết cho Link hoạt động đúng
                                }}
                            >
                                {product.name}
                            </Typography>
                        </Tooltip>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <AttachMoneyIcon sx={{ color: theme.palette.primary.main, fontSize: '1.2rem' }} />
                            <Typography
                                variant="h5"
                                color="primary"
                                sx={{
                                    fontWeight: 'bold',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                }}
                            >
                                {parseInt(product.price).toLocaleString('vi-VN')} VNĐ
                            </Typography>
                        </Stack>
                    </Box>

                    <Box>
                        {/* Bộ điều khiển số lượng đẹp hơn */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                            sx={{
                                mb: 3,
                                p: 1,
                                borderRadius: 2,
                                bgcolor: theme.palette.grey[100],
                                border: `1px solid ${theme.palette.grey[300]}`,
                            }}
                        >
                            <IconButton
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity === 1}
                                size="small"
                                sx={{
                                    color: quantity === 1 ? theme.palette.grey[400] : theme.palette.primary.main,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover:not(:disabled)': {
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        transform: 'scale(1.1)',
                                    },
                                    '&:active': { transform: 'scale(0.95)' }, // Bounce effect
                                }}
                                aria-label="Giảm số lượng"
                            >
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                sx={{
                                    minWidth: '40px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {quantity}
                            </Typography>
                            <IconButton
                                onClick={() => handleQuantityChange(1)}
                                size="small"
                                sx={{
                                    color: theme.palette.primary.main,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        transform: 'scale(1.1)',
                                    },
                                    '&:active': { transform: 'scale(0.95)' },
                                }}
                                aria-label="Tăng số lượng"
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Stack>

                        {/* Nút thêm vào giỏ với gradient và loading */}
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleAddToCart}
                            disabled={adding}
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                py: 1.5,
                                transition: 'all 0.3s ease-in-out',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                },
                                '&:active': { transform: 'scale(0.98)' },
                                '&:disabled': { opacity: 0.6 },
                            }}
                            aria-label="Thêm vào giỏ hàng"
                        >
                            {adding ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Thêm vào giỏ'
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Badge>
    );
}

export default ProductCard;