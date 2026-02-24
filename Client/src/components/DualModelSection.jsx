import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import dualModelBg from '../assets/images/dual-model-bg.png';

// Typewriter hook
const useTypewriter = (text, isActive, speed = 22) => {
    const [displayed, setDisplayed] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            setDisplayed('');
            let i = 0;
            intervalRef.current = setInterval(() => {
                setDisplayed(text.slice(0, i + 1));
                i++;
                if (i >= text.length) clearInterval(intervalRef.current);
            }, speed);
        } else {
            clearInterval(intervalRef.current);
            setDisplayed('');
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, text]);

    return displayed;
};

// Individual expandable feature row
const FeatureRow = ({ feature, accentColor, borderColor }) => {
    const [hovered, setHovered] = useState(false);
    const typed = useTypewriter(feature.detail, hovered);

    return (
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            animate={{ height: hovered ? 'auto' : 'auto' }}
            className={`group cursor-default rounded-2xl border ${hovered ? borderColor : 'border-white/5'} bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 px-5 overflow-hidden`}
        >
            {/* Collapsed row */}
            <div className="flex items-center gap-4 py-4">
                <motion.div
                    animate={{ scale: hovered ? 1.3 : 1, rotate: hovered ? 90 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-1.5 h-1.5 rounded-full ${accentColor === 'text-blue-400' ? 'bg-blue-400' : 'bg-indigo-400'} shrink-0`}
                />
                <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest flex-1">
                    {feature.name}
                </span>
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0.3, x: hovered ? 2 : 0 }}
                    className={`text-[9px] font-bold uppercase tracking-widest ${accentColor}`}
                >
                    hover
                </motion.div>
            </div>

            {/* Expanded typewriter content */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`border-t ${borderColor.replace('border-', 'border-').replace('/40', '/20')} mx-0 mb-4 pb-4 pt-3`}>
                            <p className={`text-[10px] font-bold ${accentColor} uppercase tracking-[0.3em] mb-2`}>
                                {feature.tag}
                            </p>
                            <p className="text-slate-400 text-[11px] leading-relaxed font-medium min-h-[36px]">
                                {typed}
                                <span className="inline-block w-0.5 h-3 bg-current ml-0.5 animate-pulse align-middle" />
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Full model card
const ModelCard = ({ model, idx, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.15 }}
        className="group relative bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] p-8 overflow-hidden border border-white/5 shadow-3xl flex flex-col h-full"
    >
        {/* Glow layers */}
        <div className={`absolute -top-32 -right-32 w-80 h-80 ${model.glow} rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000 ease-out`} />
        <div className={`absolute -bottom-32 -left-32 w-64 h-64 ${model.glow} opacity-10 rounded-full blur-[80px]`} />

        {/* Badge */}
        <div className={`inline-flex items-center self-start px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 bg-white/5 backdrop-blur-md border border-white/10 ${model.accent}`}>
            <span className={`w-2 h-2 rounded-full ${model.id === 'school' ? 'bg-blue-500' : 'bg-indigo-500'} mr-3 animate-pulse`} />
            {model.badge}
        </div>

        <div className="relative z-10 mb-auto">
            <h3 className="text-3xl font-extrabold text-white uppercase leading-tight tracking-tight mb-1">{model.title}</h3>
            <p className={`${model.accent} font-bold text-[10px] tracking-[0.4em] uppercase mb-6`}>{model.subtitle}</p>

            {/* Expandable feature rows */}
            <div className="flex flex-col gap-2">
                {model.features.map((feature, fIdx) => (
                    <FeatureRow
                        key={fIdx}
                        feature={feature}
                        accentColor={model.accent}
                        borderColor={model.id === 'school' ? 'border-blue-500/40' : 'border-indigo-500/40'}
                    />
                ))}
            </div>
        </div>

        <button
            onClick={onClick}
            className={`relative z-10 w-full mt-8 py-5 rounded-xl flex items-center justify-center gap-4 font-bold uppercase text-[10px] tracking-[0.4em] transition-all duration-500 bg-white/5 text-white hover:bg-${model.id === 'school' ? 'blue' : 'indigo'}-600 group/btn border border-white/10 hover:border-transparent overflow-hidden shadow-2xl`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <span>{model.cta}</span>
            <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
    </motion.div>
);

const DualModelSection = () => {
    const navigate = useNavigate();

    const models = [
        {
            id: 'school',
            title: "On-Campus",
            subtitle: "Industrial Bootcamps",
            glow: "bg-blue-600/20",
            accent: "text-blue-400",
            color: "blue",
            features: [
                {
                    name: "Expert Mentors On-Site",
                    tag: "Mentorship Layer",
                    detail: "Work directly with senior engineers from Google, Microsoft & Amazon who run real-time debugging sessions, guided code reviews, and architecture deep-dives — all inside your school premises."
                },
                {
                    name: "Zero Setup Overhead",
                    tag: "Infrastructure",
                    detail: "We arrive with our full lab stack — laptops, servers, development environments, and project boards pre-configured. Students code from day one without spending a minute on tooling."
                },
                {
                    name: "Industrial Certification",
                    tag: "Credential",
                    detail: "Upon completion, students receive a globally recognized ThinkSkool certification co-signed by industry partners — a resume-grade credential verified on our public platform."
                },
                {
                    name: "Collaborative Lab Sessions",
                    tag: "Learning Mode",
                    detail: "Structured pair-programming and group sprints mirror real engineering teams. Students work in rotating squad formations, improving communication under project pressure."
                },
                {
                    name: "Live Project Deployment",
                    tag: "Outcome",
                    detail: "Every cohort ships a production-grade project by the final week — hosted, documented, and publicly accessible. A portfolio asset that proves real-world capability."
                }
            ],
            cta: "In-School Batch",
            badge: "Offline"
        },
        {
            id: 'independent',
            title: "Online Live",
            subtitle: "Global Direct Access",
            glow: "bg-indigo-600/20",
            accent: "text-indigo-400",
            color: "indigo",
            features: [
                {
                    name: "Flexible Learning Schedule",
                    tag: "Accessibility",
                    detail: "All live sessions are recorded in 4K and instantly available on your dashboard. Learn at 9 PM after school or at 7 AM before — your schedule, your rules, zero compromise on quality."
                },
                {
                    name: "Global Community Access",
                    tag: "Network",
                    detail: "Join a network of 2,000+ active students from 18+ countries. Weekly peer challenges, global hackathons, and a private Discord hub keep you connected to top engineering minds worldwide."
                },
                {
                    name: "Dedicated 1:1 Support",
                    tag: "Mentorship",
                    detail: "Every student gets a personal technical mentor assigned for the full course duration. Book private sessions, ask asynchronous questions, and get code reviews within 24 hours."
                },
                {
                    name: "ThinkSkool Portal Access",
                    tag: "Platform",
                    detail: "The full platform — AI diagnostics, project tracker, learning analytics, peer leaderboard, and mentor dashboard — is available 24/7. Track your precision score in real time."
                },
                {
                    name: "Industry Simulations",
                    tag: "Practicum",
                    detail: "Scenario-based sprints simulate real startup engineering environments. You'll tackle product backlogs, write engineering specs, and present technical solutions to virtual stakeholders."
                }
            ],
            cta: "Enroll Now",
            badge: "Online"
        }
    ];

    return (
        <section id="models" className="relative py-16 overflow-hidden bg-slate-950">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={dualModelBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-55 grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950" />
                <div className="absolute inset-0 bg-slate-950/10" />
            </div>

            {/* Full-width horizontal layout */}
            <div className="w-full px-6 xl:px-12 2xl:px-20 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[9px] mb-2"
                    >
                        Two Paths. One Destination.
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase"
                    >
                        Delivery <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Models.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3"
                    >
                        Hover over any feature below to read the full detail
                    </motion.p>
                </div>

                {/* Equal 2-column full-width cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1600px] mx-auto">
                    {models.map((model, idx) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            idx={idx}
                            onClick={() => idx === 0 ? navigate('/school-partnerships') : navigate('/online-program')}
                        />
                    ))}
                </div>

                {/* Bottom Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-8 bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] relative overflow-hidden group border border-white/5 shadow-3xl max-w-[1600px] mx-auto"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] group-hover:bg-blue-600/20 transition-all duration-700" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-20 h-20 bg-[#2563EB] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-8 h-8 text-white fill-white/20" />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-extrabold text-white uppercase tracking-tight leading-tight mb-2">Industrial Convergence</h4>
                                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.4em] leading-relaxed">
                                    Architecting the interface between <br className="hidden md:block" /> academic theory & global industrial ops
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-xl font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:shadow-blue-500/20">
                                Join Network
                            </button>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Active nodes: 142</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DualModelSection;
