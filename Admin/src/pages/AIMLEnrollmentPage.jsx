import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    Users, 
    Save, 
    AlertCircle, 
    TrendingUp, 
    ShieldCheck,
    ArrowRight,
    Zap
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AIMLEnrollmentPage = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSeats: 50,
        manualEnrollmentCount: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchAIMLCourse = async () => {
            try {
                const res = await api.get('/admin/courses');
                const aiml = res.data.courses.find(c => 
                    c.title.toLowerCase().includes('foundation of ai') || 
                    c.title.toLowerCase().includes('artificial intelligence') || 
                    c.title.toLowerCase().includes('ai & ml')
                );
                
                if (aiml) {
                    setCourse(aiml);
                    setStats({
                        totalSeats: aiml.totalSeats || 50,
                        manualEnrollmentCount: aiml.manualEnrollmentCount || 0
                    });
                }
            } catch (err) {
                toast.error('Failed to initialize AI & ML Matrix');
            } finally {
                setLoading(false);
            }
        };

        fetchAIMLCourse();
    }, []);

    const handleSave = async () => {
        if (!course) return;
        setIsSaving(true);
        try {
            await api.patch(`/admin/courses/${course._id}/enrollment-stats`, stats);
            toast.success('AI & ML Enrollment Matrix Updated');
            setCourse({ ...course, ...stats });
        } catch (err) {
            toast.error('Failed to sync changes with Nexus');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full bg-[#0b0f1a]">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
                <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 animate-pulse" size={24} />
            </div>
        </div>
    );

    if (!course) return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-6 bg-rose-500/10 rounded-full">
                <AlertCircle size={48} className="text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Course ID Missing</h2>
            <p className="text-slate-500 font-bold max-w-md">No AI & ML course detected in the curriculum database.</p>
        </div>
    );

    const seatsLeft = stats.totalSeats - stats.manualEnrollmentCount;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                            <Cpu className="text-sky-400" size={32} />
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                            AI & ML <span className="text-sky-500 not-italic">Matrix</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] ml-1">
                        Dynamic Enrollment & Capacity Protocol
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-[2rem] border border-slate-800">
                    <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Sync Enabled</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="relative z-10 space-y-12">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Enrollment Management</h3>
                                <Zap className="text-sky-500" size={24} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Students Enrolled Last Week</label>
                                    <div className="flex items-center gap-6">
                                        <button 
                                            onClick={() => setStats(s => ({ ...s, manualEnrollmentCount: Math.max(0, s.manualEnrollmentCount - 1) }))}
                                            className="w-16 h-16 rounded-[2rem] bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-black text-slate-400 hover:text-white transition-all"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 text-center font-black text-7xl text-white italic">
                                            {String(stats.manualEnrollmentCount).padStart(2, '0')}
                                        </div>
                                        <button 
                                            onClick={() => setStats(s => ({ ...s, manualEnrollmentCount: s.manualEnrollmentCount + 1 }))}
                                            className="w-16 h-16 rounded-[2rem] bg-sky-500 border border-sky-400 flex items-center justify-center text-2xl font-black text-slate-950 hover:bg-sky-400 transition-all"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Total Seating Capacity</label>
                                    <div className="space-y-8">
                                        <div className="text-5xl font-black text-white tracking-tighter italic">{stats.totalSeats}</div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="150" 
                                            value={stats.totalSeats}
                                            onChange={(e) => setStats(s => ({ ...s, totalSeats: parseInt(e.target.value) }))}
                                            className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-sky-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-[2.5rem] flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Seats Left</p>
                                <p className={`text-3xl font-black italic ${seatsLeft < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {seatsLeft} Units
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-[2.5rem] flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Occupancy Rate</p>
                                <p className="text-3xl font-black text-sky-500 italic">
                                    {Math.round((stats.manualEnrollmentCount / stats.totalSeats) * 100)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-sky-500/5 border border-sky-500/10 rounded-[2.5rem] p-8 space-y-8"
                    >
                        <h4 className="text-lg font-black text-white uppercase tracking-tight italic">Action Matrix</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                <ArrowRight size={16} className="text-sky-500" />
                                <span>Label: Last Week Enrolled</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                <ArrowRight size={16} className="text-rose-500" />
                                <span>Alert Threshold: 10 Seats</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                                isSaving ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-950 hover:bg-sky-400 active:scale-95'
                            }`}
                        >
                            {isSaving ? <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div> : <><Save size={20} /> Sync to Production</>}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AIMLEnrollmentPage;
