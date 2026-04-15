import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

// API instance for /api routes
const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
    timeout: 15000 // 15 second timeout
});

// Admin API instance for /admin routes (no /api prefix)
const adminApi = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15000
});

// Request interceptor for api
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// Request interceptor for adminApi
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// Response interceptor for api
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Response interceptor for adminApi
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
export { adminApi };
