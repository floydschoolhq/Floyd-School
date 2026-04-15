import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    DollarSign,
    Monitor,
    Globe,
    Zap,
    ArrowUpRight,
    ChevronRight,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '../api/axios';

const PlatformAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await adminApi.get('/admin/stats');
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
        { key: 'totalUsers', label: 'Total Users', growth: '+12%', icon: <Users size={24} />, color: 'sky' },
        { key: 'totalEnrollments', label: 'Total Enrollments', growth: '+8%', icon: <DollarSign size={24} />, color: 'emerald', prefix: '' },
        { key: 'totalStudents', label: 'Active Students', growth: '+24%', icon: <Activity size={24} />, color: 'amber' },
        { key: 'openTickets', label: 'Pending Support', growth: '-5%', icon: <Zap size={24} />, color: 'indigo' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Core Metrics...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="bg-slate-900/50 border border-rose-500/30 p-12 rounded-[3rem] text-center max-w-md backdrop-blur-xl">
                    <Activity size={48} className="text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase mb-2">Telemetry Failure</h2>
                    <p className="text-rose-500 font-bold mb-2 uppercase text-[10px] tracking-widest">{error}</p>
                    <p className="text-slate-400 font-bold mb-8">System encountered a critical error while synchronizing platform diagnostics.</p>
                    <button
                        onClick={fetchStats}
                        className="w-full bg-white text-slate-950 p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all"
                    >
                        Force Re-Sync
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight italic uppercase">Platform <span className="text-sky-500">Analytics</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-1">Global System Performance & User Growth Matrix</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                    <div className="px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-black text-sky-400 uppercase tracking-widest">Live Feed</div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statConfig.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-sky-500/30 transition-all"
                    >
                        <div className={
                            stat.color === 'sky' ? 'w-14 h-14 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20' :
                                stat.color === 'emerald' ? 'w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20' :
                                    stat.color === 'amber' ? 'w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20' :
                                        'w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20'
                        }>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                        <div className="flex items-end gap-3 mt-1">
                            <p className="text-3xl font-black text-white tracking-tighter">
                                {stat.prefix}{stats?.[stat.key]?.toLocaleString() || '0'}
                            </p>
                            <span className={`text-[10px] font-black ${stat.growth?.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} mb-1`}>
                                {stat.growth}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <TrendingUp className="text-sky-400" />
                            New Signups (7d): <span className="text-white">{stats?.newSignups || 0}</span>
                        </h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="w-full relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className="w-full bg-gradient-to-t from-sky-600/20 to-sky-500 rounded-t-xl group-hover:from-sky-500 group-hover:to-sky-400 transition-all"
                                    ></motion.div>
                                </div>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                            Live Terminal
                            <span className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></span>
                        </h3>
                        <div className="space-y-6">
                            {stats?.recentEvents?.length > 0 ? stats.recentEvents.map((ev, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${ev.severity === 'High' ? 'bg-rose-500' : ev.severity === 'Info' ? 'bg-sky-500' : 'bg-slate-600'
                                        }`}></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-300 leading-tight">{ev.event}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{ev.type}</span>
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">• {formatTimeAgo(ev.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-500 font-bold">No recent telemetry available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalytics;
