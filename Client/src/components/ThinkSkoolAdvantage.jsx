import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
    Zap, 
    Layout, 
    Users, 
    Sparkles, 
    Target, 
    Hammer,
    ArrowRight,
    X,
    CheckCircle2
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const ADVANTAGES = [
    {
        id: 1,
        title: "Think like a builder",
        description: "Anyone can follow a tutorial. At thinkskool, you learn to break problems down, experiment, and build real projects. You’ll apply your skills in our upcoming hackathon!",
        image: "/images/ecosystem/cloud_ide.jpg",
        icon: Zap,
        details: ["Action over Observation", "Builder Mindset first", "thinkskool hackathon"]
    },
    {
        id: 2,
        title: "Portfolio, not just a certificate",
        description: "By the end you will have built real projects you can show anyone. An AI chatbot, a working app, an IoT device. Things that prove what you can do.",
        image: "/images/ecosystem/performance.jpg",
        icon: Layout,
        details: ["Production-ready GitHub", "Live project hosting", "Technical case studies"]
    },
    {
        id: 3,
        title: "Mentors from the tech industry",
        description: "Every thinkskool mentor is an active technology professional. They bring the kind of real world context no textbook ever could.",
        image: "/images/ecosystem/mentorship.jpg",
        icon: Users,
        details: ["Mentors from top labs", "Industry standard reviews", "Direct career guidance"]
    },
    {
        id: 4,
        title: "Skills schools completely skip",
        description: "AI, machine learning, cybersecurity, robotics, IoT. Technologies reshaping every industry that most students will never touch in school.",
        image: "/images/ecosystem/adaptive_learning.jpg",
        icon: Sparkles,
        details: ["Advanced AI & ML", "Cybersecurity protocols", "Hands-on Robotics & IoT"]
    },
];
const AdvantageCard = ({ card, index, scrollX }) => {
    return (
        <motion.div
            style={{ x: scrollX }}
            whileHover={{ 
                scale: 1.05,
                zIndex: 30,
                transition: { duration: 0.3 }
            }}
            className="group relative flex-shrink-0 w-[280px] md:w-[340px] h-[550px] bg-slate-900 border border-orange-50/5 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(255,165,0,0.05)] hover:shadow-[0_0_50px_rgba(255,180,100,0.2)] hover:border-orange-100/30 transition-all duration-500"
        >
            <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-60 group-hover:opacity-100"
            />
            
            {/* Visual Overlay - High Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95 group-hover:opacity-60 transition-opacity" />
            
            {/* Glowing HUD Border Subtle */}
            <div className="absolute inset-0 border-[0.5px] border-white/5 transition-colors pointer-events-none group-hover:border-orange-200/40" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "80px" }}
                    className="h-1.5 bg-blue-600 mb-8 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                />
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase leading-[0.75] tracking-[-0.05em] max-w-[240px]">
                    {card.title}
                </h3>
            </div>
        </motion.div>
    );
};

const ThinkskoolAdvantage = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center center"]
    });

    // Transform scroll progress to X position
    const rawX = useTransform(scrollYProgress, [0, 1], [800, 0]);
    const scrollX = useSpring(rawX, {
        stiffness: 40,
        damping: 15,
        restDelta: 0.001
    });

    return (
        <section ref={sectionRef} id="advantage" className="py-24 bg-white relative overflow-hidden w-full">
            {/* Minimal Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[1000px] h-[1000px] bg-blue-50/10 rounded-full blur-[140px] opacity-20" />
            </div>

            <div className="w-full relative z-10">
                {/* Header Area Area - Centered Headline */}
                <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col items-center text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase whitespace-nowrap"
                    >
                        the <span className="text-blue-600">thinkskool</span> advantage
                    </motion.h2>
                </div>

                {/* Horizontal Slide Container - With Gaps and Centering */}
                <div className="relative w-full overflow-visible px-6">
                    <div className="flex justify-center items-center gap-6 md:gap-8 relative">
                        {ADVANTAGES.map((card, index) => (
                            <AdvantageCard 
                                key={card.id} 
                                card={card} 
                                index={index} 
                                scrollX={scrollX}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThinkskoolAdvantage;
