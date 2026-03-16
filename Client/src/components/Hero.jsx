import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, animate } from 'framer-motion';
import { CheckCircle, ArrowRight, Terminal, Cpu, Code2, Award, Sparkles, Video, MessageSquare, Users, Zap } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import api from '../api/axios';
import BrandLogo from './common/BrandLogo';
import Magnet from './common/Magnet';

import useIsMobile from '../hooks/useIsMobile';

const ScrollingAvatars = () => {
    return (
        <div className="flex flex-row items-center justify-center gap-4">
            <div className="flex -space-x-3 justify-center">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm relative z-[i]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${['Felix', 'Lily', 'Leo', 'Mia', 'Jake'][i-1]}`} alt="student" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
            <div className="text-[14px] md:text-[16px] font-semibold text-slate-600 tracking-tight">
                Trusted by <span className="text-[#F97316]">1000+</span> Students
            </div>
        </div>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const isMobile = useIsMobile();

    const handleEnrollNow = () => {
        navigate('/online-program');
    };

    return (
        <section id="home" ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-24 overflow-hidden bg-[#FDFCFB]">
            {/* Background Accents - Premium Orange-White Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/[0.06] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-200/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/[0.1] rounded-full blur-[140px]" />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full flex flex-col items-center mt-4">
                <div className="flex flex-col items-center justify-center text-center space-y-1 w-full">
                    {/* Top Text */}
                    <motion.h2
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.1 }}
                        className="text-lg md:text-2xl font-medium text-slate-600 tracking-tight"
                    >
                        Tomorrow's careers will demand <span className="text-blue-600 font-black">NEW SKILLS.</span>
                    </motion.h2>

                    {/* Headline Group */}
                    <div className="w-full px-2 sm:px-0 flex flex-col items-center relative">
                        <h1 className="text-[40px] sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px] font-black leading-[0.85] w-full uppercase select-none relative z-10 text-[#0F172A] mb-2">
                            <div className="flex flex-wrap justify-center items-baseline gap-x-[0.2em] mb-6">
                                <span>MAKE</span>
                                <span>SURE</span>
                                <span className="flex items-baseline">
                                    <span className="text-[#2563EB] text-[1.15em] leading-none">Y</span>
                                    <span className="tracking-tighter">OUR</span>
                                </span>
                                <span>CHILD</span>
                            </div>
                            <div className="flex flex-wrap justify-center text-[#F97316] tracking-tight">
                                IS READY
                            </div>
                        </h1>
                    </div>

                    {/* Paragraph Area - Industrial Tech Container */}
                    <motion.div
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.8 }}
                        className="max-w-7xl w-full px-6 md:px-12 py-4 md:py-5 bg-slate-50/40 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 relative group mt-4"
                    >
                        {/* HUD Elements */}
                        <div className="absolute top-4 left-6 flex gap-1.5 opacity-30">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        </div>

                        <p className="text-slate-600 font-medium leading-[1.8] text-[16px] md:text-[20px] tracking-tight text-center relative z-10 px-2 sm:px-0">
                            Most schools still teach the same syllabus they did 20 years ago. 
                            <span className="mx-2 text-slate-300">|</span>
                            <span className="inline-flex items-center font-black">
                                <span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span>
                            </span> fills that gap. 
                            <span className="text-slate-500 font-semibold ml-1">
                                Students master <span className="text-slate-900 font-bold bg-slate-100 px-2.5 py-0.5 rounded-lg">AI</span>, 
                                <span className="text-slate-900 font-bold px-1">Engineering</span>, and 
                                <span className="text-slate-900 font-bold px-1">Robotics</span> through live industrial sessions and real-world engineering protocols.
                            </span>
                        </p>

                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[3px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rounded-full" />
                    </motion.div>

                    {/* Social Proof Group */}
                    <motion.div
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.4 }}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <ScrollingAvatars />
                        
                        <motion.button
                            onClick={handleEnrollNow}
                            whileHover={{ 
                                y: [0, -8, 0],
                                scale: 1.05,
                                backgroundColor: "#d44317"
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ 
                                y: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                backgroundColor: { duration: 0.3 },
                                scale: { duration: 0.2 }
                            }}
                            className="px-12 py-4 bg-[#E84E1B] text-white font-black text-2xl rounded-2xl shadow-2xl flex items-center justify-center gap-4 min-w-[260px]"
                        >
                            Enroll now →
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
