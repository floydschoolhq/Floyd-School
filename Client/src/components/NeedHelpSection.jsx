import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, Headphones, Clock, ArrowRight } from 'lucide-react';
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
            // Fallback for older browsers
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
            color: 'blue',
            highlight: 'Live Support'
        },
        {
            id: 'call',
            icon: Phone,
            title: 'Call Us',
            description: 'Speak directly with our course advisors',
            action: '+91 85277 40849',
            copyText: '+91 85277 40849',
            color: 'green',
            highlight: '9AM - 8PM'
        },
        {
            id: 'email',
            icon: Mail,
            title: 'Email Us',
            description: 'Get detailed responses via email',
            action: 'thinkskool.office@gmail.com',
            copyText: 'thinkskool.office@gmail.com',
            color: 'purple',
            highlight: 'Official'
        },
        {
            id: 'faq',
            icon: Clock,
            title: 'Browse FAQ',
            description: 'Quick answers to common questions',
            action: 'View FAQ',
            path: '/faq',
            color: 'orange',
            highlight: 'Self Help'
        }
    ];

    const colorMap = {
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', icon: 'text-blue-500' },
        green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', icon: 'text-green-500' },
        purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', icon: 'text-purple-500' }
    };

    if (isMobile) {
        return (
            <section id="contact" className={`py-20 px-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Header: Centered & Minimalist */}
                    <div className="text-center mb-12">
                        <h2 className={`text-4xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Need <span className="text-orange-500">Help?</span>
                        </h2>
                        <p className={`text-[12px] font-medium tracking-tight opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Professional support for all stakeholders.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {/* 1. Message Us: Full Width (Button) */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsMessageFormOpen(true)}
                            className={`p-8 rounded-[2rem] border flex flex-col items-center text-center gap-4 transition-all w-full select-none cursor-pointer relative z-40 ${
                                isDark ? 'bg-white/[0.03] border-white/10 shadow-2xl active:bg-white/[0.05]' : 'bg-slate-50 border-slate-100 shadow-lg active:bg-slate-100'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                                <Send size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className={`text-[15px] uppercase tracking-tight font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Message Us</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 animate-pulse">Live Support</p>
                            </div>
                        </motion.button>

                        {/* 2 & 3. Call & Email: Redesigned Mobile Buttons */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {/* Call Button */}
                            <a
                                href="tel:+918527740849"
                                className="p-4 rounded-[1.5rem] bg-gradient-to-br from-green-500 to-green-600 border border-green-400/20 shadow-lg shadow-green-500/20 active:scale-95 transition-all duration-200 flex flex-col items-center text-center gap-2 text-white no-underline"
                            >
                                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Phone size={16} className="text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[11px] uppercase tracking-tight font-black text-white">Call</h3>
                                    <p className="text-[7px] font-medium text-green-100">+91 85277 40849</p>
                                </div>
                            </a>

                            {/* Email Button */}
                            <a
                                href="mailto:thinkskool.office@gmail.com"
                                className="p-4 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/20 shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200 flex flex-col items-center text-center gap-2 text-white no-underline"
                            >
                                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Mail size={16} className="text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[11px] uppercase tracking-tight font-black text-white">Email</h3>
                                    <p className="text-[7px] font-medium text-blue-100">Contact Us</p>
                                </div>
                            </a>
                        </div>

                        {/* 4. Browse FAQ: Full Width (Simple Button) */}
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/faq')}
                            className={`p-6 rounded-[2rem] border flex flex-col items-center text-center gap-4 transition-all w-full select-none cursor-pointer relative z-40 ${
                                isDark ? 'bg-white/[0.03] border-white/10 shadow-2xl active:bg-white/[0.05]' : 'bg-slate-50 border-slate-100 shadow-lg active:bg-slate-100'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
                                <Clock size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className={`text-[13px] uppercase tracking-tight font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Browse FAQ</h3>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Self Help</p>
                            </div>
                        </motion.button>
                    </div>
                </div>

                <MessageForm 
                    isOpen={isMessageFormOpen} 
                    onClose={() => setIsMessageFormOpen(false)} 
                    variant={variant}
                />
            </section>
        );
    }

    return (
        <section id="contact" className={`py-32 px-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Minimal Header Desktop */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className={`text-6xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Need <span className="text-orange-500">Help?</span>
                    </h2>
                    <p className={`text-lg font-medium tracking-tight opacity-60 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Our dedicated support team is here to help you succeed through your preferred channel.
                    </p>
                </motion.div>

                {/* Centered Grid Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {contactMethods.map((method, index) => {
                        const colors = colorMap[method.color] || { bg: 'bg-orange-500/10', text: 'text-orange-500' };
                        const handleAction = () => {
                            if (method.copyText) {
                                copyToClipboard(method.copyText, method.title === 'Call Us' ? 'Phone number' : 'Email address');
                            } else if (method.path) {
                                navigate(method.path);
                            } else {
                                setIsMessageFormOpen(true);
                            }
                        };

                        return (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileTap={{ scale: 0.98 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={handleAction}
                                    className={`p-10 rounded-[2.5rem] border flex flex-col items-center text-center gap-6 transition-all hover:scale-[1.02] cursor-pointer group select-none ${
                                        isDark ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20 shadow-2xl' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl'
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors.bg} ${colors.text}`}>
                                        <method.icon size={32} />
                                    </div>
                                    <div className="space-y-4 flex flex-col items-center w-full">
                                        <h3 className={`text-2xl uppercase tracking-tight font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {method.title}
                                        </h3>
                                        <p className={`text-sm opacity-60 leading-relaxed px-4 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {method.description}
                                        </p>
                                        <div className={`mt-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all w-full truncate
                                            ${isDark ? 'bg-white text-slate-950 group-hover:bg-orange-500 group-hover:text-white' : 'bg-slate-950 text-white group-hover:bg-orange-500'}`}>
                                            {method.action}
                                        </div>
                                    </div>
                                </motion.div>
                        );
                    })}
                </div>
            </div>

            <MessageForm 
                isOpen={isMessageFormOpen} 
                onClose={() => setIsMessageFormOpen(false)} 
                variant={variant}
            />
            
            {/* Toast Notification */}
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-medium text-sm z-50 ${
                        isDark 
                            ? 'bg-white text-slate-900 shadow-xl' 
                            : 'bg-slate-900 text-white shadow-xl'
                    }`}
                >
                    {toastMessage}
                </motion.div>
            )}
        </section>
    );
};

export default NeedHelpSection;
