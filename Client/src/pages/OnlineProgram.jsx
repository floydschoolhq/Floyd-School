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

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-500">
                <Icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
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
                <span className="text-4xl font-black text-slate-900">${tier.price}</span>
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
    const [isCourseDetailModalOpen, setIsCourseDetailModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

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
        setSelectedCourse(course);
        setIsCourseDetailModalOpen(true);
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
            price: "1,999",
            features: ["Foundational Access", "Community Support", "Public Sandboxes", "Certification"],
            recommended: false
        },
        {
            name: "Industrial",
            price: "4,999",
            features: ["Advanced Modules", "1-on-1 Mentorship", "Premium Code Lab", "Career Support"],
            recommended: true
        },
        {
            name: "Mastery",
            price: "9,999",
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
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
                    <motion.div
                        className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-full mb-6 group cursor-pointer"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:animate-ping" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-blue-500/80 group-hover:text-blue-500 transition-colors">Deep-Tech Specialization</span>
                    </motion.div>
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-6 tracking-tight leading-[0.95]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Elite Online <br /> Engineering Batches.
                    </motion.h1>
                    <motion.p
                        className="max-w-xl mx-auto text-base md:text-lg text-slate-500 font-medium tracking-tight mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Architecting the future through high-intensity industrial learning protocols.
                    </motion.p>
                    <motion.button
                        onClick={handleExploreClick}
                        className="group relative px-10 py-6 bg-blue-600 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-3 relative z-10 font-black text-white text-[13px] uppercase tracking-[0.3em]">
                            Explore Programs <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </motion.button>
                </div>

                {/* Course Grid */}
                <div id="explore-programs" className="max-w-[1400px] mx-auto px-4 md:px-12">
                    <div className="flex items-end justify-between mb-16 px-4">
                        <div>
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4 block">Catalogue 2024</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">Academic Hub</h2>
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
                            <div className="col-span-full py-20 bg-blue-50 border border-dashed border-blue-200 rounded-[3rem] flex flex-col items-center justify-center text-center">
                                <Rocket size={48} className="text-blue-400 mb-6" />
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">New Industrial Tracks In Alpha</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3">We are calibrating the curriculum with top-tier industrial directors.</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Faculty Section */}
                <div className="py-20 md:py-24">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-12">
                        <div className="text-center mb-16 md:mb-20">
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4 block">Industry Leaders</span>
                            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">Expert Mentorship</h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[100px] -mr-40 -mt-40 group-hover:bg-blue-500/10 transition-all duration-700" />
                                <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                            <Cpu size={24} className="text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-5">Industrial Architects & Mentors</h3>
                                        <p className="text-sm md:text-base text-slate-500 font-medium tracking-tight leading-relaxed mb-8">
                                            Learn directly from architects who build the infrastructure of modern tech companies. High-density knowledge transfer protocols designed for industrial-grade engineering mastery.
                                        </p>
                                        <button
                                            onClick={openLeadModal}
                                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                        >
                                            Meet Mentors
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <MentorSlideshow />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="pricing" className="max-w-[1400px] mx-auto px-4 md:px-12 py-32">
                    <div className="text-center mb-20">
                        <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4 block">Institutional Access</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">Tuition Structure</h2>
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
                                    staggerChildren: 0.15
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {pricing.map((tier, idx) => (
                            <PricingTier key={idx} tier={tier} onSelect={openLeadModal} />
                        ))}
                    </motion.div>
                </div>

                {/* Schedule Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                    <div className="bg-blue-50 p-12 md:p-20 rounded-[4rem] border border-blue-100 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Calendar size={200} className="text-blue-600" />
                        </div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">Flexible <br /><span className="text-blue-600 border-b-4 border-blue-200 pb-1">Learning Cycles.</span></h3>
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Batches</h4>
                                            <p className="text-slate-500 text-sm font-medium">Mon-Wed-Fri (Evening Slot)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Support Hours</h4>
                                            <p className="text-slate-400 text-sm font-medium">24/7 Technical Portal Access</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-950/50 p-10 rounded-[2.5rem] border border-white/5">
                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 italic">
                                    "The online model ensures that geography is no longer a barrier to elite industrial education. We bring the same production-grade experience to your screen."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-black text-slate-950">TS</div>
                                    <div>
                                        <p className="text-white font-black uppercase text-sm">Industrial Director</p>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest"><span className="text-white">thinkskool</span> Engineering</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

