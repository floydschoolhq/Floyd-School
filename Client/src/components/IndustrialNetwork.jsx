import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Headphones } from 'lucide-react';

const IndustrialNetwork = () => {
    return (
        <section id="network" className="relative bg-[#020617] pt-6 pb-16 overflow-hidden border-t border-white/5 cyber-mesh">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#2563EB]/5 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                <div className="grid md:grid-cols-3 gap-5">
                    {[
                        { label: "Professional Networks", icon: <Briefcase className="w-5 h-5" /> },
                        { label: "Industry Certifications", icon: <Award className="w-5 h-5" /> },
                        { label: "24/7 Expert Support", icon: <Headphones className="w-5 h-5" /> }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            className="group flex flex-col items-center text-center gap-5 p-7 rounded-[2rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl hover:border-[#2563EB]/40 hover:bg-white/[0.05] transition-all duration-500"
                        >
                            <div className="w-14 h-14 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-[#2563EB] border border-white/10 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-white group-hover:text-blue-400 transition-colors">{item.label}</span>
                                <span className="text-[9px] font-bold text-[#2563EB] uppercase tracking-[0.4em] mt-2">Tier-1 Partner Network</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[220px] uppercase tracking-widest text-[9px]">
                                Seamlessly integrated into our industrial learning ecosystem.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default IndustrialNetwork;

