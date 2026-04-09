import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import niteshImg from '../assets/tutors/nitesh.jpg';
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
        name: "Anamika Vashisth",
        role: "Growth Associate",
        image: ananimikaImg,
        imageScale: 1,
        imagePosition: "object-[center_15%]",
        bio: "Specializing in UI/UX coordination and system design to ensure seamless and intuitive user experiences.",
        linkedin: "#",
        tags: ["UI/UX", "Design", "Product"]
    },
    {
        name: "Nitesh Kumar",
        role: "UI and UX Management",
        image: niteshImg,
        imageScale: 1.0,
        imagePosition: "object-[center_20%]",
        bio: "Specializing in digital product management and UI/UX design leadership within multidisciplinary teams.",
        linkedin: "#",
        tags: ["UI/UX", "Management", "Leadership"]
    },
    {
        name: "Raghav",
        role: "Mentor",
        image: raghavImg,
        imageScale: 2.5,
        bio: "Leading industrial engineering programs with a focus on production-scale systems and AI architecture.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["Lead Mentor", "Architect", "Eng"]
    }
];

const CourseFacultyCard = React.memo(({ mentor, index, variant }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    return (
        <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={isMobile ? { duration: 0 } : { delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!isMobile ? { y: -10, scale: 1.01 } : {}}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className={`snap-center flex-shrink-0 ${isMobile ? 'w-full aspect-[0.8/1]' : 'w-full aspect-[3/4]'} rounded-2xl overflow-hidden border-2 transition-all duration-700 flex flex-col items-center justify-center p-8 md:p-10 gap-12 relative cursor-default group
                ${isDark 
                    ? 'bg-white/[0.02] backdrop-blur-md border-white/5 hover:bg-white/[0.04] hover:border-blue-500/20' 
                    : 'bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-blue-100'}`}
        >
            {/* Background Decorative Mesh */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-colors duration-700
                ${isDark ? 'bg-blue-500/8 group-hover:bg-blue-500/12' : 'bg-blue-50/30 group-hover:bg-blue-100/40'}`} />
            
            {/* Image Section: High-End Industrial Housing */}
            <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 relative pt-4 md:pt-6">
                {/* Main Profile Housing */}
                <div className={`w-full h-full rounded-full overflow-hidden relative border-2 transition-all duration-700
                    ${isDark ? 'border-white/10 group-hover:border-blue-500/30' : 'border-slate-200 group-hover:border-blue-200'}`}>
                    {/* Dynamic Background */}
                    <div className={`absolute inset-0 transition-colors duration-700
                        ${isDark ? 'bg-gradient-to-br from-blue-950/20 via-transparent to-blue-950/20' : 'bg-gradient-to-br from-blue-50 via-transparent to-slate-50'}`} />
                    
                    {/* Profile Image */}
                    <img 
                        src={mentor.image} 
                        alt={mentor.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${mentor.imagePosition || 'object-center'}`}
                        style={{ 
                            transform: `scale(${mentor.imageScale})`
                        }}
                    />
                    
                    {/* Industrial Overlay */}
                    <div className={`absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100
                        ${isDark ? 'bg-gradient-to-t from-blue-500/10 to-transparent' : 'bg-gradient-to-t from-blue-500/10 to-transparent'}`} />
                </div>
            </div>
 
            {/* Content Core: Pure Data Hierarchy */}
            <div className="flex-grow flex flex-col items-center text-center min-w-0 relative z-10 w-full">
                <div className="space-y-1 mb-4 flex flex-col items-center">
                    <h3 className={`text-2xl md:text-3xl font-black tracking-tight uppercase leading-none transition-colors w-full break-words
                        ${isDark ? 'text-white group-hover:text-blue-500' : 'text-slate-900 group-hover:text-blue-600'}`}>
                        {mentor.name}
                    </h3>
                    <p className={`font-black text-sm md:text-[13px] tracking-[0.2em] uppercase pb-4 opacity-80
                        ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {mentor.role}
                    </p>
                    <div className={`w-16 h-1.5 transition-all duration-500 rounded-full
                        ${isDark ? 'bg-white/10 group-hover:w-32 group-hover:bg-blue-500' : 'bg-slate-100 group-hover:w-32 group-hover:bg-blue-600'}`} />
                </div>

                {!isMobile && (
                    <p className={`text-[15px] md:text-[16px] leading-[1.6] mb-8 font-medium px-4
                        ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {mentor.bio}
                    </p>
                )}

                {/* Interaction Footer */}
                {!isMobile && (
                    <div className="flex items-center justify-between pt-6 w-full border-t border-white/5 mt-auto">
                        <div className="flex gap-4">
                            {mentor.tags.slice(0, 2).map(tag => (
                                <span key={tag} className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors
                                    ${isDark ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 group/btn cursor-pointer">
                            <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors
                                ${isDark ? 'text-slate-500 group-hover/btn:text-white' : 'text-slate-400 group-hover/btn:text-slate-900'}`}>
                                EXPLORE
                            </span>
                            <div className={`w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center
                                ${isDark ? 'bg-blue-500/20 group-hover/btn:bg-blue-500' : 'bg-blue-600/20 group-hover/btn:bg-blue-600'}`}>
                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Integrated LinkedIn Tag */}
            {/* Integrated LinkedIn Tag - Desktop Only */}
            {!isMobile && (
                <a 
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 z-20 border-2 group/linkedin
                        ${isDark ? 'bg-white/10 backdrop-blur-xl border-white/10 hover:bg-blue-500 hover:border-blue-500' : 'bg-slate-900 border-white hover:bg-blue-600'}`}
                >
                    <FaLinkedinIn size={18} className="group-hover/linkedin:scale-110 transition-transform" />
                </a>
            )}
        </motion.div>
    );
});

CourseFacultyCard.displayName = 'CourseFacultyCard';

const CourseFacultyGrid = ({ title = "MENTORS ONLY", isStatic = false, excludeName = null, variant = 'light' }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';

    const filteredLeaders = excludeName 
        ? LEADERS.filter(m => m.name !== excludeName)
        : LEADERS;
    
    // Default to a 3-item slice array to maintain original UI logic structure
    const displayLeaders = filteredLeaders.slice(0, 3);
    const [activeIndex, setActiveIndex] = useState(0);

    // Swap animation index loop
    useEffect(() => {
        if (!isMobile) return;
        const intervalId = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % displayLeaders.length);
        }, 2000);
        return () => clearInterval(intervalId);
    }, [isMobile, displayLeaders.length]);

    return (
        <section 
            id="course-faculty-grid" 
            className={`${isMobile ? 'p-0' : 'py-14'} relative overflow-hidden transition-colors duration-500 bg-transparent`}
        >
            <div className={`max-w-[1440px] mx-auto ${isMobile ? 'px-0' : 'px-6 md:px-12'} relative z-10`}>
                <div className={`flex flex-col items-center justify-center ${isMobile ? 'm-0' : 'mt-10 mb-10 text-center sm:mt-20 md:mt-16'}`}>
                    <div className="w-full">
                        <div className="flex justify-center">
                            <ScrollDarkenHeading variant={variant}>
                                {title}
                            </ScrollDarkenHeading>
                        </div>
                    </div>
                </div>

                <div className={`max-w-6xl mx-auto ${isMobile ? 'px-0' : 'md:px-6'} relative z-10 w-full ${isMobile ? 'mb-0' : 'mb-20'}`}>
                    {isMobile ? (
                        <div className="relative w-full px-0 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <CourseFacultyCard 
                                        mentor={displayLeaders[activeIndex]}
                                        index={activeIndex}
                                        variant={variant}
                                    />
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Pagination dots indicator */}
                            <div className="flex justify-center gap-2 mt-8">
                                {displayLeaders.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-2 rounded-full transition-all duration-500 ${activeIndex === idx ? 'bg-blue-500 w-6' : 'bg-slate-700/50 w-2'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {displayLeaders.map((mentor, index) => (
                                <CourseFacultyCard 
                                    key={index}
                                    mentor={mentor}
                                    index={index}
                                    variant={variant}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CourseFacultyGrid;
