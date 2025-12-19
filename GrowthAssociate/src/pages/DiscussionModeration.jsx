import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Filter, Reply, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DiscussionModeration = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unresolved, replied
    const [selectedComment, setSelectedComment] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await api.get('/comments/all');
            setComments(res.data.comments);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedComment) return;

        try {
            await api.post(`/comments/${selectedComment._id}/replies`, { text: replyText });
            setReplyText('');
            // Optimistically update
            const updatedComments = comments.map(c => {
                if (c._id === selectedComment._id) {
                    return {
                        ...c,
                        replies: [
                            ...c.replies,
                            {
                                user: user._id,
                                userName: user.name,
                                userRole: user.role,
                                text: replyText,
                                timestamp: new Date()
                            }
                        ]
                    };
                }
                return c;
            });
            setComments(updatedComments);
            setSelectedComment(updatedComments.find(c => c._id === selectedComment._id));
        } catch (err) {
            console.error('Failed to post reply:', err);
        }
    };

    const handleResolve = async () => {
        if (!selectedComment) return;
        try {
            await api.patch(`/comments/${selectedComment._id}/resolve`);
            // Optimistic update
            const updated = { ...selectedComment, status: 'resolved' };
            setComments(comments.map(c => c._id === selectedComment._id ? updated : c));
            setSelectedComment(updated);
        } catch (err) {
            console.error('Failed to resolve:', err);
        }
    };

    const filteredComments = comments.filter(comment => {
        if (filter === 'all') return true;
        const hasMyReply = comment.replies.some(r => r.user === user._id || r.userRole === user.role); // Simple check
        if (filter === 'unresolved') return !hasMyReply && comment.replies.length === 0; // Very basic definition of unresolved
        if (filter === 'replied') return comment.replies.length > 0;
        return true;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* List View */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="text-orange-500" size={20} />
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Discussions</h2>
                    </div>

                    <div className="flex gap-2">
                        {['all', 'unresolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredComments.map(comment => (
                            <motion.div
                                key={comment._id}
                                layoutId={comment._id}
                                onClick={() => setSelectedComment(comment)}
                                className={`p-4 rounded-[1.5rem] border cursor-pointer transition-all ${selectedComment?._id === comment._id
                                    ? 'bg-orange-50 border-orange-200 shadow-sm'
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md">
                                        Module Discussion
                                    </span>
                                    {comment.replies.length > 0 ? (
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    ) : (
                                        <AlertCircle size={14} className="text-rose-400" />
                                    )}
                                </div>
                                <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">{comment.text}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500">
                                            {comment.studentName?.[0]}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500">{comment.studentName}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                        <Clock size={10} />
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail View */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
                {selectedComment ? (
                    <>
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                                        {selectedComment.studentName?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{selectedComment.studentName}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Student</p>
                                            {selectedComment.moduleTitle && (
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold truncate max-w-[200px]">
                                                    Ref: {selectedComment.moduleTitle}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {new Date(selectedComment.createdAt).toLocaleString()}
                                    </span>
                                    {selectedComment.status !== 'resolved' && selectedComment.status !== 'confirmed' && (
                                        <button
                                            onClick={handleResolve}
                                            className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    {selectedComment.status === 'resolved' && (
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            Marked Resolved
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                {selectedComment.status === 'confirmed' && (
                                    <div className="absolute top-0 right-0 bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-bl-xl border-l border-b border-slate-200">
                                        Archived
                                    </div>
                                )}
                                <p className="text-base font-medium text-slate-800 leading-relaxed">{selectedComment.text}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {selectedComment.replies.map((reply, idx) => (
                                <div key={idx} className={`flex ${reply.userRole === 'student' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] ${reply.userRole === 'student' ? 'bg-slate-100 text-slate-800' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'} p-4 rounded-2xl`}>
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{reply.userName}</span>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${reply.userRole === 'student' ? 'bg-slate-200 text-slate-500' : 'bg-white/20 text-white'
                                                }`}>
                                                {reply.userRole}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">{reply.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100">
                            <form onSubmit={handleReply} className="flex gap-3">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your official response..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="bg-slate-900 text-white px-6 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                        <MessageSquare size={64} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-400">Select a Discussion</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionModeration;
