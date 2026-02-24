import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn, FaBuilding, FaGlobe, FaGoogle, FaAmazon, FaMicrosoft } from 'react-icons/fa';
import { Headphones, MessageSquare, PlayCircle, Star, Award, Briefcase } from 'lucide-react';
import api from '../api/axios';

// Import Slideshow Images
import slide1 from '../assets/images/slide1.png';
import slide2 from '../assets/images/slide2.png';
import slide3 from '../assets/images/slide3.png';

const slides = [
    { src: slide1, type: "Live Session" },
    { src: slide2, type: "Collaborative Lab" },
    { src: slide3, type: "Project Demo" }
];

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ x: 6 }}
        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-[#FBEFEF] hover:border-[#2563EB]/20 hover:shadow-sm transition-all group"
    >
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] border border-blue-100 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
            <Icon size={18} />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{title}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{desc}</span>
        </div>
    </motion.div>
);

const Faculty = () => {
    const [mentors, setMentors] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await api.get('/mentors');
                if (Array.isArray(res.data)) {
                    setMentors(res.data);
                } else {
                    console.error("Mentors data is not an array:", res.data);
                    setMentors([]);
                }
            } catch (err) {
                console.error("Failed to fetch mentors", err);
            }
        };

        fetchMentors();
    }, []);

    return (
        <section className="bg-[#FCF8F8] py-16 border-t border-[#FBEFEF] relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <p className="text-[#2563EB] font-bold uppercase tracking-[0.4em] text-[9px] mb-3">Distinguished Faculty</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                        Industry Visionaries &amp; <span className="text-[#2563EB]">Engineering</span> Leaders
                    </h2>
                    <p className="text-xs font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Our mentorship ecosystem is powered by veterans from the world's most innovative technology conglomerates.
                    </p>
                </div>

                {/* Feature Showcase Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-[#FBEFEF] relative overflow-hidden"
                >
                    <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
                        {/* Slideshow Side */}
                        <div className="w-full lg:w-1/2 aspect-video rounded-[1.5rem] overflow-hidden shadow-md border border-[#FBEFEF] relative bg-slate-100">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSlide}
                                    src={slides[currentSlide].src}
                                    alt="Gallery"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="w-full h-full object-cover absolute inset-0 opacity-60"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-100 to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FBEFEF]">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={currentSlide}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]"
                                    >
                                        {slides[currentSlide].type}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Features Side */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FeatureItem icon={Headphones} title="1:1 Support" desc="Instant Mentor Access" />
                                <FeatureItem icon={MessageSquare} title="Post-Class Chat" desc="24/7 Doubt Clearance" />
                                <FeatureItem icon={PlayCircle} title="Live Classes" desc="Interactive Coding" />
                                <FeatureItem icon={Star} title="Expert sessions" desc="Industry Insights" />
                                <FeatureItem icon={Award} title="Certifications" desc="Global Recognition" />
                                <FeatureItem icon={Briefcase} title="Hands-On Projects" desc="Production Systems" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 max-w-[85%] mx-auto">
                    {mentors.map((mentor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="bg-white rounded-[1.2rem] overflow-hidden border border-[#FBEFEF] shadow-sm group cursor-pointer hover:border-[#2563EB]/20 hover:shadow-md transition-all duration-300 w-full"
                        >
                            <div className="relative h-44 overflow-hidden bg-slate-950">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    onError={(e) => { e.target.src = `https://i.pravatar.cc/150?u=${index}` }}
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                                    <div className="flex items-center gap-1.5 text-[#2563EB]">
                                        <FaBuilding size={10} />
                                        <span className="text-[7px] font-bold uppercase tracking-widest">{mentor.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-sm font-extrabold text-slate-900 mb-0.5 uppercase tracking-tight truncate">{mentor.name}</h3>
                                <p className="text-[#2563EB] font-bold text-[7px] mb-3 uppercase tracking-[0.2em] truncate">{mentor.role}</p>
                                <p className="text-slate-500 text-[8px] mb-4 leading-relaxed font-medium line-clamp-2">
                                    {mentor.bio}
                                </p>

                                <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                                    <button className="text-slate-400 hover:text-[#2563EB] transition-colors">
                                        <FaLinkedinIn size={14} />
                                    </button>
                                    <button className="text-[7px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all uppercase tracking-widest border border-slate-100">
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faculty;

