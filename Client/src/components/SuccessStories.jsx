import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';


const REVIEWS_ROW_1 = [
    {
        name: "Priyal Panwar",
        role: "Student, STEPUP SCHOOL",
        content: "The workshop was extremely informative and the mentors put in great efforts. It completely changed my perspective on how easy it is to start building real-world projects from scratch.",
        avatar: "P"
    },
    {
        name: "Navya",
        role: "Student, STEPUP SCHOOL",
        content: "I really liked the hands-on approach and the structured curriculum. The instructors explained complex concepts with such clarity that I felt confident writing code by the end of the session.",
        avatar: "N"
    },
    {
        name: "Pratishtha Thakur",
        role: "Student, STEPUP SCHOOL",
        content: "An absolutely amazing experience! The interactive sessions and practical examples made technical concepts incredibly easy to grasp. I highly recommend this to anyone looking to start their tech journey.",
        avatar: "P"
    },
    {
        name: "Aahana Jain",
        role: "Student, STEPUP SCHOOL",
        content: "The course structure was phenomenal. They made it so easy to understand advanced topics that normally seem intimidating. I'm grateful to be part of a program that genuinely cares about student growth.",
        avatar: "A"
    },
    {
        name: "Siya Kapoor",
        role: "Student, STEPUP SCHOOL",
        content: "We learned a tremendous amount in such a short time. The environment was super supportive, and the real-world examples helped us connect theoretical knowledge with practical implementation seamlessly.",
        avatar: "S"
    }
];

const REVIEWS_ROW_2 = [
    {
        name: "Kanisha Kapoor",
        role: "Student, STEPUP SCHOOL",
        content: "Attending this workshop was one of the best investments of my time. The instructors were deeply knowledgeable and the hands-on projects gave me practical skills I can actually use.",
        avatar: "K"
    },
    {
        name: "Ishanvi Shukla",
        role: "Student, STEPUP SCHOOL",
        content: "This was a fantastic experience that sparked so many new ideas for me. The mentorship was top-notch, and it gave me a clear roadmap for how to approach and build my own software projects.",
        avatar: "I"
    },
    {
        name: "Bhavya Singh",
        role: "Student, STEPUP SCHOOL",
        content: "The presentations were visually engaging and technically profound. The mentors did an extraordinary job breaking down difficult logic into simple, bite-sized lessons that anyone can follow.",
        avatar: "B"
    },
    {
        name: "Sanvi Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "The explanations provided by the mentors were crystal clear. It was a highly rewarding experience that bridged the gap between basic concepts and actual industry-level development practices.",
        avatar: "S"
    },
    {
        name: "Daksh Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "The course was exceptionally interactive and well-paced. Getting live feedback on my code and collaborating with peers made the entire learning curve incredibly smooth and enjoyable.",
        avatar: "D"
    }
];

const ALL_REVIEWS = [...REVIEWS_ROW_1, ...REVIEWS_ROW_2];

const ReviewCard = ({ review, index = 0, isMobile = false }) => {
    const accents = [
        { text: 'text-blue-400', bg: 'bg-blue-500/10' },
        { text: 'text-amber-400', bg: 'bg-amber-500/10' },
        { text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { text: 'text-rose-400', bg: 'bg-rose-500/10' },
    ];
    const accent = accents[index % accents.length];

    return (
        <div className={`${isMobile ? 'w-full rounded-none border-x-0' : 'w-[350px] rounded-2xl'} h-[336px] p-6 md:p-8 group relative transition-all duration-700 overflow-hidden border backdrop-blur-2xl flex flex-col items-center text-center bg-slate-950/90 border-white/10 shadow-2xl shadow-black/60 flex-shrink-0`}>
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 ${accent.bg}`} />
            <div className={`absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            <div className="relative z-10 flex flex-col items-center w-full">
                <div className="relative mb-6 md:mb-8 pt-2">
                    <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${accent.bg}`} />
                    <div className="relative p-1 rounded-2xl border border-white/10 group-hover:border-white/20 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm transition-transform duration-700 group-hover:scale-105">
                            <span className="text-lg md:text-xl font-bold text-white">{review.avatar}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="text-base md:text-xl font-bold tracking-tight mb-1 text-white">
                        {review.name}
                    </h4>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] ${accent.bg} ${accent.text}`}>
                        {review.role}
                    </div>
                </div>

                <div className="relative px-1">
                    <Quote 
                        size={48}
                        className="absolute -top-4 -left-1 opacity-[0.03] text-white"
                        aria-hidden="true"
                    />
                    <p className="text-[12px] md:text-[15px] leading-relaxed font-medium italic mb-4 relative z-10 text-slate-200 group-hover:text-white">
                        "{review.content}"
                    </p>
                </div>
            </div>
        </div>
    );
};

const SuccessStories = ({ variant }) => {
    const isMobile = useIsMobile();
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    
    // Mobile-specific state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    
    // Desktop constants
    const DESKTOP_GAP = 24;
    const desktopCardWidth = 350 + DESKTOP_GAP;
    
    // Mobile constants
    const MOBILE_CARD_WIDTH_RATIO = 1;
    const MOBILE_GAP = 16;

    useEffect(() => {
        if (isMobile) return;
        
        // Row 1 - Left
        const distance1 = -desktopCardWidth * REVIEWS_ROW_1.length;
        controls1.start({
            x: [0, distance1],
            transition: {
                duration: 40,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
            }
        });

        // Row 2 - Right
        const distance2 = -desktopCardWidth * REVIEWS_ROW_2.length;
        controls2.start({
            x: [distance2, 0],
            transition: {
                duration: 40,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
            }
        });
    }, [isMobile, controls1, controls2, desktopCardWidth]);

    const scrollContainerRef = useRef(null);

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -window.innerWidth * 0.85, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: window.innerWidth * 0.85, behavior: 'smooth' });
        }
    };

    if (isMobile) {
        return (
            <section className="pt-16 pb-20 bg-[#0A0A0A] overflow-hidden border-t border-white/5 relative">
                <div className="px-6 flex flex-col justify-center mb-14 mt-4">
                    <h2 className="text-[32px] font-extrabold text-white leading-[1.1] text-center tracking-tight">
                        Transformed by <br/>
                        <span><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                    </h2>
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory pb-8 px-6 w-full no-scrollbar relative z-10"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {ALL_REVIEWS.map((review, i) => {
                        const parts = review.role.split(',');
                        const origin = 'Student';
                        const dest = parts[1]?.trim() || "ThinkSkool";

                        return (
                            <div key={i} className="shrink-0 w-[calc(100vw-60px)] snap-center mr-4 relative mt-12">
                                <div className="bg-[#1c1c1c] rounded-[2rem] p-7 pt-14 flex flex-col text-left relative min-h-[380px]">
                                    
                                    {/* Watermark Logo */}
                                    <div className="absolute top-0 left-0 opacity-[0.03] pointer-events-none transform translate-x-4 translate-y-4">
                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45">
                                            <polyline points="13 17 18 12 13 7"></polyline>
                                            <polyline points="6 17 11 12 6 7"></polyline>
                                        </svg>
                                    </div>

                                    {/* Top Avatar */}
                                    <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full border-[6px] border-[#0A0A0A] bg-gradient-to-br from-green-300 to-green-600 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl font-black text-slate-900">{review.avatar}</span>
                                    </div>
                                    
                                    {/* Header (Name) */}
                                    <div className="text-center mb-8 relative z-10 w-full mt-2">
                                        <h4 className="text-[19px] font-bold text-[#f5f5f5]">{review.name}</h4>
                                    </div>
                                    
                                    {/* Content */}
                                    <p className="text-[15px] text-[#c9c9c9] leading-relaxed mb-10 font-normal">
                                        {review.content}
                                    </p>

                                    {/* Footer Route Component */}
                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#2a2a2a] relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-[30px] h-[30px] rounded-full bg-black border border-[#444] flex items-center justify-center shrink-0">
                                                <span className="text-[10px] text-white font-bold">{origin.charAt(0)}</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-[#858585] whitespace-nowrap">{origin}</span>
                                        </div>
                                        <div className="text-[#a3a3a3] px-2 shrink-0">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="13 17 18 12 13 7"></polyline>
                                                <polyline points="6 17 11 12 6 7"></polyline>
                                            </svg>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`text-[12px] uppercase tracking-widest font-extrabold ${dest === "STEPUP SCHOOL" ? "animate-text-shimmer" : "text-[#858585]"}`}>
                                                {dest}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-12 mt-4 relative z-10 w-full px-6">
                    <button 
                        onClick={handlePrev}
                        className="w-14 h-14 rounded-full bg-[#1c1c1c] border border-white/10 shadow-lg flex items-center justify-center text-white active:scale-90 transition-all hover:bg-[#252525]"
                        aria-label="Previous story"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        className="w-14 h-14 rounded-full bg-[#1c1c1c] border border-white/10 shadow-lg flex items-center justify-center text-white active:scale-90 transition-all hover:bg-[#252525]"
                        aria-label="Next story"
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </section>
        );
    }

    // Desktop - Two Directional Rows
    return (
        <section className="pt-8 pb-16 md:pt-10 md:pb-20 relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-30 invert brightness-200" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 bg-blue-600/5" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 bg-amber-600/5" />
            </div>

            <div className="w-full relative z-10 px-0">
                <div className="text-center mb-12">
                    <ScrollDarkenHeading sizeClass="text-5xl md:text-7xl" variant={variant} uppercase={false}>
                        transformed by <span className="font-black tracking-tighter"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                    </ScrollDarkenHeading>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Row 1 - Left */}
                    <div className="overflow-hidden">
                        <motion.div className="flex gap-6" animate={controls1}>
                            {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, index) => (
                                <ReviewCard key={`r1-${index}`} review={review} index={index} isMobile={false} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 2 - Right */}
                    <div className="overflow-hidden">
                        <motion.div className="flex gap-6" animate={controls2}>
                            {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, index) => (
                                <ReviewCard key={`r2-${index}`} review={review} index={index} isMobile={false} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;