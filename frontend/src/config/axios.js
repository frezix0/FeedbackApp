import axios from 'axios';

// Konfigurasi axios untuk koneksi ke backend
const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk logging request
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor untuk logging response
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
