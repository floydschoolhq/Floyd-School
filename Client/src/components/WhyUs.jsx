import React from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaBuilding, FaQuoteLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const WhyUs = () => {

    const schoolBenefits = [
        { title: "Elevates School's Reputation", desc: "Showcases a forward-thinking, tech-integrated vision." },
        { title: "Seamless Academic Alignment", desc: "Conducted during school hours with no schedule impact." },
        { title: "Effortless Faculty Involvement", desc: "Entirely managed by ThinkSkool's certified mentors." },
        { title: "Transparent Performance Insights", desc: "Real-time analytics via the Smart Portal." },
        { title: "Enhanced Learning Outcomes", desc: "Fosters critical thinking, collaboration, and innovation." },
        { title: "Sustainable Partnership Model", desc: "Option to extend post-immersion based on results." }
    ];

    const studentBenefits = [
        { title: "Exposure to 4 Key Tech Fields", desc: "AI, Cybersecurity, IoT, and Web/App Development." },
        { title: "Hands-On Project Learning", desc: "Build, solve, and create with real hands-on work." },
        { title: "Guided by Engineers", desc: "Mentorship from skilled industry experts." },
        { title: "Confidence & Skill Building", desc: "Boosts logic, creativity, and teamwork." },
        { title: "Future-Ready Foundation", desc: "Builds skills for careers and competitions." },
        { title: "Recognized Certification", desc: "Get a ThinkSkool Certificate on completion." }
    ];

    return (
        <section className="bg-white py-24 relative overflow-hidden border-t border-slate-100">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.03] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">The Transformation Path</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        From <span className="text-orange-500">Classroom</span> to <span className="text-blue-500">Career</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
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
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-slate-400 to-blue-400 md:-translate-x-1/2 origin-top"
                    ></motion.div>


                    {/* --- SCHOOL SECTION START --- */}
                    <div className="mb-16 relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-orange-50 border border-orange-100 p-4 rounded-2xl inline-flex items-center gap-4 relative z-10 md:left-1/2 md:-translate-x-1/2 mb-12 shadow-md md:w-auto w-[calc(100%-60px)] ml-[50px] md:ml-0"
                        >
                            <span className="text-3xl">🏫</span>
                            <h3 className="text-2xl font-black text-slate-900">Partnering with the School</h3>
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
                                            <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </motion.div>
                                    </div>

                                    {/* Timeline Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0 }}
                                        className="absolute left-[20px] md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-orange-500 rounded-full z-10"
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
                            className="bg-white px-4 py-1 text-xs font-bold uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full z-10"
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
                            <h3 className="text-2xl font-black text-slate-900">Empowering the Student</h3>
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
                                            <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
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
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 mx-auto">
                        Enable The Ecosystem <FaArrowRight />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default WhyUs;
