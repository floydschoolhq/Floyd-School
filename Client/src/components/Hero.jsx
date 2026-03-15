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
        <section id="home" ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-24 overflow-hidden bg-white">
            {/* Background Accents - Premium Pinkish Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-100/[0.15] rounded-full blur-[140px]" />
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
                        <motion.h1
                            className="text-[40px] sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px] font-black leading-[0.85] w-full uppercase select-none relative z-10"
                            style={{ perspective: "1000px" }}
                        >
                            <div className="flex flex-wrap justify-center gap-x-[0.2em] overflow-visible mb-2">
                                {"MAKE SURE YOUR CHILD".split(" ").map((word, i) => (
                                    <div key={i} className="overflow-visible py-1 px-1">
                                        <motion.span
                                            initial={isMobile ? { y: 0, rotateX: 0, opacity: 1 } : { y: "100%", rotateX: 30, opacity: 0 }}
                                            animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                            transition={isMobile ? { duration: 0 } : { 
                                                duration: 1.2, 
                                                delay: i * 0.1, 
                                                ease: [0.16, 1, 0.3, 1] 
                                            }}
                                            className="inline-block origin-bottom bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-slate-500 bg-clip-text text-transparent"
                                            style={{
                                                letterSpacing: "-0.05em",
                                                filter: "drop-shadow(0 15px 15px rgba(15, 23, 42, 0.08))"
                                            }}
                                        >
                                            {word.split("").map((char, charIdx) => (
                                                <motion.span
                                                    key={charIdx}
                                                    whileHover={{ 
                                                        y: -10, 
                                                        scale: 1.15,
                                                        color: "#2563EB",
                                                        transition: { type: "spring", stiffness: 300, damping: 15 } 
                                                    }}
                                                    className="inline-block cursor-default"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </motion.span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-[0.15em] overflow-visible">
                                {"IS READY".split(" ").map((word, i) => (
                                    <div key={i} className="overflow-visible py-1 px-1">
                                        <motion.span
                                            initial={isMobile ? { y: 0, rotateX: 0, opacity: 1 } : { y: "100%", rotateX: 30, opacity: 0 }}
                                            animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                            transition={isMobile ? { duration: 0 } : { 
                                                duration: 1.4, 
                                                delay: 0.4 + (i * 0.1), 
                                                ease: [0.16, 1, 0.3, 1] 
                                            }}
                                            className="inline-block origin-bottom bg-gradient-to-br from-[#F97316] via-[#F97316] to-[#d44317] bg-clip-text text-transparent relative group/ready"
                                            style={{
                                                letterSpacing: "-0.05em",
                                                filter: "drop-shadow(0 10px 25px rgba(249, 115, 22, 0.25))"
                                            }}
                                        >
                                            {word.split("").map((char, charIdx) => (
                                                <motion.span
                                                    key={charIdx}
                                                    whileHover={{ 
                                                        y: -10, 
                                                        scale: 1.15,
                                                        transition: { type: "spring", stiffness: 300, damping: 15 } 
                                                    }}
                                                    className="inline-block cursor-default"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                            {/* Industrial Glow Underline */}
                                            <div className="absolute -bottom-2 left-0 w-0 h-[3px] bg-gradient-to-r from-[#F97316] to-[#d44317] rounded-full group-hover/ready:w-full transition-all duration-700 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                                        </motion.span>
                                    </div>
                                ))}
                            </div>
                        </motion.h1>
                    </div>

                    {/* Paragraph Area - Industrial Tech Container */}
                    <motion.div
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.8 }}
                        className="max-w-4xl w-full px-6 md:px-12 py-4 md:py-5 bg-slate-50/40 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 relative group mt-4"
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
                            <span className="font-black text-slate-900 inline-flex items-center">
                                <span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span>
                            </span> fills that gap. 
                            <span className="block text-slate-500 font-semibold mt-1">
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
