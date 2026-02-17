import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    Clock,
    Star,
    ChevronRight,
    Play,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/mentor');
                setData(res.data);
            } catch (err) {
                console.error('Failed to fetch mentor dashboard', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();

        const timer = setTimeout(() => {
            if (loading) setShowTimeoutWarning(true);
        }, 7000);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: 'Total Students', value: data?.stats?.totalStudents || '0', icon: <Users size={20} />, color: 'bg-blue-500' },
        { label: 'Active Courses', value: data?.stats?.activeCourses || '0', icon: <BookOpen size={20} />, color: 'bg-emerald-500' },
        { label: 'Review Pending', value: data?.stats?.pendingAssignments || '0', icon: <Clock size={20} />, color: 'bg-amber-500' },
        { label: 'Overall Rating', value: data?.stats?.overallRating || '0', icon: <Star size={20} />, color: 'bg-purple-500' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
            {showTimeoutWarning && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 max-w-xs text-center p-4 bg-sky-50 rounded-2xl border border-sky-100"
                >
                    <p className="text-xs font-bold text-sky-800">Connection is slow.</p>
                    <p className="text-[10px] text-sky-600 uppercase tracking-widest">The ecosystem link is taking longer than expected.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-sky-600 hover:underline"
                    >
                        Sync Interface
                    </button>
                </motion.div>
            )}
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Academic <span className="text-sky-500 text-2xl font-medium tracking-normal align-middle ml-1">Terminal</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">Monitoring course performance and student growth.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol Active</span>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-stats gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Sessions */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                Direct <span className="text-sky-500 text-sm font-bold bg-sky-50 px-2 py-0.5 rounded-lg">Sessions</span>
                            </h3>
                            <button className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-sky-500 transition-all flex items-center gap-1">
                                Full Archive <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.recentSessions?.length > 0 ? (
                                data.recentSessions.map((session, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-sky-200 hover:bg-sky-50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 border border-slate-200 shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-all">
                                                <Play size={20} fill="currentColor" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 uppercase tracking-tight">{session.title}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{session.topic}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</p>
                                            <p className="text-xs font-black text-emerald-500 mt-1 uppercase">Live Stream</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active sessions located in the grid.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications / Pending */}
                <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black uppercase tracking-tight italic">System <span className="text-sky-500 not-italic">Sync</span></h3>
                        <Calendar className="text-sky-500" />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Assignment Backlog</p>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-black">{data?.stats?.pendingAssignments || '0'}</p>
                                <button className="text-[10px] font-black text-sky-400 uppercase tracking-widest hover:text-white transition-all">Resolve →</button>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Efficiency</p>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3">
                                <div className="w-[94%] h-full bg-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">94% uptime verified</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
