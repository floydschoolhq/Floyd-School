import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import niteshImg from '../assets/tutors/nitesh.jpg';
import ananimikaImg from '../assets/tutors/anamika.jpg';
import shashwatImg from '../assets/tutors/shashwat.jpg';

import useIsMobile from '../hooks/useIsMobile';

const LEADERS = [
    {
        name: "Shashwat Vashishth",
        role: "Mentor AI/ML",
        image: shashwatImg,
        imageScale: 1.0,
        imagePosition: "object-[center_85%]",
        experience: "2+ Years",
        bio: "Mentors in building intelligent AI solutions that solve real-world problems.",
        linkedin: "#",
        tags: ["AI/ML", "Algorithm"]
    },
    {
        name: "Shivam Mishra",
        role: "Founder | AI/ML Engineer",
        image: shivamImg,
        imageScale: 1.9,
        experience: "3+ Years",
        bio: "visionary founder of thinkskool, architecting the future of STEM education through advanced AI and machine learning integration.",
        linkedin: "https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in",
        tags: ["AI/ML", "Founder", "Visionary"]
    },
    {
        name: "Anamika Vashisth",
        role: "Growth Associate",
        image: ananimikaImg,
        imageScale: 1,
        imagePosition: "object-[center_22%]",
        experience: "2+ Years",
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
        experience: "2+ Years",
        bio: "Specializing in digital product management and UI/UX design leadership within multidisciplinary teams.",
        linkedin: "#",
        tags: ["UI/UX", "Management", "Leadership"]
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
            className={`shrink-0 ${isMobile ? 'w-[280px] h-[400px]' : 'w-full aspect-[3/4]'} rounded-2xl overflow-hidden border-2 transition-all duration-700 flex flex-col items-center justify-center p-8 md:p-10 gap-8 relative cursor-default group
                ${isDark 
                    ? 'bg-white/[0.02] backdrop-blur-md border-white/5 hover:bg-white/[0.04] hover:border-blue-500/20' 
                    : 'bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-blue-100'}`}
        >
            {/* Background Decorative Mesh */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-colors duration-700
                ${isDark ? 'bg-blue-500/8 group-hover:bg-blue-500/12' : 'bg-blue-50/30 group-hover:bg-blue-100/40'}`} />
            
            {/* Image Section: High-End Industrial Housing */}
            <div className="w-40 h-40 flex-shrink-0 relative pt-2">
                {/* Secondary Outer Frame for Depth */}
                <div className={`absolute inset-0 rounded-3xl transition-transform duration-700
                    ${isDark ? 'bg-blue-500/10' : 'bg-blue-100/50'}`} />
                
                {/* Main Profile Housing */}
                <div className={`w-full h-full rounded-3xl overflow-hidden relative border-2 transition-all duration-700
                    ${isDark ? 'border-white/10 group-hover:border-blue-500/40 shadow-2xl' : 'border-slate-200 group-hover:border-blue-300 shadow-xl'}`}>
                    {/* Dynamic Background */}
                    <div className={`absolute inset-0 transition-colors duration-700
                        ${isDark ? 'bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'}`} />
                    
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
                        ${isDark ? 'bg-gradient-to-t from-blue-500/20 to-transparent' : 'bg-gradient-to-t from-blue-500/10 to-transparent'}`} />
                </div>
            </div>
 
            {/* Content Core: Pure Data Hierarchy */}
            <div className="flex-grow flex flex-col items-center text-center min-w-0 relative z-10 w-full">
                <div className="mb-4">
                    <span className={`px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-[0.2em] shadow-sm
                        ${isDark 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        {mentor.experience} Experienced
                    </span>
                </div>
                <div className="space-y-1 mb-4 flex flex-col items-center">
                <h3 className={`text-xl md:text-2xl font-ubuntu font-bold tracking-[0.25em] uppercase leading-tight transition-all duration-500 w-full break-words whitespace-nowrap
                    ${isDark 
                        ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 group-hover:from-blue-400 group-hover:to-blue-600' 
                        : 'text-slate-900 group-hover:text-blue-600'}`}>
                    {mentor.name}
                </h3>
                    <p className={`font-bold text-sm md:text-[13px] uppercase pb-4
                        ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className="mr-2">[</span>
                        {mentor.role}
                        <span className="ml-2">]</span>
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

const CourseFacultyGrid = ({ title = "MENTORS ONLY", excludeName = null, variant = 'light' }) => {
    const isMobile = useIsMobile();

    const filteredLeaders = excludeName 
        ? LEADERS.filter(m => m.name !== excludeName)
        : LEADERS;
    
    const displayLeaders = filteredLeaders.slice(0, 3);
    const [currentIndex, setCurrentIndex] = useState(displayLeaders.length);
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = React.useRef(null);
    const CARD_WIDTH = 280;

    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getCenterOffset = () => {
        const containerWidth = containerRef.current?.parentElement?.offsetWidth || window.innerWidth;
        return (containerWidth - CARD_WIDTH) / 2;
    };

    useLayoutEffect(() => {
        if (isMobile) {
            const cardWidth = CARD_WIDTH + 16;
            const centerOffset = getCenterOffset();
            x.set(-currentIndex * cardWidth + centerOffset);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, windowWidth]);

    useEffect(() => {
        if (!isMobile || isDragging) return;
        const cardWidth = CARD_WIDTH + 16;
        const totalItems = displayLeaders.length;
        const centerOffset = getCenterOffset();
        const targetX = -currentIndex * cardWidth + centerOffset;

        // Optimize loop reset: if the distance is too large, it's a jump reset.
        const currentX = x.get();
        if (Math.abs(currentX - targetX) > cardWidth * 1.5) {
            x.stop();
            x.set(targetX);
        } else {
            animate(x, targetX, {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
            });
        }

        if (currentIndex >= totalItems * 2) {
            const timer = setTimeout(() => {
                setCurrentIndex(totalItems);
                x.set(-(totalItems) * cardWidth + centerOffset);
            }, 600);
            return () => clearTimeout(timer);
        } else if (currentIndex < totalItems) {
            const timer = setTimeout(() => {
                setCurrentIndex(totalItems * 2 - 1);
                x.set(-(totalItems * 2 - 1) * cardWidth + centerOffset);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isMobile, isDragging, x, displayLeaders.length, windowWidth]);

    const handleNext = () => setCurrentIndex(prev => prev + 1);
    const handlePrev = () => setCurrentIndex(prev => prev - 1);

    const handleDragEnd = () => {
        setIsDragging(false);
        const finalX = x.get();
        const offset = getCenterOffset();
        const cardWidth = CARD_WIDTH + 16;
        const nearestIndex = Math.round((offset - finalX) / cardWidth);
        setCurrentIndex(nearestIndex);
    };

    if (isMobile) {
        const allCards = [...displayLeaders, ...displayLeaders, ...displayLeaders];
        return (
            <section id="course-faculty-grid" className="py-12 relative overflow-hidden bg-white w-full">
                <div className="text-center pb-6 pt-0">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 leading-tight">
                        Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Experienced</span> Mentors
                    </h2>
                </div>

                <div className="relative w-full overflow-visible flex justify-start items-center">
                    <motion.div
                        ref={containerRef}
                        className="flex flex-nowrap items-center w-max"
                        style={{ x, gap: '16px' }}
                        drag="x"
                        dragConstraints={{ left: -10000, right: 10000 }}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={handleDragEnd}
                    >
                        {allCards.map((mentor, idx) => (
                            <CourseFacultyCard 
                                key={idx}
                                mentor={mentor}
                                index={idx}
                                variant={variant}
                            />
                        ))}
                    </motion.div>
                </div>

                <div className="flex justify-center gap-6 mt-10">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-3xl pb-1 transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm"
                        aria-label="Previous mentor"
                    >
                        ‹
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-3xl pb-1 transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm"
                        aria-label="Next mentor"
                    >
                        ›
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section 
            id="course-faculty-grid" 
            className={`py-14 relative overflow-hidden transition-colors duration-500 bg-transparent`}
        >
            <div className={`max-w-[1440px] mx-auto px-6 md:px-12 relative z-10`}>
                <div className={`flex flex-col items-center justify-center mt-10 mb-10 text-center sm:mt-20 md:mt-16`}>
                    <div className="w-full">
                        <div className="flex justify-center">
                            <ScrollDarkenHeading variant={variant}>
                                {title}
                            </ScrollDarkenHeading>
                        </div>
                    </div>
                </div>

                <div className={`max-w-6xl mx-auto md:px-6 relative z-10 w-full mb-20`}>
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
                </div>
            </div>
        </section>
    );
};

export default CourseFacultyGrid;

