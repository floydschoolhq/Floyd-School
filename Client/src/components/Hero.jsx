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

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [regType, setRegType] = useState('student');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: '',
        institutionName: '',
        designation: ''
    });
    const [status, setStatus] = useState('idle');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (regType === 'student') {
            if (!selectedExperience || !formData.topic || !formData.name || !formData.phone || !formData.email) {
                alert("Please fill in all details to proceed.");
                return;
            }
        } else {
            if (!formData.institutionName || !formData.name || !formData.phone || !formData.email) {
                alert("Please fill in institution and contact details.");
                return;
            }
        }

        setStatus('loading');
        try {
            const payload = regType === 'student' ? {
                ...formData,
                experience: selectedExperience,
                source: 'hero_form_student',
                type: 'course_enquiry'
            } : {
                ...formData,
                source: 'hero_form_school',
                type: 'school_partnership'
            };

            await api.post('/leads', payload);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', topic: '', institutionName: '', designation: '' });
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
        <section id="home" ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
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
                <div className="grid md:grid-cols-[1fr_460px] gap-16 items-center">

                    {/* Left Column: Bento Hub */}
                    <div className="grid grid-cols-2 gap-4 h-fit">
                        {/* Major Tile - Technical Excellence */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="col-span-2 relative p-10 rounded-[3rem] bg-white border border-white shadow-[0_20px_50px_rgba(37,99,235,0.05)] overflow-hidden group transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#2563EB]/[0.02] to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/30">
                                    <Terminal className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight leading-tight mb-2">Technical Excellence</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-bold uppercase tracking-[0.2em]">
                                    Industrial Grade Systems
                                </div>
                            </div>
                        </motion.div>

                        {/* Secondary Tile - Projects */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative p-7 rounded-[3rem] bg-white border border-white shadow-[0_20px_50px_rgba(37,99,235,0.05)] overflow-hidden group transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/[0.02] rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-slate-900/[0.05] transition-colors" />
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-4 shadow-lg shadow-slate-900/10">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight leading-tight mb-1">Live Ops</h4>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deployment</span>
                            </div>
                        </motion.div>

                        {/* Secondary Tile - Architecture */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative p-7 rounded-[3rem] bg-white border border-white shadow-[0_20px_50px_rgba(37,99,235,0.05)] overflow-hidden group transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/[0.02] rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-[#2563EB]/[0.05] transition-colors" />
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight leading-tight mb-1">Engineering</h4>
                                <span className="text-[8px] font-bold text-[#2563EB] uppercase tracking-[0.2em]">Finality</span>
                            </div>
                        </motion.div>

                        {/* CTA Bento Tile */}
                        <motion.div
                            className="col-span-2 mt-4 p-2 rounded-[3rem] bg-slate-900 shadow-2xl flex items-center gap-2"
                        >
                            <button className="flex-1 py-5 rounded-[2.5rem] bg-[#2563EB] text-white font-extrabold uppercase text-xs tracking-[0.2em] hover:bg-blue-600 transition-all">Enroll Now</button>
                            <button className="flex-1 py-5 rounded-[2.5rem] bg-slate-800 text-white font-extrabold uppercase text-xs tracking-[0.2em] hover:bg-slate-700 transition-all">Explore</button>
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

                            <div id="registration-form" className="relative bg-slate-950/90 group-hover:bg-black/95 backdrop-blur-3xl rounded-[3.5rem] p-6 md:p-10 shadow-3xl overflow-hidden relative z-10 transition-all duration-700">
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
                                            {/* Tabs */}
                                            {/* Tabs */}
                                            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-[2rem]">
                                                <button type="button" onClick={() => setRegType('student')} className={`flex-1 py-2.5 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${regType === 'student' ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/20' : 'text-white/40 hover:text-white/60'}`}>Student Solo</button>
                                                <button type="button" onClick={() => setRegType('school')} className={`flex-1 py-2.5 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${regType === 'school' ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/20' : 'text-white/40 hover:text-white/60'}`}>School Partner</button>
                                            </div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-7 bg-[#2563EB] rounded-full" />
                                                <h3 className="text-xl font-extrabold text-white leading-tight uppercase">
                                                    {regType === 'student' ? 'Start Your Journey' : 'Partner with Us'}
                                                </h3>
                                            </div>
                                            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest pl-5">Begin your learning experience</p>
                                        </div>

                                        <form className="space-y-3.5 relative z-10" onSubmit={handleFormSubmit}>
                                            {regType === 'student' ? (
                                                <>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["Class 8-9", "Class 9-10", "Class 11-12", "College (1st/2nd Yr)", "College (3rd/4th Yr)"].map((option, idx) => (
                                                            <button key={idx} type="button" onClick={() => setSelectedExperience(option)} className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase tracking-wide transition-all ${selectedExperience === option ? 'bg-white text-slate-950' : 'bg-white/10 text-white/40 border border-transparent hover:border-white/10'}`}>{option}</button>
                                                        ))}
                                                    </div>
                                                    <select name="topic" value={formData.topic} onChange={handleInputChange} required className="w-full text-[11px] p-3 rounded-xl bg-white/10 border border-transparent text-white appearance-none focus:outline-none focus:bg-white/15 font-bold uppercase tracking-widest cursor-pointer shadow-lg">
                                                        <option value="" className="bg-slate-900">Select Course</option>
                                                        <option value="Full Stack" className="bg-slate-900">Full Stack</option>
                                                        <option value="AI & ML" className="bg-slate-900">AI & ML</option>
                                                        <option value="Cyber Security" className="bg-slate-900">Cyber Intelligence</option>
                                                        <option value="Robotics" className="bg-slate-900">Robotics</option>
                                                    </select>
                                                </>
                                            ) : (
                                                <div className="space-y-3">
                                                    <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} required placeholder="School Name" className="w-full text-[11px] p-3 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required placeholder="Designation" className="w-full text-[11px] p-3 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                </div>
                                            )}
                                            <div className="space-y-3">
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name" className="w-full text-[11px] p-3 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone Number" className="w-full text-[11px] p-3 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email Address" className="w-full text-[11px] p-3 rounded-xl bg-white/10 border border-transparent text-white focus:outline-none focus:bg-white/15 placeholder:text-white/20 shadow-lg" />
                                                </div>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={status === 'loading'} className="w-full rounded-[2.5rem] transition-all bg-[#2563EB] hover:bg-blue-600 shadow-2xl shadow-blue-500/30">
                                                <div className="py-3.5 text-white font-extrabold text-base uppercase tracking-widest flex items-center justify-center gap-2">
                                                    {status === 'loading' ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Get Started <ArrowRight size={16} /></>}
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

