import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.data.data || res.data;
          if (['school_coordinator', 'admin'].includes(userData.role)) {
            setUser(userData);
          } else {
            console.warn('Unauthorized role for Partner School portal:', userData.role);
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = res.data.user || res.data;
    
    if (!['school_coordinator', 'admin'].includes(userData.role)) {
      throw new Error('Access denied: Account is not authorized as a school coordinator.');
    }

    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(userData);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
