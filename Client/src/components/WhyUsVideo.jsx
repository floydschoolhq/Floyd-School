import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Brain, BookOpen, Layers, Zap, Rocket, Users } from 'lucide-react';

const WhyUsVideo = () => {

    const comparisonFeatures = [
        {
            name: "Learning Method",
            traditional: "Passive Memorization",
            stem: "Active Hands-on Labs"
        },
        {
            name: "Curriculum Structure",
            traditional: "Theoretical Silos",
            stem: "Integrated STEM Projects"
        },
        {
            name: "Student Engagement",
            traditional: "Low Retention",
            stem: "Immersive Simulation"
        },
        {
            name: "Skill Outcome",
            traditional: "Exam Focused",
            stem: "Industry Ready"
        }
    ];

    return (
        <section className="bg-slate-50 py-24 relative overflow-hidden font-['Inter']">
            {/* Background Text */}
            <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
                <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent stroke-text opacity-5 whitespace-nowrap"
                    style={{ WebkitTextStroke: '2px #2563EB' }}>
                    EVOLUTION
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20 animate-fade-in-up">
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Evolution of Learning</p>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 font-['Outfit'] tracking-tighter mb-4">
                        Future of <span className="text-[#2563EB]">STEM</span>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-0 relative">

                    {/* VS Badge (Absolute Center on Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white rounded-full items-center justify-center shadow-xl border border-slate-100">
                        <span className="font-black text-slate-900 italic text-xl font-['Outfit']">VS</span>
                    </div>

                    {/* Traditional Model Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2.5rem] p-10 md:pr-16 shadow-lg shadow-slate-200/50 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
                        <div className="mb-10">
                            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 font-['Outfit']">Traditional Model</span>
                            <h3 className="text-3xl font-black text-slate-400 mb-2 font-['Outfit']">Passive <span className="opacity-50">Learning</span></h3>
                            <div className="flex gap-4 mt-6">
                                <div className="px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200">
                                    <span className="block text-2xl font-black text-slate-400">12%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engagement</span>
                                </div>
                                <div className="px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200">
                                    <span className="block text-2xl font-black text-slate-400">00%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {comparisonFeatures.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group/item opacity-60 hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <X size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-500 text-sm font-['Outfit'] uppercase tracking-wide decoration-slate-300 decoration-2">{item.traditional}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ThinkSkool Model Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 bg-white border border-[#2563EB]/10 rounded-[2.5rem] p-10 md:pl-16 shadow-2xl shadow-[#2563EB]/10 relative z-10 overflow-hidden transform md:-ml-8 mt-8 md:mt-0"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#2563EB]"></div>
                        {/* Glowing Background Effect */}
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="mb-10">
                            <span className="inline-block px-4 py-1 rounded-full bg-[#EBF3FF] text-[#2563EB] text-[10px] font-black uppercase tracking-widest mb-4 font-['Outfit']">ThinkSkool Ecosystem</span>
                            <h3 className="text-3xl font-black text-slate-900 mb-2 font-['Outfit']">Active <span className="text-[#2563EB]">Mastery</span></h3>
                            <div className="flex gap-4 mt-6">
                                <div className="px-6 py-3 bg-white rounded-2xl border border-[#2563EB]/20 shadow-lg shadow-[#2563EB]/5">
                                    <span className="block text-2xl font-black text-[#2563EB]">95%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retention</span>
                                </div>
                                <div className="px-6 py-3 bg-white rounded-2xl border border-[#2563EB]/20 shadow-lg shadow-[#2563EB]/5">
                                    <span className="block text-2xl font-black text-[#2563EB]">12X</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Velocity</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {comparisonFeatures.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/30">
                                        <Check size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm font-['Outfit'] uppercase tracking-wide">{item.stem}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyUsVideo;
