import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CourseCurriculum = ({ variant = "light" }) => {
    const navigate = useNavigate();
    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isSecuring, setIsSecuring] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [registeredCount, setRegisteredCount] = useState(20);
    const totalSeats = 50;
    
    const curriculumData = [
        {
            month: "01",
            title: "Python Fundamentals",
            subtitle: "Weeks 1-4: The Foundation of everything",
            color: "primary",
            weeks: [
                {
                    week: "Week 01",
                    title: "Python from Scratch",
                    description: "Environment setup, variables, and the logic of computation."
                },
                {
                    week: "Week 02", 
                    title: "Loops & Functions",
                    description: "Mastering control flow and modular code architecture."
                },
                {
                    week: "Week 03",
                    title: "Files & Libraries", 
                    description: "Working with external data and the powerful Python ecosystem."
                },
                {
                    week: "Week 04",
                    title: "Python Like a Pro",
                    description: "Advanced patterns, debugging, and building clean projects."
                }
            ]
        },
        {
            month: "02",
            title: "APIs, AI & ML",
            subtitle: "Weeks 5-8: Real-world intelligence",
            color: "secondary",
            weeks: [
                {
                    week: "Week 05",
                    title: "ChatGPT & OpenAI API",
                    description: "Integrating LLMs into your own custom applications."
                },
                {
                    week: "Week 06",
                    title: "APIs & Live Data",
                    description: "Fetching and processing real-time web information."
                },
                {
                    week: "Week 07",
                    title: "Intro to Machine Learning",
                    description: "How machines learn: Regression, patterns, and data math."
                },
                {
                    week: "Week 08",
                    title: "Classification",
                    description: "Teaching computers to categorize and decide."
                }
            ]
        },
        {
            month: "03", 
            title: "Vision, Web & Demo",
            subtitle: "Weeks 9-12: The final masterpiece",
            color: "primary",
            weeks: [
                {
                    week: "Week 09",
                    title: "OpenCV & Computer Vision",
                    description: "Giving eyes to your code using visual recognition libraries."
                },
                {
                    week: "Week 10",
                    title: "Flask Web Framework",
                    description: "Turning scripts into web apps that anyone can use."
                },
                {
                    week: "Final Milestone",
                    title: "Capstone & Demo Day", 
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

    const capstoneFeatures = [
        {
            icon: "psychology",
            title: "Face Recognition Engine"
        },
        {
            icon: "terminal",
            title: "Live Attendance Logger"
        },
        {
            icon: "dashboard",
            title: "Flask Web Dashboard"
        }
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
            <div className="py-16 px-6">
                <div className="text-center mb-10">
                    <p className="text-sm text-on-surface-variant mb-8 font-medium leading-relaxed">
                        "The question isn't whether AI will shape your child's future. It's whether they'll build it — or just watch."
                    </p>
                    <button 
                        onClick={handleSecureSpot}
                        disabled={isSecuring}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[0.98] active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                        {isSecuring ? 'Processing...' : 'Secure Your Spot'}
                    </button>
                </div>
                
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">The 90-Day Roadmap</h3>
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
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Phase 01</span>
                                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">Python Fundamentals</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weeks 1-4</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 01</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Python from Scratch</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 02</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Loops &amp; Functions</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 03</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Files &amp; Libraries</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 04</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Python Like a Pro</h5>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-3">
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Phase 02</span>
                                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">APIs, AI &amp; ML</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weeks 5-8</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 05</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">ChatGPT &amp; OpenAI API</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 06</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">APIs &amp; Live Data</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 07</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Intro to Machine Learning</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 08</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Classification</h5>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                            className="relative"
                        >
                            <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-3">
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Phase 03</span>
                                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">Vision, Web &amp; Demo</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weeks 9-12</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 09</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">OpenCV &amp; Vision</h5>
                                </div>
                                <div className="p-3 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-blue-400">Week 10</span>
                                    <h5 className="text-xs font-bold uppercase tracking-tight text-white/90">Flask Web Framework</h5>
                                </div>
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="p-3 rounded-xl border bg-blue-600 border-blue-500 text-white col-span-2 shadow-lg shadow-blue-600/20"
                                >
                                    <span className="text-[8px] font-black uppercase tracking-widest mb-1 block text-white/80">Final Milestone</span>
                                    <h5 className="text-xs font-black uppercase tracking-tight mb-1">Capstone &amp; Demo Day</h5>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/20 p-6 rounded-[2rem] text-center mb-10 overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-none text-white drop-shadow-md">
                            Ready to build your child's AI future?
                        </h3>
                        <p className="text-white/70 text-xs font-semibold mb-6 leading-relaxed">
                            Strictly limited seats per batch to ensure 1-on-1 personalized mentorship.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Upcoming Batch</span>
                                <span className="text-sm font-black uppercase text-white">15th April</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-orange-500/10 animate-pulse"></div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1 relative z-10 flex items-center justify-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                    Seats Left
                                </span>
                                <span className="text-sm font-black uppercase text-orange-400 relative z-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                                    {totalSeats - registeredCount} / {totalSeats}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1 relative z-10">Course Fee</span>
                            <div className="flex items-center justify-center gap-3 mb-1.5 relative z-10">
                                <span className="text-lg font-bold text-slate-400 line-through decoration-slate-500/50">₹2,999</span>
                                <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">₹1,999</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full relative z-10">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                                33% OFF
                            </span>
                        </div>

                        <button 
                            onClick={handleReserveAdmission}
                            disabled={isEnrolling}
                            className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-[0.15em] hover:scale-[0.98] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isEnrolling ? 'Processing...' : 'Reserve Admission Now'}
                            {!isEnrolling && <span className="text-lg leading-none">&rarr;</span>}
                        </button>
                    </div>
                </motion.div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white">
                    <h2 className="text-xl font-bold uppercase tracking-tighter leading-tight mb-5">Face Recognition Attendance System</h2>
                    
                    <div className="relative mb-6">
                        <div className="aspect-video bg-black/20 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                style={{ pointerEvents: 'none' }}
                                src="https://www.youtube.com/embed/BREYIm9ctQU?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=BREYIm9ctQU&disablekb=1&fs=0" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base shadow-inner">👤</div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">Face Recognition Engine</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base shadow-inner">📋</div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">Live Attendance Logger</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base shadow-inner">🖥️</div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">Flask Web Dashboard</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-6 px-4 sm:px-6 lg:px-8">
                <p className="max-w-2xl mx-auto text-lg text-on-surface-variant mb-6 font-light leading-relaxed">
                    "The question isn't whether AI will shape your child's future. It's whether they'll build it — or just watch."
                </p>
                <button 
                    onClick={handleSecureSpot}
                    disabled={isSecuring}
                    className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-headline font-extrabold text-base shadow-lg shadow-[0_20px_40px_rgba(0,229,255,0.25)] hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSecuring ? 'Processing...' : 'Secure Your Spot'}
                </button>
            </div>

            <div className="py-8 px-6 bg-surface-container-low">
                <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center group cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => console.log(`Stat clicked: ${stat.label}`)}
                        >
                            <div className="text-2xl font-headline font-black text-primary mb-1 group-hover:text-cyan-400 transition-colors">
                                {stat.number}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-6 py-6 bg-surface-container-lowest relative">
                <div className="flex-1">
                    <div className="max-w-3xl relative" style={{marginLeft: '8%', marginRight: 'auto'}}>
                        <div className="text-left mb-4">
                            <h2 className="text-3xl font-headline font-extrabold tracking-tight mb-1 text-on-surface">
                                The 90-Day Roadmap
                            </h2>
                            <p className="text-on-surface-variant text-sm">
                                From code basics to shipping production-ready AI models.
                            </p>
                        </div>

                        {curriculumData.map((month, monthIndex) => (
                            <div
                                key={monthIndex}
                                className={`mb-4 relative ${monthIndex === 2 ? 'mb-0' : ''}`}
                            >
                                <div 
                                    className="flex items-center gap-3 mb-3 cursor-pointer hover:translate-x-2 transition-transform"
                                    onClick={() => handleMonthClick(monthIndex)}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border hover:scale-110 transition-transform ${
                                        month.color === 'primary'
                                            ? 'bg-primary-container/20 border-primary/30'
                                            : 'bg-secondary-container/20 border-secondary/30'
                                    }`}
                                    >
                                        <span className={`font-headline font-black text-lg ${
                                            month.color === 'primary' ? 'text-primary' : 'text-secondary'
                                        }`}>
                                            {month.month}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-headline font-bold text-on-surface">
                                            {month.title}
                                        </h3>
                                        <p className="text-on-surface-variant text-xs">
                                            {month.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className={`ml-5 pl-9 border-l-2 relative ${
                                    monthIndex === 2 ? 'border-dashed' : ''
                                } border-surface-container-highest`}>
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
                                                onClick={() => handleWeekClick(monthIndex, weekIndex)}
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
                                                        : 'hover:scale-105 hover:shadow-xl hover:border-primary/50'
                                                }`}
                                                onClick={() => handleWeekClick(monthIndex, weekIndex)}
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
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-96 lg:sticky lg:top-auto lg:bottom-6 lg:self-end lg:ml-8">
                    <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-primary/20 shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight mb-6 text-on-surface text-center">
                            Ready to build your child's AI future?
                        </h2>
                        <p className="text-lg text-on-surface-variant mb-8 text-center">
                            Enroll today — limited seats per cohort to ensure personalized mentorship.
                        </p>
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center text-left">
                                <div>
                                    <p className="text-sm text-secondary font-bold uppercase tracking-widest">
                                        Next Cohort Starts
                                    </p>
                                    <p className="text-lg font-bold text-on-surface">
                                        15th April 2026
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-secondary font-bold uppercase tracking-widest">
                                        Seats Left
                                    </p>
                                    <p className="text-lg font-bold text-secondary">
                                        {String(totalSeats - registeredCount).padStart(2, '0')} / {totalSeats}
                                    </p>
                                </div>
                            </div>

                            {/* Price Display */}
                            <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-2xl px-5 py-4">
                                <div>
                                    <p className="text-xs text-secondary font-bold uppercase tracking-widest mb-1">Course Fee</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-sm text-on-surface-variant line-through font-medium">₹2,999</span>
                                        <span className="text-2xl font-headline font-black text-primary">₹1,999</span>
                                    </div>
                                </div>
                                <div className="bg-primary/20 border border-primary/40 text-primary text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    33% OFF
                                </div>
                            </div>

                            <button 
                                onClick={handleReserveAdmission}
                                disabled={isEnrolling}
                                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-xl font-headline font-black text-xl shadow-xl shadow-[0_25px_50px_rgba(0,229,255,0.3)] hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isEnrolling ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Reserve Admission Now'
                                    )}
                                </div>
                            </button>
                            <p className="text-xs text-on-surface-variant text-center">
                                Secure payment. Immediate curriculum access upon enrollment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto bg-surface-container p-6 md:p-10 rounded-2xl border border-outline-variant/20 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[60px] pointer-events-none" />
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight mb-3 text-on-surface">
                                Face Recognition Attendance System
                            </h2>
                            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                                Build a live system that opens the webcam, recognises student faces in real time, logs attendance automatically with timestamps and displays everything on a web dashboard. Every part of it written and built by you.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mt-0.5 text-sm">
                                        👤
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-on-surface block">Face Recognition Engine</span>
                                        <span className="text-xs text-on-surface-variant">Detects and identifies faces live using OpenCV and Dlib.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mt-0.5 text-sm">
                                        📋
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-on-surface block">Live Attendance Logger</span>
                                        <span className="text-xs text-on-surface-variant">Automatically records name and timestamp the moment a face is recognised.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mt-0.5 text-sm">
                                        🖥️
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-on-surface block">Flask Web Dashboard</span>
                                        <span className="text-xs text-on-surface-variant">View and manage all attendance records from a clean browser interface.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-video bg-surface-container-highest rounded-xl border-2 border-outline-variant/30 overflow-hidden shadow-xl">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    style={{ pointerEvents: 'none' }}
                                    src="https://www.youtube.com/embed/BREYIm9ctQU?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=BREYIm9ctQU&disablekb=1&fs=0" 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseCurriculum;
