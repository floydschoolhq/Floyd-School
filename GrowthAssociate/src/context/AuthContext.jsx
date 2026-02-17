import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('associate_token');
        if (token) {
            try {
                const res = await api.get('/auth/me');
                if (res.data.role === 'growth_associate' || res.data.role === 'admin') {
                    setUser(res.data);
                } else {
                    localStorage.removeItem('associate_token');
                }
            } catch (err) {
                console.error('Auth verification failed:', err.message);
                localStorage.removeItem('associate_token');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.role === 'growth_associate' || res.data.role === 'admin') {
            localStorage.setItem('associate_token', res.data.token);
            setUser(res.data);
            return res.data;
        } else {
            throw new Error('Access denied: Unauthorized role');
        }
    };

    const logout = () => {
        localStorage.removeItem('associate_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
