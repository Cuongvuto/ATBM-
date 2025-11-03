// src/api/axiosConfig.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5001/api', // URL gốc của server backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;