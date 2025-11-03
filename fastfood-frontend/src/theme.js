// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F97316', // Màu cam chủ đạo
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1F2937',   // Màu chữ chính (gần đen)
      secondary: '#6B7280', // Màu chữ phụ (xám)
    },
    background: {
      default: '#FFFFFF', // Màu nền chính (trắng)
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px', // Bo tròn góc mặc định cho button
          textTransform: 'none',
          padding: '10px 25px',
        },
      },
    },
  },
});

export default theme;