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

    if (loading) return <div className="p-8 text-center text-text-muted font-bold animate-pulse uppercase tracking-widest text-xs sm:text-[13px]">Synchronizing Discussion Thread...</div>;

    return (
        <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8 text-text-main">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-soft border border-surface-el rounded-xl text-accent-primary">
                    <MessageSquare size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-text-main tracking-tight">Technical Discussion</h3>
                <span className="bg-surface-soft border border-surface-el text-text-muted px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-[13px] font-black">{comments.length} Thoughts</span>
            </div>

            {/* Post Comment */}
            <form onSubmit={handleSubmit} className="relative group">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share a technical insight or ask a doubt regarding this session..."
                    className="w-full bg-surface-soft border-2 border-surface-el rounded-2xl sm:rounded-3xl p-4 sm:p-6 pr-14 sm:pr-20 text-xs sm:text-base font-medium outline-none focus:border-accent-primary transition-all text-text-main placeholder:text-text-muted/60 min-h-[100px] sm:min-h-[120px] resize-none"
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
                    className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 bg-accent-primary text-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                    <Send size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4 sm:space-y-6">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface-soft rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-surface-el shadow-sm"
                        >
                            <div className="flex gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-surface-base border border-surface-el flex items-center justify-center text-text-muted font-black text-sm sm:text-base shrink-0">
                                    {comment.studentName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                                        <h4 className="font-bold text-text-main text-sm sm:text-base truncate">{comment.studentName}</h4>
                                        <span className="text-[10px] sm:text-[13px] font-black text-text-muted uppercase tracking-widest shrink-0">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-base text-text-muted leading-relaxed mb-3 sm:mb-4 whitespace-pre-wrap break-words">{comment.text}</p>

                                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                                        {comment.status === 'resolved' ? (
                                            <button
                                                onClick={() => handleConfirmResolution(comment._id)}
                                                className="flex items-center gap-1.5 text-[10px] sm:text-[13px] font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 transition-all cursor-pointer"
                                            >
                                                <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" /> Confirm Resolution
                                            </button>
                                        ) : (
                                            <button className="flex items-center gap-1.5 text-[10px] sm:text-[13px] font-black text-text-muted hover:text-accent-primary uppercase tracking-widest transition-colors cursor-pointer bg-transparent border-none p-0">
                                                <Heart size={12} className="sm:w-3.5 sm:h-3.5" /> {comment.likes || 0} Likes
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                                            className="flex items-center gap-1.5 text-[10px] sm:text-[13px] font-black text-text-muted hover:text-sky-500 uppercase tracking-widest transition-colors cursor-pointer bg-transparent border-none p-0"
                                        >
                                            <Reply size={12} className="sm:w-3.5 sm:h-3.5" /> Reply
                                        </button>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies?.length > 0 && (
                                        <div className="mt-4 sm:mt-6 ml-2 sm:ml-4 pl-4 sm:pl-6 border-l-2 border-surface-el space-y-4">
                                            {comment.replies.map((reply, ridx) => (
                                                <div key={ridx} className="flex gap-2 sm:gap-3">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-surface-base border border-surface-el flex items-center justify-center text-text-muted font-black text-[10px] sm:text-[13px] shrink-0">
                                                        {reply.userName[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                                                            <h5 className="font-bold text-text-main text-xs sm:text-base truncate">{reply.userName}</h5>
                                                            {reply.userRole && (reply.userRole === 'mentor' || reply.userRole === 'admin') && (
                                                                <span className="bg-amber-500/10 text-amber-500 text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-amber-500/20">
                                                                    Official
                                                                </span>
                                                            )}
                                                            <span className="text-[8px] sm:text-[11px] font-black text-text-muted/60 uppercase">
                                                                {new Date(reply.timestamp).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs sm:text-base text-text-muted break-words leading-normal">{reply.text}</p>
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
                                            className="mt-4 flex gap-2"
                                        >
                                            <input
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                className="flex-1 bg-surface-base border border-surface-el rounded-xl p-2.5 text-xs sm:text-sm font-medium outline-none focus:border-accent-primary text-text-main"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleReply(comment._id)}
                                                className="bg-accent-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-[13px] font-black uppercase tracking-widest hover:bg-accent-secondary transition-all cursor-pointer"
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
                    <div className="text-center py-8 sm:py-12 bg-surface-soft/50 rounded-2xl sm:rounded-[2rem] border border-dashed border-surface-el">
                        <MessageSquare className="mx-auto text-text-muted/40 mb-3 sm:mb-4" size={32} />
                        <p className="text-text-muted font-black uppercase tracking-widest text-[10px] sm:text-xs">No discussions started for this node</p>
                        <p className="text-text-muted/60 text-[9px] sm:text-xs font-bold mt-1 uppercase italic tracking-tighter">Be the first to share an insight.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
