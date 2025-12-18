import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Briefcase, Award, Headphones, Terminal, Cpu, Code2, CheckCircle, ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import api from '../api/axios';

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef(null);
    const howItWorksRef = useRef(null);

    // Global Hero Scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Dedicated How It Works Scroll
    const { scrollYProgress: hwProgress } = useScroll({
        target: howItWorksRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const hwScaleY = useSpring(hwProgress, {
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

    return (
        <div ref={containerRef} className="relative bg-white pt-10 pb-16 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* Timeline Vertical Line - Background */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100 hidden md:block"></div>

                {/* Timeline Vertical Line - Progress */}
                <motion.div
                    style={{ scaleY: scaleY }}
                    className="absolute left-8 top-0 bottom-0 w-px bg-[#fca96d] origin-top hidden md:block"
                ></motion.div>

                {/* Timeline Node - Following */}
                <motion.div
                    style={{ top: useTransform(scrollYProgress, [0, 1], ["10%", "90%"]) }}
                    className="absolute left-[26px] w-3 h-3 rounded-full border-2 border-[#fca96d] bg-white hidden md:block z-10"
                ></motion.div>


                <div className="md:pl-16">
                    {/* Main Heading Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        {/* Cards Grid - 10X Style */}
                        <div className="grid md:grid-cols-2 gap-6 max-w-5xl items-start">

                            {/* Left Column: Premium Styled Highlights */}
                            <div className="flex flex-col gap-16">
                                {/* One-Liner 1: The ThinkSkool Elite */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-1 overflow-visible"
                                >
                                    <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight font-['Outfit']">
                                        The ThinkSkool <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca96d] to-orange-500">Elite</span>
                                    </h3>
                                    <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm max-w-sm font-['Inter']">
                                        Architecting next-generation tech leaders through industry-grade mastery and proprietary toolchains.
                                    </p>

                                    <div className="flex flex-col gap-5">
                                        {[
                                            { title: "Technical Excellence", icon: <Terminal className="w-4 h-4" /> },
                                            { title: "Production Mastery", icon: <Cpu className="w-4 h-4" /> },
                                            { title: "Innovation Core", icon: <Code2 className="w-4 h-4" /> }
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ x: 12, scale: 1.02 }}
                                                className="group flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 hover:border-[#fca96d]/20 transition-all duration-500"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#fca96d] shadow-lg group-hover:scale-110 transition-all duration-300">
                                                    {item.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors">{item.title}</span>
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Industrial Grade</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* One-Liner 2: Career & Growth */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="relative pl-1"
                                >
                                    <h4 className="text-3xl font-black text-slate-900 mb-8 tracking-tight font-['Outfit']">Career & <span className="text-[#fca96d]">Growth</span></h4>

                                    <div className="flex flex-col gap-5">
                                        {[
                                            { label: "Placement Integration", icon: <Briefcase className="w-4 h-4" /> },
                                            { label: "Elite Certifications", icon: <Award className="w-4 h-4" /> },
                                            { label: "24/7 Expert Support", icon: <Headphones className="w-4 h-4" /> }
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ x: 12, scale: 1.02 }}
                                                className="group flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-[#fca96d]/20 transition-all duration-500"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#fca96d] shadow-inner group-hover:bg-[#fca96d] group-hover:text-white transition-all duration-300">
                                                    {item.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors">{item.label}</span>
                                                    <span className="text-[9px] font-bold text-[#fca96d]/60 uppercase tracking-widest mt-1">Tier-1 Partner Network</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Card 2: Premium Registration Form - Offset with 3D Depth */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -10, rotateY: -2, rotateX: 2 }}
                                className="bg-gradient-to-br from-white to-slate-50 md:ml-12 rounded-[3rem] p-10 relative overflow-visible shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_30px_60px_-15px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,1),0_0_0_1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-center before:absolute before:inset-0 before:rounded-[3rem] before:bg-gradient-to-br before:from-[#fca96d]/5 before:to-transparent before:pointer-events-none"
                            >
                                {/* Floating Accent Element for 3D feel */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#fca96d] to-orange-400 rounded-3xl rotate-12 -z-10 blur-2xl opacity-20 animate-pulse"></div>

                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm border border-green-100">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 font-['Outfit']">Success!</h3>
                                        <p className="text-slate-500 text-sm max-w-[240px] mx-auto leading-relaxed font-['Inter']">
                                            Your enquiry has been received. Our expert will contact you within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="mt-8 text-xs font-bold text-[#fca96d] hover:underline uppercase tracking-widest"
                                        >
                                            Submit Another enquiry
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit']">Curate Your <span className="text-[#fca96d]">Path</span></h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Select your current stage to begin</p>
                                        </div>

                                        <form className="space-y-6" onSubmit={handleFormSubmit}>
                                            {/* Experience Selection Cards */}
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["Class 6-7", "Class 8", "Class 9-10", "Class 11-12", "College", "Management", "Others"].map((option, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => setSelectedExperience(option)}
                                                            className={`
                                                                py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-500 relative overflow-hidden active:scale-95
                                                                ${selectedExperience === option
                                                                    ? 'bg-slate-900 text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'
                                                                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm hover:shadow-md'}
                                                            `}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Dynamic Input for Others */}
                                                {selectedExperience === 'Others' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="pt-2"
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="Specify grade/profession..."
                                                            className="w-full text-[11px] p-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:border-[#fca96d]/50 focus:bg-white focus:ring-4 focus:ring-[#fca96d]/5 transition-all font-medium placeholder:text-slate-500"
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Topic Selection */}
                                            <div className="relative group">
                                                <select
                                                    name="topic"
                                                    value={formData.topic}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full text-xs p-4 rounded-2xl border border-slate-100 bg-white text-slate-600 appearance-none focus:outline-none focus:border-[#fca96d] focus:ring-4 focus:ring-[#fca96d]/10 transition-all font-bold shadow-inner"
                                                >
                                                    <option value="">Select Domain of Interest</option>
                                                    <option value="Full Stack Development">Full Stack Development</option>
                                                    <option value="Data Science & AI">Data Science & AI</option>
                                                    <option value="Cyber Security">Cyber Security</option>
                                                    <option value="IoT & Robotics">IoT & Robotics</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#fca96d] transition-colors">
                                                    <ArrowRight size={14} className="rotate-90" />
                                                </div>
                                            </div>

                                            {/* Inputs Grid */}
                                            <div className="grid gap-3">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        pattern="[A-Za-z\s]{3,50}"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Full Name"
                                                        className="w-full text-xs p-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:border-[#fca96d] focus:ring-4 focus:ring-[#fca96d]/10 transition-all font-medium placeholder:text-slate-400 shadow-inner"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        pattern="[0-9]{10}"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Contact No."
                                                        className="w-full text-xs p-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:border-[#fca96d] focus:ring-4 focus:ring-[#fca96d]/10 transition-all font-medium placeholder:text-slate-400 shadow-inner"
                                                    />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Email Address"
                                                        className="w-full text-xs p-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:border-[#fca96d] focus:ring-4 focus:ring-[#fca96d]/10 transition-all font-medium placeholder:text-slate-400 shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full relative group overflow-hidden rounded-2xl shadow-[0_20px_40px_-10px_rgba(252,169,109,0.3)] transition-all hover:shadow-[0_25px_50px_-12px_rgba(252,169,109,0.4)]"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 transition-all duration-500 group-hover:bg-slate-800"></div>
                                                <div className="relative py-5 text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                                    {status === 'loading' ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                            Authenticating...
                                                        </span>
                                                    ) : (
                                                        <>Request Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                                                    )}
                                                </div>
                                            </motion.button>

                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed px-4">
                                                I authorize ThinkSkool to communicate technical insights & program updates.
                                            </p>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>





                    {/* HOW IT WORKS Section */}
                    <div ref={howItWorksRef} className="py-24 border-t border-slate-100 relative">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">How It Works ?</h2>
                        </div>

                        <div className="relative">
                            {/* Vertical Line - Background (Gray) */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100 rounded-full"></div>

                            {/* Vertical Line - Scroll Progress (Colored) */}
                            <motion.div
                                style={{ scaleY: hwScaleY }}
                                className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#fca96d] to-orange-500 rounded-full origin-top"
                            />

                            {/* Traveling Node */}
                            <motion.div
                                style={{ top: useTransform(hwProgress, [0, 1], ["0%", "100%"]) }}
                                className="absolute left-[18px] w-3 h-3 rounded-full border-2 border-[#fca96d] bg-white z-20 shadow-sm hidden md:block"
                            ></motion.div>

                            {/* Steps */}
                            <div className="space-y-10">
                                {[
                                    {
                                        title: "Introductory Meeting & Schedule Finalization",
                                        desc: "We align the program timings with your school timetable.",
                                        color: "bg-[#fca96d]"
                                    },
                                    {
                                        title: "7-Day In-School Tech Immersion",
                                        desc: "ThinkSkool mentors conduct hands-on sessions in the classroom.",
                                        color: "bg-slate-900"
                                    },
                                    {
                                        title: "Student Engagement & Progress Observation",
                                        desc: "School leadership observes student interest and learning outcomes.",
                                        color: "bg-[#fca96d]"
                                    },
                                    {
                                        title: "Feedback & Continuation Decision",
                                        desc: "If the school wishes, we continue with our extended in-school training program.",
                                        subBox: "No obligation - Continuation is optional and based on the school's interest.",
                                        color: "bg-slate-900"
                                    }
                                ].map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 12,
                                            delay: idx * 0.1
                                        }}
                                        className="relative pl-20"
                                    >
                                        {/* Dot with Pulse Effect */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: idx * 0.1 + 0.2 }}
                                            className={`absolute left-3 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md ${step.color} z-10`}
                                        >
                                            <div className={`absolute inset-0 rounded-full ${step.color} animate-ping opacity-75`}></div>
                                        </motion.div>

                                        {/* Content */}
                                        <div className="group hover:translate-x-2 transition-transform duration-300">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                            <p className="text-slate-600 leading-relaxed font-medium text-sm">{step.desc}</p>
                                            {step.subBox && (
                                                <div className="mt-4 p-4 bg-slate-50 border-l-4 border-slate-900 rounded-r-lg">
                                                    <p className="text-sm font-bold text-slate-800">{step.subBox}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="hero_10x_card" />
        </div >
    );
};

export default Hero;
