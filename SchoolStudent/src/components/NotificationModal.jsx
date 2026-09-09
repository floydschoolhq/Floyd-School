import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bell, Check, X, Clock } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/school-student/notifications');
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markRead = async (id) => {
    try {
      await api.put(`/school-student/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell size={16} className="text-slate-700" />
            In-App Notifications
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-2.5">
          {loading ? (
            <div className="flex justify-center py-8 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No notifications received yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
                  n.isRead ? 'bg-slate-50 border-slate-200/80 text-slate-600' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-900">{n.title}</p>
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      title="Mark as read"
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 shrink-0"
                    >
                      <Check size={13} />
                    </button>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">{n.message}</p>
                <div className="flex items-center space-x-1 text-[9px] text-slate-400 pt-0.5">
                  <Clock size={10} />
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
