import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    DollarSign,
    Zap,
    Activity,
    Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const PlatformAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.get('/admin/stats');
            if (res.data.success) {
                setStats(res.data.stats);
            } else {
                setError(res.data.message || 'Unknown sector error');
            }
        } catch (err) {
            console.error('Failed to fetch stats', err);
            setError(err.response?.data?.message || err.message || 'Signal lost');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatTimeAgo = (date) => {
        if (!date) return 'Unknown';
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';

        const seconds = Math.floor((new Date() - d) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return d.toLocaleDateString();
    };

    const statConfig = [
        { key: 'totalUsers', label: 'Total Users', growth: '+12%', icon: <Users size={22} />, color: 'blue' },
        { key: 'totalEnrollments', label: 'Total Enrollments', growth: '+8%', icon: <DollarSign size={22} />, color: 'emerald', prefix: '' },
        { key: 'totalStudents', label: 'Active Students', growth: '+24%', icon: <Activity size={22} />, color: 'amber' },
        { key: 'openTickets', label: 'Pending Support', growth: '-5%', icon: <Zap size={22} />, color: 'indigo' },
    ];

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">Synchronizing Core Metrics...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="bg-white border border-rose-200 p-8 rounded-3xl text-center max-w-md shadow-sm">
                    <Activity size={40} className="text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Telemetry Failure</h2>
                    <p className="text-rose-600 font-bold mb-2 uppercase text-[10px] tracking-widest">{error}</p>
                    <p className="text-slate-500 text-sm font-medium mb-6">System encountered an error while synchronizing platform diagnostics.</p>
                    <button
                        onClick={fetchStats}
                        className="w-full bg-slate-900 text-white p-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-blue-600 transition-all cursor-pointer"
                    >
                        Force Re-Sync
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Platform <span className="text-blue-600">Analytics</span></h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-1">Global System Performance & User Growth Matrix</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Live Platform Feed</span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statConfig.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={
                                stat.color === 'blue' ? 'w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform' :
                                    stat.color === 'emerald' ? 'w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform' :
                                        stat.color === 'amber' ? 'w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform' :
                                            'w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform'
                            }>
                                {stat.icon}
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.growth?.startsWith('+') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {stat.growth}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            {stat.prefix}{stats?.[stat.key]?.toLocaleString() || '0'}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Graphs & Live Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                            <TrendingUp className="text-blue-600" size={20} />
                            New Signups (Last 7 Days)
                        </h3>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                            {stats?.newSignups || 0} Total
                        </span>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-3 px-2 pb-2">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 rounded-xl h-48 flex items-end p-1">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.05 }}
                                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg group-hover:from-blue-700 group-hover:to-indigo-600 transition-all shadow-xs"
                                    ></motion.div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center justify-between pb-3 border-b border-slate-100">
                            Live Activity Stream
                            <Radio size={14} className="text-blue-600 animate-pulse" />
                        </h3>
                        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                            {stats?.recentEvents?.length > 0 ? stats.recentEvents.map((ev, i) => (
                                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${ev.severity === 'High' ? 'bg-rose-500' : ev.severity === 'Info' ? 'bg-blue-500' : 'bg-slate-400'
                                        }`}></div>
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 leading-tight truncate">{ev.event}</p>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                            <span>{ev.type}</span>
                                            <span>•</span>
                                            <span>{formatTimeAgo(ev.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-400 font-medium text-center py-8">No recent telemetry available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalytics;
