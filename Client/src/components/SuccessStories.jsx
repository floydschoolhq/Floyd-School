import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';


const REVIEWS_ROW_1 = [
    {
        name: "Priyal Panwar",
        role: "Student, STEPUP SCHOOL",
        content: "Good Efforts very Informative!",
        avatar: "P"
    },
    {
        name: "Navya",
        role: "Student, STEPUP SCHOOL",
        content: "Good efforts liked it!",
        avatar: "N"
    },
    {
        name: "Pratishtha Thakur",
        role: "Student, STEPUP SCHOOL",
        content: "Amazing!!",
        avatar: "P"
    },
    {
        name: "Aahana Jain",
        role: "Student, STEPUP SCHOOL",
        content: "The course was really nice it was quite easy to be aware of such program that easy",
        avatar: "A"
    },
    {
        name: "Siya Kapoor",
        role: "Student, STEPUP SCHOOL",
        content: "It was so nice, we learnt a lot",
        avatar: "S"
    }
];

const REVIEWS_ROW_2 = [
    {
        name: "Kanisha Kapoor",
        role: "Student, STEPUP SCHOOL",
        content: "It was very nice time to learn this workshop",
        avatar: "K"
    },
    {
        name: "Ishanvi Shukla",
        role: "Student, STEPUP SCHOOL",
        content: "This was very good experience to have new ideas...",
        avatar: "I"
    },
    {
        name: "Bhavya Singh",
        role: "Student, STEPUP SCHOOL",
        content: "The Presentation was very nice and goood job bhai",
        avatar: "B"
    },
    {
        name: "Sanvi Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "It was a very good experience learning about it and very good explanation.",
        avatar: "S"
    },
    {
        name: "Daksh Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "The course was really good and interactive",
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

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + ALL_REVIEWS.length) % ALL_REVIEWS.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ALL_REVIEWS.length);
    };

    if (isMobile) {
        return (
            <section className="pt-10 pb-16 relative overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5">
                <div className="absolute inset-0 pointer-events-none" />
                
                <div className="w-full relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold tracking-tighter uppercase leading-[0.9] text-white">
                            transformed by <br/>
                            <span className="lowercase"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                        </h2>
                    </div>

                    <div className="w-full relative">
                        <motion.div 
                            className="flex gap-4 pt-4 pb-14 no-scrollbar cursor-grab active:cursor-grabbing"
                            animate={{ x: (window.innerWidth - (window.innerWidth * MOBILE_CARD_WIDTH_RATIO)) / 2 - currentIndex * (window.innerWidth * MOBILE_CARD_WIDTH_RATIO + MOBILE_GAP) }}
                            transition={isDragging ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
                            drag="x"
                            dragConstraints={{ 
                                left: -((ALL_REVIEWS.length - 1) * (window.innerWidth * MOBILE_CARD_WIDTH_RATIO + MOBILE_GAP)) + (window.innerWidth - (window.innerWidth * MOBILE_CARD_WIDTH_RATIO)) / 2, 
                                right: (window.innerWidth - (window.innerWidth * MOBILE_CARD_WIDTH_RATIO)) / 2 
                            }}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                        >
                            {ALL_REVIEWS.map((review, i) => (
                                <div key={i} className="shrink-0 w-screen">
                                    <ReviewCard review={review} index={i} isMobile={true} />
                                </div>
                            ))}
                        </motion.div>

                        <div className="flex justify-center gap-12 mt-4 pb-8">
                            <button 
                                onClick={handlePrev}
                                className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-900 active:scale-90 transition-all hover:bg-slate-50"
                                aria-label="Previous story"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            
                            <button 
                                onClick={handleNext}
                                className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-900 active:scale-90 transition-all hover:bg-slate-50"
                                aria-label="Next story"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>
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