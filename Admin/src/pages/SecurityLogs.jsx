import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../api/axios';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Search, Filter, RefreshCw, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState('all');

    useEffect(() => {
        fetchLogs();
    }, [filterLevel]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await adminApi.get(`/admin/logs?level=${filterLevel}`);
            setLogs(res.data.logs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId) => {
        if (!window.confirm('INITIATE TACTICAL SUSPENSION: Are you sure you want to restrict access for this node?')) return;

        try {
            await adminApi.patch(`/admin/users/${userId}/status`, { isActive: false });
            alert('PROTOCOL EXECUTED: User access restricted.');
            fetchLogs();
        } catch (err) {
            alert('TRANSMISSION FAILED: Could not suspend user.');
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'critical': return <AlertTriangle className="text-rose-500" />;
            case 'error': return <AlertCircle className="text-orange-500" />;
            case 'warning': return <AlertCircle className="text-amber-500" />;
            default: return <CheckCircle className="text-emerald-500" />;
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'critical': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'error': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        }
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Shield className="text-sky-400" size={32} />
                        Security <span className="text-sky-400">Logs</span>
                    </h2>
                    <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">
                        System Integrity & Access Audit Trail.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLogs}
                        className="p-3 bg-slate-800 rounded-xl text-sky-400 hover:bg-sky-500 hover:text-white transition-all border border-slate-700"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                        <Lock className="text-sky-500" size={18} />
                        <span className="text-lg font-black text-white">{logs.length}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Events</span>
                    </div>
                </div>
            </header>

            {/* Controls */}
            <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {['all', 'info', 'warning', 'error', 'critical'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterLevel === level
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block"></div>
                <p className="text-xs font-bold text-slate-500 ml-auto">
                    Scanning protocol active...
                </p>
            </div>

            {/* Terminal View */}
            <div className="flex-1 bg-slate-950 rounded-[2rem] border border-slate-800 p-6 overflow-hidden flex flex-col font-mono text-sm relative shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>

                {/* Header */}
                <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Level</div>
                    <div className="col-span-2">Source</div>
                    <div className="col-span-6">Event Details</div>
                </div>

                {/* Logs */}
                <div className="overflow-y-auto flex-1 pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <AnimatePresence>
                        {logs.length > 0 ? (
                            logs.map((log, idx) => (
                                <motion.div
                                    key={log._id || idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
                                >
                                    <div className="col-span-2 text-slate-500 group-hover:text-slate-300 transition-colors text-xs">
                                        {new Date(log.createdAt).toLocaleTimeString()}
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border ${getLevelColor(log.level)} text-[10px] uppercase font-black tracking-wider`}>
                                            {getLevelIcon(log.level)}
                                            {log.level}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-sky-500 group-hover:text-sky-400 font-bold">
                                        {log.ip || 'System'}
                                    </div>
                                    <div className="col-span-6 text-slate-400 group-hover:text-white transition-colors truncate flex items-center justify-between gap-4">
                                        <div className="truncate">
                                            <span className="font-bold text-slate-300 mr-2">[{log.event}]</span>
                                            {log.message}
                                        </div>
                                        {log.user && (
                                            <button
                                                onClick={() => handleToggleUserStatus(log.user._id || log.user)}
                                                className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all whitespace-nowrap"
                                            >
                                                Suspend User
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-slate-600">
                                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No security events recorded in this sector.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SecurityLogs;
