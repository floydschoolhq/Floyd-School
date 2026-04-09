import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, Brain, Cpu, Zap } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const AI_REVIEWS = [
    {
        id: 1,
        name: "Manav",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ManavBoy",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Outstanding Learning Journey",
        content: "The course has been an outstanding learning journey. I gained a solid understanding of AI fundamentals and practical applications. The instructors are exceptional and the hands-on projects really helped me grasp complex concepts.",
        tags: ["AI", "ML", "Python"],
        achievement: "Completed course successfully",
        color: "blue",
    },
    {
        id: 2,
        name: "Samyak",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samyak",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Exceptional Teaching Methodology",
        content: "I understood every concept thoroughly. The teaching methodology is exceptional, breaking down complex topics into digestible segments. The practical examples and real-world applications made learning engaging and memorable.",
        tags: ["AI", "ML", "Understanding"],
        achievement: "Strong grasp of concepts",
        color: "emerald",
    },
    {
        id: 3,
        name: "Kushagra",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kushagra",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Excellent Logical Thinking",
        content: "The course enhanced my logical thinking abilities tremendously. The problem-solving exercises and algorithmic challenges were particularly beneficial. I'm now confident in applying AI concepts to real-world scenarios.",
        tags: ["Logic", "Problem Solving", "AI"],
        achievement: "Excellent logical thinking",
        color: "purple",
    },
    {
        id: 4,
        name: "Aayar",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aayar",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Comprehensive Excellence",
        content: "This course exceeded all my expectations. The curriculum covers everything from basic concepts to advanced applications. The quality of teaching and the depth of knowledge shared is truly remarkable.",
        tags: ["AI", "ML", "Excellence"],
        achievement: "Excellent performance",
        color: "rose",
    },
    {
        id: 5,
        name: "Shutanh",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shutanh",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Impressive Educational Quality",
        content: "I'm thoroughly impressed with the quality of education provided. The course structure, teaching methods, and supporting materials are all top-notch. This has been a transformative learning experience for me.",
        tags: ["AI", "ML", "Learning"],
        achievement: "Good progress",
        color: "amber",
    },
    {
        id: 6,
        name: "Anant",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anant",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Rapid Skill Development",
        content: "I made significant progress in a short time. The course content is well-paced and the practical assignments helped reinforce theoretical concepts. The instructor's guidance was invaluable throughout the journey.",
        tags: ["AI", "ML", "Progress"],
        achievement: "Rapid progress achieved",
        color: "blue",
    },
    {
        id: 7,
        name: "Kavyansh",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavyansh",
        rating: 2,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Solid Foundation Building",
        content: "The course provided a strong foundation in AI and machine learning concepts. While I had some prior knowledge, I still learned many new techniques and approaches. The fundamentals are explained very clearly.",
        tags: ["AI", "ML", "Basics"],
        achievement: "Completed fundamentals",
        color: "emerald",
    },
    {
        id: 8,
        name: "Arnav Kumar",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArnavKumar",
        rating: 2,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Strong Foundation Established",
        content: "I've built a strong foundation in AI and machine learning. The course covers essential topics comprehensively and the practical exercises helped me understand how to apply these concepts in real projects.",
        tags: ["AI", "ML", "Foundation"],
        achievement: "Strong foundation built",
        color: "purple",
    },
    {
        id: 9,
        name: "Laksh Chaudhary",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LakshChaudhary",
        rating: 2.5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Excellent Skill Development",
        content: "The course has been excellent for skill development. I learned many new techniques and approaches to problem-solving. The hands-on projects were particularly valuable in understanding real-world applications.",
        tags: ["AI", "ML", "Skills"],
        achievement: "Good skill development",
        color: "rose",
    },
    {
        id: 10,
        name: "Ranveer Sharma",
        role: "Student, STEPUP SCHOOL",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RanveerSharma",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Comprehensive Learning Experience",
        content: "Good but not everything new - however, I still gained valuable insights and learned several new approaches. The course content is well-structured and the teaching quality is consistently high throughout.",
        tags: ["AI", "ML", "Experience"],
        achievement: "Completed with good understanding",
        color: "amber",
    },
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
            <motion.div 
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-[2.5rem] p-8 overflow-hidden border backdrop-blur-xl ${
                isDark 
                    ? 'bg-slate-900/30 border-white/10 shadow-2xl shadow-black/40' 
                    : 'bg-white/60 border-slate-200/40 shadow-lg shadow-slate-200/10'
            }`}>
                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl overflow-hidden border p-0.5 shadow-sm ${
                            isDark ? 'border-white/10 bg-slate-800' : 'border-slate-100 bg-white'
                        }`}>
                            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="min-w-0">
                            <h4 className={`text-[15px] font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{review.role}</p>
                        </div>
                    </div>
                    
                    <h3 className={`text-[17px] font-black tracking-tight leading-[1.4] transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                         "{review.highlight}"
                    </h3>

                    <p className={`text-[14px] leading-[1.6] font-medium transition-colors ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                        {review.content}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {review.tags.slice(0, 3).map(tag => (
                            <span key={tag} className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all
                                ${isDark ? 'bg-white/5 text-slate-400 border border-white/5' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            key={review.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
                duration: 0.4, 
                ease: [0.4, 0, 0.2, 1]
            }}
            className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-white/[0.06] bg-white/[0.02]"
            style={{ 
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
            }}
        >
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-14 h-14 rounded-xl border border-white/10 object-cover"
                    />
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
                    <img
                        src={review.avatar}
                        alt={review.name}
                        className={`w-12 h-12 rounded-xl object-cover border ${isDark ? 'border-white/10' : 'border-slate-100'}`}
                    />
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
                <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-9 h-9 rounded-lg object-cover border border-white/10"
                />
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
    const isDark = variant === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Only show this section for the AI course (id = '1')
    if (courseId !== '1') return null;

    const handlePrev = () => setActiveIndex(i => (i - 1 + AI_REVIEWS.length) % AI_REVIEWS.length);
    const handleNext = () => setActiveIndex(i => (i + 1) % AI_REVIEWS.length);

    const active = AI_REVIEWS[activeIndex];
    const isMobile = window.innerWidth < 768;

    // Optimized auto-advance with requestAnimationFrame
    React.useEffect(() => {
        if (isPaused) return;
        
        let animationFrame;
        let lastTime = 0;
        const interval = 2000; // 2 seconds
        
        const animate = (currentTime) => {
            if (currentTime - lastTime >= interval) {
                setActiveIndex(i => (i + 1) % AI_REVIEWS.length);
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
    }, [isPaused, AI_REVIEWS.length]);

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-black">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2 
                        className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-[1.1]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Reviews</span>
                    </motion.h2>
                    <p className="text-lg text-slate-500 font-light tracking-wide max-w-xl mx-auto">
                        Real stories from students who mastered AI & Machine Learning with us.
                    </p>

                    {/* Aggregate stats */}
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
                </div>

                {isMobile ? (
                    <div className="flex flex-col gap-10">
                        <div>
                            <AnimatePresence mode="sync">
                                <FeaturedCard key={active.id} review={active} variant={variant} />
                            </AnimatePresence>
                            
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex gap-1.5">
                                    {AI_REVIEWS.slice(0, 5).map((_, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => setActiveIndex(i)}
                                            className={`rounded-full h-1.5 ${
                                                i === activeIndex
                                                    ? "w-6 bg-gradient-to-r from-cyan-400 to-blue-400"
                                                    : "w-1.5 bg-white/10"
                                            }`}
                                            animate={{
                                                scale: i === activeIndex ? [1, 1.2, 1] : 1,
                                                opacity: i === activeIndex ? 1 : 0.3
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: i === activeIndex ? Infinity : 0,
                                                repeatDelay: 0.5
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handlePrev} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"><ChevronLeft size={18} /></button>
                                    <button onClick={handleNext} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
                        {/* Featured review */}
                        <div 
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <AnimatePresence mode="sync">
                                <FeaturedCard key={active.id} review={active} variant={variant} />
                            </AnimatePresence>
    
                            {/* Navigation controls */}
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex gap-2">
                                    {AI_REVIEWS.map((_, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => setActiveIndex(i)}
                                            className={`rounded-full ${
                                                i === activeIndex
                                                    ? "w-6 h-2 bg-gradient-to-r from-cyan-400 to-blue-400"
                                                    : "w-2 h-2 bg-white/10 hover:bg-white/20"
                                            }`}
                                            animate={{
                                                scale: i === activeIndex ? [1, 1.2, 1] : 1,
                                                opacity: i === activeIndex ? 1 : 0.3
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: i === activeIndex ? Infinity : 0,
                                                repeatDelay: 0.5
                                            }}
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
