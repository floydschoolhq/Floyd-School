import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border ${t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                                    t.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                                        'bg-sky-50 border-sky-100 text-sky-800'
                                }`}
                        >
                            {t.type === 'success' && <CheckCircle2 size={20} className="text-emerald-500" />}
                            {t.type === 'error' && <AlertCircle size={20} className="text-rose-500" />}
                            {t.type === 'info' && <Info size={20} className="text-sky-500" />}

                            <p className="text-sm font-black uppercase tracking-tight">{t.message}</p>

                            <button
                                onClick={() => removeToast(t.id)}
                                className="ml-2 p-1 hover:bg-black/5 rounded-lg transition-all"
                            >
                                <X size={16} className="opacity-40" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
