import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Activity,
    Zap,
    MessageSquare,
    BarChart3,
    AlertCircle,
    ChevronRight,
    RefreshCw,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import FrictionDetailsModal from '../components/modals/FrictionDetailsModal';

const SuccessEngine = () => {
    const [intel, setIntel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    const fetchIntelligence = async () => {
        setRefreshing(true);
        try {
            const res = await api.get('/admin/growth-intelligence');
            setIntel(res.data.intelligence);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchIntelligence();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing analytics...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 font-['Inter']">
            {/* Professional Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
                        Insight <span className="text-blue-600">Dashboard</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                        Real-time student engagement and growth analytics.
                    </p>
                </div>
                <button
                    onClick={fetchIntelligence}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    Update Data
                </button>
            </header>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 text-blue-100 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                        <TrendingUp size={120} />
                    </div>
                    <p className="text-blue-600 font-black text-[11px] uppercase tracking-widest mb-4">Lead Velocity</p>
                    <h3 className="text-5xl font-black text-slate-900 font-['Outfit'] tracking-tighter mb-1">{intel?.leadVelocity || '0h'}</h3>
                    <p className="text-slate-500 text-sm font-medium">Average conversion time</p>
                    <div className="mt-8 flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        <Activity size={12} />
                        Active Growth
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 text-indigo-100 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">
                        <BarChart3 size={120} />
                    </div>
                    <p className="text-indigo-600 font-black text-[11px] uppercase tracking-widest mb-4">Student Sentiment</p>
                    <h3 className="text-5xl font-black text-slate-900 font-['Outfit'] tracking-tighter mb-1">{intel?.sentimentScore || 0}%</h3>
                    <p className="text-slate-500 text-sm font-medium">Global satisfaction index</p>
                    <div className="mt-8 w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${intel?.sentimentScore || 0}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full transition-colors ${intel?.sentimentScore > 70 ? 'bg-emerald-500' : (intel?.sentimentScore > 40 ? 'bg-blue-500' : 'bg-rose-500')}`}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group"
                >
                    <div className="absolute -bottom-8 -right-8 text-white/5 transform group-hover:-translate-x-4 group-hover:-translate-y-4 transition-all duration-700">
                        <Shield size={160} />
                    </div>
                    <p className="text-blue-400 font-black text-[11px] uppercase tracking-widest mb-4">Platform Health</p>
                    <h3 className="text-4xl font-black font-['Outfit'] tracking-tight mb-1 uppercase">Healthy</h3>
                    <p className="text-slate-400 text-sm font-medium">All systems operational</p>
                    <div className="mt-8 flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase">
                        <Zap size={12} fill="currentColor" />
                        Intelligence Mode: Static
                    </div>
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Friction Heatmap */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 font-['Outfit'] uppercase tracking-tight">
                                    Learning <span className="text-blue-600">Friction Tracker</span>
                                </h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Identifying modules where students require assistance.</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <AlertCircle size={24} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(!intel?.trendingStruggles || intel.trendingStruggles.length === 0) ? (
                                <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                        <Shield className="text-blue-200" size={32} />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-black uppercase text-xs tracking-widest mb-1">Smooth Integration</p>
                                        <p className="text-slate-500 text-sm font-medium">No learning roadblocks detected in current curriculum.</p>
                                    </div>
                                </div>
                            ) : (
                                intel.trendingStruggles.map((struggle, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 font-['Outfit'] tracking-tight text-lg mb-1 leading-none">
                                                    {struggle.module}
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${struggle.intensity === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {struggle.intensity} Difficulty
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        • {struggle.index} Student Inquiries
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedModule(struggle.module);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Intelligence Feed */}
                <div className="lg:col-span-4">
                    <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl text-white h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight font-['Outfit']">Dashboard Summary</h3>
                        </div>

                        <div className="flex-1 space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-800" />

                            <div className="flex gap-5 items-start relative z-10">
                                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full mt-1 border-4 border-slate-900" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Registration Flow</p>
                                    <p className="text-sm font-bold text-slate-200 tracking-tight leading-snug">Average lead conversion is currently at {intel?.leadVelocity || 'stable'} speed.</p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-start relative z-10">
                                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full mt-1 border-4 border-slate-900" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Platform Sentiment</p>
                                    <p className="text-sm font-bold text-slate-200 tracking-tight leading-snug">Average student satisfaction sits at {intel?.sentimentScore || 0}% globally.</p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-start relative z-10">
                                <div className="w-3.5 h-3.5 bg-amber-500 rounded-full mt-1 border-4 border-slate-900" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Curriculum Friction</p>
                                    <p className="text-sm font-bold text-slate-200 tracking-tight leading-snug">Currently tracking {intel?.trendingStruggles?.length || 0} modules with elevated friction.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-white/5 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                                    <Shield size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Recommended Actions</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold leading-relaxed italic">
                                    "Platform metrics are balanced. We recommend focusing outreach on students with higher lead velocity nodes."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FrictionDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                moduleTitle={selectedModule}
            />
        </div>
    );
};

export default SuccessEngine;
