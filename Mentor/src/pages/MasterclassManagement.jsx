import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Users,
    Clock,
    X,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Video,
    Play,
    Pause,
    CheckCircle,
    XCircle,
    Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const MasterclassManagement = () => {
    const toast = useToast();
    const [masterclasses, setMasterclasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [editingMasterclass, setEditingMasterclass] = useState(null);
    const [selectedMasterclass, setSelectedMasterclass] = useState(null);
    const [attendees, setAttendees] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledDate: '',
        startTime: '',
        endTime: '',
        duration: '',
        meetingLink: '',
        tags: '',
        category: 'AI & ML',
        maxAttendees: 500,
        isFree: true
    });

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMasterclasses();
    }, []);

    const fetchMasterclasses = async () => {
        try {
            const res = await api.get('/masterclasses');
            setMasterclasses(res.data);
        } catch (err) {
            console.error('Failed to fetch masterclasses:', err);
            toast.error('Failed to load masterclasses');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (masterclass = null) => {
        if (masterclass) {
            setEditingMasterclass(masterclass);
            setFormData({
                title: masterclass.title,
                description: masterclass.description,
                scheduledDate: new Date(masterclass.scheduledDate).toISOString().split('T')[0],
                startTime: masterclass.startTime,
                endTime: masterclass.endTime,
                duration: masterclass.duration,
                meetingLink: masterclass.meetingLink,
                tags: masterclass.tags.join(', '),
                category: masterclass.category,
                maxAttendees: masterclass.maxAttendees,
                isFree: masterclass.isFree
            });
        } else {
            setEditingMasterclass(null);
            setFormData({
                title: '',
                description: '',
                scheduledDate: '',
                startTime: '',
                endTime: '',
                duration: '',
                meetingLink: '',
                tags: '',
                category: 'AI & ML',
                maxAttendees: 500,
                isFree: true
            });
        }
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };

            if (editingMasterclass) {
                await api.put(`/masterclasses/${editingMasterclass._id}`, payload);
                toast.success('Masterclass updated successfully');
            } else {
                await api.post('/masterclasses', payload);
                toast.success('New masterclass created');
            }
            setShowModal(false);
            fetchMasterclasses();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save masterclass';
            setError(msg);
            toast.error(msg);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this masterclass?')) return;
        try {
            await api.delete(`/masterclasses/${id}`);
            toast.success('Masterclass deleted');
            fetchMasterclasses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/masterclasses/${id}/status`, { status });
            toast.success(`Status updated to ${status}`);
            fetchMasterclasses();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleViewAttendees = async (masterclass) => {
        setSelectedMasterclass(masterclass);
        try {
            const res = await api.get(`/masterclasses/${masterclass._id}/attendees`);
            setAttendees(res.data.attendees || []);
            setShowAttendeesModal(true);
        } catch (err) {
            toast.error('Failed to load attendees');
        }
    };

    const filteredMasterclasses = masterclasses.filter(mc => {
        const matchesSearch = mc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mc.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || mc.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'live': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'completed': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Expert Integration <span className="text-sky-500">Sessions</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Manage technical deep dives and masterclasses
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={3} />
                    Deploy New Session
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 pl-12 rounded-xl text-sm font-bold outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 p-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-sky-500 transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white h-96 rounded-3xl border border-slate-200 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredMasterclasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMasterclasses.map((mc, idx) => (
                        <motion.div
                            key={mc._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col"
                        >
                            <div className="h-44 bg-gradient-to-br from-sky-500 to-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(mc.status)}`}>
                                        {mc.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-6 right-6">
                                    <h3 className="text-white text-lg font-black leading-tight uppercase tracking-tight truncate">
                                        {mc.title}
                                    </h3>
                                    <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">
                                        {mc.category}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-sky-500" />
                                            <span className="text-xs font-black uppercase">
                                                {new Date(mc.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} className="text-amber-500" />
                                            <span className="text-xs font-black uppercase">{mc.startTime}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} className="text-emerald-500" />
                                            <span className="text-xs font-black uppercase text-slate-600">
                                                {mc.attendeeCount || 0} / {mc.maxAttendees}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleViewAttendees(mc)}
                                            className="text-xs font-black text-sky-500 hover:text-sky-600 uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {mc.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleStatusChange(mc._id, 'live')}
                                            className="w-full bg-emerald-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Play size={14} /> Start Session
                                        </button>
                                    )}
                                    {mc.status === 'live' && (
                                        <button
                                            onClick={() => handleStatusChange(mc._id, 'completed')}
                                            className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Pause size={14} /> End Session
                                        </button>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(mc)}
                                            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-50 hover:border-sky-200 hover:text-sky-500 transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(mc._id)}
                                            className="p-3 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center">
                    <Video size={48} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-slate-400 uppercase">No Sessions Found</h3>
                    <button onClick={() => handleOpenModal()} className="mt-4 text-sky-500 font-black uppercase text-xs hover:underline tracking-widest">Deploy First Session</button>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                                        {editingMasterclass ? 'Update Session' : 'Deploy New Session'}
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Title</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            placeholder="e.g., Large Language Model Architecture"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            placeholder="Describe what students will learn..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Date</label>
                                            <input
                                                required
                                                type="date"
                                                value={formData.scheduledDate}
                                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            >
                                                <option>AI & ML</option>
                                                <option>System Design</option>
                                                <option>Web Development</option>
                                                <option>Data Science</option>
                                                <option>Cybersecurity</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Time</label>
                                            <input
                                                required
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">End Time</label>
                                            <input
                                                required
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Duration (min)</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                                placeholder="120"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Meeting Link</label>
                                        <input
                                            required
                                            type="url"
                                            value={formData.meetingLink}
                                            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            placeholder="https://zoom.us/j/..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tags (comma separated)</label>
                                        <input
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            placeholder="LLM, Transformers, NLP"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Max Attendees</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.maxAttendees}
                                            onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
                                            <AlertCircle size={14} /> {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {formLoading ? 'Processing...' : (
                                            <>
                                                <CheckCircle2 size={18} />
                                                {editingMasterclass ? 'Update Session' : 'Launch Session'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Attendees Modal */}
            <AnimatePresence>
                {showAttendeesModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAttendeesModal(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase">Registered Attendees</h3>
                                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">
                                            {attendees.length} / {selectedMasterclass?.maxAttendees} Students
                                        </p>
                                    </div>
                                    <button onClick={() => setShowAttendeesModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {attendees.length > 0 ? attendees.map((student, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-black text-sm">
                                                    {student.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">{student.name}</p>
                                                    <p className="text-xs text-slate-500 font-bold">{student.email}</p>
                                                </div>
                                            </div>
                                            <CheckCircle className="text-emerald-500" size={20} />
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                                            <p className="font-black uppercase text-xs">No registrations yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MasterclassManagement;
