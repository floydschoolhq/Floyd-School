import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, RefreshCw, Lock } from 'lucide-react';
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
            const res = await api.get(`/admin/logs?level=${filterLevel}`);
            setLogs(res.data.logs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId) => {
        if (!window.confirm('Are you sure you want to restrict access for this user?')) return;

        try {
            await api.patch(`/admin/users/${userId}/status`, { isActive: false });
            alert('User access suspended.');
            fetchLogs();
        } catch (err) {
            alert('Could not suspend user.');
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'critical': return <AlertTriangle className="text-rose-600" size={13} />;
            case 'error': return <AlertCircle className="text-orange-600" size={13} />;
            case 'warning': return <AlertCircle className="text-amber-600" size={13} />;
            default: return <CheckCircle className="text-emerald-600" size={13} />;
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'critical': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'error': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Shield className="text-blue-600" size={28} />
                        Security <span className="text-blue-600">Audit Logs</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-1 text-xs">
                        System integrity, suspicious access monitoring, and authentication trail.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs">
                        <Lock className="text-blue-600" size={16} />
                        <span className="text-base font-black text-slate-900">{logs.length}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Events</span>
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="p-2.5 bg-slate-900 text-white hover:bg-blue-600 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {['all', 'info', 'warning', 'error', 'critical'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${filterLevel === level
                                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <p className="text-xs font-medium text-slate-400">
                    Active security event stream
                </p>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">IP / Origin</th>
                                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Event Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            <AnimatePresence>
                                {logs.length > 0 ? (
                                    logs.map((log, idx) => (
                                        <motion.tr
                                            key={log._id || idx}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="hover:bg-slate-50/70 transition-colors group"
                                        >
                                            <td className="px-6 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-3.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${getLevelColor(log.level)} text-[10px] uppercase font-bold`}>
                                                    {getLevelIcon(log.level)}
                                                    {log.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-blue-600 font-mono font-bold whitespace-nowrap">
                                                {log.ip || 'System'}
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-700">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <span className="font-bold text-slate-900 mr-2">[{log.event}]</span>
                                                        {log.message}
                                                    </div>
                                                    {log.user && (
                                                        <button
                                                            onClick={() => handleToggleUserStatus(log.user._id || log.user)}
                                                            className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-rose-100 transition-all whitespace-nowrap cursor-pointer"
                                                        >
                                                            Suspend
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-16 text-slate-400">
                                            <Shield size={36} className="mx-auto mb-2 opacity-30 text-slate-400" />
                                            <p className="text-xs font-medium">No security events recorded in this filter category.</p>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityLogs;
