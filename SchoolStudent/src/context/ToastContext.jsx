import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all transform flex items-center justify-between min-w-[280px] ${
              t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' :
              t.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' :
              'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-3 text-slate-400 hover:text-white">&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
