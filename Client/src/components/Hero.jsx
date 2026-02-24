import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { CheckCircle, ArrowRight, Terminal, Cpu, Code2 } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import api from '../api/axios';

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
        <div ref={containerRef} className="relative bg-[#FCF8F8] pt-32 pb-20 overflow-hidden">
            {/* Subtle Background Decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2563EB]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-100/50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
                {/* Split Grid Layout */}
                <div className="grid md:grid-cols-[1fr_460px] gap-16 items-center">

                    {/* Left Column */}
                    <div className="flex flex-col gap-5">
                        {/* Delivery Mode Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 py-1.5 min-w-fit bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-full flex items-center gap-2 backdrop-blur-md"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                                <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.2em]">In-School Bootcamps</span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="px-4 py-1.5 min-w-fit bg-slate-100 border border-slate-200 rounded-full flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Online Learning Pathways</span>
                            </motion.div>
                        </div>

                        {/* Headlines — reduced size */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-3"
                        >
                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit'] leading-[0.9]">
                                LOGIC ALIGNED,<br />
                                <span className="text-[#2563EB]">FUTURE</span> DEFINED
                            </h1>
                        </motion.div>

                        {/* Feature Cards — reduced padding */}
                        <div className="flex flex-col gap-3">
                            {[
                                { title: "Technical Excellence", sub: "Industrial Grade", icon: <Terminal className="w-4 h-4" /> },
                                { title: "Real-world Projects", sub: "Industrial Grade", icon: <Cpu className="w-4 h-4" /> },
                                { title: "Software Engineering", sub: "Industrial Grade", icon: <Code2 className="w-4 h-4" /> }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 6, scale: 1.01 }}
                                    className="group relative flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-[#FBEFEF] shadow-sm hover:border-[#2563EB]/30 hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-2xl" />
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 shrink-0">
                                        {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black uppercase tracking-wide text-slate-800 font-['Outfit']">{item.title}</span>
                                        <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest font-['Outfit']">{item.sub}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-3 mt-8"
                        >
                            <button
                                onClick={() => handleAuthAction(() => navigate('/student/dashboard'))}
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 font-['Outfit']"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/online-program')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-[#FBEFEF] rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#FCF8F8] hover:border-[#2563EB]/30 transition-all hover:-translate-y-0.5 font-['Outfit']"
                            >
                                Explore Programs
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
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2563EB] via-blue-300 to-[#2563EB] rounded-[2.5rem] p-[1px] opacity-10 group-hover:opacity-60 transition-opacity duration-700 blur-sm" />

                            <div id="registration-form" className="relative bg-slate-950/40 backdrop-blur-2xl rounded-[3rem] p-6 md:p-10 shadow-3xl border border-white/10 overflow-hidden relative z-10">
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
                                        <h3 className="text-2xl font-black text-white mb-3 font-['Outfit'] uppercase">Success</h3>
                                        <p className="text-white/40 text-xs font-medium max-w-[240px] mx-auto">Details submitted successfully.</p>
                                        <button onClick={() => setStatus('idle')} className="mt-8 text-[10px] font-black text-[#2563EB] hover:text-white uppercase tracking-[0.3em] font-['Outfit']">← New Request</button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-6 relative z-10">
                                            {/* Tabs */}
                                            {/* Tabs */}
                                            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-2xl border border-white/10">
                                                <button type="button" onClick={() => setRegType('student')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all font-['Outfit'] ${regType === 'student' ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/20' : 'text-white/40 hover:text-white/60'}`}>Student Solo</button>
                                                <button type="button" onClick={() => setRegType('school')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all font-['Outfit'] ${regType === 'school' ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/20' : 'text-white/40 hover:text-white/60'}`}>School Partner</button>
                                            </div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-7 bg-[#2563EB] rounded-full" />
                                                <h3 className="text-xl font-black text-white leading-tight font-['Outfit'] uppercase">
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
                                                            <button key={idx} type="button" onClick={() => setSelectedExperience(option)} className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wide transition-all ${selectedExperience === option ? 'bg-white text-slate-950' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'}`}>{option}</button>
                                                        ))}
                                                    </div>
                                                    <select name="topic" value={formData.topic} onChange={handleInputChange} required className="w-full text-[11px] p-2.5 rounded-lg bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-[#2563EB]/50 font-black uppercase tracking-widest cursor-pointer">
                                                        <option value="" className="bg-slate-900">Select Course</option>
                                                        <option value="Full Stack" className="bg-slate-900">Full Stack</option>
                                                        <option value="AI & ML" className="bg-slate-900">AI & ML</option>
                                                        <option value="Cyber Security" className="bg-slate-900">Cyber Intelligence</option>
                                                        <option value="Robotics" className="bg-slate-900">Robotics</option>
                                                    </select>
                                                </>
                                            ) : (
                                                <div className="space-y-3">
                                                    <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} required placeholder="School Name" className="w-full text-[11px] p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none placeholder:text-white/20" />
                                                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required placeholder="Designation" className="w-full text-[11px] p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none placeholder:text-white/20" />
                                                </div>
                                            )}
                                            <div className="space-y-3">
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name" className="w-full text-[11px] p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none placeholder:text-white/20" />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone Number" className="w-full text-[11px] p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none placeholder:text-white/20" />
                                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email Address" className="w-full text-[11px] p-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none placeholder:text-white/20" />
                                                </div>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={status === 'loading'} className="w-full rounded-[1.5rem] transition-all bg-[#2563EB] hover:bg-blue-600">
                                                <div className="py-3.5 text-white font-black text-base uppercase tracking-[0.25em] flex items-center justify-center gap-2">
                                                    {status === 'loading' ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Get Started <ArrowRight size={16} /></>}
                                                </div>
                                            </motion.button>
                                            <p className="text-center text-[8px] text-white/20 uppercase tracking-widest font-['Outfit']">Secure Registration</p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="hero_10x_card" />
            </div>
        </div>
    );
};

export default Hero;
