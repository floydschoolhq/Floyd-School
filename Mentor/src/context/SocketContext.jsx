import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'https://floyd-school.onrender.com';

    useEffect(() => {
        if (user) {
            const newSocket = io(baseURL, {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('Socket synchronized with server node');
                newSocket.emit('authenticate', user._id);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user, baseURL]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
