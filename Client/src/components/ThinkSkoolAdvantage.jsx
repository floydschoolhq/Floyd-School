import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
const AdvantageCard = ({ card, index, isHovered }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ 
                opacity: 1, 
                x: isHovered ? 0 : 60, // Settle to right by default, move to center on hover
                transition: { 
                    duration: 0.8, 
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            animate={{ 
                x: isHovered ? 0 : (4 - index) * 30, // Stack/Settle to right logic
                scale: isHovered ? 1.02 : 1,
                zIndex: isHovered ? 20 : 1,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="group relative flex-shrink-0 w-[280px] md:w-[320px] h-[550px] bg-slate-900 overflow-hidden cursor-pointer shadow-2xl"
        >
            <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
            
            {/* Visual Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            
            {/* Minimal HUD Border */}
            <div className="absolute inset-0 border-[0.5px] border-white/10 group-hover:border-blue-500/50 transition-colors pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40px" }}
                    className="h-1 bg-blue-600 mb-4"
                />
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase leading-none tracking-tighter max-w-[200px]">
                    {card.title}
                </h3>
            </div>
        </motion.div>
    );
};

const ThinkskoolAdvantage = () => {
    const [isContainerHovered, setIsContainerHovered] = useState(false);

    return (
        <section id="advantage" className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-50/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                {/* Header Area Area */}
                <div className="px-6 md:px-12 mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                    <div className="max-w-3xl">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] mb-4 block"
                        >
                            The Industrial Core
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase"
                        >
                            Built for <br /> <span className="text-blue-600">Action.</span>
                        </motion.h2>
                    </div>
                </div>

                {/* Horizontal Slide Container */}
                <div 
                    className="relative flex justify-center py-10"
                    onMouseEnter={() => setIsContainerHovered(true)}
                    onMouseLeave={() => setIsContainerHovered(false)}
                >
                    <div className="flex items-center gap-1 md:gap-2 px-6 overflow-x-auto no-scrollbar pb-10">
                        {ADVANTAGES.map((card, index) => (
                            <AdvantageCard 
                                key={card.id} 
                                card={card} 
                                index={index} 
                                isHovered={isContainerHovered}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThinkskoolAdvantage;
