import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, CheckCircle, BookOpen } from 'lucide-react';

const TechStackStats = () => {
    const techPills = [
        "React.js", "Node.js", "Python", "Unity", "Unreal Engine", 
        "Artificial Intelligence", "Cybersecurity", "Full Stack", "+ 15 more"
    ];

    const stats = [
        { label: "Joined us", value: "1K+", icon: <Users className="w-5 h-5" /> },
        { label: "Demo bootcamp", value: "7 Days", icon: <CheckCircle className="w-5 h-5" /> },
        { label: "Active courses", value: "4+", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Average rating", value: "4.9★", icon: <Star className="w-5 h-5" /> },
    ];

    return (
        <section className="bg-white py-12 md:py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Tech Showcase */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                    <span className="text-slate-400 font-medium text-sm tracking-tight whitespace-nowrap">
                        Technologies we master
                    </span>
                    <div className="flex flex-wrap justify-center gap-3">
                        {techPills.map((tech, i) => (
                            <motion.span 
                                key={i} 
                                animate={{ 
                                    rotate: [0, 3, -3, 0],
                                    y: [0, -4, 4, 0]
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-slate-700 text-[18px] font-bold tracking-tight cursor-default px-8"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#F1F1F1] rounded-2xl p-8 md:p-12 border border-slate-100/50"
                >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 relative bg-white rounded-xl p-8 shadow-sm">
                        {stats.map((stat, i) => (
                            <div key={i} className={`flex flex-col items-center text-center px-4 ${i !== stats.length - 1 ? 'lg:border-r border-slate-100' : ''}`}>
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                        {stat.value}
                                    </span>
                                    {stat.icon && <div className="text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">{stat.icon}</div>}
                                </div>
                                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 justify-center">
                                    <CheckCircle size={10} className="text-blue-500" /> {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TechStackStats;
