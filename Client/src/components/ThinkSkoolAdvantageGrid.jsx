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
            "thinkskool hackathon"
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
        description: "Every thinkskool mentor is an active technology professional. They bring the kind of real world context no textbook ever could.",
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
        title: "Designed specifically for students aged 12 to 20",
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
        description: "Anyone can follow a tutorial. thinkskool teaches you to break problems down, experiment and figure things out yourself. That skill stays with you forever.",
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
            className="group bg-white border border-slate-100 flex flex-col h-full hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-500 rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => onOpen(card)}
        >
            {/* Image Section */}
            <div className="w-full aspect-video overflow-hidden relative border-b border-slate-100 bg-slate-50">
                <img 
                    src={card.image} 
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                
                {/* Floating Icon Overlay - Clean & Small */}
                <div className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/50">
                    <Icon size={16} className="text-slate-900" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col items-center text-center flex-1 font-sans">
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300 tracking-tight uppercase">
                    {card.title}
                </h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-6">
                    {card.id === 1 && (
                        <>Anyone can follow a tutorial. At thinkskool, you learn to break problems down, experiment, and build real projects. You’ll apply your skills in our upcoming <span className="text-orange-600 font-bold">hackathon!</span> The ability to think, build, and solve stays with you forever. </>
                    )}
                    {card.id === 2 && (
                        <>By the end you will have built <span className="text-slate-950 font-bold border-b border-slate-950/20">real projects</span> you can show anyone. An AI chatbot, a working app, an IoT device. Things that prove what you can do.</>
                    )}
                    {card.id === 3 && (
                        <>Every thinkskool mentor is an <span className="text-slate-950 font-bold border-b border-slate-950/20">active technology professional.</span> They bring the kind of real world context no textbook ever could.</>
                    )}
                    {card.id === 4 && (
                        <>AI, machine learning, cybersecurity, robotics, IoT. Technologies reshaping every industry that most <span className="text-slate-950 font-bold border-b border-slate-950/20">skills schools completely skip.</span></>
                    )}
                    {card.id === 5 && (
                        <>Fast enough to keep things exciting. Never so fast anyone gets left behind. Built specifically for <span className="text-slate-950 font-bold border-b border-slate-950/20">students aged 12 to 20.</span></>
                    )}
                    {card.id === 6 && (
                        <>Anyone can follow a tutorial. thinkskool teaches you to break problems down, experiment and <span className="text-slate-950 font-bold border-b border-slate-950/20">figure things out yourself.</span> That skill stays with you forever.</>
                    )}
                </p>
                
                {/* Footer Link */}
                <div className="pt-5 border-t border-slate-50 flex flex-col items-center gap-4 mt-auto w-full">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Program Details
                    </span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

import useIsMobile from '../hooks/useIsMobile';

const ThinkskoolAdvantageGrid = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section id="advantage" className="py-16 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                            Our Methodology
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 leading-none uppercase tracking-tighter">
                            The <span className="text-blue-600">Builder's Journey.</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {ADVANTAGES.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div 
                                    key={card.id}
                                    onClick={() => setSelectedCard(card)}
                                    className="bg-white border border-slate-100 p-5 rounded-[2rem] flex flex-col gap-4 active:scale-95 transition-transform"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 rounded-[1.2rem] shrink-0">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="text-[16px] font-black text-slate-900 leading-tight tracking-tight uppercase">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-50">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience Pillar</span>
                                        <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white">
                                            <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Simplified Mobile Modal */}
                {selectedCard && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center">
                        <div 
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setSelectedCard(null)}
                        />
                        <div className="bg-white w-full rounded-t-[3rem] p-10 pb-12 relative z-10 shadow-2xl flex flex-col items-center text-center">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                            <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight tracking-tighter uppercase">
                                {selectedCard.title}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10 max-w-sm">
                                {selectedCard.description}
                            </p>
                            <button 
                                onClick={() => setSelectedCard(null)}
                                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    return (
        <section id="advantage" className="py-20 md:py-28 bg-white relative overflow-x-hidden">
            {/* Optimized Background Title - Faded/Subtle */}
            <div className="absolute top-10 left-0 right-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.02]">
                <h2 className="text-[100px] md:text-[150px] font-bold text-slate-950 tracking-tighter text-center whitespace-nowrap leading-none">
                    thinkskool
                </h2>
            </div>

            {/* Optimized Background Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Heading */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-slate-950 mb-8 cursor-default"
                    >
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight block text-black mb-2">
                            Schools teach concepts.
                        </span>
                        <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight block bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            We teach you to build real things.
                        </span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-base md:text-lg text-slate-500 font-medium leading-relaxed"
                    >
                        Every skill at thinkskool is mastered by action. Not watching or reading, but <span className="text-slate-900 border-b-2 border-slate-100">building from day one.</span>
                    </motion.p>
                </div>

                {/* Optimized Grid Layout */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white font-sans"
                        >
                            <button 
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-black z-20 border border-slate-100 transition-all hover:scale-110"
                            >
                                <X size={18} />
                            </button>

                            <div className="p-8 md:p-14 flex flex-col items-center text-center">
                                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-slate-100 shadow-sm bg-slate-50">
                                    <img 
                                        src={selectedCard.image} 
                                        alt={selectedCard.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                                    Program Pillar
                                </span>
                                
                                <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight uppercase">{selectedCard.title}</h3>
                                <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-xl">{selectedCard.description}</p>
                                
                                <div className="space-y-4 pt-10 border-t border-slate-50 w-full flex flex-col items-center">
                                    <p className="text-[11px] font-black text-slate-950 uppercase tracking-widest mb-8 border-b-2 border-orange-500 pb-2 inline-block">Mastery Objectives</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        {selectedCard.details.map((detail, i) => (
                                            <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 font-bold text-[11px] tracking-tight transition-all hover:bg-white hover:shadow-sm group/item">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 border border-slate-100 group-hover/item:bg-orange-500 group-hover/item:text-white transition-colors">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                                {detail}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-center w-full">
                                    <button 
                                        onClick={() => setSelectedCard(null)}
                                        className="bg-slate-950 text-white px-10 py-5 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all shadow-xl"
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


export default ThinkskoolAdvantageGrid;
