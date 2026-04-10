import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, Brain, Cpu, Zap } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const AI_REVIEWS = [
    {
        id: 1,
        name: "Manav",
        role: "Student, STEPUP SCHOOL",
        avatar: "M",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Outstanding Learning Journey",
        content: "The course has been an outstanding learning journey. I gained a solid understanding of AI fundamentals and practical applications. The instructors are exceptional and the hands-on projects really helped me grasp complex concepts.",
        tags: ["AI", "ML", "Python"],
        achievement: "Completed course successfully",
        color: "blue",
        category: "Non-tech to Tech",
        text: "The course has been an outstanding learning journey. I gained a solid understanding of AI fundamentals and practical applications.",
        before: "Beginner",
        after: "AI Developer",
    },
    {
        id: 2,
        name: "Priya",
        role: "Student, STEPUP SCHOOL",
        avatar: "P",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Exceptional Teaching Methodology",
        content: "I understood every concept thoroughly. The teaching methodology is exceptional, breaking down complex topics into digestible segments. The practical examples and real-world applications made learning engaging and memorable.",
        tags: ["AI", "ML", "Understanding"],
        achievement: "Strong grasp of concepts",
        color: "emerald",
        category: "Tier 2/3 Colleges",
        text: "I understood every concept thoroughly. The teaching methodology is exceptional.",
        before: "Tier 3 Student",
        after: "AI Engineer",
    },
    {
        id: 3,
        name: "Kushagra",
        role: "Student, STEPUP SCHOOL",
        avatar: "K",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Excellent Logical Thinking",
        content: "The course enhanced my logical thinking abilities tremendously. The problem-solving exercises and algorithmic challenges were particularly beneficial. I'm now confident in applying AI concepts to real-world scenarios.",
        tags: ["Logic", "Problem Solving", "AI"],
        achievement: "Excellent logical thinking",
        color: "purple",
        category: "Bootcamp",
        text: "The course enhanced my logical thinking abilities tremendously.",
        before: "Student",
        after: "ML Specialist",
    },
    {
        id: 4,
        name: "Ananya",
        role: "Student, STEPUP SCHOOL",
        avatar: "A",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Comprehensive Excellence",
        content: "This course exceeded all my expectations. The curriculum covers everything from basic concepts to advanced applications. The quality of teaching and the depth of knowledge shared is truly remarkable.",
        tags: ["AI", "ML", "Excellence"],
        achievement: "Excellent performance",
        color: "rose",
        category: "Upskilling",
        text: "This course exceeded all my expectations. The curriculum covers everything from basic concepts to advanced applications.",
        before: "Developer",
        after: "AI Expert",
    },
    {
        id: 5,
        name: "Shutanh",
        role: "Student, STEPUP SCHOOL",
        avatar: "S",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Impressive Educational Quality",
        content: "I'm thoroughly impressed with the quality of education provided. The course structure, teaching methods, and supporting materials are all top-notch. This has been a transformative learning experience for me.",
        tags: ["AI", "ML", "Learning"],
        achievement: "Good progress",
        color: "amber",
        category: "Non-tech to Tech",
        text: "I'm thoroughly impressed with the quality of education provided.",
        before: "Non-tech Student",
        after: "Data Scientist",
    },
];

const categories = [
    "Non-tech to Tech",
    "Tier 2/3 Colleges", 
    "Bootcamp",
    "Upskilling"
];

const colorMap = {
    blue: {
        badge: "bg-blue-50 text-blue-600 border-blue-100",
        star: "text-blue-500",
        glow: "from-blue-500/10",
        border: "hover:border-blue-200",
        tag: "bg-blue-50 text-blue-600",
        highlight: "text-blue-600",
        dot: "bg-blue-500",
    },
    emerald: {
        badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
        star: "text-emerald-500",
        glow: "from-emerald-500/10",
        border: "hover:border-emerald-200",
        tag: "bg-emerald-50 text-emerald-600",
        highlight: "text-emerald-600",
        dot: "bg-emerald-500",
    },
    purple: {
        badge: "bg-purple-50 text-purple-600 border-purple-100",
        star: "text-purple-500",
        glow: "from-purple-500/10",
        border: "hover:border-purple-200",
        tag: "bg-purple-50 text-purple-600",
        highlight: "text-purple-600",
        dot: "bg-purple-500",
    },
    rose: {
        badge: "bg-rose-50 text-rose-600 border-rose-100",
        star: "text-rose-500",
        glow: "from-rose-500/10",
        border: "hover:border-rose-200",
        tag: "bg-rose-50 text-rose-600",
        highlight: "text-rose-600",
        dot: "bg-rose-500",
    },
    amber: {
        badge: "bg-amber-50 text-amber-600 border-amber-100",
        star: "text-amber-500",
        glow: "from-amber-500/10",
        border: "hover:border-amber-200",
        tag: "bg-amber-50 text-amber-600",
        highlight: "text-amber-600",
        dot: "bg-amber-500",
    },
    indigo: {
        badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
        star: "text-indigo-500",
        glow: "from-indigo-500/10",
        border: "hover:border-indigo-200",
        tag: "bg-indigo-50 text-indigo-600",
        highlight: "text-indigo-600",
        dot: "bg-indigo-500",
    },
};

const StarRating = ({ rating, colorClass }) => (
    <div className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? colorClass : "text-slate-200"}
                fill={i < rating ? "currentColor" : "none"}
            />
        ))}
    </div>
);

const FeaturedCard = ({ review, variant }) => {
    const isDark = variant === 'dark';
    const c = colorMap[review.color];
    const isMobile = useIsMobile();
    
    if (isMobile) {
        return (
            <div className="min-w-[85%] snap-center rounded-2xl p-5 bg-white/[0.03] border border-white/10">
                {/* Profile */}
                <div className="flex items-center gap-3">
                    <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        loading="lazy"
                    />
                    <div>
                        <p className="font-semibold text-sm text-white">{review.name}</p>
                        <p className="text-xs text-slate-400">{review.role}</p>
                    </div>
                </div>

                {/* Text */}
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                    {review.text}
                </p>

                {/* Before After */}
                <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                    <span>{review.before}</span>
                    <span className="text-cyan-400">→</span>
                    <span>{review.after}</span>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-white/[0.06] bg-white/[0.02]"
        >
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border border-white/10">
                        <span className="text-lg font-bold text-white">{review.avatar}</span>
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white/90">{review.name}</h4>
                        <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5 text-cyan-500/70">{review.role}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <StarRating rating={review.rating} colorClass="text-cyan-500" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{review.batch}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        "{review.highlight}"
                    </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                    {review.content}
                </p>

                <div className="flex flex-wrap gap-2">
                    {review.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const MiniCard = ({ review, isActive, onClick, variant }) => {
    const isDark = variant === 'dark';
    const c = colorMap[review.color];
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <motion.button
                onClick={onClick}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 backdrop-blur-lg ${
                    isActive
                        ? isDark ? 'border-blue-500/40 bg-blue-500/10 shadow-xl shadow-black/20' : 'border-blue-200 bg-white shadow-lg shadow-slate-100'
                        : isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'
                }`}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        <span className="text-sm font-bold text-white">{review.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0 text-center">
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{review.role}</p>
                    </div>
                </div>
            </motion.button>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300
                ${isActive
                    ? 'border-cyan-500/30 bg-cyan-500/5'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border border-white/10">
                    <span className="text-xs font-bold text-white">{review.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/80 truncate">{review.name}</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest truncate mt-0.5 text-slate-500">{review.role}</p>
                </div>
                <StarRating rating={review.rating} colorClass="text-cyan-500" />
            </div>
            {isActive && (
                <p className="text-[12px] text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {review.highlight}
                </p>
            )}
        </motion.button>
    );
};

const CourseReviews = ({ courseId, variant }) => {
    const navigate = useNavigate();
    const isDark = variant === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);
    const isMobile = useIsMobile();

    // Only show this section for the AI course (id = '1')
    if (courseId !== '1') return null;

    const handlePrev = useCallback(() => {
        setActiveIndex(i => (i - 1 + AI_REVIEWS.length) % AI_REVIEWS.length);
    }, []);

    const handleNext = useCallback(() => {
        setActiveIndex(i => (i + 1) % AI_REVIEWS.length);
    }, []);

    const active = useMemo(() => AI_REVIEWS[activeIndex], [activeIndex]);
    
    // Memoize mobile reviews to prevent re-renders
    const mobileReviews = useMemo(() => AI_REVIEWS.slice(0, 5), []);

    return (
        <section className="py-0 px-0 relative overflow-hidden bg-black">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
            </div>

            <div className={`${isMobile ? 'w-full' : 'max-w-7xl mx-auto'} relative z-10`}>
                {/* Section Header */}
                <div className={`text-center ${isMobile ? 'mb-0' : 'mb-16'}`}>
                    <motion.h2 
                        className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-[1.1]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Reviews</span>
                    </motion.h2>
                    {!isMobile && (
                        <p className="text-lg text-slate-500 font-light tracking-wide max-w-xl mx-auto">
                            Real stories from students who mastered AI & Machine Learning with us.
                        </p>
                    )}

                    {/* Aggregate stats - Desktop only */}
                    {!isMobile && (
                        <div className="flex items-center justify-center gap-8 mt-10">
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">4.9</div>
                                <div className="flex justify-center mt-1">
                                    {[...Array(3)].map((_, i) => (
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
                    )}
                </div>

                {isMobile ? (
                    <div className="bg-black text-white py-0 px-0">
                        {/* Heading */}
                        <h2 className="text-center mb-6 text-slate-500 italic" style={{ fontFamily: 'cursive', fontSize: '20px' }}>
                            Stories from people like you
                        </h2>

                        
                        {/* Swipe Cards */}
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                            {mobileReviews.map((review, i) => (
                                <FeaturedCard key={review.id} review={review} variant={variant} />
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center mt-4 gap-2">
                            {mobileReviews.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 w-2 rounded-full transition ${
                                        i === activeIndex ? "bg-cyan-400 w-4" : "bg-white/20"
                                    }`}
                                />
                            ))}
                        </div>

                        {/* CTA */}
                        <button 
                            onClick={() => {
                                navigate(`/course/${courseId}?openRegistration=true`);
                            }}
                            className="mt-6 w-full py-3 rounded-xl font-semibold 
                            bg-gradient-to-r from-cyan-500 to-blue-500 
                            hover:opacity-90 transition">
                            Enroll Now
                        </button>

                        {/* Hide scrollbar */}
                        <style jsx>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
                        {/* Featured review */}
                        <div>
                            <FeaturedCard key={active.id} review={active} variant={variant} />
    
                            {/* Navigation controls */}
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex gap-2">
                                    {AI_REVIEWS.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIndex(i)}
                                            className={`transition-all duration-300 rounded-full ${
                                                i === activeIndex
                                                    ? "w-6 h-2 bg-blue-600"
                                                    : "w-2 h-2 bg-white/10 hover:bg-white/20"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePrev}
                                        className={`w-10 h-10 rounded-2xl border transition-all group flex items-center justify-center
                                            ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                                    >
                                        <ChevronLeft size={18} className={`transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className={`w-10 h-10 rounded-2xl border transition-all group flex items-center justify-center
                                            ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                                    >
                                        <ChevronRight size={18} className={`transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar – all reviewers list */}
                        <div className="flex flex-col gap-3 lg:max-h-[600px] lg:overflow-y-auto custom-scroll pr-1">
                            <p className={`text-[10px] font-black uppercase tracking-[0.25em] px-1 mb-1 transition-colors
                                ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                Featured Reviews
                            </p>
                            {AI_REVIEWS.slice(0, 5).map((review, i) => (
                                <MiniCard
                                    key={review.id}
                                    review={review}
                                    isActive={i === activeIndex}
                                    onClick={() => setActiveIndex(i)}
                                    variant={variant}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
};

export default CourseReviews;
