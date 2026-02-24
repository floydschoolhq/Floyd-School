import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { School, GraduationCap, Calendar, Cpu, Trophy, Globe, Video, MessageSquare, Rocket } from 'lucide-react';
import SectionHeader from './common/SectionHeader';
import { SchoolSteps, StudentSteps } from '../constants/siteData';
import journeyBg from '../assets/images/4.png';

const StepCard = ({ step, index, side, renderIcon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -40 : 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className={`relative flex items-center ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-6 mb-12 last:mb-0 w-full group perspective-[1000px]`}
        >
            {/* Step Container - The "Small Separate Container" */}
            <motion.div
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(37, 99, 235, 0.4)' }}
                className={`flex-1 p-6 rounded-[2rem] bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 ${side === 'left' ? 'text-right' : 'text-left'}`}
            >
                <h3 className="text-base font-black text-white uppercase tracking-tight leading-none mb-2 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Phase {index + 1}</span>
            </motion.div>

            {/* Icon Sphere */}
            <div className={`relative flex-shrink-0 w-16 h-16 rounded-[1.5rem] bg-blue-600/10 backdrop-blur-md shadow-2xl flex items-center justify-center p-0.5 border border-white/10 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500`}>
                <div className="w-full h-full bg-slate-900 rounded-[1.3rem] flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    {renderIcon(step.icon)}
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>
        </motion.div>
    );
};

const HowItWorksSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"]
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const IconMap = {
        School, GraduationCap, Calendar, Cpu, Trophy, Globe, Video, MessageSquare, Rocket
    };

    const renderIcon = (iconName) => {
        const IconComponent = IconMap[iconName] || Globe;
        return <IconComponent className="w-6 h-6" />;
    };

    return (
        <section id="how-it-works" ref={containerRef} className="relative bg-[#020617] py-24 overflow-hidden">
            {/* Background Image - Balanced Visibility */}
            <div className="absolute inset-0 z-0 opacity-25">
                <img
                    src={journeyBg}
                    alt="Dual Journey Background"
                    className="w-full h-full object-cover contrast-[1.2] blur-[2px]"
                    style={{ imageRendering: 'auto' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-[#020617]" />
            </div>

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 mb-20 relative z-10 text-center">
                <SectionHeader
                    subtitle={<span className="text-blue-400 font-bold tracking-[0.4em]">Operational Flow</span>}
                    title={<span className="text-white drop-shadow-2xl">Dual Journey <span className="text-blue-500">Framework</span></span>}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* SVG Snake Path - The "Center of Attraction" */}
                <div className="absolute left-1/2 top-0 bottom-0 w-full -translate-x-1/2 hidden lg:block pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 1000 1200" fill="none">
                        <defs>
                            <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
                                <stop offset="20%" stopColor="#60A5FA" />
                                <stop offset="50%" stopColor="#3B82F6" />
                                <stop offset="80%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Background Path (Static Guide) */}
                        <path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="rgba(37,99,235,0.05)"
                            strokeWidth="1"
                            strokeLinecap="round"
                        />

                        {/* Glow Layer 1 (Wide Soft Glow) */}
                        <motion.path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="#2563EB"
                            strokeWidth="6"
                            strokeLinecap="round"
                            style={{ pathLength, opacity: 0.1 }}
                            filter="blur(10px)"
                        />

                        {/* Glow Layer 2 (Neon Core) */}
                        <motion.path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="url(#snakeGradient)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            style={{ pathLength }}
                            className="drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                        />

                        {/* The Light Particle (Scroll Tracker) */}
                        <motion.circle
                            r="6"
                            fill="#60A5FA"
                            style={{
                                offsetPath: "path('M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250')",
                                offsetDistance: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                                filter: 'drop-shadow(0 0 15px #60A5FA)'
                            }}
                        />
                    </svg>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 relative">
                    {/* For Schools */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-14 bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/5 w-fit mx-auto lg:mx-0">
                            <div className="w-12 h-12 bg-[#2563EB] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <School className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">On Campus</h3>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">In-School Bootcamps</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {SchoolSteps.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="left" renderIcon={renderIcon} />
                            ))}
                        </div>
                    </div>

                    {/* For Students */}
                    <div className="flex-1 lg:mt-32">
                        <div className="flex items-center gap-4 mb-14 bg-slate-900/60 p-5 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-blue-500/10 w-fit mx-auto lg:mx-0 lg:ml-auto">
                            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">Online Course</h3>
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">ThinkSkool Pulse</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            {StudentSteps.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="right" renderIcon={renderIcon} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default HowItWorksSection;

