import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const OldWayInfographic = () => (
    <div className="relative w-64 h-64 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-700">
        <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Stacked Books */}
            <rect x="60" y="80" width="80" height="100" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="70" y="70" width="80" height="100" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="80" y="60" width="80" height="100" fill="white" stroke="#CBD5E1" strokeWidth="2" />
            {/* Static Lines */}
            <line x1="95" y1="85" x2="145" y2="85" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="95" y1="100" x2="145" y2="100" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="95" y1="115" x2="145" y2="115" stroke="#E2E8F0" strokeWidth="2" />
            {/* Dust particles */}
            {[...Array(5)].map((_, i) => (
                <circle key={i} cx={40 + i * 30} cy={160 - i * 20} r="2" fill="#CBD5E1" />
            ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-32">
            <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] font-['Outfit']">Shadow Theory</p>
        </div>
    </div>
);

const NewWayInfographic = () => (
    <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Orbital Rings */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-[#F5AFAF]/20 rounded-full"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-[#F5AFAF]/10 rounded-full"
        />

        <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Central Node */}
            <motion.circle
                cx="100" cy="100" r="25"
                fill="#F5AFAF"
                filter="url(#glow)"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Orbiting Nodes */}
            {[0, 120, 240].map((angle, i) => (
                <motion.g key={i}>
                    <motion.circle
                        cx={100 + 60 * Math.cos(angle * Math.PI / 180)}
                        cy={100 + 60 * Math.sin(angle * Math.PI / 180)}
                        r="8"
                        fill="white"
                        stroke="#F5AFAF"
                        strokeWidth="2"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 3, delay: i, repeat: Infinity }}
                    />
                    <line
                        x1="100" y1="100"
                        x2={100 + 60 * Math.cos(angle * Math.PI / 180)}
                        y2={100 + 60 * Math.sin(angle * Math.PI / 180)}
                        stroke="#F5AFAF" strokeWidth="1" strokeDasharray="4 2"
                    />
                </motion.g>
            ))}

            {/* Data particles */}
            {[...Array(8)].map((_, i) => (
                <motion.circle
                    key={i}
                    r="2"
                    fill="#F5AFAF"
                    animate={{
                        x: [Math.random() * 200, Math.random() * 200],
                        y: [Math.random() * 200, Math.random() * 200],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
                />
            ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-48">
            <p className="text-[#F5AFAF] text-sm font-black uppercase tracking-[0.3em] font-['Outfit']">Active Ecosystem</p>
        </div>
    </div>
);

const MetricBadge = ({ label, value, color, isNegative }) => (
    <div className={`px-4 py-3 rounded-2xl border ${isNegative ? 'bg-slate-50 border-slate-200' : 'bg-white border-[#F5AFAF]/20 shadow-sm'} flex flex-col items-center min-w-[100px]`}>
        <span className={`text-xl font-black font-['Outfit'] ${isNegative ? 'text-slate-400' : 'text-slate-900'}`}>{value}</span>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
);

const ValueTag = ({ text, color }) => (
    <div className={`px-3 py-1.5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-[9px] font-black text-slate-500 uppercase tracking-widest font-['Outfit'] shadow-sm flex items-center gap-2 group-hover:border-[#F5AFAF]/30 transition-colors`}>
        <div className={`w-1 h-1 rounded-full ${color}`} />
        {text}
    </div>
);

const TransformationFlow = ({ scrollYProgress }) => {
    const pathLength = useSpring(scrollYProgress, { stiffness: 30, damping: 20 });

    return (
        <div className="absolute inset-0 pointer-events-none z-20 hidden lg:block">
            <svg className="w-full h-full" viewBox="0 0 1000 680" fill="none">
                <motion.path
                    d="M 250 340 C 400 340, 450 380, 500 380 S 600 340, 750 340"
                    stroke="url(#flowGradient)"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    style={{ pathLength }}
                />
                <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#CBD5E1" />
                        <stop offset="50%" stopColor="#F5AFAF" />
                        <stop offset="100%" stopColor="#F5AFAF" />
                    </linearGradient>
                </defs>

                {/* Pulsing Particles */}
                {[0.2, 0.4, 0.6, 0.8].map((offset, i) => (
                    <motion.circle
                        key={i}
                        r="3"
                        fill="#F5AFAF"
                        filter="blur(1px)"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.7,
                            ease: "linear"
                        }}
                        style={{
                            offsetPath: "path('M 250 340 C 400 340, 450 380, 500 380 S 600 340, 750 340')",
                            opacity: pathLength
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

const STEMFutureSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"]
    });

    return (
        <section className="relative min-h-[140vh] bg-[#FCF8F8] py-32 overflow-hidden" id="stem-future">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#FBEFEF] shadow-sm mb-6"
                    >
                        <span className="text-[10px] font-black text-[#F5AFAF] uppercase tracking-[0.3em] font-['Outfit']">Evolution of Learning</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter font-['Outfit']"
                    >
                        Future of <span className="text-[#F5AFAF]">STEM</span>
                    </motion.h2>
                </div>

                {/* Unified Transformation Card */}
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-white rounded-[4rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row min-h-[650px] group/container"
                >
                    <TransformationFlow scrollYProgress={scrollYProgress} />

                    {/* Left Side: OLD WAY */}
                    <div className="flex-1 relative p-10 lg:p-16 flex flex-col z-10">
                        {/* Integrated 3D Icon Background */}
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none translate-x-12 scale-75 lg:scale-100">
                            <OldWayInfographic />
                        </div>

                        <div className="space-y-8 relative z-20">
                            <div className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 w-fit">
                                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest font-['Outfit']">Traditional Model</span>
                            </div>

                            <div>
                                <h3 className="text-4xl lg:text-5xl font-black text-slate-800 font-['Outfit'] mb-6 tracking-tight">Passive <span className="text-slate-200">Learning</span></h3>

                                <div className="flex gap-3 mb-8">
                                    <MetricBadge label="Engagement" value="12%" isNegative />
                                    <MetricBadge label="Ready" value="00%" isNegative />
                                </div>

                                <ul className="space-y-6">
                                    {[
                                        "Theoretical Silos",
                                        "Fragmented Loops",
                                        "No Industrial Ops"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit']">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-2 mt-10 opacity-40">
                                    {["Memory", "Static"].map((tag, i) => (
                                        <ValueTag key={i} text={tag} color="bg-slate-400" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Backdrop Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50 -z-10" />
                    </div>

                    {/* Central VS Divider */}
                    <div className="relative w-full lg:w-px flex lg:flex-col items-center justify-center -my-px z-30 pointer-events-none">
                        <div className="hidden lg:block w-px h-full bg-slate-200" />

                        <div className="absolute w-24 h-24 rounded-full bg-white border border-slate-100 shadow-2xl flex items-center justify-center z-40 bg-white/90 backdrop-blur-md">
                            <div className="absolute inset-2 rounded-full border border-dashed border-[#F5AFAF]/30 animate-[spin_15s_linear_infinite]" />
                            <span className="text-2xl font-black font-['Outfit'] text-slate-900 italic tracking-tighter">VS</span>
                        </div>

                        {/* Glow Beam */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-[#F5AFAF]/30 to-transparent" />
                        </div>
                    </div>

                    {/* Right Side: NEW WAY */}
                    <div className="flex-1 relative p-10 lg:p-16 flex flex-col bg-white z-10 overflow-hidden shadow-[inset_60px_0_150px_rgba(245,175,175,0.02)]">
                        {/* Integrated 3D Icon Background */}
                        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 opacity-30 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none group-hover:scale-110 transition-transform">
                            <NewWayInfographic />
                        </div>

                        <div className="space-y-8 relative z-20">
                            <div className="px-5 py-2 rounded-full bg-[#F5AFAF]/10 border border-[#F5AFAF]/20 w-fit">
                                <span className="font-black text-[10px] uppercase tracking-widest font-['Outfit']">
                                    <span className="text-slate-900">Think</span>
                                    <span className="text-[#F5AFAF]">Skool</span>
                                    <span className="text-slate-400"> Ecosystem</span>
                                </span>
                            </div>

                            <div>
                                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 font-['Outfit'] mb-6 tracking-tight">Active <span className="text-[#F5AFAF]">Mastery</span></h3>

                                <div className="flex gap-3 mb-8">
                                    <MetricBadge label="Active Retention" value="95%" />
                                    <MetricBadge label="Velocity" value="12X" />
                                </div>

                                <ul className="space-y-6">
                                    {[
                                        "Simulation Engines",
                                        "Global Industrial Network",
                                        "AI Progress Sync"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-4 text-slate-800 font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit'] group-hover/container:translate-x-3 transition-transform duration-500">
                                            <div className="w-2 h-2 rounded-full bg-[#F5AFAF] shadow-lg shadow-[#F5AFAF]/40" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-2 mt-10">
                                    {["Cloud First", "AI Built", "Support"].map((tag, i) => (
                                        <ValueTag key={i} text={tag} color="bg-[#F5AFAF]" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side Backdrop Effects */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#F5AFAF]/5 to-blue-500/5 rounded-full blur-[120px] -z-10" />
                    </div>
                </motion.div>

                {/* Footer Insight */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-16 text-center"
                >
                    <p className="text-slate-400 font-['Outfit'] text-[10px] font-black uppercase tracking-[0.5em]">
                        Engineering the <span className="text-[#F5AFAF]">STEM Leaders</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default STEMFutureSection;
