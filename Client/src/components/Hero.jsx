import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { CheckCircle, ArrowRight, Terminal, Cpu, Code2 } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import api from '../api/axios';
import heroBg from '../assets/images/2.png';

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef(null);

    const handleEnrollNow = () => {
        navigate('/online-program');
    };

    const handleExplore = () => {
        // Navigate to gallery
        navigate('/bootcamp-gallery');
    };

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
    const [status, setStatus] = useState('idle');

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
            const payload = {
                ...formData,
                experience: selectedExperience,
                source: 'hero_form_student',
                type: 'course_enquiry'
            };

            await api.post('/leads', payload);
            setStatus('success');
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

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const smoothX = useSpring(x, { stiffness: 150, damping: 20 });
    const smoothY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(smoothY, [-100, 100], [8, -8]);
    const rotateY = useTransform(smoothX, [-100, 100], [-8, 8]);

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
        <section id="home" ref={containerRef} className="relative pt-24 pb-16 overflow-hidden">
            {/* Immersive Tech Backdrop with User Provided Image */}
            <div className="absolute inset-0 z-0">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${heroBg})`,
                        imageRendering: 'auto',
                        WebkitBackfaceVisibility: 'hidden', // Prevents shimmering/blur during scroll
                        transform: 'translateZ(0)' // Forced GPU acceleration for sharper rendering
                    }}
                />

                {/* Refined Contrast Overlays - Removed Blur to preserve image quality */}
                <div className="absolute inset-0 bg-white/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/10 opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]" />

                {/* Animated Floating Gradients for Depth */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
                {/* Split Grid Layout */}
                <div className="grid md:grid-cols-[1fr_420px] gap-12 items-center">

                    {/* Left Column: Bento Hub */}
                    <div className="grid grid-cols-2 gap-4 h-fit">
                        {/* Major Tile - Technical Excellence */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.5 }}
                            className="col-span-2 relative p-7 rounded-3xl bg-slate-950/90 backdrop-blur-3xl border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden group"
                        >
                            {/* Gradient top edge */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
                            {/* Ambient glow */}
                            <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-600/15 rounded-full blur-[80px] group-hover:bg-blue-600/25 transition-all duration-700" />
                            <div className="relative z-10 flex items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.5)] shrink-0">
                                        <Terminal className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-1">Practical Training</h3>
                                        <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-[0.25em]">Industrial Tech Bootcamps</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 hidden sm:block">
                                    <p className="text-4xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors duration-500 select-none">01</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Secondary Tile - Live Ops */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative p-5 rounded-3xl bg-slate-950/90 backdrop-blur-3xl border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/40 to-transparent" />
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-700/20 rounded-full blur-[50px] group-hover:bg-blue-700/15 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-1">Live Projects</h4>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Real-World Exposure</span>
                            </div>
                        </motion.div>

                        {/* Secondary Tile - Engineering */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative p-5 rounded-3xl bg-slate-950/90 backdrop-blur-3xl border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-700/10 rounded-full blur-[50px] group-hover:bg-blue-600/20 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-1">Career Track</h4>
                                <span className="text-xs font-semibold text-blue-500/70 uppercase tracking-[0.2em]">Placement & Portfolio</span>
                            </div>
                        </motion.div>

                        {/* CTA Bento Tile */}
                        <motion.div
                            className="col-span-2 mt-4 p-1.5 rounded-[2.5rem] bg-slate-900 shadow-2xl flex items-center gap-2"
                        >
                            <button
                                onClick={handleEnrollNow}
                                className="flex-1 py-4 rounded-[2rem] bg-[#2563EB] text-white font-extrabold uppercase text-[11px] tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95"
                            >
                                Enroll Now
                            </button>
                            <button
                                onClick={handleExplore}
                                className="flex-1 py-4 rounded-[2rem] bg-slate-800 text-white font-extrabold uppercase text-[11px] tracking-[0.2em] hover:bg-slate-700 transition-all active:scale-95"
                            >
                                Explore
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: 3D Interactive Form */}
                    <div className="perspective-[2000px] flex justify-center items-center origin-top md:origin-right">
                        <motion.div
                            initial={{ opacity: 0, x: 40, rotateY: 10 }}
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
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-[#2563EB] via-blue-400 to-[#2563EB] rounded-[4rem] p-[2.5px] opacity-100 shadow-[0_0_60px_rgba(37,99,235,0.4)] blur-[1px] transition-opacity duration-700" />

                            <div id="registration-form" className="relative bg-slate-950/90 group-hover:bg-black/95 backdrop-blur-3xl rounded-[3rem] p-7 md:p-11 shadow-3xl overflow-hidden relative z-10 transition-all duration-700">
                                {/* Intense Permanent Backdrop Glow */}
                                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-900/10 transition-colors duration-700 pointer-events-none" />
                                {/* Interior Glass Highlight */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16 relative z-10"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-white mb-3 uppercase">Success</h3>
                                        <p className="text-white/40 text-xs font-medium max-w-[240px] mx-auto">Details submitted successfully.</p>
                                        <button onClick={() => setStatus('idle')} className="mt-8 text-[10px] font-black text-[#2563EB] hover:text-white uppercase tracking-[0.3em]">← New Request</button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-6 relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-1.5 h-6 bg-[#2563EB] rounded-full" />
                                                <h3 className="text-xl font-extrabold text-white leading-tight uppercase">
                                                    Start Your Journey
                                                </h3>
                                            </div>
                                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest pl-5">Begin your learning experience</p>
                                        </div>

                                        <form className="space-y-6 relative z-10" onSubmit={handleFormSubmit}>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Class 8-9", "Class 9-10", "Class 11-12", "College"].map((option, idx) => (
                                                    <button key={idx} type="button" onClick={() => setSelectedExperience(option)} className={`py-2.5 px-1 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${selectedExperience === option ? 'bg-white text-slate-950' : 'bg-white/10 text-white/40 border border-transparent hover:border-white/10'}`}>{option}</button>
                                                ))}
                                            </div>
                                            <select name="topic" value={formData.topic} onChange={handleInputChange} required className="w-full text-[13px] p-3.5 rounded-xl bg-white/10 border border-transparent text-white appearance-none focus:outline-none focus:bg-white/15 font-bold uppercase tracking-widest cursor-pointer shadow-lg">
                                                <option value="" className="bg-slate-900">Select Course</option>
                                                <option value="Full Stack" className="bg-slate-900">Full Stack</option>
                                                <option value="AI & ML" className="bg-slate-900">AI & ML</option>
                                                <option value="Cyber Security" className="bg-slate-900">Cyber Intelligence</option>
                                                <option value="Robotics" className="bg-slate-900">Robotics</option>
                                            </select>
                                            <div className="space-y-4">
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name" className="w-full text-[13px] p-3.5 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone Number" className="w-full text-[13px] p-3.5 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email Address" className="w-full text-[13px] p-3.5 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                </div>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={status === 'loading'} className="w-full rounded-[2.5rem] transition-all bg-[#2563EB] hover:bg-blue-600 shadow-2xl shadow-blue-500/30">
                                                <div className="py-3.5 text-white font-extrabold text-base uppercase tracking-widest flex items-center justify-center gap-2">
                                                    {status === 'loading' ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Get Started <ArrowRight size={14} /></>}
                                                </div>
                                            </motion.button>
                                            <p className="text-center text-[8px] text-white/20 uppercase tracking-widest">Secure Registration</p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="hero_10x_card" />
            </div>
        </section>
    );
};

export default Hero;

