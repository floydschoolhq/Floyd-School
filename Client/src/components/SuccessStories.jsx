import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const REVIEWS_ROW_1 = [
    {
        name: "Aryan Kumar",
        role: "Full Stack Developer",
        content: "From optometrist to IT pro, thanks to thinkskool. Their lessons help me excel in projects. This transformed my journey, giving me clarity!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan"
    },
    {
        name: "Abhishek Patidar",
        role: "SDE-1",
        content: "Chose thinkskool for structured learning. Top-notch mentors, quick TAs, and a supportive community. Best decision ever for my career growth.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek"
    },
    {
        name: "Durgesh Chaubey",
        role: "SDE - 1",
        content: "thinkskool exceeded my college experience. After the course, I transitioned from a consultant to an SDE-1. Exceptional industry-focused faculty.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Durgesh"
    },
    {
        name: "Aman Gupta",
        role: "Data Analyst",
        content: "The curriculum is perfectly aligned with industry needs. The AI projects were the highlight for me. Highly recommended for serious learners.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman"
    },
    {
        name: "Priya Sharma",
        role: "Product Designer",
        content: "The design systems taught here are professional grade. I landed my dream job within 2 months of finishing the masterclass.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    }
];

const REVIEWS_ROW_2 = [
    {
        name: "Rahul Verma",
        role: "Backend Engineer",
        content: "Scale and architecture are focus points here. The hands-on experience with cloud infrastructure was exactly what I was looking for.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
    },
    {
        name: "Sneha Kapur",
        role: "ML Engineer",
        content: "The AI module is incredibly deep. From prompt engineering to fine-tuning models, it covers the entire spectrum of modern AI.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
    },
    {
        name: "Vikram Singh",
        role: "Cloud Architect",
        content: "Professional-grade mentorship. The tutors actually work in the industry, which makes a massive difference in the quality of advice.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
    },
    {
        name: "Ananya Das",
        role: "Frontend Specialist",
        content: "I've never seen such a focus on performance and clean code. thinkskool is for those who want to be in the top 1% of engineers.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
    },
    {
        name: "Ishaan Mehta",
        role: "Lead Developer",
        content: "The support system is fantastic. Even after completing the course, the community and networking opportunities keep providing value.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan"
    }
];

const THEME_COLORS = [
    { border: "hover:border-blue-200", shadow: "hover:shadow-[0_20px_60px_rgba(59,130,246,0.06)]", glow: "from-blue-50" },
    { border: "hover:border-emerald-200", shadow: "hover:shadow-[0_20px_60px_rgba(16,185,129,0.06)]", glow: "from-emerald-50" },
    { border: "hover:border-purple-200", shadow: "hover:shadow-[0_20px_60px_rgba(168,85,247,0.06)]", glow: "from-purple-50" },
    { border: "hover:border-rose-200", shadow: "hover:shadow-[0_20px_60px_rgba(244,63,94,0.06)]", glow: "from-rose-50" },
    { border: "hover:border-amber-200", shadow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.06)]", glow: "from-amber-50" }
];

const ReviewCard = ({ review, index = 0 }) => {
    const theme = THEME_COLORS[index % THEME_COLORS.length];
    
    return (
    <div className={`flex-shrink-0 w-full md:w-[400px] p-8 bg-white border border-slate-200/80 rounded-[2.5rem] group hover:bg-white transition-all duration-500 md:mx-4 relative overflow-hidden flex flex-col items-center text-center ${theme.border} ${theme.shadow}`}>
        {/* Subtle Color Reflection */}
        <div className={`absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl ${theme.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-bl-full`} />
        
        {/* Quote watermark */}
        <div className="absolute -top-4 -right-4 text-slate-100 group-hover:text-slate-200 transition-colors">
            <Quote size={120} fill="currentColor" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 group-hover:border-slate-300 transition-colors">
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-slate-900 tracking-tight">{review.name}</h4>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">{review.role}</p>
                </div>
            </div>
            
            <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                "{review.content}"
            </p>

            <div className="mt-6 flex gap-1.5 justify-center">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-800 transition-colors duration-300" />
                ))}
            </div>
        </div>
    </div>
    );
};

import useIsMobile from '../hooks/useIsMobile';

const SuccessStories = () => {
    const isMobile = useIsMobile();
    return (
        <section className="bg-slate-100 py-16 md:py-32 relative overflow-hidden border-t border-slate-200">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[100px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-[120px] -ml-48 -mb-48" />
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10 px-4">
                <div className="px-6 md:px-12 text-center mb-16 md:mb-24">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4 block">Proven Excellence</span>
                    <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl">
                        Students Reviews & Feedback
                    </ScrollDarkenHeading>
                </div>

                {/* Marquee Row 1 (Left to Right) */}
                <div className="group/marquee relative mb-8 md:mb-12 overflow-hidden">
                    <motion.div 
                        animate={isMobile ? { x: 0 } : { x: [0, -2100] }}
                        transition={isMobile ? { duration: 0 } : { 
                            duration: 40, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        whileHover={{ animationPlayState: "paused" }}
                        className="flex flex-col md:flex-row w-full md:w-max items-center gap-6"
                    >
                        {(isMobile ? REVIEWS_ROW_1.slice(0, 3) : [...REVIEWS_ROW_1, ...REVIEWS_ROW_1]).map((review, i) => (
                            <ReviewCard key={i} review={review} index={i} />
                        ))}
                    </motion.div>
                </div>

                {/* Marquee Row 2 (Right to Left) */}
                {!isMobile && (
                    <div className="group/marquee relative overflow-hidden">
                        <motion.div 
                            animate={isMobile ? { x: 0 } : { x: [-2100, 0] }}
                            transition={isMobile ? { duration: 0 } : { 
                                duration: 40, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            className="flex w-max items-center"
                        >
                            {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, i) => (
                                <ReviewCard key={i} review={review} index={i + 2} />
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
