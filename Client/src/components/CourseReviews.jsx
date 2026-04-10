import React, { useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Star } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const AI_REVIEWS = [
    {
        id: 1,
        name: "Manav",
        role: "Student, STEPUP SCHOOL",
        avatar: "M",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Outstanding Learning Journey",
        content: "The course has been an outstanding learning journey. I gained a solid understanding of AI fundamentals and practical applications.",
        tags: ["AI", "ML", "Python"],
        achievement: "Completed course successfully",
        color: "blue",
    },
    {
        id: 2,
        name: "Priya",
        role: "Student, STEPUP SCHOOL",
        avatar: "P",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Exceptional Teaching Methodology",
        content: "I understood every concept thoroughly. The teaching methodology is exceptional, breaking down complex topics into digestible segments.",
        tags: ["AI", "ML", "Understanding"],
        achievement: "Strong grasp of concepts",
        color: "emerald",
    },
    {
        id: 3,
        name: "Kushagra",
        role: "Student, STEPUP SCHOOL",
        avatar: "K",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Excellent Logical Thinking",
        content: "The course enhanced my logical thinking abilities tremendously. The problem-solving exercises and algorithmic challenges were particularly beneficial.",
        tags: ["Logic", "Problem Solving", "AI"],
        achievement: "Excellent logical thinking",
        color: "purple",
    },
    {
        id: 4,
        name: "Ananya",
        role: "Student, STEPUP SCHOOL",
        avatar: "A",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Comprehensive Excellence",
        content: "This course exceeded all my expectations. The curriculum covers everything from basic concepts to advanced applications.",
        tags: ["AI", "ML", "Excellence"],
        achievement: "Excellent performance",
        color: "rose",
    },
    {
        id: 5,
        name: "Shutanh",
        role: "Student, STEPUP SCHOOL",
        avatar: "S",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Impressive Educational Quality",
        content: "I'm thoroughly impressed with the quality of education provided. The course structure, teaching methods, and supporting materials are all top-notch.",
        tags: ["AI", "ML", "Learning"],
        achievement: "Good progress",
        color: "amber",
    },
    {
        id: 6,
        name: "Rahul",
        role: "Student, STEPUP SCHOOL",
        avatar: "R",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Career Transformation",
        content: "This course transformed my career. From a non-tech background, I now work as an AI Engineer at a top company.",
        tags: ["Career", "Growth", "AI"],
        achievement: "Got placed as AI Engineer",
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
        <div className="flex-shrink-0 w-[350px] h-[336px]">
            <div className={`
                relative rounded-2xl p-6 border ${colors.border} bg-white/5 backdrop-blur-sm
                hover:bg-white/10 transition-all duration-300 hover:shadow-lg ${colors.glow}
                h-full flex flex-col
            `}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <span className="text-lg font-bold text-white">{review.avatar}</span>
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

const CourseReviews = ({ courseId, variant }) => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const containerRef = useRef(null);
    const controls = useAnimation();

    if (courseId !== '1') return null;

    const duplicatedReviews = [...AI_REVIEWS, ...AI_REVIEWS, ...AI_REVIEWS];
    const cardWidth = 350 + 24; // width + gap

    useEffect(() => {
        if (isMobile) return;
        
        const distance = -cardWidth * AI_REVIEWS.length * 2;
        
        controls.start({
            x: [0, distance],
            transition: {
                duration: 80,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
            }
        });
    }, [isMobile, controls, cardWidth]);

    if (isMobile) {
        return (
            <section className="py-8 px-0 relative overflow-hidden bg-black">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
                </div>

                <div className="w-full relative z-10">
                    <div className="text-center mb-8">
                        <motion.h2 
                            className="text-3xl font-black text-white mb-2 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Reviews</span>
                        </motion.h2>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
                        {AI_REVIEWS.map((review) => {
                            const colors = colorMap[review.color] || colorMap.blue;
                            return (
                                <div 
                                    key={review.id} 
                                    className="flex-shrink-0 w-[280px] snap-center"
                                >
                                    <div className={`
                                        relative rounded-xl p-4 border ${colors.border} bg-white/5 backdrop-blur-sm
                                    `}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                                                <span className="text-sm font-bold text-white">{review.avatar}</span>
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
        <section className="py-16 px-0 relative overflow-hidden bg-black">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.h2 
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Reviews</span>
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
                        className="flex gap-6"
                        animate={controls}
                    >
                        {duplicatedReviews.map((review, index) => (
                            <ReviewCard key={`${review.id}-${index}`} review={review} />
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
                        <div className="text-3xl font-black text-white">200+</div>
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

export default CourseReviews;