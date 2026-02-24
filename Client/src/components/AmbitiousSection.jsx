import React from 'react';
import { motion } from 'framer-motion';
import { Users, Terminal, Award, Briefcase, Clock, TrendingUp } from 'lucide-react';

const AmbitiousSection = () => {
    const stats = [
        { title: "Expert Mentors", desc: "Expert guidance anytime", icon: <Users size={20} /> },
        { title: "Live Projects", desc: "Real-world experience", icon: <Terminal size={20} /> },
        { title: "Certifications", desc: "Industry recognized", icon: <Award size={20} /> },
        { title: "Career Mastery", desc: "Professional Network", icon: <Briefcase size={20} /> },
        { title: "Lifetime Access", desc: "Learn at your pace", icon: <Clock size={20} /> },
        { title: "Global Skills", desc: "Elite Career Roadmap", icon: <TrendingUp size={20} /> }
    ];

    return (
        <section className="bg-white py-14 relative overflow-hidden border-t border-[#FBEFEF] font-['Outfit']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter text-center mb-10 uppercase leading-none">
                            Why <span className="text-[#2563EB]">Ambitious Students</span> Choose us
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.01 }}
                                    className="bg-[#FCF8F8] p-6 rounded-2xl border border-[#FBEFEF] shadow-sm transition-all duration-300 text-center flex flex-col items-center gap-4 group hover:border-[#2563EB]/20"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 border border-[#FBEFEF] shadow-sm">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1.5 font-['Outfit']">{stat.title}</h4>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-loose font-['Outfit']">{stat.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AmbitiousSection;
