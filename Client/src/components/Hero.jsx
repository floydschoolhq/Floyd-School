import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Terminal, Cpu, Code2, Award, Sparkles, Video, MessageSquare } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import api from '../api/axios';
// import heroBg from '../assets/images/2.png';

const HUB_DATA = [
    {
        id: "practical",
        title: "Master & Upskill AI",
        subtitle: "Master Generative Tools",
        icon: Sparkles,
        tag: "01",
        color: "blue",
        detail: "Master the future of work. Our training focuses on prompt engineering, LLM integration, and AI-driven workflows that augment your industrial engineering skills.",
        features: ["Prompt Engineering", "LLM Workflows", "AI-Agent Design"]
    },
    {
        id: "live",
        title: "Live Sessions",
        subtitle: "Real-time Learning",
        icon: Video,
        color: "slate",
        detail: "Join interactive daily live classes with industry veterans. Get your doubts cleared instantly and participate in collaborative coding sessions that accelerate growth.",
        features: ["Daily Live Classes", "Expert Q&A", "Pair Programming"]
    },
    {
        id: "projects",
        title: "Build Real Apps",
        subtitle: "Live Project Experience",
        icon: Cpu,
        color: "blue",
        detail: "Work on actual industry projects that people use. Build everything from fintech platforms to AI systems and see your work go live.",
        features: ["Active Industry Apps", "Real Team Work", "Live Portfolio"]
    },
    {
        id: "doubts",
        title: "1:1 Doubt Solving",
        subtitle: "Personalized Support",
        icon: MessageSquare,
        color: "slate",
        detail: "Never get stuck again. Our expert mentors provide one-on-one sessions to resolve your technical hurdles, refine your logic, and ensure you keep moving forward with confidence.",
        features: ["Priority Help Desk", "Personal Mentoring", "Code Debugging"]
    }
];

const HubDetailModal = ({ isOpen, onClose, item }) => {
    if (!item) return null;
    const Icon = item.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-3xl relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-${item.color}-600/20 rounded-full blur-[100px] pointer-events-none`} />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <Terminal size={20} className="rotate-45" />
                        </button>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative flex items-center justify-center">
                                <div className={`absolute inset-0 bg-${item.color}-500/20 blur-2xl rounded-full scale-150 opacity-100 transition-opacity duration-500`} />
                                <Icon
                                    size={36}
                                    className={`text-${item.color}-400 drop-shadow-[0_0_12px_rgba(37,99,235,0.4)] relative z-10`}
                                    strokeWidth={1.5}
                                />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tight">{item.title}</h3>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em]">{item.subtitle}</p>
                            </div>
                        </div>

                        <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                            {item.detail}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {item.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-[0.3em] transition-all shadow-2xl shadow-blue-600/20"
                        >
                            Got It
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHubItem, setSelectedHubItem] = useState(null);
    const containerRef = useRef(null);

    const handleEnrollNow = () => {
        navigate('/online-program');
    };

    const handleExplore = () => {
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
        <section id="home" ref={containerRef} className="relative pt-24 pb-16 overflow-hidden bg-[#FFF9FA]">
            {/* Immersive Tech Backdrop */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#FFF9FA]" />
                <div className="absolute inset-0 bg-[radial-gradient(#2563EB_10%,transparent_10%)] [background-size:40px_40px] opacity-[0.03]" />

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
                <div className="grid md:grid-cols-[1fr_420px] gap-12 items-center">
                    {/* Left Column: Bento Hub */}
                    <div className="grid grid-cols-2 gap-2 h-fit">
                        {/* Practical Training - Major Tile */}
                        <motion.div
                            initial={{ opacity: 0, x: -60, y: 60 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", damping: 20, stiffness: 80 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            onClick={() => setSelectedHubItem(HUB_DATA[0])}
                            className="col-span-2 relative p-4 md:p-5 rounded-[2.2rem] bg-slate-950/90 backdrop-blur-3xl border border-blue-500/20 group-hover:border-white/10 shadow-2xl cursor-pointer group overflow-hidden transition-all duration-500"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent group-hover:via-transparent transition-all duration-500" />
                            <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors duration-500" />
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 group-hover:bg-blue-600/0 rounded-full blur-[60px] transition-all duration-700" />
                            <div className="relative z-10 flex flex-col items-center text-center justify-center py-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-none mb-2">{HUB_DATA[0].title}</h3>
                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.25em]">{HUB_DATA[0].subtitle}</span>

                                <div className="absolute top-0 right-0 text-4xl font-black text-white/5 tracking-tighter hidden md:block select-none">
                                    {HUB_DATA[0].tag}
                                </div>
                            </div>
                        </motion.div>

                        {/* Mid Row - 2 Tiles */}
                        {HUB_DATA.slice(1, 3).map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: idx === 0 ? -100 : -60, y: 100 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    onClick={() => setSelectedHubItem(item)}
                                    transition={{ delay: 0.1 * (idx + 1), type: "spring", damping: 20 }}
                                    className="relative p-4 rounded-[1.8rem] bg-slate-950/90 backdrop-blur-3xl border border-blue-500/10 group-hover:border-white/5 shadow-xl cursor-pointer group overflow-hidden transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-blue-600/[0.07] group-hover:bg-blue-600/0 transition-colors duration-500" />
                                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-600/[0.08] group-hover:bg-blue-600/0 rounded-full blur-[40px] transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col items-center text-center py-2">
                                        <h4 className="text-[18px] font-bold text-white uppercase tracking-tight leading-none mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{item.subtitle}</span>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Bottom Full-Width Tile: Doubt Solving */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: "spring", damping: 20 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            onClick={() => setSelectedHubItem(HUB_DATA[3])}
                            className="col-span-2 relative p-4 md:p-5 rounded-[2.2rem] bg-slate-950/90 backdrop-blur-3xl border border-blue-500/20 group-hover:border-white/10 shadow-2xl cursor-pointer group overflow-hidden transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors duration-500" />
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 group-hover:bg-blue-600/0 rounded-full blur-[60px] transition-all duration-700" />
                            <div className="relative z-10 flex flex-col items-center text-center justify-center py-4">
                                <h3 className="text-[20px] md:text-2xl font-bold text-white uppercase tracking-tight leading-none mb-1 group-hover:text-blue-400 transition-colors">{HUB_DATA[3].title}</h3>
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em]">{HUB_DATA[3].subtitle}</span>

                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-blue-400 group-hover:translate-x-2 transition-all">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Bento Tile */}
                        <motion.div className="col-span-2 mt-3 p-1 rounded-[2.2rem] bg-slate-900 shadow-2xl flex items-center gap-2">
                            <button onClick={handleEnrollNow} className="flex-1 py-3.5 rounded-[1.8rem] bg-blue-600 text-white font-bold uppercase text-[11px] tracking-[0.15em] hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20">Enroll Now</button>
                            <button onClick={handleExplore} className="flex-1 py-3.5 rounded-[1.8rem] bg-slate-800 text-white font-bold uppercase text-[11px] tracking-[0.15em] hover:bg-slate-700 transition-all active:scale-95">Explore</button>
                        </motion.div>
                    </div>

                    {/* Right Column: 3D Interactive Form */}
                    <div className="perspective-[2000px] flex justify-center items-center origin-top md:origin-right">
                        <motion.div
                            initial={{ opacity: 0, x: 100, y: 100, rotateY: 10 }}
                            whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0 }}
                            whileHover={{ scale: 1.02 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, type: "spring", damping: 20 }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            className="relative w-full group"
                        >
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600 rounded-[4rem] p-[2.5px] shadow-[0_0_60px_rgba(37,99,235,0.4)] blur-[1px]" />
                            <div id="registration-form" className="relative bg-slate-950/95 backdrop-blur-3xl rounded-[3rem] p-7 md:p-10 shadow-3xl overflow-hidden z-10 border border-blue-500/20 group-hover:border-white/5 transition-all duration-500">
                                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors duration-500" />
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 group-hover:bg-blue-600/0 rounded-full blur-[80px] transition-all duration-700" />
                                {status === 'success' ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 relative z-10">
                                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"><CheckCircle className="w-10 h-10" /></div>
                                        <h3 className="text-2xl font-black text-white mb-3 uppercase">Success</h3>
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Details submitted.</p>
                                        <button onClick={() => setStatus('idle')} className="mt-8 text-[9px] font-black text-blue-500 hover:text-white uppercase tracking-[0.3em]">← New</button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-8 relative z-10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Start Your Journey</h3>
                                            </div>
                                            <p className="text-white/30 text-[11px] font-bold uppercase tracking-[0.2em] pl-5">Begin your learning experience</p>
                                        </div>
                                        <form className="space-y-6 relative z-10" onSubmit={handleFormSubmit}>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Class 8-9", "Class 9-10", "Class 11-12", "College"].map((option, idx) => (
                                                    <button key={idx} type="button" onClick={() => setSelectedExperience(option)} className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${selectedExperience === option ? 'bg-white text-slate-950' : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/10'}`}>{option}</button>
                                                ))}
                                            </div>
                                            <select name="topic" value={formData.topic} onChange={handleInputChange} required className="w-full text-[12px] p-4 rounded-xl bg-white/5 border border-white/5 text-white appearance-none focus:outline-none focus:bg-white/10 font-black uppercase tracking-widest cursor-pointer">
                                                <option value="" className="bg-slate-900">Select Track</option>
                                                <option value="Full Stack" className="bg-slate-900">Full Stack Engineering</option>
                                                <option value="AI & ML" className="bg-slate-900">AI & Machine Learning</option>
                                                <option value="Cyber Security" className="bg-slate-900">Cyber Intelligence</option>
                                                <option value="Robotics" className="bg-slate-900">Robotics & IoT</option>
                                            </select>
                                            <div className="space-y-4">
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name" className="w-full text-[12px] p-4 rounded-xl bg-white/5 border border-white/5 text-white focus:outline-none focus:bg-white/10 placeholder:text-white/20 font-bold" />
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone Number" className="w-full text-[12px] p-4 rounded-xl bg-white/5 border border-white/5 text-white focus:outline-none focus:bg-white/10 placeholder:text-white/20 font-bold" />
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email Address" className="w-full text-[12px] p-4 rounded-xl bg-white/5 border border-white/5 text-white focus:outline-none focus:bg-white/10 placeholder:text-white/20 font-bold" />
                                            </div>
                                            <motion.button type="submit" disabled={status === 'loading'} className="w-full rounded-[2.5rem] bg-blue-600 hover:bg-blue-500 py-4 shadow-3xl shadow-blue-500/30">
                                                <div className="text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                                    {status === 'loading' ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Get Started <ArrowRight size={16} /></>}
                                                </div>
                                            </motion.button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <HubDetailModal
                isOpen={!!selectedHubItem}
                onClose={() => setSelectedHubItem(null)}
                item={selectedHubItem}
            />
            <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default Hero;
