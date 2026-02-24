import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, X, ArrowUpRight } from 'lucide-react';

const StickyBottomBar = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
        // Check if user has already dismissed the bar
        const isDismissed = localStorage.getItem('promo-bar-dismissed');
        if (isDismissed) return;

        // Initial show after 2.5 seconds
        const showTimer = setTimeout(() => setIsVisible(true), 2500);



        return () => {
            clearTimeout(showTimer);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('promo-bar-dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-4 left-0 right-0 z-[100] px-4 hidden md:flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 0.95 }}
                        exit={{ y: 50, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="pointer-events-auto relative group"
                    >
                        {/* Premium Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB]/15 via-white/5 to-[#2563EB]/15 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative flex items-center bg-[#1C1C1E]/40 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] px-32 py-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] gap-6">

                            {/* Future Tech - Segment 1 */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#FBEFEF] flex items-center justify-center shadow-lg shadow-[#2563EB]/20">
                                        <Zap size={16} className="text-[#1C1C1E] fill-[#1C1C1E]" />
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1C1C1E] animate-pulse" />
                                </div>
                                <div className="min-w-[120px]">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-black text-[12px] uppercase tracking-wide leading-none">Future Tech</h4>
                                        <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-widest px-1.5 py-0.5 bg-[#2563EB]/10 rounded-md">LIVE</span>
                                    </div>
                                    <p className="text-white/30 text-[9px] font-medium mt-0.5">Industrial Mentorship</p>
                                </div>
                                <button
                                    onClick={() => navigate('/student/login')}
                                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#2563EB] text-white hover:text-[#1C1C1E] transition-all duration-300 flex items-center justify-center group/btn"
                                >
                                    <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>

                            {/* Divider Line */}
                            <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                            {/* Certifications - Segment 2 */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Shield size={16} className="text-[#2563EB]" />
                                </div>
                                <div className="min-w-[120px]">
                                    <h4 className="text-white font-black text-[12px] uppercase tracking-wide leading-none">Certifications</h4>
                                    <p className="text-white/30 text-[9px] font-medium mt-0.5">Global Recognition</p>
                                </div>
                                <button
                                    onClick={() => navigate('/student/signup')}
                                    className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-white text-[#1C1C1E] font-black text-[10px] uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#2563EB]/5 active:scale-95"
                                >
                                    Access
                                </button>
                            </div>

                            {/* Close Action */}
                            <button
                                onClick={handleDismiss}
                                className="ml-2 p-1.5 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                                aria-label="Dismiss promoter"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StickyBottomBar;

