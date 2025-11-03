// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Box, Typography, Paper, TextField, RadioGroup, FormControlLabel,
    Radio, Button, Divider, useTheme, List, ListItem, ListItemAvatar,
    Avatar, ListItemText, Alert, Stack, Dialog, DialogTitle, DialogContent,
    CircularProgress, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// Bỏ comment nếu dùng QRCode
// import { QRCode } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import hook useAuth
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function CheckoutPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    // Lấy user, trạng thái đăng nhập và trạng thái loading từ AuthContext
    const { user, isLoggedIn, loading: authLoading } = useAuth();

    // State cho form
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [address, setAddress] = useState(''); // Khởi tạo rỗng
    const [phone, setPhone] = useState('');     // Khởi tạo rỗng
    const [note, setNote] = useState('');
    const [fullName, setFullName] = useState(''); // Khởi tạo rỗng

    // State cho quá trình đặt hàng
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState('');

    // State cho modal QR code
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrData, setQrData] = useState('');
    const [qrPaymentMethodName, setQrPaymentMethodName] = useState('');

    // useEffect để điền thông tin user vào form sau khi AuthContext load xong
    useEffect(() => {
        // Chỉ điền khi không còn loading auth VÀ có thông tin user
        if (!authLoading && user) {
            setFullName(user.full_name || ''); // Lấy full_name từ user object
            // Bạn có thể lấy thêm địa chỉ, SĐT mặc định từ user nếu có
            // setAddress(user.default_address || '');
            // setPhone(user.default_phone || '');
        }
    }, [user, authLoading]); // Chạy lại khi user hoặc authLoading thay đổi

    // Tính toán giá trị đơn hàng
    const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = shippingMethod === 'standard' ? 25000 : 30000;
    const totalPrice = itemsPrice + shippingPrice;

    // Kiểm tra có phải thanh toán online không
    const isOnlinePayment = ['vnpay', 'momo', 'zalopay', 'shopeepay'].includes(paymentMethod);

    // Hàm xử lý khi bấm nút "Đặt hàng"
    const handlePlaceOrder = async () => {
        setError(''); // Reset lỗi

        // 1. Kiểm tra đăng nhập (dùng isLoggedIn từ context)
        if (!isLoggedIn) {
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
            return;
        }

        // 2. Kiểm tra user object và user.id (quan trọng sau khi tải lại trang)
        if (!user || !user.id) {
             setError('Không thể xác thực người dùng. Vui lòng thử đăng nhập lại.');
             return; // Dừng lại nếu không có user.id
        }

        // 3. Kiểm tra thông tin giao hàng nhập vào
        if (!address.trim() || !phone.trim() || !fullName.trim()) {
            setError('Vui lòng nhập đầy đủ tên người nhận, địa chỉ và số điện thoại.');
            return;
        }

        setPlacingOrder(true); // Bắt đầu trạng thái loading đặt hàng

        // Chuẩn bị dữ liệu gửi lên backend
        const orderData = {
            userId: user.id, // Lấy userId từ user context (giờ đã chắc chắn có)
            items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
            shippingFullName: fullName,
            shippingAddress: address,
            shippingPhone: phone,
            paymentMethod: paymentMethod,
            shippingMethod: shippingMethod,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
            note: note,
        };

        console.log("Dữ liệu gửi lên server:", orderData);

        try {
            // Gọi API tạo đơn hàng
            const response = await apiClient.post('/orders', orderData);

            // Xử lý kết quả tùy theo phương thức thanh toán
            if (isOnlinePayment) {
                // Mô phỏng nhận dữ liệu QR từ backend
                const simulatedQrData = `https://my-payment-gateway.com/pay?orderId=${response.data.orderId || 'FAKE_ID'}&amount=${totalPrice}&method=${paymentMethod}`;
                const paymentMethodDisplayNames = { vnpay: 'VNPAY', momo: 'MoMo', zalopay: 'ZaloPay', shopeepay: 'ShopeePay' };

                setQrData(simulatedQrData);
                setQrPaymentMethodName(paymentMethodDisplayNames[paymentMethod] || 'Online');
                setShowQrModal(true); // Hiển thị modal QR
                // Giữ placingOrder = true để nút "Đặt hàng" bị vô hiệu hóa
            } else { // Thanh toán COD
                clearCart(); // Xóa giỏ hàng
                alert('Đặt hàng thành công!');
                navigate('/'); // Chuyển về trang chủ
                // Không cần setPlacingOrder(false) vì đã chuyển trang
            }

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setError(err.response?.data?.message || 'Đặt hàng không thành công. Vui lòng thử lại.');
            setPlacingOrder(false); // Dừng loading nếu có lỗi
        }
    };

    // Hàm đóng modal QR
    const handleCloseQrModal = () => {
        setShowQrModal(false);
        setQrData('');
        setQrPaymentMethodName('');
        setPlacingOrder(false); // Dừng loading khi đóng modal
        setError('Thanh toán chưa hoàn tất. Bạn có thể thử lại hoặc chọn COD.'); // Thông báo cho người dùng
    };

    // useEffect chuyển hướng nếu giỏ hàng trống (sau khi auth đã load xong)
    useEffect(() => {
        // Chỉ kiểm tra khi không loading auth VÀ không đang đặt hàng VÀ giỏ hàng trống
        if (!authLoading && cartItems.length === 0 && !placingOrder) {
            console.log("Giỏ hàng trống, chuyển hướng về trang chủ...");
            navigate('/');
        }
    }, [cartItems, navigate, placingOrder, authLoading]); // Thêm authLoading vào dependencies

    // --- HIỂN THỊ LOADING BAN ĐẦU KHI AUTHCONTEXT ĐANG TẢI USER ---
    if (authLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    // Return null nếu giỏ hàng trống (sau khi auth đã load xong)
    // Điều này ngăn trang checkout render kurzzeitig trước khi chuyển hướng
    if (cartItems.length === 0 && !placingOrder) return null;

    // --- Giao diện JSX của trang ---
    return (
        <Container sx={{ my: { xs: 3, md: 6 } }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
                Thanh Toán
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                {/* === Cột Trái: Form thông tin === */}
                <Grid item xs={12} md={7}>
                    {/* Thông tin giao hàng */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                            <LocalShippingIcon sx={{ mr: 1 }} /> Thông tin giao hàng
                        </Typography>
                        {/* Tên người nhận */}
                        <TextField
                            label="Họ và Tên người nhận"
                            variant="outlined"
                            fullWidth
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            sx={{ mb: 2 }}
                            disabled={placingOrder} // Vô hiệu hóa khi đang đặt hàng
                         />
                        {/* Địa chỉ */}
                        <TextField label="Địa chỉ nhận hàng" variant="outlined" fullWidth required value={address} onChange={(e) => setAddress(e.target.value)} sx={{ mb: 2 }} disabled={placingOrder}/>
                        {/* Số điện thoại */}
                        <TextField label="Số điện thoại" variant="outlined" fullWidth required value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ mb: 2 }} disabled={placingOrder}/>
                        <Divider sx={{ my: 2 }} />
                        {/* Hình thức giao hàng */}
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Hình thức giao hàng</Typography>
                        <RadioGroup row value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                            <FormControlLabel value="standard" control={<Radio disabled={placingOrder} />} label="Tiêu chuẩn (25.000đ)" />
                            <FormControlLabel value="express" control={<Radio disabled={placingOrder} />} label="Nhanh (30.000đ)" />
                        </RadioGroup>
                    </Paper>

                    {/* Tóm tắt giỏ hàng */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                            <ShoppingBagIcon sx={{ mr: 1 }} /> Giỏ hàng ({cartItems.length})
                        </Typography>
                        <List disablePadding sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                            {cartItems.map((item) => (
                                <ListItem key={item.id} disableGutters divider sx={{ py: 1.5 }}>
                                    <ListItemAvatar><Avatar variant="rounded" src={item.image_url} alt={item.name} sx={{ width: 60, height: 60, mr: 2 }}/></ListItemAvatar>
                                    <ListItemText primary={item.name} secondary={`SL: ${item.quantity}`} primaryTypographyProps={{ fontWeight: 500 }}/>
                                    <Typography variant="body1" sx={{ fontWeight: 600, ml: 1 }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</Typography>
                                </ListItem>
                            ))}
                        </List>
                        {/* Ghi chú */}
                        <TextField label="Ghi chú cho đơn hàng (tùy chọn)" variant="outlined" fullWidth multiline rows={2} value={note} onChange={(e) => setNote(e.target.value)} sx={{ mt: 1 }} disabled={placingOrder}/>
                    </Paper>

                    {/* Hình thức thanh toán */}
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                            <PaymentIcon sx={{ mr: 1 }} /> Hình thức thanh toán
                        </Typography>
                        <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <FormControlLabel value="cod" control={<Radio disabled={placingOrder} />} label="Thanh toán khi nhận hàng (COD)" />
                            <FormControlLabel value="vnpay" control={<Radio disabled={placingOrder} />} label="Thẻ ATM / Internet Banking / Thẻ tín dụng (VNPAY)" />
                            <FormControlLabel value="momo" control={<Radio disabled={placingOrder} />} label="Ví điện tử MoMo" />
                            <FormControlLabel value="zalopay" control={<Radio disabled={placingOrder} />} label="Ví điện tử ZaloPay" />
                            <FormControlLabel value="shopeepay" control={<Radio disabled={placingOrder} />} label="Thanh toán Shopee Pay" />
                        </RadioGroup>
                    </Paper>
                </Grid>

                {/* === Cột Phải: Tóm tắt đơn hàng === */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, position: 'sticky', top: 100 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}>
                            Thông tin đơn hàng
                        </Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Tạm tính ({cartItems.length})</Typography><Typography sx={{ fontWeight: 500 }}>{itemsPrice.toLocaleString('vi-VN')}đ</Typography></Stack>
                            <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Phí vận chuyển</Typography><Typography sx={{ fontWeight: 500 }}>{shippingPrice.toLocaleString('vi-VN')}đ</Typography></Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" sx={{ alignItems: 'center' }}><Typography variant="h6" sx={{ fontWeight: 600 }}>Tổng cộng</Typography><Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>{totalPrice.toLocaleString('vi-VN')}đ</Typography></Stack>
                            {/* Nút Đặt Hàng */}
                            <Button
                                variant="contained" fullWidth size="large" onClick={handlePlaceOrder} disabled={placingOrder || cartItems.length === 0 || authLoading} // Vô hiệu hóa cả khi auth đang loading
                                sx={{ mt: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', background: `linear-gradient(45deg, ${theme.palette.success.light}, ${theme.palette.success.dark})`, '&:hover': { transform: 'scale(1.02)' } }}
                            >
                                {placingOrder ? <CircularProgress size={26} color="inherit" /> : 'ĐẶT HÀNG NGAY'}
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Modal QR Code */}
             <Dialog open={showQrModal} onClose={handleCloseQrModal} maxWidth="xs">
                 <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', position: 'relative', pb: 1 }}>
                    Quét mã {qrPaymentMethodName} để thanh toán
                     <IconButton aria-label="close" onClick={handleCloseQrModal} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', p: 3, pt: 1 }}>
                    {qrData ? (
                        <>
                            {/* Placeholder cho QR Code */}
                            {/* <QRCode value={qrData} size={256} level="H" style={{ margin: 'auto' }} /> */}
                             <Box sx={{ width: 256, height: 256, bgcolor: 'grey.300', mx: 'auto', my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey' }}>
                                 <Typography color="text.secondary">(QR Code Placeholder)</Typography>
                             </Box>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                Mở ứng dụng <strong style={{color: theme.palette.primary.main}}>{qrPaymentMethodName}</strong> và quét mã này để thanh toán <strong style={{color: theme.palette.error.main}}>{totalPrice.toLocaleString('vi-VN')}đ</strong>.
                            </Typography>
                             <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}>
                                 (Đơn hàng sẽ được xử lý sau khi thanh toán thành công)
                            </Typography>
                        </>
                    ) : ( <CircularProgress /> )}
                 </DialogContent>
                  {/* Bỏ nút Hủy thanh toán nếu không cần */}
                 {/* <DialogActions sx={{justifyContent: 'center', pb: 2}}>
                    <Button onClick={handleCloseQrModal} color="error" variant="outlined">Hủy thanh toán</Button>
                 </DialogActions> */}
             </Dialog>
        </Container>
    );
}

export default CheckoutPage;