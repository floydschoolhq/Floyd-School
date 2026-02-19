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
                className="relative p-2 rounded-full hover:bg-surface-el transition-all duration-300"
            >
                <Bell className="w-6 h-6 text-text-muted hover:text-text-main transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-accent-primary/20">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-4 w-96 bg-surface-base border border-surface-el rounded-3xl shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-surface-el flex items-center justify-between">
                            <h3 className="text-xl font-black text-text-main tracking-tight">Alert Center</h3>
                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-black uppercase tracking-widest text-accent-primary hover:text-accent-secondary transition-colors"
                                    >
                                        Sweep All
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-surface-soft rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-muted" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-12 text-center text-text-muted text-xs font-black uppercase tracking-[0.2em] italic">
                                    Strategic Calm: No Alerts
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            "p-6 border-b border-surface-el hover:bg-surface-soft cursor-pointer transition-all duration-300",
                                            !notification.isRead && "bg-accent-primary/5"
                                        )}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mt-2 transition-all duration-500",
                                                !notification.isRead ? "bg-accent-primary scale-125 shadow-[0_0_8px_var(--accent-primary)]" : "bg-surface-el"
                                            )} />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-text-main mb-1 tracking-tight">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-text-muted leading-relaxed font-medium">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-tighter opacity-60">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent-primary/10">
                                                    <Check className="w-4 h-4 text-accent-primary" />
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
