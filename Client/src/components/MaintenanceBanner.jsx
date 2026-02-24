import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const MaintenanceBanner = () => {
    const [maintenance, setMaintenance] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Use standardized api instance to avoid URL mismatches
                const res = await api.get('/public/settings');
                if (res.data.maintenanceMode?.isActive) {
                    setMaintenance(res.data.maintenanceMode);
                } else {
                    setMaintenance(null);
                }
            } catch (err) {
                // Silent failure is fine for background checks
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    if (!maintenance || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-blue-500 text-white fixed top-0 left-0 right-0 z-[200] shadow-lg shadow-blue-500/20"
            >
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-lg animate-pulse">
                            <ShieldAlert size={16} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest">
                            <span className="opacity-70">Platform Maintenance: </span>
                            {maintenance.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="hover:bg-white/20 p-1 rounded-md transition-all"
                    >
                        <X size={14} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MaintenanceBanner;

