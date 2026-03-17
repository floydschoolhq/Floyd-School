import axios from 'axios';
import { mockSettings, mockCourses, mockUser } from '../mocks/api.js';

// Create axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 5000,
});

// Flag to track if backend is available
let isBackendAvailable = true;

// Request interceptor to check backend availability
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle connection errors
api.interceptors.response.use(
    (response) => {
        isBackendAvailable = true;
        return response;
    },
    (error) => {
        // Check if it's a network/connection error
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
            isBackendAvailable = false;
            console.warn('Backend is not available. Using mock data.');
            
            // Return mock data based on the endpoint
            const url = error.config?.url || '';
            
            if (url.includes('/settings')) {
                return Promise.resolve({ data: mockSettings });
            } else if (url.includes('/courses')) {
                return Promise.resolve({ data: mockCourses });
            } else if (url.includes('/auth/me')) {
                return Promise.resolve({ data: mockUser });
            }
        }
        
        return Promise.reject(error);
    }
);

// Helper function to check backend availability
export const isBackendRunning = () => isBackendAvailable;

// Export the api instance
export default api;
