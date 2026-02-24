import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { School, GraduationCap, Calendar, Cpu, Trophy, Globe, Video, MessageSquare, Rocket } from 'lucide-react';
import SectionHeader from './common/SectionHeader';
import { SchoolSteps, StudentSteps } from '../constants/siteData';

const StepCard = ({ step, index, side, renderIcon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`relative flex items-center ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-8 mb-24 last:mb-0 w-full lg:w-[45%]`}
        >
            <div className={`flex-1 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-base font-black text-slate-800 font-['Outfit'] uppercase tracking-tight">{step.title}</h3>
            </div>

            <div className={`relative flex-shrink-0 w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#2563EB] to-blue-400 p-[1px] shadow-md group hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                    {renderIcon(step.icon)}
                </div>
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
        <section id="how-it-works" ref={containerRef} className="relative bg-[#FCF8F8] py-16 overflow-hidden border-t border-[#FBEFEF]">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10 text-center">
                <SectionHeader
                    subtitle="Operational Flow"
                    title={<span>Dual Journey <span className="text-[#2563EB]">Framework</span></span>}
                    light={true}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative">
                {/* SVG Snake Path */}
                <div className="absolute left-1/2 top-0 bottom-0 w-full -translate-x-1/2 hidden lg:block pointer-events-none opacity-60">
                    <svg className="w-full h-full" viewBox="0 0 1000 1200" fill="none">
                        <motion.path
                            d="M 500 0 
                               C 500 100, 800 100, 800 250 
                               S 500 400, 500 500 
                               S 200 600, 200 750 
                               S 500 900, 500 1000 
                               S 800 1100, 800 1250"
                            stroke="url(#snakeGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            style={{ pathLength }}
                            className="drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                        />
                        <defs>
                            <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
                                <stop offset="15%" stopColor="#2563EB" />
                                <stop offset="50%" stopColor="#60A5FA" />
                                <stop offset="85%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 relative z-10">
                    {/* For Schools */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-10 bg-white border border-[#FBEFEF] p-4 rounded-2xl shadow-sm w-fit mx-auto lg:mx-0">
                            <div className="w-10 h-10 bg-[#2563EB]/10 rounded-xl flex items-center justify-center text-[#2563EB] border border-blue-100">
                                <School className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 font-['Outfit'] tracking-tight uppercase">Institutional Path</h3>
                                <p className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest mt-0.5">In-School Bootcamps</p>
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
                        <div className="flex items-center gap-3 mb-10 bg-[#2563EB] p-4 rounded-2xl shadow-md w-fit mx-auto lg:mx-0 lg:ml-auto">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-white font-['Outfit'] tracking-tight uppercase">Independent Path</h3>
                                <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest mt-0.5">ThinkSkool Pulse (Online)</p>
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
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-blue-50/80 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default HowItWorksSection;
