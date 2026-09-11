import React, { useEffect, useState } from 'react';
import { Wrench, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

export default function MaintenanceGuard({ children }) {
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await api.get('/public/maintenance-status?portal=partnerSchool');
      if (res.data?.isMaintenance) {
        setMaintenance(res.data);
      } else {
        setMaintenance(null);
      }
    } catch {
      setMaintenance(null);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <>{children}</>;
  }

  if (maintenance && maintenance.isMaintenance) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-slate-800/80 border border-amber-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Coordinator Portal Maintenance</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Partner School System Offline
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {maintenance.message || 'The partner school coordinator portal is undergoing scheduled administrative maintenance.'}
            </p>
          </div>

          {maintenance.endTime && (
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Expected completion by: <strong className="text-white">{new Date(maintenance.endTime).toLocaleTimeString()}</strong></span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={checkStatus}
              disabled={checking}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking Status...' : 'Check If System Restored'}</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Floyd School Partner Ecosystem • Central Super Admin Control
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
