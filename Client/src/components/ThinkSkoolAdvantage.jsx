import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

const ADVANTAGES = [
    {
        feature: "Live 1:1 Doubt Support",
        highlight: ["1:1", "Live"],
        thinkskool: true,
        free: false,
        others: false,
    },
    {
        feature: "Industrial Bootcamp Sessions",
        highlight: ["Industrial", "Bootcamp"],
        thinkskool: true,
        free: false,
        others: false,
    },
    {
        feature: "AI + Real Coding Curriculum",
        highlight: ["AI +", "Real"],
        thinkskool: true,
        free: false,
        others: false,
    },
    {
        feature: "School & Campus Partnership Model",
        highlight: ["School", "Campus"],
        thinkskool: true,
        free: false,
        others: false,
    },
    {
        feature: "Expert Mentor Access (Industry Pros)",
        highlight: ["Expert", "Industry"],
        thinkskool: true,
        free: false,
        others: true,
    },
    {
        feature: "Project-Based + Production Deployment",
        highlight: ["Production", "Project-Based"],
        thinkskool: true,
        free: false,
        others: true,
    },
];

const Check = () => (
    <span className="flex items-center justify-center">
        <span className="w-6 h-6 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
            <CheckCircle2 size={13} className="text-blue-400" strokeWidth={2.5} />
        </span>
    </span>
);

const Cross = () => (
    <span className="flex items-center justify-center">
        <X size={14} className="text-slate-700" strokeWidth={2} />
    </span>
);

// Highlight specific words in bold blue
const HighlightText = ({ text, words }) => {
    let result = text;
    const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                words.some(w => w.toLowerCase() === part.toLowerCase())
                    ? <span key={i} className="text-blue-400 font-bold">{part}</span>
                    : <span key={i}>{part}</span>
            )}
        </span>
    );
};

const ThinkSkoolAdvantage = () => {
    return (
        <section className="py-20 bg-[#060C1B] relative overflow-hidden">
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
            {/* Top center glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-700/15 blur-[120px] rounded-full pointer-events-none" />
            {/* Bottom right warm accent */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-700/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                {/* Heading */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-3"
                    >
                        Why Us
                    </motion.h2>
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[2rem] border border-white/[0.08] overflow-hidden bg-[#0D1628]/90 backdrop-blur-xl shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
                >
                    {/* Header Row */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/8 px-6 py-5">
                        <div />
                        {/* ThinkSkool Logo Column */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="px-3.5 py-1 rounded-lg bg-white/[0.06] border border-blue-500/25 font-bold text-blue-300 text-[13px] tracking-tight">ThinkSkool</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-slate-400 font-bold text-[15px] tracking-tight">Free Resources</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-slate-400 font-bold text-[15px] tracking-tight">Other Courses</span>
                        </div>
                    </div>

                    {/* Feature Rows */}
                    {ADVANTAGES.map((row, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.07 }}
                            className={`grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/3 transition-colors group`}
                        >
                            <div className="flex items-center">
                                <span className="text-[15px] text-slate-300 font-bold group-hover:text-white transition-colors">
                                    <HighlightText text={row.feature} words={row.highlight} />
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                {row.thinkskool ? <Check /> : <Cross />}
                            </div>
                            <div className="flex items-center justify-center">
                                {row.free ? <Check /> : <Cross />}
                            </div>
                            <div className="flex items-center justify-center">
                                {row.others ? <Check /> : <Cross />}
                            </div>
                        </motion.div>
                    ))}

                    {/* Clean summary footer */}
                    <div className="grid grid-cols-2 gap-px bg-white/[0.05] border-t border-white/[0.06]">
                        {/* ThinkSkool side */}
                        <div className="bg-[#0D1628]/80 px-8 py-6 flex flex-col gap-1">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <div className="px-2.5 py-1 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white text-[12px] tracking-tight">ThinkSkool</div>
                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">6 / 6 features</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Structured', 'Mentored', 'Industry-Ready', 'Project-Based'].map(tag => (
                                    <span key={tag} className="text-[11px] font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                        {/* Others side */}
                        <div className="bg-[#0D1628]/40 px-8 py-6 flex flex-col gap-1">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <span className="text-[13px] font-bold text-slate-400 tracking-tight">Others</span>
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">2 / 6 features</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Generic Content', 'No Mentorship', 'No Deployment'].map(tag => (
                                    <span key={tag} className="text-[11px] font-semibold text-slate-600 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ThinkSkoolAdvantage;
