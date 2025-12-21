import React, { useState, useEffect } from 'react';
import {
    Users,
    Activity,
    Clock,
    TrendingUp,
    UserX,
    ChevronRight,
    Zap,
    BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/associate');
                setStats(res.data.stats);
                setAtRiskStudents(res.data.atRiskStudents || []);
            } catch (err) {
                console.error('Failed to fetch associate stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statConfig = [
        { label: 'Active Students', value: stats?.activeStudents || '0', icon: <Users size={20} />, color: 'bg-orange-500' },
        { label: 'Avg Engagement', value: stats?.avgEngagement || '0%', icon: <Activity size={20} />, color: 'bg-emerald-500' },
        { label: 'Support SLA', value: stats?.supportSLA || '0m', icon: <Clock size={20} />, color: 'bg-sky-500' },
        { label: 'Open Tickets', value: stats?.openTickets || '0', icon: <UserX size={20} />, color: 'bg-rose-500' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                    Engagement <span className="text-orange-500 text-2xl font-medium tracking-normal align-middle ml-1">Terminal</span>
                </h2>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                    Monitoring student lifecycle and support metrics.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-stats gap-6">
                {statConfig.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                Critical <span className="text-rose-500">Retention Alerts</span>
                            </h3>
                            <button className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-orange-500 transition-all flex items-center gap-1">
                                Full Audit <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {atRiskStudents.length > 0 ? (
                                atRiskStudents.map((student, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 border border-slate-200 text-lg font-black shadow-sm group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-600 transition-all">
                                                {student.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 uppercase tracking-tight">{student.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${student.risk === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                                                        }`}>Risk: {student.risk}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• Last Seen: {student.lastActive}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center gap-8">
                                            <div className="hidden lg:block">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Primary Cause</p>
                                                <p className="text-xs font-bold text-slate-600 text-right italic">"{student.reason}"</p>
                                            </div>
                                            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-500 transition-all flex items-center gap-2">
                                                <Zap size={14} fill="currentColor" />
                                                Initiate Outreach
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-slate-100 shadow-sm">
                                        <Zap size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">System Optimized</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">No critical retention risks detected.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black uppercase tracking-tight">Support Velocity</h3>
                        <TrendingUp className="text-emerald-500" />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                <span>Ticket Resolution Goal</span>
                                <span className="text-white">82%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-[82%] h-full bg-orange-500 relative shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unsolved</p>
                                <p className="text-2xl font-black">{stats?.openTickets || '0'}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Rating</p>
                                <p className="text-2xl font-black text-orange-400">4.8</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-500 mb-6">
                        <BookOpen size={32} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Curriculum Feedback</h4>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 max-w-xs mx-auto">Sync support insights with Academic Units for curriculum refinement.</p>
                    <button className="mt-8 px-6 py-3 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all">
                        Compile Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
