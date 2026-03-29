import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import abhayImg from '../assets/tutors/abhay.jpg';
import ananimikaImg from '../assets/tutors/anamika.jpg';

import useIsMobile from '../hooks/useIsMobile';

const LEADERS = [
    {
        name: "Shivam Mishra",
        role: "Founder | AI/ML Engineer",
        image: shivamImg,
        imageScale: 1.9,
        bio: "visionary founder of thinkskool, architecting the future of STEM education through advanced AI and machine learning integration.",
        linkedin: "https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in",
        tags: ["AI/ML", "Founder", "Visionary"]
    },
    {
        name: "Anamika Vashisth",
        role: "Growth Associate",
        image: ananimikaImg,
        imageScale: 1.15,
        bio: "Specializing in UI/UX coordination and system design to ensure seamless and intuitive user experiences.",
        linkedin: "#",
        tags: ["UI/UX", "Design", "Product"]
    },
    {
        name: "Abhay Singh Chauhan",
        role: "Help Associate",
        image: abhayImg,
        imageScale: 1.5,
        bio: "Full-stack enthusiast focused on building premium web experiences and scalable frontend architectures.",
        linkedin: "https://www.linkedin.com/in/abhay-singh-chauhan-485706310",
        tags: ["Web Dev", "Manager", "Full Stack"]
    },
    {
        name: "Raghav",
        role: "Mentor",
        image: raghavImg,
        imageScale: 1.9,
        bio: "Leading industrial engineering programs with a focus on production-scale systems and AI architecture.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["Lead Mentor", "Architect", "Eng"]
    }
];

const CourseFacultyCard = React.memo(({ mentor, index, variant }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';
    return (
        <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={isMobile ? { duration: 0 } : { delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!isMobile ? { y: -10, scale: 1.01 } : {}}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className={`snap-center flex-shrink-0 w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-700 flex flex-col items-center p-6 md:p-8 gap-6 relative cursor-default group
                ${isDark 
                    ? 'bg-white/[0.02] backdrop-blur-md border-white/5 hover:bg-white/[0.04] hover:border-blue-500/20' 
                    : 'bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-blue-100'}`}
        >
            {/* Background Decorative Mesh */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none transition-colors duration-700
                ${isDark ? 'bg-blue-500/8 group-hover:bg-blue-500/12' : 'bg-blue-50/30 group-hover:bg-blue-100/40'}`} />
            
            {/* Image Section: High-End Industrial Housing */}
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative">
                {/* Rotating Border Aura */}
                <motion.div 
                    animate={isMobile ? {} : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    style={{ translateZ: 0 }}
                    className={`absolute inset-[-15px] rounded-full border border-dashed opacity-0 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none
                        ${isDark ? 'border-blue-500' : 'border-blue-500'}`}
                />
                
                {/* Main Profile Housing */}
                <div className={`w-full h-full rounded-2xl overflow-hidden relative border-2 transition-all duration-700
                    ${isDark ? 'border-white/10 group-hover:border-blue-500/30' : 'border-slate-200 group-hover:border-blue-200'}`}>
                    {/* Dynamic Background */}
                    <div className={`absolute inset-0 transition-colors duration-700
                        ${isDark ? 'bg-gradient-to-br from-blue-950/20 via-transparent to-blue-950/20' : 'bg-gradient-to-br from-blue-50 via-transparent to-slate-50'}`} />
                    
                    {/* Profile Image */}
                    <img 
                        src={mentor.image} 
                        alt={mentor.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ 
                            transform: `scale(${mentor.imageScale})`,
                            transformOrigin: 'center 30%'
                        }}
                    />
                    
                    {/* Industrial Overlay */}
                    <div className={`absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100
                        ${isDark ? 'bg-gradient-to-t from-blue-500/10 to-transparent' : 'bg-gradient-to-t from-blue-500/10 to-transparent'}`} />
                </div>
            </div>

            {/* Content Core: Pure Data Hierarchy */}
            <div className="flex-grow flex flex-col items-center text-center min-w-0 relative z-10 w-full">
                <div className="space-y-1 mb-4 flex flex-col items-center">
                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight uppercase leading-none truncate transition-colors w-full
                        ${isDark ? 'text-white group-hover:text-blue-500' : 'text-slate-900 group-hover:text-blue-600'}`}>
                        {mentor.name}
                    </h3>
                    <p className={`font-semibold text-[11px] md:text-[12px] tracking-wide uppercase truncate pb-4
                        ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mentor.role}
                    </p>
                    <div className={`w-12 h-1 transition-all duration-500 rounded-full
                        ${isDark ? 'bg-white/10 group-hover:w-24 group-hover:bg-blue-500' : 'bg-slate-100 group-hover:w-24 group-hover:bg-blue-600'}`} />
                </div>

                <p className={`text-[14px] md:text-[15px] leading-relaxed mb-6 line-clamp-2 font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mentor.bio}
                </p>

                {/* Interaction Footer */}
                <div className="flex items-center justify-between pt-2 w-full">
                    <div className="flex gap-4">
                        {mentor.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors
                                ${isDark ? 'text-slate-500 group-hover:text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 group/btn">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors
                            ${isDark ? 'text-slate-500 group-hover/btn:text-white' : 'text-slate-400 group-hover/btn:text-slate-900'}`}>
                            EXPLORE
                        </span>
                        <div className={`w-4 h-4 rounded-full transition-all duration-500
                            ${isDark ? 'bg-blue-500/20 group-hover/btn:bg-blue-500' : 'bg-blue-600/20 group-hover/btn:bg-blue-600'}`} />
                    </div>
                </div>
            </div>

            {/* Integrated LinkedIn Tag */}
            <a 
                href={mentor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 z-20 border-2 group/linkedin
                    ${isDark ? 'bg-white/10 backdrop-blur-xl border-white/10 hover:bg-blue-500 hover:border-blue-500' : 'bg-slate-900 border-white hover:bg-blue-600'}`}
            >
                <FaLinkedinIn size={14} className="group-hover/linkedin:scale-110 transition-transform" />
            </a>
        </motion.div>
    );
});

CourseFacultyCard.displayName = 'CourseFacultyCard';

const CourseFacultyGrid = ({ title = "MENTORS ONLY", isStatic = false, excludeName = null, variant = 'light' }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';

    const filteredLeaders = excludeName 
        ? LEADERS.filter(m => m.name !== excludeName)
        : LEADERS;

    return (
        <section 
            id="course-faculty-grid" 
            className={`py-14 relative overflow-hidden transition-colors duration-500
                ${isDark ? 'bg-gradient-to-br from-black via-slate-950 to-black' : 'bg-white'}`}
        >
            {/* Background mesh - matching CourseReviews */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-30 ${isDark ? 'invert brightness-200' : ''}`} style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 transition-colors
                    ${isDark ? 'bg-blue-600/5' : 'bg-blue-50'}`} />
                <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 transition-colors
                    ${isDark ? 'bg-amber-600/5' : 'bg-indigo-50'}`} />
            </div>
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col items-center justify-center mt-16 mb-12 text-center sm:mt-20 md:mt-16">
                    <div className="w-full">
                        <div className="flex justify-center">
                            <ScrollDarkenHeading variant={variant}>
                                {title}
                            </ScrollDarkenHeading>
                        </div>
                    </div>
                </div>

                {/* Static grid for Faculty */}
                <div className="max-w-6xl mx-auto px-6 relative z-10 w-full mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredLeaders.slice(0, 3).map((mentor, index) => (
                            <CourseFacultyCard 
                                key={index}
                                mentor={mentor}
                                index={index}
                                variant={variant}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseFacultyGrid;
