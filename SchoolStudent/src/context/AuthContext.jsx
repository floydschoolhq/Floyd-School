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
          setUser(userData);
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

  // Login handler supporting both (email, password) and direct (user, token)
  const login = async (emailOrUser, passwordOrToken) => {
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      // Direct session assignment
      const userData = emailOrUser;
      const token = passwordOrToken;
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(userData);
      return { user: userData, token };
    }

    // Traditional credentials login
    const res = await api.post('/auth/login', { email: emailOrUser, password: passwordOrToken });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      const userData = res.data.user || res.data;
      setUser(userData);
    }
    return res.data;
  };

  const setAuthData = (userData, token) => {
    if (token) localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, setAuthData, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
