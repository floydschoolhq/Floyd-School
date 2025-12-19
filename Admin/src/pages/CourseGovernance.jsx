import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Search,
    CheckCircle2,
    XCircle,
    Eye,
    AlertCircle,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const CourseGovernance = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

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
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredCourses = courses.filter(course =>
        (filter === 'all' || course.status === filter) &&
        (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.mentor?.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        placeholder="Search by title or mentor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-4 pl-14 rounded-2xl text-sm font-bold text-white outline-none focus:border-sky-500/30 transition-all placeholder:text-slate-700"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredCourses.map((course, idx) => (
                    <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 hover:border-sky-500/30 transition-all"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
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
                                            <FileText size={12} /> {course.mentor?.name || 'Unknown Mentor'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${course.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                                    <Eye size={18} />
                                </button>
                                {course.status !== 'published' && (
                                    <button
                                        onClick={() => updateStatus(course._id, 'published')}
                                        className="px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle2 size={16} /> Approve
                                    </button>
                                )}
                                {course.status === 'published' && (
                                    <button
                                        onClick={() => updateStatus(course._id, 'draft')}
                                        className="px-4 py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <AlertCircle size={16} /> Unpublish
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CourseGovernance;
