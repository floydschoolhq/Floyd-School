import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Headphones, ArrowRight } from 'lucide-react';
import fullStackImg from '../assets/images/full stack web development.png';

const ADVANTAGES = [
    {
        id: 1,
        title: "You learn by doing, not by watching",
        description: "Every session involves writing real code, building real things and solving real problems. There are no passive lessons here.",
        image: "/images/ecosystem/cloud_ide.jpg",
        icon: Clock,
        details: ["Action over Observation", "Builder Mindset first", "thinkskool hackathon"]
    },
    {
        id: 2,
        title: "You learn the skills schools completely skip",
        description: "AI, machine learning, cybersecurity, robotics, IoT. Technologies reshaping every industry that most students will never touch in school.",
        image: "/images/ecosystem/security.jpg",
        icon: Award,
        details: ["Production-ready GitHub", "Live project hosting", "Technical case studies"]
    },
    {
        id: 3,
        title: "Designed specifically for students aged 12 to 18",
        description: "Fast enough to keep things exciting. Never so fast anyone gets left behind. Built for exactly how students at this age learn best.",
        image: "/images/ecosystem/mentorship.jpg",
        icon: Headphones,
        details: ["Mentors from top labs", "Industry standard reviews", "Direct career guidance"]
    },
    {
        id: 4,
        title: "We teach you to think like a builder",
        description: "Anyone can follow a tutorial. ThinkSkool teaches you to break problems down, experiment and figure things out yourself. That skill stays with you forever.",
        image: "/images/ecosystem/adaptive_learning.jpg",
        icon: Clock,
        details: ["Advanced AI & ML", "Real-world project thinking", "Hands-on Robotics & IoT"]
    },
];

const AdvantageCard = ({ advantage, index, isActive }) => {
    const icons = {
        Clock: Clock,
        Award: Award,
        Headphones: Headphones
    };
    const Icon = icons[advantage.icon] || Clock;
    const isOrange = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
            className="w-full max-w-7xl mx-auto mb-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
                filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                opacity: isActive ? 1 : 0.65,
                transform: isActive
                    ? 'scale(1) translateY(0px)'
                    : 'scale(0.97) translateY(12px)',
                willChange: 'transform, filter, opacity',
            }}
        >
            <div className={`${isOrange ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-white to-gray-50'} rounded-3xl p-1 shadow-2xl ${isOrange ? 'shadow-orange-500/25' : 'shadow-gray-300/25'}`}>
                <div className={`${isOrange ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700' : 'bg-white'} rounded-3xl overflow-hidden relative`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-stretch min-h-[400px] lg:min-h-[350px]">
                        {/* Left Content */}
                        <div className="flex-1 p-6 lg:p-10 flex flex-col justify-between">
                            <div>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${isOrange ? 'bg-white/20 border-white/30 text-white' : 'bg-orange-500/10 border-orange-500/20 text-orange-600'} text-xs font-bold uppercase tracking-wider mb-6`}>
                                    <Icon size={16} className={isOrange ? "text-white" : "text-orange-600"} />
                                    Advantage {index + 1}
                                </div>

                                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black mb-6 leading-tight ${isOrange ? 'text-white' : 'text-gray-900'}`}>
                                    {advantage.title}
                                </h1>

                                <p className={`text-lg mb-8 leading-relaxed ${isOrange ? 'text-white/90' : 'text-gray-700'}`}>
                                    {advantage.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-3">
                                    {advantage.details.map((detail, idx) => (
                                        <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${isOrange ? 'bg-white/10 border-white/20' : 'bg-orange-500/5 border-orange-200'}`}>
                                            <Icon size={14} className={isOrange ? "text-white" : "text-orange-600"} />
                                            <span className={`font-semibold text-sm ${isOrange ? 'text-white' : 'text-gray-800'}`}>{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="flex-1 relative lg:min-w-[500px]">
                            <div className={`absolute inset-0 bg-gradient-to-l from-transparent ${isOrange ? 'to-orange-600/20' : 'to-gray-200/30'} z-10`} />
                            <img
                                src={advantage.image}
                                alt={advantage.title}
                                className="w-full h-full object-cover"
                                style={{ minHeight: '300px' }}
                            />
                            
                            {/* Laptop Frame Effect */}
                            <div className={`absolute inset-4 border-2 rounded-2xl pointer-events-none ${isOrange ? 'border-white/20' : 'border-gray-300'}`} />
                            <div className={`absolute bottom-4 left-4 right-4 h-1 rounded-full pointer-events-none ${isOrange ? 'bg-white/10' : 'bg-gray-300'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ThinkskoolAdvantage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const isMobile = useIsMobile();

    // 🔥 Smooth + stable scroll detection
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const cards = document.querySelectorAll('.advantage-card');
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

    // Mobile-specific rendering
    if (isMobile) {
        return (
            <section className="py-16 bg-slate-50 relative w-full">
                {/* Mobile Header */}
                <div className="px-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight">
                            Schools teach concepts.
                        </h2>
                        <h2 className="text-2xl font-black text-orange-500 leading-tight">
                            We teach students to build real things.
                        </h2>
                    </motion.div>
                </div>

                {/* Mobile Advantage Cards */}
                <div className="px-4 space-y-6">
                    {ADVANTAGES.map((advantage, index) => (
                        <motion.div
                            key={advantage.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className={`${index % 2 === 0 ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-white to-gray-50'} rounded-2xl p-1 shadow-xl`}>
                                <div className={`${index % 2 === 0 ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700' : 'bg-white'} rounded-2xl overflow-hidden relative`}>
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        }} />
                                    </div>

                                    <div className="relative z-10 p-6">
                                        {/* Icon and Badge */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index % 2 === 0 ? 'bg-white/20' : 'bg-orange-500/10'}`}>
                                                <advantage.icon size={20} className={index % 2 === 0 ? "text-white" : "text-orange-600"} />
                                            </div>
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${index % 2 === 0 ? 'bg-white/20 text-white' : 'bg-orange-500/10 text-orange-600'}`}>
                                                Advantage {index + 1}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-xl font-black mb-3 leading-tight ${index % 2 === 0 ? 'text-white' : 'text-gray-900'}`}>
                                            {advantage.title}
                                        </h3>

                                        {/* Description */}
                                        <p className={`text-sm leading-relaxed mb-4 ${index % 2 === 0 ? 'text-white/90' : 'text-gray-700'}`}>
                                            {advantage.description}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            {advantage.details.map((detail, idx) => (
                                                <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${index % 2 === 0 ? 'bg-white/10' : 'bg-orange-500/5'}`}>
                                                    <advantage.icon size={12} className={index % 2 === 0 ? "text-white" : "text-orange-600"} />
                                                    <span className={`text-xs font-medium ${index % 2 === 0 ? 'text-white' : 'text-gray-800'}`}>{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="advantage" className="py-24 pb-32 bg-slate-50 relative w-full">
            {/* Heading */}
            <div className="flex flex-col items-center text-center leading-tight mb-16 md:mb-20 lg:mb-24">
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-black tracking-tight">
                    Schools teach concepts.
                </h2>

                <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-orange-500 mt-3 tracking-tight">
                    We teach students to build real things.
                </h2>
            </div>

            {/* Advantage Cards */}
            <div className="max-w-7xl mx-auto w-full relative z-10 px-4">
                {ADVANTAGES.map((advantage, index) => (
                    <div
                        key={advantage.id}
                        className="advantage-card"
                        style={{
                            position: 'sticky',
                            top: `${60 + index * 16}px`,
                            zIndex: index + 1,
                            marginBottom: '1rem',
                        }}
                    >
                        <AdvantageCard 
                            advantage={advantage} 
                            index={index} 
                            isActive={index === activeIndex}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ThinkskoolAdvantage;
