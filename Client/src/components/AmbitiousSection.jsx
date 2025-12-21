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
        <section className="bg-slate-50 py-24 relative overflow-hidden font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter font-['Outfit'] text-center mb-16">
                            Why <span className="text-[#2563EB]">Ambitious Students</span> Choose Us
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-500 text-center flex flex-col items-center gap-4 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 shadow-inner">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight mb-2 font-['Outfit']">{stat.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{stat.desc}</p>
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
