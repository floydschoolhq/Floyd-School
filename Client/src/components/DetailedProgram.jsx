import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldCheck, Cpu, Globe, Star, Clock, ArrowRight, Code, Terminal, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SectionHeader from './common/SectionHeader';
import { FALLBACK_COURSES } from '../constants/siteData';

const IconMap = {
    'Brain': Brain,
    'Globe': Globe,
    'Shield': ShieldCheck,
    'Cpu': Cpu,
    'Code': Code,
    'Terminal': Terminal
};

const DetailedProgram = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                let data = Array.isArray(res.data) ? res.data : res.data.data || [];

                if (data.length === 0) {
                    data = FALLBACK_COURSES;
                }

                const formattedCourses = data.map(c => ({
                    ...c,
                    Icon: IconMap[c.icon] || Code
                }));
                setCourses(formattedCourses);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch courses, using fallbacks", err);
                setCourses(FALLBACK_COURSES.map(c => ({ ...c, Icon: IconMap[c.icon] || Code })));
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const getIcon = (iconName, colorClass) => {
        const IconComponent = IconMap[iconName] || Code;
        return <IconComponent size={24} className={colorClass} />;
    };

    return (
        <section id="programs" className="relative bg-[#020617] py-24 overflow-hidden border-t border-white/5 cyber-mesh">
            {/* Energy Field Backgrounds */}
            <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none animate-float-orb"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-float-orb" style={{ animationDelay: '-5s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                    >
                        <Brain size={10} className="text-[#2563EB] animate-pulse" />
                        <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.4em]">Advanced Learning Framework</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-6"
                    >
                        Specialized <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-blue-400 to-indigo-500">Engineering</span> Programs
                    </motion.h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[8.5px] max-w-xl mx-auto leading-relaxed">
                        Architecting professional competence through immersive technical mastery and expert-led innovation labs.
                    </p>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-6 h-6 border-[2.5px] border-white/5 border-t-[#2563EB] rounded-full animate-spin"></div>
                        <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-[#2563EB]">Loading Ecosystem...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id || index}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                whileHover={{ y: -8 }}
                                onClick={() => setSelectedCourse(course)}
                                className="group relative bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden hover:border-[#2563EB]/40 hover:bg-white/[0.05]"
                            >
                                {/* Intensity Glow Filter */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />

                                {/* Glass Shine Sweep */}
                                <div className="glass-shine-effect" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#2563EB] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-500 shadow-2xl`}>
                                        {getIcon(course.icon, "w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors")}
                                    </div>

                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={9} className={i < Math.floor(course.rating) ? "text-[#2563EB] fill-[#2563EB]" : "text-slate-800"} />
                                        ))}
                                        <span className="text-[9px] font-black text-slate-500 ml-1 tracking-widest">{course.rating}</span>
                                    </div>

                                    <h3 className="text-[18px] font-black text-white mb-4 tracking-tight uppercase leading-none group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-8 line-clamp-3 leading-relaxed">
                                        {course.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                                        <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                                            <Clock size={10} className="text-[#2563EB]" /> {course.duration}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-[#2563EB] border border-white/10 group-hover:border-transparent transition-all duration-500 shadow-xl group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Modal Audit */}
                <AnimatePresence>
                    {selectedCourse && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                            onClick={() => setSelectedCourse(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-slate-950 rounded-[4rem] w-full max-w-4xl overflow-hidden relative shadow-2xl border border-white/10"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex flex-col md:flex-row min-h-[500px]">
                                    {/* Left Panel */}
                                    <div className="md:w-[45%] bg-white/2 p-12 border-r border-white/5 flex flex-col justify-between">
                                        <div>
                                            <div className="w-24 h-24 rounded-3xl bg-slate-950 shadow-2xl flex items-center justify-center mb-10 border border-white/10">
                                                {getIcon(selectedCourse.icon, `text-4xl text-[#2563EB]`)}
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tighter uppercase leading-none">{selectedCourse.title}</h2>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                                                {selectedCourse.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCourse.tags?.map((tag, i) => (
                                                    <span key={i} className="px-4 py-1.5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[#2563EB] rounded-xl border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/student/signup')}
                                            className="w-full mt-12 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-[12px] uppercase tracking-[0.25em] py-6 rounded-2xl transition-all shadow-2xl shadow-blue-500/20"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>

                                    {/* Right Panel */}
                                    <div className="md:w-[55%] p-12 relative">
                                        <button
                                            onClick={() => setSelectedCourse(null)}
                                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
                                        >
                                            ✕
                                        </button>

                                        <div className="mb-12">
                                            <h3 className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.4em] mb-10">Program Details</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-5 p-6 bg-white/2 rounded-3xl border border-white/5 group hover:border-[#2563EB]/20 transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 shadow-2xl flex items-center justify-center text-[#2563EB] border border-white/10">
                                                        <Star size={24} fill="currentColor" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-base mb-1 uppercase">Campus Bootcamp</h4>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                            {selectedCourse.deliveryDetails?.inSchool?.bootcamp || "Intensive 7-day technical bootcamp at campus."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-5 p-6 bg-white/2 rounded-3xl border border-white/5 group hover:border-[#2563EB]/20 transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 shadow-2xl flex items-center justify-center text-[#2563EB] border border-white/10">
                                                        <Globe size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-base mb-1 uppercase">Global Support Network</h4>
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1:1 Tutoring</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">24/7 Support</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-white/5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                                <ShieldCheck size={16} className="text-blue-400" /> Professional Certification Achievement
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* More Programs Button */}
                <div className="text-center mt-24">
                    <button
                        onClick={() => navigate('/course')}
                        className="px-16 py-6 rounded-2xl bg-[#2563EB] text-white font-extrabold uppercase text-[12px] tracking-[0.3em] hover:bg-blue-600 shadow-2xl shadow-blue-500/20 transition-all active:scale-95 hover:-translate-y-1"
                    >
                        Explore Programs
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DetailedProgram;

