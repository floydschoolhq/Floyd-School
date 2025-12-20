import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Users, Headphones, Shield, MessageSquare, Zap, Target, Star, Heart } from 'lucide-react';

const supportRoles = [
    {
        title: "Expert Mentors",
        role: "Technical Architects",
        desc: "Industrial veterans who guide you through complex engineering hurdles and code architecture.",
        benefits: ["Live Debugging", "Architecture Review", "Skill Specialization"],
        icon: <Users className="w-8 h-8" />,
        color: "from-blue-500 to-cyan-500",
        delay: 0
    },
    {
        title: "Growth Associates",
        role: "Career Catalysts",
        desc: "Your personal success partners who ensure your learning path aligns with your professional goals.",
        benefits: ["Career Mapping", "Portfolio Design", "Industry Networking"],
        icon: <Zap className="w-8 h-8" />,
        color: "from-[#F5AFAF] to-pink-500",
        delay: 0.1
    },
    {
        title: "Elite Admins",
        role: "Ecosystem Guardians",
        desc: "Silent engines ensuring the cloud infrastructure and portal response remains 100% efficient.",
        benefits: ["24/7 Availability", "Resource Allocation", "System Optimization"],
        icon: <Shield className="w-8 h-8" />,
        color: "from-purple-500 to-indigo-600",
        delay: 0.2
    }
];

const RoleCard = ({ role, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -15, rotateY: 5, scale: 1.02 }}
            transition={{ duration: 0.8, delay: role.delay }}
            className="group relative"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-[3rem] blur-2xl transition-opacity duration-500`} />

            <div className="relative bg-white border border-[#FBEFEF] rounded-[3rem] p-10 h-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(245,175,175,0.1)] transition-all duration-500 overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    {role.icon}
                </div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-inherit/20`}>
                    {role.icon}
                </div>

                <div className="mb-6">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r ${role.color} bg-clip-text text-transparent mb-2 font-['Outfit']`}>
                        {role.role}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                        {role.title}
                    </h3>
                </div>

                <ul className="space-y-4">
                    {role.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-[11px] font-black text-slate-700 uppercase tracking-widest font-['Outfit']">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.color}`} />
                            {benefit}
                        </li>
                    ))}
                </ul>

                {/* Bottom Graphic */}
                <div className="mt-12 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-[#F5AFAF]">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-black font-['Outfit']">ELITE SUPPORT</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SupportEcosystem = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="relative bg-[#FCF8F8] pt-32 pb-6 overflow-hidden border-t border-[#FBEFEF]">
            {/* Background 3D Elements */}
            <motion.div style={{ y, opacity }} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[#F5AFAF]/5 rounded-full blur-[100px]" />

                {/* Orbital Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#FBEFEF]/50 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#FBEFEF] rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#FBEFEF] shadow-sm mb-6"
                    >
                        <Heart size={14} className="text-[#F5AFAF] fill-[#F5AFAF]" />
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest font-['Outfit']">The Human Engine</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter font-['Outfit']"
                    >
                        Support That <span className="text-[#F5AFAF]">Never Sleeps</span>
                    </motion.h2>

                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {supportRoles.map((role, idx) => (
                        <RoleCard key={idx} role={role} index={idx} />
                    ))}
                </div>

                {/* Bottom CTA Graphic */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-24 p-12 bg-[#2D2D2D] rounded-[3rem] relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F5AFAF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-black text-white mb-2 font-['Outfit'] uppercase tracking-tight">
                                Integrated <span className="text-[#F5AFAF]">Help Desk</span>
                            </h3>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-black text-white font-['Outfit']">1:1</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ratio</span>
                            </div>
                            <div className="w-px h-10 bg-slate-800" />
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-black text-[#F5AFAF] font-['Outfit']">24/7</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SupportEcosystem;
