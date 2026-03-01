import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Code, Terminal, ShieldCheck, Globe, Video, MessageSquare, Rocket, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_COURSES } from '../constants/siteData';

const OnlineCourseFocus = () => {
    const navigate = useNavigate();

    const enrollmentSteps = [
        {
            title: "Choose Program",
            desc: "Select from our specialized industrial engineering tracks.",
            icon: Globe,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Secure Seat",
            desc: "Register with a minimal deposit to lock your batch timing.",
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Industrial Kickoff",
            desc: "Gain instant portal access and join your live cohort.",
            icon: Rocket,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    const iconMap = {
        Cpu: Cpu,
        Code: Code,
        Terminal: Terminal,
        Shield: ShieldCheck
    };

    return (
        <section id="online-focus" className="relative py-10 bg-[#FFF9FA] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Main Focus: Online Batches</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none"
                    >
                        Elite Online <span className="text-blue-600">Engineering</span> Batches.
                    </motion.h2>
                </div>

                {/* Enrollment Roadmap */}
                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    {enrollmentSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-500/20 transition-all group overflow-hidden shadow-sm hover:shadow-md"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${step.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${step.bg} border border-white/5 flex items-center justify-center ${step.color} mb-6 shadow-xl`}>
                                    <step.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">0{idx + 1}. {step.title}</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Programs Grid */}
                <div className="mb-24">
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
                        {FALLBACK_COURSES.map((course, idx) => {
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
                                    onClick={() => navigate('/online-program')}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                                        <Icon size={16} />
                                    </div>
                                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">{course.title}</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-yellow-500">
                                            <CheckCircle2 size={10} className="text-blue-500" />
                                        </div>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{course.duration} Program</span>
                                    </div>
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
                        })}
                    </div>
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
        </section>
    );
};

export default OnlineCourseFocus;
