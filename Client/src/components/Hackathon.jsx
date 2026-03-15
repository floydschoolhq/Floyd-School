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
        <section id="hackathon" className="relative bg-white py-12 overflow-hidden">
            {/* Subtle background grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.01]"
                style={{
                    backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative max-w-6xl mx-auto px-6">
                <div className="text-center mb-10">
                    <ScrollDarkenHeading>
                        HACKATHON
                    </ScrollDarkenHeading>
                </div>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
                    {/* Compact Main Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                    >
                        <CornerBorders />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100/50">Industrial Focus</span>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>

                            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-6 uppercase">
                                BUILD Real-World Apps <br />
                                <span className="text-blue-600">in 48 hours.</span>
                            </h3>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-50">
                                {STATS.map(s => (
                                    <div key={s.label}>
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter mb-1">
                                            <Counter to={s.value} suffix={s.suffix} />
                                        </p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-tight">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-default">
                             <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                             <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Publicly verifiable project URL & LinkedIn verification included.</p>
                        </div>
                    </motion.div>

                    {/* Compact Feature Sidebar */}
                    <div className="flex flex-col gap-4">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-gradient-to-br ${f.accent} hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-500/5 group`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                                    <f.icon size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{f.title}</p>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}

                        <motion.a
                            href="#enroll"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-2 flex items-center justify-center gap-3 bg-slate-900 text-white p-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 group"
                        >
                            Enroll to Compete <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </div>
                </div>
            </div>
        </section>
    );
}
