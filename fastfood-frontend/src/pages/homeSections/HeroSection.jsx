// src/pages/homeSections/HeroSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container } from '@mui/material';

function HeroSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault(); // Ngăn form gửi đi và tải lại trang
        if (searchTerm.trim()) {
            // Chuyển hướng đến trang menu với query tìm kiếm
            navigate(`/menu?search=${searchTerm.trim()}`);
        }
    };

    return (
        <Box
            sx={{
                height: { xs: 450, md: 550 }, // Chiều cao của banner
                // Ảnh nền với một lớp phủ màu đen mờ
                background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/salad_hero.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white', // Màu chữ chung là màu trắng
                textAlign: 'center',
                px: 3, // Padding hai bên
                // Hiệu ứng fade-in khi tải
                animation: 'fadeIn 1.5s ease-in-out',
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            }}
        >
            {/* Dùng Container để giới hạn chiều rộng của nội dung bên trong */}
            <Container maxWidth="md">
                <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 'bold', 
                        lineHeight: 1.2,
                        textShadow: '2px 2px 8px rgba(0,0,0,0.7)' // Thêm bóng cho chữ
                    }}
                >
                    Meat, Eat & Enjoy <br /> the true taste
                </Typography>
                <Typography 
                    sx={{ 
                        my: 4, 
                        color: 'white', 
                        opacity: 0.9, 
                        maxWidth: '500px', 
                        mx: 'auto' // Căn giữa
                    }}
                >
                    Khám phá hương vị đích thực từ những nguyên liệu tươi ngon nhất.
                </Typography>
                
                {/* Form tìm kiếm */}
                <Box 
                    component="form" 
                    onSubmit={handleSearch} 
                    sx={{ 
                        position: 'relative', 
                        maxWidth: '600px', // Giới hạn chiều rộng
                        width: '100%',
                        mx: 'auto', // Tự động căn giữa
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Tìm kiếm món ăn..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                pr: '130px', 
                                bgcolor: 'white', // <-- Nền trắng cho ô input
                                color: 'black',
                                '& fieldset': {
                                    borderColor: 'transparent', // Ẩn viền
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    borderWidth: '2px',
                                },
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'text.secondary',
                                opacity: 1,
                            }
                        }}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ 
                            position: 'absolute', 
                            right: 8, 
                            top: '50%',
                            transform: 'translateY(-50%)', // Căn giữa nút theo chiều dọc
                            height: 'calc(100% - 16px)', // Làm nút cao bằng ô input
                            borderRadius: '50px', // Bo tròn
                        }}
                    >
                        Order Now
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default HeroSection;