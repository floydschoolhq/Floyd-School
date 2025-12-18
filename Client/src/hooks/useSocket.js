import { useEffect, useState, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = (userId) => {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (userId) {
            const socket = socketService.connect(userId);

            socket.on('connect', () => {
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            // Listen for notifications
            socket.on('notification:new', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                // You can add toast notification here
                console.log('New notification:', notification);
            });

            // Listen for assignment events
            socket.on('assignment:new', (assignment) => {
                console.log('New assignment:', assignment);
                // Trigger UI update
            });

            socket.on('assignment:graded', (data) => {
                console.log('Assignment graded:', data);
                // Trigger UI update
            });

            // Listen for course events
            socket.on('course:updated', (course) => {
                console.log('Course updated:', course);
                // Trigger UI update
            });

            return () => {
                socketService.disconnect();
            };
        }
    }, [userId]);

    const emitEvent = useCallback((event, data) => {
        socketService.emit(event, data);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        isConnected,
        notifications,
        emitEvent,
        clearNotifications
    };
};
