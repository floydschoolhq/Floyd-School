import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import dualModelBg from '../assets/images/dual-model-bg.png';

/* ─── Typewriter hook ─────────────────────────────────────── */
const useTypewriter = (text, active, speed = 18) => {
    const [out, setOut] = useState('');
    const ref = useRef(null);
    useEffect(() => {
        if (active) {
            setOut('');
            let i = 0;
            ref.current = setInterval(() => {
                setOut(text.slice(0, ++i));
                if (i >= text.length) clearInterval(ref.current);
            }, speed);
        } else {
            clearInterval(ref.current);
            setOut('');
        }
        return () => clearInterval(ref.current);
    }, [active, text]);
    return out;
};

/* ─── Single feature row ──────────────────────────────────── */
const FeatureRow = ({ feature, accent, isLast }) => {
    const [hovered, setHovered] = useState(false);
    const typed = useTypewriter(feature.detail, hovered);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`group cursor-default py-5 ${!isLast ? 'border-b border-white/[0.06]' : ''} transition-all duration-200`}
        >
            {/* Collapsed row */}
            <div className="flex items-center gap-4">
                <motion.div
                    animate={{ scale: hovered ? 1.4 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent === 'blue' ? 'bg-blue-500' : 'bg-indigo-400'}`}
                />
                <span className={`flex-1 text-base font-bold tracking-wide transition-colors duration-200 ${hovered ? (accent === 'blue' ? 'text-blue-300' : 'text-indigo-300') : 'text-slate-100'}`}>
                    {feature.name}
                </span>
                <motion.span
                    animate={{ opacity: hovered ? 0 : 0.3, x: hovered ? 4 : 0 }}
                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-500"
                >
                    hover
                </motion.span>
            </div>

            {/* Typewriter expansion */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pl-5"
                    >
                        <p className={`pt-2.5 text-sm leading-relaxed font-normal ${accent === 'blue' ? 'text-slate-400' : 'text-slate-400'}`}>
                            {typed}
                            <span className="inline-block w-px h-3.5 bg-slate-500 ml-0.5 animate-pulse align-middle" />
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Full model card ─────────────────────────────────────── */
const ModelCard = ({ model, idx, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative flex flex-col rounded-3xl overflow-hidden border border-white/[0.07] bg-[#070e1f]/80 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
    >
        {/* Gradient top edge accent */}
        <div className={`h-px w-full ${model.accent === 'blue' ? 'bg-gradient-to-r from-transparent via-blue-500/70 to-transparent' : 'bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent'}`} />

        {/* Ambient glow */}
        <div className={`absolute -top-40 ${model.accent === 'blue' ? '-left-40' : '-right-40'} w-80 h-80 ${model.accent === 'blue' ? 'bg-blue-700/10' : 'bg-indigo-700/10'} rounded-full blur-[100px] pointer-events-none`} />

        <div className="flex flex-col flex-1 p-8 lg:p-10 gap-8 relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${model.accent === 'blue' ? 'text-blue-400' : 'text-indigo-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${model.accent === 'blue' ? 'bg-blue-500' : 'bg-indigo-400'}`} />
                        {model.badge}
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-none mb-1">
                        {model.title}
                    </h3>
                    <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${model.accent === 'blue' ? 'text-blue-500/80' : 'text-indigo-400/80'}`}>
                        {model.subtitle}
                    </p>
                </div>
            </div>

            {/* Feature list — no boxes, clean dividers */}
            <div className="flex flex-col">
                {model.features.map((f, fi) => (
                    <FeatureRow
                        key={fi}
                        feature={f}
                        accent={model.accent}
                        isLast={fi === model.features.length - 1}
                    />
                ))}
            </div>

            {/* CTA */}
            <button
                onClick={onClick}
                className={`mt-auto w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 border
                    ${model.accent === 'blue'
                        ? 'border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                        : 'border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                    } group/btn overflow-hidden relative`}
            >
                <span className="relative z-10">{model.cta}</span>
                <ArrowRight size={16} className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
        </div>
    </motion.div>
);

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
                { name: "Expert Mentors On-Site", detail: "Senior engineers from Google, Microsoft & Amazon run real-time debugging sessions, guided code reviews, and architecture deep-dives — all inside your school." },
                { name: "Zero Setup Overhead", detail: "We arrive with a fully pre-configured lab stack. Students code from day one with zero time spent on tooling or environment setup." },
                { name: "Industrial Certification", detail: "Students receive a globally recognized ThinkSkool certification co-signed by industry partners — blockchain-verified and resume-grade from graduation day." },
                { name: "Collaborative Lab Sessions", detail: "Structured pair-programming and squad sprints mirror real engineering teams, improving communication and delivery under project pressure." },
                { name: "Live Project Deployment", detail: "Every cohort ships a production-grade project — hosted, documented, and publicly accessible. A real portfolio asset built under mentor supervision." }
            ],
            cta: "In-School Batch",
        },
        {
            id: 'independent',
            title: "Online Live",
            subtitle: "Global Direct Access",
            badge: "Online",
            accent: "indigo",
            features: [
                { name: "Flexible Learning Schedule", detail: "All live sessions are recorded in 4K and available instantly. Learn at 9 PM after school or 7 AM before — zero compromise on quality or pace." },
                { name: "Global Community Access", detail: "Join 2,000+ active students from 18+ countries via weekly peer challenges, global hackathons, and a private Discord engineering hub." },
                { name: "Dedicated 1:1 Support", detail: "Every student gets a personal technical mentor for the full course. Book private sessions, ask async questions, and get code reviews within 24 hours." },
                { name: "ThinkSkool Portal Access", detail: "Full platform access — AI diagnostics, project tracker, learning analytics, peer leaderboard, and mentor dashboard — available 24/7." },
                { name: "Industry Simulations", detail: "Scenario-based sprints simulate real startup engineering. You'll write specs, tackle backlogs, and present technical solutions to virtual stakeholders." }
            ],
            cta: "Enroll Now",
        }
    ];

    return (
        <section id="models" className="relative py-20 overflow-hidden bg-[#020617]">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src={dualModelBg} alt="" className="w-full h-full object-cover opacity-40 grayscale contrast-125" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/30 to-[#020617]" />
            </div>

            <div className="relative z-10 w-full px-6 xl:px-16 2xl:px-24">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-400 font-semibold uppercase tracking-[0.4em] text-xs mb-3"
                    >
                        Two Paths. One Destination.
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-white uppercase tracking-tight"
                    >
                        Delivery <span className="text-blue-500">Models</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 }}
                        className="text-slate-500 text-xs font-medium mt-4 uppercase tracking-[0.2em]"
                    >
                        Hover any feature to read the full detail
                    </motion.p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1500px] mx-auto">
                    {models.map((model, idx) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            idx={idx}
                            onClick={() => idx === 0 ? navigate('/school-partnerships') : navigate('/online-program')}
                        />
                    ))}
                </div>

                {/* Bottom callout */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 max-w-[1500px] mx-auto rounded-3xl border border-white/[0.07] bg-[#070e1f]/60 backdrop-blur-xl px-10 py-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
                >
                    <div className="h-px absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-700/10 rounded-full blur-[80px]" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] shrink-0">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">Industrial Convergence</h4>
                            <p className="text-sm text-slate-400 font-normal">Bridging academic theory with global industrial operations</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 relative z-10 flex-wrap justify-center">
                        <button className="px-8 py-3.5 rounded-xl bg-white text-slate-950 text-sm font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300">
                            Join Network
                        </button>
                        <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">142 active nodes</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DualModelSection;
