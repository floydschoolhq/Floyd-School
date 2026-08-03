import React from 'react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

import useIsMobile from '../hooks/useIsMobile';
import RegistrationForm from './RegistrationForm';

import boy1Img from '../assets/avatars/boy1.jpg';
import boy2Img from '../assets/avatars/boy2.jpg';
import girl1Img from '../assets/avatars/girl1.jpg';

const AVATARS = [boy1Img, girl1Img, boy2Img];

const ScrollingAvatars = ({ isMobile }) => {
    if (isMobile) {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="flex -space-x-2 justify-center">
                    {AVATARS.map((img, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-100">
                            <img src={img} alt={`Student ${i+1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="text-xs font-medium text-slate-600 text-center">
                    Trusted by <span className="text-red-500 font-bold">1000+</span> Students
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-row items-center justify-center gap-4">
            <div className="flex -space-x-3 justify-center">
                {AVATARS.map((img, i) => (
                    <div key={i} className="w-10 h-10 md:w-11 md:h-11 rounded-full border-[2.5px] border-white overflow-hidden shadow-sm bg-slate-100">
                        <img src={img} alt={`Student ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
            <div className="text-[15px] font-medium text-slate-600 tracking-tight">
                Trusted by <span className="text-red-500 font-bold">1000+</span> Students
            </div>
        </div>
    );
};

/* 4 feature pills shown at the bottom of the hero */
const FEATURES = [
    {
        label: 'Expert-Led Courses',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        label: 'Future-Ready Curriculum',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-8 4 4 4-6" />
            </svg>
        ),
    },
    {
        label: 'Practical Learning',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
    {
        label: 'Mentorship & Support',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

const FeatureBar = () => (
    <div className="w-full border-t border-gray-200 mt-12 md:mt-16 pt-6 md:pt-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-14 lg:gap-20">
            {FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 text-slate-700">
                    <span className="text-slate-500">{f.icon}</span>
                    <span className="text-xs md:text-sm font-semibold tracking-tight whitespace-nowrap">{f.label}</span>
                </div>
            ))}
        </div>
    </div>
);

/* Red hand-drawn swoosh SVG under "IS READY" */
const RedSwoosh = () => (
    <svg
        viewBox="0 0 280 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] pointer-events-none"
        preserveAspectRatio="none"
    >
        <path
            d="M4 12C30 4 70 2 140 8C210 14 250 10 276 6"
            stroke="#E53E3E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
        />
        <path
            d="M10 14C50 8 100 4 140 10C180 16 230 12 270 8"
            stroke="#E53E3E"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
        />
    </svg>
);


const Hero = () => {
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
            <section id="hero" className="relative min-h-[75vh] flex flex-col items-center justify-center pt-48 pb-8 overflow-hidden bg-white">
                <div id="home" className="absolute inset-0" />
                {/* Subtle gray circle accents */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] right-[-15%] w-56 h-56 rounded-full border border-gray-100 bg-gray-50/40" />
                    <div className="absolute bottom-[5%] left-[-10%] w-40 h-40 rounded-full border border-gray-100 bg-gray-50/30" />
                </div>

                <div className="max-w-full mx-auto px-6 relative z-10 w-full flex flex-col items-center mt-16 text-center">
                    <div className="mb-6">
                        <h2 className="text-[12px] font-medium text-slate-600 tracking-tight">
                            Tomorrow's careers will demand <span className="text-red-500 font-black">NEW SKILLS.</span>
                        </h2>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-[12vw] font-black leading-[0.88] text-[#0F172A] uppercase tracking-tighter">
                            MAKE SURE <br/> 
                            YOUR CHILD <br/> 
                            <span className="relative inline-block">
                                IS READY
                                <RedSwoosh />
                            </span>
                        </h1>
                    </div>

                    <div className="mb-6">
                        <ScrollingAvatars isMobile={true} />
                    </div>

                    <div className="w-full flex flex-col items-center gap-4">
                        <button
                            onClick={handleEnrollNow}
                            className="px-10 py-4 bg-[#111111] text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            Enroll now <span className="text-base">→</span>
                        </button>
                    </div>

                    <FeatureBar />
                </div>
            </section>
        );
    }

    return (
        <section id="hero" ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-16 overflow-hidden bg-white">
            <div id="home" className="absolute inset-0" />
            {/* Background — subtle gray circles like the reference image */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Large circle on right */}
                <div className="absolute top-[8%] right-[-8%] w-[420px] h-[420px] rounded-full border border-gray-100 bg-gray-50/50" />
                {/* Smaller circle bottom-right */}
                <div className="absolute bottom-[10%] right-[2%] w-[260px] h-[260px] rounded-full border border-gray-100 bg-gray-50/40" />
                {/* Faint circle left */}
                <div className="absolute top-[40%] left-[-6%] w-[200px] h-[200px] rounded-full border border-gray-50 bg-gray-50/20" />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full flex flex-col items-center mt-4">
                <div className="flex flex-col items-center justify-center text-center space-y-1 w-full">
                    {/* Top Text */}
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl font-medium text-slate-600 tracking-tight"
                    >
                        Tomorrow's careers will demand <span className="text-red-500 font-black">NEW SKILLS.</span>
                    </motion.h2>

                    {/* Headline Group */}
                    <div className="w-full px-2 sm:px-0 flex flex-col items-center relative">
                        <h1 className="text-[40px] sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px] font-black leading-[0.88] w-full uppercase select-none relative z-10 text-[#0F172A] mb-2">
                            <div className="flex flex-wrap justify-center items-baseline gap-x-[0.2em] mb-4">
                                <span>MAKE</span>
                                <span>SURE</span>
                                <span className="inline-flex items-baseline whitespace-nowrap">
                                    <span className="text-black">Y</span>
                                    <span className="tracking-tighter">OUR</span>
                                </span>
                                <span>CHILD</span>
                            </div>
                            <div className="relative inline-block">
                                <div className="flex flex-wrap justify-center text-[#0F172A] tracking-tight whitespace-nowrap">
                                    IS&nbsp;&nbsp;READY
                                </div>
                                <RedSwoosh />
                            </div>
                        </h1>
                    </div>

                    
                    {/* Social Proof + CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6 flex flex-col items-center pt-4"
                    >
                        <ScrollingAvatars isMobile={false} />
                        
                        <motion.button
                            onClick={handleEnrollNow}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ scale: { duration: 0.2 } }}
                            className="px-14 py-4 bg-[#111111] text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3 min-w-[240px] hover:bg-[#222222] transition-colors duration-200"
                        >
                            Enroll now <span className="text-xl">→</span>
                        </motion.button>
                    </motion.div>
                </div>

                {/* Feature Bar */}
                <FeatureBar />
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
