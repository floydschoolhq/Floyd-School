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
        <section className="bg-white py-24 relative overflow-hidden border-t border-slate-100 font-['Inter']">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.03] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <p className="text-[#fca96d] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">The Transformation Path</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-['Outfit']">
                        From <span className="text-[#fca96d]">Classroom</span> to <span className="text-blue-600">Career</span>
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
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#fca96d] via-slate-200 to-blue-500 md:-translate-x-1/2 origin-top"
                    ></motion.div>


                    {/* --- SCHOOL SECTION START --- */}
                    <div className="mb-16 relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#fca96d]/10 border border-[#fca96d]/20 p-4 rounded-2xl inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-12 shadow-sm md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <span className="text-3xl">🏫</span>
                            <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">Partnering with the School</h3>
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
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#fca96d] rounded-full z-10"
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
                            className="bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full z-10 font-['Outfit']"
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
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full z-10"
                                    ></motion.div>

                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Final CTA */}
                <div className="text-center mt-32">
                    <p className="text-slate-500 font-medium mb-6">Ready to start this journey?</p>
                    <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 mx-auto font-['Outfit']">
                        Enable The Ecosystem <FaArrowRight />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default WhyUs;
