import { createContext, useState, useEffect } from "react";
import api from "../../api/axios";

export const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  // Initialize user from localStorage
  const getStoredUser = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());
  const [system] = useState('student');
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLiveClass, setActiveLiveClass] = useState(null);

  // Function to update user (useful after login/signup)
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Function to logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  // Update user when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getStoredUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch latest user data on mount (Refresh Profile)
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          updateUser(res.data.user || res.data); // Handle potential response variations
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
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const contextValue = {
    user,
    system,
    currentView,
    isSidebarOpen,
    setView,
    setIsSidebarOpen,
    updateUser,
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
