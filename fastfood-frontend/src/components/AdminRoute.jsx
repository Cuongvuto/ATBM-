// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box, CircularProgress, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Toolbar, Typography, CssBaseline
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

const AdminLayout = () => {
    const location = useLocation();

    // Define sidebar menu items here
    const menuItems = [
        { text: 'Quản lý Sản phẩm', icon: <InventoryIcon />, path: '/admin' }, // Main admin page is products
        { text: 'Quản lý Đơn hàng', icon: <ListAltIcon />, path: '/admin/orders' },
        { text: 'Quản lý Người dùng', icon: <PeopleIcon />, path: '/admin/users' },
        // Add more admin links here
    ];

    const drawer = (
        <div>
            <Toolbar sx={{ justifyContent: 'center', my: 1 }}>
                 <Typography variant="h6" noWrap component="div">
                    ADMIN TASTY
                 </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname === item.path} // Highlight active link
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
             {/* Optional: Add Logout button or other actions in sidebar */}
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* Sidebar (Permanent Drawer) */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {drawer}
            </Drawer>
            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f4f6f8', // Background color for content area
                    p: 3,
                    minHeight: '100vh', // Ensure it takes full viewport height
                }}
            >
                 <Toolbar /> {/* This adds space equivalent to AppBar height, keeping content below potential Admin AppBar */}
                <Outlet /> {/* Renders the specific admin page component (e.g., AdminDashboard) */}
            </Box>
        </Box>
    );
};

const AdminRoute = () => {
    const { isLoggedIn, isAdmin } = useAuth();
    const token = localStorage.getItem('token');
    const isAdminStored = localStorage.getItem('isAdmin') === 'true';

    console.log("Kiểm tra AdminRoute:", { isLoggedIn, isAdmin, isAdminStored, token });

    if (isLoggedIn && isAdmin && isAdminStored && token) {
        console.log("AdminRoute: Access Granted, rendering AdminLayout");
        // Render the AdminLayout which contains the Outlet for nested routes
        return <AdminLayout />;
    } else {
        console.log("AdminRoute: Access Denied, redirecting to /login");
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;