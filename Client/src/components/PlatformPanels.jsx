import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, TrendingUp, Layout, Settings, Database, Activity, Lock, Target, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const PANELS = [
    {
        id: 'admin',
        title: "Admin Panel",
        subtitle: "CONTROL & MANAGEMENT",
        description: "the central nervous system of thinkskool. Manage global permissions, architect course structures, and monitor system health.",
        icon: Shield,
        color: "orange",
        features: [
            { icon: Layout, title: "Platform Overview", desc: "Real-time health status of all active panels and batches.", status: "Live" },
            { icon: Lock, title: "Access Control", desc: "Granular role-based permissions and panel access management.", status: "Live" },
            { icon: Settings, title: "System Settings", desc: "Configure global integrations, API keys, and platform rules.", status: "Beta" }
        ]
    },
    {
        id: 'mentor',
        title: "Mentor Panel",
        subtitle: "ACADEMIC HUB",
        description: "Built for impact. Bridge the gap between industry and education with real-time student interaction and batch analytics.",
        icon: Users,
        color: "blue",
        features: [
            { icon: Target, title: "Batch Performance", desc: "Monitor student progress and skill acquisition metrics.", status: "Live" },
            { icon: Activity, title: "Live Interaction", desc: "Manage real-time queries and code review sessions.", status: "Live" },
            { icon: Zap, title: "Curriculum Flow", desc: "Deploy industrial problem statements and project modules.", status: "Live" }
        ]
    },
    {
        id: 'growth',
        title: "Growth Panel",
        subtitle: "OPERATIONAL EDGE",
        description: "Fueling the ecosystem. Data-driven tools for scaling outreach, managing lead pipelines, and optimizing operations.",
        icon: TrendingUp,
        color: "slate",
        features: [
            { icon: Database, title: "Lead Management", desc: "End-to-end tracking from first interaction to enrollment.", status: "Live" },
            { icon: TrendingUp, title: "Revenue Analytics", desc: "Detailed forecasting and performance visualizations.", status: "Live" },
            { icon: Users, title: "Outreach CRM", desc: "Automated communication workflows for potential learners.", status: "Beta" }
        ]
    }
];

const FeatureCard = ({ icon: Icon, title, desc, status, activeColor }) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl bg-${activeColor}-500/10 text-${activeColor}-400 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${status === 'Live' ? 'bg-slate-500/5 text-slate-400 border-slate-500/10' : 'bg-slate-500/5 text-slate-500 border-slate-500/10'}`}>
                {status}
            </span>
        </div>
        <h4 className="text-white font-bold text-[16px] mb-2 tracking-tight">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
);

const PlatformPanels = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activePanel = PANELS[activeIndex];

    const nextPanel = () => setActiveIndex((prev) => (prev + 1) % PANELS.length);
    const prevPanel = () => setActiveIndex((prev) => (prev - 1 + PANELS.length) % PANELS.length);

    return (
        <section id="platform-panels" className="bg-slate-950 py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <ScrollDarkenHeading variant="dark">
                        OUR PANELS & ROLES
                    </ScrollDarkenHeading>
                </div>

                <div className="relative group/main max-w-6xl mx-auto">
                    {/* Main Interface Block */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePanel.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10"
                            >
                                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                                    {/* Left Content Side */}
                                    <div className="w-full lg:w-1/3 text-left">
                                        <div className="inline-flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8 w-full">
                                            <div className="p-3 bg-white text-black rounded-xl shadow-xl">
                                                <activePanel.icon size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">{activePanel.title}</h3>
                                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{activePanel.subtitle}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                                            {activePanel.description}
                                        </p>
                                        
                                        <div className="hidden lg:block w-full">
                                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-white"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${((activeIndex + 1) / PANELS.length) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-3">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">0{activeIndex + 1}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">0{PANELS.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Grid Side */}
                                    <div className="w-full lg:w-2/3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {activePanel.features.map((f, i) => (
                                            <div key={i} className="bg-white/[0.03] backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:border-white/30 hover:bg-white/[0.07] transition-all group/card shadow-xl">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white group-hover/card:scale-110 transition-transform">
                                                        <f.icon size={20} />
                                                    </div>
                                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${f.status === 'Live' ? 'bg-white/10 text-white border-white/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                                        {f.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        {f.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-white font-bold text-[15px] mb-2 tracking-tight">{f.title}</h4>
                                                <p className="text-slate-500 text-[13px] leading-relaxed font-medium">{f.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons (Outside Container) */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-12 z-20">
                        <button onClick={prevPanel} className="p-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white hover:text-black shadow-2xl transition-all scale-90 hover:scale-110 active:scale-95">
                            <ChevronLeft size={24} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-12 z-20">
                        <button onClick={nextPanel} className="p-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white hover:text-black shadow-2xl transition-all scale-90 hover:scale-110 active:scale-95">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Bottom Indicators */}
                <div className="flex justify-center gap-4 mt-12">
                    {PANELS.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => setActiveIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-10 bg-white' : 'w-4 bg-white/10 hover:bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformPanels;
