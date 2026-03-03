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
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <CheckCircle2 size={14} className="text-white" strokeWidth={3} />
        </span>
    </span>
);

const Cross = () => (
    <span className="flex items-center justify-center">
        <X size={16} className="text-slate-600" strokeWidth={2} />
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
        <section className="py-20 bg-[#0A0F1E] relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                {/* Heading */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-400 font-bold tracking-tight text-[14px] mb-3"
                    >
                        The ThinkSkool Advantage
                    </motion.p>
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[2rem] border border-white/8 overflow-hidden bg-[#111827]/80 backdrop-blur-xl shadow-2xl shadow-blue-900/10"
                >
                    {/* Header Row */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/8 px-6 py-5">
                        <div />
                        {/* ThinkSkool Logo Column */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 font-bold text-white text-[14px] tracking-tight">ThinkSkool</div>
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

                    {/* Progress Bars Footer */}
                    <div className="px-6 pt-6 pb-5 space-y-4">
                        {/* ThinkSkool Bar */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-[12px] tracking-tight">ThinkSkool</div>
                                </div>
                                <span className="text-[12px] font-bold text-blue-400 italic">Structured. Mentored. Industry-Ready. ⚡</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '93%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                                />
                            </div>
                        </div>

                        {/* Others Bar */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[15px] font-bold text-slate-400 tracking-tight">Others</span>
                                <span className="text-[12px] font-bold text-slate-500 italic">Generic content, no structure</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '38%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                                    className="h-full rounded-full bg-slate-600"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ThinkSkoolAdvantage;
