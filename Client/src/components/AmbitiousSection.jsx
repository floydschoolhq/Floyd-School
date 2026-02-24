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
        { title: "Global Skills", desc: "Career Roadmap", icon: <TrendingUp size={20} /> }
    ];

    return (
        <section className="bg-[#020617] py-16 relative overflow-hidden border-t border-white/5 cyber-mesh">
            {/* Energy Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-float-orb"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                        >
                            <TrendingUp size={10} className="text-[#2563EB]" />
                            <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.4em]">Continuous Evolution</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-6">
                            The <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-blue-400">Excellence</span> Loop
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] max-w-lg mx-auto">
                            A high-performance feedback system ensuring industrial-grade engineering mastery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                                whileHover={{ y: -6 }}
                                className="bg-white/[0.03] backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500 flex items-center gap-5 group relative overflow-hidden hover:border-[#2563EB]/40 hover:bg-white/[0.05]"
                            >
                                {/* Mini Glow Filter */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                                {/* Glass Shine sweep */}
                                <div className="glass-shine-effect" />

                                <div className="relative z-10 w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-500 shadow-xl border border-white/5 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                    {React.cloneElement(stat.icon, { size: 20 })}
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-[13px] font-black text-white uppercase tracking-tight mb-1 leading-none group-hover:text-blue-400 transition-colors">{stat.title}</h4>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{stat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AmbitiousSection;

