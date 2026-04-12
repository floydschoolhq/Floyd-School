import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, animate } from 'framer-motion';
import { CheckCircle, ArrowRight, Terminal, Cpu, Code2, Award, Sparkles, Video, MessageSquare, Users, Zap } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from '../contexts/PortalProvider';
import api from '../api/axios';
import BrandLogo from './common/BrandLogo';
import Magnet from './common/Magnet';

import useIsMobile from '../hooks/useIsMobile';
import RegistrationForm from './RegistrationForm';

const ScrollingAvatars = ({ isMobile }) => {
    if (isMobile) {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="flex -space-x-1 justify-center">
                    {['A', 'B', 'C'].map((letter, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-[1.5px] border-white bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                            <span className="text-white text-[8px] font-bold">{letter}</span>
                        </div>
                    ))}
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-white bg-orange-500 flex items-center justify-center shadow-sm">
                        <span className="text-white text-[8px] font-bold">+2</span>
                    </div>
                </div>
                <div className="text-[10px] font-semibold text-slate-600 text-center">
                    Trusted by <span className="text-[#F97316]">1000+</span> Students
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-row items-center justify-center gap-4">
            <div className="flex -space-x-3 justify-center">
                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                    <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-white bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm relative z-[i]">
                        <span className="text-sm md:text-base font-bold text-white">{letter}</span>
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
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    const handleEnrollNow = () => {
        const element = document.getElementById('online-focus');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isMobile) {
        return (
            <section id="hero" className="relative min-h-[70vh] flex flex-col items-center justify-center pt-48 pb-12 overflow-hidden bg-white">
                <div id="home" className="absolute inset-0" />
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -ml-32 -mb-32" />
                </div>

                <div className="max-w-full mx-auto px-8 relative z-10 w-full flex flex-col items-center mt-24 text-center">
                    <div className="mb-8">
                        <h2 className="text-[12px] md:text-sm font-medium text-slate-600 tracking-tight">
                            Tomorrow's careers will demand <span className="text-blue-600 font-black">NEW SKILLS.</span>
                        </h2>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-[13vw] font-black leading-[0.85] text-[#0F172A] uppercase tracking-tighter">
                            MAKE SURE <br/> 
                            YOUR CHILD <br/> 
                            <span className="text-[#F97316]">IS READY</span>
                        </h1>
                    </div>

                    <div className="w-full flex flex-col items-center gap-4">
                        <button
                            onClick={handleEnrollNow}
                            className="w-full px-10 py-5 bg-[#E84E1B] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                            Enroll now →
                        </button>
                        
                        <button
                            onClick={() => navigate('/school-partnerships')}
                            className="w-full px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                            Partner with Us
                        </button>

                        <div className="pt-4 opacity-80 scale-90">
                            <ScrollingAvatars isMobile={true} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }



    return (
        <section id="hero" ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-24 overflow-hidden bg-[#FDFCFB]">
            <div id="home" className="absolute inset-0" />
            {/* Background Accents - Premium Orange-White Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-500/[0.06] rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-amber-200/[0.05] rounded-full blur-[60px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/[0.1] rounded-full blur-[100px]" />
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
                                <span className="inline-flex items-baseline whitespace-nowrap">
                                    <span className="text-black">Y</span>
                                    <span className="tracking-tighter">OUR</span>
                                </span>
                                <span>CHILD</span>
                            </div>
                            <div className="flex flex-wrap justify-center text-[#F97316] tracking-tight whitespace-nowrap">
                                IS&nbsp;&nbsp;READY
                            </div>
                        </h1>
                    </div>

                    
                    {/* Social Proof Group */}
                    <motion.div
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.4 }}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <ScrollingAvatars isMobile={false} />
                        
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
            
            {/* Registration Form Modal */}
            <RegistrationForm 
                isOpen={isRegistrationModalOpen} 
                onClose={() => setIsRegistrationModalOpen(false)} 
                courseTitle=""
            />
        </section>
    );
};

export default Hero;
