import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
    BookOpen, 
    Search, 
    Eye, 
    Users,
    Settings,
    Plus,
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
            setCourses(res.data.courses || []);
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
                instructor: courses[0]?.instructor?._id || '6605786a3e6f9a001a8f903a'
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
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Course <span className="text-blue-600">Governance</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        Curriculum Management & Master Course Control Center
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCreateCourse}
                        className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                        <Plus size={16} /> Initialize Course
                    </button>
                    <div className="flex gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                        {['all', 'published', 'draft'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${filter === tab
                                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by title or instructor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-500 shadow-xs placeholder:text-slate-400"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
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
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-xs">
                        <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium text-xs">No courses detected matching your criteria.</p>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all shadow-xs"
        >
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5">
                {/* Course Main Intel */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <BookOpen size={24} />
                            </div>
                        )}
                        <div className="absolute top-1.5 right-1.5">
                            <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ${course.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1">
                            <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[9px] font-black text-blue-600 uppercase tracking-wider">{course.category || 'Development'}</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                <Users size={11} /> {course.enrolledStudents?.length || 0} Students
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 truncate">
                            {course.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Target size={12} className="text-blue-600" /> Instructor: {course.instructor?.name || 'Floyd School Mentor'}
                        </p>
                    </div>
                </div>

                {/* Quick Metrics */}
                <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 w-full xl:w-auto justify-between xl:justify-start">
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                        <p className="text-sm font-black text-slate-900 leading-tight">₹{course.price}</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Revenue</p>
                        <p className="text-sm font-black text-blue-600 leading-tight">₹{course.totalRevenue || 0}</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Modules</p>
                        <p className="text-sm font-black text-slate-900 leading-tight">{course.modules?.length || 0}</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status</p>
                        <p className={`text-[10px] font-black uppercase tracking-wider leading-tight ${course.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {course.status}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 w-full xl:w-auto">
                    <button 
                        onClick={() => window.open(`https://floydschool.in/course/${course.title?.toLowerCase().replace(/ /g, '-') || '1'}`, '_blank')}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all border border-slate-200 cursor-pointer"
                        title="Preview Course"
                    >
                        <Eye size={16} />
                    </button>
                    <button 
                        onClick={onOpenMaster}
                        className="flex-1 xl:flex-none px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                        <Settings size={15} /> Master Control
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseGovernance;
