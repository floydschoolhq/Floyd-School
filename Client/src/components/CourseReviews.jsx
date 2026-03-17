import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, Brain, Cpu, Zap } from 'lucide-react';

const AI_REVIEWS = [
    {
        id: 1,
        name: "Manav",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manav",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Good",
        content: "Good",
        tags: ["AI", "ML", "Python"],
        achievement: "Completed course successfully",
        color: "blue",
    },
    {
        id: 2,
        name: "Samyak",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samyak",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Understood Everything",
        content: "Understood Everything (Good)",
        tags: ["AI", "ML", "Understanding"],
        achievement: "Strong grasp of concepts",
        color: "emerald",
    },
    {
        id: 3,
        name: "Kushagra",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kushagra",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Excellent Logics",
        content: "Excellent Logics (good)",
        tags: ["Logic", "Problem Solving", "AI"],
        achievement: "Excellent logical thinking",
        color: "purple",
    },
    {
        id: 4,
        name: "Aayar",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aayar",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Excellent",
        content: "Excellent",
        tags: ["AI", "ML", "Excellence"],
        achievement: "Excellent performance",
        color: "rose",
    },
    {
        id: 5,
        name: "Shutanh",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shutanh",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Nice",
        content: "Nice",
        tags: ["AI", "ML", "Learning"],
        achievement: "Good progress",
        color: "amber",
    },
    {
        id: 6,
        name: "Anant",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anant",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Good Progress",
        content: "Good Progress in less time",
        tags: ["AI", "ML", "Progress"],
        achievement: "Rapid progress achieved",
        color: "blue",
    },
    {
        id: 7,
        name: "Kavyansh",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavyansh",
        rating: 2,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Good",
        content: "Good",
        tags: ["AI", "ML", "Basics"],
        achievement: "Completed fundamentals",
        color: "emerald",
    },
    {
        id: 8,
        name: "Arnav Kumar",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArnavKumar",
        rating: 2,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Good",
        content: "Good",
        tags: ["AI", "ML", "Foundation"],
        achievement: "Strong foundation built",
        color: "purple",
    },
    {
        id: 9,
        name: "Laksh Chaudhary",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LakshChaudhary",
        rating: 2.5,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "So Good",
        content: "So Good",
        tags: ["AI", "ML", "Skills"],
        achievement: "Good skill development",
        color: "rose",
    },
    {
        id: 10,
        name: "Ranveer Sharma",
        role: "Student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RanveerSharma",
        rating: 3,
        course: "AI & Machine Learning",
        batch: "Current Batch",
        highlight: "Good but not everything new",
        content: "Good but not evething new",
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
    return (
        <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl transition-all duration-500
                ${isDark 
                    ? 'bg-white/[0.03] border border-white/10' 
                    : 'bg-white border border-slate-100 shadow-slate-200/50'}`}
        >
            {/* Radial glow bg */}
            <div className={`absolute -top-24 -right-24 w-[350px] h-[350px] rounded-full bg-gradient-to-br ${c.glow} via-transparent to-transparent blur-3xl pointer-events-none`} />

            {/* Giant watermark quote */}
            <div className={`absolute -bottom-6 -right-4 pointer-events-none transition-colors duration-500
                ${isDark ? 'text-white/[0.02]' : 'text-slate-50'}`}>
                <Quote size={160} fill="currentColor" />
            </div>

            <div className="relative z-10 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-2xl blur-md ${c.glow} bg-gradient-to-br`} />
                            <img
                                src={review.avatar}
                                alt={review.name}
                                className="relative w-16 h-16 rounded-2xl border-2 border-white shadow-lg object-cover"
                            />
                            <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full ${c.dot} border-2 border-white flex items-center justify-center`}>
                                <Zap size={9} className="text-white fill-current" />
                            </div>
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                            <p className={`text-[11px] font-semibold uppercase tracking-widest mt-0.5 ${isDark ? 'text-blue-500' : c.highlight}`}>{review.role}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <StarRating rating={review.rating} colorClass={isDark ? 'text-blue-500' : c.star} />
                                <span className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{review.batch}</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievement badge */}
                    <div className={`md:ml-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-semibold self-start transition-all
                        ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : `${c.badge}`}`}>
                        <Sparkles size={12} />
                        <span>{review.achievement}</span>
                    </div>
                </div>

                {/* Highlight */}
                <div>
                    <h3 className={`text-xl md:text-2xl font-black tracking-tighter uppercase mb-4 transition-colors
                        ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        "{review.highlight}"
                    </h3>
                </div>
 
                {/* Body */}
                <p className={`text-[15px] leading-relaxed font-normal transition-colors
                    ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {review.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {review.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all
                            ${isDark ? 'bg-white/5 text-slate-400 border border-white/5' : c.tag}`}>
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
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden
                ${isActive
                    ? isDark ? 'border-orange-500/50 bg-white/5 shadow-xl shadow-black/40' : 'border-slate-300 bg-white shadow-lg shadow-slate-200/60'
                    : isDark ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]' : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200"
                }`}
        >
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${isDark ? 'bg-orange-500' : c.dot}`}
                />
            )}
            <div className="flex items-center gap-3 pl-2">
                <img
                    src={review.avatar}
                    alt={review.name}
                    className={`w-9 h-9 rounded-xl object-cover border transition-all
                        ${isDark ? 'border-white/10' : 'border-slate-100'}`}
                />
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</p>
                    <p className={`text-[10px] font-medium uppercase tracking-widest truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{review.role}</p>
                </div>
                <StarRating rating={review.rating} colorClass={isDark ? 'text-blue-500' : c.star} />
            </div>
            {isActive && (
                <p className="text-[12px] text-slate-500 mt-3 pl-2 line-clamp-2 leading-relaxed">
                    {review.highlight}
                </p>
            )}
        </motion.button>
    );
};

const CourseReviews = ({ courseId, variant }) => {
    const isDark = variant === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);

    // Only show this section for the AI course (id = '1')
    if (courseId !== '1') return null;

    const handlePrev = () => setActiveIndex(i => (i - 1 + AI_REVIEWS.length) % AI_REVIEWS.length);
    const handleNext = () => setActiveIndex(i => (i + 1) % AI_REVIEWS.length);

    const active = AI_REVIEWS[activeIndex];

    return (
        <section className={`py-24 md:py-32 relative overflow-hidden transition-all duration-500
            ${isDark ? 'bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5' : 'bg-white border-t border-slate-100'}`}>
            {/* Background mesh */}
            <div className={`absolute inset-0 pointer-events-none opacity-30 ${isDark ? 'invert brightness-200' : ''}`}
                style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 transition-colors
                ${isDark ? 'bg-blue-600/5' : 'bg-blue-50'}`} />
            <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 transition-colors
                ${isDark ? 'bg-amber-600/5' : 'bg-indigo-50'}`} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-widest mb-6 transition-all
                        ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Brain size={12} />
                        <span>Student Voices</span>
                    </div>
                    <h2 className={`text-3xl md:text-5xl font-black tracking-tight uppercase leading-none mb-4 transition-colors
                        ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Course <span className={isDark ? 'text-blue-500' : 'text-blue-600'}>Reviews</span> & Feedback
                    </h2>
                    <p className={`text-lg max-w-xl mx-auto font-medium transition-colors
                        ${isDark ? 'text-slate-400' : 'text-slate-50'}`}>
                        Real stories from students who mastered AI & Machine Learning with us.
                    </p>

                    {/* Aggregate stats */}
                    <div className="flex items-center justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className={`text-3xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>4.9</div>
                            <div className="flex justify-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Avg Rating</div>
                        </div>
                        <div className={`w-px h-12 transition-colors ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                        <div className="text-center">
                            <div className={`text-3xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>200+</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Reviews</div>
                        </div>
                        <div className={`w-px h-12 transition-colors ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                        <div className="text-center">
                            <div className={`text-3xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>94%</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Placement Rate</div>
                        </div>
                    </div>
                </div>

                {/* Main layout: Featured card + sidebar */}
                <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
                    {/* Featured review */}
                    <div>
                        <AnimatePresence mode="wait">
                            <FeaturedCard key={active.id} review={active} variant={variant} />
                        </AnimatePresence>
 
                        {/* Navigation controls */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex gap-2">
                                {AI_REVIEWS.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`transition-all duration-300 rounded-full ${
                                            i === activeIndex
                                                ? isDark ? "w-6 h-2 bg-orange-500" : "w-6 h-2 bg-blue-600"
                                                : isDark ? "w-2 h-2 bg-white/10 hover:bg-white/20" : "w-2 h-2 bg-slate-200 hover:bg-slate-400"
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
                            All Reviews ({AI_REVIEWS.length})
                        </p>
                        {AI_REVIEWS.map((review, i) => (
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
