import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe, Zap, Target, Users, ArrowRight, ShieldCheck,
    Cpu, Code, Terminal, Brain, Star, Calendar,
    Video, Rocket, CheckCircle2, DollarSign, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import LeadFormModal from '../components/LeadFormModal';
import { FALLBACK_COURSES, supportRoles } from '../constants/siteData';

const CourseCard = ({ course }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15 } }
            }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 hover:border-[#2563EB]/30 transition-all duration-500 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2563EB]/10 to-transparent blur-2xl group-hover:opacity-100 transition-opacity opacity-0" />

            <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-[#2563EB] mb-6 shadow-xl`}>
                {course.icon === 'Cpu' && <Cpu size={28} />}
                {course.icon === 'Code' && <Code size={28} />}
                {course.icon === 'Terminal' && <Terminal size={28} />}
                {course.icon === 'Shield' && <ShieldCheck size={28} />}
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{course.rating} Rating</span>
            </div>

            <h3 className="text-2xl font-black text-white uppercase mb-3 tracking-tight">{course.title}</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                {course.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
                {course.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#2563EB]" />
                    <span className="text-xs font-bold text-slate-300 uppercase">{course.duration}</span>
                </div>
                <button className="text-[#2563EB] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Join Batch <ArrowRight size={14} />
                </button>
            </div>
        </motion.div>
    );
};

const PricingTier = ({ title, price, features, recommended, onSelect }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20 } }
            }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            className={`relative p-10 rounded-[3rem] border ${recommended ? 'bg-[#2563EB] border-blue-400 shadow-2xl shadow-blue-500/20 text-white' : 'bg-white/5 backdrop-blur-3xl border-white/5 text-white'} overflow-hidden h-full flex flex-col`}
        >
            {recommended && (
                <div className="absolute top-8 right-8 bg-white text-[#2563EB] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Popular
                </div>
            )}

            <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-4 opacity-70">{title}</h4>
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-2xl font-black">₹</span>
                <span className="text-6xl font-black tracking-tighter">{price}</span>
                <span className="text-sm font-bold opacity-60">/slot</span>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className={recommended ? 'text-white' : 'text-[#2563EB]'} />
                        <span className="text-sm font-medium opacity-90">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onSelect}
                className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all ${recommended ? 'bg-white text-slate-950 hover:bg-slate-100 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
            >
                Secure Slot
            </button>
        </motion.div>
    );
};

const OnlineProgram = () => {
    const navigate = useNavigate();
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    const openLeadModal = () => setIsLeadModalOpen(true);

    const pricing = [
        {
            title: "Starter",
            price: "1,999",
            features: ["Foundational Access", "Community Support", "Public Sandboxes", "Certification"],
            recommended: false
        },
        {
            title: "Industrial",
            price: "4,999",
            features: ["Advanced Modules", "1-on-1 Mentorship", "Premium Code Lab", "Career Support"],
            recommended: true
        },
        {
            title: "Mastery",
            price: "9,999",
            features: ["AI & Cloud Mastery", "Industrial Internship", "Production Deployment", "Placement Access"],
            recommended: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1E] overflow-x-hidden selection:bg-[#2563EB]/30 pt-24">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2563EB]/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    y: {
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }
                                }
                            }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-10"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2563EB]"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-100">Live Industrial Portal Active</span>
                        </motion.div>

                        <SectionHeader
                            title={<span>Elite Online <br className="md:hidden" /><span className="text-[#2563EB]">Engineering Batches.</span></span>}
                            description={<span>World-class industrial technical education delivered directly to your home. No geography limits. Only elite code.</span>}
                            light={false}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
                        >
                            <button
                                onClick={openLeadModal}
                                className="w-full sm:w-auto px-12 py-5 bg-[#2563EB] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20"
                            >
                                Secure Your Seat
                            </button>
                            <div className="flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl">
                                <Users className="text-[#2563EB]" size={20} />
                                <div className="text-left">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Next Batch</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Monday, 9:00 AM IST</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div>
                            <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[11px] mb-4">Industrial Curriculum</p>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Explore <span className="text-[#2563EB]">Programs.</span></h2>
                        </div>
                        <div className="flex gap-4">
                            <span className="px-5 py-2 rounded-full border border-white/5 text-[10px] font-black text-white bg-white/5 uppercase tracking-widest">Live Interactive</span>
                            <span className="px-5 py-2 rounded-full border border-white/5 text-[10px] font-black text-white bg-white/5 uppercase tracking-widest">Project-Based</span>
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
                        {FALLBACK_COURSES.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </motion.div>
                </div>

                {/* Faculty Section */}
                <div className="bg-white/2 py-32 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Industrial <span className="text-[#2563EB]">Mentors.</span></h2>
                            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto uppercase tracking-wide">Learn from technical architects who build high-scale production systems daily.</p>
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
                            className="grid grid-cols-1 md:grid-cols-3 gap-12"
                        >
                            {supportRoles.map((role, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
                                    }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 transition-colors hover:border-[#2563EB]/20"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#0A0F1E] border border-white/5 flex items-center justify-center text-[#2563EB] mb-8 shadow-xl">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">{role.title}</h3>
                                    <p className="text-[#2563EB] text-xs font-black uppercase tracking-widest mb-6">{role.role}</p>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">{role.desc}</p>
                                    <div className="space-y-3">
                                        {role.benefits.map((benefit, bIdx) => (
                                            <div key={bIdx} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                                <span className="text-xs font-bold text-slate-300 uppercase">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="text-center mb-24">
                        <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[11px] mb-4">Transparent Pricing</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Choose Your <span className="text-[#2563EB]">Path.</span></h2>
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
                            <PricingTier key={idx} {...tier} onSelect={openLeadModal} />
                        ))}
                    </motion.div>
                </div>

                {/* Schedule Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-transparent p-12 md:p-20 rounded-[4rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Calendar size={200} className="text-white" />
                        </div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-8 tracking-tighter">Flexible <br /><span className="text-[#2563EB]">Learning Cycles.</span></h3>
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#2563EB] shrink-0 border border-white/10">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Active Batches</h4>
                                            <p className="text-slate-400 text-sm font-medium">Mon-Wed-Fri (Evening Slot)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#2563EB] shrink-0 border border-white/10">
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
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">TS</div>
                                    <div>
                                        <p className="text-white font-black uppercase text-sm">Industrial Director</p>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ThinkSkool Engineering</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="py-32 bg-[#2563EB] relative overflow-hidden text-center">
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
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter uppercase">
                            Start Your Industrial <br /> Engineering Journey.
                        </h2>
                        <button
                            onClick={openLeadModal}
                            className="bg-white text-slate-950 px-16 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl flex items-center gap-4 mx-auto"
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

