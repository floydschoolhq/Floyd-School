import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Mail,
    Calendar,
    ArrowUpRight,
    GraduationCap,
    MoreHorizontal,
    Layout,
    Globe,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const StudentRoster = () => {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchRoster();
    }, []);

    const fetchRoster = async () => {
        try {
            const res = await api.get('/courses/mentor/roster');
            setRoster(res.data);
        } catch (err) {
            console.error('Failed to fetch roster:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (student) => {
        setSelectedStudent(student);
        setShowDetailModal(true);
    };

    const filteredRoster = roster.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Academic <span className="text-sky-500">Roster</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Consolidated viewer for all active learners in your domain.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <Users className="text-sky-500" size={18} />
                        <span className="text-lg font-black text-slate-900">{roster.length}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active</span>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search student directory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 pl-12 rounded-xl text-sm font-bold outline-none focus:border-sky-500 focus:bg-white transition-all underline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-500 transition-all">
                        Export Directory
                    </button>
                </div>
            </div>

            {/* Table / Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-60 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredRoster.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRoster.map((student, idx) => (
                        <motion.div
                            key={student._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-2xl transition-all p-8 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-sky-50 group-hover:text-sky-500 transition-all">
                                        <GraduationCap size={28} />
                                    </div>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-300 hover:text-slate-900">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{student.name}</h3>
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                                    <Mail size={12} /> {student.email}
                                </p>

                                <div className="mt-8 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Domains</p>
                                    <div className="flex flex-wrap gap-2">
                                        {student.courses.map(course => (
                                            <span key={course._id} className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-black uppercase border border-sky-100/50">
                                                {course.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Joined On</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                        {new Date(student.joinedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleOpenDetail(student)}
                                    className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                >
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center opacity-50">
                    <Globe size={48} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-slate-400 uppercase italic">Sector Unpopulated</h3>
                    <p className="text-xs font-bold text-slate-400 mt-2">No student records matching your query were found.</p>
                </div>
            )}

            {/* Progress Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                                        <GraduationCap size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-1">Performance Matrix</p>
                                        <h3 className="text-2xl font-black uppercase tracking-tight">{selectedStudent.name}</h3>
                                    </div>
                                </div>
                                <button onClick={() => setShowDetailModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto space-y-10">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled Tracks</p>
                                        <p className="text-3xl font-black text-slate-900">{selectedStudent.courses.length}</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Avg</p>
                                        <p className="text-3xl font-black text-emerald-500">64%</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Layout size={16} className="text-sky-500" />
                                        Domain Breakdown
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedStudent.courses.map(course => (
                                            <div key={course._id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{course.title}</p>
                                                    <span className="text-[10px] font-black text-sky-500 uppercase px-2 py-1 bg-sky-50 rounded-lg">Active Pulse</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Curriculum Milestones</span>
                                                        <span className="text-xs font-black text-slate-900">7/12</span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: '58%' }}
                                                            className="h-full bg-sky-500 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-center">
                                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center gap-3">
                                    <Mail size={16} /> Contact Student via Secure Channel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentRoster;
