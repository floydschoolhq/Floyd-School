import React, { useState, useEffect } from 'react';
import {
    X,
    MessageSquare,
    User,
    Clock,
    Send,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const FrictionDetailsModal = ({ isOpen, onClose, moduleTitle }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && moduleTitle) {
            fetchDetails();
        }
    }, [isOpen, moduleTitle]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await adminApi.get(`/admin/friction/${encodeURIComponent(moduleTitle)}`);
            setComments(res.data.comments);
        } catch (err) {
            console.error('Failed to fetch friction details', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOutreach = (comment) => {
        // Pre-fill broadcast logic (Phase 3 Linkage)
        navigate('/broadcast', {
            state: {
                targetGroup: 'students',
                title: `Support: ${moduleTitle}`,
                message: `Hello ${comment.studentName}, we noticed you had some questions regarding '${moduleTitle}'. How can we assist you further?`
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Friction Analysis</h3>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-10">Module: {moduleTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-200/50 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning feedback nodes...</p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="py-20 text-center">
                            <MessageSquare className="mx-auto text-slate-100 mb-4" size={64} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active friction nodes identified.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {comments.map((comment, idx) => (
                                <motion.div
                                    key={comment._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-200 hover:bg-sky-50/10 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase text-xs tracking-tight">{comment.studentName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <Clock size={10} />
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-4 group-hover:border-sky-500/30 transition-all">
                                                "{comment.text}"
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleOutreach(comment)}
                                            className="mt-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sky-500 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                                        >
                                            <Send size={12} fill="currentColor" />
                                            Outreach
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Close Portal
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default FrictionDetailsModal;
