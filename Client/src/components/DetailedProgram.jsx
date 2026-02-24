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
        <section id="programs" className="relative bg-[#0A0F1E] py-32 overflow-hidden border-t border-white/5">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <SectionHeader
                    subtitle="Advanced Learning Framework"
                    title={<span>Specialized <span className="text-[#2563EB]">Engineering</span> Programs</span>}
                    description="Architecting professional competence through immersive technical mastery and expert-led innovation labs."
                />

                {/* Cards Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-[3px] border-white/5 border-t-[#2563EB] rounded-full animate-spin"></div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#2563EB]">Loading Ecosystem...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -12, scale: 1.02 }}
                                onClick={() => setSelectedCourse(course)}
                                className="group relative bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

                                <div className="relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300`}>
                                        {getIcon(course.icon, "w-8 h-8")}
                                    </div>

                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={i < Math.floor(course.rating) ? "text-[#2563EB] fill-[#2563EB]" : "text-slate-700"} />
                                        ))}
                                        <span className="text-[10px] font-black text-slate-500 ml-1 font-['Outfit']">{course.rating}</span>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight font-['Outfit'] uppercase group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="text-slate-500 text-xs mb-8 line-clamp-2 leading-relaxed font-medium font-['Outfit']">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 font-['Outfit']">
                                            <Clock size={12} className="text-[#2563EB]" /> {course.duration}
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-[#2563EB] border border-white/10 transition-all duration-300">
                                            <ArrowRight size={16} />
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
                                            <h2 className="text-4xl font-black text-white mb-6 tracking-tighter font-['Outfit'] uppercase leading-none">{selectedCourse.title}</h2>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 font-['Outfit']">
                                                {selectedCourse.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCourse.tags?.map((tag, i) => (
                                                    <span key={i} className="px-4 py-1.5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#2563EB] rounded-xl border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/student/signup')}
                                            className="w-full mt-12 bg-[#2563EB] hover:bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.25em] py-6 rounded-2xl transition-all shadow-2xl shadow-blue-500/20 font-['Outfit']"
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
                                            <h3 className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.4em] mb-10 font-['Outfit']">Program Details</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-5 p-6 bg-white/2 rounded-3xl border border-white/5 group hover:border-[#2563EB]/20 transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 shadow-2xl flex items-center justify-center text-[#2563EB] border border-white/10">
                                                        <Star size={24} fill="currentColor" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white text-base mb-1 font-['Outfit'] uppercase">Campus Bootcamp</h4>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed font-['Outfit']">
                                                            {selectedCourse.deliveryDetails?.inSchool?.bootcamp || "Intensive 7-day technical bootcamp at campus."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-5 p-6 bg-white/2 rounded-3xl border border-white/5 group hover:border-[#2563EB]/20 transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 shadow-2xl flex items-center justify-center text-[#2563EB] border border-white/10">
                                                        <Globe size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white text-base mb-1 font-['Outfit'] uppercase">Global Support Network</h4>
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-['Outfit']">1:1 Tutoring</div>
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-['Outfit']">24/7 Support</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-white/5">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 font-['Outfit']">
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
                        className="px-16 py-6 rounded-2xl bg-[#2563EB] text-white font-black uppercase text-[12px] tracking-[0.3em] hover:bg-blue-600 shadow-2xl shadow-blue-500/20 transition-all active:scale-95 font-['Outfit'] hover:-translate-y-1"
                    >
                        Explore Programs
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DetailedProgram;
