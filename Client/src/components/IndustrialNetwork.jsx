import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Headphones } from 'lucide-react';

const IndustrialNetwork = () => {
    return (
        <section id="network" className="relative bg-white pt-6 pb-16 overflow-hidden border-t border-slate-100">
            {/* Ambient Tints removed for Apple White theme */}

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
                            className="group flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-200 hover:bg-slate-50 transition-all duration-500"
                        >
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-slate-800 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_0_20px_rgba(0,0,0,0.05)]">
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[17px] font-bold tracking-tight text-slate-900 group-hover:text-slate-900 transition-colors">{item.label}</span>
                                <span className="text-[13px] font-medium text-slate-600 tracking-tight mt-2">Tier-1 Partner Network</span>
                            </div>
                            <p className="text-[14px] text-slate-500 font-medium leading-relaxed max-w-[220px] tracking-tight">
                                Accessible within our professional learning environment.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default IndustrialNetwork;

