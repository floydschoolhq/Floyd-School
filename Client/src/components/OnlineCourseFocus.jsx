import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Code, Terminal, ShieldCheck, Globe, Video, MessageSquare, Rocket, CheckCircle2, Zap, X, Check, Target, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_COURSES } from '../constants/siteData';

const OnlineCourseFocus = () => {
    const navigate = useNavigate();
    const [selectedStep, setSelectedStep] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const enrollmentSteps = [
        {
            title: "Choose Program",
            desc: "Select from our specialized industrial engineering tracks.",
            image: "/images/roadmap/choose_program.png",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            details: "Explore a curated list of industrial programs. Our curriculum is co-designed with engineering leads to ensure every module translates to production-grade skills.",
            highlights: ["Industrial Curriculum", "Market Alignment", "Expert Guidance"]
        },
        {
            title: "Secure Seat",
            desc: "Register with a minimal deposit to lock your batch timing.",
            image: "/images/roadmap/secure_seat.png",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            details: "Lock your spot in the upcoming batch. The security deposit ensures your seat and grants immediate access to pre-program foundational tracks.",
            highlights: ["Immediate Portal Access", "Pre-program Content", "Batch Protection"]
        },
        {
            title: "Industrial Kickoff",
            desc: "Gain instant portal access and join your live cohort.",
            image: "/images/roadmap/industrial_kickoff.png",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            details: "Join the live cohort and begin your 7-day high-octane bootcamp. Gain access to cloud labs, peer communities, and real-time mentor support.",
            highlights: ["Live Cohort Access", "Cloud Lab Setup", "Mentor Onboarding"]
        }
    ];

    const iconMap = {
        Cpu: Cpu,
        Code: Code,
        Terminal: Terminal,
        Shield: ShieldCheck
    };

    return (
        <section id="online-focus" className="relative pt-8 pb-10 bg-[#FFF9FA] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-5xl font-black tracking-tighter uppercase leading-none"
                    >
                        <span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span> <span className="text-[#2563EB]">Premium</span> Batches.
                    </motion.h2>
                </div>

                {/* Featured Programs Grid */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-12">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Featured Programs</h3>
                        <div className="flex-1 h-px bg-white/10" />
                        <button
                            onClick={() => navigate('/online-program')}
                            className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                        >
                            View All →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FALLBACK_COURSES.length > 0 ? (
                            FALLBACK_COURSES.map((course, idx) => {
                                const Icon = iconMap[course.icon] || Code;
                                return (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ y: -5 }}
                                        className="p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-blue-500/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        onClick={() => setSelectedCourse(course)}
                                    >
                                        <div className="w-full h-32 rounded-xl overflow-hidden mb-6 border border-slate-50 shadow-sm group-hover:shadow-md transition-shadow">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">{course.title}</h4>

                                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                                            {course.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {course.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-tighter border border-white/5">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 bg-white border border-dashed border-blue-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                <Rocket size={40} className="text-blue-500/20 mb-4" />
                                <h4 className="text-lg font-black text-slate-400 uppercase tracking-tighter">New Batches Launching Soon</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Secure your early access. Architecting the future of engineering.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enrollment Roadmap */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {enrollmentSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-500/20 transition-all group overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
                            onClick={() => setSelectedStep(step)}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${step.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <div className="relative z-10">
                                <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 border border-slate-100 shadow-inner group-hover:border-blue-500/30 transition-colors">
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">0{idx + 1}. {step.title}</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Final Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-1 rounded-[2.5rem] bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-white/10"
                >
                    <div className="p-8 md:p-10 rounded-[2.4rem] bg-slate-950/05 border border-blue-500/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                                Ready to scale your <br />
                                <span className="text-blue-600">Production</span> skills?
                            </h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                Limited capacity batches. Secure your industrial seat today.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/online-program')}
                            className="relative z-10 px-8 py-4 rounded-[1.5rem] bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3"
                        >
                            Apply for Enrollment <ArrowRight size={18} />
                        </button>

                        {/* Background SVG grid decoration */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="grid-cta" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#grid-cta)" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Step Modal */}
            <AnimatePresence>
                {selectedStep && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/40 backdrop-blur-md"
                    >
                        <div
                            className="min-h-full flex items-center justify-center p-4"
                            onClick={() => setSelectedStep(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl border border-white/20 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedStep(null)}
                                    className="absolute top-6 right-6 p-2 bg-slate-950/05 hover:bg-slate-950/10 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-slate-900" />
                                </button>
                                <div className="p-8 md:p-12">
                                    <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-8 border border-slate-100 shadow-2xl relative">
                                        <img
                                            src={selectedStep.image}
                                            alt={selectedStep.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute top-6 left-6 w-12 h-12 rounded-xl ${selectedStep.bg} flex items-center justify-center ${selectedStep.color} backdrop-blur-md border border-white/20 shadow-xl`}>
                                            <span className="text-lg font-black italic">0{enrollmentSteps.indexOf(selectedStep) + 1}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">{selectedStep.title}</h3>
                                    <p className="text-slate-500 font-bold text-sm tracking-tight leading-relaxed mb-8">
                                        {selectedStep.details}
                                    </p>
                                    <div className="space-y-3">
                                        {selectedStep.highlights.map((h, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => navigate('/online-program')}
                                        className="w-full mt-10 p-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                                    >
                                        Proceed to Catalog
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Course Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/40 backdrop-blur-md"
                    >
                        <div
                            className="min-h-full flex items-center justify-center p-4"
                            onClick={() => setSelectedCourse(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-white/20 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="absolute top-6 right-6 p-2 bg-slate-950/05 hover:bg-slate-950/10 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-slate-900" />
                                </button>

                                <div className="p-8 md:p-12">
                                    <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-8 border border-slate-100 shadow-2xl relative">
                                        <img
                                            src={selectedCourse.image}
                                            alt={selectedCourse.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-blue-950/20 flex items-center justify-center text-blue-500 backdrop-blur-md border border-white/20 shadow-xl">
                                            {React.createElement(iconMap[selectedCourse.icon] || Target, { size: 24 })}
                                        </div>
                                    </div>
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{selectedCourse.duration} Program</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedCourse.title}</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Program Brief</h4>
                                                <p className="text-slate-600 font-bold text-sm tracking-tight leading-relaxed">
                                                    {selectedCourse.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCourse.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest border border-slate-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">What's Inside</h4>
                                            <div className="space-y-3">
                                                {[
                                                    "7-Day Kickoff Bootcamp",
                                                    "Production-Ready Labs",
                                                    "Industrial Peer Learning",
                                                    "Architect Portfolio Design"
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                                        <Layers size={14} className="text-blue-500" />
                                                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="text-[16px] font-black uppercase tracking-tighter">
                                            <span className="text-[#2563EB]">think</span>
                                            <span className="text-[#F97316]">skool</span> // CAT
                                        </div>
                                        <button
                                            onClick={() => navigate('/online-program')}
                                            className="group flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                                        >
                                            Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default OnlineCourseFocus;
