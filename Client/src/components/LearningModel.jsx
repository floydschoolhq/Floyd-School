import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, Users2, Rocket, ArrowRight } from 'lucide-react';

const STAGES = [
    {
        id: 'acquire',
        title: 'Acquire',
        subtitle: 'Master Core Concepts',
        description: 'Deep dive into foundational engineering principles with expert-led sessions and structured industrial roadmaps.',
        icon: Terminal,
        metrics: ['200+ Module coverage', 'AI-Assisted Learning', 'Expert Q&A'],
        mockup: 'acquire'
    },
    {
        id: 'interact',
        title: 'Interact',
        subtitle: 'Live Sandboxes',
        description: 'Practice in real-time within our cloud-integrated IDEs and sandboxes. Immediate feedback loops for rapid skill compounding.',
        icon: Code2,
        metrics: ['No Setup Required', 'Real-time Validation', 'Edge Case Testing'],
        mockup: 'interact'
    },
    {
        id: 'collaborate',
        title: 'Collaborate',
        subtitle: 'Production Teams',
        description: 'Join cross-functional squads to build real features. Experience Git workflows, peer reviews, and industrial agile cycles.',
        icon: Users2,
        metrics: ['Git Workflow Mastery', 'Alpha Feature Builds', 'Sprint Planning'],
        mockup: 'collaborate'
    },
    {
        id: 'deploy',
        title: 'Deploy',
        subtitle: 'Live Launch',
        description: 'Launch your builds to production-grade infrastructure. Verify your impact with industrial-grade stats and certification.',
        icon: Rocket,
        metrics: ['Cloud Deployment', 'Performance Scrutiny', 'Verified Mastery'],
        mockup: 'deploy'
    }
];

const MockupDisplay = ({ id }) => {
    // This renders a stylized "UI Mockup" based on the current stage
    const renderContent = () => {
        switch (id) {
            case 'acquire':
                return (
                    <div className="p-8 h-full flex flex-col gap-6 bg-gradient-to-br from-slate-900 to-black">
                        {/* Header with Live Status */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xl">
                                    <Users2 size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[13px] font-bold text-white tracking-tight">Main Lecture Room</div>
                                    <div className="text-[10px] text-slate-500 font-medium">Topic: Distributed Systems</div>
                                </div>
                            </div>
                            {/* Live status removed */}
                        </div>

                        {/* Mentor Profile Snippet */}
                        <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian" alt="mentor" />
                            </div>
                            <div>
                                <div className="text-[11px] font-bold text-white">Adrian K. <span className="text-[9px] text-emerald-500 ml-2">Sr. Architect</span></div>
                                <div className="text-[9px] text-slate-500">Leading the session on Scalability Patterns</div>
                            </div>
                        </div>

                        {/* Module Roadmap Cards */}
                        <div className="grid grid-cols-1 gap-3">
                            {[ 
                                { title: 'Foundational Principles', progress: '85%', color: 'w-[85%] bg-emerald-500' },
                                { title: 'Industrial System Design', progress: 'Locked', color: 'w-0 bg-slate-700' }
                            ].map((module, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/[0.08] transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[12px] font-bold text-slate-200">{module.title}</div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{module.progress}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${module.color} transition-all duration-1000`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Featured Resource Card */}
                        <div className="mt-auto p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                                <Code2 size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-bold text-white mb-1">Weekly Engineering Digest</div>
                                <div className="flex gap-2">
                                    <div className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Case Study</div>
                                    <div className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PDF</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'interact':
                return (
                    <div className="p-0 h-full flex flex-col">
                        <div className="bg-slate-800 border-b border-white/10 px-5 py-3 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="text-[12px] text-slate-300 font-mono font-bold tracking-tight">sandbox.thinkskool.ai</div>
                        </div>
                        <div className="flex-1 flex">
                            <div className="w-14 border-r border-white/10 bg-slate-800/50 flex flex-col items-center py-6 gap-5">
                                <div className="p-2 rounded bg-white/10 shadow-lg text-white"><Code2 size={16} /></div>
                                <div className="p-2 rounded hover:bg-white/5 text-slate-500"><Users2 size={16} /></div>
                                <div className="p-2 rounded hover:bg-white/5 text-slate-500"><Terminal size={16} /></div>
                                <div className="mt-auto p-2 rounded hover:bg-white/5 text-slate-500"><Rocket size={16} /></div>
                            </div>
                            <div className="flex-1 p-8 font-mono text-[13px] space-y-3 leading-relaxed">
                                <div className="text-emerald-400 font-bold">const thinkskool = async () =&gt; &#123;</div>
                                <div className="pl-6 text-white font-medium">await learn("core_concepts");</div>
                                <div className="pl-6 text-white font-medium">await practice("live_sandbox");</div>
                                <div className="pl-6 text-slate-400">await deploy("production");</div>
                                <div className="text-emerald-400 font-bold">&#125;;</div>
                                <div className="pt-6 text-slate-500 italic font-medium">// Terminal Output...</div>
                                <div className="text-white bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 rounded-lg inline-block font-bold">
                                    Success: Build generated in 1.2s
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'collaborate':
                return (
                    <div className="p-8 h-full flex flex-col gap-8">
                        <div className="grid grid-cols-3 gap-6">
                            {[ 
                                { name: 'Sarah L.', seed: '11' }, 
                                { name: 'James W.', seed: '12' }, 
                                { name: 'Elena R.', seed: '13' } 
                            ].map((user, i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 shadow-lg hover:bg-white/[0.08] transition-all">
                                    <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.seed}`} alt="user" className="w-full h-full rounded-full bg-slate-800" />
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 capitalize">{user.name}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 bg-white/10 rounded-3xl border border-white/20 p-6 space-y-6 relative overflow-hidden shadow-inner">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Users2 size={20} /></div>
                                    <div className="space-y-0.5">
                                        <div className="text-[12px] font-bold text-white">Agile Sprint #4</div>
                                        <div className="text-[9px] text-slate-500">8 Days remaining</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black rounded-full uppercase tracking-widest">In Progress</div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                    <div className="text-[11px] font-medium text-slate-300">Feature: Global Auth</div>
                                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/20 overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="user" />
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between opacity-50">
                                    <div className="text-[11px] font-medium text-slate-300">Issue: API Bottleneck</div>
                                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/20 overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="user" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent flex items-center px-6">
                                <div className="h-8 w-full border border-emerald-500/30 rounded-full flex items-center justify-center text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 backdrop-blur-sm">
                                    3 Open Pull Requests
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'deploy':
                return (
                    <div className="h-full flex flex-col items-center justify-center p-8 gap-8 text-center">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
                            <Rocket size={40} className="text-emerald-400" />
                        </div>
                        <div className="space-y-3">
                            <div className="text-2xl font-bold text-white">Project Live</div>
                            <div className="text-[12px] text-slate-400 uppercase tracking-widest">Performance Score: 98%</div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4 mt-2">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                                <div className="text-[10px] text-slate-500 uppercase mb-2">Response Time</div>
                                <div className="text-lg font-bold text-white">124ms</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                                <div className="text-[10px] text-slate-500 uppercase mb-2">Global Nodes</div>
                                <div className="text-lg font-bold text-white">42 Active</div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
        >
            {renderContent()}
        </motion.div>
    )
}

const LearningModel = () => {
    const [activeStage, setActiveStage] = useState(STAGES[0]);

    return (
        <section className="bg-slate-950 py-16 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-3"
                    >
                        <span className="w-10 h-px bg-white/20" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Learning Framework</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl md:text-4xl font-black text-white tracking-tight"
                    >
                        A 4-stage model to turn you <br />
                        <span className="text-slate-500">into a Coding Hub</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Navigation */}
                    <div className="lg:col-span-5 space-y-2">
                        {STAGES.map((stage) => {
                            const Icon = stage.icon;
                            const isActive = activeStage.id === stage.id;
                            
                            return (
                                <div
                                    key={stage.id}
                                    onMouseEnter={() => setActiveStage(stage)}
                                    className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-500 ${
                                        isActive 
                                        ? "bg-white/5 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)]" 
                                        : "bg-transparent border-transparent hover:bg-white/[0.01]"
                                    }`}
                                >
                                    <div className="flex gap-6">
                                        <div className={`mt-1 transition-colors duration-500 ${isActive ? "text-white" : "text-slate-600 group-hover:text-slate-400"}`}>
                                            <Icon size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-xl font-bold mb-1 transition-colors duration-500 ${isActive ? "text-white" : "text-slate-500"}`}>
                                                {stage.title}
                                            </h4>
                                            <p className={`text-[15px] leading-relaxed transition-all duration-500 overflow-hidden ${
                                                isActive ? "text-slate-400 max-h-40 opacity-100" : "text-slate-600 max-h-0 opacity-0"
                                            }`}>
                                                {stage.description}
                                            </p>
                                            
                                            {isActive && (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="mt-4 flex flex-wrap gap-x-6 gap-y-2"
                                                >
                                                    {stage.metrics.map((m, i) => (
                                                        <div key={i} className="flex items-center gap-2.5">
                                                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Visual Display */}
                    <div className="lg:col-span-7 sticky top-32">
                        <div className="relative group">
                            {/* Glow behind the mockup */}
                            <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-[3rem] opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
                            
                            <div className="relative aspect-[16/10] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <MockupDisplay key={activeStage.id} id={activeStage.id} />
                                </AnimatePresence>
                                
                                {/* Overlay reflection */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.02]" />
                            </div>

                            {/* Floating Button for Action */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileActive={{ scale: 0.95 }}
                                className="absolute -bottom-5 right-8 px-6 py-3.5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-white/10 flex items-center gap-3 active:scale-95"
                            >
                                Start Learning <ArrowRight size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LearningModel;
