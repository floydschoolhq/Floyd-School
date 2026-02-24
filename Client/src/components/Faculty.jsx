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
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{title}</span>
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
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[9px] mb-3 font-['Outfit']">Distinguished Faculty</p>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter font-['Outfit'] uppercase leading-none">
                        Industry Visionaries &amp; <span className="text-[#2563EB]">Engineering</span> Leaders
                    </h2>
                    <p className="text-xs font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed font-['Outfit']">
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
                                        className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]"
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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mentors.map((mentor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className="bg-white rounded-[2rem] overflow-hidden border border-[#FBEFEF] shadow-sm group cursor-pointer hover:border-[#2563EB]/20 hover:shadow-md transition-all duration-300"
                        >
                            <div className="relative h-72 overflow-hidden bg-slate-950">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    onError={(e) => { e.target.src = `https://i.pravatar.cc/300?u=${index}` }}
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                                    <div className="flex items-center gap-3 text-[#2563EB]">
                                        <FaBuilding size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{mentor.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-black text-white mb-2 font-['Outfit'] uppercase tracking-tight">{mentor.name}</h3>
                                <p className="text-[#2563EB] font-black text-[10px] mb-6 uppercase tracking-[0.3em] font-['Outfit']">{mentor.role}</p>
                                <p className="text-slate-500 text-xs mb-8 leading-relaxed font-medium">
                                    {mentor.bio}
                                </p>

                                <div className="flex justify-between items-center border-t border-white/5 pt-6">
                                    <button className="text-slate-600 hover:text-[#2563EB] transition-colors">
                                        <FaLinkedinIn size={20} />
                                    </button>
                                    <button className="text-[10px] font-black text-white bg-white/5 px-6 py-3 rounded-xl hover:bg-[#2563EB] transition-all uppercase tracking-widest border border-white/10 font-['Outfit']">
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
