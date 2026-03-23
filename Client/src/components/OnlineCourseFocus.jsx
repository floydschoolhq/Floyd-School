import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Code, Terminal, ShieldCheck, Rocket, ChevronLeft, ChevronRight, Bell, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import { FALLBACK_COURSES } from '../constants/siteData';
import useIsMobile from '../hooks/useIsMobile';
import EarlyRegistrationForm from './EarlyRegistrationForm';

const iconMap = {
    Cpu: Cpu,
    Code: Code,
    Terminal: Terminal,
    Shield: ShieldCheck
};

const OnlineCourseFocus = ({ variant }) => {
    const navigate = useNavigate();
    const isDark = variant === 'dark';
    const isMobile = useIsMobile();
    const scrollRef = React.useRef(null);
    const [earlyRegistrationCourse, setEarlyRegistrationCourse] = React.useState(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = isMobile ? window.innerWidth * 0.85 : 640; // Card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section id="online-focus" className={`relative pt-12 pb-16 sm:pt-16 sm:pb-24 md:pt-12 md:pb-16 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-black via-slate-950 to-black' : 'bg-slate-50}'}`}>
            {/* Background mesh - matching CourseReviews */}
            <div className={`absolute inset-0 pointer-events-none opacity-30 ${isDark ? 'invert brightness-200' : ''}`} style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 transition-colors duration-700
                ${isDark ? 'bg-blue-600/5' : 'bg-blue-50'}`} />
            <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 transition-colors duration-700
                ${isDark ? 'bg-amber-600/5' : 'bg-slate-200'}`} />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mt-8 mb-16 sm:mt-12 sm:mb-20 md:mt-8 md:mb-20">
                    <ScrollDarkenHeading sizeClass="text-5xl md:text-8xl" variant={variant}>
                        OUR BATCHES
                    </ScrollDarkenHeading>
                </div>

                {/* Course Cards - Two Row Layout */}
                <div className="space-y-12">
                    {/* First Row - Single Course Card (Foundation of AI) */}
                    <div className="flex justify-center max-w-6xl mx-auto">
                        {FALLBACK_COURSES.length > 0 && !FALLBACK_COURSES[0].comingSoon && (
                            <motion.div
                                key={FALLBACK_COURSES[0]._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                whileHover={{
                                    y: -8,
                                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                                }}
                                className={`relative rounded-2xl border shadow-2xl group overflow-hidden transition-all duration-500 cursor-pointer w-full
                                    ${isDark
                                        ? 'bg-gradient-to-br from-[#151515] to-[#0a0a0a] border-white/10 hover:border-blue-500/30'
                                        : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-blue-300 shadow-slate-200/50'}`}
                                onClick={() => navigate(`/course/${FALLBACK_COURSES[0]._id}`)}
                            >
                                {/* Premium Glowing Outline */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl
                                    ${isDark ? 'bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20' : 'bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10'}`} />

                                {/* Single Row Layout */}
                                <div className="flex flex-col md:flex-row h-full min-h-[280px]">
                                    {/* Left Side - Course Image with Original Ratio */}
                                    <div className="relative md:w-2/5 lg:w-1/2 overflow-hidden my-2">
                                        {/* Image with original aspect ratio - container fits image perfectly */}
                                        <div className="relative w-full h-full my-1">
                                            {/* Adjusted gradient overlays - less intrusive on left */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-10" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent via-transparent to-transparent z-10" />
                                            
                                            {/* Shimmer effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-out" />
                                            
                                            <img
                                                src={FALLBACK_COURSES[0].image}
                                                alt={FALLBACK_COURSES[0].title}
                                                className="w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-105"
                                                style={{ aspectRatio: 'auto' }}
                                            />
                                            
                                            {/* Live Badge - positioned to avoid image details */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                                                    LIVE NOW
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Course Details */}
                                    <div className="relative md:w-3/5 lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                                        {/* Mac Dots Header - REMOVED */}
                                        {/* <div className="flex gap-[6px] mb-6">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#FF5F56] shadow-sm" />
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#FFBD2E] shadow-sm" />
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#27C93F] shadow-sm" />
                                        </div> */}

                                        {/* Course Title */}
                                        <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight transition-all duration-300 mb-4 leading-tight
                                            ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {FALLBACK_COURSES[0].title}
                                        </h3>

                                        {/* Course Description */}
                                        <p className={`text-sm md:text-base leading-relaxed mb-6 line-clamp-3 font-medium
                                            ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {FALLBACK_COURSES[0].description}
                                        </p>

                                        {/* Course Stats */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} />
                                                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    3 month
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-3 h-3 ${i < 4 ? (isDark ? 'bg-yellow-400' : 'bg-yellow-500') : (isDark ? 'bg-slate-600' : 'bg-slate-300')}`} style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                                                ))}
                                                <span className={`text-xs font-semibold ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    4.9
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Navigate to course page with registration form open
                                                    navigate(`/course/${FALLBACK_COURSES[0]._id}?openRegistration=true`);
                                                }}
                                                className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                                    ${isDark 
                                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-600/25' 
                                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25'}`}
                                            >
                                                Apply Now
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/course/${FALLBACK_COURSES[0]._id}`);
                                                }}
                                                className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 border-2 hover:shadow-lg transform hover:-translate-y-0.5
                                                    ${isDark 
                                                        ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/30' 
                                                        : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'}`}
                                            >
                                                Learn More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Second Row - Three Course Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {FALLBACK_COURSES.slice(1).map((course) => {
                            const isComingSoon = !!course.comingSoon;
                            return (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    whileHover={isComingSoon ? {} : {
                                        y: -8,
                                        transition: { type: 'spring', stiffness: 300, damping: 20 }
                                    }}
                                    className={`relative pt-2 pb-0 rounded-xl border shadow-2xl group flex flex-col gap-0 overflow-hidden transition-all duration-500
                                        ${isComingSoon ? 'cursor-default opacity-80' : 'cursor-pointer'}
                                        ${isDark
                                            ? 'bg-[#151515] backdrop-blur-xl border-white/10 hover:border-blue-500/30'
                                            : 'bg-white border-slate-100 hover:border-blue-200 shadow-slate-200/50'}`}
                                    onClick={() => !isComingSoon && navigate(`/course/${course._id}`)}
                                >
                                    {/* Premium Glowing Outline - Visible only on hover for live courses */}
                                    {!isComingSoon && (
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                            ${isDark ? 'bg-gradient-to-br from-blue-500/20 to-transparent' : 'bg-gradient-to-br from-blue-500/5 to-transparent'}`} />
                                    )}

                                    {/* Mac Dots Header - REMOVED */}
                                    {/* <div className="flex gap-[4px] px-3 pt-1 pb-2 relative z-10 w-full items-center justify-start">
                                        <div className="w-[6px] h-[6px] rounded-full bg-[#FF5F56]" />
                                        <div className="w-[6px] h-[6px] rounded-full bg-[#FFBD2E]" />
                                        <div className="w-[6px] h-[6px] rounded-full bg-[#27C93F]" />
                                    </div> */}

                                    {/* Course Image Container */}
                                    <div className="w-full aspect-[16/8] relative z-10 overflow-hidden border-y border-white/5 shadow-inner">
                                        {/* Shimmer on hover (live only) */}
                                        {!isComingSoon && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
                                        )}

                                        {/* Coming Soon Overlay - REMOVED FROM IMAGE */}
                                        {isComingSoon && false && (
                                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40">
                                                <span className="text-white text-lg font-bold tracking-wide drop-shadow-lg select-none">
                                                    COMING SOON
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className={`w-full h-full object-contain transition-transform duration-[1.5s] ease-out opacity-80
                                                ${!isComingSoon ? 'group-hover:scale-105 group-hover:opacity-100' : ''}`}
                                        />
                                    </div>

                                        <div className="flex-1 relative z-10 flex flex-col mt-4 px-4 pb-1">
                                            <h4 className={`text-lg font-bold uppercase tracking-tight transition-colors line-clamp-1 mb-2
                                                ${isDark
                                                    ? `text-blue-400 ${!isComingSoon ? 'group-hover:text-blue-500' : ''}`
                                                    : `text-blue-600 ${!isComingSoon ? 'group-hover:text-blue-600' : ''}`}`}>
                                                {course.title}
                                            </h4>
                                            {isComingSoon ? (
                                                <div className="flex items-center justify-center h-16 mb-2">
                                                    <motion.span
                                                        animate="animate"
                                                        variants={{
                                                            animate: {
                                                                filter: [
                                                                    "brightness(1) drop-shadow(0 0 0px rgba(249, 115, 22, 0))",
                                                                    "brightness(1.8) drop-shadow(0 0 20px rgba(249, 115, 22, 0.4))",
                                                                    "brightness(1) drop-shadow(0 0 0px rgba(249, 115, 22, 0))"
                                                                ],
                                                                transition: {
                                                                    duration: 2.5,
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut",
                                                                }
                                                            }
                                                        }}
                                                        className={`text-2xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white`}>
                                                        Coming Soon
                                                    </motion.span>
                                                </div>
                                            ) : (
                                                <p className={`text-sm font-medium leading-relaxed line-clamp-3
                                                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {course.description}
                                                </p>
                                            )}
                                        </div>

                                    {/* Footer */}
                                    <div className={`pt-4 px-4 pb-3 border-t flex items-center justify-between font-bold text-[10px] uppercase tracking-[0.3em] transition-all relative z-10
                                        ${isDark
                                            ? 'border-white/5 text-slate-500 group-hover:text-white'
                                            : 'border-slate-50 text-slate-400 group-hover:text-slate-900'}`}>
                                        <span>{isComingSoon ? 'Early Access' : 'Explore Program'}</span>
                                        {isComingSoon ? (
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEarlyRegistrationCourse(course);
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-1.5"
                                            >
                                                <Bell size={10} className="animate-pulse" />
                                                I am interested
                                            </motion.button>
                                        ) : (
                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Early Registration Form Modal */}
            <EarlyRegistrationForm 
                isOpen={!!earlyRegistrationCourse}
                onClose={() => setEarlyRegistrationCourse(null)}
                courseTitle={earlyRegistrationCourse?.title || ''}
                courseId={earlyRegistrationCourse?._id || ''}
            />
        </section>
    );
};

export default OnlineCourseFocus;
