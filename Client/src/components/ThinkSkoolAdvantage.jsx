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
            className="w-7 h-7 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M5 13l4 4L19 7" />
        </motion.svg>
    </span>
);

const Cross = () => (
    <span className="flex items-center justify-center">
        <X size={18} className="text-slate-400" strokeWidth={2} />
    </span>
);

const HighlightText = ({ text, words }) => {
    let result = text;
    const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                words.some(w => w.toLowerCase() === part.toLowerCase())
                    ? <span key={i} className="text-blue-600 font-bold">{part}</span>
                    : <span key={i}>{part}</span>
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
        <section id="why-us" className="pt-8 pb-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {/* Orbs removed for pure white theme */}
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-8">
                    <ScrollDarkenHeading>
                        Why Us
                    </ScrollDarkenHeading>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border border-slate-100 overflow-hidden bg-white shadow-[0_32px_64px_rgba(0,0,0,0.02)] relative"
                >
                    <CornerBorders />
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-slate-100 px-8 py-8 bg-white">
                        <div className="flex items-center">
                            <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Learning Features</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="px-8 py-3 bg-blue-600 text-white font-black text-[14px] uppercase tracking-wider shadow-xl shadow-blue-500/30">ThinkSkool</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-slate-400 font-bold text-[13px] uppercase tracking-tight">Free Resources</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-slate-400 font-bold text-[13px] uppercase tracking-tight">Other Courses</span>
                        </div>
                    </div>

                    {ADVANTAGES.map((row, idx) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] px-8 py-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors group`}
                        >
                            <div className="flex items-center">
                                 <span className="text-[18px] text-slate-700 font-bold group-hover:text-slate-900 transition-colors tracking-tight">
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
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ThinkSkoolAdvantage;
