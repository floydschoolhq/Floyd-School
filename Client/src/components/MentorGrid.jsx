import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import abhayImg from '../assets/tutors/abhay.jpg';
import ananimikaImg from '../assets/tutors/anamika.jpg';

import useIsMobile from '../hooks/useIsMobile';

const LEADERS = [
    {
        name: "Shivam Mishra",
        role: "Founder | AI/ML Engineer",
        image: shivamImg,
        imageScale: 1.9,
        bio: "visionary founder of thinkskool, architecting the future of STEM education through advanced AI and machine learning integration.",
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

const MentorCard = React.memo(({ mentor, index, onSelect, variant, isHovered, onMouseEnter, onMouseLeave }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    return (
        <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={isMobile ? { duration: 0 } : { delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!isMobile ? { y: -10, scale: 1.01 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mentor)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className={`snap-center flex-shrink-0 w-[85vw] md:w-[600px] h-[450px] md:h-[320px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border transition-all duration-700 flex flex-col md:flex-row items-center p-8 md:p-10 gap-8 md:gap-10 relative cursor-pointer group
                ${isDark 
                    ? 'bg-white/[0.02] backdrop-blur-md border-white/5 hover:bg-orange-500/10 hover:border-orange-500/40 shadow-[0_0_40px_rgba(251,146,60,0.15)]' 
                    : 'bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(251,146,60,0.25)] hover:border-orange-500/30 bg-gradient-to-br from-white to-orange-50/30'}`}
        >
            {/* Background Decorative Mesh */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none transition-all duration-700
                ${isDark ? 'bg-orange-500/10 group-hover:bg-orange-500/30 scale-100 group-hover:scale-150' : 'bg-orange-100/40 group-hover:bg-orange-200/60 scale-100 group-hover:scale-150'}`} />
            
            {/* Image Section: High-End Industrial Housing */}
            <div className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0 relative">
                {/* Rotating Border Aura */}
                <motion.div 
                    animate={isMobile ? {} : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    style={{ translateZ: 0 }}
                    className={`absolute inset-[-15px] rounded-full border border-dashed opacity-0 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none
                        ${isDark ? 'border-orange-400' : 'border-orange-500'}`}
                />
                
                {/* Main Profile Housing */}
                <div className={`absolute inset-0 rounded-full p-[3px] border transition-all duration-700 z-10 
                    ${isDark ? 'bg-white/5 border-white/10 group-hover:border-orange-400/60' : 'bg-white border-slate-100 group-hover:border-orange-400/60'}`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                         <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105"
                            style={{ transform: `scale(${mentor.imageScale})` }}
                        />
                        {/* Glass Overlay on Image */}
                        <div className={`absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity duration-700
                            ${isDark ? 'bg-gradient-to-tr from-orange-950/30 to-transparent' : 'bg-gradient-to-tr from-orange-900/20 via-transparent'}`} />
                    </div>
                </div>

                {/* Integrated LinkedIn Tag */}
                <a 
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 z-20 border-2 group/linkedin
                        ${isDark ? 'bg-white/10 backdrop-blur-xl border-white/10 hover:bg-orange-500 hover:border-orange-400' : 'bg-slate-900 border-white hover:bg-orange-500'}`}
                >
                    <FaLinkedinIn size={14} className="group-hover/linkedin:scale-110 transition-transform" />
                </a>
            </div>

            {/* Content Core: Pure Data Hierarchy */}
            <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left min-w-0 relative z-10 w-full">
                <div className="space-y-1 mb-4 md:mb-6 flex flex-col items-center md:items-start">
                    <h3 className={`text-xl md:text-3xl font-bold tracking-tight uppercase leading-none transition-colors w-full pl-1
                        ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}`}>
                        {mentor.name}
                    </h3>
                    <p className={`font-semibold text-[11px] md:text-[13px] tracking-wide uppercase truncate pb-4
                        ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mentor.role}
                    </p>
                    <div className={`w-12 h-1 transition-all duration-500 rounded-full
                        ${isDark ? 'bg-white/10 group-hover:w-24 group-hover:bg-orange-400' : 'bg-slate-100 group-hover:w-24 group-hover:bg-orange-500'}`} />
                </div>

                <p className={`text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 line-clamp-2 font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mentor.bio}
                </p>

                {/* Interaction Footer */}
                <div className="flex items-center justify-between pt-2 w-full">
                    <div className="flex gap-4">
                        {mentor.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors
                                ${isDark ? 'text-slate-500 group-hover:text-orange-400' : 'text-slate-400 group-hover:text-orange-600'}`}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 group/btn">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors
                            ${isDark ? 'text-slate-500 group-hover/btn:text-white' : 'text-slate-400 group-hover/btn:text-slate-900'}`}>
                            Full Profile
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all transform group-hover/btn:translate-x-1
                            ${isDark ? 'bg-white/5 text-slate-500 group-hover/btn:bg-orange-400 group-hover/btn:text-white' : 'bg-slate-50 text-slate-400 group-hover/btn:bg-orange-500 group-hover/btn:text-white'}`}>
                             <ChevronRight size={14} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

const MentorGrid = ({ title = "Mentors", isStatic = false, excludeName = null, variant }) => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const scrollRef = useRef(null);
    const controls = useAnimation();
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';

    // Start animation on mount
    useEffect(() => {
        if (!isMobile) {
            controls.start({
                x: ["0%", "-50%"],
                transition: {
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear"
                }
            });
        }
    }, [isMobile, controls]);

    // Handle hover pause/resume
    useEffect(() => {
        if (!isMobile) {
            if (hoveredCard !== null) {
                // Pause animation
                controls.stop();
            } else {
                // Resume animation
                controls.start({
                    x: ["0%", "-50%"],
                    transition: {
                        duration: 35,
                        repeat: Infinity,
                        ease: "linear"
                    }
                });
            }
        }
    }, [hoveredCard, isMobile, controls]);

    const filteredLeaders = excludeName 
        ? LEADERS.filter(m => m.name !== excludeName)
        : LEADERS;

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = isMobile ? window.innerWidth * 0.85 : 640; // Card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section 
            id="mentors-grid" 
            className={`py-14 relative overflow-hidden transition-colors duration-500
                ${isDark ? 'bg-[#050505]' : 'bg-white'}`}
        >
            {/* Background Architecture */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-[0.015] ${isDark ? 'invert brightness-200' : ''}`} style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] -mr-96 -mt-96 transition-colors duration-700
                    ${isDark ? 'bg-orange-500/5' : 'bg-blue-50/50'}`} />
                <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] -ml-48 -mb-48 transition-colors duration-700
                    ${isDark ? 'bg-white/5' : 'bg-slate-50'}`} />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col items-center justify-center mt-16 mb-12 text-center sm:mt-20 md:mt-16">
                    <div className="w-full">
                        <div className="flex justify-center">
                            <ScrollDarkenHeading variant={variant}>
                                {title}
                            </ScrollDarkenHeading>
                        </div>
                    </div>
                </div>

                <div className="relative group/marquee">
                    {/* Continuous Auto-Scrolling Container */}
                    <div 
                        className="overflow-hidden py-10 -mx-4 px-4"
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none'
                        }}
                    >
                        {/* webkit-scrollbar hiding applied via a hacky style tag */}
                        <style>{`
                            #mentors-grid .overflow-x-auto::-webkit-scrollbar { display: none; }
                        `}</style>
                        <motion.div 
                            animate={controls}
                            initial={isMobile ? { x: 0 } : false}
                            className="flex items-center gap-8 w-max"
                        >
                            {[...filteredLeaders, ...filteredLeaders, ...filteredLeaders, ...filteredLeaders].map((mentor, index) => (
                                <MentorCard 
                                    key={index}
                                    mentor={mentor}
                                    index={index}
                                    onSelect={setSelectedMentor}
                                    variant={variant}
                                    isHovered={hoveredCard === index}
                                    onMouseEnter={() => !isMobile && setHoveredCard(index)}
                                    onMouseLeave={() => !isMobile && setHoveredCard(null)}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Industrial Progress Indicator */}
                    <div className="mt-8 flex items-center gap-6 max-w-sm mx-auto">
                        <div className={`h-[2px] flex-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                            <motion.div 
                                className={`h-full ${isDark ? 'bg-orange-500' : 'bg-orange-500'}`}
                                initial={{ width: "30%" }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Carousel Active</span>
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
                            style={{ willChange: 'transform, opacity' }}
                            className={`${isDark ? 'bg-[#0A0A0A]' : 'bg-white'} rounded-[40px] w-full max-w-5xl overflow-hidden relative shadow-2xl border ${isDark ? 'border-white/10' : 'border-white/20'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-[42%] aspect-square md:h-auto max-h-[500px] relative overflow-hidden">
                                    <img
                                        src={selectedMentor.image}
                                        alt={selectedMentor.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className={`absolute inset-0 z-10 ${isDark ? 'bg-gradient-to-t from-black via-transparent' : 'bg-gradient-to-t from-slate-950 via-transparent'} to-transparent`} />
                                </div>

                                <div className={`md:w-[58%] p-12 lg:p-20 relative flex flex-col justify-center ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className={`absolute top-10 right-10 w-12 h-12 rounded-full flex items-center justify-center transition-all border group
                                            ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900'}`}
                                    >
                                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>

                                    <div className="max-w-md">
                                        <span className={`font-bold text-[10px] tracking-[0.3em] lowercase mb-4 block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                                        <h2 className={`text-4xl font-bold tracking-tighter leading-none mb-4 uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedMentor.name}</h2>
                                        <p className={`font-bold text-sm tracking-widest uppercase mb-8 opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedMentor.role}</p>
                                        
                                        <p className={`font-medium text-lg leading-relaxed mb-10 pl-6 border-l-2 ${isDark ? 'text-slate-300 border-white/10' : 'text-slate-400 border-slate-100'}`}>
                                            {selectedMentor.bio}
                                        </p>

                                        <div className="flex flex-wrap gap-4 mb-12">
                                            {selectedMentor.tags.map(tag => (
                                                <span key={tag} className={`text-[13px] font-bold tracking-tight uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a
                                                href={selectedMentor.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl transition-all
                                                    ${isDark ? 'bg-orange-500 text-white hover:bg-white hover:text-orange-500' : 'bg-slate-900 text-white hover:bg-black'}`}
                                            >
                                                <FaLinkedinIn size={14} /> Profile
                                            </a>
                                            <button
                                                onClick={() => setSelectedMentor(null)}
                                                className={`flex-1 flex items-center justify-center py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all
                                                    ${isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
