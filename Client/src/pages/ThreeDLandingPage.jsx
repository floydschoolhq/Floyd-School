import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Code2, Cpu, Globe, Zap, Sparkles, Terminal, BookOpen, Users, Briefcase, CheckCircle } from 'lucide-react';
import ThreeDBackground from '../components/ui/ThreeDBackground.jsx';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, subtitle, index, total }) => {
    // Calculate radial position
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 350; // Distance from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * (radius * 0.7); // Slightly oval

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, x, y }}
            transition={{
                delay: 0.8 + index * 0.15, // Staggered entry after main text
                duration: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 12
            }}
            whileHover={{ scale: 1.05, zIndex: 50, y: y - 10 }}
            className="absolute p-6 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 w-64 cursor-pointer group hover:bg-white/20 hover:border-blue-400/60 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all"
        >
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white drop-shadow-lg line-clamp-1">{title}</h4>
                        <div className="h-0.5 w-0 group-hover:w-full bg-blue-400 transition-all duration-500 rounded-full mt-1 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                    </div>
                </div>
                <p className="text-[9px] font-bold text-white/70 uppercase tracking-[0.25em] leading-relaxed group-hover:text-white transition-colors drop-shadow-md">
                    {subtitle}
                </p>
                <div className="absolute top-0 right-0 text-[24px] font-black text-white/10 group-hover:text-blue-400/30 transition-colors select-none">
                    0{index + 1}
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors duration-500 rounded-[2.5rem] -z-1 blur-2xl" />
        </motion.div>
    );
};

const ThreeDLandingPage = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success
    const [selectedGrade, setSelectedGrade] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const features = [
        { icon: <Code2 className="w-6 h-6" />, title: "Practical Training", subtitle: "Industrial Tech Bootcamps" },
        { icon: <BookOpen className="w-6 h-6" />, title: "LMS Projects", subtitle: "Real-world exposure" },
        { icon: <Briefcase className="w-6 h-6" />, title: "Career Track", subtitle: "Placement & Portfolio" },
        { icon: <Users className="w-6 h-6" />, title: "Student Community", subtitle: "Collaborative Learning" }
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        setTimeout(() => setFormStatus('success'), 2000);
    };

    return (
        <div className="relative min-h-screen text-slate-900 selection:bg-blue-500/30 overflow-hidden font-['Space_Grotesk'] bg-[#020617]">
            <ThreeDBackground />

            {/* Clean White Global Navbar */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-[100] px-12 py-6 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'bg-transparent border-transparent'}`}
            >
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-[0_4px_14px_rgba(37,99,235,0.39)] group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all">TS</div>
                    <span className="text-xl font-black uppercase tracking-tighter text-slate-900">ThinkSkool</span>
                </div>
                <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                    <a href="#" className="hover:text-blue-600 hover:tracking-[0.45em] transition-all">Courses</a>
                    <a href="#" className="hover:text-blue-600 hover:tracking-[0.45em] transition-all">Infrastructure</a>
                    <a href="#" className="hover:text-blue-600 hover:tracking-[0.45em] transition-all">Network</a>
                    <button
                        onClick={() => navigate('/student/login')}
                        className="px-8 py-3 bg-slate-900 text-white rounded-full shadow-lg transition-all font-black text-[9px] hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        CLASSROOM PORTAL
                    </button>
                </div>
            </motion.nav>

            {/* Main Interactive Stage */}
            <div className="relative z-10 w-full h-screen flex items-center justify-center">

                {/* Orbital Feature Grid */}
                <div className="relative w-0 h-0 flex items-center justify-center">
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} index={i} total={features.length} />
                    ))}
                </div>

                {/* Central Focus Hub - Floating Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="relative z-20 flex flex-col items-center text-center mt-20"
                >
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="relative flex flex-col items-center justify-center"
                    >
                        {/* Immersive Rings - adjusted for white video overlay */}
                        <div className="absolute -inset-32 border-[1px] border-white/20 rounded-full animate-radial-pulse" />
                        <div className="absolute -inset-56 border-[1px] border-white/10 rounded-full animate-orbit" />

                        <div className="relative p-16 rounded-[4rem] bg-black/40 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.6)]">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping mb-8 shadow-[0_0_10px_rgba(96,165,250,1)]" />
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                Start Your<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">Journey</span>
                            </h1>
                            <p className="text-[11px] font-bold text-white/80 uppercase tracking-[0.5em] mb-12 drop-shadow-md">
                                Begin your learning experience
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05, letterSpacing: "0.3em" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowForm(true)}
                                className="px-14 py-6 bg-blue-600 text-white font-black uppercase text-xs tracking-[0.25em] rounded-[2rem] shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_25px_50px_rgba(37,99,235,0.6)] border border-blue-400/50 transition-all flex items-center gap-4"
                            >
                                Select Your Experience <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Pro Registration Overlay */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl p-4 md:p-10 text-white"
                        >
                            <motion.div
                                initial={{ y: 50, scale: 0.95, opacity: 0 }}
                                animate={{ y: 0, scale: 1, opacity: 1 }}
                                exit={{ y: 50, scale: 0.95, opacity: 0 }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                                className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-3xl p-8 md:p-14 rounded-[3rem] border border-white/20 relative shadow-[0_0_100px_rgba(37,99,235,0.3)]"
                            >
                                <button
                                    onClick={() => { setShowForm(false); setFormStatus('idle'); }}
                                    className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"
                                >✕</button>

                                {formStatus === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                                            <CheckCircle className="w-12 h-12 text-blue-400 animate-bounce" />
                                        </div>
                                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">Onboarding Initialized</h3>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">Systems are ready. check your email for the industrial portal keys.</p>
                                        <button onClick={() => setShowForm(false)} className="px-8 py-3 bg-blue-600 rounded-full text-[10px] font-black text-white hover:bg-blue-500 uppercase tracking-[0.2em] transition-colors shadow-lg shadow-blue-500/30">Return to Dashboard</button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                                                <h2 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-md">Onboarding</h2>
                                            </div>
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] pl-5 drop-shadow-sm">Join the next-gen industrial ecosystem</p>
                                        </div>

                                        <form className="space-y-8" onSubmit={handleFormSubmit}>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                {["Class 8-9", "Class 9-10", "Class 11-12", "College"].map((grade) => (
                                                    <button
                                                        key={grade}
                                                        type="button"
                                                        onClick={() => setSelectedGrade(grade)}
                                                        className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${selectedGrade === grade ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.4)] border-transparent scale-105' : 'bg-slate-800/50 hover:bg-slate-800 text-white/60 border border-white/10'}`}
                                                    >
                                                        {grade}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative group">
                                                <select required className="w-full p-5 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-xs font-black uppercase tracking-[0.2em] appearance-none cursor-pointer text-white shadow-inner">
                                                    <option value="" className="bg-slate-900 text-white/50">Select Module Track</option>
                                                    <option value="fs" className="bg-slate-900 text-white">Full Stack Engineering</option>
                                                    <option value="ai" className="bg-slate-900 text-white">AI & Neural Networks</option>
                                                    <option value="rb" className="bg-slate-900 text-white">Robotics Industrial Ops</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-blue-400 transition-colors">▼</div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <input required type="text" placeholder="Full Name" className="w-full p-5 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-sm font-medium text-white placeholder:text-white/30 shadow-inner" />
                                                <input required type="email" placeholder="Email Address" className="w-full p-5 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-sm font-medium text-white placeholder:text-white/30 shadow-inner" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                                <input required type="tel" placeholder="Mobile Status" className="w-full p-5 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-sm font-medium text-white placeholder:text-white/30 shadow-inner" />
                                                <div className="flex items-center gap-3 px-4 py-2 md:py-0">
                                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                                        <Sparkles className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-emerald-400/80 uppercase tracking-[0.2em] leading-relaxed">Secure Cloud<br />Registration Active</span>
                                                </div>
                                            </div>

                                            <button
                                                disabled={formStatus === 'loading'}
                                                className="w-full py-6 mt-6 bg-blue-600 rounded-2xl text-white font-black uppercase text-xs tracking-[0.4em] shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_20px_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0"
                                            >
                                                {formStatus === 'loading' ? "Synchronizing Data..." : "GET STARTED NOW"}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Industrial Overlay Decoration */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="fixed bottom-12 right-12 flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/40 select-none drop-shadow-md z-[90]"
            >
                <div className="flex flex-col items-end">
                    <span>Industrial Protocol v7.2</span>
                    <span className="text-blue-400/80">Encryption: AES-256</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <Terminal className="w-6 h-6 text-white/50" />
            </motion.div>
        </div>
    );
};

export default ThreeDLandingPage;
