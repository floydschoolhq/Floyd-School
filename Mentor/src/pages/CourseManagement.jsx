import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    BookOpen,
    Users,
    Clock,
    X,
    AlertCircle,
    CheckCircle2,
    GripVertical,
    Layout,
    ArrowRight,
    Megaphone,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const CourseManagement = () => {
    const toast = useToast();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCurriculumModal, setShowCurriculumModal] = useState(false);
    const [showAnnounceModal, setShowAnnounceModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Web Development',
        difficulty: 'Beginner',
        duration: ''
    });

    // Announcement State
    const [announceData, setAnnounceData] = useState({ title: '', message: '' });

    // Curriculum State
    const [modules, setModules] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setFormData({
                title: course.title,
                description: course.description,
                category: course.category,
                difficulty: course.difficulty,
                duration: course.duration
            });
        } else {
            setEditingCourse(null);
            setFormData({
                title: '',
                description: '',
                category: 'Web Development',
                difficulty: 'Beginner',
                duration: ''
            });
        }
        setError('');
        setShowModal(true);
    };

    const handleOpenCurriculum = (course) => {
        setSelectedCourse(course);
        setModules(course.modules || []);
        setShowCurriculumModal(true);
    };

    const handleOpenAnnounce = (course) => {
        setSelectedCourse(course);
        setAnnounceData({ title: '', message: '' });
        setShowAnnounceModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, formData);
                toast.success('Course node updated successfully');
            } else {
                await api.post('/courses', formData);
                toast.success('New course node initialized');
            }
            setShowModal(false);
            fetchCourses();
        } catch (err) {
            let msg = err.response?.data?.message || 'Failed to save course';
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                msg = err.response.data.errors.join(', ');
            }
            setError(msg);
            toast.error(msg);
        } finally {
            setFormLoading(false);
        }
    };

    const handleCurriculumSubmit = async () => {
        setFormLoading(true);
        try {
            await api.patch(`/courses/${selectedCourse._id}/modules`, { modules });
            setShowCurriculumModal(false);
            toast.success('Curriculum hierarchy synchronized');
            fetchCourses();
        } catch (err) {
            const serverMsg = err.response?.data?.message;
            const detail = err.response?.data?.error;
            const fullMsg = detail ? `${serverMsg}: ${detail}` : (serverMsg || 'Failed to sync curriculum with node');
            toast.error(fullMsg);
        } finally {
            setFormLoading(false);
        }
    };

    const handleAnnounceSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post(`/courses/${selectedCourse._id}/announce`, announceData);
            setShowAnnounceModal(false);
            toast.success('Announcement broadcasted to all enrolled students');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initialize broadcast');
        } finally {
            setFormLoading(false);
        }
    };

    const handleAddModule = () => {
        setModules([...modules, { title: '', description: '', videoUrl: '', order: modules.length + 1 }]);
    };

    const handleRemoveModule = (idx) => {
        setModules(modules.filter((_, i) => i !== idx));
    };

    const handleModuleChange = (idx, field, value) => {
        const newModules = [...modules];
        newModules[idx][field] = value;
        setModules(newModules);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this course node?')) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success('Course node decommissioned');
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deletion protocol failed');
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Course <span className="text-sky-500">Inventory</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Manage academic nodes and their underlying data structures.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={3} />
                    Deploy New Course
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search your inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 pl-12 rounded-xl text-sm font-bold outline-none focus:border-sky-500 focus:bg-white transition-all underline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-slate-50 border border-slate-200 p-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-sky-500 transition-all">
                        <option>All Categories</option>
                        <option>Web Development</option>
                        <option>AI & Robotics</option>
                        <option>Data Science</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white h-80 rounded-3xl border border-slate-200 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col"
                        >
                            <div className="h-44 bg-slate-900 relative overflow-hidden">
                                <div className="absolute inset-0 bg-sky-500/10 backdrop-blur-[2px]"></div>
                                <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white border border-white/20">
                                    {course.difficulty}
                                </div>
                                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                    <div className="flex-1">
                                        <p className="text-white text-lg font-black leading-tight uppercase tracking-tight truncate">
                                            {course.title}
                                        </p>
                                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mt-1 italic">
                                            {course.category}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenAnnounce(course)}
                                        className="mb-1 p-2 bg-white/10 hover:bg-sky-500 rounded-xl text-white transition-all border border-white/10"
                                        title="Send Announcement"
                                    >
                                        <Megaphone size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={16} className="text-sky-500" />
                                        <span className="text-xs font-black uppercase">{course.enrolledStudents?.length || 0} Learners</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Layout size={16} className="text-amber-500" />
                                        <span className="text-xs font-black uppercase">{course.modules?.length || 0} Modules</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleOpenCurriculum(course)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-50 hover:border-sky-200 hover:text-sky-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        Manage Curriculum <ArrowRight size={14} />
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(course)}
                                            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all"
                                        >
                                            Edit Meta
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
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
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-slate-400 uppercase">Inventory Empty</h3>
                    <button onClick={() => handleOpenModal()} className="mt-4 text-sky-500 font-black uppercase text-xs hover:underline tracking-widest">Deploy First Node</button>
                </div>
            )}

            {/* Meta Data Modal */}
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
                            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                                        {editingCourse ? 'Update Metadata' : 'Initialize Node'}
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
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all underline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all underline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Difficulty</label>
                                            <select
                                                value={formData.difficulty}
                                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            >
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            >
                                                <option>Web Development</option>
                                                <option>AI & Robotics</option>
                                                <option>Coding</option>
                                                <option>Data Science</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Expected Duration</label>
                                        <input
                                            required
                                            placeholder="e.g. 8 Weeks, 3 Months, 48 Hours"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all underline-none"
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
                                        className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2"
                                    >
                                        {formLoading ? 'Executing...' : (
                                            <>
                                                <CheckCircle2 size={18} />
                                                {editingCourse ? 'Save Changes' : 'Launch Course'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Curriculum Modal */}
            < AnimatePresence >
                {showCurriculumModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCurriculumModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-2xl bg-slate-50 rounded-[3rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                        >
                            <div className="p-8 bg-white border-b border-slate-200 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1 italic">Knowledge Hierarchy</p>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase">Curriculum <span className="text-slate-400">Editor</span></h3>
                                </div>
                                <button onClick={() => setShowCurriculumModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 space-y-6">
                                {modules.length > 0 ? (
                                    modules.map((module, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group">
                                            <button
                                                onClick={() => handleRemoveModule(idx)}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="flex gap-4">
                                                <div className="mt-1">
                                                    <div className="w-8 h-8 bg-slate-900 text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <input
                                                        placeholder="Module Title (e.g., Intro to Neural Networks)"
                                                        value={module.title}
                                                        onChange={(e) => handleModuleChange(idx, 'title', e.target.value)}
                                                        className="w-full bg-slate-50 border-none p-3 rounded-xl font-black text-sm outline-none focus:ring-2 ring-sky-500/20 underline-none"
                                                    />
                                                    <input
                                                        placeholder="YouTube Lecture URL (e.g., https://youtube.com/watch?v=...)"
                                                        value={module.videoUrl || ''}
                                                        onChange={(e) => handleModuleChange(idx, 'videoUrl', e.target.value)}
                                                        className="w-full bg-slate-50 border-none p-3 rounded-xl font-bold text-xs outline-none focus:ring-2 ring-sky-500/20 underline-none text-sky-600"
                                                    />
                                                    <textarea
                                                        placeholder="Brief overview of what students will accomplish..."
                                                        rows="2"
                                                        value={module.description}
                                                        onChange={(e) => handleModuleChange(idx, 'description', e.target.value)}
                                                        className="w-full bg-slate-50 border-none p-3 rounded-xl font-bold text-xs outline-none focus:ring-2 ring-sky-500/20 underline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-40">
                                        <Layout size={40} className="mx-auto mb-4" />
                                        <p className="font-black uppercase text-xs tracking-widest">No modules defined in this node.</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleAddModule}
                                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-black uppercase tracking-widest text-[10px] hover:border-sky-500 hover:text-sky-500 transition-all flex items-center justify-center gap-2 underline-none"
                                >
                                    <Plus size={16} /> Add Module Layer
                                </button>
                            </div>

                            <div className="p-8 bg-white border-t border-slate-200">
                                <button
                                    onClick={handleCurriculumSubmit}
                                    disabled={formLoading}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-sky-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {formLoading ? 'Integrating...' : 'Commit Curriculum to Node'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            {/* Announcement Modal */}
            < AnimatePresence >
                {showAnnounceModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAnnounceModal(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                                        <Megaphone size={24} className="text-sky-500" />
                                        Announcement
                                    </h3>
                                    <button onClick={() => setShowAnnounceModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleAnnounceSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Subject</label>
                                        <input
                                            required
                                            placeholder="e.g., Upcoming Webinar Details"
                                            value={announceData.title}
                                            onChange={(e) => setAnnounceData({ ...announceData, title: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all underline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Message Body</label>
                                        <textarea
                                            required
                                            rows="4"
                                            placeholder="Broadcast details to all enrolled layers..."
                                            value={announceData.message}
                                            onChange={(e) => setAnnounceData({ ...announceData, message: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all underline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-sky-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {formLoading ? 'Transmitting...' : (
                                            <>
                                                <Send size={18} />
                                                Initialize Broadcast
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default CourseManagement;
