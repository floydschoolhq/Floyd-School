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
        phase: "Phase 01",
        tagline: "Institutional Assessment",
        detail: "Our team conducts a deep diagnostic of your school's tech readiness, lab capacity, and student demographics — mapping a fully custom engagement plan that fits your academic calendar with zero disruption.",
        bullets: ["Campus Lab Audit", "Student Segment Analysis", "Engagement Roadmap Delivery"]
    },
    {
        title: "Free Bootcamp",
        icon: 'Calendar',
        phase: "Phase 02",
        tagline: "7-Day Intensive Pilot",
        detail: "A zero-cost, high-energy pilot where senior engineers descend on your campus. Students build, deploy and demo real projects — schools witness measurable engagement uplift from day one.",
        bullets: ["Zero Capital Required", "Live Project Deployment", "Mentor-to-Student 1:3 Ratio"]
    },
    {
        title: "Lab Integration",
        icon: 'Cpu',
        phase: "Phase 03",
        tagline: "Permanent Engineering Hub",
        detail: "We configure a dedicated ThinkSkool Engineering Hub inside your school — full hardware stack, project servers, and AI workstations all managed by us, permanently available to students.",
        bullets: ["Dedicated Hardware Setup", "AI Workstation Fleet", "24/7 Remote Monitoring"]
    },
    {
        title: "Certification",
        icon: 'Trophy',
        phase: "Phase 04",
        tagline: "Industry-Grade Credentials",
        detail: "Graduates receive globally recognized ThinkSkool certifications co-signed by Fortune 500 industry partners — blockchain-verified, publicly queryable, and resume-grade from day one.",
        bullets: ["Blockchain Verification", "Fortune 500 Co-Sign", "Public Certificate Registry"]
    }
];

const STUDENT_STEPS = [
    {
        title: "Portal Access",
        icon: 'Globe',
        phase: "Phase 01",
        tagline: "ThinkSkool Pulse Platform",
        detail: "Instant access to the ThinkSkool Pulse — a premium engineering platform with AI-powered diagnostics, real-time progress tracking, peer leaderboard, and a curated resource vault for self-directed mastery.",
        bullets: ["AI Learning Diagnostics", "Real-Time Progress Tracker", "Global Peer Leaderboard"]
    },
    {
        title: "Live Mentoring",
        icon: 'Video',
        phase: "Phase 02",
        tagline: "1:1 Expert Sessions",
        detail: "Each student gets a personal Technical Mentor for the full course duration. Book live sessions, get async code reviews in under 24 hours, and receive architecture feedback from engineers who've shipped at scale.",
        bullets: ["Personal Mentor Assigned", "Code Review < 24hrs", "Architecture Feedback Loops"]
    },
    {
        title: "Code Support",
        icon: 'MessageSquare',
        phase: "Phase 03",
        tagline: "Always-On Engineering Help",
        detail: "A dedicated support layer staffed 24/7 by senior engineers. Debug in real time via screen-share, tag your mentor in threads, or use the AI pair-programmer to unblock yourself instantly at any hour.",
        bullets: ["24/7 Engineer Support", "Screen-Share Debugging", "AI Pair Programmer"]
    },
    {
        title: "Career Launch",
        icon: 'Rocket',
        phase: "Phase 04",
        tagline: "Industrial Career Ignition",
        detail: "Ship a portfolio-grade production app, receive a verified certificate, complete a mock interview loop with real engineers, and join our Alumni Network of 2,000+ active global engineers.",
        bullets: ["Production App Shipped", "Mock Interview Circuit", "Alumni Network Access"]
    }
];

const IconMap = { School, GraduationCap, Calendar, Cpu, Trophy, Globe, Video, MessageSquare, Rocket };

const StepCard = ({ step, index, side }) => {
    const Icon = IconMap[step.icon] || Globe;
    const blobShape = BLOB_SHAPES[index % BLOB_SHAPES.length];

    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{ duration: 0.55, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative mb-6 last:mb-0 w-full"
        >
            {/* Card shell — organic blob outline, always fully visible */}
            <div
                style={{
                    borderRadius: blobShape,
                    border: '1.5px solid rgba(255,255,255,0.08)',
                }}
                className={`flex flex-col gap-5 px-7 py-6 backdrop-blur-2xl bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.25)]`}
            >
                {/* Top row: icon + title */}
                <div className={`flex items-center ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-4`}>
                    <div
                        style={{ borderRadius: '52% 48% 61% 39% / 44% 57% 43% 56%' }}
                        className="shrink-0 w-14 h-14 flex items-center justify-center border border-white/10 bg-slate-900 text-slate-400"
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex-1 min-w-0 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-semibold text-blue-400 uppercase tracking-[0.25em] mb-0.5">
                            {step.phase}
                        </p>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-1">
                            {step.title}
                        </h3>
                        <p className="text-sm text-slate-400 font-semibold">
                            {step.tagline}
                        </p>
                    </div>
                </div>

                {/* Detail — always visible */}
                <div
                    style={{ borderRadius: '8% 92% 12% 88% / 88% 8% 92% 12%' }}
                    className="px-5 py-4 bg-slate-900/70 border border-blue-500/15 relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-600/15 rounded-full blur-[50px] pointer-events-none" />
                    <p className={`text-base text-slate-300 leading-relaxed font-normal mb-3 relative z-10 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                        {step.detail}
                    </p>
                    <div className={`flex flex-wrap gap-2 relative z-10 ${side === 'left' ? 'justify-end' : 'justify-start'}`}>
                        {step.bullets.map((b, bi) => (
                            <span
                                key={bi}
                                className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-semibold text-blue-400"
                            >
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const HowItWorksSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end end"] });
    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <section id="how-it-works" ref={containerRef} className="relative bg-[#020617] py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-25">
                <img src={journeyBg} alt="Dual Journey Background" className="w-full h-full object-cover contrast-[1.2] blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-[#020617]" />
            </div>

            {/* Header */}
            <div className="w-full px-6 xl:px-16 mb-16 relative z-10 text-center">
                <SectionHeader
                    subtitle={<span className="text-blue-400 font-bold tracking-[0.4em]">Operational Flow</span>}
                    title={<span className="text-white drop-shadow-2xl">Dual Journey <span className="text-blue-500">Framework</span></span>}
                />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-4">
                    Hover any step to reveal its full operational detail
                </p>
            </div>

            {/* Full-width content */}
            <div className="w-full px-6 xl:px-16 relative z-10">
                {/* SVG Snake Path */}
                <div className="absolute left-1/2 top-0 bottom-0 w-full -translate-x-1/2 hidden lg:block pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 1000 1200" fill="none">
                        <defs>
                            <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
                                <stop offset="20%" stopColor="#60A5FA" />
                                <stop offset="80%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="rgba(37,99,235,0.05)" strokeWidth="1" strokeLinecap="round" />
                        <motion.path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="#2563EB" strokeWidth="8" strokeLinecap="round"
                            style={{ pathLength, opacity: 0.1 }} filter="blur(10px)" />
                        <motion.path
                            d="M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250"
                            stroke="url(#snakeGradient)" strokeWidth="3.5" strokeLinecap="round"
                            style={{ pathLength }} className="drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                        <motion.circle r="7" fill="#60A5FA"
                            style={{
                                offsetPath: "path('M 500 0 C 500 100, 800 100, 800 250 S 500 400, 500 500 S 200 600, 200 750 S 500 900, 500 1000 S 800 1100, 800 1250')",
                                offsetDistance: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                                filter: 'drop-shadow(0 0 16px #60A5FA)'
                            }} />
                    </svg>
                </div>

                {/* Two-column layout */}
                <div className="flex flex-col lg:flex-row justify-between gap-20 relative max-w-[1600px] mx-auto">
                    {/* On Campus — Left */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-12 bg-white/5 backdrop-blur-xl px-6 py-4 border border-white/10 shadow-2xl w-fit mx-auto lg:mx-0"
                            style={{ borderRadius: '48% 52% 40% 60% / 55% 45% 55% 45%' }}>
                            <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <School className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">On Campus</h3>
                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">In-School Bootcamps</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {SCHOOL_STEPS.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="left" />
                            ))}
                        </div>
                    </div>

                    {/* Online Course — Right */}
                    <div className="flex-1 lg:mt-32">
                        <div className="flex items-center gap-4 mb-12 bg-slate-900/60 px-6 py-4 border border-white/5 shadow-2xl w-fit mx-auto lg:mx-0 lg:ml-auto"
                            style={{ borderRadius: '40% 60% 55% 45% / 45% 55% 45% 55%' }}>
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">Online Course</h3>
                                <p className="text-xs font-black text-blue-300 uppercase tracking-widest">ThinkSkool Pulse</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            {STUDENT_STEPS.map((step, idx) => (
                                <StepCard key={idx} step={step} index={idx} side="right" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default HowItWorksSection;
