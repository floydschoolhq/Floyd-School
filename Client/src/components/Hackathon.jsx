import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
    BrainCircuit,
    Timer,
    Rocket,
    Users2,
    ArrowUpRight,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const STATS = [
    { value: 48, suffix: 'H', label: 'Non-stop build time' },
    { value: 6, suffix: '+', label: 'Members per team' },
    { value: 100, suffix: '%', label: 'Real industry problems' },
];

const FEATURES = [
    {
        icon: BrainCircuit,
        title: 'Real-World Problems',
        desc: 'Problem statements are sourced directly from industry partners — not textbook exercises.',
        accent: 'from-blue-50 to-slate-50',
        iconColor: 'text-blue-600',
    },
    {
        icon: Users2,
        title: 'Cross-Batch Teams',
        desc: 'Team up with learners from different cohorts, just like a real engineering organisation.',
        accent: 'from-violet-50 to-slate-50',
        iconColor: 'text-violet-500',
    },
    {
        icon: Timer,
        title: '48-Hour Sprint',
        desc: 'Scope, design, build, and deploy your solution within a strict 48-hour window.',
        accent: 'from-amber-50 to-slate-50',
        iconColor: 'text-amber-500',
    },
    {
        icon: Rocket,
        title: 'Ship to Production',
        desc: 'Your finished project goes live — portfolio-ready and independently verifiable.',
        accent: 'from-emerald-50 to-slate-50',
        iconColor: 'text-emerald-500',
    },
];

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
function Counter({ to, suffix }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = Math.ceil(to / 40);
        const timer = setInterval(() => {
            start += step;
            if (start >= to) { setVal(to); clearInterval(timer); }
            else setVal(start);
        }, 28);
        return () => clearInterval(timer);
    }, [inView, to]);

    return (
        <span ref={ref} className="tabular-nums">
            {val}{suffix}
        </span>
    );
}

/* ─────────────────────────────────────────────────────────
   CORNER BORDERS
───────────────────────────────────────────────────────── */
function CornerBorders({ size = 14, thickness = 1.5, color = 'rgba(15,23,42,0.18)' }) {
    const style = (top, right, bottom, left) => ({
        position: 'absolute',
        width: size,
        height: size,
        top: top !== undefined ? top : undefined,
        right: right !== undefined ? right : undefined,
        bottom: bottom !== undefined ? bottom : undefined,
        left: left !== undefined ? left : undefined,
        borderTop: (top !== undefined) ? `${thickness}px solid ${color}` : undefined,
        borderBottom: (bottom !== undefined) ? `${thickness}px solid ${color}` : undefined,
        borderLeft: (left !== undefined) ? `${thickness}px solid ${color}` : undefined,
        borderRight: (right !== undefined) ? `${thickness}px solid ${color}` : undefined,
        pointerEvents: 'none',
        zIndex: 20,
    });
    return (
        <>
            {/* Top-left */}
            <span style={{ ...style(8, undefined, undefined, 8), borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, borderBottom: undefined, borderRight: undefined }} />
            {/* Top-right */}
            <span style={{ ...style(8, 8, undefined, undefined), borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, borderBottom: undefined, borderLeft: undefined }} />
            {/* Bottom-left */}
            <span style={{ ...style(undefined, undefined, 8, 8), borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, borderTop: undefined, borderRight: undefined }} />
            {/* Bottom-right */}
            <span style={{ ...style(undefined, 8, 8, undefined), borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, borderTop: undefined, borderLeft: undefined }} />
        </>
    );
}

export default function Hackathon() {
    return (
        <section id="hackathon" className="relative bg-white pt-20 pb-16 overflow-hidden">

            {/* Subtle background grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            <div className="relative max-w-6xl mx-auto px-6 lg:px-12">

                {/* ══ HEADER ════════════════════════════════════════════ */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <ScrollDarkenHeading>Hackathon</ScrollDarkenHeading>


                </div>

                {/* ══ STATS ROW ═════════════════════════════════════════ */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-3xl overflow-hidden mb-14 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center justify-center py-8 px-4 bg-white hover:bg-slate-50/60 transition-colors group"
                        >
                            <p className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-1.5 group-hover:text-blue-600 transition-colors duration-300">
                                <Counter to={s.value} suffix={s.suffix} />
                            </p>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ══ MAIN GRID ═════════════════════════════════════════ */}
                <div className="grid lg:grid-cols-5 gap-6 items-stretch mb-8">

                    {/* Left hero card — 3 cols */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-3 relative rounded-[2rem] overflow-hidden border border-slate-100 bg-white p-10 flex flex-col justify-between min-h-[380px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] group hover:shadow-[0_12px_40px_rgba(37,99,235,0.07)] transition-shadow duration-500"
                    >
                        <CornerBorders />
                        {/* Animated rotating ring (decorative) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                            aria-hidden
                            className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[1.5px] border-dashed border-blue-100 opacity-60"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
                            aria-hidden
                            className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-slate-100 opacity-50"
                        />

                        {/* Live badge */}
                        <span className="relative inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-8 z-10">
                            Industrial Competition
                        </span>

                        {/* Copy */}
                        <div className="relative z-10 flex-grow flex flex-col justify-center">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">What you build</p>
                            <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
                                A production-grade app —
                                <br />
                                <span className="text-blue-600">in 48 hours.</span>
                            </h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                                You deploy a fully functional application and present it to a panel of industry engineers. What you build is what you ship.
                            </p>
                        </div>

                        {/* Proof row */}
                        <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                            <p className="text-xs text-slate-500 font-medium">
                                Your project URL is publicly verifiable — shareable on LinkedIn & your portfolio.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right feature cards — 2 cols */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ x: 4 }}
                                className={`group flex items-start gap-4 rounded-[1.5rem] border border-slate-100 bg-gradient-to-br ${f.accent} hover:border-slate-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)] transition-all duration-300 p-5 cursor-default relative overflow-hidden`}
                            >
                                <CornerBorders size={10} thickness={1} />
                                <div className={`shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <f.icon className={`w-4 h-4 ${f.iconColor}`} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-slate-900 tracking-tight mb-1">{f.title}</p>
                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ══ BOTTOM CTA STRIP ═════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[2rem] border border-slate-100 bg-white px-8 py-7 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
                >
                    <CornerBorders />
                    {/* Subtle animated gradient blob */}
                    <motion.div
                        animate={{ x: [0, 20, 0], opacity: [0.03, 0.06, 0.03] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 pointer-events-none"
                    />

                    <div className="relative z-10">
                        <p className="text-slate-900 font-bold text-lg tracking-tight">
                            Hackathon available after course completion
                        </p>
                        <p className="text-slate-500 text-sm font-medium mt-0.5">
                            Open to all enrolled learners across every batch
                        </p>
                    </div>
                    <a
                        href="#enroll"
                        className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 transition-all duration-300 text-white text-sm font-bold px-6 py-4 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20 group"
                    >
                        Enroll to Participate
                        <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </motion.span>
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
