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
    return (
        <motion.div
            className={`flex flex-col p-4 md:p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-500/20 transition-all cursor-pointer shadow-lg hover:shadow-2xl group relative overflow-hidden`}
            whileHover={{ y: -5 }}
            onClick={onClick}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-500 relative">
                <Icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                {course.live && (
                    <div className="absolute -top-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 rounded-lg border-4 border-white shadow-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[7px] font-black text-white uppercase tracking-widest">Live</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{course.title}</h3>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                {course.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
                {course.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 rounded-full text-[9px] font-bold text-blue-600 uppercase tracking-widest border border-blue-100">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">Select Program →</button>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.duration}</span>
                </div>
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
            className={`p-8 rounded-[2.5rem] bg-white border ${tier.recommended ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-2xl scale-105' : 'border-slate-100 shadow-xl'} relative overflow-hidden`}
        >
            {tier.recommended && (
                <div className="absolute top-0 right-0 py-2 px-6 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-bl-2xl">Recommended</div>
            )}
            <h3 className="text-base font-bold text-slate-700 uppercase tracking-widest mb-2">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900">₹{tier.price}</span>
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">/Batch</span>
            </div>
            <div className="space-y-4 mb-10">
                {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-3 group/feature">
                        <div className={`w-5 h-5 rounded-full ${tier.recommended ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-400'} flex items-center justify-center shrink-0`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 tracking-tight">{f}</span>
                    </div>
                ))}
            </div>
            <button
                onClick={onSelect}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all
                ${tier.recommended ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
                Enroll Now
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

    return (
        <div className="min-h-screen bg-[#FFF9FA] text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
            <PremiumNavbar />
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none" />
            </div>

            <div className="relative z-10">
                {/* Course Grid - Now at the top */}
                <div id="explore-programs" className="max-w-[1400px] mx-auto px-4 md:px-12 pt-32 pb-20">
                    <div className="flex items-end justify-between mb-16 px-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight uppercase">Academic Hub</h2>
                            <p className="mt-4 text-slate-500 font-medium max-w-xl">Deep-tech specialization tracks architected for high-intensity industrial learning.</p>
                        </motion.div>
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
                            <div className="col-span-full py-20 bg-blue-50 border border-dashed border-blue-200 rounded-[3rem] flex flex-col items-center justify-center text-center">
                                <Rocket size={48} className="text-blue-400 mb-6" />
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">New Industrial Tracks In Alpha</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3">We are calibrating the curriculum with top-tier industrial directors.</p>
                            </div>
                        )}
                    </motion.div>
                </div>



                {/* Final CTA */}
                <div className="py-32 bg-white relative overflow-hidden text-center">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-950 mb-10 tracking-tight leading-tight">
                            Start Your Industrial <br /> Engineering Journey.
                        </h2>
                        <button
                            onClick={openLeadModal}
                            className="bg-slate-950 text-white px-16 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] hover:bg-slate-900 transition-all shadow-2xl flex items-center gap-4 mx-auto"
                        >
                            Apply for Enrollment <ArrowRight size={20} />
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

