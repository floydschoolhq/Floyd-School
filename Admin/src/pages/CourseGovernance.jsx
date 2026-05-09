import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
    BookOpen, 
    Search, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    AlertCircle, 
    FileText, 
    IndianRupee,
    Layout,
    Layers,
    ChevronRight,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import ModuleEditorModal from '../components/modals/ModuleEditorModal';

const CourseGovernance = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/admin/courses');
            setCourses(res.data.courses);
        } catch (err) {
            console.error('Failed to fetch courses', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const updateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to mark this course as ${status}?`)) return;
        try {
            await api.patch(`/admin/courses/${id}/status`, { status });
            fetchCourses();
            toast.success(`Course ${status} successfully`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const updateEnrollmentStats = async (id, stats) => {
        try {
            await api.patch(`/admin/courses/${id}/enrollment-stats`, stats);
            toast.success('Enrollment matrix updated');
            fetchCourses();
        } catch (err) {
            toast.error('Failed to update enrollment stats');
        }
    };

    const updatePrice = async (id, pricingData) => {
        try {
            await api.patch(`/admin/courses/${id}/price`, pricingData);
            toast.success('Pricing infrastructure updated');
            fetchCourses();
        } catch (err) {
            toast.error('Failed to update pricing');
        }
    };

    const filteredCourses = courses.filter(course =>
        (filter === 'all' || course.status === filter) &&
        (course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Course <span className="text-sky-500 not-italic">Governance</span>
                    </h2>
                    <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px]">
                        Curriculum Oversight & Quality Control
                    </p>
                </div>
                <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
                    {['all', 'published', 'draft'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab
                                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                                : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem]">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-sky-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-4 pl-14 rounded-2xl text-sm font-bold text-white outline-none focus:border-sky-500/30 transition-all placeholder:text-slate-700"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => (
                    <CourseCard 
                        key={course._id} 
                        course={course} 
                        onUpdateStatus={updateStatus}
                        onUpdateStats={updateEnrollmentStats}
                        onUpdatePrice={updatePrice}
                        onManageModules={() => {
                            setSelectedCourse(course);
                            setIsModuleModalOpen(true);
                        }}
                        idx={idx}
                    />
                )) : (
                    <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-[3rem]">
                        <BookOpen size={48} className="text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No courses detected in this sector.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModuleModalOpen && (
                    <ModuleEditorModal 
                        isOpen={isModuleModalOpen}
                        onClose={() => {
                            setIsModuleModalOpen(false);
                            setSelectedCourse(null);
                        }}
                        course={selectedCourse}
                        onUpdate={fetchCourses}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const CourseCard = ({ course, onUpdateStatus, onUpdateStats, onUpdatePrice, onManageModules, idx }) => {
    const [stats, setStats] = useState({ totalSeats: course.totalSeats || 50, manualEnrollmentCount: course.manualEnrollmentCount || 0 });
    const [price, setPrice] = useState(course.price || 0);
    const [originalPrice, setOriginalPrice] = useState(course.originalPrice || 0);
    
    const hasChanges = stats.totalSeats !== course.totalSeats || stats.manualEnrollmentCount !== course.manualEnrollmentCount;
    const hasPriceChanges = price !== course.price || originalPrice !== course.originalPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 hover:border-sky-500/30 transition-all"
        >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                {/* Basic Course Info */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <BookOpen size={24} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{course.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <FileText size={12} /> {course.instructor?.name || 'Unknown Instructor'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${course.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                {course.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Enrollment & Capacity Management */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                    <div className="space-y-2 text-center sm:text-left">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enrollment Control</p>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setStats(s => ({ ...s, manualEnrollmentCount: Math.max(0, s.manualEnrollmentCount - 1) }))}
                                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                            >
                                -
                            </button>
                            <span className="text-xl font-black text-sky-500 w-8 text-center">{stats.manualEnrollmentCount}</span>
                            <button 
                                onClick={() => setStats(s => ({ ...s, manualEnrollmentCount: s.manualEnrollmentCount + 1 }))}
                                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Student Enrolled Last Week</p>
                    </div>

                    <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

                    <div className="space-y-2 text-center sm:text-left">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Capacity</p>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="1" 
                                max="200" 
                                value={stats.totalSeats}
                                onChange={(e) => setStats(s => ({ ...s, totalSeats: parseInt(e.target.value) }))}
                                className="w-24 accent-sky-500 h-1 bg-slate-800 rounded-lg appearance-none"
                            />
                            <span className="text-sm font-black text-white">{stats.totalSeats}</span>
                        </div>
                        <div className={`text-[8px] font-bold uppercase tracking-tighter ${(stats.totalSeats - stats.manualEnrollmentCount) < 5 ? 'text-rose-500' : 'text-slate-600'}`}>
                            Live Preview: {stats.totalSeats - stats.manualEnrollmentCount} Seats Left
                        </div>
                    </div>

                    <button
                        disabled={!hasChanges}
                        onClick={() => onUpdateStats(course._id, stats)}
                        className={`p-3 rounded-xl transition-all ${
                            hasChanges 
                            ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/30' 
                            : 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                        }`}
                        title="Save Matrix Stats"
                    >
                        <CheckCircle2 size={20} />
                    </button>
                </div>

                {/* Price Management */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                    <div className="space-y-2 text-center sm:text-left">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pricing Model (₹)</p>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input 
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-24 bg-slate-800 border border-slate-700 rounded-lg py-2 pl-8 pr-2 text-sm font-black text-white focus:border-sky-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

                    <div className="space-y-2 text-center sm:text-left">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Strike Price (₹)</p>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input 
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                                    className="w-24 bg-slate-800 border border-slate-700 rounded-lg py-2 pl-8 pr-2 text-sm font-black text-slate-500 focus:border-sky-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!hasPriceChanges}
                        onClick={() => onUpdatePrice(course._id, { price, originalPrice })}
                        className={`p-3 rounded-xl transition-all ${
                            hasPriceChanges 
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' 
                            : 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                        }`}
                        title="Update Pricing Infrastructure"
                    >
                        <CheckCircle2 size={20} />
                    </button>
                </div>

                {/* Status Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onManageModules}
                        className="px-4 py-3 bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                        title="Manage Curriculum Modules"
                    >
                        <Layers size={16} /> Content
                    </button>
                    <button
                        onClick={() => window.open(`https://thinkskool-9kaq.vercel.app/course/${course.title?.toLowerCase().replace(/ /g, '-') || '1'}`, '_blank')}
                        className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                        title="Preview in Student Panel"
                    >
                        <Eye size={18} />
                    </button>
                    {course.status !== 'published' && (
                        <button
                            onClick={() => onUpdateStatus(course._id, 'published')}
                            className="px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Approve
                        </button>
                    )}
                    {course.status === 'published' && (
                        <button
                            onClick={() => onUpdateStatus(course._id, 'draft')}
                            className="px-4 py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <AlertCircle size={16} /> Unpublish
                        </button>
                    )}
                </div>
            </div>
            
            {/* Quick Stats Overlay */}
            <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Curriculum:</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{course.modules?.length || 0} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Protocol:</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">₹{course.price} INR</span>
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center gap-2 opacity-50">
                    <Zap size={10} className="text-amber-500" />
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">Nexus Sync Active</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseGovernance;
