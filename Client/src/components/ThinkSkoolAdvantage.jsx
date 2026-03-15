import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

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
];

const Check = () => (
    <span className="flex items-center justify-center">
        <motion.svg 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            viewBox="0 0 24 24" 
            className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M5 13l4 4L19 7" />
        </motion.svg>
    </span>
);

const Cross = () => (
    <span className="flex items-center justify-center">
        <X size={18} className="text-slate-700" strokeWidth={2} />
    </span>
);

const HighlightText = ({ text, words }) => {
    let result = text;
    const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                words.some(w => w.toLowerCase() === part.toLowerCase())
                    ? <span key={i} className="text-white font-semibold">{part}</span>
                    : <span key={i} className="text-slate-400 font-normal">{part}</span>
            )}
        </span>
    );
};

const CornerBorders = () => (
    <>
        <span style={{ position:'absolute', top:8, left:8, width:14, height:14, borderTop:'1.5px solid rgba(15,23,42,0.18)', borderLeft:'1.5px solid rgba(15,23,42,0.18)', pointerEvents:'none', zIndex:20 }} />
        <span style={{ position:'absolute', top:8, right:8, width:14, height:14, borderTop:'1.5px solid rgba(15,23,42,0.18)', borderRight:'1.5px solid rgba(15,23,42,0.18)', pointerEvents:'none', zIndex:20 }} />
        <span style={{ position:'absolute', bottom:8, left:8, width:14, height:14, borderBottom:'1.5px solid rgba(15,23,42,0.18)', borderLeft:'1.5px solid rgba(15,23,42,0.18)', pointerEvents:'none', zIndex:20 }} />
        <span style={{ position:'absolute', bottom:8, right:8, width:14, height:14, borderBottom:'1.5px solid rgba(15,23,42,0.18)', borderRight:'1.5px solid rgba(15,23,42,0.18)', pointerEvents:'none', zIndex:20 }} />
    </>
);

const ThinkSkoolAdvantage = () => {
    return (
        <section id="why-us" className="pt-12 pb-32 bg-slate-950 relative overflow-hidden">
            {/* Premium Dark Background Architecture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:32px_32px]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-800/40 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <ScrollDarkenHeading variant="dark">
                        WHY US
                    </ScrollDarkenHeading>
                </div>

                <div className="relative group/table">
                    {/* Dark Glassmorphism Table Container */}
                    <div className="relative border border-slate-800/80 rounded-[2rem] overflow-hidden bg-slate-900/40 backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                        
                        {/* Header Row */}
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-stretch border-b border-slate-800">
                            <div className="p-10 flex items-center bg-slate-900/60">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Operational Metrics</span>
                            </div>
                            <div className="p-10 flex flex-col items-center justify-center bg-slate-800/50 border-x border-slate-700/50 relative overflow-hidden">
                                {/* Shiny Top Border */}
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
                                <div className="px-5 py-2 bg-white text-slate-950 font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-sm relative z-10">
                                    thinkskool
                                </div>
                            </div>
                            <div className="p-10 flex items-center justify-center bg-slate-900/20">
                                <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-widest">Free</span>
                            </div>
                            <div className="p-10 flex items-center justify-center bg-slate-900/20">
                                <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-widest">Others</span>
                            </div>
                        </div>

                        {/* Content Rows */}
                        <div className="divide-y divide-slate-800/50">
                            {ADVANTAGES.map((row, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-20px" }}
                                    transition={{ delay: idx * 0.03 }}
                                    style={{ willChange: 'transform, opacity' }}
                                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr] hover:bg-slate-800/40 transition-all duration-300 group/row relative"
                                >
                                    {/* Feature Col */}
                                    <div className="p-8 px-10 flex items-center bg-transparent transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-[16px] tracking-tight transition-colors uppercase mb-1">
                                                <HighlightText text={row.feature} words={row.highlight} />
                                            </span>
                                            <div className="w-8 h-[2px] bg-slate-800 group-hover/row:w-16 group-hover/row:bg-white transition-all duration-500 rounded-full mt-2" />
                                        </div>
                                    </div>

                                    {/* ThinkSkool Col */}
                                    <div className="p-8 flex items-center justify-center bg-slate-800/30 border-x border-slate-700/30 group-hover/row:bg-slate-800/60 transition-colors relative">
                                        <div className="absolute inset-0 bg-white/0 group-hover/row:bg-white/5 transition-colors duration-500 pointer-events-none" />
                                        <div className="transform group-hover/row:scale-110 transition-transform duration-500 relative z-10">
                                            {row.thinkskool ? <Check /> : <Cross />}
                                        </div>
                                    </div>

                                    {/* Comparisons */}
                                    <div className="p-8 flex items-center justify-center opacity-50 group-hover/row:opacity-100 transition-all">
                                        {row.free ? <Check /> : <Cross />}
                                    </div>
                                    <div className="p-8 flex items-center justify-center opacity-50 group-hover/row:opacity-100 transition-all">
                                        {row.others ? <Check /> : <Cross />}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThinkSkoolAdvantage;
