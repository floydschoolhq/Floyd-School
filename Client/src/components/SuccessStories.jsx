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
            <motion.div 
                whileTap={{ scale: 0.98 }}
                className={`shrink-0 w-[300px] p-8 rounded-[2.5rem] transition-all relative overflow-hidden flex flex-col border backdrop-blur-xl ${
                isDark 
                    ? 'bg-slate-900/30 border-white/10 shadow-2xl shadow-black/40' 
                    : 'bg-white/60 border-slate-200/40 shadow-lg shadow-slate-200/10'
            }`}>
                {/* Refined subtle glow */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${theme.glow} via-transparent to-transparent opacity-20 pointer-events-none rounded-full blur-2xl`} />
                
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                    <div className="flex flex-col items-center gap-4 mb-6">
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
                    
                    <p className={`text-[15px] leading-[1.6] font-medium mb-8 italic tracking-tight ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                        "{review.content}"
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100/10 flex items-center justify-between">
                        <div className="flex gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                                    isDark 
                                        ? (i < 4 ? 'bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'bg-slate-800') 
                                        : (i < 4 ? 'bg-blue-600/80' : 'bg-slate-100')
                                }`} />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    
    return (
        <div className={`flex-shrink-0 w-full md:w-[420px] p-10 rounded-[2.5rem] group transition-all duration-500 md:mx-4 relative overflow-hidden flex flex-col items-center text-center ${
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
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex flex-col items-center gap-5 mb-8">
                    <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-lg object-cover"
                    />
                    <div className="text-center">
                        <h4 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                        <p className={`text-[11px] font-semibold uppercase tracking-widest mt-0.5 ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`}>{review.role}</p>
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

            <div className={`max-w-[1440px] mx-auto relative z-10 ${isMobile ? '' : 'px-4'}`}>

                <div className={`text-center mb-16 md:mb-24 mt-0 ${isMobile ? 'px-6' : 'px-12'}`}>

                    <div className="flex-1">
                        {isMobile ? (
                            <h2 className={`text-3xl font-extrabold tracking-tighter uppercase leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                transformed by <span className="lowercase"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                            </h2>
                        ) : (
                            <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl" variant={variant} uppercase={false}>
                                transformed by <span className="font-black tracking-tight"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>
                            </ScrollDarkenHeading>
                        )}
                    </div>
                </div>

                {/* Success Stories Content - Truly Edge-to-Edge on Mobile */}
                <div className="group/marquee relative mb-8 md:mb-12 overflow-hidden">
                    {isMobile ? (
                        <div className="flex flex-col gap-8">
                            {/* Mobile Marquee Row 1 */}
                            <div className="relative w-full h-[320px]">
                                <motion.div 
                                    animate={{ x: [0, -1500] }}
                                    transition={{ 
                                        duration: 35, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                    className="flex w-max items-center gap-6"
                                >
                                    {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, i) => (
                                        <ReviewCard key={`m1-${i}`} review={review} index={i} variant={variant} />
                                    ))}
                                </motion.div>
                            </div>

                            {/* Mobile Marquee Row 2 */}
                            <div className="relative w-full h-[320px]">
                                <motion.div 
                                    animate={{ x: [-1500, 0] }}
                                    transition={{ 
                                        duration: 30, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                    className="flex w-max items-center gap-6"
                                >
                                    {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, i) => (
                                        <ReviewCard key={`m2-${i}`} review={review} index={i + 1} variant={variant} />
                                    ))}
                                </motion.div>
                            </div>
                            
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
