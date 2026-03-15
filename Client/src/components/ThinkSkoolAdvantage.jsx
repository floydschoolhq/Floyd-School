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
        title: "We teach you to think like a builder",
        description: "Anyone can follow a tutorial. At thinkskool, you learn to break problems down, experiment, and build real projects. You’ll apply your skills in our upcoming hackathon! The ability to think, build, and solve stays with you forever.",
        image: "/images/ecosystem/cloud_ide.jpg",
        icon: Zap,
        details: [
            "Action over Observation",
            "Builder Mindset first",
            "THINKSKOOL HACKATHON"
        ]
    },
    {
        id: 2,
        title: "You leave with a portfolio, not just a certificate",
        description: "By the end you will have built real projects you can show anyone. An AI chatbot, a working app, an IoT device. Things that prove what you can do.",
        image: "/images/ecosystem/performance.jpg",
        icon: Layout,
        details: [
            "Production-ready GitHub portfolio",
            "Live project hosting",
            "Technical case studies"
        ]
    },
    {
        id: 3,
        title: "Your mentors work in tech right now",
        description: "Every ThinkSkool mentor is an active technology professional. They bring the kind of real world context no textbook ever could.",
        image: "/images/ecosystem/mentorship.jpg",
        icon: Users,
        details: [
            "Mentors from top tech labs",
            "Industry standard code reviews",
            "Direct career guidance"
        ]
    },
    {
        id: 4,
        title: "You learn the skills schools completely skip",
        description: "AI, machine learning, cybersecurity, robotics, IoT. Technologies reshaping every industry that most students will never touch in school.",
        image: "/images/ecosystem/adaptive_learning.jpg",
        icon: Sparkles,
        details: [
            "Advanced AI & ML training",
            "Cybersecurity protocols",
            "Hands-on Robotics & IoT"
        ]
    },
    {
        id: 5,
        title: "Designed specifically for students aged 12 to 18",
        description: "Fast enough to keep things exciting. Never so fast anyone gets left behind. Built for exactly how students at this age learn best.",
        image: "/images/ecosystem/networking.jpg",
        icon: Target,
        details: [
            "Age-appropriate complex logic",
            "Gamified learning path",
            "Peer-to-peer collaboration"
        ]
    },
    {
        id: 6,
        title: "We teach you to think like a builder",
        description: "Anyone can follow a tutorial. ThinkSkool teaches you to break problems down, experiment and figure things out yourself. That skill stays with you forever.",
        image: "/images/ecosystem/security.jpg",
        icon: Hammer,
        details: [
            "First-principles thinking",
            "Debugging & system optimization",
            "Independent project architecting"
        ]
    },
];

const AdvantageCard = ({ card, onOpen }) => {
    const Icon = card.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
            className="group bg-white border border-slate-200/60 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.04)] flex flex-col h-full hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-500 rounded-sm overflow-hidden cursor-pointer"
            onClick={() => onOpen(card)}
        >
            {/* Image Section */}
            <div className="w-full aspect-video overflow-hidden relative border-b border-slate-100 bg-slate-50">
                <img 
                    src={card.image} 
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    style={{ willChange: "transform" }}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                
                {/* Floating Icon Overlay */}
                <div className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 border border-white/50">
                    <Icon size={18} className="text-slate-900" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {card.title}
                </h3>
                
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-6 line-clamp-3">
                    {card.description}
                </p>
                
                {/* Footer Details Link */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors duration-300">
                        Program Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm">
                        <ArrowRight size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ThinkSkoolAdvantage = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    return (
        <section id="advantage" className="py-24 md:py-32 bg-white relative overflow-x-hidden">
            {/* Optimized Background Title */}
            <div className="absolute top-10 left-0 right-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.03]">
                <h2 className="text-[120px] md:text-[200px] font-black text-slate-950 uppercase tracking-tighter text-center whitespace-nowrap leading-none">
                    THE THINKSKOOL ADVANTAGE
                </h2>
            </div>

            {/* Optimized Background Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Heading */}
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        style={{ willChange: "transform, opacity" }}
                        className="font-black text-slate-950 mb-12 tracking-tighter uppercase cursor-default transition-all duration-500"
                    >
                        <span className="text-lg md:text-3xl lg:text-4xl opacity-80 inline-block mr-3">
                            Schools teach concepts. We teach students to
                        </span>
                        <span className="text-2xl md:text-4xl lg:text-6xl inline-block bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(249,115,22,0.15)]">
                            build real things.
                        </span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ willChange: "transform, opacity" }}
                        className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-5xl mx-auto"
                    >
                        Every skill at ThinkSkool is learned by actually doing it. Not watching. Not reading about it. <span className="text-slate-900 border-b border-slate-200">Doing it.</span>
                    </motion.p>
                </div>

                {/* Optimized Grid Layout */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ADVANTAGES.map((card) => (
                        <AdvantageCard key={card.id} card={card} onOpen={setSelectedCard} />
                    ))}
                </div>
            </div>

            {/* Modal for Program Details */}
            <AnimatePresence>
                {selectedCard && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/20 backdrop-blur-md"
                            onClick={() => setSelectedCard(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            style={{ willChange: "transform, opacity" }}
                            className="bg-white w-full max-w-2xl rounded-sm overflow-hidden relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white"
                        >
                            <button 
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-black z-20 border border-slate-100 transition-all hover:scale-110"
                            >
                                <X size={18} />
                            </button>

                            <div className="p-8 md:p-12">
                                <div className="w-full aspect-video rounded-sm overflow-hidden mb-8 border border-slate-100 shadow-lg bg-slate-50">
                                    <img 
                                        src={selectedCard.image} 
                                        alt={selectedCard.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                                    Program Pillar
                                </span>
                                
                                <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight uppercase tracking-tight">{selectedCard.title}</h3>
                                <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">{selectedCard.description}</p>
                                
                                <div className="space-y-4 pt-8 border-t border-slate-50">
                                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-orange-500/20 pb-2 inline-block">Mastery Objectives</p>
                                    {selectedCard.details.map((detail, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-600 font-bold uppercase text-[11px] tracking-tight group/item">
                                            <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                                                <CheckCircle2 size={12} />
                                            </div>
                                            {detail}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedCard(null)}
                                        className="bg-slate-950 text-white px-8 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ThinkSkoolAdvantage;
