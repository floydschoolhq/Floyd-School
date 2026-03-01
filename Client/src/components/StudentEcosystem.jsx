import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaRobot, FaChartLine, FaUserTie, FaCloud, FaCheckCircle, FaTimes, FaArrowRight, FaBrain, FaTerminal, FaShieldAlt } from 'react-icons/fa';

const FEATURES = [
    {
        title: "Adaptive Learning Systems",
        miniTitle: "Cognitive Engine",
        icon: <FaBrain />,
        desc: "Advanced algorithmic sequencing that adapts curriculum delivery to individual learning trajectories.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        meta: ["Latency: 12ms", "Sync: Active"],
        details: [
            { label: "Personalized Pedagogy", desc: "Dynamic content adjustment based on real-time competence metrics." },
            { label: "Predictive Analytics", desc: "Early identification of conceptual gaps and learning plateaus." },
            { label: "Automated Feedback", desc: "Instant synthesis of engineering logic and architectural patterns." }
        ]
    },
    {
        title: "Professional Cloud IDE",
        miniTitle: "Engineering Workspace",
        icon: <FaTerminal />,
        desc: "High-performance distributed development environment optimized for industrial engineering workflows.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        meta: ["Uptime: 99.99%", "vCPU: Isolated"],
        details: [
            { label: "Production Parity", desc: "Zero-configuration environments mirroring modern industrial stacks." },
            { label: "Collaborative Debugging", desc: "Cloud-native pair programming for synchronous mentor support." },
            { label: "Resource Provisioning", desc: "Dedicated computational cycles for complex robotics and AI simulations." }
        ]
    },
    {
        title: "Performance Analytics Center",
        miniTitle: "Industrial Dashboard",
        icon: <FaChartLine />,
        desc: "Comprehensive monitoring of professional growth across 50+ validated industrial performance benchmarks.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        meta: ["Metrics: 50+", "Accuracy: ±0.01%"],
        details: [
            { label: "Competency Mapping", desc: "Visualizing skill acquisition against international industry standards." },
            { label: "Professional Benchmarking", desc: "Comparative analysis of engineering output versus career expectations." },
            { label: "Growth Trajectories", desc: "Data-driven forecasting of career readiness and specialization paths." }
        ]
    },
    {
        title: "Global Industry Network",
        miniTitle: "Professional Placement",
        icon: <FaUserTie />,
        desc: "Direct integration with global engineering ecosystems and Tier-1 technology recruitment pipelines.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        meta: ["Auth: Tier-1", "SLA: Priority"],
        details: [
            { label: "Industry Integration", desc: "Strategic networking with CTOs and Engineering Directors." },
            { label: "Placement Ecosystem", desc: "Direct access to high-priority recruitment in leading tech firms." },
            { label: "Professional Stewardship", desc: "Long-term career guidance from established industry architects." }
        ]
    },
    {
        title: "Enterprise Security Protocols",
        miniTitle: "Data Protection",
        icon: <FaShieldAlt />,
        desc: "Secure-by-design infrastructure protecting intellectual property and sensitive academic data assets.",
        color: "text-slate-600",
        bg: "bg-slate-50",
        meta: ["AES-256", "MFA: Required"],
        details: [
            { label: "Protocol Integrity", desc: "Advanced encryption standards for all code and project submissions." },
            { label: "Regulatory Compliance", desc: "Learning environment aligned with international data privacy standards." },
            { label: "Granular Access Control", desc: "Multi-layered authentication and identity management systems." }
        ]
    },
    {
        title: "Neural Mentorship Network",
        miniTitle: "AI Diagnostics",
        icon: <FaRobot />,
        desc: "Advanced neural processing center providing real-time code analysis and pedagogical course correction.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        meta: ["Neural: Sync", "QPU: Active"],
        details: [
            { label: "Real-time Diagnostics", desc: "AI-driven identification of logic anomalies and architectural inefficiencies." },
            { label: "Neural Pair Programming", desc: "Synthetic mentorship providing contextual logic hints and refactoring advice." },
            { label: "Cognitive Load Mapping", desc: "Dynamic pacing adjustment to maintain optimal state of flow for students." }
        ]
    }
];

const StudentEcosystem = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <section id="infrastructure" className="bg-[#f8fafc] py-16 relative overflow-hidden border-t border-slate-100">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 5 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1
                        }}
                        className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + i * 10}%`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/5 border border-blue-500/10 rounded-full mb-6 shadow-sm"
                    >
                        <div className="w-1 h-1 rounded-full bg-[#2563EB] animate-pulse shadow-[0_0_6px_#2563EB]" />
                        <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-[0.5em]">Industrial Infrastructure</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-blue-500">Education Ecosystem.</span>
                    </motion.h2>

                </div>

                {/* Features Grid - Pro Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -6, transition: { duration: 0.4 } }}
                            onClick={() => setSelectedFeature(feature)}
                            className="group relative bg-white/[0.6] backdrop-blur-2xl rounded-[2.2rem] p-8 border border-white shadow-[0_15px_50px_rgba(0,0,0,0.03)] cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_rgba(37,99,235,0.08)] hover:border-blue-500/20"
                        >
                            {/* Scanning Line Animation */}
                            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-full group-hover:animate-scan pointer-events-none" />

                            {/* Accent Glow */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.02] rounded-full blur-3xl group-hover:bg-blue-500/[0.08] transition-all duration-700" />

                            {/* Shine Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-2xl text-white group-hover:bg-[#2563EB] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl shadow-slate-900/10">
                                        {feature.icon}
                                    </div>
                                    <div className="flex flex-col gap-1.5 items-end">
                                        {feature.meta.map((m, i) => (
                                            <span key={i} className="text-[7px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 group-hover:text-blue-500 group-hover:border-blue-100 transition-colors">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2 group-hover:translate-x-1 transition-transform">{feature.miniTitle}</p>
                                <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-tight group-hover:text-[#2563EB] transition-colors">{feature.title}</h3>

                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">System Analysis</span>
                                    <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-[9px] text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:rotate-45">
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md"
                        onClick={() => setSelectedFeature(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-12 relative">
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all border border-slate-100"
                                >
                                    <FaTimes size={14} />
                                </button>

                                <div className="flex items-center gap-8 mb-16">
                                    <div className={`w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-4xl text-white shadow-2xl shadow-slate-900/20`}>
                                        {selectedFeature.icon}
                                    </div>
                                    <div>
                                        <p className="text-[#2563EB] font-black uppercase tracking-[0.5em] text-[10px] mb-2">
                                            {selectedFeature.miniTitle}
                                        </p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                            {selectedFeature.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-8 mb-16">
                                    {selectedFeature.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-start gap-6 group/item">
                                            <div className="mt-1.5 flex-shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_#2563EB]" />
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
                                        System Protocol: Verified
                                    </p>
                                    <button
                                        onClick={() => setSelectedFeature(null)}
                                        className="bg-[#2563EB] hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-1"
                                    >
                                        Exit Deep Dive
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </section >
    );
};

export default StudentEcosystem;


