import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
    timeout: 15000 // 15 second timeout to prevent indefinite loading
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

// Add a response interceptor to handle specialized logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear credentials on authentication failure (Session Expired/Invalid)
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            
            // Force redirect to login page if we are in the student portal
            if (window.location.pathname.startsWith('/student')) {
                window.location.href = '/student/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
