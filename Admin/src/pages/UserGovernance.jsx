import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  XCircle,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const UserGovernance = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('student');
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleUserStatus = async (id, currentStatus) => {
        try {
            await api.patch(`/admin/users/${id}/status`, { isActive: !currentStatus });
            fetchUsers();
        } catch (err) {
            console.error('Status update failed:', err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Warning: This action will permanently delete this user account. Do you wish to proceed?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Deletion failed:', err);
            alert('Failed to delete user account.');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'student' });
            fetchUsers();
            alert('User account created successfully.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create user account');
        }
    };

    const tabLabels = {
      student: 'Online Students',
      mentor: 'Mentors & Teachers',
      growth_associate: 'Growth Associates',
      school_partner: 'Partner Schools',
      school_student: 'School Students',
      admin: 'Administrators'
    };

    const filteredUsers = users.filter(user =>
        user.role === activeTab &&
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 relative">
            {/* Create Account Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                <XCircle size={22} />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Register New User Account
                            </h3>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                                        placeholder="e.g. Professor Rajesh Sharma"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                                        placeholder="user@floydschool.in"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Assign System Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                                    >
                                        <option value="student">Online Student</option>
                                        <option value="mentor">Teacher / Mentor</option>
                                        <option value="growth_associate">Growth Associate</option>
                                        <option value="school_partner">Partner School Admin</option>
                                        <option value="school_student">School Student</option>
                                        <option value="admin">System Administrator</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 mt-4 text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Create User Account
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Users className="text-blue-600" />
                        User Account Management
                    </h1>
                    <p className="text-slate-500 text-xs font-medium mt-1">
                        Manage logins, staff permissions, partner school coordinators, and student accounts.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="py-2.5 px-4 bg-slate-900 text-white hover:bg-blue-600 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-all self-start md:self-auto cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Register New Account</span>
                </button>
            </header>

            {/* Role Selection Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                {['student', 'mentor', 'growth_associate', 'school_partner', 'school_student', 'admin'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === tab
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }`}
                    >
                        {tabLabels[tab]}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by user name or email..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
            </div>

            {/* Users Directory Table */}
            {filteredUsers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium shadow-xs">
                    No registered user accounts found for this role category.
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="px-6 py-3.5">User Name</th>
                                    <th className="px-6 py-3.5">Email / Login ID</th>
                                    {activeTab === 'school_student' && (
                                        <>
                                            <th className="px-6 py-3.5">Roll No / Class</th>
                                            <th className="px-6 py-3.5">Parent & Contacts</th>
                                        </>
                                    )}
                                    <th className="px-6 py-3.5">Assigned Role</th>
                                    <th className="px-6 py-3.5">Account Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center space-x-1.5">
                                                <Mail size={13} className="text-slate-400" />
                                                <span>{user.email}</span>
                                            </div>
                                        </td>
                                        {activeTab === 'school_student' && (
                                            <>
                                                <td className="px-6 py-4">
                                                    <p className="font-mono text-blue-600 font-bold text-xs">{user.offlineRollNo || 'Pending Allotment'}</p>
                                                    <p className="text-[11px] text-slate-500">{user.grade || 'Grade 10'} (Sec {user.section || 'A'})</p>
                                                </td>
                                                <td className="px-6 py-4 text-[11px]">
                                                    <p className="text-slate-900 font-semibold">Father: {user.fatherName || 'N/A'}</p>
                                                    <p className="text-slate-500">Student Mob: {user.studentMobile || 'N/A'} • Father: {user.fatherMobile || 'N/A'}</p>
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-[11px]">
                                                {tabLabels[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.approvalStatus === 'Pending_Approval' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    Pending Batch
                                                </span>
                                            ) : user.isActive !== false ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                    Disabled
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => toggleUserStatus(user._id, user.isActive !== false)}
                                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                                    user.isActive !== false
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                }`}
                                                title={user.isActive !== false ? 'Deactivate Account' : 'Activate Account'}
                                            >
                                                {user.isActive !== false ? <Lock size={14} /> : <Unlock size={14} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                                                title="Delete Account"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserGovernance;
