import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { School, GraduationCap, Calendar, Cpu, Trophy, Globe, Video, MessageSquare, Rocket } from 'lucide-react';
import SectionHeader from './common/SectionHeader';
import journeyBg from '../assets/images/4.png';

// Unique organic blob shapes — 8-value border-radius gives each card a distinct random outline
const BLOB_SHAPES = [
    '62% 38% 46% 54% / 60% 44% 56% 40%',
    '38% 62% 57% 43% / 49% 61% 39% 51%',
    '55% 45% 38% 62% / 40% 59% 41% 60%',
    '45% 55% 63% 37% / 56% 38% 62% 44%',
];

const SCHOOL_STEPS = [
    {
        title: "Strategy Scan",
        icon: 'School',
        tagline: "Institutional Assessment",
        detail: "Our team conducts a deep diagnostic of your school's tech readiness, lab capacity, and student demographics.",
        bullets: ["Campus Lab Audit", "Student Segment Analysis", "Engagement Roadmap"]
    },
    {
        title: "Free Bootcamp",
        icon: 'Calendar',
        tagline: "7-Day Intensive Pilot",
        detail: "A zero-cost, high-energy pilot where senior engineers descend on your campus.",
        bullets: ["Zero Capital", "Live Deployment", "1:3 Mentor Ratio"]
    },
    {
        title: "Lab Integration",
        icon: 'Cpu',
        tagline: "Permanent Engineering Hub",
        detail: "We configure a dedicated thinkskool Engineering Hub inside your school.",
        bullets: ["Hardware Setup", "AI Workstation Fleet", "24/7 Monitoring"]
    },
    {
        title: "Certification",
        icon: 'Trophy',
        tagline: "Industry-Grade Credentials",
        detail: "Graduates receive globally recognized thinkskool certifications.",
        bullets: ["Blockchain Verified", "Fortune 500 Co-Sign", "Public Registry"]
    }
];

const STUDENT_STEPS = [
    {
        title: "Portal Access",
        icon: 'Globe',
        tagline: "thinkskool Pulse Platform",
        detail: "Instant access to the thinkskool Pulse — a premium engineering platform.",
        bullets: ["AI Diagnostics", "Progress Tracker", "Peer Leaderboard"]
    },
    {
        title: "Live Mentoring",
        icon: 'Video',
        tagline: "1:1 Expert Sessions",
        detail: "Each student gets a personal Technical Mentor for the full course duration.",
        bullets: ["Personal Mentor", "Code Review < 24h", "Architecture Feedback"]
    },
    {
        title: "Code Support",
        icon: 'MessageSquare',
        tagline: "Always-On Engineering Help",
        detail: "A dedicated support layer staffed 24/7 by senior engineers.",
        bullets: ["24/7 Support", "Screen-Share Debug", "AI Pair Programmer"]
    },
    {
        title: "Career Launch",
        icon: 'Rocket',
        tagline: "Industrial Career Ignition",
        detail: "Ship a portfolio-grade production app and join our Alumni Network.",
        bullets: ["Production App", "Mock Interview", "Alumni Network"]
    }
];

const IconMap = { School, GraduationCap, Calendar, Cpu, Trophy, Globe, Video, MessageSquare, Rocket };

const StepCard = ({ step, index, side, theme = 'blue' }) => {
    const Icon = IconMap[step.icon] || Globe;
    const blobShape = BLOB_SHAPES[index % BLOB_SHAPES.length];

    const isBlue = theme === 'blue';
    const accentColor = isBlue ? '#2563EB' : '#FF7A00';
    const accentText = isBlue ? 'text-blue-600' : 'text-[#FF7A00]';
    const accentBg = isBlue ? 'bg-blue-50' : 'bg-orange-50';
    const accentBorder = isBlue ? 'border-blue-100' : 'border-orange-100';
    const shadowHover = isBlue ? 'hover:shadow-[0_30px_70px_rgba(37,99,235,0.15)]' : 'hover:shadow-[0_30px_70px_rgba(255,122,0,0.15)]';

    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -40 : 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative mb-10 last:mb-0 w-full group cursor-pointer"
        >
            {/* Card shell — organic blob outline */}
            <div
                style={{
                    borderRadius: blobShape,
                    border: '1.5px solid rgba(0,0,0,0.05)',
                }}
                className={`flex flex-col gap-6 px-8 py-8 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-slate-100 ${shadowHover} transition-all duration-500 group-hover:border-${isBlue ? 'blue' : 'orange'}-200`}
            >
                {/* Top row: icon + title */}
                <div className={`flex items-start ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-5`}>
                    <motion.div
                        style={{ borderRadius: '52% 48% 61% 39% / 44% 57% 43% 56%' }}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`shrink-0 w-16 h-16 flex items-center justify-center border border-slate-100 bg-slate-50 transition-colors duration-500 group-hover:bg-white group-hover:scale-110 ${isBlue ? 'text-blue-600 group-hover:text-blue-500' : 'text-[#FF7A00] group-hover:text-orange-500'}`}
                    >
                        <Icon className="w-7 h-7" />
                    </motion.div>
                    <div className={`flex-1 min-w-0 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2 transition-colors group-hover:text-black">
                            {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.15em] leading-tight transition-colors group-hover:text-slate-700">
                            {step.tagline && step.tagline.includes('thinkskool') ? (
                                <>
                                    <span className="text-[#2563EB]">think</span><span className="text-[#FF7A00]">skool</span>
                                    {step.tagline.replace('thinkskool', '')}
                                </>
                            ) : step.tagline}
                        </p>
                    </div>
                </div>

                {/* Keywords/Bullets — Staggered Reveal */}
                <div className={`flex flex-wrap gap-2.5 relative z-10 ${side === 'left' ? 'justify-end' : 'justify-start'}`}>
                    {step.bullets.map((b, bi) => (
                        <motion.span
                            key={bi}
                            initial={{ opacity: 0.8, scale: 0.95 }}
                            whileHover={{ scale: 1.1, backgroundColor: accentColor, color: '#fff' }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className={`px-5 py-2 rounded-full ${accentBg} border ${accentBorder} text-[10px] font-black uppercase tracking-widest ${accentText} shadow-sm transition-colors duration-300`}
                        >
                            {b}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Ambient hover glow */}
            <div className={`absolute inset-0 -z-10 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full ${isBlue ? 'bg-blue-400' : 'bg-orange-400'}`} style={{ transform: 'scale(0.8)' }} />
        </motion.div>
    );
};

const HowItWorksSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end end"] });
    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <section id="how-it-works" ref={containerRef} className="relative bg-white py-24 overflow-hidden">
            {/* Header */}
            <div className="w-full px-6 xl:px-16 mb-16 relative z-10 text-center">
                <SectionHeader
                    subtitle={<span className="text-blue-600 font-bold tracking-[0.4em] uppercase">Operational Flow</span>}
                    title={<span className="text-slate-900">Dual Journey <span className="text-[#FF7A00]">Framework</span></span>}
                />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-6">
                    Professional Industrial Roadmap
                </p>
            </div>

            {/* Full-width content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full px-6 xl:px-16 relative z-10"
            >
                {/* SVG Snake Path */}
                <div className="absolute left-1/2 top-0 bottom-0 w-full -translate-x-1/2 hidden lg:block pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 1000 1200" fill="none">
                        <defs>
                            <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
                                <stop offset="20%" stopColor="#2563EB" />
                                <stop offset="50%" stopColor="#2563EB" />
                                <stop offset="60%" stopColor="#FF7A00" />
                                <stop offset="80%" stopColor="#FF7A00" />
                                <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="rgba(0,0,0,0.03)" strokeWidth="1.5" strokeLinecap="round" />
                        <motion.path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="url(#snakeGradient)" strokeWidth="6" strokeLinecap="round"
                            style={{ pathLength, opacity: 0.03 }} filter="blur(6px)" />
                        <motion.path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="url(#snakeGradient)" strokeWidth="3" strokeLinecap="round"
                            style={{ pathLength }} className="drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]" />
                        <motion.circle r="6" fill="#2563EB"
                            style={{
                                offsetPath: "path('M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250')",
                                offsetDistance: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                                filter: 'drop-shadow(0 0 12px rgba(37,99,235,0.4))'
                            }} />
                    </svg>
                </div>

                {/* Two-column layout */}
                <div className="flex flex-col lg:flex-row justify-between gap-20 relative max-w-[1600px] mx-auto">
                    {/* On Campus — Left */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-20 bg-slate-50 px-8 py-5 border border-slate-100 shadow-xl w-fit mx-auto lg:mx-0"
                            style={{ borderRadius: '48% 52% 40% 60% / 55% 45% 55% 45%' }}>
                            <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <School className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">On Campus</h3>
                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">In-School Bootcamps</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {SCHOOL_STEPS.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="left" theme="blue" />
                            ))}
                        </div>
                    </div>

                    {/* Online Course — Right */}
                    <div className="flex-1 lg:mt-32">
                        <div className="flex items-center gap-4 mb-20 bg-slate-50 px-8 py-5 border border-slate-100 shadow-xl w-fit mx-auto lg:mx-0 lg:ml-auto"
                            style={{ borderRadius: '40% 60% 55% 45% / 45% 55% 45% 55%' }}>
                            <div className="w-12 h-12 bg-[#FF7A00] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Online Course</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-[#FF7A00]">thinkskool Pulse</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            {STUDENT_STEPS.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="right" theme="orange" />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-orange-50/30 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default HowItWorksSection;
