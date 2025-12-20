import React, { useState, useEffect, useRef } from 'react';
import {
    FileText,
    CheckCircle,
    Clock,
    User,
    ChevronRight,
    Search,
    ArrowLeft,
    ExternalLink,
    MessageSquare,
    Award,
    Plus,
    Trash2,
    Edit3,
    Upload,
    Paperclip,
    X,
    AlertCircle,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const AssignmentGrading = () => {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [view, setView] = useState('assignments'); // 'assignments', 'submissions'
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Create/Edit Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: '',
        category: 'Development',
        dueDate: '',
        maxPoints: 100,
        status: 'published',
        attachments: []
    });

    // Grading form state
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [assignRes, courseRes] = await Promise.all([
                api.get('/assignments'),
                api.get('/courses')
            ]);
            setAssignments(assignRes.data.data);
            setCourses(courseRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            toast.error('System synchronization failure');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const res = await api.get(`/assignments/${assignmentId}/submissions`);
            setSubmissions(res.data.data);
        } catch (err) {
            console.error('Failed to fetch submissions:', err);
            toast.error('Submission retrieval failure');
        }
    };

    const handleOpenCreateModal = () => {
        setEditingAssignment(null);
        setFormData({
            title: '',
            description: '',
            course: courses.length > 0 ? courses[0]._id : '',
            category: 'Development',
            dueDate: '',
            maxPoints: 100,
            status: 'published',
            attachments: []
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (e, assignment) => {
        e.stopPropagation();
        setEditingAssignment(assignment);
        setFormData({
            title: assignment.title,
            description: assignment.description,
            course: assignment.course?._id || assignment.course,
            category: assignment.category || 'Development',
            dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
            maxPoints: assignment.maxPoints || 100,
            status: assignment.status || 'published',
            attachments: assignment.attachments || []
        });
        setShowModal(true);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size exceeds 10MB limit');
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await api.post('/assignments/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, res.data.file]
            }));
            toast.success('Document uploaded to cloud');
        } catch (err) {
            toast.error('Upload link rejected by server');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingAssignment) {
                await api.put(`/assignments/${editingAssignment._id}`, formData);
                toast.success('Assignment specs updated');
            } else {
                await api.post('/assignments', formData);
                toast.success('New assignment deployed');
            }
            setShowModal(false);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Data persistence failure');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Confirm permanent deletion of this assignment node?')) return;

        try {
            await api.delete(`/assignments/${id}`);
            toast.success('Node decommissioned');
            fetchInitialData();
        } catch (err) {
            toast.error('Deletion protocol failed');
        }
    };

    const handleSelectAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setView('submissions');
        fetchSubmissions(assignment._id);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/assignments/${gradingSubmission._id}/grade`, {
                grade: Number(grade),
                feedback
            });
            fetchSubmissions(selectedAssignment._id);
            setGradingSubmission(null);
            setGrade('');
            setFeedback('');
            toast.success('Grade transmission finalized');
        } catch (err) {
            toast.error('Grade transmission failure');
        } finally {
            setSubmitting(false);
        }
    };

    const renderAssignmentList = () => (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Assessment <span className="text-sky-500">Pipeline</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Review and verify student technical specifications.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                >
                    <Plus size={18} /> Deploy Assignment
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {assignments.length > 0 ? assignments.map((assignment, idx) => (
                    <motion.div
                        key={assignment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectAssignment(assignment)}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 ${assignment.status === 'published' ? 'bg-slate-900' : 'bg-slate-200'} text-white rounded-2xl flex items-center justify-center group-hover:bg-sky-500 transition-colors`}>
                                <FileText size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleOpenEditModal(e, assignment)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sky-500 transition-all"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, assignment._id)}
                                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md ${assignment.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {assignment.status}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                                    {assignment.category}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight truncate">{assignment.title}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">{assignment.course?.title || 'System Nodes'}</p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Date</span>
                                <span className="text-xs font-bold text-slate-900">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 group-hover:text-sky-500 transition-all font-black text-[10px] uppercase">
                                View Submissions <ChevronRight size={16} />
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border border-dashed border-slate-300 flex flex-col items-center justify-center opacity-40">
                        <FileText size={48} className="mb-4" />
                        <h3 className="text-2xl font-black uppercase">No Assignments Found</h3>
                        <p className="text-xs font-bold uppercase tracking-widest">Deploy your first assignment to start tracking.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSubmissionList = () => (
        <div className="space-y-8">
            <button
                onClick={() => setView('assignments')}
                className="flex items-center gap-2 text-slate-400 hover:text-sky-500 font-black text-xs uppercase tracking-[0.2em] transition-all"
            >
                <ArrowLeft size={14} strokeWidth={3} />
                Back to Pipeline
            </button>

            <header>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                    {selectedAssignment.title} <span className="text-sky-500">Submissions</span>
                </h2>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                    Verifying {submissions.length} student transmissions.
                </p>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Node</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submitted At</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Grade</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {submissions.length > 0 ? submissions.map((sub, idx) => (
                            <tr key={sub._id} className="hover:bg-slate-50/80 transition-all group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[10px] uppercase">
                                            {sub.student?.name?.[0] || 'U'}
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{sub.student?.name}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-xs font-bold text-slate-500">
                                    {new Date(sub.submittedAt).toLocaleString()}
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${sub.status === 'graded'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className="text-sm font-black text-slate-900">{sub.grade ?? '--'}</span>
                                    <span className="text-slate-400 text-xs font-bold ml-1">/ {selectedAssignment.maxPoints}</span>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => setGradingSubmission(sub)}
                                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all"
                                    >
                                        Grade Logic
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center opacity-30">
                                    <div className="text-xs font-black uppercase tracking-widest">No transmissions detected yet</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    {view === 'assignments' ? renderAssignmentList() : renderSubmissionList()}
                </>
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
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight italic">
                                        {editingAssignment ? 'Update' : 'Initialize'} <span className="text-sky-500">Assignment Node</span>
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Technical Spec Configuration</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignment Title</label>
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                                placeholder="e.g. Neural Network Implementation"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Course Node</label>
                                            <select
                                                required
                                                value={formData.course}
                                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all appearance-none"
                                            >
                                                <option value="" disabled>Select Target Course</option>
                                                {courses.map(c => (
                                                    <option key={c._id} value={c._id}>{c.title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-xs outline-none focus:border-sky-500 transition-all"
                                                >
                                                    {['Development', 'Algorithms', 'Database', 'Debugging', 'System Design'].map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Points</label>
                                                <input
                                                    type="number"
                                                    value={formData.maxPoints}
                                                    onChange={(e) => setFormData({ ...formData, maxPoints: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Objective Status</label>
                                            <div className="flex gap-4">
                                                {['published', 'draft'].map(stat => (
                                                    <button
                                                        type="button"
                                                        key={stat}
                                                        onClick={() => setFormData({ ...formData, status: stat })}
                                                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === stat
                                                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                                                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {stat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date (UTC)</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                                            <textarea
                                                required
                                                rows="5"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-medium outline-none focus:border-sky-500 transition-all resize-none"
                                                placeholder="Enter full technical specifications and requirements..."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                                Reference Material
                                                <span className="text-[9px] lowercase italic font-normal">(Max 10MB)</span>
                                            </label>

                                            <div className="space-y-2">
                                                {formData.attachments.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group animate-in fade-in slide-in-from-right-2">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Paperclip size={14} className="text-sky-500" />
                                                            <span className="text-[11px] font-bold text-slate-600 truncate">{file.filename}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttachment(i)}
                                                            className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-all"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                disabled={uploading}
                                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-sky-500/50 hover:bg-sky-50/30 transition-all group"
                                            >
                                                {uploading ? (
                                                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white group-hover:text-sky-500 transition-all">
                                                            <Upload size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Attach Specs (10MB Limit)</span>
                                                    </>
                                                )}
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-sky-500 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {submitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={20} /> Deploy Assignment Architecture
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Grading Modal */}
            <AnimatePresence>
                {gradingSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setGradingSubmission(null)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Grade <span className="text-sky-500">Transmission</span></h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Node: {gradingSubmission.student?.name}</p>
                                </div>
                                <button
                                    onClick={() => setGradingSubmission(null)}
                                    className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Submission Payload</span>
                                        <Clock size={14} />
                                    </div>
                                    <div className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {gradingSubmission.content}
                                    </div>
                                    {gradingSubmission.attachments?.length > 0 && (
                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                                            {gradingSubmission.attachments.map((at, i) => (
                                                <a
                                                    key={i}
                                                    href={api.defaults.baseURL + at.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-sky-500 hover:bg-sky-50 transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    <ExternalLink size={12} /> {at.filename || `Doc ${i + 1}`}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleGradeSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade Point</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    max={selectedAssignment.maxPoints}
                                                    value={grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                    required
                                                    placeholder={`Max: ${selectedAssignment.maxPoints}`}
                                                    className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl font-black text-xl outline-none focus:border-sky-500 transition-all"
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">/ {selectedAssignment.maxPoints}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-end pb-3">
                                            <div className="w-full bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-emerald-600 uppercase">Efficiency</span>
                                                <span className="text-xl font-black text-emerald-600">
                                                    {((grade / selectedAssignment.maxPoints) * 100 || 0).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Critical Technical Feedback</label>
                                        <textarea
                                            rows="4"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            required
                                            placeholder="Enter comprehensive feedback for the student node..."
                                            className="w-full bg-slate-50 border border-slate-200 p-6 rounded-[2rem] font-medium outline-none focus:border-sky-500 transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        disabled={submitting}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Award size={20} /> Finalize Verification
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssignmentGrading;
