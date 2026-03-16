import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
        name: "Raghav",
        role: "Lead Mentor & Product Architect",
        image: raghavImg,
        imageScale: 1.9,
        bio: "Leading industrial engineering programs with a focus on production-scale systems and AI architecture.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["Lead Mentor", "Architect", "Eng"]
    },
    {
        name: "Abhay Singh Chauhan",
        role: "Management & Web Development",
        image: abhayImg,
        imageScale: 1.9,
        bio: "Full-stack enthusiast focused on building premium web experiences and scalable frontend architectures.",
        linkedin: "https://www.linkedin.com/in/abhay-singh-chauhan-485706310",
        tags: ["Web Dev", "Manager", "Full Stack"]
    },
    {
        name: "Anamika Vashisth",
        role: "UI/UX & System Designer",
        image: ananimikaImg,
        imageScale: 1.15,
        bio: "Specializing in UI/UX coordination and system design to ensure seamless and intuitive user experiences.",
        linkedin: "#",
        tags: ["UI/UX", "Design", "Product"]
    }
];


const MentorCard = React.memo(({ mentor, index, onSelect }) => {
    const isMobile = useIsMobile();
    return (
        <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={isMobile ? { duration: 0 } : { delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!isMobile ? { y: -10, scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mentor)}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className="snap-center flex-shrink-0 w-[85vw] md:w-[600px] h-[450px] md:h-[320px] bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] group cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-blue-100 transition-shadow duration-500 flex flex-col md:flex-row items-center p-8 md:p-10 gap-6 md:gap-10 relative"
        >
            {/* Background Decorative Mesh (Slight) */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover:bg-blue-100/40 transition-colors duration-700" />
            
            {/* Image Section: High-End Industrial Housing */}
            <div className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0 relative">
                {/* Rotating Border Aura */}
                <motion.div 
                    animate={isMobile ? {} : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    style={{ translateZ: 0 }}
                    className="absolute inset-[-12px] rounded-full border border-dashed border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                />
                
                {/* Main Profile Housing */}
                <div className="absolute inset-0 rounded-full p-[6px] bg-white border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] group-hover:border-blue-200/50 group-hover:shadow-blue-100/20 transition-all duration-700 z-10">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                         <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105"
                            style={{ transform: `scale(${mentor.imageScale})` }}
                        />
                        {/* Glass Overlay on Image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-white/10 opacity-30 group-hover:opacity-10 transition-opacity duration-700" />
                    </div>
                </div>

                {/* Integrated LinkedIn Tag */}
                <a 
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 w-9 h-9 md:w-11 md:h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-2xl hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all duration-300 z-20 border-[3px] border-white group/linkedin"
                >
                    <FaLinkedinIn size={14} className="group-hover/linkedin:rotate-3" />
                </a>
            </div>

            {/* Content Core: Pure Data Hierarchy */}
            <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left min-w-0 relative z-10 w-full">
                <div className="space-y-1 mb-4 md:mb-6 flex flex-col items-center md:items-start">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none truncate group-hover:text-blue-600 transition-colors w-full">
                        {mentor.name}
                    </h3>
                    <p className="text-slate-400 font-semibold text-[11px] md:text-[13px] tracking-wide uppercase truncate pb-4">
                        {mentor.role}
                    </p>
                    <div className="w-12 h-1 bg-slate-100 group-hover:w-24 group-hover:bg-blue-600 transition-all duration-500 rounded-full" />
                </div>

                <p className="text-slate-500 text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 line-clamp-2 font-medium">
                    {mentor.bio}
                </p>

                {/* Interaction Footer */}
                <div className="flex items-center justify-between pt-2 w-full">
                    <div className="flex gap-4">
                        {mentor.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 group/btn">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/btn:text-slate-900 transition-colors">
                            Full Profile
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-slate-900 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1">
                             <ChevronRight size={14} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

const MentorGrid = ({ title = "Mentors", isStatic = false, excludeName = null }) => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const isMobile = useIsMobile();

    const filteredLeaders = excludeName 
        ? LEADERS.filter(m => m.name !== excludeName)
        : LEADERS;

    return (
        <section 
            id="mentors-grid" 
            className="bg-white py-14 relative overflow-hidden"
        >
            {/* Background Architecture */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[100px] -ml-48 -mb-48" />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                    <div className="w-full">
                        <div className="flex justify-center">
                            <ScrollDarkenHeading>
                                {title}
                            </ScrollDarkenHeading>
                        </div>
                    </div>
                </div>

                <div className="relative group/marquee">
                    {/* Continuous Auto-Scrolling Container */}
                    <div className="overflow-hidden py-6 -mx-2 px-2">
                        <motion.div 
                            animate={isStatic || isMobile ? { x: 0 } : { x: ["0%", "-50%"] }}
                            transition={isStatic || isMobile ? { duration: 0 } : { 
                                duration: 35, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                            className={`flex w-max items-center gap-8 ${isStatic ? "md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:w-full md:max-w-[1440px] md:mx-auto md:justify-items-center" : ""}`}
                        >
                            {(isStatic || isMobile ? filteredLeaders : [...filteredLeaders, ...filteredLeaders, ...filteredLeaders, ...filteredLeaders]).map((mentor, index) => (
                                <MentorCard 
                                    key={index}
                                    mentor={mentor}
                                    index={index}
                                    onSelect={setSelectedMentor}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Industrial Progress Indicator */}
                    {!isStatic && (
                        <div className="mt-8 flex items-center gap-6 max-w-sm mx-auto">
                            <div className="h-[2px] flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-blue-600"
                                    initial={{ width: "30%" }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Carousel Active</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                        onClick={() => setSelectedMentor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            style={{ willChange: 'transform, opacity' }}
                            className="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden relative shadow-2xl border border-white/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-[42%] aspect-square md:h-auto max-h-[500px] relative overflow-hidden">
                                    <img
                                        src={selectedMentor.image}
                                        alt={selectedMentor.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                                </div>

                                <div className="md:w-[58%] p-12 lg:p-20 relative bg-white flex flex-col justify-center">
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className="absolute top-10 right-10 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100 group"
                                    >
                                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>

                                    <div className="max-w-md">
                                        <span className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block">thinkskool</span>
                                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none mb-4 uppercase">{selectedMentor.name}</h2>
                                        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-8 opacity-60">{selectedMentor.role}</p>
                                        
                                        <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10 pl-6 border-l-2 border-slate-100">
                                            {selectedMentor.bio}
                                        </p>

                                        <div className="flex flex-wrap gap-4 mb-12">
                                            {selectedMentor.tags.map(tag => (
                                                <span key={tag} className="text-[13px] font-bold text-slate-400 tracking-tight uppercase">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a
                                                href={selectedMentor.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-black transition-all"
                                            >
                                                <FaLinkedinIn size={14} /> Profile
                                            </a>
                                            <button
                                                onClick={() => setSelectedMentor(null)}
                                                className="flex-1 flex items-center justify-center bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-all"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MentorGrid;
