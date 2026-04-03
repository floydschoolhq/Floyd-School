import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(baseURL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Socket synchronized with server node');
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [baseURL]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
