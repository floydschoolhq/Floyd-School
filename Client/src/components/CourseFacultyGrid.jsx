import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shashwatImg from '../assets/tutors/shashwat.png';
import ananimikaImg from '../assets/tutors/anamika.jpg';
import ayushmanImg from '../assets/images/IMG-20260412-WA0034.jpg.jpeg';

import useIsMobile from '../hooks/useIsMobile';

const LEADERS = [
    {
        name: "Shashwat Vashishth",
        role: "Lead Instructor",
        image: shashwatImg,
        imageScale: 1.4,
        imagePosition: "object-[center_1%]",
        experience: "3 years+",
        bio: "Delivers all live sessions and teaches every concept through real hands-on projects, making sure every student is building alongside learning.",
        linkedin: "https://www.linkedin.com/in/shashwat-vashishth",
        tags: ["AI/ML", "Instructor"]
    },
    {
        name: "Anamika Vashisth",
        role: "Growth Associate",
        image: ananimikaImg,
        imageScale: 1.0,
        imagePosition: "object-[center_20%]",
        experience: "2 years+",
        bio: "Personally monitors each student's progress, provides guidance whenever needed and keeps parents regularly updated every step of the way.",
        linkedin: "https://www.linkedin.com/in/anamika-vashisth-28232b328?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["UI/UX", "Design"]
    },
    {
        name: "Ayushman Mishra",
        role: "Doubt Mentor",
        image: ayushmanImg,
        imageScale: 1.4,
        imagePosition: "object-[center_50%]",
        experience: "3+ Years",
        bio: "Hosts dedicated weekly sessions where students can freely ask questions and clear anything they found unclear before moving ahead.",
        linkedin: "https://www.linkedin.com/in/ayushman-mishra17/",
        tags: ["Full Stack", "Mentor"]
    }
];

const CourseFacultyCard = React.memo(({ mentor, index, variant, onMouseEnter, onMouseLeave }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    return (
        <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={isMobile ? { duration: 0 } : { delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!isMobile ? { y: -10, scale: 1.01 } : {}}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={onMouseEnter}
            onTouchEnd={onMouseLeave}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className={`shrink-0 ${isMobile ? 'w-[280px] h-[400px]' : 'w-full aspect-[3/4]'} rounded-2xl overflow-hidden border-2 transition-all duration-700 flex flex-col relative cursor-default group
                ${isDark
                    ? 'bg-[#0A0A0A] border-white/5 hover:border-blue-500/20'
                    : 'bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-blue-100'}`}
        >
            {/* Top Half: Image */}
            <div className={`w-full h-[55%] relative overflow-hidden rounded-t-2xl flex-shrink-0 ${isDark ? 'bg-[#0A0A0A]' : 'bg-slate-100'}`} style={{ transform: 'translateZ(0)' }}>
                <img
                    src={mentor.image}
                    alt={mentor.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${mentor.imagePosition || 'object-top'}`}
                    style={{ transform: `scale(${mentor.imageScale || 1})` }}
                />
            </div>

            {/* Bottom Half: Info */}
            <div className="w-full flex-1 flex flex-col items-center justify-between text-center px-6 pb-6 pt-2 relative z-10">
                <div className="space-y-1 w-full flex flex-col items-center">
                    <h3 className={`text-lg md:text-xl font-ubuntu font-bold tracking-[0.15em] uppercase leading-tight transition-all duration-500 w-full break-words
                        ${isDark
                            ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 group-hover:from-blue-400 group-hover:to-blue-600'
                            : 'text-slate-900 group-hover:text-blue-600'}`}>
                        {mentor.name}
                    </h3>
                    <p className={`text-[10px] font-medium uppercase tracking-wider mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mentor.experience} Experience
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-1 mb-3">
                        <p className={`font-bold text-[10px] md:text-xs uppercase
                            ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {mentor.role}
                        </p>
                    </div>

                    <div className={`w-12 h-1 mb-3 transition-all duration-500 rounded-full
                        ${isDark ? 'bg-white/10 group-hover:w-24 group-hover:bg-blue-500' : 'bg-slate-200 group-hover:w-24 group-hover:bg-blue-600'}`} />
                </div>

                <p className={`text-[12px] md:text-[13px] leading-[1.6] line-clamp-3 md:line-clamp-4 font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mentor.bio}
                </p>
            </div>

            {/* Integrated LinkedIn Tag - Desktop Only */}
            {!isMobile && (
                <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 z-20 border-2 group/linkedin
                        ${isDark ? 'bg-white/10 backdrop-blur-xl border-white/10 hover:bg-blue-500 hover:border-blue-500' : 'bg-slate-900 border-white hover:bg-blue-600'}`}
                >
                    <FaLinkedinIn size={16} className="group-hover/linkedin:scale-110 transition-transform" />
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
    const [hoveredCard, setHoveredCard] = useState(null);
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
        if (!isMobile || isDragging || hoveredCard !== null) return;
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
    }, [currentIndex, isMobile, isDragging, hoveredCard, x, displayLeaders.length, windowWidth]);

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
            <section id="course-faculty-grid" className="py-12 relative overflow-hidden bg-black w-full">
                <div className="text-center pb-6 pt-0">
                    <h2 className="text-2xl font-black tracking-tighter text-white leading-tight">
                        Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Experienced</span> Mentors
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
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            />
                        ))}
                    </motion.div>
                </div>

                <div className="flex justify-center gap-6 mt-10">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-3xl pb-1 transition-all bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 shadow-sm"
                        aria-label="Previous mentor"
                    >
                        ‹
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-3xl pb-1 transition-all bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 shadow-sm"
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

