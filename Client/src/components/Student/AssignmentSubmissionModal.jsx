import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, FileText, CheckCircle2, Clock, AlertCircle, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AssignmentSubmissionModal = ({ isOpen, assignment, submission, onClose, onSubmitted }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && assignment && !submission) {
            setContent('');
        }
    }, [isOpen, assignment?._id, submission?._id]);

    if (!assignment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('Add your solution before submitting');
            return;
        }

        try {
            setSubmitting(true);
            const res = await api.post(`/assignments/${assignment._id}/submit`, {
                content: content.trim()
            });

            const createdSubmission = res.data?.data || res.data?.submission || res.data;

            onSubmitted?.({
                ...createdSubmission,
                assignment: {
                    _id: assignment._id,
                    title: assignment.title
                }
            });

            toast.success('Assignment submitted');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl rounded-[2rem] bg-surface-base border border-surface-el shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-start justify-between gap-6 p-6 md:p-8 border-b border-surface-el">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">
                                    Assignment Console
                                </p>
                                <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                    {assignment.title}
                                </h2>
                                <p className="mt-2 text-sm text-text-muted">
                                    {assignment.course?.title || 'Course'} · Due {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-surface-soft transition-colors"
                            >
                                <X className="w-5 h-5 text-text-muted" />
                            </button>
                        </div>

                        {submission ? (
                            <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-accent-primary">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Submission Received
                                    </div>

                                    <div className="rounded-2xl border border-surface-el bg-surface-soft p-5">
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted mb-3">Your Response</p>
                                        <p className="text-sm leading-relaxed text-text-main whitespace-pre-wrap">
                                            {submission.content}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-2xl border border-surface-el bg-surface-soft p-5">
                                        <div className="flex items-center gap-3 mb-3 text-text-main">
                                            <Clock className="w-4 h-4 text-text-muted" />
                                            <span className="text-sm font-black uppercase tracking-widest">Status</span>
                                        </div>
                                        <p className="text-lg font-black text-text-main capitalize">{submission.status}</p>
                                        <p className="mt-2 text-xs text-text-muted">
                                            Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'recently'}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-surface-el bg-surface-soft p-5">
                                        <div className="flex items-center gap-3 mb-3 text-text-main">
                                            <Award className="w-4 h-4 text-accent-primary" />
                                            <span className="text-sm font-black uppercase tracking-widest">Review</span>
                                        </div>
                                        <p className="text-3xl font-black text-text-main">
                                            {typeof submission.grade === 'number' ? `${submission.grade}%` : 'Pending'}
                                        </p>
                                        <p className="mt-2 text-xs text-text-muted">
                                            {submission.feedback || 'Mentor feedback will appear here.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                                <div className="rounded-2xl border border-surface-el bg-surface-soft p-5 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                    <p className="text-sm text-text-muted leading-relaxed">
                                        Submit the core explanation for your work here. Attachments can be added later when file uploads are enabled.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Submission</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={8}
                                        placeholder="Describe your solution, reasoning, or implementation steps..."
                                        className="w-full rounded-2xl border border-surface-el bg-surface-soft px-4 py-4 text-sm text-text-main outline-none transition-colors focus:border-accent-primary resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <FileText className="w-4 h-4" />
                                        {assignment.maxPoints || 100} points possible
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                                    >
                                        <Send className="w-4 h-4" />
                                        {submitting ? 'Submitting...' : 'Submit Work'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AssignmentSubmissionModal;
