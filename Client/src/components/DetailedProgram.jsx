import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldCheck, Cpu, Globe, Star, Clock, ArrowRight, Code, Terminal, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const IconMap = {
    'Brain': Brain,
    'Globe': Globe,
    'Shield': ShieldCheck,
    'Cpu': Cpu,
    'Code': Code,
    'Terminal': Terminal
};

const FALLBACK_COURSES = [
    {
        _id: '1',
        title: "AI & Machine Learning",
        icon: 'Cpu',
        description: "Explore the frontiers of neural networks, predictive modeling, and deep learning architectures with hands-on industrial projects.",
        color: "text-[#F5AFAF]",
        rating: 4.9,
        duration: "6 Months",
        tags: ["Neural Networks", "Python", "Deep Learning"],
        deliveryDetails: { inSchool: { bootcamp: "7-Day Technical Deep Dive" } }
    },
    {
        _id: '2',
        title: "Web & App Architecture",
        icon: 'Code',
        description: "Master full-stack engineering, from responsive UI frameworks to scalable cloud-native backend infrastructure.",
        color: "text-[#F5AFAF]",
        rating: 4.8,
        duration: "6 Months",
        tags: ["React", "Node.js", "Cloud"],
        deliveryDetails: { inSchool: { bootcamp: "UI/UX Masterclass" } }
    },
    {
        _id: '3',
        title: "IoT & Robotics",
        icon: 'Terminal',
        description: "Engineer autonomous systems, hardware-software integration, and real-time distributed sensor networks.",
        color: "text-[#F5AFAF]",
        rating: 4.7,
        duration: "4 Months",
        tags: ["Embedded Systems", "C++", "Sensors"],
        deliveryDetails: { inSchool: { bootcamp: "Hardware Hackathon" } }
    },
    {
        _id: '4',
        title: "Cybersecurity Ops",
        icon: 'Shield',
        description: "Analyze digital threats, implement zero-trust protocols, and master ethical hacking in a controlled lab environment.",
        color: "text-[#F5AFAF]",
        rating: 4.9,
        duration: "5 Months",
        tags: ["Ethical Hacking", "Networks", "Security"],
        deliveryDetails: { inSchool: { bootcamp: "Red Team Simulation" } }
    }
];

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
        <section id="programs" className="relative bg-white py-24 overflow-hidden font-['Inter']">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#F5AFAF]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#FBEFEF]/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#F5AFAF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']"
                    >
                        Elite Pedagogical Framework
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-black text-slate-900 mb-6 tracking-tight font-['Outfit']"
                    >
                        Specialized <span className="text-[#F5AFAF]">Engineering</span> Tracks
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 max-w-2xl mx-auto text-base font-medium leading-relaxed"
                    >
                        Architecting professional competence through immersive technical mastery and expert-led innovation labs.
                    </motion.p>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-[3px] border-slate-100 border-t-[#F5AFAF] rounded-full animate-spin"></div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 font-['Outfit']">Accessing Course Nodes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                onClick={() => setSelectedCourse(course)}
                                className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F5AFAF]/5 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-100`}>
                                        {getIcon(course.icon, course.color)}
                                    </div>

                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={i < Math.floor(course.rating) ? "text-[#F5AFAF] fill-[#F5AFAF]" : "text-slate-200"} />
                                        ))}
                                        <span className="text-[10px] font-black text-slate-400 ml-1 font-['Outfit']">{course.rating}</span>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight font-['Outfit'] group-hover:text-[#F5AFAF] transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 font-['Outfit']">
                                            <Clock size={12} className="text-[#F5AFAF]" /> {course.duration}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#F5AFAF] transition-all duration-300">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Modal Audit - Cleanup needed? Keep clean for now */}
                <AnimatePresence>
                    {selectedCourse && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => setSelectedCourse(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden relative shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex flex-col md:flex-row min-h-[500px]">
                                    {/* Left Panel */}
                                    <div className="md:w-[40%] bg-slate-50 p-12 border-r border-slate-100 flex flex-col justify-between">
                                        <div>
                                            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-8 border border-slate-100">
                                                {getIcon(selectedCourse.icon, `text-3xl ${selectedCourse.color}`)}
                                            </div>
                                            <h2 className="text-4xl font-black text-slate-900 mb-4 font-['Outfit'] tracking-tighter">{selectedCourse.title}</h2>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                                                {selectedCourse.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCourse.tags?.map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-lg border border-slate-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/student/signup')}
                                            className="w-full mt-10 bg-slate-900 hover:bg-[#F5AFAF] text-white font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl font-['Outfit']"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>

                                    {/* Right Panel */}
                                    <div className="md:w-[60%] p-12 relative">
                                        <button
                                            onClick={() => setSelectedCourse(null)}
                                            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                        >
                                            ✕
                                        </button>

                                        <div className="mb-10">
                                            <h3 className="text-[10px] font-black text-[#F5AFAF] uppercase tracking-[0.4em] mb-8 font-['Outfit']">Curriculum Specs</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#F5AFAF]/20 transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F5AFAF]">
                                                        <Star size={20} fill="currentColor" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 text-sm mb-1 font-['Outfit']">In-School Immersion</h4>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                            {selectedCourse.deliveryDetails?.inSchool?.bootcamp || "Intensive 7-day technical bootcamp at campus."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-5 bg-[#FCF8F8] rounded-2xl border border-[#FBEFEF] group hover:border-[#F5AFAF]/20 transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F5AFAF]">
                                                        <Globe size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 text-sm mb-1 font-['Outfit']">Global Support Network</h4>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                                                            <div className="text-[10px] font-black text-slate-400">1:1 Tutoring</div>
                                                            <div className="text-[10px] font-black text-slate-400">24/7 Support</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-['Outfit'] flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-emerald-500" /> Professional Certification Achievement
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* More Programs Button */}
                <div className="text-center mt-20">
                    <button
                        onClick={() => navigate('/course')}
                        className="px-12 py-5 rounded-full bg-slate-900 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#F5AFAF] shadow-2xl shadow-slate-900/20 transition-all active:scale-95 font-['Outfit']"
                    >
                        Explore Curriculum Nodes
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DetailedProgram;
