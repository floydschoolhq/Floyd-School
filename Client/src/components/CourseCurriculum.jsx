import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import api from '../api/axios';

const CourseCurriculum = ({ courseId = "1", variant = "light", initialRegisteredCount = 45, totalSeats: initialTotalSeats = 50 }) => {
    const navigate = useNavigate();
    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isSecuring, setIsSecuring] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [registeredCount, setRegisteredCount] = useState(initialRegisteredCount);
    const [totalSeats, setTotalSeats] = useState(initialTotalSeats);
    const [price, setPrice] = useState(3999);
    const [originalPrice, setOriginalPrice] = useState(5999);
    
    const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    useEffect(() => {
        const fetchLiveStats = async () => {
            try {
                // Fetch from the NEW public stats endpoint that doesn't require auth
                const res = await api.get(`/public/courses/${courseId}/stats`);
                if (res.data && res.data.success) {
                    setRegisteredCount(res.data.manualEnrollmentCount);
                    setTotalSeats(res.data.totalSeats);
                    if (res.data.price) setPrice(res.data.price);
                    if (res.data.originalPrice) setOriginalPrice(res.data.originalPrice);
                }
            } catch (err) {
                console.warn('Live stats fetch from public nexus failed, using fallback data');
                setRegisteredCount(initialRegisteredCount);
                setTotalSeats(initialTotalSeats);
            }
        };

        if (courseId) {
            fetchLiveStats();
        }
    }, [courseId, initialRegisteredCount, initialTotalSeats]);
    
    const curriculumData = [
        {
            month: "01",
            title: "Python Fundamentals",
            phaseDescription: "The absolute baseline: build high-performance logic with world-class Python patterns.",
            color: "primary",
            weeks: [
                {
                    week: "Week 01",
                    title: "Python from Scratch",
                    description: "Variables, Datatypes and Basic Logic."
                },
                {
                    week: "Week 02", 
                    title: "Loops & Functions",
                    description: "Automating repetitive tasks with ease."
                },
                {
                    week: "Week 03",
                    title: "Files & Libraries", 
                    description: "Handling external data and open-source tools."
                },
                {
                    week: "Week 04",
                    title: "Python Like a Pro",
                    description: "Writing clean, production-level code.",
                    isSpecial: true
                }
            ]
        },
        {
            month: "02",
            title: "APIs, AI & ML",
            phaseDescription: "From static code to intelligent systems: Integrating LLMs and predictive models.",
            color: "secondary",
            weeks: [
                {
                    week: "Week 05",
                    title: "ChatGPT & OpenAI API",
                    description: "Integrating LLMs into your own projects."
                },
                {
                    week: "Week 06",
                    title: "APIs & Live Data",
                    description: "Connecting your apps to the real world."
                },
                {
                    week: "Week 07",
                    title: "Intro to Machine Learning",
                    description: "Teaching computers to recognize patterns."
                },
                {
                    week: "Week 08",
                    title: "Classification",
                    description: "Building models that predict and group data.",
                    isSpecial: true
                }
            ]
        },
        {
            month: "03", 
            title: "Vision, Web & Demo",
            phaseDescription: "The Grand Finale: Give your AI 'eyes' and deploy your masterpiece to the internet.",
            color: "primary",
            weeks: [
                {
                    week: "Week 09",
                    title: "OpenCV & Vision",
                    description: "Developing apps that can see and perceive."
                },
                {
                    week: "Week 10",
                    title: "Flask Web Framework",
                    description: "Turning scripts into web apps that anyone can use."
                },
                {
                    week: "Final Milestone",
                    title: "Final Project & Demo Day", 
                    description: "Intensive building followed by a live global presentation of your Face Recognition system.",
                    isSpecial: true
                }
            ]
        }
    ];

    const stats = [
        { number: "12", label: "Weeks Total" },
        { number: "36", label: "Live Classes" },
        { number: "8+", label: "Mini Projects" },
        { number: "1", label: "Project" },
        { number: "3", label: "Classes / Week" }
    ];


    const handleSecureSpot = async () => {
        setIsSecuring(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/course/1?openRegistration=true&source=curriculum');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Navigation failed:', error);
        } finally {
            setIsSecuring(false);
        }
    };

    const handleRegistrationComplete = () => {
        setRegisteredCount(prev => Math.min(prev + 1, totalSeats));
    };

    React.useEffect(() => {
        const handleRegistrationEvent = () => {
            handleRegistrationComplete();
        };
        window.addEventListener('registrationComplete', handleRegistrationEvent);
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registrationSuccess') === 'true') {
            handleRegistrationComplete();
            window.history.replaceState({}, '', window.location.pathname);
        }

        return () => {
            window.removeEventListener('registrationComplete', handleRegistrationEvent);
        };
    }, []);

    const handleReserveAdmission = async () => {
        setIsEnrolling(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate('/course/1?openRegistration=true&source=enrollment');
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleWeekClick = (monthIndex, weekIndex) => {
        setHoveredWeek(`${monthIndex}-${weekIndex}`);
    };

    const handleMonthClick = (monthIndex) => {
        setSelectedMonth(selectedMonth === monthIndex ? null : monthIndex);
    };

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        return (
            <div className="pt-4 pb-0 px-0">
                <div className="text-center mb-10 px-2 w-full">
                    <div className="relative inline-block w-full">
                        <p className="text-[10.5px] text-on-surface-variant font-bold leading-relaxed italic relative z-10 px-1 whitespace-nowrap">
                            "Will your child build the AI future, or just watch it?"
                        </p>
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            whileInView={{ width: '108%', opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="absolute bottom-[-3px] -left-[4%] h-[18px] bg-blue-500/15 -z-0 -rotate-1 -skew-x-12"
                            style={{ clipPath: 'polygon(0% 15%, 98% 10%, 100% 85%, 2% 95%)' }}
                        />
                    </div>
                </div>
                
                <div className="mb-12 w-full">
                    <div className="flex items-center justify-center gap-6 mb-6 w-full px-4">
                        <div className="w-3 h-3 border-t-2 border-l-2 border-blue-500/40 -mt-2" />
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white whitespace-nowrap">
                            The <span className="text-blue-500">90-Day</span> Roadmap
                        </h3>
                        <div className="w-3 h-3 border-t-2 border-r-2 border-blue-500/40 -mt-2" />
                    </div>
                    <div className="space-y-6 border-l-2 border-slate-800 ml-4 pl-6 relative">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-3">
                                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Month 01</span>
                                <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-1">Python Fundamentals</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 01</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Python from Scratch</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 02</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Loops &amp; Functions</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 03</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Files &amp; Libraries</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 04</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Python Like a Pro</h5>
                                </div>
                            </div>
                        </motion.div>

                        <div className="my-2 -ml-[33px] flex items-center gap-3">
                            <div className="w-[17px] h-[17px] rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center relative z-20">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                            </div>
                            <div className="h-px w-6 bg-gradient-to-r from-slate-800 to-transparent" />
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-3">
                                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Month 02</span>
                                <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-1">APIs, AI &amp; ML</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 05</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">ChatGPT &amp; OpenAI API</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 06</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">APIs &amp; Live Data</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 07</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Intro to Machine Learning</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 08</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Classification</h5>
                                </div>
                            </div>
                        </motion.div>

                        <div className="my-2 -ml-[33px] flex items-center gap-3">
                            <div className="w-[17px] h-[17px] rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center relative z-20">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                            </div>
                            <div className="h-px w-6 bg-gradient-to-r from-slate-800 to-transparent" />
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                            className="relative"
                        >
                            <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-3">
                                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Month 03</span>
                                <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-1">Vision, Web &amp; Demo</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 09</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">OpenCV &amp; Vision</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-slate-400">Week 10</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Flask Web Framework</h5>
                                </div>
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="p-3 rounded-xl border bg-blue-600 border-blue-500 text-white col-span-2 shadow-lg shadow-blue-600/20"
                                >
                                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1 block text-white/80">Final Milestone</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight mb-1">Final Project &amp; Demo Day</h5>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tapered Luminating Divider - Top Version */}
                <div className="py-4 my-2 flex justify-center relative">
                    <div className="w-[60%] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent relative z-10">
                        <div className="absolute inset-0 bg-blue-400 blur-[6px] opacity-30" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_10px_#3b82f6]" />
                    </div>
                </div>

                {/* Card 1: Urgency & Program Details */}
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 p-5 rounded-[2rem] text-center mb-6 overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold uppercase tracking-tighter mb-4 leading-tight text-white">
                            Ready to build your child's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI future?</span>
                        </h3>
                        <p className="text-slate-400 text-[11px] font-medium mb-6 leading-relaxed">
                            Strictly limited seats per batch to ensure personalized 1-on-1 mentorship sessions.
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2 w-full">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Upcoming Batch</span>
                                <span className="text-[11px] font-bold uppercase text-white">1st May</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Last Week Enrolled</span>
                                    <span className="text-[11px] font-bold uppercase text-blue-400">
                                        {registeredCount}+
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col items-center">
                                    <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                        Seats Left
                                    </span>
                                    <span className="text-[11px] font-bold uppercase text-red-500">
                                        {totalSeats - registeredCount} / {totalSeats}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Tapered Luminating Divider - Small Version */}
                <div className="py-4 my-2 flex justify-center relative">
                    <div className="w-[60%] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent relative z-10">
                        <div className="absolute inset-0 bg-blue-400 blur-[6px] opacity-30" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_10px_#3b82f6]" />
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 p-5 rounded-[2rem] text-center mb-0 overflow-hidden shadow-2xl"
                >
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="w-full p-5 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 flex flex-col items-center justify-center mb-6">
                            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Program Contribution</span>
                            <div className="flex items-center justify-center gap-3">
                                {originalPrice > 0 && <span className="text-sm font-semibold text-slate-600 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>}
                                <span className="text-3xl font-extrabold text-white tracking-tighter">₹{price.toLocaleString('en-IN')}</span>
                            </div>
                            {discount > 0 && (
                                <div className="mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                    <span className="text-blue-400 text-[9px] font-bold uppercase tracking-widest">{discount}% Launch Offer</span>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleReserveAdmission}
                            disabled={isEnrolling}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-2xl shadow-blue-500/20 active:scale-[0.97] transition-all disabled:opacity-70 group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isEnrolling ? 'Processing...' : (
                                    <>
                                        Reserve Admission <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </motion.div>

            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
                <div className="relative inline-block mx-auto text-center">
                    <p className="max-w-4xl mx-auto text-base text-on-surface-variant font-light leading-relaxed italic relative z-10 px-6 whitespace-nowrap">
                        "Will your child build the AI future, or just watch it?"
                    </p>
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: '108%', opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        className="absolute bottom-[-5px] -left-[4%] h-[26px] bg-blue-500/15 -z-0 -rotate-1 -skew-x-12"
                        style={{ clipPath: 'polygon(1% 20%, 99% 12%, 100% 82%, 2% 90%)' }}
                    />
                </div>
            </div>

            {/* Premium Stats Command Center */}
            <div className="py-12 px-6 bg-surface-container-low relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            {/* Orbital Glow (Hover Only) */}
                            <div className="absolute inset-0 bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            
                            <div className="h-full bg-white/[0.04] backdrop-blur-3xl border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 hover:border-blue-500/30 hover:-translate-y-2 group relative overflow-hidden shadow-2xl">
                                {/* Digital Top Tracer */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                                
                                <span className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-3 group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-500">
                                    {stat.number}
                                </span>
                                
                                <span className="text-[10px] md:text-[11px] font-ubuntu font-bold tracking-[0.3em] text-on-surface-variant uppercase text-center opacity-60 group-hover:opacity-100 group-hover:text-blue-400 transition-all duration-500">
                                    {stat.label}
                                </span>

                                {/* Bottom Interactive Tracer */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-700 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 px-6 lg:px-12 py-6 bg-surface-container-lowest relative">
                <div className="flex-1 w-full">
                    <div className="max-w-3xl relative mx-auto lg:ml-0 lg:mr-auto">
                        <div className="text-left mb-4">
                            <div className="flex items-center gap-4 mb-1">
                                <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface whitespace-nowrap">
                                    The <span className="text-blue-500">90-Day</span> Roadmap
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent max-w-[100px]" />
                            </div>
                            <p className="text-on-surface-variant text-sm">
                                From code basics to shipping production-ready AI models.
                            </p>
                        </div>

                        {curriculumData.map((month, monthIndex) => (
                            <div
                                key={monthIndex}
                                className={`mb-6 relative ${monthIndex === 2 ? 'mb-0' : ''}`}
                            >
                                <motion.div 
                                    layout
                                    className={`flex items-center gap-8 cursor-pointer transition-all duration-700 rounded-[2rem] group mb-4 relative overflow-hidden
                                        ${selectedMonth === monthIndex 
                                            ? 'p-3 bg-white/[0.03] border border-white/10 shadow-2xl' 
                                            : 'p-6 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02] backdrop-blur-3xl border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.06] shadow-xl'}`}
                                    onClick={() => handleMonthClick(monthIndex)}
                                >
                                    {/* Phase Tracer Line (Left Edge) */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-700
                                        ${selectedMonth === monthIndex ? 'bg-blue-500' : 'bg-white/5 group-hover:bg-blue-500/40'}`} />

                                    {/* Tech Number Box */}
                                    <motion.div 
                                        layout
                                        className={`rounded-2xl flex items-center justify-center border-2 transition-all duration-700 relative px-3 py-2
                                            ${month.color === 'primary'
                                                ? 'bg-blue-500/5 border-blue-500/20 group-hover:border-blue-500/40'
                                                : 'bg-indigo-500/5 border-indigo-500/20 group-hover:border-indigo-500/40'}`}
                                    >
                                        <motion.span 
                                            layout
                                            className={`font-headline font-black transition-all duration-700 whitespace-nowrap
                                                ${selectedMonth === monthIndex ? 'text-xs' : 'text-sm'}
                                                ${month.color === 'primary' ? 'text-blue-400' : 'text-indigo-400'}`}
                                        >
                                            Month {month.month}
                                        </motion.span>
                                        
                                        {/* Decorative Corner Notch (Hover Only) */}
                                        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                    
                                    <motion.div layout className="flex-1 text-left">
                                        <div className="flex flex-col">
                                            <motion.h3 
                                                layout
                                                className={`font-headline font-black text-on-surface transition-all duration-700
                                                    ${selectedMonth === monthIndex ? 'text-xl' : 'text-3xl tracking-tight'}`}
                                            >
                                                {month.title}
                                            </motion.h3>
                                            
                                            {selectedMonth !== monthIndex && (
                                                <motion.p 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-on-surface-variant text-sm mt-1 font-medium opacity-80"
                                                >
                                                    {month.phaseDescription}
                                                </motion.p>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Action Icon: Sophisticated Bracket-style Arrow */}
                                    <motion.div 
                                        animate={{ rotate: selectedMonth === monthIndex ? 180 : 0, scale: selectedMonth === monthIndex ? 0.9 : 1.2 }}
                                        transition={{ duration: 0.5, ease: "anticipate" }}
                                        className={`p-4 rounded-full border transition-colors duration-500
                                            ${selectedMonth === monthIndex ? 'border-blue-500/40 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </motion.div>
                                </motion.div>

                                <AnimatePresence>
                                    {selectedMonth === monthIndex && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`ml-5 pl-9 border-l-2 relative ${
                                                monthIndex === 2 ? 'border-dashed' : ''
                                            } border-surface-container-highest pb-6`}>
                                                {month.weeks.map((week, weekIndex) => (
                                                    <div 
                                                        key={weekIndex} 
                                                        className={`mb-3 relative group ${weekIndex === month.weeks.length - 1 ? 'mb-0' : ''}`}
                                                    >
                                                        <div 
                                                            className={`absolute -left-[48px] top-1 w-3 h-3 rounded-full border-3 cursor-pointer hover:scale-125 transition-transform ${
                                                                week.isSpecial
                                                                    ? 'bg-primary border-surface shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                                                                    : 'bg-surface-container-highest border-surface'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleWeekClick(monthIndex, weekIndex);
                                                            }}
                                                            onMouseEnter={() => setHoveredWeek(`${monthIndex}-${weekIndex}`)}
                                                            onMouseLeave={() => setHoveredWeek(null)}
                                                        />

                                                        <div 
                                                            className={`p-2.5 rounded-lg border transition-all cursor-pointer bg-surface-container-high border-outline-variant/20 ${
                                                                week.isSpecial
                                                                    ? 'bg-gradient-to-br from-primary via-primary-container to-secondary'
                                                                    : ''
                                                            } ${
                                                                hoveredWeek === `${monthIndex}-${weekIndex}` 
                                                                    ? 'scale-105 shadow-xl border-primary/50' 
                                                                    : 'hover:scale-[1.02] hover:shadow-xl hover:border-primary/50'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleWeekClick(monthIndex, weekIndex);
                                                            }}
                                                            onMouseEnter={() => setHoveredWeek(`${monthIndex}-${weekIndex}`)}
                                                            onMouseLeave={() => setHoveredWeek(null)}
                                                        >
                                                            <span 
                                                                className={`text-[10px] font-bold mb-0.5 block uppercase tracking-widest ${
                                                                    month.color === 'primary' ? 'text-primary' : 'text-secondary'
                                                                }`}
                                                            >
                                                                {week.week}
                                                            </span>
                                                            <h4 className="text-sm font-bold mb-0.5 text-on-surface">
                                                                {week.title}
                                                            </h4>
                                                            <p className="text-on-surface-variant text-xs">
                                                                {week.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-96 lg:sticky lg:top-auto lg:bottom-12 lg:ml-8 perspective-1000">
                    <motion.div 
                        whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden group"
                    >
                        {/* 3D Bevel/Reflective Edge */}
                        <div className="absolute inset-0 rounded-[3rem] border-t border-l border-white/20 pointer-events-none z-10" />
                        <div className="absolute inset-0 rounded-[3rem] border-b border-r border-black/40 pointer-events-none z-10" />

                        {/* Ambient Corner Glows */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                        <h2 className="text-3xl md:text-4xl font-headline font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 text-center">
                            Ready to build your child's AI future?
                        </h2>
                        
                        <p className="text-base text-on-surface-variant/80 mb-8 text-center font-medium leading-relaxed">
                            Enroll today — limited seats per cohort to ensure personalized mentorship.
                        </p>

                        <div className="flex flex-col gap-8">
                            {/* Technical Data Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl relative overflow-hidden group/item">
                                    <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mb-1 opacity-70">
                                        Cohort Starts
                                    </p>
                                    <p className="text-lg font-bold text-white">1st May 2026</p>
                                    <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 w-0 group-hover/item:w-full transition-all duration-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl relative overflow-hidden group/item">
                                        <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mb-1 opacity-70">
                                            Student Enrolled Last Week
                                        </p>
                                        <p className="text-lg font-bold text-blue-400">
                                            {String(registeredCount).padStart(2, '0')}+
                                        </p>
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 w-0 group-hover/item:w-full transition-all duration-500" />
                                    </div>
                                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl relative overflow-hidden group/item">
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] mb-1 opacity-70">
                                            Seats Left
                                        </p>
                                        <p className="text-lg font-bold text-red-500">
                                            {String(totalSeats - registeredCount).padStart(2, '0')} / {totalSeats}
                                        </p>
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 w-0 group-hover/item:w-full transition-all duration-500" />
                                    </div>
                                </div>
                            </div>

                            {/* 3D Pricing Plate */}
                            <div className="relative bg-black/40 border border-white/10 rounded-[2rem] p-6 shadow-inner overflow-hidden group/pricing">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1">Investment</p>
                                        <div className="flex items-end gap-2">
                                            {originalPrice > 0 && <span className="text-sm text-white/30 line-through font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>}
                                            <span className="text-3xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200">
                                                ₹{price.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                    {discount > 0 && (
                                        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                            {discount}% OFF
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tactile 3D Button */}
                            <div className="relative group/btn">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-25 group-hover/btn:opacity-60 transition duration-1000 group-hover:duration-200" />
                                <button 
                                    onClick={handleReserveAdmission}
                                    disabled={isEnrolling}
                                    className="relative w-full bg-slate-950 text-white py-6 rounded-2xl font-headline font-black text-xl border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {isEnrolling ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <span>Reserve Admission</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover/btn:translate-x-1 transition-transform">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>

                            <p className="text-[10px] text-white/40 text-center font-medium tracking-wide">
                                SECURE ENCRYPTION • IMMEDIATE ACCESS • 100% SUCCESS RATE
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CourseCurriculum;
