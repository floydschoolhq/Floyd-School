import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, TrendingUp, Layout, Settings, Database, Activity, Lock, Target, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const PANELS = [
    {
        id: 'admin',
        title: "Admin Panel",
        subtitle: "CONTROL & MANAGEMENT",
        description: "The central nervous system of ThinkSkool. Manage global permissions, architect course structures, and monitor system health.",
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
        color: "green",
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
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'Live' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
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
        <section id="platform-panels" className="bg-[#fbfbf8] py-24 relative overflow-hidden border-t border-slate-100">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`, backgroundSize: '40px 40px' }} 
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <ScrollDarkenHeading>
                        Panel Roles
                    </ScrollDarkenHeading>
                </div>

                <div className="relative group/main max-w-6xl mx-auto">
                    {/* Main Interface Block */}
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.02)]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePanel.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10"
                            >
                                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                                    {/* Left Content Side */}
                                    <div className="w-full lg:w-1/3 text-left">
                                        <div className="inline-flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                                            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                                                <activePanel.icon size={22} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{activePanel.title}</h3>
                                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{activePanel.subtitle}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                                            {activePanel.description}
                                        </p>
                                        
                                        <div className="hidden lg:flex gap-4">
                                            <div className="h-1 lg:w-32 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-blue-600"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${((activeIndex + 1) / PANELS.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Grid Side */}
                                    <div className="w-full lg:w-2/3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activePanel.features.map((f, i) => (
                                            <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-blue-500/20 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                        <f.icon size={18} />
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${f.status === 'Live' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                        {f.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-slate-800 font-bold text-[15px] mb-2 tracking-tight">{f.title}</h4>
                                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons (Outside Container) */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-20 z-20">
                        <button onClick={prevPanel} className="p-5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-xl transition-all scale-90 hover:scale-110 group-active:scale-95">
                            <ChevronLeft size={28} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-20 z-20">
                        <button onClick={nextPanel} className="p-5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-xl transition-all scale-90 hover:scale-110 group-active:scale-95">
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </div>

                {/* Bottom Indicators */}
                <div className="flex justify-center gap-3 mt-12">
                    {PANELS.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => setActiveIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-12 bg-blue-600' : 'w-4 bg-slate-200'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformPanels;
