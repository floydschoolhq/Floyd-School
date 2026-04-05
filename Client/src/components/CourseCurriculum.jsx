import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCurriculum = ({ variant = "light" }) => {
    const navigate = useNavigate();
    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isSecuring, setIsSecuring] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [registeredCount, setRegisteredCount] = useState(7);
    const totalSeats = 20;
    
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
                    <div className="space-y-4 border-l border-white/10 ml-4 pl-5 relative">
                        <div className="relative">
                            <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-2">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-0.5">Phase 01</span>
                                <h4 className="text-base font-black uppercase tracking-tight text-white">Python Fundamentals</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weeks 1-4: The Foundation of everything</p>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 01</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Python from Scratch</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Environment setup, variables, and the logic of computation.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 02</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Loops &amp; Functions</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Mastering control flow and modular code architecture.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 03</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Files &amp; Libraries</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Working with external data and the powerful Python ecosystem.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 04</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Python Like a Pro</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Advanced patterns, debugging, and building clean projects.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-2">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-0.5">Phase 02</span>
                                <h4 className="text-base font-black uppercase tracking-tight text-white">APIs, AI &amp; ML</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weeks 5-8: Real-world intelligence</p>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 05</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">ChatGPT &amp; OpenAI API</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Integrating LLMs into your own custom applications.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 06</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">APIs &amp; Live Data</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Fetching and processing real-time web information.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 07</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Intro to Machine Learning</h5>
                                    <p className="text-[11px] font-medium text-slate-400">How machines learn: Regression, patterns, and data math.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 08</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Classification</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Teaching computers to categorize and decide.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 z-10"></div>
                            <div className="mb-2">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-0.5">Phase 03</span>
                                <h4 className="text-base font-black uppercase tracking-tight text-white">Vision, Web &amp; Demo</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weeks 9-12: The final masterpiece</p>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 09</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">OpenCV &amp; Computer Vision</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Giving eyes to your code using visual recognition libraries.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-white/5 border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-blue-500">Week 10</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Flask Web Framework</h5>
                                    <p className="text-[11px] font-medium text-slate-400">Turning scripts into web apps that anyone can use.</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-blue-600 border-blue-500 text-white">
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 block text-white/70">Final Milestone</span>
                                    <h5 className="text-sm font-black uppercase tracking-tight mb-0.5">Capstone &amp; Demo Day</h5>
                                    <p className="text-[11px] font-medium text-white/80">Intensive building followed by a live global presentation of your Face Recognition system.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center mb-10">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-3">Ready to build your child's AI future?</h3>
                    <p className="text-slate-400 text-xs font-medium mb-5 leading-relaxed">Limited seats per cohort to ensure personalized mentorship.</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3 rounded-xl bg-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Starts</span>
                            <span className="text-xs font-black uppercase">15th April</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Seats Left</span>
                            <span className="text-xs font-black uppercase text-orange-500">{totalSeats - registeredCount} / {totalSeats}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleReserveAdmission}
                        disabled={isEnrolling}
                        className="w-full bg-white text-black py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[0.98] active:scale-[0.98] transition-transform"
                    >
                        {isEnrolling ? 'Processing...' : 'Reserve Admission Now'}
                    </button>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-70">Major Milestone</h3>
                    <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-6">Face Recognition Attendance System</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base shadow-inner">👤</div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Face Recognition Engine</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base shadow-inner">📋</div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Live Attendance Logger</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base shadow-inner">🖥️</div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Flask Web Dashboard</span>
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
