import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Headphones } from 'lucide-react';

const IndustrialNetwork = () => {
    return (
        <section className="bg-[#FCF8F8] pt-6 pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { label: "Professional Networks", icon: <Briefcase className="w-5 h-5" /> },
                        { label: "Elite Certifications", icon: <Award className="w-5 h-5" /> },
                        { label: "24/7 Expert Support", icon: <Headphones className="w-5 h-5" /> }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group flex flex-col items-center text-center gap-6 p-10 rounded-[3rem] bg-white border border-[#FBEFEF] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(245,175,175,0.15)] hover:border-[#2563EB]/20 transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#FCF8F8] flex items-center justify-center text-[#2563EB] shadow-inner group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-slate-950 transition-colors">{item.label}</span>
                                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mt-2">Tier-1 Partner Network</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
                                Seamlessly integrated into our industrial learning ecosystem.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IndustrialNetwork;
