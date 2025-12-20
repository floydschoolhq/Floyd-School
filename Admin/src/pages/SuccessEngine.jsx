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
            console.error('Growth Signal Lost:', err);
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
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Intelligence Pulse...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                        Success <span className="text-sky-500 italic">Engine</span>
                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] rounded-full border border-emerald-500/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Live Intelligence
                        </div>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Growth Intelligence & Student Sentiment Analytics
                    </p>
                </div>
                <button
                    onClick={fetchIntelligence}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    Refresh Signal
                </button>
            </header>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sky-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Lead Velocity</p>
                        <h3 className="text-5xl font-black font-['Outfit'] tracking-tighter mb-2">{intel?.leadVelocity || '0h'}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Conversion Time</p>
                        <div className="mt-8 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                            <TrendingUp size={12} />
                            Signal Strength: 100%
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 text-sky-500/5 group-hover:scale-110 transition-transform duration-700">
                        <Activity size={80} />
                    </div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Sentiment Pulse</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h3 className="text-5xl font-black text-slate-900 font-['Outfit'] tracking-tighter">{intel?.sentimentScore || 0}%</h3>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Satisfaction Score</p>
                    <div className="mt-8 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${intel?.sentimentScore || 0}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full ${intel?.sentimentScore > 70 ? 'bg-emerald-500' : (intel?.sentimentScore > 40 ? 'bg-amber-500' : 'bg-rose-500')}`}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-sky-500 p-8 rounded-[2.5rem] shadow-xl text-white relative group overflow-hidden"
                >
                    <div className="absolute -bottom-4 -right-4 text-white/10 group-hover:rotate-12 transition-transform duration-700">
                        <Shield size={120} />
                    </div>
                    <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Node Health</p>
                    <h3 className="text-4xl font-black font-['Outfit'] tracking-tight mb-2 italic uppercase">Operational</h3>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest">System Integrity Verified</p>
                    <div className="mt-8 flex items-center gap-2 text-white/90 text-[10px] font-black uppercase">
                        <Zap size={12} fill="currentColor" />
                        Infrastructure Level: Alpha
                    </div>
                </motion.div>
            </div>

            {/* Trending Struggles Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    Curriculum <span className="text-rose-500">Struggle Heatmap</span>
                                </h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Identification of High-Friction Modules</p>
                            </div>
                            <BarChart3 className="text-slate-200" size={24} />
                        </div>

                        <div className="space-y-6">
                            {(!intel?.trendingStruggles || intel.trendingStruggles.length === 0) ? (
                                <div className="py-20 text-center space-y-4">
                                    <Shield className="mx-auto text-slate-100" size={48} />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Critical Struggles Detected</p>
                                </div>
                            ) : (
                                intel.trendingStruggles.map((struggle, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-sky-200 hover:bg-sky-50/20 transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 text-lg font-black shadow-sm group-hover:text-sky-500 transition-colors">
                                                0{idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 uppercase dark:text-slate-900 font-['Outfit'] tracking-tight text-lg leading-none mb-2">
                                                    {struggle.module}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${struggle.intensity === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                        }`}>
                                                        {struggle.intensity} Friction
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {struggle.index} Open Feedback Nodes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedModule(struggle.module);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-sky-500 hover:border-sky-500 transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <MessageSquare size={120} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-8">Intelligence Log</h3>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-px h-full bg-slate-700 absolute" />
                                <div className="relative space-y-8">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-2 h-2 bg-sky-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Conversion Logic</p>
                                            <p className="text-sm font-bold tracking-tight text-slate-300">Lead velocity stable at {intel?.leadVelocity}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Sentiment Scan</p>
                                            <p className="text-sm font-bold tracking-tight text-slate-300">Global satisfaction index identified at {intel?.sentimentScore}%</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Friction Audit</p>
                                            <p className="text-sm font-bold tracking-tight text-slate-300">{intel?.trendingStruggles?.length || 0} Critical friction nodes located in curriculum.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-white/5 border border-white/5 p-6 rounded-3xl">
                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <Shield size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Protocol Intelligence</span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed italic">
                                "Growth metrics are within nominal parameters. Focus outreach on 'Converted' leads with velocity {'>'} 24h."
                            </p>
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
