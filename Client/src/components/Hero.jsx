import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, animate } from 'framer-motion';
import { CheckCircle, ArrowRight, Terminal, Cpu, Code2, Award, Sparkles, Video, MessageSquare, Users, Zap } from 'lucide-react';
import { useState, useRef } from 'react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import api from '../api/axios';

const AnimatedCounter = ({ value, duration = 2 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [display, setDisplay] = useState(0);

    React.useEffect(() => {
        const controls = animate(count, value, {
            duration,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.round(latest))
        });
        return controls.stop;
    }, [value, duration, count]);

    return <>{display}</>;
};

const TrustIndicator = () => {
    const trustItems = [
        { char: 'T', bg: 'bg-slate-900' },
        { char: 'H', bg: 'bg-slate-800' },
        { char: 'I', bg: 'bg-slate-700' },
        { char: 'N', bg: 'bg-slate-600' },
        { char: 'K', bg: 'bg-slate-500' },
    ];
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="flex items-center gap-5 mb-10 px-6 py-3.5 bg-white/90 border border-slate-200/60 backdrop-blur-xl w-fit mx-auto md:mx-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group"
        >
            <div className="flex -space-x-3.5">
                {trustItems.map((item, i) => (
                    <div
                        key={i}
                        className={`w-11 h-11 border-[2.5px] border-white rounded-full ${item.bg} flex items-center justify-center text-white shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                        <span className="text-[14px] font-black">{item.char}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-slate-800 tracking-[-0.03em] leading-none">
                        <AnimatedCounter value={1000} />+ <span className="font-medium text-slate-400 ml-0.5">Active Students</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <motion.svg
                                key={s}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + (s * 0.1) }}
                                className="w-2.5 h-2.5 text-amber-500 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </motion.svg>
                        ))}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100 transition-opacity">Verified Industrial Stats</span>
                </div>
            </div>
        </motion.div>
    );
};

const ProgressCard = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [20, 0, -8, 0] }}
        transition={{ 
            opacity: { duration: 0.5 },
            y: { 
                times: [0, 0.2, 0.6, 1],
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }}
        viewport={{ once: true }}
        className="bg-[#F2F2F7] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl relative overflow-hidden group"
    >
        <div className="flex items-center gap-3 mb-8">
            <span className="px-4 py-1.5 bg-slate-200 text-slate-600 text-[11px] font-bold tracking-tight uppercase">Course Demand</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Demand among students</h3>
        
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">Artificial Intelligence</span>
                    <span className="text-[13px] font-bold text-slate-900">95%</span>
                </div>
                <div className="h-2 bg-slate-100 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '95%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-slate-900" />
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">Web & Cloud</span>
                    <span className="text-[13px] font-bold text-slate-900">78%</span>
                </div>
                <div className="h-2 bg-slate-100 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '78%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-slate-700" />
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">Robotics & IoT</span>
                    <span className="text-[13px] font-bold text-slate-900">42%</span>
                </div>
                <div className="h-2 bg-slate-100 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '42%' }} transition={{ duration: 1, delay: 0.9 }} className="h-full bg-slate-400" />
                </div>
            </div>
        </div>
    </motion.div>
);

const StreakCard = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [0.9, 1, 1], y: [0, -12, 0] }}
        transition={{ 
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: { 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
            }
        }}
        viewport={{ once: true }}
        className="bg-[#F2F2F7] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center relative group"
    >
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600">
            <Video size={24} />
        </div>
        <div className="text-xl font-black text-slate-900 mb-1 leading-tight">Free Demo<br/>Session</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-3 py-1 bg-slate-100 rounded-full">Book Now</div>
    </motion.div>
);

const ProjectCounterCard = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: [-20, 0, 0], y: [0, -6, 0] }}
        transition={{ 
            opacity: { duration: 0.5 },
            x: { duration: 0.5 },
            y: { 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
            }
        }}
        viewport={{ once: true }}
        className="bg-[#F2F2F7] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl relative group h-full"
    >
        <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-6 text-slate-600">
            <Zap size={24} />
        </div>
        <div className="text-4xl font-black text-slate-900 mb-1">50+</div>
        <div className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Industrial Projects</div>
    </motion.div>
);

const LiveActivityCard = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [20, 0, -8, 0] }}
        transition={{ 
            opacity: { duration: 0.5 },
            y: { 
                times: [0, 0.2, 0.6, 1],
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
            }
        }}
        viewport={{ once: true }}
        className="bg-[#F2F2F7] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl relative group"
    >
        <div className="flex items-center gap-4 mb-8">
            <div className="relative">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-800 shadow-sm border border-slate-100/50">
                    <Video size={28} />
                </div>
            </div>
            <div>
                <h4 className="text-[15px] font-bold text-slate-900 leading-tight">Engineering Hub</h4>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1">Industrial Sessions</p>
            </div>
        </div>
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-[#F2F2F7] bg-slate-200" />
                    ))}
                </div>
                <span className="text-[11px] font-bold text-slate-600 tracking-tight">Access to all sessions</span>
            </div>
            <div className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold tracking-tight rounded-full flex items-center gap-1">
                VIEW <ArrowRight size={10} />
            </div>
        </div>
    </motion.div>
);

const CertificateCard = () => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: [20, 0, 0], y: [0, -10, 0] }}
        transition={{ 
            opacity: { duration: 0.5 },
            x: { duration: 0.5 },
            y: { 
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
            }
        }}
        viewport={{ once: true }}
        className="bg-[#F2F2F7] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl relative group"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100/50 flex items-center justify-center text-slate-800">
                <Award size={24} />
            </div>
            <div>
                <h4 className="text-[14px] font-bold text-slate-900 leading-tight">Accreditation</h4>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Verified Credits</p>
            </div>
        </div>
        
        <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white">
                <div className="text-[11px] font-bold text-slate-600">Verification ID</div>
                <div className="text-[10px] font-mono font-bold text-slate-400">TS-X9420</div>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex -space-x-1.5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#F2F2F7] bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="user" />
                    </div>
                ))}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">2k+ Alumni</div>
        </div>
    </motion.div>
);

const Hero = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const handleEnrollNow = () => {
        navigate('/online-program');
    };

    return (
        <section id="home" ref={containerRef} className="relative pt-32 pb-24 overflow-hidden bg-white">
            {/* Background Accents - Neutralized for Apple White theme */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.01] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/[0.01] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
                    {/* Left Column: Core Text */}
                    <div className="text-center lg:text-left">
                        <TrustIndicator />
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-800 tracking-tight leading-[0.9] mb-10"
                        >
                            Future of <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-slate-800 to-slate-500">Engineering.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-slate-500 font-medium tracking-tight mb-12 max-w-xl"
                        >
                            
                        </motion.p>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start"
                        >
                            <button
                                onClick={handleEnrollNow}
                                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-black text-[13px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/10 active:scale-95"
                            >
                                Enroll Now
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Bento Hub */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 flex flex-col pt-12">
                                <ProgressCard />
                            </div>
                            <div className="space-y-4">
                                <StreakCard />
                                <LiveActivityCard />
                            </div>
                        </div>

                        {/* Floating elements for depth */}
                        <div className="absolute -z-10 -top-10 -left-10 w-32 h-32 bg-blue-100 blur-3xl opacity-50" />
                        <div className="absolute -z-10 -bottom-10 -right-10 w-32 h-32 bg-indigo-100 blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
