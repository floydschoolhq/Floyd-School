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
import api from '../api/axios';

const PlatformAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.stats);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statConfig = [
        { key: 'totalUsers', label: 'Total Users', growth: '+12%', icon: <Users size={24} />, color: 'sky' },
        { key: 'revenue', label: 'Platform Revenue', growth: '+8%', icon: <DollarSign size={24} />, color: 'emerald', prefix: '$' },
        { key: 'totalStudents', label: 'Active Students', growth: '+24%', icon: <Activity size={24} />, color: 'amber' },
        { key: 'openTickets', label: 'Pending Support', growth: '-5%', icon: <Zap size={24} />, color: 'indigo' },
    ];

    // Helper to format time (e.g. "2m ago")
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* ... header ... */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Strategic <span className="text-sky-500 not-italic">Intelligence</span>
                    </h2>
                    <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Real-time platform telemetry active
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                        <Globe size={18} className="text-sky-500" />
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Nodes</p>
                            <p className="text-sm font-black text-white">12 Locations</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-stats gap-8">
                {statConfig.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-sky-500/30 transition-all"
                    >
                        <div className={`w-14 h-14 bg-${stat.color}-500/10 text-${stat.color}-400 rounded-2xl flex items-center justify-center mb-6 border border-${stat.color}-500/20`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                        <div className="flex items-end gap-3 mt-1">
                            <p className="text-3xl font-black text-white tracking-tighter">
                                {stat.prefix}{stats[stat.key]?.toLocaleString()}
                            </p>
                            <span className={`text-[10px] font-black ${stat.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} mb-1`}>
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
                            Growth Velocity
                        </h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4">
                        {[stats.totalUsers * 0.1, stats.totalUsers * 0.2, stats.totalUsers * 0.15, stats.totalUsers * 0.3, stats.totalUsers * 0.5, stats.totalUsers * 0.7, stats.totalUsers].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h / stats.totalUsers) * 100}%` }}
                                    transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                    className="w-full bg-gradient-to-t from-sky-500/20 to-sky-500 rounded-2xl relative"
                                />
                                <p className="text-center text-[8px] font-black text-slate-600 mt-4 uppercase tracking-tighter">Node {i + 1}</p>
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
                            {stats.recentEvents?.length > 0 ? stats.recentEvents.map((ev, i) => (
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
