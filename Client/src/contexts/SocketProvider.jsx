import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { PortalContext } from './PortalProvider';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const { user } = useContext(PortalContext);
  const apiURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      const newSocket = io(apiURL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('authenticate', user._id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('notification:new', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      newSocket.on('assignment:new', (assignment) => {
      });

      newSocket.on('assignment:graded', (data) => {
      });

      newSocket.on('course:updated', (course) => {
      });

      newSocket.on('liveClass:started', (liveClass) => {
      });

      newSocket.on('liveClass:ended', (classId) => {
      });

      newSocket.on('liveClass:message', (msg) => {
      });

      newSocket.on('liveClass:countUpdate', ({ count }) => {
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user, apiURL]);

  const emitEvent = useCallback((event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  }, [socket]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, notifications, emitEvent, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;