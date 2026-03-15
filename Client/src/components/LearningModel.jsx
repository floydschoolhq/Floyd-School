import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ArrowRight, Zap, Brain, Award, Calendar, Trophy, Sparkles } from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const STAGES = [
    {
        id: 'ignite',
        title: 'Ignite',
        subtitle: '7-Day offline Bootcamp',
        description: 'Students discover coding through fun challenges and mini projects. A high-energy start to their tech journey.',
        icon: Zap,
        metrics: ['7 Days Intense', 'Fun Challenges', 'Mini Projects'],
        mockup: 'ignite'
    },
    {
        id: 'learn',
        title: 'Learn',
        subtitle: '90-Day Guided Program',
        description: 'Live classes 3 times a week building strong coding fundamentals. A 3-month comprehensive path to mastery.',
        icon: Brain,
        metrics: ['3 Months Path', '3x Classes/Week', 'Fundamentals'],
        mockup: 'learn'
    },
    {
        id: 'build',
        title: 'Build',
        subtitle: 'Projects & Hackathons',
        description: 'Students apply their skills by building real coding projects. After completion of course we organise hackathons for students.',
        icon: Code2,
        metrics: ['Real-world Apps', 'Industrial Projects', 'Hackathons'],
        mockup: 'build'
    },
    {
        id: 'showcase',
        title: 'Showcase',
        subtitle: 'Certification & Recognition',
        description: 'Students present their work and earn completion certificates. Building their identity as young engineers.',
        icon: Award,
        metrics: ['Global Certificate', 'Public Portfolio', 'Recognition'],
        mockup: 'showcase'
    }
];

const MockupDisplay = ({ id }) => {
    // This renders a stylized "UI Mockup" based on the current stage
    const renderContent = () => {
        switch (id) {
            case 'ignite':
                return (
                    <div className="p-8 h-full flex flex-col gap-6 bg-gradient-to-br from-blue-900/20 to-black">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <div className="text-[14px] font-black text-white uppercase tracking-tight">Ignite Bootcamp</div>
                                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Day 4 of 7</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-2">Today's Challenge</div>
                                <div className="text-white font-bold text-lg">Build a Mini Space Explorer</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">XP Earned</div>
                                    <div className="text-xl font-black text-white">1,240</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Rank</div>
                                    <div className="text-xl font-black text-blue-400">#12</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Sparkles size={16} className="text-blue-400" />
                            <span className="text-[11px] font-bold text-blue-100 uppercase tracking-widest">Unlock Mini-Project Badge</span>
                        </div>
                    </div>
                );
            case 'learn':
                return (
                    <div className="p-8 h-full flex flex-col gap-6 bg-gradient-to-br from-indigo-900/20 to-black">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <div className="text-[14px] font-black text-white uppercase tracking-tight">Learning Path</div>
                                    <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">90-Day Transformation</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { day: 'Monday', time: '6:00 PM', topic: 'Logic & Loops', active: true },
                                { day: 'Wednesday', time: '6:00 PM', topic: 'Data Structures', active: false },
                                { day: 'Friday', time: '6:00 PM', topic: 'Mini Engine Build', active: false }
                            ].map((session, i) => (
                                <div key={i} className={`p-4 rounded-xl border transition-all ${session.active ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-white/5 border-white/10 opacity-60'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="text-[12px] font-bold text-white">{session.day} — {session.topic}</div>
                                        <div className="text-[10px] font-black text-indigo-400">{session.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'build':
                return (
                    <div className="p-8 h-full flex flex-col gap-6 bg-gradient-to-br from-emerald-900/20 to-black">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                    <Trophy size={24} />
                                </div>
                                <div>
                                    <div className="text-[14px] font-black text-white uppercase tracking-tight">Hackathon Portal</div>
                                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Building Live</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-6">
                            <div className="text-center">
                                <div className="text-[12px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">Time Remaining</div>
                                <div className="text-5xl font-black text-white tracking-widest">42:15:08</div>
                            </div>
                            <div className="w-full space-y-3">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-300">Team Infinity Project</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black rounded uppercase">Deploying</span>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-300">Social Connect App</span>
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-black rounded uppercase">Coding</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'showcase':
                return (
                    <div className="p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-900/20 to-black text-center">
                        <div className="w-40 h-56 bg-white/5 border-2 border-amber-500/30 rounded-lg relative flex flex-col items-center p-6 shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
                            <Award size={48} className="text-amber-500 mb-4" />
                            <div className="text-[10px] font-black text-white uppercase tracking-tight mb-2">Certificate of Mastery</div>
                            <div className="w-full h-px bg-white/10 my-4" />
                            <div className="text-[8px] text-slate-500 font-bold leading-relaxed">
                                VERIFIED CREDENTIALS<br />THINKSKOOL GRADUATE
                            </div>
                            <div className="mt-auto w-12 h-12 border border-white/10 rounded-full flex items-center justify-center">
                                <img src="/logo192.png" className="w-6 opacity-40" alt="logo" />
                            </div>
                        </div>
                        <div className="mt-8 space-y-2">
                            <div className="text-xl font-bold text-white">Engineer Identity Verified</div>
                            <div className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em]">Build. Prove. Ship.</div>
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
        >
            {renderContent()}
        </motion.div>
    )
}

import useIsMobile from '../hooks/useIsMobile';

const LearningModel = () => {
    const [activeStage, setActiveStage] = useState(STAGES[0]);
    const isMobile = useIsMobile();

    return (
        <section className="bg-slate-950 py-16 md:py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="mb-12 md:mb-16 text-center">
                    <ScrollDarkenHeading variant="dark" sizeClass="text-4xl md:text-6xl">
                        The 4-Stage Model
                    </ScrollDarkenHeading>
                    <motion.p
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.2 }}
                        className="text-slate-500 font-bold text-lg mt-4 mx-auto max-w-xl"
                    >
                        Schools teach outdated theory. thinkskool teaches the future through a high-intensity industrial model.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left: Navigation */}
                    <div className="lg:col-span-5 relative">
                        {/* Vertical Progress Track */}
                        {!isMobile && (
                            <div className="absolute left-10 top-8 bottom-8 w-[2px] bg-slate-900 hidden md:block">
                                {/* Active Progress Line */}
                                <motion.div 
                                    animate={{ 
                                        height: `${(STAGES.findIndex(s => s.id === activeStage.id) / (STAGES.length - 1)) * 100}%` 
                                    }}
                                    className="w-full bg-slate-400 absolute top-0 left-0"
                                />
                                
                                {/* Animated Motor Slider & Styled Pointer */}
                                <motion.div 
                                    animate={{ 
                                        top: `${(STAGES.findIndex(s => s.id === activeStage.id) / (STAGES.length - 1)) * 100}%` 
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center"
                                >
                                    {/* The Pointer Line */}
                                    <div className="w-8 h-[2px] bg-gradient-to-r from-slate-400 to-transparent ml-2" />
                                    
                                    {/* The Glow Dot */}
                                    <div className="w-4 h-4 bg-white rounded-full border-4 border-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
                                </motion.div>

                                {/* Stage Dots */}
                                {STAGES.map((_, i) => (
                                    <div 
                                        key={i}
                                        style={{ top: `${(i / (STAGES.length - 1)) * 100}%` }}
                                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-800 z-10"
                                    />
                                ))}
                            </div>
                        )}

                        <div className={`${!isMobile ? 'md:pl-16' : 'flex flex-col items-center'} space-y-2`}>
                            {STAGES.map((stage) => {
                                const Icon = stage.icon;
                                const isActive = activeStage.id === stage.id;
                                
                                return (
                                    <div
                                        key={stage.id}
                                        onMouseEnter={() => !isMobile && setActiveStage(stage)}
                                        onClick={() => isMobile && setActiveStage(stage)}
                                        className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-500 w-full flex flex-col items-center text-center ${
                                            isActive 
                                            ? "bg-white/5 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                                            : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-4">
                                            <div className={`mt-1 transition-colors duration-500 ${isActive ? "text-white" : "text-slate-600 group-hover:text-slate-400"}`}>
                                                <Icon size={28} />
                                            </div>
                                            <div className="flex-1 select-none">
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
                                                        initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="mt-4 flex flex-wrap gap-x-6 gap-y-2 justify-center"
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
