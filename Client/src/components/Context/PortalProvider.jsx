import { createContext, useState, useEffect } from "react";

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

  // Update user when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getStoredUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    logout
  };

  return (
    <PortalContext.Provider value={contextValue}>
      {children}
    </PortalContext.Provider>
  );
};
