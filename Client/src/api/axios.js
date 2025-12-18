import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
