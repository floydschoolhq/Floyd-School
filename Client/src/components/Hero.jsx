import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';

const Hero = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end center"]
    });
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="relative bg-white pt-24 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* Timeline Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 to-transparent hidden md:block"></div>

                {/* Timeline Node - Top */}
                <div className="absolute left-[26px] top-28 w-3 h-3 rounded-full border-2 border-orange-500 bg-white hidden md:block"></div>


                <div className="md:pl-16">
                    {/* Main Heading Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-2 bg-orange-100 rounded-lg">
                                <span className="w-3 h-3 bg-orange-500 block rounded-full"></span>
                            </span>
                            <span className="font-semibold text-slate-800 text-base">Your one stop destination to code, create & connect</span>
                        </div>

                        {/* Cards Grid - 10X Style */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">

                            {/* Card 1: 10X Club */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                onClick={() => setIsModalOpen(true)}
                                className="bg-orange-50 rounded-2xl p-8 relative overflow-hidden group cursor-pointer border border-orange-100"
                            >
                                <div className="relative z-10">
                                    <h3 className="text-4xl font-black text-slate-900 mb-4">10X<span className="text-orange-500">CLUB</span></h3>
                                    <p className="text-slate-600 font-medium mb-6 leading-relaxed text-sm">
                                        Unlock learning, career opportunities & success from X to 10X
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-600 shadow-sm">Industry Expert Session</span>
                                        <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-600 shadow-sm">CXO Cafe</span>
                                        <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-600 shadow-sm">Tech Conference</span>
                                    </div>
                                </div>
                                {/* Background decoration */}
                                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-100/50 to-transparent"></div>
                            </motion.div>

                            {/* Card 2: Personal Guidance */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-slate-50 rounded-2xl p-8 relative overflow-hidden group cursor-pointer border border-slate-100"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-blue-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Learn from CXOs, founders & more</h3>
                                    <p className="text-slate-500 font-medium text-sm mb-0">Exclusive Insights from industry leaders</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>


                    {/* Second Section: Doubt Resolution - Consistent with reference */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center py-12"
                    >
                        <div className="relative">
                            {/* Timeline Node */}
                            <div className="absolute -left-[70px] top-6 w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] hidden md:flex border border-white shadow-sm z-10">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>

                            <span className="text-slate-900 font-bold mb-4 block">Always available when you get stuck</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                                Resolve doubts any time through chat, voice notes or calling.
                            </h2>
                            <h3 className="text-2xl md:text-3xl font-bold text-orange-500 mb-4">
                                500+ dedicated Teaching Assistants to resolve your doubts quickly
                            </h3>
                            <p className="text-base text-slate-400 font-bold">
                                5/5 rating for 90% doubt resolutions
                            </p>
                        </div>

                        {/* Visual/Image Placeholder - Dark Background card from reference */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden min-h-[300px] flex flex-col justify-center shadow-2xl">
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                            <div className="relative z-10 text-center">
                                <h4 className="text-3xl font-bold mb-4">Doubt Resolution</h4>
                                <p className="text-slate-400 text-lg">24/7 Support System</p>
                                <div className="mt-8 flex justify-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full animate-bounce delay-100 flex items-center justify-center">💬</div>
                                    <div className="w-12 h-12 bg-white/10 rounded-full animate-bounce delay-300 flex items-center justify-center">📞</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* HOW IT WORKS Section */}
                    <div ref={containerRef} className="py-20 border-t border-slate-100 relative">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-2 h-10 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">How It Works ?</h2>
                        </div>

                        <div className="relative">
                            {/* Vertical Line - Background (Gray) */}
                            <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-100 rounded-full"></div>

                            {/* Vertical Line - Scroll Progress (Colored) */}
                            <motion.div
                                style={{ scaleY: scaleY }}
                                className="absolute left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-orange-500 via-slate-900 to-orange-500 rounded-full origin-top"
                            />

                            {/* Steps */}
                            <div className="space-y-12">
                                {[
                                    {
                                        title: "Introductory Meeting & Schedule Finalization",
                                        desc: "We align the program timings with your school timetable.",
                                        color: "bg-orange-500"
                                    },
                                    {
                                        title: "7-Day In-School Tech Immersion",
                                        desc: "ThinkSkool mentors conduct hands-on sessions in the classroom.",
                                        color: "bg-slate-900"
                                    },
                                    {
                                        title: "Student Engagement & Progress Observation",
                                        desc: "School leadership observes student interest and learning outcomes.",
                                        color: "bg-orange-500"
                                    },
                                    {
                                        title: "Feedback & Continuation Decision",
                                        desc: "If the school wishes, we continue with our extended in-school training program.",
                                        subBox: "No obligation - Continuation is optional and based on the school's interest.",
                                        color: "bg-slate-900"
                                    }
                                ].map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 12,
                                            delay: idx * 0.1
                                        }}
                                        className="relative pl-20"
                                    >
                                        {/* Dot with Pulse Effect */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: idx * 0.1 + 0.2 }}
                                            className={`absolute left-3 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md ${step.color} z-10`}
                                        >
                                            <div className={`absolute inset-0 rounded-full ${step.color} animate-ping opacity-75`}></div>
                                        </motion.div>

                                        {/* Content */}
                                        <div className="group hover:translate-x-2 transition-transform duration-300">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                            <p className="text-slate-600 leading-relaxed font-medium text-sm">{step.desc}</p>
                                            {step.subBox && (
                                                <div className="mt-4 p-4 bg-slate-50 border-l-4 border-slate-900 rounded-r-lg">
                                                    <p className="text-sm font-bold text-slate-800">{step.subBox}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="hero_10x_card" />
        </div>
    );
};

export default Hero;
