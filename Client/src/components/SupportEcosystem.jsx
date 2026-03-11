import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Brain, Shield, Star, Headphones, Users, Zap, Code, Target, Globe, ShieldCheck,
    X, Check, ArrowRight
} from 'lucide-react';
import { FALLBACK_COURSES, supportRoles } from '../constants/siteData';

const iconMap = {
    Brain, Shield, Star, Headphones, Users, Zap, Code, Target, Globe, ShieldCheck
};

const FeatureCard = ({ item, index, onClick }) => {
    const Icon = iconMap[item.icon] || Zap;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-full cursor-pointer"
            onClick={onClick}
        >
            <div className="relative bg-white rounded-2xl p-6 h-full border border-slate-100 shadow-sm transition-all duration-500 flex flex-col hover:border-[#2563EB]/40 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image Component */}
                <div className="w-full h-56 rounded-xl overflow-hidden mb-6 border border-slate-50 shadow-sm relative group-hover:shadow-md transition-all">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                        <Icon
                            size={24}
                            className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover/card:text-blue-400 transition-colors relative z-10"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                <div className="relative z-10 mb-6">
                    {item.role && (
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#2563EB] mb-3">
                            {item.role}
                        </p>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-[#2563EB] transition-colors">
                        {item.title}
                    </h3>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-6 border-t border-slate-50 w-full">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Program Details</span>
                        <ArrowRight size={10} className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SupportEcosystem = () => {
    const containerRef = useRef(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const allFeatures = [
        ...supportRoles.map(r => ({
            ...r,
            desc: r.benefits.join(" • "),
            fullDesc: `Our ${r.title} are ${r.role} who provide end-to-end professional support. From ${r.benefits[0].toLowerCase()} to ${r.benefits[1].toLowerCase()}, we ensure your learning journey is backed by expert guidance.`,
            stats: [
                { label: "Response", value: "Instant" },
                { label: "Availability", value: "24/7" },
                { label: "Expertise", value: "Professional" }
            ]
        }))
    ];

    return (
        <section id="support" ref={containerRef} className="relative bg-white py-10 overflow-hidden border-t border-slate-200">
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
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                    >
                        <Zap size={10} className="text-[#2563EB]" />
                        <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-[0.4em]">Integrated Support</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2563EB] tracking-tight leading-tight mb-6">
                        Support Ecosystem.
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-lg mx-auto leading-relaxed hidden">
                        Industrial veterans and technical architects dedicated to your engineering precision.
                    </p>
                </div>

                {/* Features Grid - Unified 6-Card Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {allFeatures.map((item, idx) => (
                        <FeatureCard key={idx} item={item} index={idx} onClick={() => setSelectedRole(item)} />
                    ))}
                </div>

                {/* Global Response Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100 shadow-sm"
                >
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-4">
                            Global <span className="text-[#2563EB]">Response.</span>
                        </h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">Integrated Technical Support</p>
                    </div>

                    <div className="relative z-10 flex items-center gap-12">
                        <div className="text-center">
                            <span className="block text-4xl font-bold text-slate-900 tracking-tight leading-none mb-1">1:1</span>
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">Ratio</span>
                        </div>
                        <div className="w-px h-12 bg-slate-100" />
                        <div className="text-center">
                            <span className="block text-4xl font-bold text-[#2563EB] tracking-tight leading-none mb-1">24/7</span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Subtle industrial background element */}
                <div className="absolute bottom-10 right-10 pointer-events-none opacity-[0.05] select-none text-[80px] font-black leading-none tracking-tighter uppercase whitespace-nowrap z-0">
                    <span className="text-[#2563EB]">think</span>
                    <span className="text-[#F97316]">skool</span> // OS
                </div>
            </motion.div>

            {/* Premium Industrial Modal */}
            <AnimatePresence>
                {selectedRole && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/10 backdrop-blur-md"
                    >
                        <div
                            className="min-h-full flex items-center justify-center p-4 md:p-8"
                            onClick={() => setSelectedRole(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-white/20 relative group/modal"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedRole(null)}
                                    className="absolute top-6 right-6 z-50 p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-xl text-slate-900 transition-all border border-slate-900/5 hover:scale-110 active:scale-95"
                                >
                                    <X size={20} />
                                </button>

                                <div className="p-8 md:p-12">
                                    {/* Header with Image */}
                                    <div className="w-full h-56 rounded-xl overflow-hidden mb-8 border border-slate-100 shadow-2xl relative">
                                        <img
                                            src={selectedRole.image}
                                            alt={selectedRole.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-6 left-6 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 opacity-100" />
                                            {React.createElement(iconMap[selectedRole.icon] || Zap, {
                                                size: 32,
                                                className: "text-blue-500 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)] relative z-10",
                                                strokeWidth: 1.5
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mb-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.4em]">{selectedRole.role}</span>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Active</span>
                                                </div>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-none">
                                                {selectedRole.title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-8">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider leading-relaxed">
                                                {selectedRole.fullDesc}
                                            </p>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {selectedRole.stats.map((stat, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 text-center shadow-sm">
                                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</span>
                                                    <span className="block text-[13px] font-black text-slate-900 uppercase tracking-tight">{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Benefits Checklist */}
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                                Service Deliverables
                                                <div className="flex-1 h-px bg-slate-100" />
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedRole.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 group/item hover:bg-blue-50 hover:border-blue-100 transition-all">
                                                        <div className="w-5 h-5 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                                                            <Check size={10} strokeWidth={4} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover/item:text-blue-600">
                                                            {benefit}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Logo Decoration */}
                                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="text-[14px] font-black uppercase tracking-tighter">
                                            <span className="text-[#2563EB]">think</span>
                                            <span className="text-[#F97316]">skool</span> // OS
                                        </div>
                                        <button
                                            onClick={() => setSelectedRole(null)}
                                            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20"
                                        >
                                            Close Folder <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default SupportEcosystem;


