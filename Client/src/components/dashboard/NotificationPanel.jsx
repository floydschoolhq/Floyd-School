import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../api/axios';

export const NotificationPanel = ({ notifications: socketNotifications = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        // Merge socket notifications with existing ones
        if (socketNotifications.length > 0) {
            setNotifications(prev => [...socketNotifications, ...prev]);
            setUnreadCount(prev => prev + socketNotifications.length);
        }
    }, [socketNotifications]);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            const data = response.data.data || response.data;
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
                <Bell className="w-6 h-6 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#F5AFAF] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-96 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs font-bold text-[#F5AFAF] hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-slate-50 rounded-full"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm italic">
                                    No new alerts at this time.
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            "p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors",
                                            !notification.isRead && "bg-slate-50/50"
                                        )}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mt-2 transition-colors",
                                                !notification.isRead ? "bg-[#F5AFAF]" : "bg-slate-200"
                                            )} />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-slate-800 mb-1">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5AFAF]/10">
                                                    <Check className="w-3 h-3 text-[#F5AFAF]" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
