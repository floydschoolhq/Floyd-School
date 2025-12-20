import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, ThumbsUp, Reply, User, Heart, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

const CommentSection = ({ moduleId, moduleTitle }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        if (moduleId) {
            fetchComments();
        }
    }, [moduleId]);

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/${moduleId}`);
            setComments(res.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await api.post('/comments', {
                moduleId,
                moduleTitle,
                text: newComment
            });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmResolution = async (commentId) => {
        if (!window.confirm('Confirm that your query is resolved? This will remove it from the discussion.')) return;
        try {
            await api.patch(`/comments/${commentId}/confirm`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error('Failed to confirm resolution:', err);
        }
    };

    const handleReply = async (commentId) => {
        if (!replyText.trim()) return;

        try {
            const res = await api.post(`/comments/${commentId}/replies`, {
                text: replyText
            });
            setComments(comments.map(c => c._id === commentId ? res.data : c));
            setReplyTo(null);
            setReplyText('');
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[13px]">Synchronizing Discussion Thread...</div>;

    return (
        <div className="mt-12 space-y-8 font-['Inter']">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FCF8F8] rounded-xl text-[#F5AFAF]">
                    <MessageSquare size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit'] tracking-tight">Technical Discussion</h3>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[13px] font-black">{comments.length} Thoughts</span>
            </div>

            {/* Post Comment */}
            <form onSubmit={handleSubmit} className="relative group">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share a technical insight or ask a doubt regarding this session..."
                    className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 pr-20 text-base font-medium outline-none focus:border-[#F5AFAF] transition-all shadow-xl shadow-slate-200/20 min-h-[120px] resize-none"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute right-4 bottom-4 bg-[#F5AFAF] text-white p-4 rounded-2xl shadow-lg shadow-[#F5AFAF]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <Send size={18} strokeWidth={3} />
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-6 border border-slate-50 shadow-sm"
                        >
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-base">
                                    {comment.studentName[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-slate-900 text-base">{comment.studentName}</h4>
                                        <span className="text-[13px] font-black text-slate-300 uppercase tracking-widest">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-base text-slate-600 leading-relaxed mb-4">{comment.text}</p>

                                    <div className="flex items-center gap-6">
                                        {comment.status === 'resolved' ? (
                                            <button
                                                onClick={() => handleConfirmResolution(comment._id)}
                                                className="flex items-center gap-2 text-[13px] font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 transition-all"
                                            >
                                                <CheckCircle2 size={14} /> Confirm Resolution
                                            </button>
                                        ) : (
                                            <button className="flex items-center gap-2 text-[13px] font-black text-slate-400 hover:text-[#F5AFAF] uppercase tracking-widest transition-colors">
                                                <Heart size={14} /> {comment.likes || 0} Likes
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                                            className="flex items-center gap-2 text-[13px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors"
                                        >
                                            <Reply size={14} /> Reply
                                        </button>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies?.length > 0 && (
                                        <div className="mt-6 ml-4 pl-6 border-l-2 border-slate-50 space-y-4">
                                            {comment.replies.map((reply, ridx) => (
                                                <div key={ridx} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 font-black text-[13px]">
                                                        {reply.userName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h5 className="font-bold text-slate-800 text-base">{reply.userName}</h5>
                                                            {reply.userRole && (reply.userRole === 'mentor' || reply.userRole === 'admin') && (
                                                                <span className="bg-amber-100 text-amber-600 text-[11px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest border border-amber-200">
                                                                    Official
                                                                </span>
                                                            )}
                                                            <span className="text-[11px] font-black text-slate-300 uppercase">
                                                                {new Date(reply.timestamp).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-base text-slate-500">{reply.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Input */}
                                    {replyTo === comment._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 flex gap-3"
                                        >
                                            <input
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-base font-medium outline-none focus:border-sky-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleReply(comment._id)}
                                                className="bg-sky-500 text-white px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all"
                                            >
                                                Reply
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {comments.length === 0 && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                        <MessageSquare className="mx-auto text-slate-200 mb-4" size={40} />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[13px]">No discussions started for this node</p>
                        <p className="text-slate-300 text-[13px] font-bold mt-1 uppercase italic tracking-tighter">Be the first to share an insight.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
