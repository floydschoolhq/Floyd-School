import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Headphones } from 'lucide-react';

const IndustrialNetwork = () => {
    return (
        <section className="bg-[#FCF8F8] pt-6 pb-16 overflow-hidden border-t border-[#FBEFEF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-5">
                    {[
                        { label: "Professional Networks", icon: <Briefcase className="w-5 h-5" /> },
                        { label: "Elite Certifications", icon: <Award className="w-5 h-5" /> },
                        { label: "24/7 Expert Support", icon: <Headphones className="w-5 h-5" /> }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            className="group flex flex-col items-center text-center gap-5 p-7 rounded-[2rem] bg-white border border-[#FBEFEF] shadow-sm hover:border-[#2563EB]/20 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-[#2563EB] border border-blue-100 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 group-hover:text-[#2563EB] transition-colors font-['Outfit']">{item.label}</span>
                                <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.4em] mt-2 font-['Outfit']">Tier-1 Partner Network</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[220px]">
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
