import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Code, Terminal, ShieldCheck, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import { FALLBACK_COURSES } from '../constants/siteData';

const iconMap = {
    Cpu: Cpu,
    Code: Code,
    Terminal: Terminal,
    Shield: ShieldCheck
};

const OnlineCourseFocus = ({ variant }) => {
    const navigate = useNavigate();
    const isDark = variant === 'dark';

    return (
        <section id="online-focus" className={`relative pt-24 pb-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
            {/* Ambient Background Glows */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700
                ${isDark ? 'bg-orange-500/[0.03]' : 'bg-blue-500/[0.02]'}`} />
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700
                ${isDark ? 'bg-amber-500/[0.02]' : 'bg-slate-200'}`} />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl" variant={variant}>
                        OUR BATCHES
                    </ScrollDarkenHeading>
                </div>

                {/* Featured Programs Grid */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FALLBACK_COURSES.length > 0 ? (
                            FALLBACK_COURSES.map((course) => {
                                const isComingSoon = !!course.comingSoon;
                                return (
                                    <motion.div
                                        key={course._id}
                                        whileHover={isComingSoon ? {} : {
                                            y: -8,
                                            transition: { type: 'spring', stiffness: 300, damping: 20 }
                                        }}
                                        className={`relative pt-2 pb-0 rounded-xl border shadow-2xl group flex flex-col gap-0 overflow-hidden transition-all duration-500
                                            ${isComingSoon ? 'cursor-default opacity-80' : 'cursor-pointer'}
                                            ${isDark
                                                ? 'bg-[#151515] backdrop-blur-xl border-white/10 hover:border-orange-500/30'
                                                : 'bg-white border-slate-100 hover:border-blue-200 shadow-slate-200/50'}`}
                                        onClick={() => !isComingSoon && navigate(`/course/${course._id}`)}
                                    >
                                        {/* Premium Glowing Outline - Visible only on hover for live courses */}
                                        {!isComingSoon && (
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                                ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-transparent' : 'bg-gradient-to-br from-blue-500/5 to-transparent'}`} />
                                        )}

                                        {/* Mac Dots Header */}
                                        <div className="flex gap-[4px] px-3 pt-1 pb-2 relative z-10 w-full items-center justify-start">
                                            <div className="w-[6px] h-[6px] rounded-full bg-[#FF5F56]" />
                                            <div className="w-[6px] h-[6px] rounded-full bg-[#FFBD2E]" />
                                            <div className="w-[6px] h-[6px] rounded-full bg-[#27C93F]" />
                                        </div>

                                        {/* Course Image Container */}
                                        <div className="w-full aspect-[16/10] relative z-10 overflow-hidden border-y border-white/5 shadow-inner">
                                            {/* Shimmer on hover (live only) */}
                                            {!isComingSoon && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
                                            )}

                                            {/* Coming Soon Overlay */}
                                            {isComingSoon && (
                                                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40">
                                                    <span className="text-white text-lg font-bold tracking-wide drop-shadow-lg select-none">
                                                        Coming Soon
                                                    </span>
                                                </div>
                                            )}

                                            {/* Play Button (live only) */}
                                            {!isComingSoon && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out opacity-80
                                                    ${!isComingSoon ? 'group-hover:scale-105 group-hover:opacity-100' : ''}`}
                                            />
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-1 relative z-10 flex flex-col mt-4 px-4 pb-1">
                                            <h4 className={`text-xl font-black uppercase tracking-tight transition-colors line-clamp-1 mb-2
                                                ${isDark
                                                    ? `text-white ${!isComingSoon ? 'group-hover:text-orange-500' : ''}`
                                                    : `text-slate-900 ${!isComingSoon ? 'group-hover:text-blue-600' : ''}`}`}>
                                                {course.title}
                                            </h4>
                                            <p className={`text-sm font-medium leading-relaxed line-clamp-3
                                                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {course.description}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className={`pt-4 px-4 pb-3 border-t flex items-center justify-between font-bold text-[10px] uppercase tracking-[0.3em] transition-all relative z-10
                                            ${isDark
                                                ? 'border-white/5 text-slate-500 group-hover:text-white'
                                                : 'border-slate-50 text-slate-400 group-hover:text-slate-900'}`}>
                                            <span>{isComingSoon ? 'Coming Soon' : 'Explore Program'}</span>
                                            {!isComingSoon && (
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all
                                                    ${isDark ? 'bg-white/5 group-hover:bg-orange-500 group-hover:text-white' : 'bg-slate-50 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 bg-black border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Rocket size={40} className="text-orange-500/20 mb-4" />
                                <h4 className="text-lg font-bold text-slate-500 uppercase tracking-tighter">New Batches Launching Soon</h4>
                                <p className="text-[10px] font-normal text-slate-600 uppercase tracking-[0.2em] mt-2">Preparing the next generation of engineers.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OnlineCourseFocus;
