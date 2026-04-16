import React, { useMemo, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

import boy1 from '../../assets/avatars/boy1.jpg';
import boy2 from '../../assets/avatars/boy2.jpg';
import boy3 from '../../assets/avatars/boy3.avif';
import boy4 from '../../assets/avatars/boy4.avif';
import girl1 from '../../assets/avatars/girl1.jpg';
import girl2 from '../../assets/avatars/girl2.avif';
import girl3 from '../../assets/avatars/girl3.avif';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Aryan",
        role: "Student, Class 10",
        avatar: boy1,
        rating: 5,
        highlight: "Outstanding Learning Journey",
        content: "Before thinkskool I thought AI was something only PhDs could understand. Now I have a chatbot I built sitting on my laptop.",
        tags: ["AI", "ML", "Chatbot"],
        achievement: "Built personal AI chatbot",
        color: "blue",
    },
    {
        id: 2,
        name: "Priya",
        role: "Student, Class 9",
        avatar: girl1,
        rating: 5,
        highlight: "Exceptional Mentorship",
        content: "The mentors push you to think. Every time I got stuck they asked me questions instead of giving me the answer. That changed how I learn.",
        tags: ["Mentorship", "Problem Solving"],
        achievement: "Improved critical thinking",
        color: "emerald",
    },
    {
        id: 3,
        name: "Rohan",
        role: "Student, Class 8",
        avatar: boy2,
        rating: 5,
        highlight: "Hardware Mastery",
        content: "I was sure it would be too hard. My IoT device is now sitting on my desk and I programmed the whole thing. Still can't believe it.",
        tags: ["IoT", "Hardware", "Coding"],
        achievement: "Programmed IoT device",
        color: "purple",
    },
    {
        id: 4,
        name: "Sneha's Mother",
        role: "Parent, Class 11",
        avatar: girl2,
        rating: 5,
        highlight: "Remarkable Confidence Shift",
        content: "Within three weeks my daughter was explaining machine learning concepts to me at dinner. The confidence shift was remarkable.",
        tags: ["Confidence", "Parent's View"],
        achievement: "Excellent performance",
        color: "rose",
    },
    {
        id: 5,
        name: "Kushagra",
        role: "Student, Class 10",
        avatar: boy3,
        rating: 5,
        highlight: "Logical Thinking",
        content: "The course enhanced my logical thinking abilities tremendously. The problem-solving exercises and algorithmic challenges were particularly beneficial.",
        tags: ["Logic", "AI"],
        achievement: "Strong grasp of concepts",
        color: "amber",
    },
    {
        id: 6,
        name: "Ananya",
        role: "Student, Class 9",
        avatar: girl3,
        rating: 5,
        highlight: "Future Ready Skills",
        content: "This course exceeded all my expectations. The curriculum covers everything from basic concepts to advanced applications.",
        tags: ["AI", "Future Skills"],
        achievement: "Good progress",
        color: "indigo",
    },
];

const colorMap = {
    blue: { gradient: "from-blue-500 to-cyan-500", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
    emerald: { gradient: "from-emerald-500 to-cyan-500", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
    purple: { gradient: "from-purple-500 to-pink-500", border: "border-purple-500/30", glow: "shadow-purple-500/20" },
    rose: { gradient: "from-rose-500 to-orange-500", border: "border-rose-500/30", glow: "shadow-rose-500/20" },
    amber: { gradient: "from-amber-500 to-yellow-500", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
    indigo: { gradient: "from-indigo-500 to-purple-500", border: "border-indigo-500/30", glow: "shadow-indigo-500/20" },
};

const ReviewCard = ({ review }) => {
    const colors = colorMap[review.color] || colorMap.blue;
    
    return (
        <div className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[450px] h-[336px]">
            <div className={`
                relative rounded-2xl p-6 border ${colors.border} bg-white/5 backdrop-blur-sm
                hover:bg-white/10 transition-all duration-300 hover:shadow-lg ${colors.glow}
                h-full flex flex-col
            `}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl border border-white/10 overflow-hidden shadow-lg bg-slate-800`}>
                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white">{review.name}</h4>
                        <p className="text-xs text-slate-400">{review.role}</p>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                    "{review.highlight}"
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {review.content}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                    {review.tags.map((tag) => (
                        <span 
                            key={tag} 
                            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 font-medium">{review.achievement}</p>
                </div>
            </div>
        </div>
    );
};

const TestimonialsSection = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef(null);
    const mobileScrollRef = useRef(null);
    const controls = useAnimation();
    const controls2 = useAnimation();

    const handleScroll = (direction) => {
        if (mobileScrollRef.current) {
            const scrollAmount = 280;
            mobileScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const duplicatedReviews = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
    const cardWidth = 350 + 24; // width + gap

    useEffect(() => {
        if (isMobile) return;
        
        const distance = -cardWidth * TESTIMONIALS.length * 2;
        
        controls.start({
            x: [0, distance],
            transition: {
                duration: 80,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
            }
        });

        // Second animation in opposite direction
        controls2.start({
            x: [distance, 0],
            transition: {
                duration: 80,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
            }
        });
    }, [isMobile, controls, controls2, cardWidth]);

    if (isMobile) {
        return (
            <section className="py-20 px-0 relative overflow-hidden bg-black">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
                </div>

                <div className="w-full relative z-10">
                    {/* Top Tapered Luminating Divider */}
                    <div className="pt-8 mb-20 flex justify-center relative">
                        <div className="w-[70%] h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent relative z-10">
                            <div className="absolute inset-0 bg-blue-400 blur-[8px] opacity-50" />
                            {/* Central Glow Node */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_#3b82f6,0_0_30px_#3b82f6]" />
                        </div>
                    </div>

                    <div className="mb-6 px-6">
                        <motion.h2 
                            className="text-2xl font-black text-white tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Impact</span>
                        </motion.h2>
                    </div>

                    <div 
                        ref={mobileScrollRef}
                        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-6 snap-x snap-mandatory scrollbar-hide"
                    >
                        {TESTIMONIALS.map((review) => {
                            const colors = colorMap[review.color] || colorMap.blue;
                            return (
                                <div 
                                    key={review.id} 
                                    className="flex-shrink-0 w-[260px] sm:w-[280px] snap-center"
                                >
                                    <div className={`
                                        relative rounded-xl p-4 border ${colors.border} bg-white/5 backdrop-blur-sm
                                    `}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-lg border border-white/10 overflow-hidden bg-slate-800`}>
                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{review.name}</h4>
                                                <p className="text-[10px] text-slate-400">{review.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={10} 
                                                    className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} 
                                                />
                                            ))}
                                        </div>

                                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                            {review.content}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {review.tags.slice(0, 2).map((tag) => (
                                                <span 
                                                    key={tag} 
                                                    className="text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-slate-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button 
                            onClick={() => handleScroll('left')} 
                            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white active:scale-95 transition-transform shadow-xl"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => handleScroll('right')} 
                            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white active:scale-95 transition-transform shadow-xl"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Tapered Luminating Divider */}
                    <div className="mt-32 mb-0 flex justify-center relative">
                        <div className="w-[70%] h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent relative z-10">
                            <div className="absolute inset-0 bg-blue-400 blur-[8px] opacity-50" />
                            {/* Central Glow Node */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_#3b82f6,0_0_30px_#3b82f6]" />
                        </div>
                    </div>
                </div>

                <style>{`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                `}</style>
            </section>
        );
    }

    return (
        <section className="py-24 px-0 relative overflow-hidden bg-black">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
            </div>

            <div className="w-full relative z-10 px-0">
                <div className="text-center mb-12">
                    <motion.h2 
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Real Students. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Real Impact.</span>
                    </motion.h2>
                    <p className="text-lg text-slate-500 font-light tracking-wide">
                        See what our students say about their learning experience.
                    </p>
                </div>

                <div 
                    className="overflow-hidden py-8"
                    ref={containerRef}
                >
                    <motion.div 
                        className="flex gap-4 sm:gap-6 lg:gap-8"
                        animate={controls}
                    >
                        {duplicatedReviews.map((review, index) => (
                            <ReviewCard key={`${review.id}-${index}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                {/* Second row with opposite direction animation */}
                <div className="overflow-hidden py-8">
                    <motion.div 
                        className="flex gap-4 sm:gap-6 lg:gap-8"
                        animate={controls2}
                    >
                        {duplicatedReviews.map((review, index) => (
                            <ReviewCard key={`${review.id}-second-${index}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-8 mt-12">
                    <div className="text-center">
                        <div className="text-3xl font-black text-white">4.9</div>
                        <div className="flex justify-center mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-500">Avg Rating</div>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="text-center">
                        <div className="text-3xl font-black text-white">500+</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-500">Reviews</div>
                    </div>
                </div>
            </div>

            <style>{`
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
};

export default TestimonialsSection;

