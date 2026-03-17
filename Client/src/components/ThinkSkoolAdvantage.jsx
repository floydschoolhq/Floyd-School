import React, { useEffect, useState } from 'react';
import { Zap, Layout, Users, Sparkles } from 'lucide-react';

const ADVANTAGES = [
    {
        id: 1,
        title: "You learn by doing, not by watching",
        description: "Every session involves writing real code, building real things and solving real problems. There are no passive lessons here.",
        image: "/images/ecosystem/cloud_ide.jpg",
        icon: Zap,
        details: ["Action over Observation", "Builder Mindset first", "thinkskool hackathon"]
    },
    {
        id: 2,
        title: "You learn the skills schools completely skip",
        description: "AI, machine learning, cybersecurity, robotics, IoT. Technologies reshaping every industry that most students will never touch in school.",
        image: "/images/ecosystem/security.jpg",
        icon: Layout,
        details: ["Production-ready GitHub", "Live project hosting", "Technical case studies"]
    },
    {
        id: 3,
        title: "Designed specifically for students aged 12 to 18",
        description: "Fast enough to keep things exciting. Never so fast anyone gets left behind. Built for exactly how students at this age learn best.",
        image: "/images/ecosystem/mentorship.jpg",
        icon: Users,
        details: ["Mentors from top labs", "Industry standard reviews", "Direct career guidance"]
    },
    {
        id: 4,
        title: "We teach you to think like a builder",
        description: "Anyone can follow a tutorial. ThinkSkool teaches you to break problems down, experiment and figure things out yourself. That skill stays with you forever.",
        image: "/images/ecosystem/adaptive_learning.jpg",
        icon: Sparkles,
        details: ["Advanced AI & ML", "Real-world project thinking", "Hands-on Robotics & IoT"]
    },
];

const ThinkskoolAdvantage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // 🔥 Smooth + stable scroll detection
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const cards = document.querySelectorAll('.adv-card');
                    let newActive = 0;

                    cards.forEach((card, index) => {
                        const rect = card.getBoundingClientRect();

                        // 👇 smooth trigger zone
                        if (rect.top <= window.innerHeight * 0.45) {
                            newActive = index;
                        }
                    });

                    setActiveIndex(newActive);
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="advantage" className="py-24 pb-32 bg-slate-50 relative w-full">

            {/* Heading */}
            <div className="flex flex-col items-center text-center leading-tight mb-16 md:mb-20 lg:mb-24">
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-slate-400 tracking-tight">
                    Schools teach concepts.
                </h2>

                <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-orange-500 mt-3 tracking-tight">
                    We teach students to build real things.
                </h2>
            </div>

            {/* Cards */}
            <div className="max-w-6xl mx-auto w-full relative z-10 px-4">
                {ADVANTAGES.map((card, index) => {
                    const Icon = card.icon;
                    const isEven = index % 2 === 0;
                    const bgColor = isEven ? 'bg-[#ea580c] text-white' : 'bg-slate-900 text-white';
                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={card.id}
                            className="adv-card transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                position: 'sticky',
                                top: `${60 + index * 16}px`,
                                zIndex: index + 1,
                                marginBottom: '1rem',

                                // 🔥 smooth focus effect
                                filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                                opacity: isActive ? 1 : 0.65,
                                transform: isActive
                                    ? 'scale(1) translateY(0px)'
                                    : 'scale(0.97) translateY(12px)',

                                willChange: 'transform, filter, opacity',
                            }}
                        >
                            <div className={`${bgColor} rounded-2xl flex flex-col md:flex-row items-stretch min-h-[400px] overflow-hidden`}>

                                {/* Left */}
                                <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 gap-6">
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                                        {card.title}
                                    </h3>

                                    <p className="text-lg md:text-xl opacity-90 max-w-xl leading-relaxed">
                                        {card.description}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        {card.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                                                <Icon size={16} className={isEven ? "text-white" : "text-orange-500"} />
                                                <span className="text-sm font-semibold">{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="flex-1 h-64 md:h-auto relative">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover"
                                        style={{ minHeight: '250px' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ThinkskoolAdvantage;
