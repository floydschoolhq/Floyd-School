import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
    ShieldAlert,
    Trash2,
    Lock,
    Unlock,
    Shield,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../api/axios';

const UserGovernance = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('student'); // Backend role names
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingPermission, setUpdatingPermission] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });

    const fetchUsers = async () => {
        try {
            const res = await adminApi.get('/admin/users');
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
            await adminApi.patch(`/admin/users/${id}/status`, { isActive: !currentStatus });
            fetchUsers();
        } catch (err) {
            console.error('Status override failed', err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('PROTOCOL WARNING: This will permanently terminate the ecosystem node. Proceed?')) return;
        try {
            await adminApi.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Termination sequence failed', err);
            alert('Failed to delete node.');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await adminApi.post('/admin/users', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'student' });
            fetchUsers();
            alert('Node created successfully.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create node');
        }
    };

    const togglePermission = async (userId, permissionKey, currentValue) => {
        setUpdatingPermission(`${userId}-${permissionKey}`);
        try {
            await adminApi.patch(`/admin/users/${userId}/permissions`, {
                permissions: { [permissionKey]: !currentValue }
            });

            // Optimistic Update
            setUsers(prev => prev.map(u =>
                u._id === userId ? {
                    ...u,
                    permissions: {
                        ...(u.permissions || {}),
                        [permissionKey]: !currentValue
                    }
                } : u
            ));
        } catch (err) {
            console.error('Permission override failed', err);
            alert('Failed to update permission protocol.');
            fetchUsers(); // Revert
        } finally {
            setUpdatingPermission(null);
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
        <div className="space-y-10 relative">
            {/* Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>

                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                                Initialize New <span className="text-sky-500">Node</span>
                            </h3>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Identity Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500/50 outline-none transition-colors"
                                        placeholder="Dr. Strange"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Protocol</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500/50 outline-none transition-colors"
                                        placeholder="strange@multiverse.io"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Secure Key</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500/50 outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Role Assignment</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500/50 outline-none transition-colors appearance-none"
                                    >
                                        <option value="student">Student</option>
                                        <option value="mentor">Mentor</option>
                                        <option value="growth_associate">Growth Associate</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-500/20 mt-6"
                                >
                                    Initialize Node
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                <button
                    onClick={() => setShowModal(true)}
                    className="px-8 py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-sky-500 transition-all flex items-center gap-3 shadow-xl"
                >
                    <Users size={20} />
                    Add Node
                </button>
            </div>

            {/* Table */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Identity</th>
                            {activeTab === 'student' ? (
                                <>
                                    <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Course Sync</th>
                                    <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Lab Access</th>
                                    <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Net Comms</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocol Status</th>
                                    <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Initialization</th>
                                </>
                            )}
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
                                {activeTab === 'student' ? (
                                    <>
                                        {['canAccessCourses', 'canAccessLabs', 'canAccessCommunity'].map(key => (
                                            <td key={key} className="p-8">
                                                <button
                                                    onClick={() => togglePermission(user._id, key, user.permissions?.[key])}
                                                    disabled={updatingPermission === `${user._id}-${key}`}
                                                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${user.permissions?.[key] ? 'bg-sky-500' : 'bg-slate-800'
                                                        } ${updatingPermission === `${user._id}-${key}` ? 'opacity-50 cursor-wait' : 'cursor-pointer'} border border-slate-700`}
                                                >
                                                    <div className={`absolute top-0.5 bottom-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${user.permissions?.[key] ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'
                                                        } flex items-center justify-center`}>
                                                        {updatingPermission === `${user._id}-${key}` ? (
                                                            <RefreshCw size={10} className="text-sky-500 animate-spin" />
                                                        ) : user.permissions?.[key] ? (
                                                            <Unlock size={10} className="text-sky-500" />
                                                        ) : (
                                                            <Lock size={10} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                </button>
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                                <td className="p-8 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => toggleUserStatus(user._id, user.isActive !== false)}
                                            className={`p-3 rounded-xl border transition-all ${user.isActive === false
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950'
                                                : 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white'
                                                }`}
                                            title={user.isActive !== false ? "Suspend Node" : "Activate Node"}
                                        >
                                            {user.isActive === false ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-rose-600 hover:text-white transition-all border border-transparent hover:border-rose-500/30"
                                            title="Terminate Node Permanently"
                                        >
                                            <Trash2 size={18} />
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
