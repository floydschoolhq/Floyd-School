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
          const res = await api.get('/mentor/offline/profile');
          const userData = res.data.data || res.data;
          if (userData.role === 'mentor' || userData.role === 'admin') {
            setUser(userData);
          } else {
            console.warn('Unauthorized role for MentorSchool:', userData.role);
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
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
    const payload = res.data;
    const userData = payload.user || payload;
    const userRole = userData.role;

    if (userRole !== 'mentor' && userRole !== 'admin') {
      throw new Error('Access denied: Mentor credentials required to enter MentorSchool portal.');
    }

    if (payload.token) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return payload;
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
