import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
// Refreshed code version to clear old cache - fixing getDisplayIndex
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import { X, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import abhayImg from '../assets/tutors/abhay.jpg';
import ananimikaImg from '../assets/tutors/anamika.jpg';
import shashwatImg from '../assets/tutors/shashwat.png';
import shanImg from '../assets/tutors/sshan.png';
import ayushmanImg from '../assets/images/IMG-20260412-WA0034.jpg.jpeg';


import useIsMobile from '../hooks/useIsMobile';

const LEADERS = [
    {
        name: "Shivam Mishra",
        role: "System Engineer • Entrepreneur",
        image: shivamImg,
        imageScale: 1.9,
        experience: "3+ Years",
        bio: "An international hackathon winner with experience leading multiple startups. Builds innovative tech solutions with a strong entrepreneurial mindset. Leads ThinkSkool, shaping its vision and impact.",
        linkedin: "https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in",
        tags: ["AI/ML", "Founder"]
    },
    {
        name: "Raghav Sharma",
        role: "Red Team Specialist • Security Researcher",
        image: raghavImg,
        imageScale: 1.9,
        experience: "4+ Years",
        bio: "A B.Tech CSE student specializing in web application security and advanced vulnerability assessment. Certified CRTA and CNSP, with hands-on expertise in offensive security tools and real-world attack simulations. Applies practical cybersecurity skills and enhances hands-on learning at ThinkSkool.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["Architect", "CyberSecurity"]
    },
    {
        name: "Abhay Singh Chauhan",
        role: "Software Developer • Full Stack Developer",
        image: abhayImg,
        imageScale: 1.8,
        experience: "3+ Years",
        bio: "A developer skilled in building modern, scalable web solutions. Combines AI with practical development for real-world applications. Leads web development and training at ThinkSkool.",
        linkedin: "https://www.linkedin.com/in/abhay-singh-chauhan-485706310",
        tags: ["Web Developer", "Manager"]
    },
    {
        name: "Anamika Vashisth",
        role: "Data Analyst • Strategy Lead",
        image: ananimikaImg,
        imageScale: 1.15,
        experience: "2+ Years",
        bio: "A growth-focused professional with expertise in data analytics and AI. Known for combining technical skills with strong student engagement. Drives student growth and strategy at ThinkSkool.",
        linkedin: "https://www.linkedin.com/in/anamika-vashisth-28232b328?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["UI/UX", "Design"]
    },
    {
        name: "Shashwat Vashishth",
        role: "Industry Expert • Solution Architect",
        image: shashwatImg,
        imageScale: 1.0,
        imagePosition: "object-[center_65%]",
        experience: "2+ Years",
        bio: "A skilled professional with expertise in artificial intelligence and machine learning. Focused on practical, industry-relevant learning and mentorship. Guides students as a Tutor at ThinkSkool.",
        linkedin: "https://www.linkedin.com/in/shashwat-vashishth",
        tags: ["AI/ML", "Algorithm"]
    },
    {
        name: "Shan Sharma",
        role: "Senior Software Engineer • Project Lead",
        image: shanImg,
        imageScale: 1.0,
        experience: "3+ Years",
        bio: "A tech professional working in an MNC with international project experience. Strong in problem-solving and structured execution. Supported and mentored 3000+ students at ThinkSkool.",
        linkedin: "https://www.linkedin.com/in/shan-sharma-726706292",
        tags: ["System Design", "Architecture"]
    },
    {
        name: "Ayushman Mishra",
        role: "Lead Mentor & Full Stack Developer",
        image: ayushmanImg,
        imageScale: 1.0,
        imagePosition: "object-[center_20%]",
        experience: "3+ Years",
        bio: "Expert in React, Node.js and scalable cloud architectures. Passionate about teaching modern web technologies and industrial best practices.",
        linkedin: "https://www.linkedin.com/in/ayushman-mishra17/",
        tags: ["Full Stack", "Architect"]
    },
];

const MentorCard = React.memo(({ mentor, index, onSelect, variant, isHovered, onMouseEnter, onMouseLeave }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    const getNameFontSize = (name) => {
        const len = name.length;
        if (len <= 12) return 'text-lg';
        if (len <= 16) return 'text-base';
        if (len <= 20) return 'text-sm';
        return 'text-xs';
    };
    const getDesktopNameFontSize = (name) => {
        const len = name.length;
        if (len <= 12) return 'text-3xl';
        if (len <= 16) return 'text-2xl';
        if (len <= 20) return 'text-xl';
        return 'text-lg';
    };

    if (isMobile) {
        return (
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onTouchStart={onMouseEnter}
                onTouchEnd={onMouseLeave}
                className={`shrink-0 w-[300px] h-auto min-h-[480px] p-10 rounded-[2.5rem] border flex flex-col items-center text-center transition-all duration-500 relative overflow-hidden cursor-default
                    ${isDark
                        ? 'bg-[#0F172A]/40 border-white/5 shadow-2xl shadow-black/20'
                        : 'bg-white border-slate-200 shadow-sm shadow-slate-200/50'}`}
            >
                <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-full overflow-hidden">
                            <img
                                src={mentor.image}
                                alt={mentor.name}
                                className={`w-full h-full object-cover ${mentor.imagePosition || 'object-top'}`}
                                style={{ transform: `scale(${mentor.imageScale})` }}
                            />
                        </div>

                        <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center border-4 border-white shadow-xl hover:scale-110 transition-transform"
                        >
                            <FaLinkedinIn size={12} />
                        </a>
                    </div>

                    <div className="mb-4 flex flex-col items-center">
                        <h3 className={`${getNameFontSize(mentor.name)} font-black uppercase tracking-tight leading-none whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {mentor.name}
                        </h3>
                        <p className={`text-[10px] font-medium uppercase tracking-wider mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {mentor.experience} Experience
                        </p>
                    </div>

                    <p className={`text-[13px] font-medium leading-relaxed mb-2 px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {mentor.bio}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`snap-center flex-shrink-0 w-[85vw] md:w-[600px] h-[450px] md:h-[320px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border transition-all duration-700 flex flex-col md:flex-row items-center p-8 md:p-10 gap-8 md:gap-10 relative group cursor-default
                ${isDark
                    ? 'bg-white/[0.02] backdrop-blur-md border-white/5 hover:bg-orange-500/10 hover:border-orange-500/40 shadow-[0_0_40px_rgba(251,146,60,0.15)]'
                    : 'bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(251,146,60,0.25)] hover:border-orange-500/30 bg-gradient-to-br from-white to-orange-50/30'}`}
        >
            {/* Image Section: High-End Industrial Housing */}
            <div className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0 relative">
                {/* Main Profile Housing */}
                <div className={`absolute inset-0 rounded-full overflow-hidden z-10`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                         <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-full object-cover object-top"
                            style={{ transform: `scale(${mentor.imageScale})` }}
                        />
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
                    <h3 className={`${getDesktopNameFontSize(mentor.name)} font-bold tracking-tight uppercase leading-none transition-colors w-full pl-1 whitespace-nowrap
                        ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}`}>
                        {mentor.name}
                    </h3>
                    <p className={`text-[10px] md:text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mentor.experience} Experience
                    </p>
                    <div className={`w-12 h-1 transition-all duration-500 rounded-full
                        ${isDark ? 'bg-white/10 group-hover:w-24 group-hover:bg-orange-400' : 'bg-slate-100 group-hover:w-24 group-hover:bg-orange-500'}`} />
                </div>

                <p className={`text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 line-clamp-2 font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mentor.bio}
                </p>
            </div>
        </motion.div>
    );
});

const MentorGrid = ({ title = "Mentors", isStatic = false, excludeName = null, variant }) => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';

    const filteredLeaders = LEADERS.filter(m => m.name !== excludeName);

    // Hooks must be at the top level
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(filteredLeaders.length);
    const [isPaused, setIsPaused] = useState(false);
    const pauseTimeoutRef = useRef(null);

    const handleNext = () => setCurrentIndex(prev => prev + 1);
    const handlePrev = () => setCurrentIndex(prev => prev - 1);

    const CARD_WIDTH = 300;

    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initial centering
    useLayoutEffect(() => {
        if (isMobile) {
            const cardWidth = CARD_WIDTH + 16;
            const centerOffset = getCenterOffset();
            x.set(-currentIndex * cardWidth + centerOffset);
        }
    }, [isMobile, windowWidth]);

    // Center offset calculation
    const getCenterOffset = () => {
        const containerWidth = containerRef.current?.parentElement?.offsetWidth || window.innerWidth;
        return (containerWidth - CARD_WIDTH) / 2;
    };

    // Keep mobile scroll logic
    useEffect(() => {
        if (!isMobile || isDragging || isStatic || isPaused || hoveredCard !== null) return;

        let animationFrame;
        let lastTime = 0;
        const interval = 3000;

        const animate = (currentTime) => {
            if (currentTime - lastTime >= interval) {
                setCurrentIndex(prev => prev + 1);
                lastTime = currentTime;
            }
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isMobile, isDragging, isStatic, isPaused, hoveredCard, filteredLeaders.length]);

    useEffect(() => {
        if (!isMobile || isDragging) return;

        const cardWidth = CARD_WIDTH + 16;
        const totalItems = filteredLeaders.length;
        const centerOffset = getCenterOffset();
        const targetX = -currentIndex * cardWidth + centerOffset;

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
    }, [currentIndex, isMobile, isDragging, x, filteredLeaders.length, windowWidth]);

    const handleDragStart = () => {
        setIsDragging(true);
        setIsPaused(true);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        const finalX = x.get();
        const cardWidth = CARD_WIDTH + 16;
        const nearestIndex = Math.round((getCenterOffset() - finalX) / cardWidth);
        setCurrentIndex(nearestIndex);
        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 1000);
    };

    if (isMobile) {
        const goToPrev = () => setCurrentIndex(prev => prev - 1);
        const goToNext = () => setCurrentIndex(prev => prev + 1);
        const allCards = [...filteredLeaders, ...filteredLeaders, ...filteredLeaders];

        return (
            <section id="mentors-grid" className={`py-12 overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
                <div className="text-center mb-8 px-6">
                    <h2 className={`text-2xl font-extrabold uppercase tracking-tighter leading-[1.1] text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {title}
                    </h2>
                </div>

                <div className="relative w-full overflow-visible flex justify-start items-stretch">
                    <motion.div
                        ref={containerRef}
                        className="flex flex-nowrap items-stretch w-max"
                        style={{ x, gap: '16px' }}
                        drag="x"
                        dragConstraints={{ left: -10000, right: 10000 }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {allCards.map((mentor, idx) => (
                            <MentorCard 
                                key={idx}
                                mentor={mentor}
                                index={idx}
                                onSelect={setSelectedMentor}
                                variant={variant}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            />
                        ))}
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-10">
                    <button
                        onClick={goToPrev}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl pb-1 transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm'}`}
                        aria-label="Previous"
                    >‹</button>
                    <button
                        onClick={goToNext}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl pb-1 transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm'}`}
                        aria-label="Next"
                    >›</button>
                </div>
            </section>
        );
    }

    const isMarqueePaused = !isMobile && hoveredCard !== null;
    const mentorItems = [...filteredLeaders, ...filteredLeaders, ...filteredLeaders, ...filteredLeaders];

    return (
        <section 
            id="mentors-grid" 
            className={`py-14 relative overflow-hidden transition-colors duration-500
                ${isDark ? 'bg-[#050505]' : 'bg-white'}
                ${isMarqueePaused ? 'mentors-paused' : ''}`}
        >
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
                    <div className="overflow-hidden py-10 -mx-4 px-4">
                        <style>{`
                            #mentors-grid .mentors-marquee-track {
                                animation: mentorsMarquee 35s linear infinite;
                                will-change: transform;
                            }
                            #mentors-grid .mentors-marquee-track:hover {
                                animation-play-state: paused;
                            }
                            @keyframes mentorsMarquee {
                                from { transform: translateX(0%); }
                                to { transform: translateX(-50%); }
                            }
                        `}</style>
                        <div className="mentors-marquee-track flex items-center gap-8 w-max">
                            {mentorItems.map((mentor, index) => (
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
                        </div>
                    </div>
                </div>
            </div>

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
                                    <div className={`absolute inset-0 z-10 ${isDark ? 'bg-gradient-to-t from-black via-transparent' : 'bg-gradient-to-t from-slate-950 via-transparent'}`} />
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
                                        <h2 className={`text-4xl font-bold tracking-tighter leading-none mb-4 uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedMentor.name}</h2>
                                        <p className={`font-bold text-sm tracking-widest uppercase mb-8 opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedMentor.role}</p>
                                        <p className={`font-medium text-lg leading-relaxed mb-10 pl-6 border-l-2 ${isDark ? 'text-slate-300 border-white/10' : 'text-slate-400 border-slate-100'}`}>
                                            {selectedMentor.bio}
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            {selectedMentor.tags.map(tag => (
                                                <span key={tag} className={`text-[13px] font-bold tracking-tight uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    #{tag}
                                                </span>
                                            ))}
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
