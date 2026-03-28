import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, Calendar, ArrowLeft, Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobileNumber?.includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'withMobile') return matchesSearch && student.mobileNumber;
    if (filter === 'withoutMobile') return matchesSearch && !student.mobileNumber;
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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Student Information</h1>
                <p className="text-slate-400 text-sm">View all registered students</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">{students.length}</span>
              <span className="text-slate-400 text-sm">Total Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Students</option>
              <option value="withMobile" className="bg-slate-900">With Mobile</option>
              <option value="withoutMobile" className="bg-slate-900">Without Mobile</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Student</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Contact</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Mobile Number</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Login Method</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {student.photoURL ? (
                            <img
                              src={student.photoURL}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {student.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{student.name || 'Unknown'}</p>
                            <p className="text-slate-500 text-sm">{student.role || 'Student'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-300 text-sm">{student.email}</span>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-4 px-6">
                        {student.mobileNumber ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-400" />
                            <span className="text-white font-medium">{student.mobileNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm italic">Not provided</span>
                        )}
                      </td>

                      {/* Login Method */}
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.provider === 'firebase' 
                            ? 'bg-orange-500/20 text-orange-400'
                            : student.provider === 'google'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {student.provider === 'firebase' ? 'Google (Firebase)' 
                           : student.provider === 'google' ? 'Google OAuth'
                           : 'Email/Password'}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400 text-sm">
                            {formatDate(student.createdAt)}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-sm mb-1">Total Students</p>
            <p className="text-2xl font-bold text-white">{students.length}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-sm mb-1">With Mobile</p>
            <p className="text-2xl font-bold text-green-400">
              {students.filter(s => s.mobileNumber).length}
            </p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-sm mb-1">Google Sign-ins</p>
            <p className="text-2xl font-bold text-blue-400">
              {students.filter(s => s.provider === 'firebase' || s.provider === 'google').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
