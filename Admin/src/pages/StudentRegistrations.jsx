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
            case 'firebase': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'google': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'local': return 'bg-slate-700 text-slate-400 border-slate-600';
            default: return 'bg-slate-700 text-slate-400 border-slate-600';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit']">
                        Student <span className="text-blue-600">Registrations</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2 text-sm">
                        View all students who registered via Google login with mobile numbers.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Students</p>
                            <p className="text-xl font-bold text-white">{students.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchStudents}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm text-slate-700 shadow-sm"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500">
                    <AlertCircle size={24} />
                    <p className="font-bold uppercase tracking-widest text-xs">{error}</p>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent text-slate-900 outline-none cursor-pointer font-medium text-sm"
                    >
                        <option value="all">All Students</option>
                        <option value="withMobile">With Mobile</option>
                        <option value="withoutMobile">Without Mobile</option>
                        <option value="google">Google Sign-ins</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total</p>
                    <p className="text-3xl font-black text-white">{students.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">With Mobile</p>
                    <p className="text-3xl font-black text-emerald-400">
                        {students.filter(s => s.mobileNumber).length}
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Google Sign-ins</p>
                    <p className="text-3xl font-black text-orange-400">
                        {students.filter(s => s.provider === 'firebase' || s.provider === 'google').length}
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Today</p>
                    <p className="text-3xl font-black text-blue-400">
                        {students.filter(s => {
                            const today = new Date().toDateString();
                            const created = new Date(s.createdAt).toDateString();
                            return today === created;
                        }).length}
                    </p>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
                {filteredStudents.length === 0 ? (
                    <div className="p-16 text-center">
                        <Users className="mx-auto mb-4 text-slate-600" size={48} />
                        <p className="text-slate-500 font-medium">No students found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Student</th>
                                    <th className="text-left py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Contact</th>
                                    <th className="text-left py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Mobile</th>
                                    <th className="text-left py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Method</th>
                                    <th className="text-left py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                <AnimatePresence>
                                    {filteredStudents.map((student, index) => (
                                        <motion.tr
                                            key={student._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-slate-800/30 transition-colors"
                                        >
                                            {/* Student Info */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    {student.photoURL ? (
                                                        <img
                                                            src={student.photoURL}
                                                            alt={student.name}
                                                            className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                            {student.name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-white font-bold">{student.name || 'Unknown'}</p>
                                                        <p className="text-slate-500 text-sm">{student.role || 'Student'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-500" />
                                                    <span className="text-slate-300 text-sm">{student.email}</span>
                                                </div>
                                            </td>

                                            {/* Mobile */}
                                            <td className="py-5 px-6">
                                                {student.mobileNumber ? (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-white font-bold">{student.mobileNumber}</span>
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-500 text-sm italic">Not provided</span>
                                                )}
                                            </td>

                                            {/* Provider */}
                                            <td className="py-5 px-6">
                                                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getProviderColor(student.provider)}`}>
                                                    {getProviderLabel(student.provider)}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                    <span className="text-slate-400 text-sm">
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
