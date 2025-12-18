import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Cpu, Globe, Star, Clock, ArrowRight, Code, Terminal, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses');
                // Ensure we have icons by defaulting if missing
                const formattedCourses = res.data.map(c => ({
                    ...c,
                    Icon: IconMap[c.icon] || Code
                }));
                setCourses(formattedCourses);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-24 relative" id="programs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Upskill Yourself</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Explore Our <span className="text-orange-500">Top Rated</span> Courses
                    </h2>
                    <p className="text-base text-slate-500 max-w-2xl mx-auto">
                        Industry relevant curriculum designed by experts from MAANG. Start your journey today.
                    </p>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No courses available at the moment.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15
                                }}
                                whileHover={{
                                    y: -12,
                                    scale: 1.02,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                }}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl border border-slate-200 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-xl ${course.color.replace('text', 'bg')}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <course.Icon className={`text-3xl ${course.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                                        <Star className="text-orange-400 w-4 h-4 fill-current" />
                                        <span className="text-slate-700 font-bold text-sm">{course.rating}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {course.duration}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {course.tags && course.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full border border-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                    <div>
                                        <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-full">
                                            Admissions Open
                                        </span>
                                    </div>
                                    <button className="text-orange-500 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-16 mb-24">
                    <button
                        onClick={() => navigate('/course')}
                        className="px-8 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:border-orange-500 hover:text-orange-500 transition-all">
                        View All Courses
                    </button>
                </div>

                {/* Career Support Suite */}
                <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">
                            More than just <span className="text-orange-500">Courses</span>
                        </h2>
                        <p className="text-slate-500 text-sm max-w-xl mx-auto">
                            We support your journey from learning to earning with our dedicated placement cell.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connector Line (Desktop only) */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 z-0"></div>

                        {[
                            { title: "Resume Building", icon: "📄", desc: "Expert review to make your CV stand out." },
                            { title: "Mock Interviews", icon: "🎙️", desc: "Practice with engineers from Amazon & Google." },
                            { title: "Referral Network", icon: "🤝", desc: "Direct access to jobs in our 450+ hiring partners." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, type: "spring", stiffness: 200 }}
                                whileHover={{ y: -8, scale: 1.05 }}
                                className="relative z-10 bg-white p-6 rounded-2xl text-center group transition-all"
                            >
                                <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:bg-orange-50 transition-colors shadow-sm border border-slate-100 group-hover:shadow-md">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm whitespace-pre-wrap">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailedProgram;