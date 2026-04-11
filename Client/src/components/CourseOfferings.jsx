import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
 import useIsMobile from '../hooks/useIsMobile';

const CourseOfferings = ({ variant = 'dark' }) => {
    const isDark = variant === 'dark';
    const isMobile = useIsMobile();
    const cardsRef = useRef([]);

    const mobileFeatures = [
        { icon: "01", title: "Live Mentor Guidance", desc: "Real mentors in every session to guide you and review your code." },
        { icon: "02", title: "Weekly Doubt Sessions", desc: "Dedicated weekly sessions to clear all your doubts with clarity." },
        { icon: "03", title: "24/7 Doubt Assistant", desc: "Get your doubts resolved instantly, anytime, day or night." },
        { icon: "04", title: "Growth Associate", desc: "Personal tracking and regular check-ins to ensure your progress." },
        { icon: "05", title: "Live Dashboard", desc: "Comprehensive real-time tracking for students and parents." },
        { icon: "06", title: "Class Recordings", desc: "Access session recordings to revisit concepts anytime." },
    ];

    useEffect(() => {
        if (isMobile) return;
        const cards = cardsRef.current;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = cards.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            if (card) observer.observe(card);
        });

        return () => {
            cards.forEach(card => {
                if (card) observer.unobserve(card);
            });
        };
    }, [isMobile]);



    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    if (isMobile) {
        const shapes = [
            <svg key="triangle" viewBox="0 0 24 24" className="w-5 h-5 fill-yellow-400"><path d="M12 2L2 22h20L12 2z" /></svg>,
            <svg key="arch" viewBox="0 0 24 24" className="w-5 h-5 fill-orange-500"><path d="M12 4C7.58 4 4 7.58 4 12v8h16v-8c0-4.42-3.58-8-8-8z" /></svg>,
            <svg key="pentagon" viewBox="0 0 24 24" className="w-5 h-5 fill-blue-500"><path d="M12 2.5l9 6.5-3.5 10.5h-11l-3.5-10.5 9-6.5z" /></svg>,
            <svg key="square" viewBox="0 0 24 24" className="w-5 h-5 fill-purple-500"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>,
            <svg key="hexagon" viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-500"><path d="M12 2.5L20.5 7.5v10L12 22.5 3.5 17.5v-10L12 2.5z" /></svg>,
            <svg key="diamond" viewBox="0 0 24 24" className="w-5 h-5 fill-amber-500"><path d="M12 2l9 10-9 10-9-10 9-10z" /></svg>
        ];

        return (
            <section id="course-offerings" className="py-8 px-0 relative overflow-hidden bg-white w-full">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>
                
                <div className="relative z-10 text-center mb-10 px-0">
                    <h2 className="text-xl font-bold mb-3 tracking-tighter text-slate-900 leading-tight">
                        We've Got Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Back.</span> Always.
                    </h2>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed px-4">
                        Everything you need is already included.
                    </p>
                </div>

                <div className="w-full mx-auto rounded-3xl overflow-hidden border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] ring-1 ring-black/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                    {mobileFeatures.map((feature, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-3 px-2 py-5 min-h-[130px]">
                                <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                                    <div className="scale-75 flex items-center justify-center">
                                        {shapes[i % shapes.length]}
                                    </div>
                                </div>
                                <div className="flex-1 w-full text-left flex flex-col justify-center">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1 leading-tight tracking-wide">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-snug pr-1">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                            {i < mobileFeatures.length - 1 && (
                                <div className="h-px w-full bg-slate-100" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="course-offerings" className="pt-12 pb-12 relative overflow-hidden bg-black">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/8 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/8 to-transparent" />
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.015] to-transparent" />
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.015] to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-cyan-500/3 via-transparent to-blue-500/3 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tighter">
                        We've Got Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">Back.</span> Always.
                    </h2>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        Everything you need is already included.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {/* C1: Wide - Live mentor guidance */}
                    <div 
                        ref={addToRefs}
                        className="card a1 wide col-span-2 row-span-1 opacity-0 transform translate-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl"
                    >
                        <span className="card-num">01</span>
                        <div className="icon-area">
                            <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                                {/* whiteboard */}
                                <rect x="8" y="14" width="60" height="44" rx="5" fill="rgba(37,99,235,0.25)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6"/>
                                {/* board header bar */}
                                <rect x="8" y="14" width="60" height="11" rx="5" fill="rgba(37,99,235,0.4)"/>
                                <rect x="8" y="20" width="60" height="5" fill="rgba(37,99,235,0.4)"/>
                                {/* lesson lines on board */}
                                <line x1="16" y1="36" x2="46" y2="36" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
                                <line x1="16" y1="43" x2="38" y2="43" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round"/>
                                {/* checkmark on board */}
                                <polyline points="16,52 21,57 32,46" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                {/* board stand legs */}
                                <line x1="26" y1="58" x2="22" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round"/>
                                <line x1="50" y1="58" x2="54" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round"/>
                                {/* mentor head */}
                                <circle cx="86" cy="28" r="10" fill="rgba(255,255,255,0.75)"/>
                                {/* mentor body */}
                                <path d="M68 60 C68 50 74 44 86 44 C98 44 104 50 104 60" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                {/* mentor arm pointing at board */}
                                <line x1="72" y1="50" x2="60" y2="38" stroke="rgba(255,255,255,0.8)" strokeWidth="2.4" strokeLinecap="round"/>
                                <circle cx="59" cy="37" r="3" fill="rgba(255,255,255,0.9)"/>
                                {/* student 1 (small, bottom) */}
                                <circle cx="22" cy="82" r="7" fill="rgba(255,255,255,0.45)"/>
                                <path d="M12 98 C12 91 16.5 88 22 88 C27.5 88 32 91 32 98" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                                {/* student 2 */}
                                <circle cx="50" cy="82" r="7" fill="rgba(255,255,255,0.35)"/>
                                <path d="M40 98 C40 91 44.5 88 50 88 C55.5 88 60 91 60 98" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                                {/* live dot */}
                                <circle cx="92" cy="82" r="6" fill="rgba(255,92,0,0.2)" stroke="rgba(255,92,0,0.7)" strokeWidth="1.4"/>
                                <circle cx="92" cy="82" r="3" fill="#ff5c00"/>
                                <text x="82" y="100" fontFamily="Sora,sans-serif" fontSize="9" fontWeight="700" fill="rgba(255,92,0,0.8)">LIVE</text>
                            </svg>
                        </div>
                        <div className="card-text flex-1">
                            <h3 className="card-title text-2xl font-bold text-white mb-4">Live mentor guidance in every class</h3>
                            <p className="card-desc text-sm text-slate-400 leading-relaxed">
                                Every session has a real mentor guiding you — answering questions, reviewing code, and making sure no one falls behind.
                            </p>
                        </div>
                    </div>

                    {/* C2: Tall - Weekly doubt sessions */}
                    <div 
                        ref={addToRefs}
                        className="card a2 tall col-span-1 row-span-2 opacity-0 transform translate-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl"
                    >
                        <span className="card-num">02</span>
                        <div className="icon-area absolute top-8 left-1/2 transform -translate-x-1/2">
                            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
                                {/* Calendar body */}
                                <rect x="14" y="22" width="92" height="82" rx="8" fill="rgba(255,92,0,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"/>
                                {/* Header */}
                                <rect x="14" y="22" width="92" height="24" rx="8" fill="rgba(255,92,0,0.35)"/>
                                <rect x="14" y="38" width="92" height="8" fill="rgba(255,92,0,0.35)"/>
                                {/* Ring pegs */}
                                <rect x="36" y="14" width="7" height="18" rx="3.5" fill="rgba(255,255,255,0.7)"/>
                                <rect x="77" y="14" width="7" height="18" rx="3.5" fill="rgba(255,255,255,0.7)"/>
                                {/* Day dots row 1 */}
                                <circle cx="30" cy="68" r="5" fill="rgba(255,255,255,0.25)"/>
                                <circle cx="50" cy="68" r="5" fill="rgba(255,255,255,0.25)"/>
                                <circle cx="70" cy="68" r="5" fill="rgba(255,255,255,0.25)"/>
                                <circle cx="90" cy="68" r="7" fill="rgba(255,92,0,0.9)"/>
                                {/* Highlighted ring (session day) */}
                                <circle cx="90" cy="68" r="12" stroke="rgba(255,92,0,0.5)" strokeWidth="1.8" fill="none"/>
                                {/* Day dots row 2 */}
                                <circle cx="30" cy="90" r="5" fill="rgba(255,255,255,0.2)"/>
                                <circle cx="50" cy="90" r="5" fill="rgba(255,255,255,0.2)"/>
                                <circle cx="70" cy="90" r="5" fill="rgba(255,255,255,0.2)"/>
                                {/* Big question mark */}
                                <text x="46" y="108" fontFamily="Sora,sans-serif" fontSize="28" fontWeight="800" fill="rgba(255,255,255,0.9)">?</text>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3 className="card-title text-xl font-bold text-white text-center mb-4">Weekly doubt sessions</h3>
                            <p className="card-desc text-base text-slate-400 leading-relaxed text-center">
                                Every week there is a dedicated session just for clearing doubts. Bring anything you are stuck on and leave with clarity. Our mentors ensure no question goes unanswered.
                            </p>
                        </div>
                    </div>

                    {/* C3: Regular - 24 hour doubt assistant */}
                    <div 
                        ref={addToRefs}
                        className="card a3 col-span-1 row-span-1 opacity-0 transform translate-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl"
                    >
                        <span className="card-num">03</span>
                        <div className="icon-area">
                            <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                                {/* Clock face */}
                                <circle cx="55" cy="55" r="35" fill="rgba(37,99,235,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                                {/* Hour markers */}
                                <line x1="55" y1="25" x2="55" y2="30" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="55" y1="80" x2="55" y2="85" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="25" y1="55" x2="30" y2="55" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="80" y1="55" x2="85" y2="55" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
                                {/* Clock hands showing 24/7 */}
                                <line x1="55" y1="55" x2="55" y2="35" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                                <line x1="55" y1="55" x2="70" y2="55" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                                <circle cx="55" cy="55" r="3" fill="#fff"/>
                                {/* 24/7 text */}
                                <text x="55" y="100" fontFamily="Sora,sans-serif" fontSize="12" fontWeight="800" fill="rgba(255,255,255,0.9)" textAnchor="middle">24/7</text>
                                {/* Support dots around clock */}
                                <circle cx="35" cy="35" r="2" fill="rgba(37,99,235,0.6)"/>
                                <circle cx="75" cy="35" r="2" fill="rgba(37,99,235,0.6)"/>
                                <circle cx="35" cy="75" r="2" fill="rgba(37,99,235,0.6)"/>
                                <circle cx="75" cy="75" r="2" fill="rgba(37,99,235,0.6)"/>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3 className="card-title text-lg font-bold text-white mb-4">24 hour doubt assistant</h3>
                            <p className="card-desc text-sm text-slate-400 leading-relaxed">
                                Stuck at midnight? The assistant is right there — no waiting till next class.
                            </p>
                        </div>
                    </div>

                    {/* C4: Regular - Personal growth associate */}
                    <div 
                        ref={addToRefs}
                        className="card a4 col-span-1 row-span-1 opacity-0 transform translate-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl"
                    >
                        <span className="card-num">04</span>
                        <div className="icon-area">
                            <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                                {/* Growth chart background */}
                                <rect x="15" y="25" width="80" height="60" rx="8" fill="rgba(124,58,237,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"/>
                                {/* Chart grid lines */}
                                <line x1="15" y1="45" x2="95" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                <line x1="15" y1="65" x2="95" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                {/* Growth line */}
                                <polyline points="25,70 40,60 55,50 70,35 85,30" stroke="rgba(124,58,237,0.8)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                {/* Growth dots */}
                                <circle cx="25" cy="70" r="4" fill="rgba(124,58,237,0.6)"/>
                                <circle cx="40" cy="60" r="4" fill="rgba(124,58,237,0.7)"/>
                                <circle cx="55" cy="50" r="4" fill="rgba(124,58,237,0.8)"/>
                                <circle cx="70" cy="35" r="4" fill="rgba(124,58,237,0.9)"/>
                                <circle cx="85" cy="30" r="5" fill="#7c3aed"/>
                                {/* Person icon at end */}
                                <circle cx="85" cy="20" r="6" fill="rgba(255,255,255,0.8)"/>
                                <path d="M75 35 C75 30 79 26 85 26 C91 26 95 30 95 35" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                {/* Up arrow */}
                                <line x1="85" y1="15" x2="85" y2="5" stroke="rgba(124,58,237,0.8)" strokeWidth="2" strokeLinecap="round"/>
                                <polyline points="82,8 85,4 88,8" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3 className="card-title text-lg font-bold text-white mb-4">Your own personal growth associate</h3>
                            <p className="card-desc text-sm text-slate-400 leading-relaxed">
                                Someone who tracks your journey, checks in regularly and ensures you never fall behind.
                            </p>
                        </div>
                    </div>

                    {/* C5: Regular - Progress dashboard */}
                    <div 
                        ref={addToRefs}
                        className="card a5 col-span-1 row-span-1 opacity-0 transform translate-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl"
                    >
                        <span className="card-num">05</span>
                        <div className="icon-area">
                            <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                                {/* Monitor screen */}
                                <rect x="10" y="15" width="90" height="55" rx="6" fill="rgba(8,145,178,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                                {/* Screen header */}
                                <rect x="10" y="15" width="90" height="12" rx="6" fill="rgba(8,145,178,0.25)"/>
                                {/* Progress bars */}
                                <rect x="20" y="35" width="40" height="4" rx="2" fill="rgba(8,145,178,0.3)"/>
                                <rect x="20" y="35" width="30" height="4" rx="2" fill="#0891b2"/>
                                <rect x="20" y="43" width="40" height="4" rx="2" fill="rgba(8,145,178,0.3)"/>
                                <rect x="20" y="43" width="35" height="4" rx="2" fill="#0891b2"/>
                                <rect x="20" y="51" width="40" height="4" rx="2" fill="rgba(8,145,178,0.3)"/>
                                <rect x="20" y="51" width="25" height="4" rx="2" fill="#0891b2"/>
                                <rect x="20" y="59" width="40" height="4" rx="2" fill="rgba(8,145,178,0.3)"/>
                                <rect x="20" y="59" width="38" height="4" rx="2" fill="#0891b2"/>
                                {/* Side panel with stats */}
                                <rect x="70" y="35" width="20" height="28" rx="3" fill="rgba(8,145,178,0.2)"/>
                                <circle cx="80" cy="45" r="3" fill="#0891b2"/>
                                <circle cx="80" cy="53" r="3" fill="rgba(8,145,178,0.6)"/>
                                <circle cx="80" cy="61" r="3" fill="#0891b2"/>
                                {/* Monitor stand */}
                                <rect x="50" y="70" width="10" height="8" fill="rgba(255,255,255,0.4)"/>
                                <rect x="40" y="78" width="30" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
                                {/* Live indicator */}
                                <circle cx="95" cy="20" r="3" fill="#0891b2"/>
                                <text x="85" y="24" fontFamily="Sora,sans-serif" fontSize="8" fontWeight="700" fill="#0891b2">LIVE</text>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3 className="card-title text-lg font-bold text-white mb-4">Progress dashboard for students and parents</h3>
                            <p className="card-desc text-sm text-slate-400 leading-relaxed">
                                A live view of exactly where you are — for both students and parents to stay informed.
                            </p>
                        </div>
                    </div>

                    {/* C6: Wide - All classes recorded */}
                    <div 
                        ref={addToRefs}
                        className="card a6 wide col-span-2 row-span-1 opacity-0 transform translate-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl flex-row-reverse"
                    >
                        <span className="card-num">06</span>
                        <div className="icon-area">
                            <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                                {/* Camera body */}
                                <rect x="15" y="30" width="60" height="45" rx="8" fill="rgba(217,119,6,0.18)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                                {/* Camera lens */}
                                <circle cx="45" cy="52" r="15" fill="rgba(217,119,6,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                                <circle cx="45" cy="52" r="8" fill="rgba(217,119,6,0.35)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
                                {/* Play button in lens */}
                                <polygon points="42,48 42,56 50,52" fill="rgba(255,255,255,0.9)"/>
                                {/* Viewfinder */}
                                <rect x="60" y="38" width="12" height="8" rx="2" fill="rgba(217,119,6,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
                                {/* Recording light */}
                                <circle cx="70" cy="35" r="3" fill="#ff3a3a"/>
                                <circle cx="70" cy="35" r="5" fill="rgba(255,58,58,0.3)" stroke="rgba(255,58,58,0.5)" strokeWidth="1"/>
                                {/* Video tape slots */}
                                <rect x="20" y="80" width="50" height="10" rx="2" fill="rgba(217,119,6,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                                <rect x="23" y="82" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
                                <rect x="31" y="82" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
                                <rect x="39" y="82" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
                                <rect x="47" y="82" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
                                <rect x="55" y="82" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
                                {/* REC text */}
                                <text x="82" y="38" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="800" fill="#ff3a3a">REC</text>
                            </svg>
                        </div>
                        <div className="card-text flex-1">
                            <h3 className="card-title text-2xl font-bold text-white mb-4">All classes are recorded</h3>
                            <p className="card-desc text-sm text-slate-400 leading-relaxed">
                                Missed a class or want to revisit a concept? Every session is recorded and available for you to watch anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Custom CSS */}
            <style>{`
                .card {
                    background: #0e1525;
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 24px;
                    padding: 40px 36px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .card.visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                .card:hover {
                    border-color: rgba(255,255,255,0.14);
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 24px 48px rgba(0,0,0,0.5);
                }

                .card::after {
                    content: '';
                    position: absolute;
                    width: 260px;
                    height: 260px;
                    border-radius: 50%;
                    filter: blur(70px);
                    opacity: 0.13;
                    pointer-events: none;
                    bottom: -80px;
                    right: -80px;
                    transition: opacity 0.4s ease;
                }

                .card:hover::after {
                    opacity: 0.22;
                }

                .card.a1::after { background: #2563eb; }
                .card.a2::after { background: #ff5c00; }
                .card.a3::after { background: #16a34a; }
                .card.a4::after { background: #7c3aed; }
                .card.a5::after { background: #0891b2; }
                .card.a6::after { background: #d97706; }

                .card.wide {
                    flex-direction: row;
                    align-items: center;
                    gap: 36px;
                    padding: 40px 48px;
                }

                .card.tall {
                    justify-content: flex-end;
                    padding: 40px 36px 44px;
                    min-height: 340px;
                }

                .card-num {
                    position: absolute;
                    top: 20px;
                    right: 26px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.12);
                    letter-spacing: 0.06em;
                }

                .icon-badge {
                    width: 58px;
                    height: 58px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .card:hover .icon-badge {
                    transform: scale(1.07);
                }

                .tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    padding: 4px 12px;
                    border-radius: 100px;
                    margin-bottom: 4px;
                    width: fit-content;
                }

                .tag-blue { background: rgba(37,99,235,0.18); color: #93c5fd; border: 1px solid rgba(37,99,235,0.3); }
                .tag-orange { background: rgba(255,92,0,0.15); color: #fda06a; border: 1px solid rgba(255,92,0,0.25); }
                .tag-green { background: rgba(22,163,74,0.15); color: #86efac; border: 1px solid rgba(22,163,74,0.25); }
                .tag-purple { background: rgba(124,58,237,0.15); color: #c4b5fd; border: 1px solid rgba(124,58,237,0.25); }
                .tag-cyan { background: rgba(8,145,178,0.15); color: #67e8f9; border: 1px solid rgba(8,145,178,0.25); }
                .tag-amber { background: rgba(217,119,6,0.15); color: #fcd34d; border: 1px solid rgba(217,119,6,0.25); }

                .tag-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: currentColor;
                }

                @media (max-width: 820px) {
                    .grid { grid-template-columns: 1fr 1fr; }
                    .col-span-2 { grid-column: span 1; }
                    .row-span-2 { grid-row: span 1; }
                }

                @media (max-width: 520px) {
                    .grid { grid-template-columns: 1fr; }
                    .wide { flex-direction: column !important; }
                }
            `}</style>
        </section>
    );
};

export default CourseOfferings;
