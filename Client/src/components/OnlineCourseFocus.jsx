import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Code, Terminal, ShieldCheck, Globe, Video, MessageSquare, Rocket, CheckCircle2, Zap, X, Check, Target, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_COURSES } from '../constants/siteData';

const OnlineCourseFocus = () => {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);

    const iconMap = {
        Cpu: Cpu,
        Code: Code,
        Terminal: Terminal,
        Shield: ShieldCheck
    };

    return (
        <section id="online-focus" className="relative pt-6 pb-8 bg-[#FFF9FA] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none opacity-50" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", damping: 15, stiffness: 60 }}
                        className="text-2xl md:text-4xl font-bold tracking-tight uppercase leading-none"
                    >
                        <span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span> <span className="text-[#2563EB]">Premium</span> Batches.
                    </motion.h2>
                </div>

                {/* Featured Programs Grid */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-12">
                        <h3 className="text-lg font-bold text-slate-700 uppercase tracking-[0.3em]">Featured Programs</h3>
                        <div className="flex-1 h-px bg-white/10" />
                        <button
                            onClick={() => navigate('/online-program')}
                            className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                        >
                            View All →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                        {FALLBACK_COURSES.length > 0 ? (
                            FALLBACK_COURSES.map((course, idx) => {
                                const Icon = iconMap[course.icon] || Code;
                                return (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100, y: 50, scale: 0.95 }}
                                        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.08, type: "spring", damping: 18 }}
                                        whileHover={{ y: -8 }}
                                        className="p-4 rounded-[1.8rem] bg-white border border-slate-100 hover:border-blue-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl group"
                                        onClick={() => setSelectedCourse(course)}
                                    >
                                        <div className="w-full h-52 rounded-[1.2rem] overflow-hidden mb-5 border border-slate-50 shadow-sm group-hover:shadow-md transition-shadow">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-3 leading-none group-hover:text-blue-600 transition-colors">{course.title}</h4>

                                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                                            {course.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {course.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-slate-50 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
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

            </div>

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
                                        <h3 className="text-3xl font-bold text-slate-800 uppercase tracking-tight leading-none">{selectedCourse.title}</h3>
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
                                            className="group flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
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
