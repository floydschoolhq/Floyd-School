import axios from 'axios';
import { mockSettings, mockCourses, mockUser } from '../mocks/api.js';

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

// Flag to track if backend is available
let isBackendAvailable = true;

const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
    timeout: 15000 // 15 second timeout (increased for payment operations)
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('classroomToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Use longer timeout for payment-related requests
        if (config.url && (config.url.includes('/payments') || config.url.includes('/payment'))) {
            config.timeout = 30000; // 30 seconds for payment calls
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle specialized logout on 401 and connection errors
api.interceptors.response.use(
    (response) => {
        isBackendAvailable = true;
        return response;
    },
    (error) => {
        // Handle connection errors
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
            isBackendAvailable = false;
            console.warn('Backend is not available. Using mock data for development.');
            
            // Return mock data based on the endpoint
            const url = error.config?.url || '';
            
            if (url.includes('/public/settings')) {
                return Promise.resolve({ data: mockSettings });
            } else if (url.includes('/courses')) {
                return Promise.resolve({ data: mockCourses });
            } else if (url.includes('/auth/me')) {
                return Promise.resolve({ data: mockUser });
            }
        }
        
        // Handle 401 errors
        if (error.response?.status === 401) {
            // Clear credentials on authentication failure (Session Expired/Invalid)
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            sessionStorage.removeItem('classroomToken');
            sessionStorage.removeItem('classroomUser');
            
            // Force redirect to login page if we are in protected areas
            const area = window.location.pathname;
            if (area.startsWith('/student') || area.startsWith('/classroom')) {
                window.location.href = '/student/login';
            }
        }

        // Handle rate limiting (429)
        if (error.response?.status === 429) {
            console.warn('Rate limited. Please wait before retrying.');
        }

        return Promise.reject(error);
    }
);

// Helper function to check backend availability
export const isBackendRunning = () => isBackendAvailable;

export default api;
