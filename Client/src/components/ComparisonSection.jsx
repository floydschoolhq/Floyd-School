import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, TrendingUp, TrendingDown, Sparkles, Terminal, Code2, Globe } from 'lucide-react';

const ComparisonSection = () => {
    const COMPARSIONS = [
        {
            stage: "PHASE 01: BEGINNINGS",
            traditional: {
                title: "Basics & Theory",
                desc: "Static textbook reading.",
                icon: <X className="text-slate-400" />,
                metric: "15% Practicality"
            },
            thinkskool: {
                title: "Immersive IDE",
                desc: "Live code from Day 1.",
                icon: <Terminal className="text-[#2563EB]" />,
                metric: "85% Practicality"
            }
        },
        {
            stage: "PHASE 02: DEVELOPMENT",
            traditional: {
                title: "Mini Projects",
                desc: "Outdated sample codes.",
                icon: <X className="text-slate-400" />,
                metric: "30% Readiness"
            },
            thinkskool: {
                title: "Production Apps",
                desc: "Build 5+ industry tools.",
                icon: <Code2 className="text-[#2563EB]" />,
                metric: "90% Readiness"
            }
        },
        {
            stage: "PHASE 03: COMPLETION",
            traditional: {
                title: "Degree Only",
                desc: "No industry connection.",
                icon: <X className="text-slate-400" />,
                metric: "Limited Readiness"
            },
            thinkskool: {
                title: "Engineering Mastery",
                desc: "FAANG-level expertise.",
                icon: <Globe className="text-[#2563EB]" />,
                metric: "Industry Professional"
            }
        }
    ];

    return (
        <section className="relative bg-[#FCF8F8] py-16 overflow-hidden border-t border-[#FBEFEF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[9px] mb-3 font-['Outfit']">Performance Metrics</p>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter font-['Outfit'] uppercase leading-none">
                        Conventional vs <span className="text-[#2563EB]">Future Ready</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* TRADITIONAL WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 rounded-[2rem] p-8 border border-slate-200 shadow-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between mb-16">
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                Traditional Education
                            </span>
                            <TrendingDown className="text-slate-700" size={24} />
                        </div>

                        <div className="space-y-8 relative">
                            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200"></div>

                            {COMPARSIONS.map((step, idx) => (
                                <div key={idx} className="relative pl-12">
                                    <div className="absolute left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-[#FCF8F8] z-10"></div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-['Outfit']">{step.stage}</p>
                                    <h3 className="text-base font-black text-slate-500 mb-0.5 font-['Outfit'] uppercase">{step.traditional.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium mb-3">{step.traditional.desc}</p>
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200">
                                        <TrendingDown size={10} className="text-slate-400" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{step.traditional.metric}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* THINKSKOOL WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] p-8 border border-[#2563EB]/20 shadow-sm relative overflow-hidden"
                    >
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/x rounded-full blur-3xl -mr-32 -mt-32 opacity-10"></div>

                        <div className="flex items-center justify-between mb-16 relative z-10">
                            <span className="px-6 py-2.5 bg-[#2563EB] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 flex items-center gap-2">
                                <Sparkles size={14} />
                                ThinkSkool Method
                            </span>
                            <TrendingUp className="text-[#2563EB]" size={24} />
                        </div>

                        <div className="space-y-12 relative z-10">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-blue-500/20"></div>

                            {COMPARSIONS.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    className="relative pl-16 group"
                                    whileHover={{ x: 10 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                    <motion.div
                                        className="absolute left-[18px] top-1 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white z-10 shadow-lg shadow-blue-500/50"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                                    ></motion.div>
                                    <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest mb-2 font-['Outfit']">{step.stage}</p>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-base font-black text-slate-900 font-['Outfit'] uppercase tracking-tight">{step.thinkskool.title}</h3>
                                        <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white border border-white/5 transition-colors duration-300">
                                            {React.cloneElement(step.thinkskool.icon, { size: 18 })}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">{step.thinkskool.desc}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2563EB]/10 rounded-full border border-[#2563EB]/20">
                                        <TrendingUp size={12} className="text-[#2563EB]" />
                                        <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest font-['Outfit']">{step.thinkskool.metric}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Final Comparison Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 bg-white rounded-[2rem] p-8 text-center relative overflow-hidden shadow-sm border border-[#FBEFEF]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10 uppercase tracking-tight font-['Outfit']">
                        Transforming the <span className="text-[#2563EB]">Learning Identity</span>
                    </h3>
                    <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed relative z-10 font-medium font-['Outfit']">
                        ThinkSkool doesn't just teach code; it remodeled the student's problem-solving core, moving them from passive consumers to professional engineering creators.
                    </p>
                </motion.div>

            </div>
        </section>
    );
};

export default ComparisonSection;
