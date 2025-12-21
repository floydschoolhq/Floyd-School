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
        <section className="relative bg-[#FCF8F8] py-24 overflow-hidden font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Performance Metrics</p>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter font-['Outfit']">
                        Conventional vs <span className="text-[#2563EB]">Future Ready</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* TRADITIONAL WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[3rem] p-10 border border-[#FBEFEF] shadow-xl grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <span className="px-5 py-2 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                Traditional Education
                            </span>
                            <TrendingDown className="text-slate-300" size={24} />
                        </div>

                        <div className="space-y-12 relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>

                            {COMPARSIONS.map((step, idx) => (
                                <div key={idx} className="relative pl-16">
                                    <div className="absolute left-[18px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white z-10"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{step.stage}</p>
                                    <h3 className="text-xl font-black text-slate-700 mb-1 font-['Outfit']">{step.traditional.title}</h3>
                                    <p className="text-sm text-slate-400 font-medium mb-4">{step.traditional.desc}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                        <TrendingDown size={12} className="text-slate-300" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.traditional.metric}</span>
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
                        className="bg-white rounded-[3rem] p-10 border-2 border-[#2563EB]/20 shadow-[0_40px_80px_-20px_rgba(245,175,175,0.15)] relative overflow-hidden"
                    >
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <span className="px-5 py-2 bg-[#2563EB] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#2563EB]/30 flex items-center gap-2">
                                <Sparkles size={14} />
                                ThinkSkool Method
                            </span>
                            <TrendingUp className="text-[#2563EB]" size={24} />
                        </div>

                        <div className="space-y-12 relative z-10">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-[#FBEFEF]"></div>

                            {COMPARSIONS.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    className="relative pl-16 group"
                                    whileHover={{ x: 10 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                    <motion.div
                                        className="absolute left-[18px] top-1 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white z-10 shadow-sm"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                                    ></motion.div>
                                    <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest mb-2">{step.stage}</p>
                                    <div className="flex items-center gap-4 mb-1">
                                        <h3 className="text-xl font-black text-slate-900 font-['Outfit']">{step.thinkskool.title}</h3>
                                        <div className="w-8 h-8 rounded-lg bg-[#FBEFEF] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                                            {React.cloneElement(step.thinkskool.icon, { size: 16 })}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mb-4">{step.thinkskool.desc}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FBEFEF] rounded-full border border-[#F9DFDF]">
                                        <TrendingUp size={12} className="text-[#2563EB]" />
                                        <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest">{step.thinkskool.metric}</span>
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
                    className="mt-16 bg-[#2D2D2D] rounded-[2.5rem] p-12 text-center relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <h3 className="text-3xl font-black text-white mb-4 relative z-10 font-['Outfit'] uppercase tracking-tight">
                        Transforming the <span className="text-[#2563EB]">Learning Identity</span>
                    </h3>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed relative z-10 font-medium">
                        ThinkSkool doesn't just teach code; it architecturally remodels the student's problem-solving core, moving them from passive consumers to elite engineering creators.
                    </p>
                </motion.div>

            </div>
        </section>
    );
};

export default ComparisonSection;
