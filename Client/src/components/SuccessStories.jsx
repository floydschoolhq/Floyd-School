import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
    "Artificial Intelligence",
    "Web & Cloud",
    "Robotics & IoT",
    "Cybersecurity"
];

const STORIES = [
    {
        name: "Twisam",
        role: "Full Stack Developer",
        category: "Artificial Intelligence",
        content: "From optometrist to IT pro, thanks to thinkskool. Their lessons help me excel in projects. This transformed my journey, giving me clarity and optimization skills!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Twisam"
    },
    {
        name: "Onkar Lapate",
        role: "SDE-1",
        category: "Web & Cloud",
        content: "Chose thinkskool for structured, high-quality learning due to lack of support & structure. Top-notch mentors, quick TAs, and a supportive community. Best decision ever.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Onkar"
    },
    {
        name: "Durgesh Chaubey",
        role: "SDE - 1",
        category: "Robotics & IoT",
        content: "thinkskool exceeded my college experience. After the course, I transitioned from a consultant to an SDE-1. Exceptional faculty, including alumni from top institutions.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Durgesh"
    }
];

const SuccessStories = () => {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    const filteredStories = STORIES.filter(story => story.category === activeCategory);

    return (
        <section className="bg-slate-950 py-16 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent border-l border-dashed border-white/10" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <Quote size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                            Transformed <br />
                            <span className="text-slate-500">by ThinkSkool</span>
                        </h2>
                    </div>
                    
                    <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group font-bold text-[10px] uppercase tracking-[0.2em]">
                        Success stories <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all duration-300 border ${
                                activeCategory === cat 
                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
                                : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/10"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {STORIES.map((story, idx) => (
                            <motion.div
                                key={`${story.name}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative group hover:border-white/10 transition-all duration-500"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-6 left-6 text-white/5 group-hover:text-white/10 transition-colors">
                                    <Quote size={60} fill="currentColor" strokeWidth={0} />
                                </div>

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-b from-white/10 to-transparent mb-5">
                                        <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full bg-slate-800" />
                                    </div>
                                    
                                    <h4 className="text-lg font-bold text-white mb-0.5">{story.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">{story.role}</p>

                                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                        "{story.content}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Progress bar indication */}
                <div className="mt-16 flex justify-center">
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-white w-1/3"
                            animate={{ x: [0, 100, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
