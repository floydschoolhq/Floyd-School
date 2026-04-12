import axios from 'axios';
import { mockSettings, mockCourses, mockUser } from '../mocks/api.js';

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

let isBackendAvailable = true;

// In-memory cache for API responses
const cache = new Map();
const CACHE_TTL = 30000;
const CACHE_LONG_TTL = 120000;

const getCachedData = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
    }
    cache.delete(key);
    return null;
};

const setCachedData = (key, data, ttl = CACHE_TTL) => {
    cache.set(key, { data, timestamp: Date.now(), ttl });
};

const shouldCache = (url) => {
    return url.includes('/dashboard') || url.includes('/courses') || url.includes('/assignments');
};

const getCacheTTL = (url) => {
    if (url.includes('/dashboard')) return CACHE_TTL;
    if (url.includes('/assignments')) return CACHE_TTL;
    return CACHE_LONG_TTL;
};

const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
    timeout: 15000
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Cache check for GET requests
        if (config.method === 'get' && shouldCache(config.url)) {
            const cached = getCachedData(config.url);
            if (cached) {
                config._cached = cached;
            }
        }
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('classroomToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.url && config.url.includes('/payments')) {
            config.timeout = 30000;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        isBackendAvailable = true;
        
        if (response.config.method === 'get' && shouldCache(response.config.url)) {
            setCachedData(response.config.url, response.data, getCacheTTL(response.config.url));
        }
        
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
            isBackendAvailable = false;
            console.warn('Backend unavailable. Using cached/mock data.');
            
            const url = error.config?.url || '';
            const cached = getCachedData(url);
            if (cached) {
                return Promise.resolve({ data: cached });
            }
            
            if (url.includes('/public/settings')) {
                return Promise.resolve({ data: mockSettings });
            } else if (url.includes('/courses')) {
                return Promise.resolve({ data: mockCourses });
            } else if (url.includes('/auth/me')) {
                return Promise.resolve({ data: mockUser });
            }
        }
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            sessionStorage.removeItem('classroomToken');
            sessionStorage.removeItem('classroomUser');
            cache.clear();
            
            const area = window.location.pathname;
            if (area.startsWith('/student') || area.startsWith('/classroom')) {
                window.location.href = '/student/login';
            }
        }

        if (error.response?.status === 429) {
            console.warn('Rate limited. Please wait before retrying.');
        }

        return Promise.reject(error);
    }
);

export const isBackendRunning = () => isBackendAvailable;

export default api;