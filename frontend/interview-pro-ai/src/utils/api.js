import axios from 'axios';

const api = axios.create({
    baseURL: 'https://interviewpro-ai-backend.onrender.com/api', // ✅ ADD /api
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
