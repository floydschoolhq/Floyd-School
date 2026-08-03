import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
        image: "/images/advantages/card2.jpg",
        icon: Award
    },
    {
        id: 3,
        title: "Designed specifically for students aged 12 to 18",
        description: "Fast enough to keep things exciting. Never so fast anyone gets left behind. Built for exactly how students at this age learn best.",
        image: "/images/advantages/card1.jpg",
        icon: Headphones
    },
    {
        id: 4,
        title: "We teach you to think like a builder",
        description: "Anyone can follow a tutorial. Floyd School teaches you to break problems down, experiment and figure things out yourself. That skill stays with you forever.",
        image: "/images/ecosystem/adaptive_learning.jpg",
        icon: Clock
    },
];

/* ───── Desktop Card ───── */
const AdvantageCard = ({ advantage, index, isActive }) => {
    const isImageLeft = index % 2 === 0;
    const cardRef = useRef(null);

    // Subtle mouse-follow tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [2, -2]), { stiffness: 200, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-2, 2]), { stiffness: 200, damping: 30 });

    const handleMouseMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    const num = String(index + 1).padStart(2, '0');

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, perspective: 1200 }}
            className="w-full max-w-7xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
            <div
                className={`
                    relative rounded-[2rem] overflow-hidden
                    bg-white border border-gray-200/60
                    shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]
                    hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)]
                    transition-shadow duration-700
                    group
                `}
            >
                <div className={`relative flex flex-col lg:flex-row items-stretch min-h-[420px] ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
                    {/* ── Image Half ── */}
                    <div className="flex-1 relative lg:min-w-[420px] overflow-hidden">
                        <img
                            src={advantage.image}
                            alt={advantage.title}
                            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                            style={{ minHeight: '420px' }}
                        />
                        {/* Gradient veil over image */}
                        <div className={`absolute inset-0 bg-gradient-to-${isImageLeft ? 'r' : 'l'} from-transparent via-transparent to-white/30 pointer-events-none`} />
                        {/* Bottom fade on mobile */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none lg:hidden" />

                        {/* Number badge */}
                        <div className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/60">
                            <span className="text-sm font-black text-slate-900 tracking-tight">{num}</span>
                        </div>
                    </div>

                    {/* ── Content Half ── */}
                    <div className="flex-1 p-10 lg:p-14 flex flex-col justify-center relative">
                        {/* Faint watermark number */}
                        <span className="absolute top-6 right-8 text-[120px] font-black text-slate-50 leading-none select-none pointer-events-none hidden lg:block">
                            {num}
                        </span>

                        <div className="relative z-10 flex flex-col items-start text-left max-w-lg">
                            {/* Category tag */}
                            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5 border border-slate-200 rounded-full px-4 py-1.5">
                                Advantage {num}
                            </span>

                            <h3 className="text-2xl md:text-3xl lg:text-[2.1rem] font-black text-slate-900 leading-[1.15] tracking-tight mb-5">
                                {advantage.title}
                            </h3>

                            <p className="text-[15px] md:text-base text-slate-500 font-medium leading-relaxed mb-8">
                                {advantage.description}
                            </p>

                            {/* Decorative line */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] bg-slate-900 rounded-full group-hover:w-16 transition-all duration-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Floyd School</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ───── Mobile Card ───── */
const MobileAdvantageCard = ({ advantage, index }) => {
    const num = String(index + 1).padStart(2, '0');

    return (
        <motion.div
            className="flex-shrink-0 w-[82vw] snap-center first:ml-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="bg-white rounded-[1.75rem] overflow-hidden border border-gray-200/60 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.07)] h-full flex flex-col">
                {/* Image */}
                <div className="h-52 relative overflow-hidden">
                    <img
                        src={advantage.image}
                        className="w-full h-full object-cover"
                        alt={advantage.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    {/* Number */}
                    <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <span className="text-xs font-black text-slate-900">{num}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">Advantage {num}</span>
                    <h3 className="text-lg font-black text-slate-900 leading-snug mb-3 tracking-tight">
                        {advantage.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                        {advantage.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

/* ───── Section Root ───── */
const FloydSchoolAdvantage = () => {
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
                    y: 80,
                    scale: 0.92
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    delay: index * 0.15,
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
                        scale: 0.97,
                        y: 10,
                        opacity: 0.85,
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
                        scale: 0.97,
                        y: 10,
                        opacity: 0.85,
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
                
                const cardWidth = container.querySelector('.snap-center')?.offsetWidth || (window.innerWidth * 0.82);
                const gap = 20;
                
                container.scrollTo({
                    left: nextIndex * (cardWidth + gap),
                    behavior: 'smooth'
                });
            }
        }, 3500);

        return () => clearInterval(autoScrollTimer);
    }, [isMobile, mobileActiveIndex]);

    const handleMobileScroll = () => {
        if (mobileScrollRef.current) {
            const container = mobileScrollRef.current;
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.querySelector('.snap-center')?.offsetWidth || (window.innerWidth * 0.82);
            const gap = 20;
            const newIndex = Math.round(scrollLeft / (cardWidth + gap));
            
            if (newIndex !== mobileActiveIndex && newIndex >= 0 && newIndex < ADVANTAGES.length) {
                setMobileActiveIndex(newIndex);
            }
        }
    };

    /* ─── Mobile Layout ─── */
    if (isMobile) {
        return (
            <section className="py-20 bg-white relative w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 mb-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-left"
                    >
                        <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
                            Schools teach concepts.
                        </h2>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500 leading-tight">
                            We teach you to build.
                        </h2>
                    </motion.div>
                </div>

                {/* Horizontal scroll cards */}
                <div className="relative z-10">
                    <div
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="flex overflow-x-auto space-x-5 px-6 pb-10 snap-x snap-mandatory no-scrollbar"
                    >
                        {ADVANTAGES.map((advantage, index) => (
                            <MobileAdvantageCard key={advantage.id} advantage={advantage} index={index} />
                        ))}
                    </div>

                    {/* Progress dots */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                            {ADVANTAGES.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === mobileActiveIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            Swipe to explore
                        </span>
                    </div>
                </div>
            </section>
        );
    }

    /* ─── Desktop Layout ─── */
    return (
        <section id="advantage" className="py-28 pb-36 bg-white relative w-full">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Heading */}
            <div className="flex flex-col items-center text-center leading-tight mb-20 md:mb-24 lg:mb-28 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight">
                        Schools teach concepts.
                    </h2>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mt-3 tracking-tight bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
                        We teach students to build real things.
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mt-6 text-base md:text-lg text-slate-400 font-medium max-w-xl"
                >
                    Every skill at Floyd School is mastered by action — building from day one.
                </motion.p>
            </div>

            {/* Stacking Cards */}
            <div className="max-w-7xl mx-auto w-full relative z-10 px-4 lg:px-6">
                {ADVANTAGES.map((advantage, index) => (
                    <div
                        key={advantage.id}
                        ref={el => cardRefs.current[index] = el}
                        className="advantage-card"
                        style={{
                            position: 'sticky',
                            top: `${80 + index * 20}px`,
                            zIndex: index + 1,
                            marginBottom: '2rem',
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

export default FloydSchoolAdvantage;
