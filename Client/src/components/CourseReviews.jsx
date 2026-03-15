import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, Brain, Cpu, Zap } from 'lucide-react';

const AI_REVIEWS = [
    {
        id: 1,
        name: "Rohan Mehta",
        role: "AI Research Intern @ IIT Delhi",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RohanMehta",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Batch Sep '24",
        highlight: "Transformed my understanding of Neural Networks",
        content:
            "The way thinkskool breaks down gradient descent and backpropagation is unlike anything I've seen. I went from basic Python to deploying my own image classifier in 8 weeks. The mentors are absolutely brilliant—they actually work in AI labs, not just teach from a textbook.",
        tags: ["Neural Nets", "Deep Learning", "Python"],
        achievement: "Built a real-time face recognition app",
        color: "blue",
    },
    {
        id: 2,
        name: "Ayesha Fatima",
        role: "Data Scientist @ Razorpay",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AyeshaFatima",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Batch Nov '24",
        highlight: "Got placed at Razorpay right after the course",
        content:
            "I'd tried 3 other online AI courses before thinkskool and none came close. The curriculum is ridiculously industry-focused—we worked on actual NLP pipelines and recommendation systems. Within a month of finishing, I had 4 interview calls. Now I'm at Razorpay as a full-time Data Scientist!",
        tags: ["NLP", "Recommendation Systems", "Placement"],
        achievement: "Secured Data Scientist role at Razorpay",
        color: "emerald",
    },
    {
        id: 3,
        name: "Siddharth Nair",
        role: "ML Engineer @ Startup",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SiddharthNair",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Batch Jul '24",
        highlight: "The Computer Vision module was mind-blowing",
        content:
            "Coming from a mechanical engineering background, I was sceptical. But the structured learning path made AI completely accessible. The Computer Vision and GANs section was insane—I built a deepfake detector as my capstone project. The mentors gave personal code reviews every week.",
        tags: ["Computer Vision", "GANs", "Career Switch"],
        achievement: "Deployed a deepfake detection model",
        color: "purple",
    },
    {
        id: 4,
        name: "Meera Krishnan",
        role: "AI Product Manager @ Infosys",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MeeraKrishnan",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Batch Jan '25",
        highlight: "Perfect for both technical and non-technical learners",
        content:
            "I'm not a pure coder, but I wanted to understand AI deeply enough to lead ML teams. thinkskool's approach of explaining the 'why' behind every model made it perfect for me. The reinforcement learning section opened my eyes to robotics and game AI. Now I confidently run sprint planning for AI features.",
        tags: ["Product", "RL", "Leadership"],
        achievement: "Now leading an AI products team",
        color: "rose",
    },
    {
        id: 5,
        name: "Karthik Rajan",
        role: "Research Fellow @ DRDO",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KarthikRajan",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Batch Mar '25",
        highlight: "LLM fine-tuning content is world-class",
        content:
            "As a defence research fellow, I needed advanced ML skills specifically in NLP and LLMs. The thinkskool AI program covered fine-tuning LLaMA models, RAG pipelines, and inference optimization—stuff you'd normally only find in research papers. The 1-on-1 mentor sessions gave me direction I couldn't get elsewhere.",
        tags: ["LLMs", "RAG", "Fine-tuning"],
        achievement: "Published paper using course techniques",
        color: "amber",
    },
    {
        id: 6,
        name: "Prachi Agarwal",
        role: "Junior ML Developer @ Swiggy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PrachiAgarwal",
        rating: 5,
        course: "AI & Machine Learning",
        batch: "Batch Nov '24",
        highlight: "From zero ML knowledge to industry ready in 4 months",
        content:
            "I joined with just basic Python knowledge and zero ML background. The pace is perfectly calibrated—challenging but never overwhelming. The cloud IDE meant I never had to worry about GPU setup. By week 10, I had a working demand forecasting model in production. Swiggy hired me to work on exactly those kinds of systems.",
        tags: ["Forecasting", "Cloud IDE", "Production ML"],
        achievement: "Demand model now live at Swiggy",
        color: "indigo",
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
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? colorClass : "text-slate-200"}
                fill={i < rating ? "currentColor" : "none"}
            />
        ))}
    </div>
);

const FeaturedCard = ({ review }) => {
    const c = colorMap[review.color];
    return (
        <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-slate-200/50"
        >
            {/* Radial glow bg */}
            <div className={`absolute -top-24 -right-24 w-[350px] h-[350px] rounded-full bg-gradient-to-br ${c.glow} via-transparent to-transparent blur-3xl pointer-events-none`} />

            {/* Giant watermark quote */}
            <div className="absolute -bottom-6 -right-4 text-slate-50 pointer-events-none">
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
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">{review.name}</h4>
                            <p className={`text-[11px] font-semibold uppercase tracking-widest mt-0.5 ${c.highlight}`}>{review.role}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <StarRating rating={review.rating} colorClass={c.star} />
                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">{review.batch}</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievement badge */}
                    <div className={`md:ml-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-semibold ${c.badge} self-start`}>
                        <Sparkles size={12} />
                        <span>{review.achievement}</span>
                    </div>
                </div>

                {/* Highlight */}
                <div>
                    <p className={`text-xl md:text-2xl font-bold tracking-tight leading-snug ${c.highlight}`}>
                        "{review.highlight}"
                    </p>
                </div>

                {/* Body */}
                <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
                    {review.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {review.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${c.tag}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const MiniCard = ({ review, isActive, onClick }) => {
    const c = colorMap[review.color];
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isActive
                    ? `border-slate-300 bg-white shadow-lg shadow-slate-200/60`
                    : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200"
            }`}
        >
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${c.dot}`}
                />
            )}
            <div className="flex items-center gap-3 pl-2">
                <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{review.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest truncate mt-0.5">{review.role}</p>
                </div>
                <StarRating rating={review.rating} colorClass={c.star} />
            </div>
            {isActive && (
                <p className="text-[12px] text-slate-500 mt-3 pl-2 line-clamp-2 leading-relaxed">
                    {review.highlight}
                </p>
            )}
        </motion.button>
    );
};

const CourseReviews = ({ courseId }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Only show this section for the AI course (id = '1')
    if (courseId !== '1') return null;

    const handlePrev = () => setActiveIndex(i => (i - 1 + AI_REVIEWS.length) % AI_REVIEWS.length);
    const handleNext = () => setActiveIndex(i => (i + 1) % AI_REVIEWS.length);

    const active = AI_REVIEWS[activeIndex];

    return (
        <section className="py-24 md:py-32 bg-white border-t border-slate-100 relative overflow-hidden">
            {/* Background mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[140px] -ml-80 -mt-80 opacity-40" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -mr-60 -mb-60 opacity-40" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6">
                        <Brain size={12} />
                        <span>Student Voices</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase leading-none mb-4">
                        What Our <span className="text-blue-600">Learners</span> Say
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
                        Real stories from students who mastered AI & Machine Learning with us.
                    </p>

                    {/* Aggregate stats */}
                    <div className="flex items-center justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">4.9</div>
                            <div className="flex justify-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Avg Rating</div>
                        </div>
                        <div className="w-px h-12 bg-slate-200" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">200+</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Reviews</div>
                        </div>
                        <div className="w-px h-12 bg-slate-200" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">94%</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Placement Rate</div>
                        </div>
                    </div>
                </div>

                {/* Main layout: Featured card + sidebar */}
                <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
                    {/* Featured review */}
                    <div>
                        <AnimatePresence mode="wait">
                            <FeaturedCard key={active.id} review={active} />
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
                                                ? "w-6 h-2 bg-blue-600"
                                                : "w-2 h-2 bg-slate-200 hover:bg-slate-400"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrev}
                                    className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all group"
                                >
                                    <ChevronLeft size={18} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all group"
                                >
                                    <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar – all reviewers list */}
                    <div className="flex flex-col gap-3 lg:max-h-[600px] lg:overflow-y-auto custom-scroll pr-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-1 mb-1">
                            All Reviews ({AI_REVIEWS.length})
                        </p>
                        {AI_REVIEWS.map((review, i) => (
                            <MiniCard
                                key={review.id}
                                review={review}
                                isActive={i === activeIndex}
                                onClick={() => setActiveIndex(i)}
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
