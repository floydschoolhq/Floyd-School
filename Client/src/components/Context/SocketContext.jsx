import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { PortalContext } from './PortalProvider';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useContext(PortalContext);
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (user) {
            const newSocket = io(apiURL, {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('Student socket synchronized with server node');
                newSocket.emit('authenticate', user._id);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user, apiURL]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);

