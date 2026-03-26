import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaSchool, FaGraduationCap } from 'react-icons/fa';
import { schoolBenefits, studentBenefits } from '../constants/siteData';
import useIsMobile from '../hooks/useIsMobile';

const WhyUs = () => {
    const isMobile = useIsMobile();


    if (isMobile) {
        return (
            <section className="bg-[#020617] py-16 px-6 relative overflow-hidden border-t border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
                
                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                            <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Industrial Core</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tighter">
                            Built for <span className="text-blue-500">Excellence.</span>
                        </h2>
                    </div>

                    <div className="relative space-y-12">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/10" />

                        {/* Combined Benefits */}
                        {[...schoolBenefits.slice(0, 2), ...studentBenefits.slice(0, 2)].map((item, idx) => (
                            <div key={idx} className="relative pl-12">
                                <div className="absolute left-2.5 top-0 w-3 h-3 rounded-full bg-slate-900 border border-slate-700 z-10" />
                                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] active:scale-95 transition-transform">
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 leading-none">{item.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-snug">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button
                            onClick={() => {
                                const el = document.getElementById('registration-form');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                        >
                            Get Started <FaArrowRight size={10} />
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#020617] py-24 relative overflow-hidden border-t border-white/5 cyber-mesh">
            {/* Energy Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-float-orb"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-float-orb" style={{ animationDelay: '-7s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5"
                    >
                        <span className="text-[13px] font-black text-slate-500 tracking-wider uppercase">Master 15+ Advanced AI Tools</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                        <span className="text-slate-400">50+ Industrial Projects</span> Powering Professional Engineering Mastery
                    </h2>
                    <div className="w-12 h-1 bg-blue-600/30 mx-auto rounded-full" />
                </div>

                <div className="relative mt-20">
                    {/* Glowing Vertical Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2 overflow-hidden">
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="w-full bg-gradient-to-b from-slate-900 via-slate-500 to-slate-900 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                        />
                    </div>

                    {/* --- SCHOOL SECTION START --- */}
                    <div className="mb-20 relative">
                        {/* Section Tag */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-3.5 rounded-[2rem] inline-flex items-center gap-6 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-16 md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-slate-500/10 blur-xl rounded-full scale-150 opacity-100" />
                                <FaSchool size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] relative z-10" />
                            </div>
                            <h3 className="text-[16px] font-bold text-white pr-4 uppercase tracking-wider">Institutional Architecture</h3>
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
                                            <h4 className="font-bold text-white text-lg mb-2 tracking-tight leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest">{item.desc}</p>
                                        </motion.div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#020617] border border-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
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
                            className="bg-slate-950 px-8 py-3.5 text-[14px] font-semibold tracking-tight text-slate-400 rounded-full z-10 shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-slate-800"
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
                            className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-3.5 rounded-[2rem] inline-flex items-center gap-6 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-16 md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-slate-500/10 blur-xl rounded-full scale-110 opacity-100" />
                                <FaGraduationCap size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] relative z-10" />
                            </div>
                            <h3 className="text-[17px] font-bold text-white pr-4 tracking-tight">Engineering Identity</h3>
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
                                            <h4 className="font-bold text-white text-lg mb-2 tracking-tight leading-tight group-hover:text-slate-200 transition-colors">{item.title}</h4>
                                            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest">{item.desc}</p>
                                        </motion.div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#020617] border border-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-24">
                    <p className="text-slate-500 font-semibold tracking-tight text-[12px] mb-8">Global Transformation Initiative</p>
                    <button
                        onClick={() => {
                            const el = document.getElementById('registration-form');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-slate-900 hover:bg-black text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1 flex items-center gap-3 mx-auto group border border-slate-200/20"
                    >
                        Enable The Ecosystem <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};


export default WhyUs;

