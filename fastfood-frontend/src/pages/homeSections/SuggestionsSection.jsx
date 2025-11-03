// src/pages/homeSections/SuggestionsSection.jsx
import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import apiClient from '../../api/axiosConfig';
import { Container, Typography, Box, CircularProgress, Alert, IconButton, useTheme } from '@mui/material';
import ProductCard from '../../components/ProductCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// === COMPONENT MŨI TÊN TÙY CHỈNH ===
function NextArrow(props) {
    const { className, style, onClick } = props;
    const theme = useTheme();
    return (
        <IconButton
            onClick={onClick}
            aria-label="Next slide"
            sx={{
                position: 'absolute',
                top: '50%',
                right: -30, // Tăng khoảng cách để không che
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                color: theme.palette.primary.main,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Shadow nhẹ hơn
                borderRadius: '50%', // Làm tròn
                width: 50,
                height: 50,
                transition: 'all 0.3s ease-in-out',
                '&:hover': { 
                    bgcolor: theme.palette.primary.main, 
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)', // Scale nhẹ khi hover
                }
            }}
        >
            <ArrowForwardIosIcon fontSize="medium" />
        </IconButton>
    );
}

function PrevArrow(props) {
    const { className, style, onClick } = props;
    const theme = useTheme();
    return (
        <IconButton
            onClick={onClick}
            aria-label="Previous slide"
            sx={{
                position: 'absolute',
                top: '50%',
                left: -30, // Tăng khoảng cách
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                color: theme.palette.primary.main,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderRadius: '50%',
                width: 50,
                height: 50,
                transition: 'all 0.3s ease-in-out',
                '&:hover': { 
                    bgcolor: theme.palette.primary.main, 
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)',
                }
            }}
        >
            <ArrowBackIosNewIcon fontSize="medium" />
        </IconButton>
    );
}
// ===================================

function SuggestionsSection() {
    const theme = useTheme();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cập nhật cấu hình Slider để dùng mũi tên tùy chỉnh
    const settings = {
        dots: true,
        infinite: products.length > 4, // Chỉ lặp lại nếu có đủ sản phẩm
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />, // Sử dụng component mũi tên mới
        prevArrow: <PrevArrow />, // Sử dụng component mũi tên mới
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 900, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } }
        ],
        appendDots: dots => (
            <Box sx={{ 
                bottom: -50, // Tăng khoảng cách dưới
                textAlign: 'center',
                '& .slick-dots li button:before': {
                    color: theme.palette.grey[400], // Màu dots nhẹ
                    opacity: 0.7,
                },
                '& .slick-dots li.slick-active button:before': {
                    color: theme.palette.primary.main, // Màu active
                    opacity: 1,
                },
            }}>
                <ul style={{ margin: 0, padding: 0 }}> {dots} </ul>
            </Box>
        ),
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // === THAY ĐỔI 1: GỌI API LẤY SẢN PHẨM HOT ===
                const response = await apiClient.get('/products?is_hot=true');
                // === THAY ĐỔI 2: KHÔNG CẦN DÙNG SLICE NỮA ===
                setProducts(response.data.data); 
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            my: 8, 
            minHeight: 200,
            bgcolor: theme.palette.grey[50], // Nền nhẹ
            borderRadius: 2,
        }}>
            <CircularProgress color="primary" size={60} />
        </Box>
    );
    if (error) return (
        <Container sx={{ my: 8 }}>
            <Alert 
                severity="error" 
                sx={{ 
                    textAlign: 'center', 
                    borderRadius: 2, 
                    boxShadow: 2,
                }}
            >
                {error}
            </Alert>
        </Container>
    );

    // Thêm một kiểm tra nếu không có sản phẩm Hot nào
    if (products.length === 0) {
        return (
            <Container sx={{ my: 8 }}>
                <Typography variant="h6" align="center" color="text.secondary">
                    Hiện chưa có sản phẩm "Hot" nào được đề xuất.
                </Typography>
            </Container>
        );
    }

    return (
        <Container 
            sx={{ 
                my: { xs: 6, md: 10 }, 
                px: { xs: 2, md: 4 },
                animation: 'fadeIn 0.8s ease-in-out', // Fade-in animation
                '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {/* Tiêu đề với gradient và mô tả */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                    variant="h3" 
                    component="h2" 
                    sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, // Gradient nhẹ
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    }}
                >
                    Our Suggestions
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: theme.palette.text.secondary, 
                        maxWidth: 600, 
                        mx: 'auto',
                        fontSize: '1.1rem',
                    }}
                >
                    Discover our handpicked favorites – fresh, delicious, and perfect for any craving!
                </Typography>
            </Box>
            
            {/* Slider container với nền và shadow */}
            <Box sx={{ 
                px: { xs: 2, md: 6 }, // Padding lớn hơn để mũi tên không che
                py: 4,
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', // Shadow nhẹ
                position: 'relative',
            }}>
                <Slider {...settings}>
                    {products.map((product) => (
                        <Box 
                            key={product.id} 
                            sx={{ 
                                p: 2, 
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' }, // Hover lift cho cards
                            }}
                        >
                            <ProductCard product={product} />
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Container>
    );
}

export default SuggestionsSection;