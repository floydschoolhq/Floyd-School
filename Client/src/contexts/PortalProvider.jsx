import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

export const PortalContext = createContext();

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

export const PortalProvider = ({ children }) => {
  const getClassroomUser = () => {
    try {
      const classroomUser = sessionStorage.getItem('classroomUser');
      return classroomUser ? JSON.parse(classroomUser) : null;
    } catch (error) {
      return null;
    }
  };

  const getStoredUser = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  const getInitialUser = () => {
    const classroomUser = getClassroomUser();
    if (classroomUser) {
      return classroomUser;
    }
    return getStoredUser();
  };

  const [user, setUser] = useState(getInitialUser);
  const [system] = useState('student');
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLiveClass, setActiveLiveClass] = useState(null);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    if (sessionStorage.getItem('classroomUser')) {
      sessionStorage.setItem('classroomUser', JSON.stringify(userData));
    }
  };

  const updateClassroomUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('classroomUser', JSON.stringify(userData));
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    sessionStorage.removeItem('classroomUser');
    sessionStorage.removeItem('classroomToken');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const classroomUser = sessionStorage.getItem('classroomUser');
      if (classroomUser) {
        setUser(JSON.parse(classroomUser));
      } else {
        const updatedUser = getStoredUser();
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          updateUser(res.data.user || res.data);
        } catch (error) {
          console.error("Failed to refresh profile:", error);
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
    };

    fetchProfile();
  }, []);

  const setView = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const contextValue = {
    user,
    system,
    currentView,
    isSidebarOpen,
    setView,
    setIsSidebarOpen,
    updateUser,
    updateClassroomUser,
    logout,
    activeLiveClass,
    setActiveLiveClass
  };

  return (
    <PortalContext.Provider value={contextValue}>
      {children}
    </PortalContext.Provider>
  );
};

export default PortalContext;