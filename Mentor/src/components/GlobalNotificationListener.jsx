import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

const GlobalNotificationListener = () => {
    const socket = useSocket();
    const toast = useToast();

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data) => {
            const { title, message, type } = data;

            // Map type to toast method
            // 'info' -> info
            // 'warning' -> error (or info with warning icon if supported, using error for visibility)
            // 'success' -> success

            const msg = `${title}: ${message}`;

            if (type === 'success') {
                toast.success(msg);
            } else if (type === 'warning' || type === 'alert') {
                toast.error(msg); // Using error style for warnings/alerts
            } else {
                toast.info(msg);
            }
        };

        socket.on('notification:broadcast', handleNotification);

        return () => {
            socket.off('notification:broadcast', handleNotification);
        };
    }, [socket, toast]);

    return null; // Logic only component
};

export default GlobalNotificationListener;
