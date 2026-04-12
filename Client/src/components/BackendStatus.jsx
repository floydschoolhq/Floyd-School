import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { isBackendRunning } from '../api/axios';

const BackendStatus = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Check backend status every 10 seconds
        const interval = setInterval(() => {
            const status = isBackendRunning();
            setIsOnline(status);
            
            // Show warning for 3 seconds when backend goes offline
            if (!status && isOnline) {
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isOnline]);

    if (isOnline) {
        return (
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-full shadow-lg text-xs font-medium">
                <Wifi size={14} />
                <span>Backend Online</span>
            </div>
        );
    }

    return (
        <>
            {showWarning && (
                <div className="fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-orange-500 text-white rounded-lg shadow-xl max-w-sm animate-pulse">
                    <AlertCircle size={16} />
                    <div>
                        <p className="font-semibold text-sm">Backend Offline</p>
                        <p className="text-xs opacity-90">Using mock data for development</p>
                    </div>
                </div>
            )}
            
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-full shadow-lg text-xs font-medium">
                <WifiOff size={14} />
                <span>Mock Data</span>
            </div>
        </>
    );
};

export default BackendStatus;
