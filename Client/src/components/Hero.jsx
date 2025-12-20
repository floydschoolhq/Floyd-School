import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Briefcase, Award, Headphones, Terminal, Cpu, Code2, CheckCircle, ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import HowItWorksSection from './HowItWorksSection';
import SupportEcosystem from './SupportEcosystem';
import api from '../api/axios';

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef(null);

    // Global Hero Scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [selectedExperience, setSelectedExperience] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExperience || !formData.topic || !formData.name || !formData.phone || !formData.email) {
            alert("Please fill in all details to proceed.");
            return;
        }

        setStatus('loading');
        try {
            await api.post('/leads', {
                ...formData,
                experience: selectedExperience,
                source: 'hero_form',
                type: 'course_enquiry'
            });
            setStatus('success');
            // Reset form after success
            setFormData({ name: '', email: '', phone: '', topic: '' });
            setSelectedExperience('');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error("Form submission failed", error);
            alert("Failed to submit inquiry. Please try again.");
            setStatus('idle');
        }
    };

    const handleAuthAction = (action) => {
        if (!user) {
            navigate('/student/signup');
            return;
        }
        action();
    };

    // 3D Tilt Logic for Elite Form
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - rect.width / 2;
        const mouseY = event.clientY - rect.top - rect.height / 2;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div ref={containerRef} className="relative bg-[#FCF8F8] pt-12 pb-24 overflow-hidden">
            {/* Background Decorative Particles */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F5AFAF]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F9DFDF]/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">



                {/* Elite Form Section */}
                <div className="grid md:grid-cols-[1fr_450px] gap-16 max-w-6xl items-center">

                    {/* Left Column: Premium Styled Highlights */}
                    <div className="flex flex-col gap-16">
                        {/* One-Liner 1: Highlights */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative pl-1 overflow-visible"
                        >
                            <div className="flex flex-col gap-6">
                                {[
                                    { title: "Technical Excellence", icon: <Terminal className="w-4 h-4" /> },
                                    { title: "Production Mastery", icon: <Cpu className="w-4 h-4" /> },
                                    { title: "Innovation Core", icon: <Code2 className="w-4 h-4" /> }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 12, scale: 1.02 }}
                                        className="group flex items-center gap-6 p-6 rounded-[2.8rem] bg-white border border-[#FBEFEF] hover:shadow-2xl hover:shadow-[#F5AFAF]/10 hover:border-[#F5AFAF]/20 transition-all duration-500"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#2D2D2D] flex items-center justify-center text-[#F5AFAF] shadow-lg group-hover:scale-110 transition-all duration-300">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-900 transition-colors">{item.title}</span>
                                            <span className="text-[10px] font-bold text-[#F5AFAF] uppercase tracking-widest mt-1">Industrial Grade</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CTA Buttons - Premium Styled */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <button
                                onClick={() => handleAuthAction(() => navigate('/student/dashboard'))}
                                className="w-full sm:w-auto px-12 py-6 bg-[#2D2D2D] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95 font-['Outfit']"
                            >
                                Jump into Lab
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('how-it-works');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 border-2 border-[#FBEFEF] rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-[#FBEFEF]/50 transition-all hover:-translate-y-1 active:scale-95 font-['Outfit']"
                            >
                                Explore Path
                            </button>
                        </motion.div>
                    </div>

                    {/* Elite Card Column: 3D Interactive Form */}
                    <div className="perspective-[2000px] flex justify-center items-center">
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotateY: 15 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                rotateX: rotateX,
                                rotateY: rotateY,
                                transformStyle: "preserve-3d"
                            }}
                            className="relative w-full group"
                        >
                            {/* Moving Gradient Border Container */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#F5AFAF] via-white/20 to-[#F5AFAF] rounded-[3rem] p-[1px] opacity-20 group-hover:opacity-100 transition-opacity duration-1000 blur-sm" />
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#F5AFAF] via-white/20 to-[#F5AFAF] rounded-[3rem] p-[1px] opacity-10 group-hover:opacity-40 transition-opacity duration-1000" />

                            <div id="registration-form" className="relative bg-[#0F172A]/95 backdrop-blur-3xl rounded-[3.5rem] p-8 md:p-12 overflow-hidden shadow-[0_100px_100px_-50px_rgba(0,0,0,0.8)] border border-white/5">

                                {/* Background Subtle Mesh */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,175,175,0.08),transparent_70%)]" />

                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 relative z-10"
                                    >
                                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-500/20">
                                            <CheckCircle className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-4 font-['Outfit'] uppercase tracking-tight">Access Granted</h3>
                                        <p className="text-white/40 text-[13px] font-medium leading-relaxed font-['Inter'] max-w-[280px] mx-auto">
                                            Your coordinates have been received. An advisor will reach out shortly.
                                        </p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="mt-12 text-[10px] font-black text-[#F5AFAF] hover:text-white transition-colors uppercase tracking-[0.3em] font-['Outfit']"
                                        >
                                            ← Submit New Request
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-10 relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-2 h-8 bg-[#F5AFAF] rounded-full shadow-[0_0_20px_rgba(245,175,175,0.6)]" />
                                                <h3 className="text-3xl font-black text-white leading-tight tracking-tight font-['Outfit'] uppercase">Curate Your <span className="text-[#F5AFAF]">Path</span></h3>
                                            </div>
                                            <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Initialize your industrial journey</p>
                                        </div>

                                        <form className="space-y-5 relative z-10" onSubmit={handleFormSubmit}>
                                            {/* Experience Selection - Tech Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                                {["Class 6-7", "Class 8", "Class 9-10", "Class 11-12", "College", "Management", "Others"].map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSelectedExperience(option)}
                                                        className={`
                                                                    py-3.5 px-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-500 relative overflow-hidden active:scale-95
                                                                    ${selectedExperience === option
                                                                ? 'bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.3)]'
                                                                : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20'}
                                                                `}
                                                    >
                                                        {option}
                                                        {selectedExperience === option && (
                                                            <motion.div
                                                                layoutId="activeGlow"
                                                                className="absolute inset-x-4 bottom-1 h-0.5 bg-slate-950 rounded-full"
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Custom Advanced Select */}
                                            <div className="relative group">
                                                <select
                                                    name="topic"
                                                    value={formData.topic}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full text-[11px] p-4 rounded-[1.2rem] bg-white/5 border border-white/10 text-white placeholder:text-white/20 appearance-none focus:outline-none focus:border-[#F5AFAF]/50 focus:ring-4 focus:ring-[#F5AFAF]/5 transition-all font-black uppercase tracking-widest cursor-pointer hover:bg-white/10 shadow-xl"
                                                >
                                                    <option value="" className="bg-slate-950">Target Domain</option>
                                                    <option value="Full Stack Development" className="bg-slate-950">Full Stack Engineering</option>
                                                    <option value="Data Science & AI" className="bg-slate-950">Data Excellence & AI</option>
                                                    <option value="Cyber Security" className="bg-slate-950">Cyber Intelligence</option>
                                                    <option value="IoT & Robotics" className="bg-slate-950">Systems & Robotics</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-[#F5AFAF] transition-colors">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>

                                            {/* Ultra Sleek Inputs */}
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Tactical Identifier (Full Name)"
                                                        className="w-full text-xs p-4 rounded-[1.2rem] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#F5AFAF]/50 focus:ring-4 focus:ring-[#F5AFAF]/5 transition-all font-medium placeholder:text-white/20 hover:bg-white/10"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Encrypted Line"
                                                        className="w-full text-xs p-4 rounded-[1.2rem] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#F5AFAF]/50 focus:ring-4 focus:ring-[#F5AFAF]/5 transition-all font-medium placeholder:text-white/20 hover:bg-white/10"
                                                    />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Digital Inbox"
                                                        className="w-full text-xs p-4 rounded-[1.2rem] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#F5AFAF]/50 focus:ring-4 focus:ring-[#F5AFAF]/5 transition-all font-medium placeholder:text-white/20 hover:bg-white/10"
                                                    />
                                                </div>
                                            </div>

                                            {/* Elite Access Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full relative group overflow-hidden rounded-[1.8rem] transition-all shadow-[0_25px_50px_-20px_rgba(245,175,175,0.4)]"
                                            >
                                                <div className="absolute inset-0 bg-[#F5AFAF] transition-transform duration-700 group-hover:scale-110" />
                                                <div className="relative py-5 text-slate-950 font-black text-[13px] uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                                                    {status === 'loading' ? (
                                                        <div className="w-5 h-5 border-3 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                                                    ) : (
                                                        <>Request Access <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" /></>
                                                    )}
                                                </div>
                                            </motion.button>

                                            <div className="flex items-center gap-4 py-2">
                                                <div className="h-[1px] flex-1 bg-white/10" />
                                                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest text-center">Elite Protocol</p>
                                                <div className="h-[1px] flex-1 bg-white/10" />
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>





                {/* HOW IT WORKS Section */}
                <HowItWorksSection />
                <SupportEcosystem />
                <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="hero_10x_card" />
            </div>
        </div >
    );
};

export default Hero;
