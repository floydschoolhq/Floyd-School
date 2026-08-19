import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Activity,
    Zap,
    BarChart3,
    AlertCircle,
    ChevronRight,
    RefreshCw,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing analytics...</p>
        </div>
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Insight <span className="text-blue-600">Dashboard</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        Real-time student engagement, friction tracker, and growth analytics
                    </p>
                </div>
                <button
                    onClick={fetchIntelligence}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    Update Data
                </button>
            </header>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group">
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">Lead Velocity</p>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1">{intel?.leadVelocity || '0h'}</h3>
                    <p className="text-slate-500 text-xs font-medium">Average conversion speed</p>
                    <div className="mt-4 flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 w-fit px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase">
                        <Activity size={12} />
                        Active Growth
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group">
                    <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">Student Sentiment</p>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1">{intel?.sentimentScore || 0}%</h3>
                    <p className="text-slate-500 text-xs font-medium">Global satisfaction index</p>
                    <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            style={{ width: `${intel?.sentimentScore || 0}%` }}
                            className={`h-full rounded-full transition-all ${intel?.sentimentScore > 70 ? 'bg-emerald-500' : (intel?.sentimentScore > 40 ? 'bg-blue-500' : 'bg-rose-500')}`}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group">
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">Platform Health</p>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1 uppercase">Healthy</h3>
                    <p className="text-slate-500 text-xs font-medium">All systems fully operational</p>
                    <div className="mt-4 flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-100 w-fit px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase">
                        <Zap size={12} fill="currentColor" />
                        Live Status
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Friction Heatmap */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex-1">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    Learning Friction Tracker
                                </h3>
                                <p className="text-slate-500 text-xs font-medium mt-0.5">Identifying modules where students require assistance</p>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                                <AlertCircle size={18} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {(!intel?.trendingStruggles || intel.trendingStruggles.length === 0) ? (
                                <div className="py-12 text-center space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Shield className="text-slate-300 mx-auto" size={32} />
                                    <p className="text-slate-900 font-bold text-xs">Smooth Integration</p>
                                    <p className="text-slate-500 text-xs">No learning roadblocks detected in current curriculum.</p>
                                </div>
                            ) : (
                                intel.trendingStruggles.map((struggle, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all group"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-700 font-black text-xs border border-slate-200">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">
                                                    {struggle.module}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${struggle.intensity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                                        {struggle.intensity} Difficulty
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        • {struggle.index} inquiries
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedModule(struggle.module);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 bg-white text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg transition-all border border-slate-200 shadow-xs cursor-pointer"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Intelligence Feed */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                                    <Zap size={16} fill="currentColor" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Dashboard Summary</h3>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Registration Flow</p>
                                    <p className="text-xs font-semibold text-slate-800">Lead conversion pace is currently at {intel?.leadVelocity || 'stable'} speed.</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Platform Sentiment</p>
                                    <p className="text-xs font-semibold text-slate-800">Student satisfaction score sits at {intel?.sentimentScore || 0}% globally.</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Curriculum Friction</p>
                                    <p className="text-xs font-semibold text-slate-800">Currently tracking {intel?.trendingStruggles?.length || 0} modules with elevated friction.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-1.5 text-emerald-700">
                                <Shield size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Recommendations</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                Platform metrics are balanced. Proactively address modules with higher inquiries.
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
