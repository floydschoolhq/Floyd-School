import React, { useState, useEffect } from 'react';
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
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const AssignmentGrading = () => {
    const toast = useToast();
    const [view, setView] = useState('assignments'); // 'assignments', 'submissions'
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradingSubmission, setGradingSubmission] = useState(null);

    // Grading form state
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/assignments');
            setAssignments(res.data.data);
        } catch (err) {
            console.error('Failed to fetch assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAssignment = async (assignment) => {
        setSelectedAssignment(assignment);
        setView('submissions');
        setLoading(true);
        try {
            const res = await api.get(`/assignments/${assignment._id}/submissions`);
            setSubmissions(res.data.data);
        } catch (err) {
            console.error('Failed to fetch submissions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/assignments/${gradingSubmission._id}/grade`, {
                grade: Number(grade),
                feedback
            });

            // Refresh submissions
            const res = await api.get(`/assignments/${selectedAssignment._id}/submissions`);
            setSubmissions(res.data.data);
            setGradingSubmission(null);
            setGrade('');
            setFeedback('');
            toast.success('Grade transmission finalized');
        } catch (err) {
            toast.error('Grade transmission hardware failure');
            console.error('Failed to submit grade:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const renderAssignmentList = () => (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                    Assessment <span className="text-sky-500">Pipeline</span>
                </h2>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                    Review and verify student technical specifications.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {assignments.map((assignment, idx) => (
                    <motion.div
                        key={assignment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectAssignment(assignment)}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">{assignment.title}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{assignment.course?.title || 'System Nodes'}</p>

                        <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
                                <span className="text-xs font-bold text-slate-900">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" size={20} />
                        </div>
                    </motion.div>
                ))}
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
                        {submissions.map((sub, idx) => (
                            <tr key={sub._id} className="hover:bg-slate-50/80 transition-all group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[10px] uppercase">
                                            {sub.student.name[0]}
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{sub.student.name}</span>
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
                        ))}
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

            {/* Grading Modal */}
            <AnimatePresence>
                {gradingSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setGradingSubmission(null)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Grade Transmission</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Student: {gradingSubmission.student.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setGradingSubmission(null)}
                                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                                    >
                                        <ChevronRight className="rotate-90" size={20} />
                                    </button>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Hardware (Content)</p>
                                    <div className="text-sm font-medium text-slate-700 leading-relaxed max-h-40 overflow-y-auto">
                                        {gradingSubmission.content}
                                    </div>
                                    {gradingSubmission.attachments?.length > 0 && (
                                        <div className="flex gap-2 pt-2">
                                            {gradingSubmission.attachments.map((at, i) => (
                                                <a key={i} href={at.url} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-sky-500 hover:bg-sky-50 transition-all flex items-center gap-1">
                                                    <ExternalLink size={10} /> Attachment {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleGradeSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade Point</label>
                                            <input
                                                type="number"
                                                max={selectedAssignment.maxPoints}
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                                required
                                                placeholder={`Max: ${selectedAssignment.maxPoints}`}
                                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                            />
                                        </div>
                                        <div className="flex items-end pb-2">
                                            <div className="bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 text-sky-600 font-bold text-sm">
                                                {((grade / selectedAssignment.maxPoints) * 100 || 0).toFixed(0)}% Score
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Critical Feedback</label>
                                        <textarea
                                            rows="3"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Provide constructive technical review..."
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                        />
                                    </div>

                                    <button
                                        disabled={submitting}
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? 'Transmitting Data...' : (
                                            <>
                                                <Award size={18} />
                                                Finalize Grade
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
