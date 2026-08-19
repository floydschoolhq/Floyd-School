import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    Save, 
    AlertCircle, 
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
                    c.title === 'Foundation of AI and Machine Learning' ||
                    c.title.toLowerCase().includes('foundation of ai') || 
                    c.title.toLowerCase().includes('artificial intelligence')
                );
                
                if (aiml) {
                    setCourse(aiml);
                    setStats({
                        totalSeats: aiml.totalSeats || 50,
                        manualEnrollmentCount: aiml.manualEnrollmentCount || 45
                    });
                }
            } catch (err) {
                toast.error('Failed to load AI & ML course');
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
            toast.error('Failed to sync changes');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!course) return (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <AlertCircle size={40} className="text-rose-500" />
            <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
            <p className="text-slate-500 text-xs">No AI & ML course detected in curriculum.</p>
        </div>
    );

    const seatsLeft = stats.totalSeats - stats.manualEnrollmentCount;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <Cpu className="text-blue-600" size={28} />
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            AI & ML <span className="text-blue-600">Matrix</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-xs font-medium mt-1">
                        Dynamic Enrollment & Capacity Protocol Management
                    </p>
                </div>

                <div className="px-3.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-emerald-700">Live Sync Enabled</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">Enrollment Controls</h3>
                            <Zap className="text-blue-600" size={20} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-600 block">Students Enrolled (Badge Number)</label>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setStats(s => ({ ...s, manualEnrollmentCount: Math.max(0, s.manualEnrollmentCount - 1) }))}
                                        className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-black text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center font-black text-5xl text-slate-900">
                                        {String(stats.manualEnrollmentCount).padStart(2, '0')}
                                    </div>
                                    <button 
                                        onClick={() => setStats(s => ({ ...s, manualEnrollmentCount: s.manualEnrollmentCount + 1 }))}
                                        className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-600 flex items-center justify-center text-xl font-black text-white hover:bg-blue-700 transition-all cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-600 block">Total Seating Capacity</label>
                                <div className="space-y-4">
                                    <div className="text-4xl font-black text-slate-900">{stats.totalSeats} Seats</div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="150" 
                                        value={stats.totalSeats}
                                        onChange={(e) => setStats(s => ({ ...s, totalSeats: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Seats Left</p>
                            <p className={`text-2xl font-black mt-1 ${seatsLeft < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {seatsLeft} Seats Remaining
                            </p>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupancy Rate</p>
                            <p className="text-2xl font-black text-blue-600 mt-1">
                                {Math.round((stats.manualEnrollmentCount / stats.totalSeats) * 100)}% Full
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Configuration Details</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
                                <ArrowRight size={14} className="text-blue-600" />
                                <span>Label: Last Week Enrolled</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
                                <ArrowRight size={14} className="text-rose-500" />
                                <span>Alert Threshold: 10 Seats</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={16} /> Save to Production</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIMLEnrollmentPage;
