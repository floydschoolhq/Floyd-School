import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: <CheckCircle className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
};

const COLORS = {
    success: { bg: 'bg-emerald-500', text: 'text-emerald-50', bar: 'bg-emerald-300' },
    error: { bg: 'bg-red-500', text: 'text-red-50', bar: 'bg-red-300' },
    info: { bg: 'bg-blue-500', text: 'text-blue-50', bar: 'bg-blue-300' },
    warning: { bg: 'bg-amber-500', text: 'text-amber-50', bar: 'bg-amber-300' },
};

const Toast = ({ id, type = 'info', title, message, onDismiss, duration = 4000 }) => {
    const c = COLORS[type] || COLORS.info;

    React.useEffect(() => {
        const t = setTimeout(() => onDismiss(id), duration);
        return () => clearTimeout(t);
    }, [id, duration, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative flex items-start gap-3 w-[340px] rounded-2xl p-4 shadow-2xl overflow-hidden ${c.bg} ${c.text}`}
        >
            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-[3px] w-full origin-left ${c.bar} opacity-60`}
            />

            <span className="mt-0.5 shrink-0">{ICONS[type]}</span>

            <div className="flex-1 min-w-0">
                {title && <p className="font-black text-sm leading-none mb-0.5">{title}</p>}
                {message && <p className="text-xs opacity-80 font-medium leading-snug">{message}</p>}
            </div>

            <button
                onClick={() => onDismiss(id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((type, title, message, duration) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-4), { id, type, title, message, duration }]);
    }, []);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const api = {
        success: (title, msg, dur) => toast('success', title, msg, dur),
        error: (title, msg, dur) => toast('error', title, msg, dur),
        info: (title, msg, dur) => toast('info', title, msg, dur),
        warning: (title, msg, dur) => toast('warning', title, msg, dur),
    };

    return (
        <ToastContext.Provider value={api}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <div key={t.id} className="pointer-events-auto">
                            <Toast {...t} onDismiss={dismiss} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

