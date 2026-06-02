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

    if (loading) return <div className="p-4 text-center text-text-muted font-bold animate-pulse text-xs tracking-wider">Loading Discussion...</div>;

    return (
        <div className="space-y-4 text-text-main">
            {/* Minimalistic Header */}
            <div className="flex items-center justify-between border-b border-surface-el/40 pb-3 mb-2">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-accent-primary" />
                    Discussion
                </h3>
                <span className="text-[10px] font-bold text-text-muted bg-surface-soft px-2 py-0.5 rounded-full border border-surface-el">
                    {comments.length} Comments
                </span>
            </div>

            {/* Post Comment Input Bar */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4 relative">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or add a comment..."
                    className="flex-1 bg-surface-soft border border-surface-el rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:border-accent-primary/60 transition-all text-text-main placeholder:text-text-muted/50"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-accent-primary hover:bg-accent-secondary text-white px-3 py-2 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer border-none shrink-0"
                >
                    <Send size={12} strokeWidth={2.5} />
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3.5">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-surface-el/30 pb-3.5 last:border-b-0"
                        >
                            <div className="flex gap-3">
                                {/* Sleek Avatar */}
                                <div className="w-7 h-7 rounded-lg bg-surface-soft border border-surface-el flex items-center justify-center text-text-muted font-bold text-xs shrink-0 select-none">
                                    {comment.studentName[0]}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5 gap-2">
                                        <h4 className="font-bold text-text-main text-xs truncate">{comment.studentName}</h4>
                                        <span className="text-[9px] text-text-muted">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted leading-relaxed mb-1.5 whitespace-pre-wrap break-words">{comment.text}</p>

                                    <div className="flex items-center gap-4">
                                        {comment.status === 'resolved' ? (
                                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                                                Resolved
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleConfirmResolution(comment._id)}
                                                className="flex items-center gap-1 text-[9px] font-bold text-text-muted hover:text-accent-primary transition-colors cursor-pointer bg-transparent border-none p-0"
                                            >
                                                <Heart size={10} /> {comment.likes || 0}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                                            className="flex items-center gap-1 text-[9px] font-bold text-text-muted hover:text-sky-500 transition-colors cursor-pointer bg-transparent border-none p-0"
                                        >
                                            <Reply size={10} /> Reply
                                        </button>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies?.length > 0 && (
                                        <div className="mt-3 ml-1 pl-3 border-l-2 border-surface-el space-y-2.5">
                                            {comment.replies.map((reply, ridx) => (
                                                <div key={ridx} className="flex gap-2">
                                                    <div className="w-5 h-5 rounded bg-surface-soft border border-surface-el flex items-center justify-center text-text-muted font-bold text-[9px] shrink-0 select-none">
                                                        {reply.userName[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                            <h5 className="font-bold text-text-main text-[11px] truncate">{reply.userName}</h5>
                                                            {reply.userRole && (reply.userRole === 'mentor' || reply.userRole === 'admin') && (
                                                                <span className="bg-amber-500/10 text-amber-600 text-[8px] px-1 py-0 rounded font-black uppercase border border-amber-500/20">
                                                                    Staff
                                                                </span>
                                                            )}
                                                            <span className="text-[8px] text-text-muted/60">
                                                                {new Date(reply.timestamp).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-text-muted leading-relaxed break-words">{reply.text}</p>
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
                                            className="mt-3 flex gap-2"
                                        >
                                            <input
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                className="flex-1 bg-surface-soft border border-surface-el rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-accent-primary text-text-main"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleReply(comment._id)}
                                                className="bg-accent-primary text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-accent-secondary transition-all cursor-pointer border-none shrink-0"
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
                    <div className="text-center py-6 bg-surface-soft/20 rounded-xl border border-dashed border-surface-el">
                        <p className="text-text-muted/50 font-bold uppercase text-[10px] tracking-wider">No discussions yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
