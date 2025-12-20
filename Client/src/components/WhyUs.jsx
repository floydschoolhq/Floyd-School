import React from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaBuilding, FaQuoteLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const WhyUs = () => {

    const schoolBenefits = [
        { title: "Reputation Boost", desc: "Showcases a tech-integrated vision." },
        { title: "Academic Alignment", desc: "No impact on school schedule." },
        { title: "Managed by Experts", desc: "Led by certified ThinkSkool mentors." },
        { title: "Real-time Insights", desc: "Tracking via the Smart Portal." },
        { title: "Innovation Focused", desc: "Fosters critical thinking and logic." },
        { title: "Zero Obligation", desc: "Continuation based on interest." }
    ];

    const studentBenefits = [
        { title: "Multi-Field Exposure", desc: "AI, IoT, and Dev immersion." },
        { title: "Hands-On Work", desc: "Project-based industrial learning." },
        { title: "Expert Mentorship", desc: "Guided by industry engineers." },
        { title: "Skill Building", desc: "Logic, creativity, and teamwork." },
        { title: "Global Certificates", desc: "Recognized industry standards." },
        { title: "Future Ready", desc: "Foundational career readiness." }
    ];

    return (
        <section className="bg-[#FCF8F8] py-24 relative overflow-hidden border-t border-[#FBEFEF] font-['Inter']">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#F5AFAF_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <p className="text-[#F5AFAF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">The Transformation Path</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-['Outfit']">
                        From <span className="text-[#F5AFAF]">Classroom</span> to <span className="text-[#2D2D2D]">Career</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        A step-by-step journey transforming the educational ecosystem.
                    </p>
                </div>

                <div className="relative">
                    {/* Continuous Vertical Line - Animated Draw Down */}
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 3, ease: "linear" }}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F5AFAF] via-[#F9DFDF] to-[#2D2D2D] md:-translate-x-1/2 origin-top opacity-50"
                    ></motion.div>


                    {/* --- SCHOOL SECTION START --- */}
                    <div className="mb-16 relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/50 backdrop-blur-sm border border-[#F5AFAF]/20 p-4 rounded-3xl inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-12 shadow-[0_10px_30px_-10px_rgba(245,175,175,0.2)] md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <span className="w-10 h-10 rounded-full bg-[#F5AFAF] flex items-center justify-center text-white text-xl">🏫</span>
                            <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] pr-4">Partnering with the School</h3>
                        </motion.div>

                        {/* Distributed School Points */}
                        <div className="space-y-12">
                            {schoolBenefits.map((item, idx) => (
                                <div key={idx} className="relative md:grid md:grid-cols-2 md:gap-16 items-center">

                                    {/* Alternating Content Layout */}
                                    <div className={`
                                        ${idx % 2 === 0 ? 'md:text-right md:pr-8' : 'md:col-start-2 md:text-left md:pl-8'}
                                        pl-[60px] md:pl-0 text-left
                                    `}>
                                        <motion.div
                                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                                        >
                                            <h4 className="font-black text-slate-900 text-lg font-['Outfit']">{item.title}</h4>
                                            <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                                        </motion.div>
                                    </div>

                                    {/* Timeline Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0 }}
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#F5AFAF] rounded-full z-10 shadow-sm"
                                    ></motion.div>

                                </div>
                            ))}
                        </div>
                    </div>


                    {/* --- CONNECTION --- */}
                    <div className="py-12 relative flex justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-sm px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F5AFAF] border border-[#FBEFEF] rounded-full z-10 font-['Outfit'] shadow-sm"
                        >
                            Seamless Integration
                        </motion.div>
                    </div>


                    {/* --- STUDENT SECTION START --- */}
                    <div className="relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-blue-50 border border-blue-100 p-4 rounded-2xl inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-12 shadow-md md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <span className="text-3xl">🎓</span>
                            <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">Empowering the Student</h3>
                        </motion.div>

                        {/* Distributed Student Points */}
                        <div className="space-y-12">
                            {studentBenefits.map((item, idx) => (
                                <div key={idx} className="relative md:grid md:grid-cols-2 md:gap-16 items-center">

                                    {/* Alternating Content Layout */}
                                    <div className={`
                                        ${idx % 2 === 1 ? 'md:text-right md:pr-8' : 'md:col-start-2 md:text-left md:pl-8'}
                                        pl-[60px] md:pl-0 text-left
                                    `}>
                                        <motion.div
                                            initial={{ opacity: 0, x: idx % 2 === 1 ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                                        >
                                            <h4 className="font-black text-slate-900 text-lg font-['Outfit']">{item.title}</h4>
                                            <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                                        </motion.div>
                                    </div>

                                    {/* Timeline Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0 }}
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#2D2D2D] rounded-full z-10 shadow-sm"
                                    ></motion.div>

                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Final CTA */}
                <div className="text-center mt-32">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6">Ready to start this journey?</p>
                    <button
                        onClick={() => {
                            const el = document.getElementById('registration-form');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#2D2D2D] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex items-center gap-2 mx-auto font-['Outfit'] group"
                    >
                        Enable The Ecosystem <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default WhyUs;
