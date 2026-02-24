import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Shield, Star, Headphones, Users, Zap } from 'lucide-react';

const supportRoles = [
    {
        role: "Industrial Lead",
        title: "Technical Mentors",
        benefits: ["Live Problem Solving", "Code Reviews", "Industrial Best Practices"],
        icon: <Users className="w-8 h-8" />,
        color: "from-blue-500 to-indigo-600",
        delay: 0
    },
    {
        role: "Ops Engine",
        title: "Support Engineers",
        benefits: ["24/7 Availability", "Resource Allocation", "System Optimization"],
        icon: <Shield className="w-8 h-8" />,
        color: "from-purple-500 to-indigo-600",
        delay: 0.2
    },
    {
        role: "Experience",
        title: "Success Managers",
        benefits: ["Career Coaching", "Network Access", "Personalized Roadmap"],
        icon: <Star className="w-8 h-8" />,
        color: "from-blue-500 to-blue-600",
        delay: 0.4
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

            <div className="relative bg-white border border-[#FBEFEF] rounded-[2rem] p-7 h-full shadow-sm hover:shadow-md hover:border-[#2563EB]/20 transition-all duration-400 overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    {role.icon}
                </div>

                <div className={`w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] mb-5 border border-blue-100 group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-sm`}>
                    {React.cloneElement(role.icon, { className: "w-6 h-6" })}
                </div>

                <div className="mb-5">
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] text-[#2563EB] mb-2 font-['Outfit']`}>
                        {role.role}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] tracking-tighter uppercase leading-none">
                        {role.title}
                    </h3>
                </div>

                <ul className="space-y-3">
                    {role.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest font-['Outfit']">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                            {benefit}
                        </li>
                    ))}
                </ul>

                {/* Bottom Graphic */}
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2563EB]">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[9px] font-black font-['Outfit'] uppercase tracking-[0.2em]">Dedicated Support</span>
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
        <section ref={containerRef} className="relative bg-white pt-16 pb-16 overflow-hidden border-t border-[#FBEFEF]">

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-4"
                    >
                        <Heart size={12} className="text-[#2563EB] fill-[#2563EB]" />
                        <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest font-['Outfit']">The Human Engine</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter font-['Outfit'] uppercase"
                    >
                        Support That <span className="text-[#2563EB]">Never Sleeps</span>
                    </motion.h2>

                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {supportRoles.map((role, idx) => (
                        <RoleCard key={idx} role={role} index={idx} />
                    ))}
                </div>

                {/* Bottom CTA Graphic */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-[#FCF8F8] rounded-[2rem] border border-[#FBEFEF] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-black text-slate-900 font-['Outfit'] uppercase tracking-tight">
                            Integrated <span className="text-[#2563EB]">Help Desk</span>
                        </h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-['Outfit']">Global Response Infrastructure</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-slate-900 font-['Outfit']">1:1</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ratio</span>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-[#2563EB] font-['Outfit']">24/7</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SupportEcosystem;

