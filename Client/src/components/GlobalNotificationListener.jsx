import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';

const GlobalNotificationListener = () => {
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Notification Listener Connected:', socket.id);
        });

        socket.on('notification:broadcast', (data) => {
            const { title, message, type } = data;

            // Customize toast based on type
            const iconMap = {
                info: '📢',
                warning: '⚠️',
                success: '✅',
                alert: '🚨'
            };

            toast((t) => (
                <div className="flex flex-col gap-1 min-w-[300px]">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>{iconMap[type] || '📢'}</span>
                        <span>{title}</span>
                    </div>
                    <div className="text-sm text-slate-600 pl-7">
                        {message}
                    </div>
                </div>
            ), {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                },
            });
        });

        return () => {
            socket.off('notification:broadcast');
            socket.disconnect();
        };
    }, []);

    return <Toaster />;
};

export default GlobalNotificationListener;
