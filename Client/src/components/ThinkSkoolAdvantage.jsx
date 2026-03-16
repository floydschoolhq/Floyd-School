import React, { useState } from 'react';
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

const AdvantageCard = ({ card, index }) => {
    const Icon = card.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ 
                opacity: 1, 
                x: 0,
                transition: { 
                    duration: 0.8, 
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ 
                scale: 1.02,
                y: -10,
                transition: { duration: 0.4 }
            }}
            className="group relative flex-shrink-0 w-[320px] md:w-[400px] h-[580px] bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden cursor-pointer hover:shadow-[0_50px_100px_-20px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-500"
        >
            {/* Image Section */}
            <div className="h-[45%] w-full overflow-hidden relative border-b border-slate-100 bg-slate-50">
                <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white">
                    <Icon size={20} className="text-slate-900" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10 flex flex-col h-[55%] font-sans">
                <div className="mb-auto">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block">Stage 0{index + 1}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-5 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                        {card.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                        {card.description}
                    </p>
                </div>
                
                {/* Details Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {card.details.slice(0, 2).map((detail, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                            {detail}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Explore Pillar</span>
                    <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ThinkskoolAdvantage = () => {
    const scrollContainerRef = useRef(null);

    return (
        <section id="advantage" className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-slate-50 rounded-full blur-[120px] opacity-50" />
                <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                {/* Header Area */}
                <div className="px-6 md:px-12 mb-20 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                    <div className="max-w-3xl">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6 block"
                        >
                            Industrial Learning Protocol
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase"
                        >
                            We teach you <br /> to build <span className="text-blue-600">real things.</span>
                        </motion.h2>
                    </div>
                    <motion.p 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-bold text-lg md:text-xl max-w-sm border-l-2 border-slate-100 pl-8 leading-relaxed"
                    >
                        Mastery is born through action. We replace lectures with engineering loops.
                    </motion.p>
                </div>

                {/* Horizontal Slide Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex md:grid md:grid-cols-4 gap-8 px-6 md:px-12 overflow-x-auto pb-12 no-scrollbar"
                >
                    {ADVANTAGES.map((card, index) => (
                        <AdvantageCard key={card.id} card={card} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThinkskoolAdvantage;
