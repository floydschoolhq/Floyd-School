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
  const [system, setSystem] = useState(user?.system || 'student');
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 

  // Update user when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getStoredUser();
      setUser(updatedUser);
      setSystem(updatedUser?.system || 'student');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Function to update user (useful after login/signup)
  const updateUser = (userData) => {
    setUser(userData);
    setSystem(userData?.system || 'student');
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  
  // Function to logout
  const logout = () => {
    setUser(null);
    setSystem('student');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  const setView = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

   const switchRole = () => {
        setSystem(prevSystem => (prevSystem === 'student' ? 'parent' : 'student'));
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
    logout,
    switchRole
    
  };

  return (
    <PortalContext.Provider value={contextValue}>
      {children}
    </PortalContext.Provider>
  );
};
