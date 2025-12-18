import React, { useState } from 'react';
import { motion } from 'framer-motion';

const STEMFutureSection = () => {
    return (
        <section className="relative min-h-screen bg-slate-50 py-24 overflow-hidden font-['Inter']" id="stem-future">

            <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tighter font-['Outfit']">
                        The Future of <span className="text-[#fca96d]">STEM Education</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                        Experience the transformation from traditional learning to immersive, interactive education
                    </p>
                </motion.div>

                {/* Split Screen Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* OLD WAY - Left Side */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative h-[600px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl grayscale hover:grayscale-0 transition-all duration-500">

                            <div className="absolute top-6 left-6 z-20">
                                <div className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-sm font-['Outfit']">
                                    <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Traditional Education</span>
                                </div>
                            </div>

                            {/* Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                                <div className="text-center opacity-50">
                                    <div className="text-8xl mb-4">📚</div>
                                    <p className="text-slate-400 text-xl font-black uppercase tracking-widest font-['Outfit']">Old Way</p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-sm border-t border-slate-100">
                                <h3 className="text-2xl font-black text-slate-700 mb-3 font-['Outfit'] uppercase tracking-tight">
                                    Passive Learning
                                </h3>
                                <ul className="space-y-3 text-slate-500">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        Static textbooks and memorization
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        One-way knowledge transfer
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        Limited practical application
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* NEW WAY - Right Side */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative h-[600px] rounded-3xl overflow-hidden border-2 border-[#fca96d]/20 bg-white shadow-2xl shadow-[#fca96d]/10">

                            <div className="absolute top-6 left-6 z-20">
                                <div className="px-4 py-2 rounded-full bg-[#fca96d]/10 border border-[#fca96d]/20 shadow-sm font-['Outfit']">
                                    <span className="font-black text-[10px] uppercase tracking-widest">
                                        <span className="text-slate-900">Think</span>
                                        <span className="text-[#fca96d]">Skool</span>
                                        <span className="text-slate-400"> Way</span>
                                    </span>
                                </div>
                            </div>

                            {/* Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fca96d]/10 to-white">
                                <div className="text-center">
                                    <div className="text-8xl mb-4 animate-bounce">🚀</div>
                                    <p className="text-[#fca96d] text-xl font-black uppercase tracking-widest font-['Outfit']">New Way</p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-sm border-t border-[#fca96d]/20">
                                <h3 className="text-2xl font-black text-slate-900 mb-3 font-['Outfit'] uppercase tracking-tight">
                                    Interactive Learning
                                </h3>
                                <ul className="space-y-3 text-slate-600 font-medium">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#fca96d] shadow-lg shadow-[#fca96d]/50"></span>
                                        Live code execution & 3D simulations
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#fca96d] shadow-lg shadow-[#fca96d]/50"></span>
                                        Hands-on project-based learning
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#fca96d] shadow-lg shadow-[#fca96d]/50"></span>
                                        Real-time feedback & gamification
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default STEMFutureSection;
