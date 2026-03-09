import React from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Timer,
    Rocket,
    Users2,
    ArrowUpRight,
    ShieldCheck,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const STATS = [
    { value: '48', unit: 'Hrs', label: 'Non-stop build time' },
    { value: '3–6', unit: 'Members', label: 'Per cross-batch team' },
    { value: '100%', unit: 'Real', label: 'Industry problem statements' },
];

const FEATURES = [
    {
        icon: BrainCircuit,
        title: 'Real-World Problems',
        desc: 'Problem statements are sourced directly from industry partners — not textbook exercises.',
    },
    {
        icon: Users2,
        title: 'Cross-Batch Competition',
        desc: 'Team up with learners from different cohorts, just like a real engineering organisation.',
    },
    {
        icon: Timer,
        title: '48-Hour Sprint',
        desc: 'Scope, design, build, and deploy your solution within a strict 48-hour window.',
    },
    {
        icon: Rocket,
        title: 'Ship to Production',
        desc: 'Your finished project goes live — portfolio-ready and independently verifiable.',
    },
];

/* ─────────────────────────────────────────────────────────
   ANIMATION
───────────────────────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    }),
};

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function Hackathon() {
    return (
        <section className="relative bg-white py-24 overflow-hidden">

            {/* Subtle radial tints */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 70% 0%, rgba(37,99,235,0.05) 0%, transparent 55%), ' +
                        'radial-gradient(circle at 10% 90%, rgba(99,102,241,0.04) 0%, transparent 50%)',
                }}
            />

            <div className="relative max-w-6xl mx-auto px-6 lg:px-12">

                {/* ══ HEADER — 2-column ═══════════════════════════════ */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">

                    {/* Left: copy */}
                    <div>
                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="text-xs font-bold tracking-[0.22em] uppercase text-blue-600 mb-4"
                        >
                            Post-Course · Capstone Event
                        </motion.p>

                        <motion.h2
                            variants={fadeUp}
                            custom={1}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-950 leading-[1.08] tracking-[-0.03em] mb-6"
                        >
                            The Inter-Batch<br />Hackathon
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed"
                        >
                            After completing your program, you don't sit a written exam. You enter
                            a live, competitive hackathon — building real solutions to real problems
                            alongside peers from every cohort.
                        </motion.p>
                    </div>

                    {/* Right: stacked stats mini-cards */}
                    <motion.div
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex flex-col gap-3"
                    >
                        {STATS.map((s) => (
                            <div
                                key={s.value}
                                className="flex items-center justify-between bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-100 hover:shadow-[0_4px_20px_rgba(37,99,235,0.07)] transition-all duration-300 rounded-2xl px-6 py-5"
                            >
                                <span className="text-sm font-semibold text-gray-500">{s.label}</span>
                                <span className="text-2xl font-extrabold tracking-tight text-gray-950">
                                    {s.value}
                                    <span className="text-blue-600 text-base font-bold ml-1">{s.unit}</span>
                                </span>
                            </div>
                        ))}
                    </motion.div>

                </div>

                {/* ══ MAIN GRID ════════════════════════════════════════ */}
                <div className="grid lg:grid-cols-2 gap-6 items-stretch">

                    {/* Left dark card */}
                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-[#050D1F] p-10 overflow-hidden flex flex-col justify-between min-h-[420px]"
                    >
                        {/* Glow rings */}
                        <div
                            aria-hidden
                            className="absolute -top-24 -right-24 w-72 h-72 rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)' }}
                        />
                        <div
                            aria-hidden
                            className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
                        />

                        {/* Live badge */}
                        <span className="relative inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold text-blue-300 uppercase tracking-widest mb-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Live Competition
                        </span>

                        {/* Main copy */}
                        <div className="relative">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
                                What you build
                            </p>
                            <h3 className="text-3xl lg:text-4xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
                                A production&#8209;grade app&nbsp;—<br />
                                <span className="text-blue-400">in 48 hours.</span>
                            </h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
                                No slides. No demos that break. You deploy a fully functional application
                                and present it to a panel of industry engineers.
                            </p>
                        </div>

                        {/* Proof row */}
                        <div className="relative mt-10 pt-6 border-t border-white/[0.06] flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                            <p className="text-xs text-gray-400 font-medium">
                                Your project URL is publicly verifiable — shareable on LinkedIn &amp; your portfolio.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right feature list */}
                    <div className="flex flex-col gap-4">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                variants={fadeUp}
                                custom={5 + i * 0.5}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-100 hover:shadow-[0_4px_24px_rgba(37,99,235,0.07)] transition-all duration-300 p-6 cursor-default"
                            >
                                <div className="shrink-0 w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-blue-100 transition-colors">
                                    <f.icon className="w-5 h-5 text-blue-600" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[15px] font-bold text-gray-900 mb-1 tracking-tight">{f.title}</p>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ══ BOTTOM CTA STRIP ════════════════════════════════ */}
                <motion.div
                    variants={fadeUp}
                    custom={9}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-gray-950 px-8 py-7"
                >
                    <div>
                        <p className="text-white font-bold text-lg tracking-tight">
                            Hackathon available after course completion
                        </p>
                        <p className="text-gray-400 text-sm font-medium mt-0.5">
                            Open to all enrolled learners across every batch
                        </p>
                    </div>
                    <a
                        href="#enroll"
                        className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-bold px-6 py-3 rounded-xl"
                    >
                        Enroll to Participate
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
