import React, { useState, useEffect } from 'react';
import {
    Users,
    ShieldCheck,
    UserX,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Menu,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const UserGovernance = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('student'); // Backend role names
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (err) {
            console.error('Governance failure', err);
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
            console.error('Status override failed', err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.role === activeTab &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        User <span className="text-sky-500 not-italic">Governance</span>
                    </h2>
                    <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px]">
                        Manage high-level access and lifecycle of ecosystem nodes.
                    </p>
                </div>
                <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
                    {['student', 'mentor', 'growth_associate', 'admin'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                                    : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-sky-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or neural hash..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-4 pl-14 rounded-2xl text-sm font-bold text-white outline-none focus:border-sky-500/30 transition-all placeholder:text-slate-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Identity</th>
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocol Status</th>
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Initialization</th>
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Overrides</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredUsers.map((user, idx) => (
                            <motion.tr
                                key={user._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-sky-500/5 transition-all group"
                            >
                                <td className="p-8">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border font-black shadow-xl transition-all ${user.isActive === false ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-slate-900 border-slate-800 text-sky-500 group-hover:border-sky-500/30'
                                            }`}>
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-white tracking-tight uppercase">{user.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail size={12} className="text-slate-600" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                                            }`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${user.isActive !== false ? 'text-emerald-500' : 'text-rose-500'
                                            }`}>
                                            {user.isActive !== false ? 'ACTIVE_LINK' : 'TERMINATED'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-600" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-8 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => toggleUserStatus(user._id, user.isActive !== false)}
                                            className={`p-3 rounded-xl border transition-all ${user.isActive === false
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950'
                                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white'
                                                }`}
                                        >
                                            {user.isActive === false ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                                        </button>
                                        <button className="p-3 bg-slate-800 rounded-xl text-white hover:bg-sky-500 hover:text-slate-950 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserGovernance;
