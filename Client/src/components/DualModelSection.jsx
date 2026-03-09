import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

/* ─── Single feature row ──────────────────────────────────── */
const FeatureRow = ({ feature, accent, isLast, align = 'left' }) => {
    return (
        <div className="group cursor-default py-4 transition-all duration-500">
            <div className={`flex items-center gap-4 ${align === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                {/* Custom animated bullet */}
                <div
                    className={`w-2 h-2 rounded-full shrink-0 border border-white/10 transition-all duration-500 group-hover:scale-150 ${accent === 'blue' ? 'group-hover:bg-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'group-hover:bg-indigo-500 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]'} bg-white/10`}
                />

                <div className="flex-1">
                    {/* Main Category Name */}
                    <h4 className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-500 text-slate-100/40 group-hover:text-white drop-shadow-sm`}>
                        {feature.name}
                    </h4>
                </div>
            </div>
        </div>
    );
};


/* ─── Section ─────────────────────────────────────────────── */
const DualModelSection = () => {
    const navigate = useNavigate();

    const models = [
        {
            id: 'school',
            title: "On-Campus",
            subtitle: "Industrial Bootcamps",
            badge: "Offline",
            accent: "blue",
            features: [
                { name: "Expert Mentors On-Site", detail: "Senior engineers from Google, Microsoft & Amazon run real-time debugging sessions, guided code reviews, and architecture deep-dives." },
                { name: "Zero Setup Overhead", detail: "We arrive with a fully pre-configured lab stack. Students code from day one with zero time spent on tooling or environment setup." },
                { name: "Industrial Certification", detail: "Students receive a globally recognized thinkskool certification — blockchain-verified and resume-grade." },
                { name: "Collaborative Lab Sessions", detail: "Structured pair-programming and squad sprints mirror real engineering teams, improving communication and delivery." },
                { name: "Live Project Deployment", detail: "Every cohort ships a production-grade project — hosted, documented, and publicly accessible." }
            ],
            cta: "In-School Batch",
            path: '/school-partnerships'
        },
        {
            id: 'independent',
            title: "Online Live",
            subtitle: "Global Direct Access",
            badge: "Online",
            accent: "indigo",
            features: [
                { name: "Flexible Learning Schedule", detail: "All live sessions are recorded in 4K and available instantly. Learn at your own pace with zero compromise." },
                { name: "Global Community Access", detail: "Join 2,000+ active students from 18+ countries via weekly peer challenges and a private Discord hub." },
                { name: "Dedicated 1:1 Support", detail: "Every student gets a personal technical mentor. Book private sessions and get code reviews within 24 hours." },
                { name: "thinkskool Portal Access", detail: "Full platform access — AI diagnostics, project tracker, learning analytics, and mentor dashboard available 24/7." },
                { name: "Industry Simulations", detail: "Scenario-based sprints simulate real startup engineering. You'll write specs and present technical solutions." }
            ],
            cta: "Enroll Now",
            path: '/online-program'
        }
    ];

    const courses1 = "FULL STACK MERN • FRONTEND REACT • BACKEND NODEJS • DEVOPS CLOUD • SYSTEM DESIGN • ";
    const courses2 = "DATA SCIENCE • MACHINE LEARNING • AI & WEB3 • BLOCKCHAIN • PYTHON MASTERY • ";

    return (
        <section id="models" className="relative py-32 overflow-hidden bg-[#000000] selection:bg-blue-500/30">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                {/* Floating Course Names Marquee */}
                <div className="absolute inset-0 flex flex-col justify-around py-32 overflow-hidden pointer-events-none select-none opacity-[0.15] z-0">
                    <motion.div
                        initial={{ x: "0%" }}
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 360 }}
                        className="flex whitespace-nowrap w-max"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-widest text-white/5" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                            {courses1.repeat(20)}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ x: "-50%" }}
                        animate={{ x: "0%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 440 }}
                        className="flex whitespace-nowrap w-max"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-widest text-white/5" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                            {courses2.repeat(20)}
                        </h1>
                    </motion.div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-[#000000]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_60%)]" />
            </div>

            <div className="relative z-10 w-full px-6 xl:px-16 2xl:px-24 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
                    >
                        <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                            Industrial Training Models
                        </p>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none"
                    >
                        Two <span className="text-[#FF7A00]">Paths</span>
                    </motion.h2>
                </div>

                {/* Integrated Split-Panel Design */}
                <div className="relative">
                    {/* Central Glowing Spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent hidden lg:block">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
                        <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32 items-stretch">
                        {models.map((model, idx) => (
                            <motion.div
                                key={model.id}
                                initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className={`flex flex-col relative py-12 ${idx === 0 ? 'lg:text-right' : 'lg:text-left'}`}
                            >
                                {/* Platform Label */}
                                <div className={`flex items-center gap-4 mb-4 ${idx === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${model.accent === 'blue' ? 'bg-blue-600/20 text-blue-400' : 'bg-indigo-600/20 text-indigo-400'}`}>
                                        <Zap size={20} />
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-[0.3em] ${model.accent === 'blue' ? 'text-blue-500' : 'text-indigo-400'}`}>
                                        {model.badge} Platform
                                    </span>
                                </div>

                                <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                                    {model.title}
                                </h3>
                                <p className={`text-sm font-bold uppercase tracking-[0.4em] mb-12 ${model.accent === 'blue' ? 'text-blue-400/60' : 'text-indigo-400/60'}`}>
                                    {model.id === 'school' ? 'Industrial Bootcamps' : <><span>think</span><span className="text-[#FF7A00]">skool</span></>}
                                </p>

                                {/* Features Panel */}
                                <div className="space-y-2 mb-12">
                                    {model.features.map((f, fi) => (
                                        <FeatureRow
                                            key={fi}
                                            feature={f}
                                            accent={model.accent}
                                            isLast={fi === model.features.length - 1}
                                            align={idx === 0 ? 'right' : 'left'}
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(model.path)}
                                    className={`relative group px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-[0.3em] transition-all duration-300 overflow-hidden
                                        ${model.accent === 'blue'
                                            ? 'bg-blue-600 text-white shadow-[0_10px_40px_rgba(37,99,235,0.3)]'
                                            : 'bg-indigo-600 text-white shadow-[0_10px_40px_rgba(79,70,229,0.3)]'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {model.cta} <ArrowRight size={18} />
                                    </span>
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Industrial Convergence Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 pt-12 border-t border-white/[0.05] flex flex-col lg:flex-row items-center justify-between gap-12"
                >
                    <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Industrial Convergence</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Bridging Theory & Operations</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden sm:block" />
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="text-blue-500">142+</span> Production Nodes Active
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-[11px] font-black text-white uppercase tracking-[0.4em] hover:text-blue-500 transition-colors">
                            Technical Docs
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black text-white uppercase tracking-[0.4em] hover:bg-white/10 transition-all">
                            Join Network
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DualModelSection;
