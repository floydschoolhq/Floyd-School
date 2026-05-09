import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';
import { detailedCurriculums } from '../constants/siteData';

const FinalProject = ({ courseId = "1" }) => {
    const isMobile = useIsMobile();
    const curriculumObj = detailedCurriculums[courseId] || detailedCurriculums["1"];
    const project = curriculumObj.finalProject;

    if (isMobile) {
        return (
            <div className={`pt-16 pb-24 ${courseId === '5' ? 'bg-black' : 'bg-transparent'} w-full relative overflow-hidden`}>
                <div className="px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-10"
                    >
                        <div className="aspect-video bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl relative group border-2 border-white/10">
                            {courseId === '5' ? (
                                <video 
                                    className="w-full h-full object-cover"
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                >
                                    <source src="/videos/Video Project 4.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : courseId === '1' ? (
                                <video 
                                    className="w-full h-full object-cover"
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                >
                                    <source src="/videos/facial_recognition.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    style={{ pointerEvents: 'none' }}
                                    src={`${project.videoUrl}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=${project.videoUrl.split('/').pop()}&disablekb=1&fs=0`} 
                                    title={project.title} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={courseId === '5' ? "text-white" : "text-white/90"}
                    >
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            Final Project
                        </h2>
                        
                        <div className="space-y-6">
                            {project.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl shadow-sm">{feature.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-0.5">{i === 0 ? 'Core Engine' : i === 1 ? 'Integration' : 'Interface'}</span>
                                        <span className="text-sm font-bold text-white/90">{feature.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <section className={`py-24 px-6 ${courseId === '5' ? 'bg-black' : 'bg-transparent'}`}>
            <div className="max-w-6xl mx-auto relative perspective-1000">
                <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                >
                    {/* 3D Bevel/Reflective Edge */}
                    <div className="absolute inset-0 rounded-[3rem] border-t border-l border-white/20 pointer-events-none z-10" />
                    <div className="absolute inset-0 rounded-[3rem] border-b border-r border-black/40 pointer-events-none z-10" />

                    {/* Ambient Corner Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-20 mb-10 lg:mb-12 w-full text-center">
                        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-headline font-black tracking-tight mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60`}>
                            Final Project: {project.title}
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl mx-auto">
                            {project.description}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-20">
                        <div className="flex flex-col pr-0 lg:pr-4">
                            <ul className="space-y-4">
                                {project.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:border-blue-500/30 hover:bg-white/[0.06] transition-all group/item">
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover/item:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-sm font-black text-white uppercase tracking-wider mb-0.5">{feature.label}</span>
                                            <span className="text-[11px] font-medium text-white/50 leading-snug">{feature.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="relative group/video mt-8 lg:mt-0 w-full max-w-[600px] mx-auto">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-3xl blur-2xl opacity-50 group-hover/video:opacity-100 transition duration-700 pointer-events-none" />
                            <div className="relative aspect-video bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover/video:border-blue-500/50 transition-all duration-700">
                                {courseId === '5' ? (
                                    <video 
                                        className="w-full h-full object-cover"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                    >
                                        <source src="/videos/Video Project 4.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : courseId === '1' ? (
                                    <video 
                                        className="w-full h-full object-cover"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                    >
                                        <source src="/videos/facial_recognition.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        style={{ pointerEvents: 'none' }}
                                        src={`${project.videoUrl}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=${project.videoUrl.split('/').pop()}&disablekb=1&fs=0`} 
                                        title={project.title} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalProject;
