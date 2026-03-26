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
import RegistrationForm from './RegistrationForm';

const ScrollingAvatars = ({ isMobile }) => {
    if (isMobile) {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="flex -space-x-1 justify-center">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border-[1.5px] border-white bg-slate-200 overflow-hidden shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${['Felix', 'Lily', 'Leo'][i-1]}`} alt="student" className="w-full h-full object-cover" />
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
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    const handleEnrollNow = () => {
        const element = document.getElementById('online-focus');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isMobile) {
        return (
            <section id="home" ref={containerRef} className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden bg-slate-50">
                {/* Premium Background Effects */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-orange-500/[0.08] rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-15%] w-[300px] h-[300px] bg-blue-500/[0.05] rounded-full blur-[80px]" />
                </div>

                <div className="max-w-full mx-auto px-8 relative z-10 w-full flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
                        <div className="inline-flex items-center gap-2 bg-blue-500/5 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-blue-500/10">
                            Engineering the Future
                        </div>
                        
                        <p className="text-[13px] font-bold text-slate-500 tracking-tight leading-none uppercase">
                            Tomorrow demands <span className="text-blue-600 font-black">New Skills.</span>
                        </p>

                        <div className="w-full">
                            <h1 className="text-[38px] font-black leading-[0.85] text-slate-900 uppercase tracking-tighter">
                                <span className="block mb-1">Make Sure</span>
                                <span className="block mb-1">Your Child</span>
                                <span className="text-orange-500 text-[48px] block mt-2">Is Ready</span>
                            </h1>
                        </div>

                        <div className="w-full space-y-8 flex flex-col items-center pt-4">
                            <button
                                onClick={handleEnrollNow}
                                className="w-full bg-slate-900 text-white font-black text-lg py-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                            >
                                Enroll Now <ArrowRight size={20} className="text-orange-500" />
                            </button>
                            
                            <div className="pt-2">
                                <ScrollingAvatars isMobile={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }



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
