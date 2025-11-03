// src/pages/HomePage.jsx
import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './homeSections/HeroSection';
import CategoriesSection from './homeSections/CategoriesSection';
import SuggestionsSection from './homeSections/SuggestionsSection';
// Bạn có thể tạo thêm các section khác (About Us, CTA, Footer) và import vào đây

function HomePage() {
    return (
        <Box>
            {/* Phần 1: Hero Section với ảnh salad và ô tìm kiếm */}
            <HeroSection />

            {/* Phần 2: Các danh mục sản phẩm */}
            <CategoriesSection />

            {/* Phần 3: Các sản phẩm được đề xuất */}
            <SuggestionsSection />

            {/* Thêm các section khác bạn muốn xây dựng ở đây */}
            {/* Ví dụ:
            <AboutUsSection />
            <CallToActionSection />
            */}
        </Box>
    );
}

export default HomePage;