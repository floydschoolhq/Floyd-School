import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';


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
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanvi"
    },
    {
        name: "Daksh Chaudhary",
        role: "Student, STEPUP SCHOOL",
        content: "The course was really good and interactive",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daksh"
    }
];

const THEME_COLORS = [
    { border: "hover:border-blue-200", shadow: "hover:shadow-[0_20px_60px_rgba(59,130,246,0.06)]", glow: "from-blue-50" },
    { border: "hover:border-emerald-200", shadow: "hover:shadow-[0_20px_60px_rgba(16,185,129,0.06)]", glow: "from-emerald-50" },
    { border: "hover:border-purple-200", shadow: "hover:shadow-[0_20px_60px_rgba(168,85,247,0.06)]", glow: "from-purple-50" },
    { border: "hover:border-rose-200", shadow: "hover:shadow-[0_20px_60px_rgba(244,63,94,0.06)]", glow: "from-rose-50" },
    { border: "hover:border-amber-200", shadow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.06)]", glow: "from-amber-50" }
];

const ReviewCard = ({ review, index = 0, variant }) => {
    const isDark = variant === 'dark';
    const isMobile = useIsMobile();
    const themes = isDark ? [
        { border: "hover:border-blue-500/30", shadow: "hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)]", glow: "from-blue-500/10" },
        { border: "hover:border-amber-500/30", shadow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.1)]", glow: "from-amber-500/10" },
        { border: "hover:border-cyan-500/30", shadow: "hover:shadow-[0_20px_60px_rgba(6,182,212,0.1)]", glow: "from-cyan-500/10" },
    ] : THEME_COLORS;
    
    const theme = themes[index % themes.length];
    
    if (isMobile) {
        return (
            <div className={`shrink-0 w-[280px] p-6 rounded-[2rem] transition-all relative overflow-hidden flex flex-col border ${
                isDark 
                    ? 'bg-slate-900/60 border-white/5 shadow-xl shadow-black/20' 
                    : 'bg-white border-slate-200 shadow-sm'
            }`}>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-5">
                        <div className={`w-10 h-10 rounded-xl overflow-hidden border ${
                            isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'
                        }`}>
                            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h4 className={`text-[12px] font-black uppercase tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>{review.name}</h4>
                            <p className={`text-[8px] font-bold uppercase tracking-[0.15em] mt-0.5 opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{review.role}</p>
                        </div>
                    </div>
                    
                    <p className={`text-[13px] leading-relaxed font-medium mb-6 italic ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                        "{review.content}"
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100/10 flex items-center justify-between">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                                    isDark ? (i < 4 ? 'bg-orange-500/60' : 'bg-slate-800') : (i < 4 ? 'bg-orange-500' : 'bg-slate-100')
                                }`} />
                            ))}
                        </div>
                        <Sparkles size={12} className={isDark ? "text-orange-500/40" : "text-orange-500/20"} />
                    </div>
                </div>
            </div>
        );
    }

    
    return (
        <div className={`flex-shrink-0 w-full md:w-[420px] p-10 rounded-[2.5rem] group transition-all duration-500 md:mx-4 relative overflow-hidden flex flex-col items-start text-left ${
            isDark 
                ? 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]' 
                : `bg-white border border-slate-100 ${theme.shadow}`
        }`}>
            {/* Subtle Color Reflection */}
            <div className={`absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl ${theme.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-bl-full`} />
            
            {/* Quote watermark - Subtle */}
            <div className={`absolute top-8 right-8 transition-colors ${
                isDark ? 'text-white/[0.02] group-hover:text-white/[0.05]' : 'text-slate-50 group-hover:text-slate-100'
            }`}>
                <Quote size={60} fill="currentColor" />
            </div>
            
            <div className="relative z-10 flex flex-col items-start w-full font-['Outfit']">
                <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-2xl overflow-hidden border transition-all duration-500 ${
                        isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'
                    }`}>
                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className={`text-[17px] font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                        <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{review.role}</p>
                    </div>
                </div>
                
                <p className={`text-[15px] leading-relaxed font-medium mb-8 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                    "{review.content}"
                </p>

                <div className="mt-auto flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            isDark ? 'bg-white/10 group-hover:bg-blue-500' : 'bg-slate-100 group-hover:bg-slate-900'
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
    return (
        <section className={`pt-10 pb-16 md:pt-16 md:pb-32 relative overflow-hidden transition-colors duration-500
            ${isDark ? 'bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5' : 'bg-slate-100 border-t border-slate-200'}`}>
            {/* Background mesh - matching CourseReviews */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-30 ${isDark ? 'invert brightness-200' : ''}`} style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 transition-colors
                    ${isDark ? 'bg-blue-600/5' : 'bg-white'}`} />
                <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 transition-colors
                    ${isDark ? 'bg-amber-600/5' : 'bg-slate-200/50'}`} />
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10 px-4">
                <div className="px-6 md:px-12 text-left mb-16 md:mb-24 mt-0">
                    <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl" variant={variant} uppercase={false}>
                        transformed by <span className="font-black tracking-tight"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                    </ScrollDarkenHeading>
                </div>

                {/* Success Stories Content */}
                <div className="group/marquee relative mb-8 md:mb-12 overflow-hidden">
                    {isMobile ? (
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 py-4">
                            {[...REVIEWS_ROW_1, ...REVIEWS_ROW_2].map((review, i) => (
                                <div key={i} className="snap-center">
                                    <ReviewCard review={review} index={i} variant={variant} />
                                </div>
                            ))}
                            <div className="w-1 shrink-0" />
                        </div>
                    ) : (
                        <motion.div 
                            animate={{ x: [0, -2100] }}
                            transition={{ 
                                duration: 40, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            className="flex w-max items-center gap-6"
                        >
                            {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, i) => (
                                <ReviewCard key={i} review={review} index={i} variant={variant} />
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Marquee Row 2 (Right to Left) - Desktop Only */}
                {!isMobile && (
                    <div className="group/marquee relative overflow-hidden">
                        <motion.div 
                            animate={{ x: [-2100, 0] }}
                            transition={{ 
                                duration: 40, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            className="flex w-max items-center"
                        >
                            {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, i) => (
                                <ReviewCard key={i} review={review} index={i + 2} variant={variant} />
                            ))}
                        </motion.div>
                    </div>
                )}


                {/* Content ends directly here for a cleaner look */}
            </div>
        </section>
    );
};

export default SuccessStories;
