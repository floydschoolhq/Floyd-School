import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Users,
    Phone,
    Mail,
    Calendar,
    RefreshCw,
    Search,
    Filter,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentRegistrations = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/auth/students');
            setStudents(res.data || []);
        } catch (error) {
            console.error("Failed to fetch students", error);
            setError(error.response?.data?.message || 'Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.mobileNumber?.includes(searchTerm);
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'withMobile') return matchesSearch && student.mobileNumber;
        if (filter === 'withoutMobile') return matchesSearch && !student.mobileNumber;
        if (filter === 'google') return matchesSearch && (student.provider === 'firebase' || student.provider === 'google');
        return matchesSearch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProviderLabel = (provider) => {
        switch(provider) {
            case 'firebase': return 'Google (Firebase)';
            case 'google': return 'Google OAuth';
            case 'local': return 'Email/Password';
            default: return provider || 'Unknown';
        }
    };

    const getProviderColor = (provider) => {
        switch(provider) {
            case 'firebase': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'google': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'local': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Student <span className="text-blue-600">Registrations</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        View all students who registered via Google login with mobile numbers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-xs">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Total Students</p>
                            <p className="text-lg font-black text-slate-900 leading-none">{students.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchStudents}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs shadow-xs cursor-pointer"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold">
                    <AlertCircle size={18} />
                    <p>{error}</p>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none shadow-xs font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent text-slate-700 outline-none cursor-pointer font-bold text-xs"
                    >
                        <option value="all">All Students</option>
                        <option value="withMobile">With Mobile</option>
                        <option value="withoutMobile">Without Mobile</option>
                        <option value="google">Google Sign-ins</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total</p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">{students.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">With Mobile</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                        {students.filter(s => s.mobileNumber).length}
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Google Sign-ins</p>
                    <p className="text-2xl sm:text-3xl font-black text-orange-600">
                        {students.filter(s => s.provider === 'firebase' || s.provider === 'google').length}
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Today</p>
                    <p className="text-2xl sm:text-3xl font-black text-blue-600">
                        {students.filter(s => {
                            const today = new Date().toDateString();
                            const created = new Date(s.createdAt).toDateString();
                            return today === created;
                        }).length}
                    </p>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="mx-auto mb-3 text-slate-300" size={40} />
                        <p className="text-slate-500 font-medium text-xs">No students found matching your criteria</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Student</th>
                                    <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Contact</th>
                                    <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Mobile</th>
                                    <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Method</th>
                                    <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                <AnimatePresence>
                                    {filteredStudents.map((student, index) => (
                                        <motion.tr
                                            key={student._id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="hover:bg-slate-50/70 transition-colors"
                                        >
                                            {/* Student Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {student.photoURL ? (
                                                        <img
                                                            src={student.photoURL}
                                                            alt={student.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                                            {student.name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-slate-900 font-bold">{student.name || 'Unknown'}</p>
                                                        <p className="text-slate-400 text-[11px]">{student.role || 'Student'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-slate-600">{student.email}</span>
                                                </div>
                                            </td>

                                            {/* Mobile */}
                                            <td className="py-4 px-6">
                                                {student.mobileNumber ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span className="text-slate-900 font-bold">{student.mobileNumber}</span>
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">Not provided</span>
                                                )}
                                            </td>

                                            {/* Provider */}
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getProviderColor(student.provider)}`}>
                                                    {getProviderLabel(student.provider)}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-slate-500">
                                                        {formatDate(student.createdAt)}
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRegistrations;
