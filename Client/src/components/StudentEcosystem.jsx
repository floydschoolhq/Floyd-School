import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import { FaCode, FaRobot, FaChartLine, FaUserTie, FaCloud, FaCheckCircle, FaTimes, FaArrowRight, FaBrain, FaTerminal, FaShieldAlt } from 'react-icons/fa';

const FEATURES = [
    {
        title: "Personalized Learning",
        miniTitle: "Learning System",
        icon: <FaBrain />,
        image: "/images/ecosystem/adaptive_learning.jpg",
        desc: "Advanced systems that adapt curriculum delivery to your individual learning pace.",
        color: "text-slate-900",
        bg: "bg-slate-50",
        details: [
            { label: "Personalized Study", desc: "Course content that adjusts based on your real-time progress." },
            { label: "Progress Tracking", desc: "Identify areas that need more attention early on." },
            { label: "Quick Feedback", desc: "Get instant guidance on your coding logic and project structure." }
        ]
    },
    {
        title: "Online Coding Workspace",
        miniTitle: "Development Lab",
        icon: <FaTerminal />,
        image: "/images/ecosystem/cloud_ide.jpg",
        desc: "High-performance coding environment ready for real-world projects.",
        color: "text-slate-900",
        bg: "bg-slate-50",
        details: [
            { label: "Industry Ready", desc: "Pre-configured environments that match modern industry standards." },
            { label: "Pair Programming", desc: "Collaborate in real-time with mentors and peers." },
            { label: "Powerful Resources", desc: "Dedicated resources for complex AI and engineering simulations." }
        ]
    },
    {
        title: "Growth & Progress Dashboard",
        miniTitle: "Performance Tracking",
        icon: <FaChartLine />,
        image: "/images/ecosystem/performance.jpg",
        desc: "Detailed tracking of your professional growth according to industry benchmarks.",
        color: "text-slate-900",
        bg: "bg-slate-50",
        details: [
            { label: "Skill Assessment", desc: "See exactly where you stand against international standards." },
            { label: "Career Milestones", desc: "Monitor your progress towards your career goals." },
            { label: "Success Path", desc: "Data-driven guidance for your future career specialization." }
        ]
    },
    {
        title: "Global Professional Network",
        miniTitle: "Career Support",
        icon: <FaUserTie />,
        image: "/images/ecosystem/networking.jpg",
        desc: "Connect directly with global engineering teams and top technology recruiters.",
        color: "text-slate-900",
        bg: "bg-slate-50",
        details: [
            { label: "Industry Connections", desc: "Network with senior engineers and technology leaders." },
            { label: "Hiring Opportunities", desc: "Direct access to job openings in top-tier tech companies." },
            { label: "Career Mentoring", desc: "Ongoing professional guidance from industry experts." }
        ]
    },
    {
        title: "Security & Data Protection",
        miniTitle: "Privacy First",
        icon: <FaShieldAlt />,
        image: "/images/ecosystem/security.jpg",
        desc: "Industry-standard security protecting your personal and academic information.",
        color: "text-slate-600",
        bg: "bg-slate-50",
        details: [
            { label: "Secure Content", desc: "Advanced encryption for all your code and project work." },
            { label: "Privacy Standards", desc: "A learning environment that respects global privacy laws." },
            { label: "Safe Access", desc: "Multi-layered security to keep your information private." }
        ]
    },
    {
        title: "AI-Powered Mentorship",
        miniTitle: "Smart Support",
        icon: <FaRobot />,
        image: "/images/ecosystem/mentorship.jpg",
        desc: "Smart AI tools providing real-time code reviews and learning suggestions.",
        color: "text-slate-900",
        bg: "bg-slate-50",
        details: [
            { label: "Smart Reviews", desc: "AI-powered feedback on your code and project structure." },
            { label: "Intelligent Guidance", desc: "Get helpful hints and suggestions while you code." },
            { label: "Optimal Learning", desc: "Pacing that adapts to keep you engaged and productive." }
        ]
    }
];

const StudentEcosystem = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <section id="infrastructure" className="bg-white py-12 relative overflow-hidden border-t border-slate-100">
            {/* Background elements neutralized for Apple White theme */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-6">

                    <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl">
                        the thinkskool advantage
                    </ScrollDarkenHeading>

                </div>

                {/* Features Grid - Pro Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => setSelectedFeature(feature)}
                            className="group relative bg-white/80 backdrop-blur-xl p-4 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[20px_40px_80px_rgba(0,0,0,0.04)] hover:border-slate-900/30"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Image Container - Enforced 16:9 Aspect Ratio */}
                                <div className="w-full aspect-video overflow-hidden mb-4 border border-slate-50 shadow-sm relative group-hover:shadow-md transition-all">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-slate-900/20 blur-xl scale-150 opacity-100 transition-opacity duration-500" />
                                        <div className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:text-slate-200 transition-colors relative z-10 text-xl">
                                            {feature.icon}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-2 group-hover:translate-x-1 transition-transform">{feature.miniTitle}</p>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-black transition-colors">{feature.title}</h3>

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Program Details</span>
                                    <div className="w-7 h-7 bg-slate-50 flex items-center justify-center text-[9px] text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:rotate-45">
                                        <FaArrowRight size={8} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feature Deep Dive Modal */}
            <AnimatePresence>
                {selectedFeature && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/10 backdrop-blur-md"
                    >
                        <div
                            className="min-h-full flex items-center justify-center p-4"
                            onClick={() => setSelectedFeature(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="bg-white w-full max-w-2xl overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-12 relative">
                                    <button
                                        onClick={() => setSelectedFeature(null)}
                                        className="absolute top-10 right-10 w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all border border-slate-100"
                                    >
                                        <FaTimes size={14} />
                                    </button>

                                    <div className="w-full h-48 overflow-hidden mb-8 border border-slate-100 shadow-2xl relative">
                                        <img
                                            src={selectedFeature.image}
                                            alt={selectedFeature.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-6 left-6 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl scale-150 opacity-100" />
                                            <div className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] relative z-10 text-4xl">
                                                {selectedFeature.icon}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mb-12">
                                        <div>
                                            <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
                                                {selectedFeature.miniTitle}
                                            </p>
                                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-none">
                                                {selectedFeature.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-8 mb-16">
                                        {selectedFeature.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-start gap-6 group/item">
                                                <div className="mt-1.5 flex-shrink-0">
                                                    <div className="w-2 h-2 bg-slate-900 shadow-[0_0_12px_rgba(0,0,0,0.1)]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[14px] font-black text-slate-900 mb-1.5 uppercase tracking-tight">{detail.label}</h4>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] leading-relaxed">{detail.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                                            Verified Program Standards
                                        </p>
                                        <button
                                            onClick={() => setSelectedFeature(null)}
                                            className="bg-slate-900 hover:bg-black text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </section >
    );
};

export default StudentEcosystem;
