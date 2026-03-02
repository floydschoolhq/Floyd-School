import React from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaBuilding, FaArrowRight } from 'react-icons/fa';
import SectionHeader from './common/SectionHeader';
import { schoolBenefits, studentBenefits } from '../constants/siteData';

const WhyUs = () => {

    return (
        <section className="bg-[#020617] py-24 relative overflow-hidden border-t border-white/5 cyber-mesh">
            {/* Energy Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-float-orb"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-float-orb" style={{ animationDelay: '-7s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                    >
                        <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-[0.4em]">Transformation Path</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none mb-6">
                        From <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-blue-400">Classroom</span> to <span className="text-white">Career</span>
                    </h2>
                    <p className="text-slate-500 font-semibold uppercase tracking-[0.3em] text-[11px] max-w-2xl mx-auto leading-relaxed">
                        A structured industrial trajectory transforming the academic core into professional engineering excellence.
                    </p>
                </div>

                <div className="relative mt-20">
                    {/* Glowing Vertical Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2 overflow-hidden">
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="w-full bg-gradient-to-b from-[#2563EB] via-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                        />
                    </div>

                    {/* --- SCHOOL SECTION START --- */}
                    <div className="mb-20 relative">
                        {/* Section Tag */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-3.5 rounded-[2rem] inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-16 md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center text-white text-base shadow-2xl">🏫</div>
                            <h3 className="text-[14px] font-bold text-white pr-4 uppercase tracking-wider">Institutional Architecture</h3>
                        </motion.div>

                        <div className="space-y-10">
                            {schoolBenefits.map((item, idx) => (
                                <div key={idx} className="relative md:grid md:grid-cols-2 md:gap-32 items-center">
                                    <div className={`${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:text-left md:pl-12'} pl-[60px] md:pl-0 text-left`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60, y: 40 }}
                                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ type: "spring", damping: 20, stiffness: 80 }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white/[0.03] backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-3xl relative overflow-hidden group"
                                        >
                                            <div className="glass-shine-effect" />
                                            <h4 className="font-black text-white text-base uppercase mb-2 tracking-tight leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{item.desc}</p>
                                        </motion.div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#020617] border border-[#2563EB]/40 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- CONVERGENCE --- */}
                    <div className="py-24 relative flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-slate-950 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.5em] text-[#2563EB] rounded-full z-10 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-[#2563EB]/30"
                        >
                            Ecosystem Convergence
                        </motion.div>
                    </div>

                    {/* --- STUDENT SECTION START --- */}
                    <div className="relative">
                        {/* Section Tag */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#2563EB]/10 backdrop-blur-2xl border border-[#2563EB]/20 p-3.5 rounded-[2rem] inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-16 md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-[#020617] border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] text-base shadow-2xl">🎓</div>
                            <h3 className="text-[14px] font-bold text-white pr-4 uppercase tracking-wider">Engineering Identity</h3>
                        </motion.div>

                        <div className="space-y-10">
                            {studentBenefits.map((item, idx) => (
                                <div key={idx} className="relative md:grid md:grid-cols-2 md:gap-32 items-center">
                                    <div className={`${idx % 2 === 1 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:text-left md:pl-12'} pl-[60px] md:pl-0 text-left`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: idx % 2 === 1 ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white/[0.03] backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-3xl relative overflow-hidden group"
                                        >
                                            <div className="glass-shine-effect" />
                                            <h4 className="font-black text-white text-base uppercase mb-2 tracking-tight leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{item.desc}</p>
                                        </motion.div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#020617] border border-[#2563EB]/40 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-24">
                    <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[11px] mb-8">Global Transformation Initiative</p>
                    <button
                        onClick={() => {
                            const el = document.getElementById('registration-form');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#2563EB] text-white px-10 py-5 rounded-[2rem] font-bold uppercase text-[12px] tracking-[0.3em] hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 flex items-center gap-3 mx-auto group border border-blue-400/20"
                    >
                        Enable The Ecosystem <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;

