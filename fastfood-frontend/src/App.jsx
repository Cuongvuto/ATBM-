// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import CategoryMenuPage from './pages/CategoryMenuPage';
import AboutPage from './pages/AboutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard'; // This is now the product list page for /admin
import AdminAddProductPage from './pages/AdminAddProductPage';
import AdminEditProductPage from './pages/AdminEditProductPage';
// --- 1. IMPORT ADMIN PAGES ---
import AdminOrdersPage from './pages/AdminOrdersPage';   // <-- Import trang Orders
import AdminUsersPage from './pages/AdminUsersPage';     // <-- Import trang Users

function App() {
    const location = useLocation(); // Get current location
    const isAdminPath = location.pathname.startsWith('/admin'); // Check if path starts with /admin

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Conditionally render Header */}
            {!isAdminPath && <Header />}

            {/* Main content area takes remaining space */}
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/menu/:categorySlug" element={<CategoryMenuPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    {/* Admin Routes - AdminRoute now handles the layout */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/products/add" element={<AdminAddProductPage />} />
                        <Route path="/admin/products/edit/:productId" element={<AdminEditProductPage />} />
                        {/* --- 2. ADD ADMIN ROUTES --- */}
                        <Route path="/admin/orders" element={<AdminOrdersPage />} /> {/* <-- Add Orders Route */}
                        <Route path="/admin/users" element={<AdminUsersPage />} />   {/* <-- Add Users Route */}
                        {/* --- END ADD ADMIN ROUTES --- */}
                    </Route>

                    {/* Optional 404 Route */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Routes>
            </Box>

            {/* Conditionally render Footer */}
            {!isAdminPath && <Footer />}
        </Box>
    );
}

export default App;