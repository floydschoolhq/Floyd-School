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
    Zap,
    Users,
    Settings,
    MoreVertical,
    Plus,
    Terminal,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import CourseMasterModal from '../components/modals/CourseMasterModal';

const CourseGovernance = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);

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

    const handleCreateCourse = async () => {
        const title = window.prompt('Enter Course Title:');
        if (!title) return;
        try {
            await api.post('/courses', { 
                title, 
                description: 'Placeholder description...',
                instructor: courses[0]?.instructor?._id || '6605786a3e6f9a001a8f903a' // Fallback to first mentor or hardcoded ID if empty
            });
            toast.success('Course entity initialized');
            fetchCourses();
        } catch (err) {
            toast.error('Failed to initialize course');
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
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Root <span className="text-sky-500 not-italic">Governance</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.5em] text-[9px] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                        Neural Curriculum Control Center v4.2
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleCreateCourse}
                        className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-sky-500 transition-all flex items-center gap-2 shadow-lg shadow-white/5"
                    >
                        <Plus size={18} /> Initialize Course
                    </button>
                    <div className="h-10 w-px bg-slate-800 hidden md:block"></div>
                    <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-[1.5rem]">
                        {['all', 'published', 'draft'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === tab
                                    ? 'bg-slate-800 text-white shadow-lg shadow-black/20'
                                    : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
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
                        onOpenMaster={() => {
                            setSelectedCourseId(course._id);
                            setIsMasterModalOpen(true);
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
                {isMasterModalOpen && (
                    <CourseMasterModal 
                        isOpen={isMasterModalOpen}
                        onClose={() => {
                            setIsMasterModalOpen(false);
                            setSelectedCourseId(null);
                        }}
                        courseId={selectedCourseId}
                        onUpdate={fetchCourses}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const CourseCard = ({ course, onOpenMaster, idx }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring', damping: 20 }}
            className="group relative bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-1 hover:border-sky-500/50 transition-all duration-500"
        >
            <div className="bg-slate-950/40 rounded-[2.25rem] p-6 flex flex-col lg:flex-row items-center justify-between gap-8 group-hover:bg-slate-950/60 transition-all">
                {/* Course Main Intel */}
                <div className="flex items-center gap-8 flex-1 w-full lg:w-auto">
                    <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent z-10"></div>
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                                <BookOpen size={32} />
                            </div>
                        )}
                        <div className="absolute top-2 right-2 z-20">
                            <div className={`w-3 h-3 rounded-full border-2 border-slate-950 ${course.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[8px] font-black text-sky-500 uppercase tracking-widest">{course.category || 'Development'}</span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <Users size={12} /> {course.enrolledStudents?.length || 0} Registered
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight truncate group-hover:text-sky-400 transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                            <Target size={12} className="text-sky-500" /> Directed by {course.instructor?.name || 'Root Mentor'}
                        </p>
                    </div>
                </div>

                {/* Quick Metrics Protocol */}
                <div className="flex items-center gap-10 bg-slate-900/50 px-8 py-5 rounded-[2rem] border border-slate-800/50 w-full lg:w-auto">
                    <div className="text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Commercial</p>
                        <p className="text-lg font-black text-white leading-none">₹{course.price}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Curriculum</p>
                        <p className="text-lg font-black text-white leading-none">{course.modules?.length || 0} <span className="text-[10px] text-slate-500 uppercase tracking-tighter ml-0.5 font-bold">Nodes</span></p>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${course.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {course.status}
                        </p>
                    </div>
                </div>

                {/* Master Entry Point */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button 
                        onClick={() => window.open(`https://thinkskool-9kaq.vercel.app/course/${course.title?.toLowerCase().replace(/ /g, '-') || '1'}`, '_blank')}
                        className="p-5 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-[1.75rem] transition-all border border-slate-800 shadow-xl"
                    >
                        <Eye size={20} />
                    </button>
                    <button 
                        onClick={onOpenMaster}
                        className="flex-1 lg:flex-none px-8 py-5 bg-white text-slate-950 rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
                    >
                        <Settings size={18} /> Master Control
                    </button>
                </div>
            </div>
            
            {/* Design Decoration */}
            <div className="absolute -bottom-px left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>
    );
};

export default CourseGovernance;
