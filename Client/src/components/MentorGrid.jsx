import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useAnimationFrame } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import abhayImg from '../assets/tutors/abhay.jpg';
import ananimikaImg from '../assets/tutors/anamika.jpg';
import niteshImg from '../assets/tutors/nitesh.jpg';
import poojaImg from '../assets/tutors/pooja.jpg';
import shashwatImg from '../assets/tutors/shashwat.jpg';
import shanImg from '../assets/tutors/shan.jpeg';

import useIsMobile from '../hooks/useIsMobile';

const LEADERS = [
    {
        name: "Shivam Mishra",
        role: "Founder | AI/ML Engineer",
        image: shivamImg,
        imageScale: 1.9,
        bio: "AI/ML expert building intelligent, real-world solutions with machine learning.",
        linkedin: "https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in",
        tags: ["AI/ML", "Founder"]
    },
    {
        name: "Raghav",
        role: "Lead Mentor & Product Architect",
        image: raghavImg,
        imageScale: 1.9,
        bio: "Cybersecurity specialist focused on securing systems and preventing threats.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: [ "Architect", "CyberSecurity"]
    },
    {
        name: "Abhay Singh Chauhan",
        role: "Management & Web Development",
        image: abhayImg,
        imageScale: 1.5,
        bio: "Builds fast, scalable, and modern web applications using latest technologies.",
        linkedin: "https://www.linkedin.com/in/abhay-singh-chauhan-485706310",
        tags: ["Web Developer", "Manager"]
    },
    {
        name: "Anamika Vashisth",
        role: "UI/UX & System Designer",
        image: ananimikaImg,
        imageScale: 1.15,
        bio: "Designs intuitive, user-friendly interfaces focused on seamless experience.",
        linkedin: "#",
        tags: ["UI/UX", "Design"]
    },
    {
        name: "Shashwat Vashishth",
        role: "Mentor AI/ML",
        image: shashwatImg,
        imageScale: 1.0,
        imagePosition: "object-[center_85%]",
        bio: "Mentors in building intelligent AI solutions that solve real-world problems.",
        linkedin: "#",
        tags: ["AI/ML", "Algorithm"]
    },
    {
        name: "Shan Sharma",
        role: "System Development",
        image: shanImg,
        imageScale: 1.0,
        bio: "Develops scalable systems and modern web applications with strong architecture.",
        linkedin: "https://www.linkedin.com/in/shan-sharma-726706292",
        tags: ["System Design", "Architecture"]
    },
    {
        name: "Nitesh Kumar",
        role: "UI and UX Management",
        image: niteshImg,
        imageScale: 1.0,
        imagePosition: "object-[center_20%]",
        bio: "Leads structured design systems focused on clarity, usability, and product growth.",
        linkedin: "#",
        tags: ["UI/UX", "Management"]
    },
    {
        name: "Pooja Kumari",
        role: "UI and UX Management",
        image: poojaImg,
        imageScale: 1.0,
        bio: "Designs user-centered experiences that balance creativity and functionality.",
        linkedin: "#",
        tags: ["UI/UX", "Design strategy"]
    }
];

const MentorCard = React.memo(({ mentor, index, variant }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    
    if (isMobile) {
        return (
            <div 
                className={`snap-center shrink-0 w-[280px] p-8 rounded-[2.5rem] border flex flex-col items-center text-center transition-all duration-500 relative overflow-hidden cursor-default
                    ${isDark 
                        ? 'bg-[#0F172A]/40 border-white/5 shadow-2xl shadow-black/20' 
                        : 'bg-white border-slate-200 shadow-sm shadow-slate-200/50'}`}
            >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'}`} />

                <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
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

                    <div className="mb-6">
                        <h3 className={`text-lg font-black uppercase tracking-tight leading-none mb-1.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {mentor.name}
                        </h3>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>
                            {mentor.role}
                        </p>
                    </div>

                    <p className={`text-[13px] font-medium leading-relaxed mb-8 px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {mentor.bio}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">
                        {mentor.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                                isDark ? 'bg-white/5 text-slate-500 border border-white/5' : 'bg-slate-50 text-slate-400 border border-slate-100'
                            }`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`snap-center flex-shrink-0 w-[85vw] md:w-[600px] h-[450px] md:h-[320px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border transition-all duration-300 flex flex-col md:flex-row items-center p-8 md:p-10 gap-8 md:gap-10 relative group cursor-default
                ${isDark
                    ? 'bg-white/[0.02] backdrop-blur-md border-white/5 hover:bg-orange-500/10 hover:border-orange-500/40'
                    : 'bg-white border-slate-100 hover:shadow-[0_20px_60px_rgba(251,146,60,0.25)] hover:border-orange-500/30'}`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none transition-all duration-300
                ${isDark ? 'bg-orange-500/10 group-hover:bg-orange-500/20' : 'bg-orange-100/40 group-hover:bg-orange-200/60'}`} />
            
            <div className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0 relative">
                <div className={`absolute inset-0 rounded-full p-[3px] transition-all duration-300 z-10 
                    ${isDark ? 'bg-white/5 border-white/10 group-hover:border-orange-400/40' : 'bg-white border-slate-100 group-hover:border-orange-400/40'}`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                        <img
                            src={mentor.image}
                            alt={mentor.name}
                            className={`w-full h-full object-cover ${mentor.imagePosition || 'object-top'} transition-all duration-300 group-hover:scale-105`}
                            style={{ transform: `scale(${mentor.imageScale})` }}
                        />
                    </div>
                </div>

                <a 
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 z-20 border-2
                        ${isDark ? 'bg-white/10 backdrop-blur-xl border-white/10 hover:bg-orange-500 hover:border-orange-400' : 'bg-slate-900 border-white hover:bg-orange-500'}`}
                >
                    <FaLinkedinIn size={14} />
                </a>
            </div>

            <div className="flex-grow flex flex-col items-center text-center min-w-0 relative z-10 w-full">
                <div className="space-y-1 mb-4 md:mb-6 flex flex-col items-center">
                    <h3 className={`text-xl md:text-3xl font-black uppercase tracking-tight leading-none transition-colors duration-300 w-full
                        ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}`}>
                        {mentor.name}
                    </h3>
                    <p className={`font-semibold text-[11px] md:text-[13px] tracking-wide uppercase truncate pb-4
                        ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mentor.role}
                    </p>
                    <div className={`w-12 h-1 transition-all duration-300 rounded-full
                        ${isDark ? 'bg-white/10 group-hover:w-20 group-hover:bg-orange-400' : 'bg-slate-100 group-hover:w-20 group-hover:bg-orange-500'}`} />
                </div>

                <p className={`text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 line-clamp-2 font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mentor.bio}
                </p>

                <div className="flex items-center justify-center pt-2 w-full">
                    <div className="flex justify-center gap-4">
                        {mentor.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors duration-300
                                ${isDark ? 'text-slate-500 group-hover:text-orange-400' : 'text-slate-400 group-hover:text-orange-600'}`}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

const MentorGrid = ({ title = "Mentors", isStatic = false, excludeName = null, variant }) => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';

    const filteredLeaders = LEADERS.filter(m => m.name !== excludeName);

    // Hooks must be at the top level
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const pauseTimeoutRef = useRef(null);

    const CARD_WIDTH = 280 + 16; // w-[280px] + gap-4

    // Optimized auto-scroll logic for Desktop (Marquee)
    useEffect(() => {
        if (isMobile || isDragging || isStatic || hoveredCard !== null) return;
        
        let animationFrame;
        let lastTime = 0;
        const speed = -0.5; // Slower speed for better performance
        
        const animate = (currentTime) => {
            if (currentTime - lastTime >= 16) { // Cap at 60fps
                let currentX = x.get() + speed;
                
                if (containerRef.current) {
                    const halfWidth = containerRef.current.scrollWidth / 2;
                    if (currentX <= -halfWidth) {
                        currentX = 0;
                    }
                    x.set(currentX);
                }
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
    }, [isMobile, isDragging, isStatic, hoveredCard]);

    // Optimized auto-swipe logic for Mobile (Infinite Loop)
    useEffect(() => {
        if (!isMobile || isDragging || isStatic || isPaused) return;

        let animationFrame;
        let lastTime = 0;
        const interval = 2000; // Slower interval for better performance
        
        const animate = (currentTime) => {
            if (currentTime - lastTime >= interval) {
                setCurrentIndex(prev => (prev + 1) % filteredLeaders.length);
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
    }, [isMobile, isDragging, isStatic, isPaused, filteredLeaders.length]);

    // Animate to current index on mobile with Seamless Loop handling
    useEffect(() => {
        if (!isMobile || isDragging) return;
        
        const cardWidth = CARD_WIDTH;
        const totalItems = filteredLeaders.length;
        
        // If we reached the end of the first set, we animate to the first item of the second set
        // Then, we'll reset to 0 after the animation
        x.set(-currentIndex * cardWidth);

        // Seamless reset logic: if we are at the "extra" copy of the first item
        if (currentIndex >= totalItems) {
            const timer = setTimeout(() => {
                // Disable transition for a split second to jump back
                setCurrentIndex(0);
                x.jump(0); 
            }, 600); // Slight delay to allow the 1.5s interval to feel natural
        }
    }, [currentIndex, isMobile, isDragging, x, filteredLeaders.length]);

    const handleDragStart = () => {
        setIsDragging(true);
        setIsPaused(true);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        
        // Sync currentIndex with manual scroll position
        const finalX = x.get();
        const nearestIndex = Math.round(Math.abs(finalX) / CARD_WIDTH);
        const totalItems = filteredLeaders.length;
        
        // Clamp and wrap for manual interaction
        const wrappedIndex = nearestIndex % totalItems;
        setCurrentIndex(wrappedIndex);
        x.set(-wrappedIndex * CARD_WIDTH);

        // Resume after 3 seconds
        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 3000);
    };

    if (isMobile) {
        const totalCards = filteredLeaders.length;
        
        const goToPrev = () => {
            setCurrentIndex(prev => (prev - 1 + totalCards) % totalCards);
        };
        
        const goToNext = () => {
            setCurrentIndex(prev => (prev + 1) % totalCards);
        };
        
        return (
            <section id="mentors-grid" className={`py-12 overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
                <div className="text-center mb-8 px-6">
                    <h2 className={`text-2xl font-extrabold uppercase tracking-tighter leading-[1.1] text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {title}
                    </h2>
                </div>
                
                <div className="relative w-full px-4">
                    <motion.div 
                        ref={containerRef}
                        className="flex gap-4 cursor-grab active:cursor-grabbing"
                        animate={{ x: -currentIndex * (280 + 16) }}
                        transition={{ type: "spring", stiffness: 150, damping: 18 }}
                        drag="x"
                        dragConstraints={{ 
                            left: -(totalCards - 1) * (280 + 16), 
                            right: 0 
                        }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        style={{ willChange: 'transform' }}
                    >
                        {filteredLeaders.map((mentor, index) => (
                            <div 
                                key={index}
                                className={`shrink-0 w-[280px] p-6 rounded-[2rem] border flex flex-col items-center text-center transition-all duration-300 backdrop-blur-xl ${
                                    isDark 
                                        ? 'bg-slate-900/30 border-white/10 shadow-xl shadow-black/20' 
                                        : 'bg-white/60 border-slate-200/40 shadow-lg shadow-slate-200/10'
                                }`}
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                                    <img 
                                        src={mentor.image} 
                                        alt={mentor.name} 
                                        className={`w-full h-full object-cover ${mentor.imagePosition || 'object-center'}`}
                                        style={{ transform: `scale(${mentor.imageScale})` }}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <h3 className={`text-base font-black uppercase tracking-tight leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {mentor.name}
                                    </h3>
                                    <p className={`text-[8px] font-bold uppercase tracking-wider ${
                                        isDark ? 'text-blue-400' : 'text-blue-600'
                                    }`}>
                                        {mentor.role}
                                    </p>
                                </div>
                                
                                <p className={`text-xs leading-relaxed mb-4 px-1 line-clamp-2 ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                    {mentor.bio}
                                </p>
                                
                                <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                                    {mentor.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className={`text-[7px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                                            isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-6">
                    <button 
                        onClick={goToPrev}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        aria-label="Previous mentor"
                    >
                        ←
                    </button>
                    
                    <div className="flex gap-1.5">
                        {filteredLeaders.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentIndex 
                                        ? 'w-6 bg-orange-500' 
                                        : isDark ? 'bg-white/30' : 'bg-slate-300'
                                }`}
                                aria-label={`Go to mentor ${idx + 1}`}
                            />
                        ))}
                    </div>
                    
                    <button 
                        onClick={goToNext}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        aria-label="Next mentor"
                    >
                        →
                    </button>
                </div>
            </section>
        );
    }

    const isMarqueePaused = !isMobile && hoveredCard !== null;
    // Reduce duplication for better performance - only double instead of quadruple
    const mentorItems = [...filteredLeaders, ...filteredLeaders];

    return (
        <section id="mentors" className={`relative py-24 overflow-hidden transition-all duration-500 pb-32 ${isDark ? 'bg-[#050508]' : 'bg-white'} ${isMarqueePaused ? 'mentors-paused' : ''}`}>
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-[0.015] ${isDark ? 'invert brightness-200' : ''}`} style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[100px] -mr-96 -mt-96 transition-colors duration-700
                    ${isDark ? 'bg-orange-500/5' : 'bg-blue-50/50'}`} />
                <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[80px] -ml-48 -mb-48 transition-colors duration-700
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
                    <div 
                        className="overflow-hidden py-10 -mx-4 px-4 cursor-grab active:cursor-grabbing"
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none'
                        }}
                    >
                        <motion.div 
                            ref={containerRef}
                            className="flex items-center gap-6 md:gap-8 w-max"
                            style={{ x }}
                            drag="x"
                            dragConstraints={{ 
                                left: containerRef.current ? -(containerRef.current.scrollWidth / 2) : -1000, 
                                right: 0 
                            }}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => {
                                setIsDragging(false);
                                // Reset for seamless loop if needed
                                const currentX = x.get();
                                if (containerRef.current) {
                                    const halfWidth = containerRef.current.scrollWidth / 2;
                                    if (currentX <= -halfWidth) {
                                        x.set(currentX + halfWidth);
                                    } else if (currentX > 0) {
                                        x.set(currentX - halfWidth);
                                    }
                                }
                            }}
                        >
                            {mentorItems.map((mentor, index) => (
                                <div 
                                    key={index} 
                                    onMouseEnter={() => !isMobile && setHoveredCard(index)}
                                    onMouseLeave={() => !isMobile && setHoveredCard(null)}
                                >
                                    <MentorCard 
                                        mentor={mentor}
                                        index={index}
                                        variant={variant}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorGrid;
