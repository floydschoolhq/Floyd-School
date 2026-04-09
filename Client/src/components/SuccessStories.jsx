import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Quote } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';
import LogoLoop from './common/LogoLoop';


const REVIEWS_ROW_1 = [
    {
        name: "Priyal Panwar",
        role: "Student, STEPUP SCHOOL",
        content: "Good Efforts very Informative!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priyal"
    },
    {
        name: "Navya",
        role: "Student, STEPUP SCHOOL",
        content: "Good efforts liked it!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Navya"
    },
    {
        name: "Pratishtha Thakur",
        role: "Student, STEPUP SCHOOL",
        content: "Amazing!!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratishtha"
    },
    {
        name: "Aahana Jain",
        role: "Student, STEPUP SCHOOL",
        content: "The course was really nice it was quite easy to be aware of such program that easy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aahana"
    },
    {
        name: "Siya Kapoor",
        role: "Student, STEPUP SCHOOL",
        content: "It was so nice, we learnt a lot",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siya"
    }
];

const REVIEWS_ROW_2 = [
    {
        name: "Kanisha Kapoor",
        role: "Student, STEPUP SCHOOL",
        content: "It was very nice time to learn this workshop",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kanisha"
    },
    {
        name: "Ishanvi Shukla",
        role: "Student, STEPUP SCHOOL",
        content: "This was very good experience to have new ideas...",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishanvi"
    },
    {
        name: "Bhavya Singh",
        role: "Student, STEPUP SCHOOL",
        content: "The Presentation was very nice and goood job bhai",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bhavya"
    },
    {
        name: "Sanvi Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "It was a very good experience learning about it and very good explanation.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
    },
    {
        name: "Daksh Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "The course was really good and interactive",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Boy"
    }
];

const THEME_COLORS = [
    { border: "hover:border-blue-200", shadow: "hover:shadow-[0_20px_60px_rgba(59,130,246,0.06)]", glow: "from-blue-50" },
    { border: "hover:border-emerald-200", shadow: "hover:shadow-[0_20px_60px_rgba(16,185,129,0.06)]", glow: "from-emerald-50" },
    { border: "hover:border-purple-200", shadow: "hover:shadow-[0_20px_60px_rgba(168,85,247,0.06)]", glow: "from-purple-50" },
    { border: "hover:border-rose-200", shadow: "hover:shadow-[0_20px_60px_rgba(244,63,94,0.06)]", glow: "from-rose-50" },
    { border: "hover:border-amber-200", shadow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.06)]", glow: "from-amber-50" }
];

const ALL_REVIEWS = [...REVIEWS_ROW_1, ...REVIEWS_ROW_2];

const ReviewCard = ({ review, index = 0, variant }) => {
    const isDark = variant === 'dark';
    const isMobile = useIsMobile();
    
    // Modern Professional Palette for subtle variety
    const accents = [
        { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    ];
    const accent = accents[index % accents.length];

    const cardClasses = isMobile 
        ? "w-full p-4" 
        : "w-[380px] p-8";

    return (
        <div className={`${cardClasses} group relative transition-all duration-700 overflow-hidden border backdrop-blur-2xl flex flex-col items-center text-center rounded-2xl ${
            isDark 
                ? 'bg-slate-950/90 border-white/10 shadow-2xl shadow-black/60' 
                : 'bg-white/95 border-slate-200 shadow-xl shadow-slate-200/40'
        }`}>
            {/* Intelligent Glow Ornament */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 ${accent.bg}`} />
            
            {/* Top Border Accent */}
            <div className={`absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            <div className="relative z-10 flex flex-col items-center w-full">
                {/* Avatar with Sophisticated Border */}
                <div className="relative mb-8 pt-2">
                    <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${accent.bg}`} />
                    <div className={`relative p-1 rounded-2xl border transition-colors duration-500 ${isDark ? 'border-white/10 group-hover:border-white/20' : 'border-slate-100 group-hover:border-slate-200'} bg-gradient-to-b from-white/5 to-transparent`}>
                        <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-sm transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* Name & Role Section */}
                <div className="mb-4">
                    <h4 className={`text-base md:text-xl font-bold tracking-tight mb-1 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {review.name}
                    </h4>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] ${
                        isDark ? `${accent.bg} ${accent.text}` : 'bg-slate-100 text-slate-500 font-bold'
                    }`}>
                        {review.role}
                    </div>
                </div>

                {/* Quote Content with Elegant Typography */}
                <div className="relative px-1">
                    <Quote 
                        size={isMobile ? 24 : 48}
                        className={`absolute -top-4 -left-1 opacity-[0.03] ${isDark ? 'text-white' : 'text-slate-900'}`}
                        aria-hidden="true"
                    />
                    <p className={`text-[12px] md:text-[15px] leading-relaxed font-medium italic mb-4 relative z-10 transition-colors duration-500 ${
                        isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                        "{review.content}"
                    </p>
                </div>

                {/* Refined Success Indicator (Rating Line) */}
                <div className={`mt-auto w-full pt-4 border-t ${isDark ? 'border-slate-500/10' : 'border-slate-100'} flex items-center justify-center gap-1.5`}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                            i < 4 
                                ? `${accent.primary} shadow-[0_0_8px_currentColor] opacity-100` 
                                : `opacity-20 ${isDark ? 'bg-white' : 'bg-slate-900'}`
                        }`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SuccessStories = ({ variant }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    
    // Pro-level grid fitting logic
    const maxSlots = useMemo(() => isMobile ? 3 : 6, [isMobile]);
    
    const [slots, setSlots] = useState(new Array(maxSlots).fill(null));
    const nextRef = useRef(0);
    const replaceRef = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const pauseTimeoutRef = useRef(null);
    const x = useMotionValue(0);

    // Dynamic measurements for mobile
    const CARD_WIDTH_RATIO = 0.46; // 46vw
    const GAP = 8; // gap-2 (8px)
    
    // Desktop Auto-swap logic
    useEffect(() => {
        const initialSlots = ALL_REVIEWS.slice(0, maxSlots).map((review, i) => ({
            review,
            id: `init-${i}`
        }));
        setSlots(initialSlots);
        nextRef.current = maxSlots % ALL_REVIEWS.length;
        replaceRef.current = 0;
    }, [maxSlots]);

    useEffect(() => {
        if (isMobile) return; // Desktop only
        const interval = setInterval(() => {
            const nextReview = ALL_REVIEWS[nextRef.current];
            const uniqueId = `swap-${nextRef.current}-${Date.now()}`;
            
            setSlots(prev => {
                const newSlots = [...prev];
                if (newSlots.length > 0) {
                    newSlots[replaceRef.current] = { review: nextReview, id: uniqueId };
                }
                return newSlots;
            });
            
            replaceRef.current = (replaceRef.current + 1) % maxSlots;
            nextRef.current = (nextRef.current + 1) % ALL_REVIEWS.length;
        }, 1500);

        return () => clearInterval(interval);
    }, [maxSlots, isMobile]);

    // Auto-swipe logic for Mobile (Infinite Loop)
    useEffect(() => {
        if (!isMobile || isDragging || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 2000); // 2s delay as requested

        return () => clearInterval(interval);
    }, [isMobile, isDragging, isPaused]);

    // Animate and Loop logic
    useEffect(() => {
        if (!isMobile || isDragging) return;
        
        const vw = window.innerWidth;
        const cardFullWidth = (vw * CARD_WIDTH_RATIO) + GAP;
        const totalItems = ALL_REVIEWS.length;
        
        // Final position
        x.set(-currentIndex * cardFullWidth);

        // Seamless reset
        if (currentIndex >= totalItems) {
            const timer = setTimeout(() => {
                setCurrentIndex(0);
            }, 600); 
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isMobile, isDragging, x, ALL_REVIEWS.length]);

    const handleDragStart = () => {
        setIsDragging(true);
        setIsPaused(true);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        
        const vw = window.innerWidth;
        const cardFullWidth = (vw * CARD_WIDTH_RATIO) + GAP;
        const finalX = x.get();
        const nearestIndex = Math.round(Math.abs(finalX) / cardFullWidth);
        const wrappedIndex = nearestIndex % ALL_REVIEWS.length;
        
        setCurrentIndex(wrappedIndex);
        x.set(-wrappedIndex * cardFullWidth);

        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 3000); // 3s pause
    };

    // Initial fill or resize reset - Start with a full grid as requested
    useEffect(() => {
        const initialSlots = ALL_REVIEWS.slice(0, maxSlots).map((review, i) => ({
            review,
            id: `init-${i}`
        }));
        setSlots(initialSlots);
        nextRef.current = maxSlots % ALL_REVIEWS.length;
        replaceRef.current = 0;
    }, [maxSlots]);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextReview = ALL_REVIEWS[nextRef.current];
            const uniqueId = `swap-${nextRef.current}-${Date.now()}`;
            
            setSlots(prev => {
                const newSlots = [...prev];
                // Ensure we handle the case where slots might not be fully initialized yet
                if (newSlots.length > 0) {
                    newSlots[replaceRef.current] = { review: nextReview, id: uniqueId };
                }
                return newSlots;
            });
            
            replaceRef.current = (replaceRef.current + 1) % maxSlots;
            nextRef.current = (nextRef.current + 1) % ALL_REVIEWS.length;
        }, 1500);

        return () => clearInterval(interval);
    }, [maxSlots]);

    return (
        <section className={`pt-10 pb-16 md:pt-16 md:pb-32 relative overflow-hidden transition-colors duration-500
            ${isDark ? 'bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5' : 'bg-slate-100 border-t border-slate-200'}`}>
            
            {/* Background mesh - matching original style */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-30 ${isDark ? 'invert brightness-200' : ''}`} style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 transition-colors
                    ${isDark ? 'bg-blue-600/5' : 'bg-white'}`} />
                <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 transition-colors
                    ${isDark ? 'bg-amber-600/5' : 'bg-slate-200/50'}`} />
            </div>

            <div className={`max-w-[1440px] mx-auto relative z-10 px-0 md:px-8`}>

                <div className="text-center mb-16 md:mb-24">
                    <div className="flex-1">
                        {isMobile ? (
                            <h2 className={`text-4xl font-extrabold tracking-tighter uppercase leading-[0.9] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                transformed by <br/>
                                <span className="lowercase"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                            </h2>
                        ) : (
                            <ScrollDarkenHeading sizeClass="text-5xl md:text-7xl" variant={variant} uppercase={false}>
                                transformed by <span className="font-black tracking-tighter"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                            </ScrollDarkenHeading>
                        )}
                    </div>
                </div>

                {/* Display Logic: Mobile Swipe Carousel vs Desktop Grid */}
                {isMobile ? (
                    <div className="w-full">
                        <motion.div 
                            className="flex gap-2 -mx-2 pt-4 pb-14 no-scrollbar cursor-grab active:cursor-grabbing"
                            animate={{ x: x.get() }}
                            transition={isDragging ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
                            drag="x"
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            {/* Pro Infinite Loop: Tripled for safe manual/auto boundaries */}
                            {[...ALL_REVIEWS, ...ALL_REVIEWS, ...ALL_REVIEWS].map((review, i) => (
                                <div key={i} className="shrink-0 w-[46vw]">
                                    <ReviewCard 
                                        review={review} 
                                        index={i} 
                                        variant={variant} 
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    /* Professional Grid Display with Fixed Slots (Desktop only) */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 justify-items-center items-start min-h-[400px] md:min-h-[700px] max-w-fit mx-auto">
                        {slots.map((slot, i) => (
                            <div key={i} className="w-full flex justify-center min-h-[360px] md:min-h-[420px]">
                                <AnimatePresence mode="popLayout">
                                    {slot && (
                                        <motion.div
                                            key={slot.id}
                                            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, scale: 0.9, y: -30, filter: 'blur(15px)', transition: { duration: 0.3 } }}
                                            transition={{ 
                                                type: "spring",
                                                stiffness: 150,
                                                damping: 20
                                            }}
                                            className="w-full flex justify-center"
                                        >
                                            <ReviewCard review={slot.review} index={i} variant={variant} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SuccessStories;
