import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import abhayImg from '../assets/tutors/abhay.jpg';
import ananimikaImg from '../assets/tutors/anamika.jpg';


const LEADERS = [
    {
        name: "Shivam Mishra",
        role: "Founder | AI/ML Engineer",
        image: shivamImg,
        imageScale: 1.9,
        bio: "Visionary founder of ThinkSkool, architecting the future of STEM education through advanced AI and machine learning integration.",
        linkedin: "https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in",
        tags: ["AI/ML", "Founder", "Visionary"]
    },
    {
        name: "Raghav",
        role: "Lead Mentor & Product Architect",
        image: raghavImg,
        imageScale: 1.9,
        bio: "Leading industrial engineering programs with a focus on production-scale systems and AI architecture.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["Lead Mentor", "Architect", "Eng"]
    },
    {
        name: "Abhay Singh Chauhan",
        role: "Management & Web Development",
        image: abhayImg,
        imageScale: 1.9,
        bio: "Full-stack enthusiast focused on building premium web experiences and scalable frontend architectures.",
        linkedin: "https://www.linkedin.com/in/abhay-singh-chauhan-485706310",
        tags: ["Web Dev", "Manager", "Full Stack"]
    },
    {
        name: "Anamika Vashisth",
        role: "UI/UX & System Designer",
        image: ananimikaImg,
        imageScale: 1.15,
        bio: "Specializing in UI/UX coordination and system design to ensure seamless and intuitive user experiences.",
        linkedin: "#",
        tags: ["UI/UX", "Design", "Product"]
    }
];

const AUTO_SLIDE_INTERVAL = 3500; // ms between auto-slides

const MentorGrid = () => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const scrollContainerRef = useRef(null);
    const autoSlideRef = useRef(null);
    const isManualRef = useRef(false);

    const getCardWidth = useCallback(() => {
        if (!scrollContainerRef.current) return 0;
        const card = scrollContainerRef.current.querySelector('.snap-center');
        return card ? card.offsetWidth + 24 : 0; // 24 = gap-6
    }, []);

    const doAutoSlide = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const cardWidth = getCardWidth();
        const maxScroll = el.scrollWidth - el.clientWidth;
        const next = el.scrollLeft + cardWidth >= maxScroll - 4
            ? 0
            : el.scrollLeft + cardWidth;
        el.scrollTo({ left: next, behavior: 'smooth' });
    }, [getCardWidth]);

    const startAutoSlide = useCallback(() => {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(doAutoSlide, AUTO_SLIDE_INTERVAL);
    }, [doAutoSlide]);

    const stopAutoSlide = useCallback(() => {
        clearInterval(autoSlideRef.current);
    }, []);

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, [startAutoSlide, stopAutoSlide]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            isManualRef.current = true;
            stopAutoSlide(); // Stop auto-slide permanently on manual interaction
            const cardWidth = getCardWidth();
            const { scrollLeft } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="mentors-grid" className="bg-white py-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <ScrollDarkenHeading>
                        Mentors
                    </ScrollDarkenHeading>
                </div>

                <div className="relative group/slider">
                    {/* Navigation Buttons (Outside Container) */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-20 z-20 pointer-events-none">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-800 hover:border-slate-200 shadow-xl transition-all scale-90 hover:scale-110 active:scale-95 pointer-events-auto"
                        >
                            <ChevronLeft size={28} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-20 z-20 pointer-events-none">
                        <button 
                            onClick={() => scroll('right')}
                            className="p-5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-800 hover:border-slate-200 shadow-xl transition-all scale-90 hover:scale-110 active:scale-95 pointer-events-auto"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* Scrollable Container */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-8 px-4 -mx-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {LEADERS.map((mentor, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedMentor(mentor)}
                                whileHover={{ y: -6 }}
                                className="snap-center flex-shrink-0 w-[450px] md:w-[550px] aspect-video bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group cursor-pointer hover:shadow-[0_28px_48px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-shadow duration-500 flex items-center p-8 gap-8"
                            >
                                {/* Circular Image Section (Left) */}
                                <div className="w-[30%] aspect-square flex-shrink-0 relative">
                                    {/* Outer ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-slate-100 group-hover:border-slate-200 transition-colors" />
                                    {/* Image fills the circle fully */}
                                    <div className="absolute inset-[6px] rounded-full overflow-hidden">
                                        <img
                                            src={mentor.image}
                                            alt={mentor.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-700"
                                            style={{ scale: mentor.imageScale }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-all shadow-sm z-10">
                                        <FaLinkedinIn size={14} />
                                    </div>
                                </div>

                                {/* Content Section (Right) */}
                                <div className="flex-grow flex flex-col justify-center min-w-0">
                                    <div className="mb-5">
                                        <h3 className="text-[26px] font-black text-slate-800 mb-1 tracking-tight uppercase truncate">
                                            {mentor.name}
                                        </h3>
                                        <p className="text-slate-500 font-bold text-[14px] tracking-[0.2em] uppercase opacity-80 truncate mb-4">
                                            {mentor.role}
                                        </p>
                                        <div className="w-16 h-[2px] bg-slate-100 group-hover:bg-blue-600/30 transition-colors rounded-full" />
                                    </div>

                                    <p className="text-slate-500 text-[16px] leading-relaxed mb-6 line-clamp-2 font-medium">
                                        {mentor.bio}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {mentor.tags.slice(0, 2).map(tag => (
                                            <div key={tag} className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                {tag}
                                            </div>
                                        ))}
                                        <span className="text-[11px] font-black text-slate-300 ml-auto uppercase tracking-[0.15em] pt-1.5">
                                            Profile →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                        onClick={() => setSelectedMentor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden relative shadow-2xl border border-white/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-[42%] aspect-square md:h-auto max-h-[500px] relative overflow-hidden">
                                    <img
                                        src={selectedMentor.image}
                                        alt={selectedMentor.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                                </div>

                                <div className="md:w-[58%] p-12 lg:p-20 relative bg-white flex flex-col justify-center">
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className="absolute top-10 right-10 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100 group"
                                    >
                                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>

                                    <div className="max-w-md">
                                        <span className="text-blue-600 font-black text-[10px] tracking-[0.3em] uppercase mb-4 block">ThinkSkool // Mentor</span>
                                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none mb-4 uppercase">{selectedMentor.name}</h2>
                                        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-8 opacity-60">{selectedMentor.role}</p>
                                        
                                        <p className="text-slate-400 font-medium tracking-tight text-lg leading-relaxed mb-10 pl-6 border-l-2 border-slate-100">
                                            {selectedMentor.bio}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-12">
                                            {selectedMentor.tags.map(tag => (
                                                <span key={tag} className="px-4 py-2 bg-slate-50 rounded-xl text-[12px] font-bold text-slate-500 tracking-tight border border-slate-100">
                                                    #{tag.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a
                                                href={selectedMentor.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-black transition-all"
                                            >
                                                <FaLinkedinIn size={14} /> Profile
                                            </a>
                                            <button
                                                onClick={() => setSelectedMentor(null)}
                                                className="flex-1 flex items-center justify-center bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-all"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MentorGrid;
