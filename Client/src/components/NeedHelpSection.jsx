import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, Headphones, Clock, ArrowRight } from 'lucide-react';
import MessageForm from './MessageForm';
import useIsMobile from '../hooks/useIsMobile';

const NeedHelpSection = ({ variant = 'dark' }) => {
    const isDark = variant === 'dark';
    const [isMessageFormOpen, setIsMessageFormOpen] = useState(false);
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const contactMethods = [
        {
            icon: Send,
            title: 'Leave us a message',
            description: 'Send us your query and we\'ll get back to you soon',
            action: 'Send Message',
            color: 'blue'
        },
        {
            icon: Phone,
            title: 'Call Us',
            description: 'Speak directly with our course advisors',
            action: '+91 98765 43210',
            color: 'green'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get detailed responses via email',
            action: 'support@thinkskool.com',
            color: 'purple'
        }
    ];

    const colorMap = {
        blue: {
            bg: 'from-blue-500/20 to-blue-600/20',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
            hover: 'hover:bg-blue-500/10',
            icon: 'text-blue-400'
        },
        green: {
            bg: 'from-green-500/20 to-green-600/20',
            border: 'border-green-500/20',
            text: 'text-green-400',
            hover: 'hover:bg-green-500/10',
            icon: 'text-green-400'
        },
        purple: {
            bg: 'from-purple-500/20 to-purple-600/20',
            border: 'border-purple-500/20',
            text: 'text-purple-400',
            hover: 'hover:bg-purple-500/10',
            icon: 'text-purple-400'
        }
    };

    // Mobile-specific rendering
    if (isMobile) {
        return (
            <section className={`relative overflow-hidden py-24 px-6 ${
                isDark ? 'bg-slate-950' : 'bg-slate-50'
            }`}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                
                <div className="relative z-10 text-center">
                    <div className="mb-14 px-4">
                        <h2 className={`text-xl font-extrabold uppercase tracking-tight leading-none mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Need <span className="text-orange-500">Help?</span>
                        </h2>
                        <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Our dedicated support team is here to help you succeed. Reach out anytime through your preferred channel.
                        </p>
                    </div>

                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6 scrollbar-hide mb-10">
                        {contactMethods.map((method, index) => (
                            <div 
                                key={index} 
                                className={`snap-center shrink-0 w-[70vw] p-8 rounded-[2rem] border transition-all duration-300 active:scale-[0.98] ${
                                    isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                                } flex flex-col items-center text-center gap-6`}
                                onClick={() => index === 0 ? setIsMessageFormOpen(true) : window.location.href = index === 1 ? `tel:${method.action}` : `mailto:${method.action}`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                                    isDark ? 'bg-slate-800' : 'bg-slate-50 border border-slate-100'
                                }`}>
                                    <method.icon size={28} className={isDark ? 'text-blue-500' : 'text-blue-600'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-[16px] font-black uppercase tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>{method.title}</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60 leading-none mb-6">{method.action}</p>
                                    <div className="inline-flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                        Open Channel <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-slate-200'} rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-xl shadow-black/5`}>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                                <Clock size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-black uppercase tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>24h Support</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 px-4">Our engineering mentors are available around the clock to assist you.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/faq')}
                                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 active:scale-95 transition-all"
                            >
                                Browse FAQ →
                            </button>
                        </div>
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
        <section className={`relative overflow-hidden transition-all duration-500 ${
            isDark 
                ? 'bg-gradient-to-br from-slate-900 via-black to-slate-900 border-t border-white/5' 
                : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 border-t border-slate-200'
        }`}>
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-10 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
                    isDark ? 'bg-blue-500' : 'bg-blue-400'
                }`} />
                <div className={`absolute bottom-10 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
                    isDark ? 'bg-purple-500' : 'bg-purple-400'
                }`} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-widest mb-6 transition-all ${
                        isDark 
                            ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' 
                            : 'bg-orange-50 border-orange-100 text-orange-600'
                    }`}>
                        <Headphones size={12} />
                        <span>Support Center</span>
                    </div>
                    
                    <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase leading-none mb-6 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                        Need <span className={isDark ? 'text-orange-500' : 'text-orange-600'}>Help?</span>
                    </h2>
                    
                    <p className={`text-lg max-w-2xl mx-auto font-medium transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        Our dedicated support team is here to help you succeed. Reach out anytime through your preferred channel.
                    </p>
                </motion.div>

                {/* Contact Methods Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                >
                    {contactMethods.map((method, index) => {
                        const colors = colorMap[method.color];
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className={`group relative p-8 rounded-2xl border transition-all duration-300 ${
                                    isDark
                                        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-white/5'
                                        : 'bg-white/80 backdrop-blur-sm border-slate-200/50 hover:border-slate-300/50 hover:shadow-2xl hover:shadow-slate-200/20'
                                }`}
                            >
                                {/* Icon Container */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
                                    <method.icon size={28} className={colors.icon} />
                                </div>

                                {/* Content */}
                                <h3 className={`text-xl font-bold mb-3 transition-colors ${
                                    isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                                }`}>
                                    {method.title}
                                </h3>
                                
                                <p className={`text-sm mb-6 leading-relaxed ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    {method.description}
                                </p>

                                {/* Action Button */}
                                <button 
                                    onClick={() => index === 0 && setIsMessageFormOpen(true)}
                                    className={`w-full px-4 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                                        isDark
                                            ? `bg-gradient-to-r ${colors.bg} ${colors.border} ${colors.text} hover:shadow-lg ${colors.hover}`
                                            : `bg-gradient-to-r ${colors.bg} ${colors.border} ${colors.text} hover:shadow-lg ${colors.hover}`
                                    }`}
                                >
                                    {method.action}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Hover Effect */}
                                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                                    isDark
                                        ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                                        : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                                }`} />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Quick Response Promise */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`text-center p-8 rounded-3xl border transition-all ${
                        isDark
                            ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/20'
                            : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                    }`}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Clock className={isDark ? 'text-orange-400' : 'text-orange-600'} size={24} />
                        <h3 className={`text-2xl font-bold ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                            Quick Response Guaranteed
                        </h3>
                    </div>
                    <p className={`text-lg mb-6 max-w-2xl mx-auto ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                        We typically respond within 24 hours. For urgent matters, our live chat is available Monday-Friday, 9 AM - 6 PM IST.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                24-hour Response Time
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`} />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                Expert Support Team
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-600'}`} />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                100% Satisfaction
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className={`text-sm font-medium mb-4 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        Can't find what you're looking for?
                    </p>
                    <button 
                        onClick={() => navigate('/faq')}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                            isDark
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/25'
                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/25'
                        }`}>
                        <Send size={16} />
                        Browse FAQ
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
            
            {/* Message Form Modal */}
            <MessageForm 
                isOpen={isMessageFormOpen} 
                onClose={() => setIsMessageFormOpen(false)} 
                variant={variant}
            />
        </section>
    );
};

export default NeedHelpSection;
