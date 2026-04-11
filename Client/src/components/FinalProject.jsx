import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const FinalProject = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="pt-16 pb-24 bg-white w-full relative overflow-hidden">
                <div className="px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-10"
                    >
                        <div className="aspect-video bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl relative group border-4 border-slate-100">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                style={{ pointerEvents: 'none' }}
                                src="https://www.youtube.com/embed/BREYIm9ctQU?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=BREYIm9ctQU&disablekb=1&fs=0" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-slate-950"
                    >
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            Final Project
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-xl shadow-sm">👤</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-0.5">Core Engine</span>
                                    <span className="text-sm font-bold text-slate-800">Face Recognition System</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-xl shadow-sm">📋</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-0.5">Integration</span>
                                    <span className="text-sm font-bold text-slate-800">Live Attendance Logger</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-xl shadow-sm">🖥️</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-0.5">Web Interface</span>
                                    <span className="text-sm font-bold text-slate-800">Flask Web Dashboard</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto bg-surface-container p-6 md:p-10 rounded-2xl border border-outline-variant/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[60px] pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight mb-3 text-on-surface">
                            Final Project: Face Recognition System
                        </h2>
                        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                            Build a live system that opens the webcam, recognises student faces in real time, logs attendance automatically with timestamps and displays everything on a web dashboard. Every part of it written and built by you.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mt-0.5 text-sm">
                                    👤
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-on-surface block">Face Recognition Engine</span>
                                    <span className="text-xs text-on-surface-variant">Detects and identifies faces live using OpenCV and Dlib.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mt-0.5 text-sm">
                                    📋
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-on-surface block">Live Attendance Logger</span>
                                    <span className="text-xs text-on-surface-variant">Automatically records name and timestamp the moment a face is recognised.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mt-0.5 text-sm">
                                    🖥️
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-on-surface block">Flask Web Dashboard</span>
                                    <span className="text-xs text-on-surface-variant">View and manage all attendance records from a clean browser interface.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="aspect-video bg-surface-container-highest rounded-xl border-2 border-outline-variant/30 overflow-hidden shadow-xl">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                style={{ pointerEvents: 'none' }}
                                src="https://www.youtube.com/embed/BREYIm9ctQU?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=BREYIm9ctQU&disablekb=1&fs=0" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalProject;
