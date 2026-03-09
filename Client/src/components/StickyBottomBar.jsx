import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, X, ArrowUpRight } from 'lucide-react';

const StickyBottomBar = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hideTimeoutRef = useRef(null);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('sticky_bar_dismissed', 'true');
    };

    useEffect(() => {
        const handleScroll = () => {
            if (sessionStorage.getItem('sticky_bar_dismissed') === 'true') {
                setIsVisible(false);
                return;
            }

            // Show bar only after scrolling past the Hero section (roughly 600px)
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check in case they are already scrolled
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-4 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ y: 80, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 80, opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="pointer-events-auto relative group w-full max-w-7xl lg:w-fit"
                    >
                        {/* Premium Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-orange-500/10 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="relative flex flex-col md:flex-row items-center bg-white/70 backdrop-blur-2xl border border-white/30 rounded-xl px-4 md:px-6 py-1 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.01] gap-3 md:gap-6">

                            {/* Program 1: Online Mastery */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="flex-1 md:min-w-[120px]">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-slate-800 font-semibold text-[13px] tracking-tight leading-none">Online Mastery</h4>
                                        <div className="px-1.5 py-0.5 bg-blue-500/5 rounded-md">
                                            <span className="text-[9px] font-bold text-blue-500/80 tracking-tight">Enroll Now</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-[10px] font-medium tracking-tight mt-1">Self-Paced Program</p>
                                </div>
                                <button
                                    onClick={() => navigate('/online-program')}
                                    className="px-4 py-2 rounded-lg bg-slate-900/90 hover:bg-black text-white font-medium text-[11px] tracking-tight transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                                >
                                    Explore <ArrowUpRight size={12} />
                                </button>
                            </div>

                            {/* Divider Line */}
                            <div className="hidden md:block h-6 w-[1px] bg-slate-100" />
                            <div className="block md:hidden w-full h-px bg-slate-100" />

                            {/* Program 2: Academy Courses */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="flex-1 md:min-w-[110px]">
                                    <h4 className="text-slate-800 font-semibold text-[13px] tracking-tight leading-none">Professional Course</h4>
                                    <p className="text-slate-400 text-[10px] font-medium tracking-tight mt-1">Job-Ready Curriculum</p>
                                </div>
                                <button
                                    onClick={() => navigate('/course')}
                                    className="px-4 py-2 rounded-lg bg-slate-900/90 hover:bg-black text-white font-medium text-[11px] tracking-tight transition-all active:scale-95 shadow-sm shadow-black/5"
                                >
                                    Purchase Course
                                </button>
                            </div>

                            {/* Close Action */}
                            <button
                                onClick={handleDismiss}
                                className="absolute -top-2 -right-1 md:relative md:top-0 md:right-0 p-1 text-slate-300 hover:text-slate-500 transition-all active:scale-90"
                                aria-label="Dismiss footer"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StickyBottomBar;

