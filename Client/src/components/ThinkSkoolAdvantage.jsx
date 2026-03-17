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
    CheckCircle2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';

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
        image: "/images/ecosystem/security.jpg",
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
const AdvantageCard = ({ card, index, baseX, spreadFactor, isStatic }) => {
    // Each card's position is a combination of the global group move (baseX)
    // and its individual spreading position based on its index.
    const x = useTransform(
        [baseX, spreadFactor],
        ([latestBaseX, latestSpread]) => latestBaseX + (index - 1.5) * latestSpread
    );

    return (
        <motion.div
            style={{ x: isStatic ? 0 : x }}
            whileHover={!isStatic ? {
                scale: 1.05,
                zIndex: 40,
                y: -10,
                transition: { duration: 0.3 }
            } : {}}
            className={`advantage-card absolute top-0 left-1/2 -translate-x-1/2 group w-[280px] md:w-[340px] h-[550px] bg-slate-900 border border-orange-50/15 overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(255,165,0,0.08)] hover:shadow-[0_0_60px_rgba(255,180,100,0.25)] hover:border-orange-100/40 transition-shadow duration-500`}
        >
            <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />

            {/* Base Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-40 group-hover:opacity-0 transition-opacity duration-500" />

            {/* Subtle HUD Glow Border */}
            <div className="absolute inset-0 border-[0.5px] border-white/5 transition-colors pointer-events-none group-hover:border-orange-200/30" />

            {/* Orange Gradient Overlay - Visible on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Top Badge: Arrow Button - Visible on Hover */}
            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-xl hover:bg-white hover:text-black transition-colors cursor-pointer">
                    <ArrowRight size={20} />
                </div>
            </div>

            {/* Heading Content - Fade up on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out z-30">
                <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white uppercase leading-none tracking-tight">
                    {card.title}
                </h3>
            </div>
        </motion.div>
    );
};

const ThinkskoolAdvantage = () => {
    const sectionRef = useRef(null);
    const [isLandscape, setIsLandscape] = React.useState(false);
    const isMobile = useIsMobile();
    const scrollRef = useRef(null);

    React.useEffect(() => {
        const checkLandscape = () => {
            setIsLandscape(window.innerHeight < 500 && window.innerWidth > window.innerHeight);
        };
        checkLandscape();
        window.addEventListener('resize', checkLandscape);
        return () => window.removeEventListener('resize', checkLandscape);
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = isMobile ? window.innerWidth * 0.85 : 640; // Card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center center"]
    });

    // 1. Group Base Move
    const rawBaseX = useTransform(scrollYProgress, [0, 1], [800, 0]);
    const baseX = useSpring(rawBaseX, { stiffness: 40, damping: 15 });

    // 2. Card Spreading
    const rawSpread = useTransform(scrollYProgress, [0, 1], [40, 360]);
    const spreadFactor = useSpring(rawSpread, { stiffness: 40, damping: 15 });

    if (isMobile) {
        return (
            <section ref={sectionRef} id="advantage" className="py-12 pb-20 bg-white relative overflow-hidden w-full" style={{ position: 'relative' }}>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Simple Mobile Header */}
                    <div className="text-center mt-16 mb-8 sm:mt-20 md:mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Schools teach concepts.<br />We teach students to build real things.</h2>
                    </div>

                    {/* Mobile Cards Grid with Horizontal Scrolling */}
                    <div className="relative mb-8">
                        {/* Navigation Buttons */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-2 z-20">
                            <button 
                                onClick={() => scroll('left')}
                                className="p-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg transition-all scale-90 hover:scale-100 active:scale-95"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-2 z-20">
                            <button 
                                onClick={() => scroll('right')}
                                className="p-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg transition-all scale-90 hover:scale-100 active:scale-95"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        
                        <div 
                            ref={scrollRef}
                            className="overflow-hidden py-10 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory" 
                            style={{ 
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none',
                                scrollPaddingLeft: '1rem',
                                scrollPaddingRight: '1rem'
                            }}
                        >
                            {/* webkit-scrollbar hiding applied via a hacky style tag */}
                            <style>{`
                                .thinkskool-advantage .overflow-x-auto::-webkit-scrollbar { display: none; }
                            `}</style>
                            <div className="flex gap-3 w-max">
                            {ADVANTAGES.map((card, index) => {
                                const Icon = card.icon;
                                return (
                                    <div 
                                        key={card.id} 
                                        className="flex-shrink-0 w-72" 
                                        style={{ scrollSnapAlign: 'start' }}
                                    >
                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full">
                                            <div className="relative h-32 w-full bg-gradient-to-br from-orange-50 to-orange-100">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute top-3 left-3">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <Icon size={16} className="text-orange-600" />
                                                    </div>
                                                </div>
                                                {/* Optional: Add image if it exists */}
                                                {card.image && (
                                                    <img
                                                        src={card.image}
                                                        alt={card.title}
                                                        className="w-full h-full object-cover opacity-50"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-sm font-semibold text-slate-900 mb-1">{card.title}</h3>
                                                <p className="text-xs text-slate-600 leading-relaxed mb-2">{card.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {card.details.slice(0, 3).map((feature, idx) => (
                                                        <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                            </div>
                        </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id="advantage" className="py-24 pb-32 bg-white relative overflow-hidden w-full" style={{ position: 'relative' }}>
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[1000px] h-[1000px] bg-blue-50/10 rounded-full blur-[140px] opacity-20" />
            </div>

            <div className="w-full relative z-10">
                {/* Heading with Scroll Darken Effect */}
                <div className="max-w-7xl mx-auto px-6 mt-16 mb-24 flex flex-col items-center text-center sm:mt-20 md:mt-16">
                    <ScrollDarkenHeading
                        sizeClass="text-3xl md:text-5xl lg:text-7xl"
                        className="flex flex-col items-center text-center gap-2 md:gap-4 justify-center"
                        variant="light"
                        uppercase={false}
                    >
                        Schools teach concepts.
                        <span className="font-black tracking-tight text-[#F97316]">
                            We teach students to build real things.
                        </span>
                    </ScrollDarkenHeading>
                </div>

                <div className={`advantage-card-container relative h-[650px] w-full max-w-[1400px] mx-auto ${isLandscape ? 'flex flex-row overflow-x-auto gap-4 px-4 h-auto' : 'overflow-visible'}`}>
                    {ADVANTAGES.map((card, index) => (
                        <AdvantageCard
                            key={card.id}
                            card={card}
                            index={index}
                            baseX={baseX}
                            spreadFactor={spreadFactor}
                            isStatic={isLandscape}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThinkskoolAdvantage;
