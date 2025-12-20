import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { School, GraduationCap, Coffee, Target, Trophy, Rocket, Cpu, Globe, Video, MessageSquare, Calendar } from 'lucide-react';

const SchoolSteps = [
    {
        title: "Strategic Consultation",
        icon: <School className="w-6 h-6" />,
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "7-Day Free Bootcamp",
        icon: <Calendar className="w-6 h-6" />,
        color: "from-indigo-500 to-purple-600"
    },
    {
        title: "Advanced Lab setup",
        icon: <Cpu className="w-6 h-6" />,
        color: "from-purple-500 to-pink-600"
    },
    {
        title: "Elite Certification",
        icon: <Trophy className="w-6 h-6" />,
        color: "from-pink-500 to-[#F5AFAF]"
    }
];

const StudentSteps = [
    {
        title: "Portal & Path Setup",
        icon: <Globe className="w-6 h-6" />,
        color: "from-cyan-500 to-blue-600"
    },
    {
        title: "Premium Live Classes",
        icon: <Video className="w-6 h-6" />,
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "Support Ops & Assignments",
        icon: <MessageSquare className="w-6 h-6" />,
        color: "from-indigo-500 to-purple-600"
    },
    {
        title: "Impact & Career Launch",
        icon: <Rocket className="w-6 h-6" />,
        color: "from-purple-500 to-[#F5AFAF]"
    }
];

const StepCard = ({ step, index, side }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`relative flex items-center ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-8 mb-24 last:mb-0 w-full lg:w-[45%]`}
        >
            <div className={`flex-1 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">{step.title}</h3>
            </div>

            <div className={`relative flex-shrink-0 w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${step.color} p-[2px] shadow-lg group hover:scale-110 transition-transform duration-500`}>
                <div className="w-full h-full bg-white rounded-[1.15rem] flex items-center justify-center text-slate-900 group-hover:bg-transparent group-hover:text-white transition-colors duration-500">
                    {step.icon}
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

    return (
        <section id="how-it-works" ref={containerRef} className="relative bg-[#FCF8F8] py-32 overflow-hidden border-t border-[#FBEFEF]">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 mb-24 relative z-10 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[#F5AFAF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']"
                >
                    Operational Flow
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black text-slate-900 mb-8 tracking-tight font-['Outfit']"
                >
                    Dual Journey <span className="text-[#F5AFAF]">Framework</span>
                </motion.h2>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative">
                {/* SVG Snake Path */}
                <div className="absolute left-1/2 top-0 bottom-0 w-full -translate-x-1/2 hidden lg:block pointer-events-none opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 1000 1200" fill="none">
                        <motion.path
                            d="M 500 0 
                               C 500 100, 800 100, 800 250 
                               S 500 400, 500 500 
                               S 200 600, 200 750 
                               S 500 900, 500 1000 
                               S 800 1100, 800 1250"
                            stroke="url(#snakeGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{ pathLength }}
                            className="drop-shadow-[0_0_15px_rgba(245,175,175,0.5)]"
                        />
                        <defs>
                            <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#F5AFAF" />
                                <stop offset="50%" stopColor="#2D2D2D" />
                                <stop offset="100%" stopColor="#F5AFAF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 relative z-10">
                    {/* For Schools */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-16 bg-white p-6 rounded-[2.5rem] border border-[#FBEFEF] shadow-sm w-fit mx-auto lg:mx-0">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                <School className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 font-['Outfit'] tracking-tight">For Schools</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Integration</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {SchoolSteps.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="left" />
                            ))}
                        </div>
                    </div>

                    {/* For Students */}
                    <div className="flex-1 lg:mt-32">
                        <div className="flex items-center gap-4 mb-16 bg-white p-6 rounded-[2.5rem] border border-[#FBEFEF] shadow-sm w-fit mx-auto lg:mx-0 lg:ml-auto">
                            <div className="w-12 h-12 bg-[#F5AFAF] rounded-2xl flex items-center justify-center text-white">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 font-['Outfit'] tracking-tight">For Students</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Expedition</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            {StudentSteps.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="right" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#F5AFAF]/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default HowItWorksSection;
