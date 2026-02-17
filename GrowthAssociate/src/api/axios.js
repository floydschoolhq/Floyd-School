import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
    timeout: 10000 // 10 second timeout for all requests
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('associate_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('associate_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
