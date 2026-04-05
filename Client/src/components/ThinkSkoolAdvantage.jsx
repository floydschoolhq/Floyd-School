import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Headphones } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const ADVANTAGES = [
    {
        id: 1,
        title: "You learn by doing, not by watching",
        description: "Every session involves writing real code, building real things and solving real problems. There are no passive lessons here.",
        image: "/images/ecosystem/1.jpeg",
        icon: Clock
    },
    {
        id: 2,
        title: "You learn the skills schools completely skip",
        description: "AI, machine learning, cybersecurity, robotics, IoT. Technologies reshaping every industry that most students will never touch in school.",
        image: "/images/card2.jpg",
        icon: Award
    },
    {
        id: 3,
        title: "Designed specifically for students aged 12 to 18",
        description: "Fast enough to keep things exciting. Never so fast anyone gets left behind. Built for exactly how students at this age learn best.",
        image: "/images/card1.jpg",
        icon: Headphones
    },
    {
        id: 4,
        title: "We teach you to think like a builder",
        description: "Anyone can follow a tutorial. ThinkSkool teaches you to break problems down, experiment and figure things out yourself. That skill stays with you forever.",
        image: "/images/ecosystem/adaptive_learning.jpg",
        icon: Clock
    },
];

const AdvantageCard = ({ advantage, index, isActive }) => {
    const isImageLeft = index % 2 === 0;
    
    // Updated color scheme: 2nd white, 3rd black, 4th white
    const cardColors = [
        { bg: 'from-orange-400 via-orange-500 to-red-500', border: 'border-orange-200', text: 'text-white', innerBg: 'from-orange-500 via-orange-600 to-red-600' },
        { bg: 'from-white to-gray-50', border: 'border-gray-200', text: 'text-gray-900', innerBg: 'from-white to-gray-50' },
        { bg: 'from-gray-900 via-black to-gray-800', border: 'border-gray-700', text: 'text-white', innerBg: 'from-gray-900 via-black to-gray-800' },
        { bg: 'from-white to-gray-50', border: 'border-gray-200', text: 'text-gray-900', innerBg: 'from-white to-gray-50' }
    ];
    
    const currentColor = cardColors[index % 4];
    const isDarkBg = index === 0 || index === 2; // Only orange and black cards are dark

    return (
        <div 
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
            <div className={`bg-gradient-to-br ${currentColor.bg} rounded-3xl p-1 shadow-2xl hover:shadow-3xl transition-shadow duration-300`}>
                <div className={`bg-gradient-to-br ${currentColor.innerBg} rounded-3xl overflow-hidden relative`}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 animate-pulse" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-stretch min-h-[450px]">
                        {/* Image Section */}
                        <div className={`flex-1 relative lg:min-w-[400px] ${isImageLeft ? 'order-1' : 'order-2'}`}>
                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isDarkBg ? 'to-black/30' : 'to-black/20'} z-10`} />
                            <img
                                src={advantage.image}
                                alt={advantage.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                style={{ minHeight: '450px' }}
                            />
                            

                            
                            {/* Floating 3D Decorative Elements */}
                            <div className={`absolute top-8 right-8 w-20 h-20 ${index === 1 ? 'bg-blue-400/30' : index === 2 ? 'bg-pink-400/30' : index === 3 ? 'bg-purple-400/30' : 'bg-orange-400/30'} rounded-full blur-xl animate-bounce`} />
                            <div className={`absolute bottom-8 left-8 w-16 h-16 ${index === 1 ? 'bg-blue-400/30' : index === 2 ? 'bg-rose-400/30' : index === 3 ? 'bg-gray-400/30' : 'bg-red-400/30'} rounded-full blur-lg animate-bounce`} style={{ animationDelay: '0.5s' }} />
                        </div>

                        {/* Content Section */}
                        <div className={`flex-1 p-8 lg:p-14 flex flex-col items-center text-center justify-center ${isImageLeft ? 'order-2' : 'order-1'}`}>
                            <div className="flex flex-col items-center">
                                {/* Title */}
                                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight ${isDarkBg ? 'text-white' : 'text-gray-900'} transition-all duration-500`}>
                                    {advantage.title}
                                </h1>

                                {/* Description */}
                                <p className={`text-lg mb-10 leading-relaxed max-w-xl ${isDarkBg ? 'text-white/90' : 'text-gray-700'} transition-all duration-500`}>
                                    {advantage.description}
                                </p>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ThinkskoolAdvantage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
    const isMobile = useIsMobile();
    const cardRefs = useRef([]);
    const mobileScrollRef = useRef(null);

    // GSAP Scroll Animations + Original scroll detection
    useEffect(() => {
        if (isMobile) return;

        // GSAP animations for cards
        cardRefs.current.forEach((card, index) => {
            if (!card) return;

            // Initial animation
            gsap.fromTo(card, 
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    delay: index * 0.3,
                    ease: "power3.out"
                }
            );

            // ScrollTrigger animation
            ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                onEnter: () => {
                    gsap.to(card, {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                    setActiveIndex(index);
                },
                onLeave: () => {
                    gsap.to(card, {
                        scale: 0.95,
                        y: 20,
                        opacity: 0.7,
                        duration: 0.6,
                        ease: "power2.in"
                    });
                },
                onEnterBack: () => {
                    gsap.to(card, {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                    setActiveIndex(index);
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        scale: 0.95,
                        y: 20,
                        opacity: 0.7,
                        duration: 0.6,
                        ease: "power2.in"
                    });
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [isMobile]);

    // Original scroll detection as backup
    useEffect(() => {
        if (isMobile) return;
        
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const cards = document.querySelectorAll('.advantage-card');
                    let newActive = 0;

                    cards.forEach((card, index) => {
                        const rect = card.getBoundingClientRect();

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
    }, [isMobile]);

    // Mobile Auto-scroll Effect
    useEffect(() => {
        if (!isMobile) return;

        const autoScrollTimer = setInterval(() => {
            if (mobileScrollRef.current) {
                const container = mobileScrollRef.current;
                const nextIndex = (mobileActiveIndex + 1) % ADVANTAGES.length;
                
                // On mobile, the first card has no left margin, others have space-x-5 (20px)
                const cardWidth = container.querySelector('.snap-center')?.offsetWidth || (window.innerWidth * 0.85);
                const gap = 20;
                
                container.scrollTo({
                    left: nextIndex * (cardWidth + gap),
                    behavior: 'smooth'
                });
            }
        }, 3000);

        return () => clearInterval(autoScrollTimer);
    }, [isMobile, mobileActiveIndex]);

    const handleMobileScroll = () => {
        if (mobileScrollRef.current) {
            const container = mobileScrollRef.current;
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.querySelector('.snap-center')?.offsetWidth || (window.innerWidth * 0.85);
            const gap = 20;
            const newIndex = Math.round(scrollLeft / (cardWidth + gap));
            
            if (newIndex !== mobileActiveIndex && newIndex >= 0 && newIndex < ADVANTAGES.length) {
                setMobileActiveIndex(newIndex);
            }
        }
    };

    // Mobile-specific rendering
    if (isMobile) {
        return (
            <section className="py-20 bg-[#F8FAFC] relative w-full overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-50 -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-50 -ml-32 -mb-32" />

                {/* Mobile Header */}
                <div className="px-6 mb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-left"
                    >
                        <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                            Schools teach concepts.
                        </h2>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 leading-tight">
                            We teach you to build.
                        </h2>
                    </motion.div>
                </div>

                {/* Mobile Advantage Cards - Horizontal Scroll */}
                <div className="relative z-10">
                    <div 
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="flex overflow-x-auto space-x-5 px-6 pb-12 snap-x snap-mandatory no-scrollbar"
                    >
                        {ADVANTAGES.map((advantage, index) => {
                            const cardColors = [
                                { bg: 'from-orange-400 to-red-500', innerBg: 'from-orange-500 to-red-600', text: 'text-white', isDark: true },
                                { bg: 'from-white to-gray-50', innerBg: 'from-white to-gray-50', text: 'text-gray-900', isDark: false },
                                { bg: 'from-gray-900 to-black', innerBg: 'from-gray-900 to-black', text: 'text-white', isDark: true },
                                { bg: 'from-white to-gray-100', innerBg: 'from-white to-gray-50', text: 'text-gray-900', isDark: false }
                            ];
                            const cur = cardColors[index % 4];
                            
                            return (
                                <motion.div
                                    key={advantage.id}
                                    className="flex-shrink-0 w-[85vw] snap-center first:ml-0"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-20px" }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <div className={`bg-gradient-to-br ${cur.bg} rounded-[2rem] p-[1px] shadow-2xl h-full transform transition-transform`}>
                                        <div className={`bg-gradient-to-br ${cur.innerBg} rounded-[2rem] overflow-hidden h-full flex flex-col relative`}>
                                            {/* Pattern overlay */}
                                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                            }} />

                                            {/* Image Section */}
                                            <div className="h-56 relative overflow-hidden">
                                                <img 
                                                    src={advantage.image} 
                                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                                                    alt={advantage.title} 
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t ${cur.isDark ? 'from-black/60 to-transparent' : 'from-black/40 to-transparent'}`} />
                                                <div className="absolute bottom-5 left-6 right-6">
                                                     <h3 className="text-white text-2xl font-black leading-tight drop-shadow-md">
                                                        {advantage.title}
                                                     </h3>
                                                </div>
                                            </div>
                                            
                                            {/* Content Section */}
                                            <div className="p-7 flex-grow flex flex-col justify-between">
                                                <p className={`text-base leading-relaxed ${cur.isDark ? 'text-white/80' : 'text-gray-600 font-medium'}`}>
                                                    {advantage.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    
                    {/* Progress Dots / Swipe Indicator */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                            {ADVANTAGES.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === mobileActiveIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'}`} />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
                            EXPLORE
                        </span>
                    </div>
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
                        ref={el => cardRefs.current[index] = el}
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