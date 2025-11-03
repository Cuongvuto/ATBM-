// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Stack, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)', // Gradient nền hiện đại, từ xám tối sang đen nhạt
                color: '#F9FAFB', // Màu chữ sáng hơn để tương phản tốt
                py: 8, // Tăng padding dọc cho không gian rộng rãi
                mt: 12, // Khoảng cách lớn hơn với nội dung trên
                position: 'relative',
                overflow: 'hidden', // Để tránh overflow nếu thêm hiệu ứng
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.02)', // Lớp overlay tinh tế để làm nổi bật
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6}> {/* Tăng spacing giữa các cột */}
                    {/* Cột 1: Tên thương hiệu & Giới thiệu */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography 
                            variant="h4" // Tăng size cho tiêu đề nổi bật hơn
                            sx={{ 
                                fontWeight: 700, // Bold hơn
                                mb: 3, 
                                color: '#FFFFFF', // Trắng hoàn toàn cho brand name
                                textTransform: 'uppercase', // Thêm style uppercase để mạnh mẽ
                                letterSpacing: 1.5,
                            }}
                        >
                            TASTY
                        </Typography>
                        <Typography 
                            variant="body1" // Tăng size body text một chút
                            sx={{ 
                                color: '#D1D5DB', 
                                lineHeight: 1.6, // Cải thiện readability
                            }}
                        >
                            Mang đến những bữa ăn ngon miệng từ nguyên liệu tươi sạch. Cam kết chất lượng và dịch vụ hàng đầu cho mọi khách hàng.
                        </Typography>
                    </Grid>

                    {/* Cột 2: Các liên kết (Khám phá) */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 3, 
                                color: '#FFFFFF', 
                                fontWeight: 600,
                            }}
                        >
                            Khám phá
                        </Typography>
                        <Stack spacing={2}>
                            <Link 
                                href="/menu" 
                                color="inherit" 
                                underline="none" // Loại underline mặc định, thêm hover
                                sx={{ 
                                    color: '#E5E7EB', 
                                    transition: 'all 0.3s ease', // Transition mượt mà
                                    '&:hover': { 
                                        color: '#FFFFFF', 
                                        transform: 'translateX(5px)', // Slide nhẹ khi hover
                                    },
                                }}
                            >
                                Thực đơn
                            </Link>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="none"
                                sx={{ 
                                    color: '#E5E7EB', 
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        color: '#FFFFFF', 
                                        transform: 'translateX(5px)',
                                    },
                                }}
                            >
                                Khuyến mãi
                            </Link>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="none"
                                sx={{ 
                                    color: '#E5E7EB', 
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        color: '#FFFFFF', 
                                        transform: 'translateX(5px)',
                                    },
                                }}
                            >
                                Về chúng tôi
                            </Link>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="none"
                                sx={{ 
                                    color: '#E5E7EB', 
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        color: '#FFFFFF', 
                                        transform: 'translateX(5px)',
                                    },
                                }}
                            >
                                Tuyển dụng
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Cột 3: Liên hệ */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 3, 
                                color: '#FFFFFF', 
                                fontWeight: 600,
                            }}
                        >
                            Liên hệ
                        </Typography>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneInTalkIcon sx={{ mr: 2, color: '#60A5FA' }} /> {/* Màu xanh nhẹ cho icon */}
                                <Typography sx={{ color: '#E5E7EB' }}>(+84) 521 012 949</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon sx={{ mr: 2, color: '#60A5FA' }} />
                                <Typography sx={{ color: '#E5E7EB' }}>contact@tastyfood.com</Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Cột 4: Mạng xã hội */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 3, 
                                color: '#FFFFFF', 
                                fontWeight: 600,
                            }}
                        >
                            Theo dõi chúng tôi
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}> {/* Sử dụng flex với gap cho spacing đều */}
                            <Tooltip title="Facebook" arrow>
                                <IconButton 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    sx={{ 
                                        color: '#E5E7EB', 
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            color: '#4267B2', // Màu chính thức của Facebook
                                            transform: 'scale(1.1)', // Scale nhẹ khi hover
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    <FacebookIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Instagram" arrow>
                                <IconButton 
                                    href="https://instagram.com" 
                                    target="_blank" 
                                    sx={{ 
                                        color: '#E5E7EB', 
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            color: '#E4405F', // Màu chính thức của Instagram
                                            transform: 'scale(1.1)',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    <InstagramIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Twitter" arrow>
                                <IconButton 
                                    href="https://twitter.com" 
                                    target="_blank" 
                                    sx={{ 
                                        color: '#E5E7EB', 
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            color: '#1DA1F2', // Màu chính thức của Twitter
                                            transform: 'scale(1.1)',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    <TwitterIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                </Grid>

                {/* Dòng Copyright ở dưới cùng */}
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        mt: 6, 
                        pt: 4, 
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Border tinh tế hơn
                    }}
                >
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#9CA3AF', 
                            fontWeight: 400,
                        }}
                    >
                        &copy; {new Date().getFullYear()} TASTY Foods. Đã đăng ký bản quyền.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
