import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Send, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import MessageForm from './MessageForm';
import useIsMobile from '../hooks/useIsMobile';

const NeedHelpSection = ({ variant = 'dark' }) => {
    const isDark = variant === 'dark';
    const [isMessageFormOpen, setIsMessageFormOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setToastMessage(`${type} copied to clipboard!`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setToastMessage(`${type} copied to clipboard!`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const contactMethods = [
        {
            id: 'message',
            icon: Send,
            title: 'Message Us',
            description: 'Send us your query and we\'ll get back to you soon',
            action: 'Send Message',
            color: 'from-blue-500 to-cyan-500',
            highlight: 'Live Support'
        },
        {
            id: 'call',
            icon: Phone,
            title: 'Call Us',
            description: 'Speak directly with our course advisors',
            action: '+91 85277 40849',
            copyText: '+91 85277 40849',
            color: 'from-emerald-500 to-teal-500',
            highlight: '9AM - 8PM'
        },
        {
            id: 'email',
            icon: Mail,
            title: 'Email Us',
            description: 'Get detailed responses via email',
            action: 'thinkskool.office@gmail.com',
            copyText: 'thinkskool.office@gmail.com',
            color: 'from-violet-500 to-purple-500',
            highlight: 'Official'
        },
        {
            id: 'faq',
            icon: Clock,
            title: 'Browse FAQ',
            description: 'Quick answers to common questions',
            action: 'View FAQ',
            path: '/faq',
            color: 'from-amber-500 to-orange-500',
            highlight: 'Self Help'
        }
    ];

    const handleAction = (e, method) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (isMobile) {
            if (method.id === 'message') {
                setIsMessageFormOpen(true);
            } else if (method.path) {
                navigate(method.path);
            } else if (method.id === 'call') {
                const cleanNum = method.copyText.replace(/[^0-9+]/g, '');
                window.location.href = `tel:${cleanNum}`;
            } else if (method.id === 'email') {
                window.location.href = `mailto:${method.copyText}`;
            }
        } else {
            if (method.copyText) {
                copyToClipboard(method.copyText, method.id === 'call' ? 'Phone number' : 'Email address');
            } else if (method.path) {
                navigate(method.path);
            } else {
                setIsMessageFormOpen(true);
            }
        }
    };

    return (
        <section id="contact" className={`py-24 md:py-32 px-6 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A] text-white border-t border-white/5' : 'bg-white text-slate-900'}`}>
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Subtitle */}
                <div className="flex flex-col items-center mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-3">
                            Need <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Help?</span>
                        </h2>
                        <p className="text-sm md:text-xl font-medium tracking-tight opacity-50 max-w-xl mx-auto md:leading-relaxed">
                            Professional support for all students.
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactMethods.map((method, index) => (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={(e) => handleAction(e, method)}
                            className={`group relative p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center text-center
                                ${isDark 
                                    ? 'bg-[#1c1c1c] border-[#2a2a2a] hover:bg-[#252525] hover:border-[#333]' 
                                    : 'bg-white border-slate-200 shadow-xl hover:shadow-2xl hover:bg-slate-50'
                                }`}
                        >
                            {/* Inner Glass Flare */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            {/* Icon Container with Glow */}
                            <div className="relative mb-8">
                                <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${method.color}`} />
                                <div className={`relative w-16 h-16 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 overflow-hidden ${isDark ? 'bg-[#0A0A0A] border-[#2a2a2a]' : 'bg-slate-900 border-white/5'}`}>
                                     {/* Background Accent */}
                                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${method.color}`} />
                                    <method.icon size={32} className="relative z-10 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center w-full">
                                <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 ${isDark ? 'bg-white/10 border border-white/15 text-white/70' : `bg-gradient-to-r ${method.color} text-white`}`}>
                                    {method.highlight}
                                </div>
                                <h3 className={`text-2xl font-black uppercase tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {method.title}
                                </h3>
                                <p className={`text-sm font-medium leading-relaxed opacity-50 mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {method.description}
                                </p>

                                {/* Action Bar */}
                                <div className={`w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2
                                    ${isDark 
                                        ? 'bg-white text-slate-950 group-hover:gap-4' 
                                        : 'bg-slate-900 text-white group-hover:gap-4'}`}>
                                    {method.action}
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <MessageForm 
                isOpen={isMessageFormOpen} 
                onClose={() => setIsMessageFormOpen(false)} 
                variant={variant}
            />
            
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest z-[100] shadow-2xl backdrop-blur-xl border flex items-center gap-3
                            ${isDark 
                                ? 'bg-white text-slate-900 border-white/20' 
                                : 'bg-slate-900 text-white border-black/20'
                            }`}
                    >
                        <ShieldCheck size={20} className="text-blue-500" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default NeedHelpSection;
