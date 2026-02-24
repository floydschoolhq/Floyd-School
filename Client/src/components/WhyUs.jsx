import React from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaBuilding, FaArrowRight } from 'react-icons/fa';
import SectionHeader from './common/SectionHeader';
import { schoolBenefits, studentBenefits } from '../constants/siteData';

const WhyUs = () => {

    return (
        <section className="bg-[#FCF8F8] py-14 relative overflow-hidden border-t border-[#FBEFEF] font-['Outfit']">
            {/* Background pattern - very subtle */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2563EB_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 hidden lg:block opacity-[0.02] text-white pointer-events-none">
                    <FaBuilding className="text-[400px]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hidden lg:block opacity-[0.02] text-white pointer-events-none">
                    <FaUserGraduate className="text-[400px]" />
                </div>

                {/* Header */}
                <SectionHeader
                    subtitle="The Transformation Path"
                    title={<span>From <span className="text-[#2563EB]">Classroom</span> to <span className="text-slate-900">Career</span></span>}
                    description="A structured industrial trajectory transforming the academic core into professional engineering excellence."
                    light={true}
                />

                <div className="relative mt-24">
                    {/* Continuous Vertical Line - Animated Draw Down */}
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 3, ease: "linear" }}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#2563EB] via-slate-200 to-transparent md:-translate-x-1/2 origin-top opacity-40"
                    ></motion.div>


                    {/* --- SCHOOL SECTION START --- */}
                    <div className="mb-10 relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white border border-[#FBEFEF] shadow-sm p-4 rounded-2xl inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-12 md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white text-base">🏫</div>
                            <h3 className="text-base font-black text-slate-900 font-['Outfit'] pr-4 uppercase tracking-tight">Institutional Architecture</h3>
                        </motion.div>

                        {/* Distributed School Points */}
                        <div className="space-y-10">
                            {schoolBenefits.map((item, idx) => (
                                <div key={idx} className="relative md:grid md:grid-cols-2 md:gap-32 items-center">

                                    {/* Alternating Content Layout */}
                                    <div className={`
                                        ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:text-left md:pl-12'}
                                        pl-[60px] md:pl-0 text-left
                                    `}>
                                        <motion.div
                                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h4 className="font-black text-slate-900 text-base font-['Outfit'] uppercase mb-1.5 tracking-tight">{item.title}</h4>
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                                        </motion.div>
                                    </div>

                                    {/* Timeline Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-4 border-[#2563EB] rounded-full z-10 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                    ></motion.div>

                                </div>
                            ))}
                        </div>
                    </div>


                    {/* --- CONNECTION --- */}
                    <div className="py-20 relative flex justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-white border border-[#FBEFEF] px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.4em] text-[#2563EB] rounded-full z-10 font-['Outfit'] shadow-sm"
                        >
                            Ecosystem Convergence
                        </motion.div>
                    </div>


                    {/* --- STUDENT SECTION START --- */}
                    <div className="relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white border border-[#FBEFEF] shadow-sm p-4 rounded-2xl inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-12 shadow-2xl md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white text-base">🎓</div>
                            <h3 className="text-base font-black text-slate-900 font-['Outfit'] pr-4 uppercase tracking-tight">Engineering Identity</h3>
                        </motion.div>

                        {/* Distributed Student Points */}
                        <div className="space-y-10">
                            {studentBenefits.map((item, idx) => (
                                <div key={idx} className="relative md:grid md:grid-cols-2 md:gap-32 items-center">

                                    {/* Alternating Content Layout */}
                                    <div className={`
                                        ${idx % 2 === 1 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:text-left md:pl-12'}
                                        pl-[60px] md:pl-0 text-left
                                    `}>
                                        <motion.div
                                            initial={{ opacity: 0, x: idx % 2 === 1 ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h4 className="font-black text-slate-900 text-base font-['Outfit'] uppercase mb-1.5 tracking-tight">{item.title}</h4>
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                                        </motion.div>
                                    </div>

                                    {/* Timeline Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-4 border-slate-300 rounded-full z-10"
                                    ></motion.div>

                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Final CTA */}
                <div className="text-center mt-12">
                    <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8 font-['Outfit']">Global Transformation Initiative</p>
                    <button
                        onClick={() => {
                            const el = document.getElementById('registration-form');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#2563EB] text-white px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.25em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 hover:-translate-y-1 flex items-center gap-3 mx-auto font-['Outfit'] group"
                    >
                        Enable The Ecosystem <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default WhyUs;
