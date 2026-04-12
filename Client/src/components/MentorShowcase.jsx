import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, MessageSquare, PlayCircle, Star, Award, Briefcase } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import slide1 from '../assets/slideshow/slide1.jpg';
import slide2 from '../assets/slideshow/slide2.jpg';
import slide3 from '../assets/slideshow/slide3.jpg';
import slide4 from '../assets/slideshow/slide4.jpg';
import slide5 from '../assets/slideshow/slide5.jpg';
import slide6 from '../assets/slideshow/slide6.jpg';
import slide7 from '../assets/slideshow/slide7.jpg';
import slide8 from '../assets/slideshow/slide8.jpg';

const SLIDES = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ x: 6 }}
        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-500/20 hover:shadow-sm transition-all group"
    >
        <div className="shrink-0 relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon size={20} className="text-[#2563EB] drop-shadow-[0_0_6px_rgba(37,99,235,0.3)] relative z-10 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 tracking-tight">{title}</span>
            <span className="text-[13px] font-medium text-slate-400 tracking-tight mt-0.5">{desc}</span>
        </div>
    </motion.div>
);

const MentorShowcase = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="mentors-showcase" className="bg-white py-12 border-t border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <ScrollDarkenHeading>
                        Our Mentors
                    </ScrollDarkenHeading>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 bg-white rounded-2xl p-6 lg:p-8 shadow-2xl border border-slate-100 relative overflow-hidden shadow-blue-500/5 transition-all duration-700 hover:shadow-blue-500/10"
                >
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center relative z-10">
                        {/* Slideshow Side */}
                        <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative bg-slate-950 group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSlide}
                                    src={SLIDES[currentSlide]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-[3s]"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/20">
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                <span className="text-[14px] font-bold text-white tracking-tight">
                                    Our Industrial Ecosystem
                                </span>
                            </div>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-8 right-8 flex gap-2">
                                {SLIDES.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Features Side */}
                        <div className="w-full lg:w-1/2 space-y-6 text-left">
                            <div className="grid sm:grid-cols-2 gap-5">
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
            </div>
        </section>
    );
};

export default MentorShowcase;
