import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Code, Terminal, ShieldCheck, Globe, Video, MessageSquare, Rocket, CheckCircle2, Zap, X, Check, Target, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import { FALLBACK_COURSES } from '../constants/siteData';
const iconMap = {
    Cpu: Cpu,
    Code: Code,
    Terminal: Terminal,
    Shield: ShieldCheck
};

// Fallback icon if course.icon is missing
const DefaultIcon = Code;

const OnlineCourseFocus = () => {
    const navigate = useNavigate();
    // Use course._id as key to avoid index-based issues

    return (
        <section id="online-focus" className="relative pt-12 pb-24 bg-slate-950 overflow-hidden">

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <ScrollDarkenHeading variant="dark">
                        OUR BATCHES
                    </ScrollDarkenHeading>
                </div>

                    {/* Featured Programs Grid */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FALLBACK_COURSES.length > 0 ? (
                            FALLBACK_COURSES.map((course, idx) => {
                                const Icon = iconMap[course.icon] || Code;
                                return (
                                    <motion.div
                                        key={course._id}
                                        whileHover={{ 
                                            y: -8,
                                            transition: { type: "spring", stiffness: 300, damping: 20 }
                                        }}
                                        className="relative p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/10 cursor-pointer shadow-2xl group flex flex-col gap-5 overflow-hidden"
                                        onClick={() => navigate(`/course/${course._id}`)}
                                    >
                                        {/* Premium Glowing Outline - Visible only on hover */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-3xl transition-all duration-500" />
                                        
                                        {/* Animated Background Shine */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />

                                        {/* Course Image Container */}
                                        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/5 shadow-2xl relative z-10 bg-slate-900/50 group/imgContainer">
                                            {/* Refined Shimmer Placeholder Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
                                            
                                            {/* Subtler Scanning Line Effect */}
                                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden pointer-events-none">
                                                <div className="w-full h-[1px] bg-white/30 blur-[1px] absolute top-[-10%] animate-[scan_4s_linear_infinite]" />
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
                                            </div>
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="flex-1 relative z-10 flex flex-col mt-4">
                                            <h4 className="text-xl font-bold text-white uppercase tracking-tight transition-colors line-clamp-1 mb-2">
                                                {course.title}
                                            </h4>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-4">
                                                {course.description}
                                            </p>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-white transition-all relative z-10">
                                            <span>Explore Program</span> 
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 group-hover:bg-white group-hover:text-slate-900 transition-all">
                                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Subtle Corner Accents */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 bg-white border border-dashed border-blue-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                <Rocket size={40} className="text-blue-500/20 mb-4" />
                                <h4 className="text-lg font-medium text-slate-400 uppercase tracking-tighter">New Batches Launching Soon</h4>
                                <p className="text-[10px] font-normal text-slate-400 uppercase tracking-[0.2em] mt-2">Secure your early access. Preparing the next generation of engineers.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </section>
    );
};

export default OnlineCourseFocus;
