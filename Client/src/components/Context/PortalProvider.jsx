import { createContext, useState, useEffect } from "react";
import api from "../../api/axios";

export const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  // Check for classroom user in sessionStorage first (priority)
  const getClassroomUser = () => {
    try {
      const classroomUser = sessionStorage.getItem('classroomUser');
      return classroomUser ? JSON.parse(classroomUser) : null;
    } catch (error) {
      return null;
    }
  };

  // Initialize user from localStorage (fallback)
  const getStoredUser = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  // Priority: sessionStorage > localStorage
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

  // Function to update user (useful after login/signup)
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Function to update classroom user specifically
  const updateClassroomUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('classroomUser', JSON.stringify(userData));
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Function to logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    sessionStorage.removeItem('classroomUser');
    sessionStorage.removeItem('classroomToken');
  };

  // Update user when localStorage changes
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

  // Fetch latest user data on mount (Refresh Profile)
  // Skip for classroom users - they use sessionStorage auth
  useEffect(() => {
    // Skip if classroom user
    if (user?.isClassroomAccess === true) {
      return;
    }

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
