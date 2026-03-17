import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                    <div className="p-8 h-full flex flex-col gap-6 bg-[#080808] font-sans">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <div className="text-[15px] font-bold text-white tracking-tight">Bootcamp Explorer</div>
                                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">7 Days to Logic Mastery</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { day: 'Day 1', task: 'Computational Thinking', status: 'Completed' },
                                { day: 'Day 3', task: 'Logic Gates & Circuits', status: 'Live' },
                                { day: 'Day 7', task: 'First Mini-Engine build', status: 'Locked' }
                            ].map((item, i) => (
                                <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${item.status === 'Live' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 opacity-50'}`}>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mb-1">{item.day}</span>
                                        <span className="text-[13px] font-medium text-white tracking-tight">{item.task}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'learn':
                return (
                    <div className="p-8 h-full flex flex-col gap-6 bg-[#080808] font-sans">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                    <Brain size={18} />
                                </div>
                                <div className="text-[15px] font-bold text-white tracking-tight">Path to Engineer</div>
                            </div>
                            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-bold text-amber-400 uppercase tracking-widest">3 Months</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { module: '01', title: 'Python Engine', level: 'Beginner' },
                                { module: '02', title: 'DS & Algorithms', level: 'Advanced' },
                                { module: '03', title: 'App Architecture', level: 'Pro' },
                                { module: '04', title: 'Cloud Systems', level: 'Enterprise' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-amber-500/30 transition-colors">
                                    <div className="text-[9px] font-bold text-slate-600 mb-1">{item.module}</div>
                                    <div className="text-[12px] font-semibold text-white tracking-tight mb-2">{item.title}</div>
                                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'build':
                return (
                    <div className="p-8 h-full flex flex-col gap-6 bg-[#080808] font-sans">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                    <Code2 size={18} />
                                </div>
                                <div className="text-[15px] font-bold text-white tracking-tight">Studio Lab</div>
                            </div>
                            <div className="text-[9px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Industrial Project</div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-gradient-to-r from-blue-600/5 to-transparent border border-blue-600/20 rounded-xl">
                                <div className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-2">Active Build</div>
                                <h5 className="text-white font-bold text-lg tracking-tight mb-3">Your Own School Website</h5>
                                <div className="flex gap-2">
                                    <span className="px-2 py-0.5 bg-white/5 text-[9px] font-medium text-slate-400 rounded">React</span>
                                    <span className="px-2 py-0.5 bg-white/5 text-[9px] font-medium text-slate-400 rounded">Node.js</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-slate-600 font-bold mb-1">Status</div>
                                    <div className="text-[11px] text-white font-semibold">Building Interface</div>
                                </div>
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-slate-600 font-bold mb-1">Team</div>
                                    <div className="text-[11px] text-white font-semibold">Alpha Core</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'showcase':
                return (
                    <div className="p-8 h-full flex flex-col bg-[#080808] font-sans">
                        <div className="mb-10 p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 rounded-2xl relative">
                            <div className="absolute top-4 right-4 text-blue-500 opacity-40">
                                <Award size={24} />
                            </div>
                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">Identity Verified</div>
                            <h4 className="text-xl font-bold text-white tracking-tight mb-2">Tech Credential</h4>
                            <p className="text-slate-500 text-[11px] leading-relaxed max-w-[180px]">
                                Internationally recognized laboratory certification.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">
                                <span>Portfolio</span>
                                <span className="text-blue-500 text-[9px]">Verified</span>
                            </div>
                            {['App Prototypes', 'Production Repos', 'Case Studies'].map((asset, i) => (
                                <div key={i} className="flex items-center gap-3 text-white text-[13px] font-medium tracking-tight">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                                    {asset}
                                </div>
                            ))}
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
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
    const navigate = useNavigate();

    return (
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden min-h-[900px] md:min-h-[1050px] flex flex-col justify-center border-t border-white/5">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/[0.02] to-transparent pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
                <div className="mb-12 md:mb-16 text-center">
                    <ScrollDarkenHeading variant="dark" sizeClass="text-3xl md:text-5xl lg:text-6xl">
                        The 4-Stage Model
                    </ScrollDarkenHeading>
                    <motion.p
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={isMobile ? { duration: 0 } : { delay: 0.2 }}
                        className="text-slate-500 font-bold text-base md:text-lg mt-4 mx-auto max-w-xl"
                    >
                        Schools teach outdated theory. thinkskool teaches the future through a high-intensity industrial model.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start min-h-[600px]">
                    {/* Left: Navigation */}
                    <div className="lg:col-span-12 xl:col-span-5 relative min-h-[500px]">
                        {/* Vertical Progress Track */}
                        {!isMobile && (
                            <div className="absolute left-10 top-8 bottom-8 w-[2px] bg-slate-900 hidden md:block">
                                {/* Active Progress Line */}
                                <motion.div 
                                    animate={{ 
                                        height: `${(STAGES.findIndex(s => s.id === activeStage.id) / (STAGES.length - 1)) * 100}%` 
                                    }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full bg-blue-500/40 absolute top-0 left-0"
                                />
                                
                                {/* Animated Motor Slider & Styled Pointer */}
                                <motion.div 
                                    animate={{ 
                                        top: `${(STAGES.findIndex(s => s.id === activeStage.id) / (STAGES.length - 1)) * 100}%` 
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute left-1/2 -track-x-1/2 -track-y-1/2 z-20 flex items-center"
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
                                        className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-700 w-full flex flex-col items-center text-center ${
                                            isActive 
                                            ? "bg-white/5 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                                            : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className={`mt-1 transition-colors duration-500 shrink-0 ${isActive ? "text-white" : "text-slate-600 group-hover:text-slate-400"}`}>
                                                <Icon size={28} />
                                            </div>
                                            <div className="flex-1 w-full select-none overflow-hidden">
                                                <h4 className={`text-xl font-bold mb-1 transition-colors duration-500 ${isActive ? "text-white" : "text-slate-500"}`}>
                                                    {stage.title}
                                                </h4>
                                                
                                                <AnimatePresence mode="wait">
                                                    {isActive && (
                                                        <motion.div
                                                            key={`desc-${stage.id}`}
                                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-slate-400 text-[15px] leading-relaxed mb-4">
                                                                {stage.description}
                                                            </p>
                                                            
                                                            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center pb-2">
                                                                {stage.metrics.map((m, i) => (
                                                                    <div key={i} className="flex items-center gap-2.5">
                                                                         <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Visual Display - Vertically aligned to active stage */}
                    <div className="lg:col-span-12 xl:col-span-7 relative hidden xl:block min-h-[600px]">
                        <motion.div 
                            animate={{ 
                                y: STAGES.findIndex(s => s.id === activeStage.id) * 110, // Dynamic alignment tracking
                            }}
                            transition={{ type: "spring", stiffness: 90, damping: 20 }}
                            className="relative group"
                        >
                            {/* Glow behind the mockup */}
                            <div className="absolute -inset-4 bg-blue-500/5 blur-3xl rounded-[3rem] opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
                            
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
                                onClick={() => navigate('/course')}
                                className="absolute -bottom-5 right-8 px-6 py-3.5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-white/10 flex items-center gap-3 active:scale-95 cursor-pointer z-20"
                            >
                                Start Learning <ArrowRight size={16} />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Mobile/Tablet Visual (Standard Layout) */}
                    <div className="lg:col-span-12 xl:hidden mb-12">
                        <div className="relative aspect-[16/10] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden mb-8">
                            <AnimatePresence mode="wait">
                                <MockupDisplay key={activeStage.id} id={activeStage.id} />
                            </AnimatePresence>
                        </div>
                        <div className="flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileActive={{ scale: 0.95 }}
                                onClick={() => navigate('/course')}
                                className="px-8 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-2xl flex items-center gap-3 cursor-pointer"
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
