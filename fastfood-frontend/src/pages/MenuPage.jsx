// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Hook để đọc query params
import apiClient from '../api/axiosConfig';
import { Container, Typography, Grid, CircularProgress, Alert, Box, useTheme, Button } from '@mui/material';
import ProductCard from '../components/ProductCard';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useNavigate } from 'react-router-dom';

// Hàm helper để parse query string
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function MenuPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('Thực Đơn Của Chúng Tôi');
    const query = useQuery();
    const searchTerm = query.get('search'); // Lấy giá trị của 'search' từ URL

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            let url = '/products';
            // Nếu có searchTerm, thay đổi URL và tiêu đề
            if (searchTerm) {
                url = `/products?search=${searchTerm}`;
                setTitle(`Kết quả tìm kiếm cho: "${searchTerm}"`);
            } else {
                setTitle('Thực Đơn Của Chúng Tôi');
            }

            try {
                const response = await apiClient.get(url);
                setProducts(response.data.data);
            } catch (err) {
                setError('Không thể tải thực đơn.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchTerm]); // Chạy lại mỗi khi searchTerm thay đổi

    if (loading) return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            my: 8, 
            minHeight: 400, // Tăng height cho không gian rộng rãi
            bgcolor: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`, // Gradient nền tinh tế
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', // Shadow nhẹ
        }}>
            <CircularProgress color="primary" size={80} thickness={4} /> {/* Tăng size và thickness */}
        </Box>
    );
    if (error) return (
        <Container sx={{ my: 8 }}>
            <Alert 
                severity="error" 
                sx={{ 
                    textAlign: 'center', 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', // Shadow mạnh hơn
                    py: 4, // Padding dọc
                    fontSize: '1.1rem', // Font lớn hơn
                }}
            >
                {error}
            </Alert>
        </Container>
    );

    return (
        <Container sx={{ 
            my: { xs: 4, md: 8 }, 
            animation: 'fadeIn 0.8s ease-in-out',
            '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(30px)' }, // Tăng translateY cho hiệu ứng mạnh hơn
                to: { opacity: 1, transform: 'translateY(0)' },
            },
            bgcolor: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`, // Gradient nền tổng thể
            borderRadius: 3,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', // Shadow tinh tế
            p: { xs: 2, md: 4 }, // Padding nội bộ
        }}>
            {/* Tiêu đề với icon và gradient */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {searchTerm ? (
                        <SearchIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mr: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} /> // Thêm shadow cho icon
                    ) : (
                        <RestaurantMenuIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mr: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    )}
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 800, // Bold hơn
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.15)', // Shadow mạnh hơn
                            letterSpacing: 1.2, // Spacing chữ
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
                {searchTerm && (
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: theme.palette.text.secondary, 
                            fontSize: '1.1rem', 
                            fontStyle: 'italic', // Italic cho mô tả
                        }}
                    >
                        Khám phá các món ăn phù hợp với tìm kiếm của bạn!
                    </Typography>
                )}
            </Box>
            
            {products.length > 0 ? (
                <Grid container spacing={6}> {/* Tăng spacing để không gian rộng rãi hơn */}
                    {products.map((product, index) => (
                        <Grid 
                            item 
                            key={product.id} 
                            xs={12} 
                            sm={6} 
                            md={4} // Thay đổi md từ 3 sang 4 để cân bằng hơn trên desktop
                            sx={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`, // Stagger animation cho từng item
                                '@keyframes fadeInUp': {
                                    from: { opacity: 0, transform: 'translateY(20px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <Box sx={{ 
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition cho hover
                                '&:hover': { 
                                    transform: 'translateY(-8px)', // Lift effect
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)', // Shadow mạnh hơn khi hover
                                },
                            }}>
                                <ProductCard product={product} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 10, // Padding dọc lớn hơn
                    bgcolor: theme.palette.grey[100], // Background nhẹ
                    borderRadius: 3,
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)', // Shadow nội bộ
                }}>
                    <SearchIcon sx={{ fontSize: 100, color: theme.palette.grey[400], mb: 3, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} /> {/* Icon lớn hơn với shadow */}
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3, 
                            color: theme.palette.text.secondary, 
                            fontWeight: 600,
                        }}
                    >
                        Không tìm thấy sản phẩm nào phù hợp.
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 5, 
                            color: theme.palette.text.secondary, 
                            maxWidth: 500, 
                            mx: 'auto', // Center text
                        }}
                    >
                        Hãy thử tìm kiếm với từ khóa khác hoặc khám phá toàn bộ thực đơn!
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={() => navigate('/menu')}
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            color: 'white',
                            px: 4, // Padding ngang
                            py: 1.5, // Padding dọc
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                                transform: 'scale(1.05)', // Scale nhẹ
                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)', // Shadow mạnh hơn
                            },
                        }}
                    >
                        Xem toàn bộ thực đơn
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default MenuPage;
