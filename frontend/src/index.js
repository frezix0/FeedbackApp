import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.timeout = 10000; // 10 seconds timeout

// Add request interceptor for logging
axios.interceptors.request.use(
    config => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
); 