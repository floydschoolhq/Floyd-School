import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, FileText, CheckCircle2, Clock, AlertCircle, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { getFileUrl } from '../../api/axios';


const AssignmentSubmissionModal = ({ isOpen, assignment, submission, onClose, onSubmitted }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        if (isOpen && assignment && !submission) {
            setContent('');
            setFile(null);
            setUploadedFile(null);
        }
    }, [isOpen, assignment?._id, submission?._id]);

    if (!assignment) return null;

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Check if file is PDF
        if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Only PDF files are supported');
            return;
        }

        // Check file size (e.g. max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setFile(selectedFile);
        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await api.post('/assignments/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadedFile(res.data.file);
            toast.success('PDF uploaded successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload PDF');
            setFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setUploadedFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('Add your solution before submitting');
            return;
        }

        try {
            setSubmitting(true);
            const attachments = uploadedFile ? [{ filename: uploadedFile.filename, url: uploadedFile.url }] : [];
            const res = await api.post(`/assignments/${assignment._id}/submit`, {
                content: content.trim(),
                attachments
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

                                {assignment.attachments && assignment.attachments.length > 0 && (
                                    <div className="mt-3 p-3 bg-surface-soft border border-surface-el rounded-xl flex items-center justify-between max-w-md">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText size={14} className="text-accent-primary flex-shrink-0" />
                                            <span className="text-[11px] font-bold text-text-main truncate max-w-[200px]">
                                                {assignment.attachments[0].filename}
                                            </span>
                                        </div>
                                        <a
                                            href={getFileUrl(assignment.attachments[0].url)}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 px-3 py-1 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                                        >
                                            Download Spec
                                        </a>
                                    </div>
                                )}
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
                                        
                                        {submission.attachments && submission.attachments.length > 0 && (
                                            <div className="mt-4 p-4 rounded-xl border border-surface-el bg-surface-base flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-text-main truncate max-w-[200px]">
                                                            {submission.attachments[0].filename}
                                                        </p>
                                                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">Attached PDF</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={getFileUrl(submission.attachments[0].url)}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 bg-surface-soft hover:bg-surface-el text-text-main rounded-lg text-[10px] font-black uppercase tracking-widest border border-surface-el"
                                                >
                                                    Download PDF
                                                </a>
                                            </div>
                                        )}
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
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Submission Content</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={6}
                                        placeholder="Describe your solution, reasoning, or implementation steps..."
                                        className="w-full rounded-2xl border border-surface-el bg-surface-soft px-4 py-4 text-sm text-text-main outline-none transition-colors focus:border-accent-primary resize-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">PDF Attachment</label>
                                    
                                    {!uploadedFile ? (
                                        <div className="relative border-2 border-dashed border-surface-el hover:border-accent-primary rounded-2xl p-6 text-center transition-colors bg-surface-soft/30 flex flex-col items-center justify-center min-h-[120px]">
                                            <input
                                                type="file"
                                                accept=".pdf,application/pdf"
                                                onChange={handleFileChange}
                                                disabled={uploading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            {uploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider animate-pulse">Uploading PDF...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="w-8 h-8 text-text-muted" />
                                                    <div>
                                                        <p className="text-xs font-bold text-text-main">
                                                            Click or drag & drop to upload your PDF
                                                        </p>
                                                        <p className="text-[10px] text-text-muted mt-1">PDF document only (max 10MB)</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl border border-surface-el bg-surface-soft flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-text-main truncate max-w-[250px]">{uploadedFile.filename}</p>
                                                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">Ready for submission</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="p-2 hover:bg-surface-el hover:text-red-500 rounded-xl text-text-muted transition-all"
                                                title="Remove file"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
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
