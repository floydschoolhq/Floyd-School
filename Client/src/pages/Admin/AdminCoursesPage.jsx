import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Plus, Minus, Save, UserCheck, Users, AlertCircle, IndianRupee } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/courses');
            setCourses(res.data);
        } catch (err) {
            console.error('Error fetching courses:', err);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStats = async (courseId, stats) => {
        try {
            await api.patch(`/api/courses/${courseId}/enrollment-stats`, stats);
            toast.success('Course stats updated');
            fetchCourses(); // Refresh
        } catch (err) {
            console.error('Error updating stats:', err);
            toast.error('Failed to update stats');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-['Outfit']">
            {/* Header */}
            <div className="bg-slate-900 border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Course Management</h1>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enrollment & Capacity Control</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/admin/coupons')}
                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <IndianRupee className="w-4 h-4" />
                            Manage Coupons
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Ecosystem...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseControlCard 
                                key={course._id} 
                                course={course} 
                                onUpdate={handleUpdateStats} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CourseControlCard = ({ course, onUpdate }) => {
    const [stats, setStats] = useState({
        totalSeats: course.totalSeats || 50,
        manualEnrollmentCount: course.manualEnrollmentCount || 0,
        price: course.price || 0,
        originalPrice: course.originalPrice || 0
    });

    const hasChanges = stats.totalSeats !== course.totalSeats || 
                       stats.manualEnrollmentCount !== course.manualEnrollmentCount ||
                       stats.price !== course.price ||
                       stats.originalPrice !== course.originalPrice;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden p-6 hover:border-blue-500/30 transition-all group"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white line-clamp-1">{course.title}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{course.category}</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Manual Enrollment Control */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <UserCheck className="w-3 h-3" /> Students Enrolled
                        </span>
                        <span className="text-xl font-headline font-black text-blue-400">
                            {stats.manualEnrollmentCount}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setStats(prev => ({ ...prev, manualEnrollmentCount: Math.max(0, prev.manualEnrollmentCount - 1) }))}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group/btn"
                        >
                            <Minus className="w-4 h-4 text-slate-400 group-hover/btn:text-white" />
                        </button>
                        <button 
                            onClick={() => setStats(prev => ({ ...prev, manualEnrollmentCount: prev.manualEnrollmentCount + 1 }))}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group/btn"
                        >
                            <Plus className="w-4 h-4 text-slate-400 group-hover/btn:text-white" />
                        </button>
                    </div>
                </div>

                {/* Total Capacity Control */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-3 h-3" /> Total Capacity
                        </span>
                        <span className="text-xl font-headline font-black text-white">
                            {stats.totalSeats}
                        </span>
                    </div>
                    <input 
                        type="range"
                        min="1"
                        max="500"
                        value={stats.totalSeats}
                        onChange={(e) => setStats(prev => ({ ...prev, totalSeats: parseInt(e.target.value) }))}
                        className="w-full accent-blue-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Price Control */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <IndianRupee className="w-3 h-3" /> Sale Price
                        </label>
                        <input 
                            type="number"
                            value={stats.price}
                            onChange={(e) => setStats(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <IndianRupee className="w-3 h-3" /> Original
                        </label>
                        <input 
                            type="number"
                            value={stats.originalPrice}
                            onChange={(e) => setStats(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Seats Left Preview */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    (stats.totalSeats - stats.manualEnrollmentCount) <= 5 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Seats Left</span>
                    </div>
                    <span className="font-headline font-black text-lg">
                        {stats.totalSeats - stats.manualEnrollmentCount}
                    </span>
                </div>

                {/* Save Button */}
                <button 
                    disabled={!hasChanges}
                    onClick={() => onUpdate(course._id, stats)}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                        hasChanges 
                        ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:bg-blue-700' 
                        : 'bg-white/5 text-slate-500 cursor-not-allowed'
                    }`}
                >
                    <Save className="w-4 h-4" /> Update Ecosystem
                </button>
            </div>
        </motion.div>
    );
};

export default AdminCoursesPage;
