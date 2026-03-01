import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Shield, Star, Headphones, Users, Zap } from 'lucide-react';

const supportRoles = [
    {
        role: "Technical Architects",
        title: "Expert Mentors",
        benefits: ["Live Debugging", "Architecture Review", "Skill Specialization"],
        icon: <Users className="w-8 h-8" />,
        color: "from-blue-600 to-indigo-600",
        delay: 0
    },
    {
        role: "Career Catalysts",
        title: "Growth Associates",
        benefits: ["Career Mapping", "Portfolio Design", "Industry Networking"],
        icon: <Zap className="w-8 h-8" />,
        color: "from-blue-500 to-cyan-400",
        delay: 0.2
    },
    {
        role: "Platform Managers",
        title: "System Admins",
        benefits: ["24/7 Availability", "Resource Allocation", "System Optimization"],
        icon: <Shield className="w-8 h-8" />,
        color: "from-slate-700 to-slate-900",
        delay: 0.4
    }
];

const FeatureCard = ({ item, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-full"
        >
            <div className="relative bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-6 h-full border border-white/10 shadow-2xl transition-all duration-500 flex flex-col items-center text-center hover:border-[#2563EB]/40 hover:bg-white/[0.05]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />

                <div className={`relative z-10 w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-500 shadow-xl border border-white/5`}>
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                </div>

                <div className="relative z-10 mb-4">
                    {item.role && (
                        <p className="text-[7px] font-black uppercase tracking-[0.4em] text-[#2563EB] mb-2">
                            {item.role}
                        </p>
                    )}
                    <h3 className="text-lg font-extrabold text-white tracking-tight uppercase leading-none group-hover:text-blue-400 transition-colors">
                        {item.title}
                    </h3>
                </div>

                <p className="relative z-10 text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-6 italic">
                    {item.desc || item.benefits?.join(" • ")}
                </p>

                {item.benefits && (
                    <div className="relative z-10 flex -space-x-3 mt-auto">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-[7px] font-black text-slate-500">
                                {String.fromCharCode(64 + i + index)}
                            </div>
                        ))}
                    </div>
                )}

                {!item.benefits && (
                    <div className="relative z-10 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#2563EB] mt-auto border border-blue-500/20">
                        <Zap size={10} fill="currentColor" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SupportEcosystem = () => {
    const containerRef = useRef(null);

    const allFeatures = [
        ...supportRoles.map(r => ({ ...r, desc: r.benefits.join(" • ") }))
    ];

    return (
        <section id="support" ref={containerRef} className="relative bg-[#000000] py-20 overflow-hidden border-t border-white/5">
            {/* Ambient Background Energy */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-7xl mx-auto px-4 relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                    >
                        <Zap size={10} className="text-[#2563EB]" />
                        <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-[0.4em]">The Industrial Engine</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-6">
                        Our <span className="text-[#2563EB]">Team.</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-lg mx-auto leading-relaxed">
                        Industrial veterans and technical architects dedicated to your engineering precision.
                    </p>
                </div>

                {/* Features Grid - Unified 6-Card Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {allFeatures.map((item, idx) => (
                        <FeatureCard key={idx} item={item} index={idx} />
                    ))}
                </div>

                {/* Global Response Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10"
                >
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                            Global <span className="text-[#2563EB]">Response.</span>
                        </h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Integrated Tech-Support Intelligence</p>
                    </div>

                    <div className="relative z-10 flex items-center gap-12">
                        <div className="text-center">
                            <span className="block text-4xl font-black text-white tracking-tighter leading-none mb-1">1:1</span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Ratio</span>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <span className="block text-4xl font-black text-[#2563EB] tracking-tighter leading-none mb-1">24/7</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Active</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SupportEcosystem;


