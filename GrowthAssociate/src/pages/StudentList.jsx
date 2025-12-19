import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/growth/students');
            setStudents(res.data.students);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <Users className="text-orange-500" size={32} />
                        Student <span className="text-orange-500">Registry</span>
                    </h2>
                    <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">
                        Complete directory of enrolled learners.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchStudents}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-orange-500 transition-all shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
                        <Users className="text-orange-500" size={18} />
                        <span className="text-lg font-black text-slate-900">{students.length}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                    </div>
                </div>
            </header>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <Search className="text-slate-400 ml-2" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 placeholder:text-slate-300"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse"></div>
                    ))
                ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                        <motion.div
                            key={student._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 font-black text-xl border border-orange-100">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{student.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                            <Mail size={12} /> {student.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                        <BookOpen size={14} className="text-slate-400" />
                                        <span className="text-xs font-black text-slate-600">{student.enrollments?.length || 0} Courses</span>
                                    </div>
                                    {(student.openTickets > 0) && (
                                        <div className="px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-2">
                                            <AlertCircle size={14} className="text-rose-500" />
                                            <span className="text-xs font-black text-rose-600">{student.openTickets} Issues</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No students found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentList;
