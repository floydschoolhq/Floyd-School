import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';

const MessageForm = ({ isOpen, onClose, variant = 'dark' }) => {
    const isDark = variant === 'dark';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            const newMessage = {
                id: Date.now(),
                ...formData,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            messages.push(newMessage);
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 2000);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">SupportHub</h2>
                                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-80">Message our experts</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-10"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                        <CheckCircle className="text-green-500" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                                        Message Sent!
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Our team will respond within 24 hours.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 px-1">
                                                Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-slate-100 dark:border-white/5 rounded-xl transition-all bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-medium"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 px-1">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-slate-100 dark:border-white/5 rounded-xl transition-all bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-medium"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 px-1">
                                            Your Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={3}
                                            className="w-full px-5 py-3 border border-slate-100 dark:border-white/5 rounded-xl transition-all bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-medium resize-none"
                                            placeholder="Tell us more about your query..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-8 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black uppercase text-xs tracking-[0.3em] hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default MessageForm;
