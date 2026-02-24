import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaRobot, FaChartLine, FaUserTie, FaCloud, FaCheckCircle, FaTimes, FaArrowRight, FaBrain, FaTerminal, FaShieldAlt } from 'react-icons/fa';

const FEATURES = [
    {
        title: "AI-Powered Learning",
        miniTitle: "The Brain Engine",
        icon: <FaBrain />,
        desc: "Interactive AI mentors that guide you through complex engineering concepts in real-time.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        details: [
            { label: "Personalized Tutoring", desc: "AI adapts to your learning pace and style." },
            { label: "Code Analysis", desc: "Instant feedback on your architectural decisions." },
            { label: "Predictive Success", desc: "Identify gaps before they become blockers." }
        ]
    },
    {
        title: "Proprietary Cloud IDE",
        miniTitle: "The Workspace",
        icon: <FaTerminal />,
        desc: "Professional-grade development environment accessible from any browser globally.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        details: [
            { label: "One-Click Deploy", desc: "From code to production in seconds." },
            { label: "Collaborative Coding", desc: "Real-time pair programming with mentors." },
            { label: "Resource Isolation", desc: "Dedicated high-performance compute cycles." }
        ]
    },
    {
        title: "Industrial Ops Center",
        miniTitle: "The Dashboard",
        icon: <FaChartLine />,
        desc: "Track your progress across 50+ industrial metrics and performance benchmarks.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        details: [
            { label: "Skill Mapping", desc: "Visualize your growth across various tech stacks." },
            { label: "Benchmark Tracking", desc: "Compare against top industry standards." },
            { label: "Success Timeline", desc: "Clear path to your career objectives." }
        ]
    },
    {
        title: "Elite Network Access",
        miniTitle: "The Connection",
        icon: <FaUserTie />,
        desc: "Direct link to hiring managers and CTOs from Tier-1 tech companies.",
        color: "text-blue-300",
        bg: "bg-blue-500/10",
        details: [
            { label: "Direct Referrals", desc: "Skip the queue for premium job opportunities." },
            { label: "CTO Roundtables", desc: "Exclusive sessions with industry leaders." },
            { label: "Hiring Partners", desc: "Network of 200+ top-tier tech firms." }
        ]
    },
    {
        title: "Zero-Trust Infrastructure",
        miniTitle: "The Security",
        icon: <FaShieldAlt />,
        desc: "Enterprise-grade security ensuring your data and code remain private and secure.",
        color: "text-slate-400",
        bg: "bg-slate-500/10",
        details: [
            { label: "Data Encryption", desc: "End-to-end protection for your intellectual property." },
            { label: "Privacy Shields", desc: "GDPR and SOC2 compliant learning environment." },
            { label: "Access Control", desc: "Secure multi-factor authentication everywhere." }
        ]
    }
];

const StudentEcosystem = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <section className="bg-[#FCF8F8] py-16 relative overflow-hidden border-t border-[#FBEFEF] font-['Outfit']">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-4"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                        <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.4em] font-['Outfit']">Industrial Infrastructure</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter font-['Outfit'] uppercase"
                    >
                        Proprietary <span className="text-[#2563EB]">Ecosystem.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] max-w-2xl mx-auto font-['Outfit']"
                    >
                        Custom-engineered industrial infrastructure designed to architect elite technical competence and global engineering dominance.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            onClick={() => setSelectedFeature(feature)}
                            className="bg-white rounded-[2rem] p-7 border border-[#FBEFEF] shadow-sm group cursor-pointer hover:border-[#2563EB]/20 hover:shadow-md transition-all duration-300 overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className={`w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-3xl text-[#2563EB] mb-6 border border-blue-100 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 shadow-sm relative z-10`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 font-['Outfit'] tracking-tighter uppercase relative z-10">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed mb-5 text-xs font-medium relative z-10">
                                {feature.desc}
                            </p>
                            <div className={`font-black flex items-center gap-2 text-[#2563EB] text-[9px] uppercase tracking-[0.3em] group-hover:gap-4 transition-all font-['Outfit'] relative z-10`}>
                                Analyze Module <FaArrowRight size={10} />
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setSelectedFeature(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white border border-[#FBEFEF] rounded-[2rem] w-full max-w-2xl overflow-hidden relative shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 relative">
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <FaTimes />
                                </button>

                                <div className="flex items-center gap-5 mb-8 mt-2">
                                    <div className={`w-14 h-14 bg-blue-50 rounded-[1.2rem] flex items-center justify-center text-3xl text-[#2563EB] border border-blue-100`}>
                                        {selectedFeature.icon}
                                    </div>
                                    <div>
                                        <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[9px] mb-1 font-['Outfit']">
                                            {selectedFeature.miniTitle}
                                        </p>
                                        <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight uppercase">
                                            {selectedFeature.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-5 mb-7">
                                    {selectedFeature.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                                    <FaCheckCircle className="text-[#2563EB]" size={10} />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 mb-1 font-['Outfit'] uppercase">{detail.label}</h4>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{detail.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-['Outfit']">
                                        Architected for Excellence
                                    </p>
                                    <button
                                        onClick={() => setSelectedFeature(null)}
                                        className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-sm active:scale-95 font-['Outfit']"
                                    >
                                        Return to Ecosystem
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )
                }
            </AnimatePresence >
        </section >
    );
};

export default StudentEcosystem;

