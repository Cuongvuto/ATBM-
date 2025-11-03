// src/pages/AboutPage.jsx
import React from 'react';
import { Container, Box, Typography, Grid, Paper, Button, useTheme } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
    const theme = useTheme();
    const navigate = useNavigate();

    // Hiệu ứng fade-in
    const fadeIn = {
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },
    };

    return (
        <Box sx={{ ...fadeIn }}>
            {/* === Phần Hero Banner === */}
            <Box
                sx={{
                    height: { xs: 250, md: 400 },
                    background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/category_burger.jpg")', // Lấy 1 ảnh làm nền
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    px: 3,
                }}
            >
                <Box>
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        sx={{ fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                    >
                        Về TASTY
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ mt: 1, fontWeight: 300 }}
                    >
                        Hương vị đích thực, Phục vụ tận tâm.
                    </Typography>
                </Box>
            </Box>

            <Container sx={{ py: { xs: 4, md: 8 } }}>
                {/* === Phần Câu chuyện === */}
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Câu chuyện của chúng tôi
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                            Thương hiệu TASTY được thành lập vào năm 2025 với một sứ mệnh đơn giản: mang đến những món ăn nhanh không chỉ tiện lợi mà còn phải **chất lượng** và **ngon miệng**.
                            <br /><br />
                            Chúng tôi tin rằng đồ ăn nhanh không có nghĩa là đồ ăn cẩu thả. Từ chiếc burger bò Mỹ mọng nước đến từng sợi khoai tây chiên giòn rụm, tất cả đều được chúng tôi chuẩn bị từ những nguyên liệu tươi ngon nhất.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper 
                            elevation={6} 
                            sx={{ borderRadius: 4, overflow: 'hidden' }}
                        >
                            <img 
                                src="/category_chicken.jpg" // Lấy 1 ảnh đẹp khác
                                alt="TASTY Burger" 
                                style={{ width: '100%', display: 'block' }} 
                            />
                        </Paper>
                    </Grid>
                </Grid>

                {/* === Phần Cam kết (ĐÃ CẬP NHẬT BỐ CỤC) === */}
                <Box sx={{ my: { xs: 6, md: 10 } }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center' }}>
                        Cam kết của TASTY
                    </Typography>
                    
                    {/* Bọc trong 1 Container con để giới hạn chiều rộng và căn giữa */}
                    <Container maxWidth="md">
                        <Grid container spacing={5} justifyContent="center">
                            
                            {/* Hàng 1: 1 mục (căn giữa) */}
                            <Grid item xs={12} md={7}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <FastfoodIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Nguyên liệu tươi sạch</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Chúng tôi chỉ chọn lựa thực phẩm từ các nhà cung cấp uy tín, đảm bảo độ tươi ngon mỗi ngày.
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Hàng 2: 2 mục */}
                            {/* Mục 2.1 */}
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <HighQualityIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Chất lượng hàng đầu</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Mọi món ăn đều được chế biến theo quy trình nghiêm ngặt, giữ trọn hương vị nguyên bản.
                                    </Typography>
                                </Box>
                            </Grid>
                            
                            {/* Mục 2.2 */}
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <RestaurantMenuIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Phục vụ tận tâm</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Trải nghiệm của bạn là ưu tiên số 1. Chúng tôi luôn lắng nghe để phục vụ bạn tốt hơn.
                                    </Typography>
                                </Box>
                            </Grid>

                        </Grid>
                    </Container>
                </Box>

                {/* === Phần Kêu gọi hành động === */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Bạn đã sẵn sàng thưởng thức chưa?
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={() => navigate('/menu')}
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            '&:hover': { transform: 'scale(1.05)' },
                            py: 1.5,
                            px: 5,
                            fontSize: '1.1rem'
                        }}
                    >
                        Khám phá thực đơn
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default AboutPage;