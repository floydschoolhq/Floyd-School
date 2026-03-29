import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Zap, Target, Users, ArrowRight, ShieldCheck,
    Cpu, Code, Terminal, Brain, Star, Calendar,
    Video, Rocket, CheckCircle2, DollarSign, Clock, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import LeadFormModal from '../components/LeadFormModal';
import PremiumNavbar from '../components/PremiumNavbar';
import { FALLBACK_COURSES, supportRoles } from '../constants/siteData';
import useIsMobile from '../hooks/useIsMobile';

const iconMap = {
    Cpu: Cpu,
    Code: Code,
    Terminal: Terminal,
    Shield: ShieldCheck,
    Globe: Globe,
    Rocket: Rocket,
    Brain: Brain,
};

const CourseCard = ({ course, onClick }) => {
    const Icon = iconMap[course.icon] || Code;
    const isComingSoon = course.comingSoon;
    const isMobile = useIsMobile();
    
    if (isMobile) {
        return (
            <div 
                onClick={isComingSoon ? undefined : onClick}
                className={`flex flex-col p-3 rounded-2xl bg-white/[0.02] backdrop-blur-xl border ${
                    isComingSoon ? 'border-white/5 opacity-70' : 'border-white/10 active:scale-95 transition-all cursor-pointer'
                } relative overflow-hidden h-full`}
            >
                {/* Coming Soon Overlay */}
                {isComingSoon && (
                    <div className="absolute inset-x-0 bottom-0 top-1/2 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                        <span className="text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                            Planned
                        </span>
                    </div>
                )}
                
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 relative z-10 border border-white/5 bg-slate-900">
                    <img
                        src={course.image}
                        alt={course.title}
                        className={`w-full h-full object-cover ${isComingSoon ? 'grayscale opacity-40' : 'opacity-80'}`}
                    />
                </div>

                <div className="flex-grow">
                    <h3 className={`text-[11px] font-black uppercase tracking-tight leading-none mb-2 ${
                        isComingSoon ? 'text-slate-500' : 'text-white'
                    }`}>{isComingSoon ? 'Coming Soon' : course.title}</h3>
                    
                    <p className="text-slate-500 text-[9px] font-medium leading-tight line-clamp-2">
                        {course.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 relative z-10">
                    <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                        {isComingSoon ? 'BETA' : 'VIEW →'}
                    </span>
                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{course.duration}</span>
                </div>
            </div>
        );
    }
    
    return (
        <motion.div
            className={`flex flex-col p-6 rounded-[2rem] bg-white/[0.03] backdrop-blur-xl border ${isComingSoon ? 'border-white/5 cursor-not-allowed opacity-75' : 'border-white/10 hover:border-orange-500/30 transition-all cursor-pointer'} shadow-2xl group relative overflow-hidden`}
            whileHover={isComingSoon ? {} : { y: -8 }}
            onClick={isComingSoon ? undefined : onClick}
        >
            {/* Coming Soon Overlay */}
            {isComingSoon && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40">
                    <span className="text-white text-lg font-bold tracking-wide drop-shadow-lg select-none">
                        Coming Soon
                    </span>
                </div>
            )}
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

            <div className="w-full aspect-[16/10] mac-browser-frame mb-8 group/imgContainer relative z-10 border-white/10">
                {/* Mac Dots Overlay */}
                <div className="mac-browser-dots">
                    <div className="mac-browser-dot mac-dot-red" />
                    <div className="mac-browser-dot mac-dot-yellow" />
                    <div className="mac-browser-dot mac-dot-green" />
                </div>
                {/* Play Button Overlay - Only for non-coming-soon courses */}
                {!isComingSoon && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                        </div>
                    </div>
                )}
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
            </div>

            <div className="flex items-center gap-3 mb-3 relative z-10">
                <h3 className={`text-xl font-black uppercase tracking-tight transition-colors ${isComingSoon ? 'text-white/60' : 'text-white group-hover:text-white'}`}>{isComingSoon ? 'Coming Soon' : course.title}</h3>
            </div>
            
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2 relative z-10">
                {course.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                {course.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto relative z-10">
                <button className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isComingSoon ? 'text-white/40 cursor-not-allowed' : 'text-slate-400 group-hover:text-white cursor-pointer'}`}>
                    {isComingSoon ? 'Coming Soon' : 'Select TRACK →'}
                </button>
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">{course.duration}</span>
            </div>
        </motion.div>
    );
};

const PricingTier = ({ tier, onSelect }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20 } }
            }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            className={`p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border ${tier.recommended ? 'border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.1)] scale-105' : 'border-white/10 shadow-2xl'} relative overflow-hidden`}
        >
            {tier.recommended && (
                <div className="absolute top-0 right-0 py-2 px-6 bg-pink-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-2xl">Recommended</div>
            )}
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{tier.name}</h3>
            <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-white tracking-tighter">₹{tier.price}</span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">/Batch</span>
            </div>
            <div className="space-y-5 mb-12">
                {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-4 group/feature">
                        <div className={`w-6 h-6 rounded-lg ${tier.recommended ? 'bg-pink-500/10 text-white' : 'bg-white/5 text-slate-500'} flex items-center justify-center shrink-0 border border-white/5`}>
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-bold text-slate-300 tracking-tight">{f}</span>
                    </div>
                ))}
            </div>
            <button
                onClick={onSelect}
                className={`w-full py-6 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all
                ${tier.recommended ? 'bg-pink-500 text-white hover:bg-orange-600 shadow-[0_20px_40px_rgba(249,115,22,0.25)]' : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
            >
                Start Journey
            </button>
        </motion.div>
    );
};

import abhayImg from '../assets/tutors/abhay.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import shivamImg from '../assets/tutors/shivam.jpg';

const mentorImages = [abhayImg, raghavImg, shivamImg];
const mentorNames = ["Abhay Singh", "Raghav Sharma", "Shivam Gupta"];

const MentorSlideshow = () => {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % mentorImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative group/mentor max-w-sm mx-auto">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-200/50 shadow-2xl relative">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={current}
                        src={mentorImages[current]}
                        alt={mentorNames[current]}
                        initial={{ opacity: 0, scale: 2.2, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 2, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.8, filter: 'blur(10px)' }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-cover scale-[1.5]"
                    />
                </AnimatePresence>
                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
            </div>

            {/* Mentor Info Floating Badge */}
            <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 right-6 px-5 py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 z-20"
            >
                <p className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.2em]">{mentorNames[current]}</p>
            </motion.div>

            {/* Expert Rating Floating Badge */}
            <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3 z-20 group-hover:scale-105 transition-transform duration-500">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shadow-inner">
                    <Star size={14} className="text-blue-500 fill-blue-500/20" />
                </div>
                <div>
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest block">5.0 Expert Rating</span>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -z-10 -top-3 -right-3 w-full h-full border border-blue-500/10 rounded-[2rem] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
        </div>
    );
};

const OnlineProgram = () => {
    const navigate = useNavigate();
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const isMobile = useIsMobile();

    React.useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [window.location.hash]);

    const openLeadModal = () => setIsLeadModalOpen(true);
    const openCourseDetailModal = (course) => {
        navigate(`/course/${course._id}`);
    };

    const handleExploreClick = () => {
        const element = document.getElementById('explore-programs');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const pricing = [
        {
            name: "Starter",
            price: "1,299",
            features: ["Foundational Access", "Community Support", "Public Sandboxes", "Certification"],
            recommended: false
        },
        {
            name: "Industrial",
            price: "1,599",
            features: ["Advanced Modules", "1-on-1 Mentorship", "Premium Code Lab", "Career Support"],
            recommended: true
        },
        {
            name: "Mastery",
            price: "1,799",
            features: ["AI & Cloud Mastery", "Industrial Internship", "Production Deployment", "Placement Access"],
            recommended: false
        }
    ];

    if (isMobile) {
        return (
            <div className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white relative font-['Outfit']">
                <PremiumNavbar variant="dark" />
                
                {/* Background Decorative Mesh - Mobile */}
                <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[50px] -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[40px] -ml-12 -mb-12" />
                </div>

                <div className="relative z-10">
                    {/* Academic Hub Hero - Mobile */}
                    <div id="explore-programs" className="px-6 pt-24 pb-12">
                        <div className="flex flex-col items-center text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-[0.2em] mb-4">
                                <Globe size={10} />
                                <span>Global Specializations</span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-4">
                                Academic <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Hub</span>
                            </h2>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
                                Deep-tech specialization tracks architected for high-intensity industrial learning.
                            </p>
                        </div>

                        {/* Courses Grid - Mobile 2 Columns */}
                        <div className="grid grid-cols-2 gap-4 mb-16">
                            {FALLBACK_COURSES.length > 0 ? (
                                FALLBACK_COURSES.map(course => (
                                    <CourseCard key={course._id} course={course} onClick={() => openCourseDetailModal(course)} />
                                ))
                            ) : (
                                <div className="col-span-2 py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <Rocket size={24} className="text-white/20 mb-3" />
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter">Tracks In Alpha</h4>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Calibrating curriculum.</p>
                                </div>
                            )}
                        </div>

                        {/* Stats - Mobile */}
                        <div className="grid grid-cols-2 gap-4 mb-20">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                                <div className="text-2xl font-black text-white">12+</div>
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Industrial Modules</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                                <div className="text-2xl font-black text-white">100%</div>
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Deployment Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA - Mobile */}
                    <div className="py-24 px-6 bg-gradient-to-b from-transparent to-slate-950/50 text-center border-t border-white/5">
                        <div className="max-w-[280px] mx-auto">
                            <h3 className="text-3xl font-black text-white mb-4 leading-none tracking-tighter uppercase">ELEVATE YOUR ENGINEERING STANDARD.</h3>
                            <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">Secure your enrollment for the next batch today.</p>
                            <button
                                onClick={openLeadModal}
                                className="w-full py-5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-3"
                            >
                                SECURE ENROLLMENT <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white selection:bg-orange-600 selection:text-white relative font-['Outfit']">
            <PremiumNavbar variant="dark" />
            
            {/* Background Decorative Mesh - Industrial Dark */}
            <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-[80px] -ml-24 -mb-24" />
            </div>

            <div className="relative z-10">
                {/* Academic Hub Hero - Dark Mode */}
                <div id="explore-programs" className="max-w-[1400px] mx-auto px-6 md:px-12 pt-40 pb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-orange-500/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
                                <Globe size={12} />
                                <span>Global Specializations</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-8">
                                Academic <br/><span className="text-white">Hub</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                                Deep-tech specialization tracks architected for high-intensity industrial learning and production-scale mastery.
                            </p>
                        </motion.div>
                        
                        <div className="mt-12 md:mt-0 flex gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="text-3xl font-black text-white">12+</div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Industrial Modules</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="text-3xl font-black text-white">100%</div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Deployment Rate</div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {FALLBACK_COURSES.length > 0 ? (
                            FALLBACK_COURSES.map(course => (
                                <CourseCard key={course._id} course={course} onClick={() => openCourseDetailModal(course)} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 bg-black border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                                <Rocket size={48} className="text-white/20 mb-6" />
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Industrial Tracks In Alpha</h4>
                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-3">We are calibrating the curriculum with top-tier industrial directors.</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Final CTA - Dark Industrial */}
                <div className="py-48 bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden text-center border-t border-white/5">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-600/5 blur-[60px] rounded-full pointer-events-none" />
                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-14 tracking-tighter uppercase leading-[0.85]">
                            ELEVATE YOUR <br/><span className="text-white">ENGINEERING</span> <br/>STANDARD.
                        </h2>
                        <button
                            onClick={openLeadModal}
                            className="bg-white text-black px-20 py-8 rounded-xl font-black uppercase text-[15px] tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all shadow-3xl flex items-center gap-4 mx-auto group active:scale-95"
                        >
                            SECURE ENROLLMENT <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <LeadFormModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                source="online_program"
            />
        </div>
    );
};

export default OnlineProgram;

