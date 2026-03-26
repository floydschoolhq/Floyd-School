import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CourseCurriculum = ({ variant = "light" }) => {
    const navigate = useNavigate();
    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isSecuring, setIsSecuring] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [registeredCount, setRegisteredCount] = useState(7); // Initial registered students
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
        { number: "1", label: "Capstone" },
        { number: "3", label: "Classes / Week" }
    ];

    
    const capstoneFeatures = [
        {
            icon: "face",
            title: "Face Recognition Engine (OpenCV/Dlib)"
        },
        {
            icon: "database",
            title: "Live Attendance Logger (CSV/JSON)"
        },
        {
            icon: "dashboard",
            title: "Flask Web Dashboard for Admins"
        },
        {
            icon: "verified",
            title: "Official ThinkSkool Certificate"
        }
    ];

    // Handler functions
    const handleSecureSpot = async () => {
        setIsSecuring(true);
        try {
            // Simulate brief processing for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Navigate to course registration with enrollment modal
            // Add query parameter to open registration form
            navigate('/course/1?openRegistration=true&source=curriculum');
            
            // Scroll to top of page for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Navigation failed:', error);
            // Could add toast notification here
        } finally {
            setIsSecuring(false);
        }
    };

    const handleRegistrationComplete = () => {
        // Increment registered count when someone successfully registers
        setRegisteredCount(prev => Math.min(prev + 1, totalSeats));
    };

    // Listen for registration completion from URL params or custom event
    React.useEffect(() => {
        const handleRegistrationEvent = () => {
            handleRegistrationComplete();
        };

        // Add event listener for registration completion
        window.addEventListener('registrationComplete', handleRegistrationEvent);
        
        // Check if returning from registration with success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registrationSuccess') === 'true') {
            handleRegistrationComplete();
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);
        }

        return () => {
            window.removeEventListener('registrationComplete', handleRegistrationEvent);
        };
    }, []);

    const handleReserveAdmission = async () => {
        setIsEnrolling(true);
        try {
            // Simulate API call to reserve spot
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success and redirect to registration
            navigate('/course/1?openRegistration=true&source=enrollment');
        } catch (error) {
            console.error('Enrollment failed:', error);
            // Could add toast notification here
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleWeekClick = (monthIndex, weekIndex) => {
        setHoveredWeek(`${monthIndex}-${weekIndex}`);
        // Could expand to show more details or navigate to week details
    };

    
    const handleMonthClick = (monthIndex) => {
        setSelectedMonth(selectedMonth === monthIndex ? null : monthIndex);
    };

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        return (
            <div className="py-20 px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tighter mb-6 leading-tight text-on-surface">
                        Foundation of
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
                            AI and Machine Learning
                        </span>
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-10 font-medium leading-relaxed">
                        "The question isn't whether AI will shape your child's future. It's whether they'll build it — or just watch."
                    </p>
                    <button 
                        onClick={handleSecureSpot}
                        disabled={isSecuring}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                    >
                        {isSecuring ? 'Processing...' : 'Secure Your Spot'}
                    </button>
                </div>

                {/* RoadMap - Simplified for Mobile */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <span className="material-symbols-outlined">map</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">The 90-Day Roadmap</h3>
                    </div>

                    <div className="space-y-10 border-l border-white/10 ml-4 pl-8 relative">
                        {curriculumData.map((month, mIdx) => (
                            <div key={mIdx} className="relative">
                                {/* Month Pointer */}
                                <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-slate-950 border-2 border-blue-500 z-10" />
                                
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Phase {month.month}</span>
                                    <h4 className="text-xl font-black uppercase tracking-tight text-white">{month.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{month.subtitle}</p>
                                </div>

                                <div className="space-y-4">
                                    {month.weeks.map((week, wIdx) => (
                                        <div key={wIdx} className={`p-5 rounded-2xl border ${week.isSpecial ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5'}`}>
                                            <span className={`text-[9px] font-black uppercase tracking-widest mb-1 block ${week.isSpecial ? 'text-white/70' : 'text-blue-500'}`}>{week.week}</span>
                                            <h5 className="text-sm font-black uppercase tracking-tight mb-2">{week.title}</h5>
                                            <p className={`text-[11px] font-medium leading-relaxed ${week.isSpecial ? 'text-white/80' : 'text-slate-400'}`}>{week.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admission Card */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-center mb-20 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 relative z-10">Ready to build your child's AI future?</h3>
                    <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed px-4">Limited seats per cohort to ensure personalized mentorship.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Starts</span>
                            <span className="text-xs font-black uppercase">15th April</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Seats Left</span>
                            <span className="text-xs font-black uppercase text-orange-500">{totalSeats - registeredCount} / {totalSeats}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleReserveAdmission}
                        disabled={isEnrolling}
                        className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        {isEnrolling ? 'Processing...' : 'Reserve Admission Now'}
                    </button>
                    <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">Secure payment. Immediate Access.</p>
                </div>

                {/* Capstone */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Major Milestone</h3>
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">The Capstone Project</h2>
                    <h4 className="text-lg font-bold mb-6 italic opacity-90">Face Recognition Attendance System</h4>
                    <p className="text-xs font-medium leading-relaxed mb-8 opacity-80">
                        Students don't just "learn" about AI; they deploy a professional-grade biometric system using Python, OpenCV, and Flask.
                    </p>
                    <div className="space-y-4">
                        {capstoneFeatures.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">{f.icon}</span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-tight">{f.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-6 px-4 sm:px-6 lg:px-8"
            >
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-headline font-extrabold tracking-tighter mb-8 leading-tight text-on-surface break-words">
                    Foundation of
                    <br className="block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
                        AI and Machine Learning
                    </span>
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-on-surface-variant mb-12 font-light leading-relaxed">
                    "The question isn't whether AI will shape your child's future. It's whether they'll build it — or just watch."
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button 
                        onClick={handleSecureSpot}
                        disabled={isSecuring}
                        className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 rounded-lg font-headline font-extrabold text-lg shadow-lg shadow-[0_20px_40px_rgba(0,229,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        animate={{
                            boxShadow: isSecuring ? "0 20px 40px rgba(0, 229, 255, 0.3)" : "0 25px 50px rgba(0, 229, 255, 0.4)"
                        }}
                        whileHover={{ 
                            scale: isSecuring ? 1 : 1.05, 
                            boxShadow: isSecuring ? "0 20px 40px rgba(0, 229, 255, 0.3)" : "0 35px 70px rgba(0, 229, 255, 0.6)",
                            brightness: isSecuring ? 1 : 1.1
                        }}
                        whileTap={{ scale: isSecuring ? 1 : 0.98 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 17,
                            boxShadow: { duration: 0.3 }
                        }}
                    >
                        <motion.div 
                            className="flex items-center justify-center gap-2"
                            animate={{ opacity: isSecuring ? 0.8 : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isSecuring ? (
                                <>
                                    <motion.div 
                                        className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Processing...
                                </>
                            ) : (
                                'Secure Your Spot'
                            )}
                        </motion.div>
                    </motion.button>
                    </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="py-12 px-6 bg-surface-container-low"
            >
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index} 
                            className="text-center group cursor-pointer"
                            whileHover={{ 
                                scale: 1.1,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            onClick={() => console.log(`Stat clicked: ${stat.label}`)}
                        >
                            <motion.div 
                                className="text-3xl font-headline font-black text-primary mb-1 group-hover:scale-125 transition-transform duration-300"
                                whileHover={{ 
                                    color: "#00e5ff",
                                    textShadow: "0 0 20px rgba(0, 229, 255, 0.5)"
                                }}
                            >
                                {stat.number}
                            </motion.div>
                            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors duration-300">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8 px-6 py-16 bg-surface-container-lowest relative min-h-screen">
                {/* Left Column - Curriculum Roadmap */}
                <div className="flex-1">
                    <div className="max-w-3xl relative" style={{marginLeft: '8%', marginRight: 'auto'}}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-left mb-12"
                        >
                            <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-4 text-on-surface">
                                The 90-Day Roadmap
                            </h2>
                            <p className="text-on-surface-variant">
                                From code basics to shipping production-ready AI models.
                            </p>
                        </motion.div>

                        {curriculumData.map((month, monthIndex) => (
                        <motion.div
                            key={monthIndex}
                            initial={{ opacity: 0, x: monthIndex % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: monthIndex * 0.05 }}
                            className={`mb-12 relative ${monthIndex === 2 ? 'mb-0' : ''}`}
                        >
                            {/* Month Header */}
                            <motion.div 
                                className="flex items-center gap-6 mb-8 cursor-pointer"
                                onClick={() => handleMonthClick(monthIndex)}
                                whileHover={{ x: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div 
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                                        month.color === 'primary'
                                            ? 'bg-primary-container/20 border-primary/30'
                                            : 'bg-secondary-container/20 border-secondary/30'
                                    }`}
                                    whileHover={{ 
                                        scale: 1.1,
                                        rotate: 5,
                                        boxShadow: month.color === 'primary' 
                                            ? "0 10px 30px rgba(0, 229, 255, 0.3)" 
                                            : "0 10px 30px rgba(255, 181, 156, 0.3)"
                                    }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <motion.span 
                                        className={`font-headline font-black text-2xl ${
                                            month.color === 'primary' ? 'text-primary' : 'text-secondary'
                                        }`}
                                        animate={{ 
                                            scale: selectedMonth === monthIndex ? 1.2 : 1,
                                            rotate: selectedMonth === monthIndex ? 360 : 0
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {month.month}
                                    </motion.span>
                                </motion.div>
                                <div>
                                    <motion.h3 
                                        className="text-2xl font-headline font-bold text-on-surface"
                                        whileHover={{ 
                                            color: month.color === 'primary' ? "#00e5ff" : "#ffb59c",
                                            x: 5
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {month.title}
                                    </motion.h3>
                                    <p className="text-on-surface-variant text-sm">
                                        {month.subtitle}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Week Cards */}
                            <div className={`ml-8 pl-12 border-l-2 relative ${
                                monthIndex === 2 ? 'border-dashed' : ''
                            } border-surface-container-highest`}>
                                {month.weeks.map((week, weekIndex) => (
                                    <motion.div 
                                        key={weekIndex} 
                                        className={`mb-6 relative group ${weekIndex === month.weeks.length - 1 ? 'mb-0' : ''}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: weekIndex * 0.02 }}
                                    >
                                        {/* Timeline Dot */}
                                        <motion.div 
                                            className={`absolute -left-[57px] top-1 w-4 h-4 rounded-full border-4 cursor-pointer ${
                                                week.isSpecial
                                                    ? 'bg-primary border-surface shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                                                    : 'bg-surface-container-highest border-surface'
                                            }`}
                                            whileHover={{ 
                                                scale: week.isSpecial ? 1.3 : 1.2,
                                                boxShadow: week.isSpecial 
                                                    ? "0 0 25px rgba(0, 229, 255, 0.8)" 
                                                    : "0 0 15px rgba(0, 229, 255, 0.4)"
                                            }}
                                            animate={{ 
                                                scale: hoveredWeek === `${monthIndex}-${weekIndex}` ? 1.2 : 1,
                                                backgroundColor: hoveredWeek === `${monthIndex}-${weekIndex}` 
                                                    ? (month.color === 'primary' ? '#00e5ff' : '#ffb59c') 
                                                    : ''
                                            }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                            onClick={() => handleWeekClick(monthIndex, weekIndex)}
                                            onMouseEnter={() => setHoveredWeek(`${monthIndex}-${weekIndex}`)}
                                            onMouseLeave={() => setHoveredWeek(null)}
                                        >
                                            {week.isSpecial && (
                                                <motion.span 
                                                    className="material-symbols-outlined text-sm absolute inset-0 flex items-center justify-center text-surface font-bold"
                                                    animate={{ 
                                                        rotate: hoveredWeek === `${monthIndex}-${weekIndex}` ? 360 : 0,
                                                        scale: hoveredWeek === `${monthIndex}-${weekIndex}` ? 1.2 : 1
                                                    }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    star
                                                </motion.span>
                                            )}
                                        </motion.div>

                                        {/* Week Card */}
                                        <motion.div 
                                            className={`p-2 rounded-xl border transition-all cursor-pointer bg-surface-container-high border-outline-variant/20 ${
                                                week.isSpecial
                                                    ? 'p-1 bg-gradient-to-br from-primary via-primary-container to-secondary rounded-2xl'
                                                    : ''
                                            } ${
                                                hoveredWeek === `${monthIndex}-${weekIndex}` 
                                                    ? 'scale-105 shadow-2xl border-primary/50' 
                                                    : 'hover:scale-105 hover:shadow-2xl hover:border-primary/50'
                                            }`}
                                            whileHover={{ 
                                                y: -5,
                                                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                                                transition: { type: "spring", stiffness: 300 }
                                            }}
                                            onClick={() => handleWeekClick(monthIndex, weekIndex)}
                                            onMouseEnter={() => setHoveredWeek(`${monthIndex}-${weekIndex}`)}
                                            onMouseLeave={() => setHoveredWeek(null)}
                                        >
                                            <div className={`${week.isSpecial ? 'p-8 rounded-[14px]' : ''}`}>
                                                <motion.span 
                                                    className={`text-xs font-bold mb-0.5 block uppercase tracking-widest ${
                                                        month.color === 'primary' ? 'text-primary' : 'text-secondary'
                                                    }`}
                                                    animate={{ 
                                                        opacity: hoveredWeek === `${monthIndex}-${weekIndex}` ? 1 : 0.8,
                                                        scale: hoveredWeek === `${monthIndex}-${weekIndex}` ? 1.1 : 1
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {week.week}
                                                </motion.span>
                                                <motion.h4 
                                                    className={`text-lg font-bold mb-0.5 text-on-surface ${
                                                        week.isSpecial ? 'text-2xl' : ''
                                                    }`}
                                                    animate={{ 
                                                        color: hoveredWeek === `${monthIndex}-${weekIndex}` 
                                                            ? (month.color === 'primary' ? '#00e5ff' : '#ffb59c') 
                                                            : '',
                                                        x: hoveredWeek === `${monthIndex}-${weekIndex}` ? 5 : 0
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {week.title}
                                                </motion.h4>
                                                <motion.p 
                                                    className="text-on-surface-variant text-sm"
                                                    animate={{ 
                                                        opacity: hoveredWeek === `${monthIndex}-${weekIndex}` ? 0.9 : 0.7,
                                                        y: hoveredWeek === `${monthIndex}-${weekIndex}` ? -2 : 0
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {week.description}
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                    </div>
                </div>

                {/* Right Column - Sticky CTA */}
                <div className="lg:w-96 lg:sticky lg:top-auto lg:bottom-6 lg:self-end lg:ml-8">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-surface-container-low p-8 rounded-3xl border border-primary/20 shadow-xl"
                    >
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
                            <motion.button 
                                onClick={handleReserveAdmission}
                                disabled={isEnrolling}
                                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-xl font-headline font-black text-xl shadow-xl shadow-[0_25px_50px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                animate={{
                                    boxShadow: isEnrolling ? "0 20px 40px rgba(0, 229, 255, 0.3)" : "0 25px 50px rgba(0, 229, 255, 0.4)"
                                }}
                                whileHover={{ 
                                    scale: isEnrolling ? 1 : 1.05, 
                                    boxShadow: isEnrolling ? "0 20px 40px rgba(0, 229, 255, 0.3)" : "0 35px 70px rgba(0, 229, 255, 0.6)",
                                    brightness: isEnrolling ? 1 : 1.1
                                }}
                                whileTap={{ scale: isEnrolling ? 1 : 0.98 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 17,
                                    boxShadow: { duration: 0.3 }
                                }}
                            >
                                <motion.div 
                                    className="flex items-center justify-center gap-2"
                                    animate={{ opacity: isEnrolling ? 0.8 : 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isEnrolling ? (
                                        <>
                                            <motion.div 
                                                className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        'Reserve Admission Now'
                                    )}
                                </motion.div>
                            </motion.button>
                            <p className="text-xs text-on-surface-variant text-center">
                                Secure payment. Immediate curriculum access upon enrollment.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Capstone Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="py-24 px-6"
            >
                <div className="max-w-7xl mx-auto bg-surface-container p-8 md:p-16 rounded-3xl border border-outline-variant/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] pointer-events-none"></div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight mb-6 text-on-surface">
                                The Capstone Project
                            </h2>
                            <h3 className="text-2xl text-primary font-bold mb-8">
                                Face Recognition Attendance System
                            </h3>
                            <p className="text-on-surface-variant mb-10 leading-relaxed">
                                Students don't just "learn" about AI; they deploy a professional-grade biometric attendance system using Python, OpenCV, and Flask. A complete end-to-end engineering experience.
                            </p>
                            <ul className="space-y-4">
                                {capstoneFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined" data-weight="fill">
                                                {feature.icon}
                                            </span>
                                        </div>
                                        <span className="font-medium text-on-surface">
                                            {feature.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-video bg-surface-container-highest rounded-2xl border-4 border-outline-variant/30 overflow-hidden shadow-2xl group">
                                <img 
                                    alt="Tech Dashboard" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMb1_gWzFgYnSBsqM8-KU63NNkKdll6Xffug1WowY4rKPHygilc6i_thd25TZ6PKfFokB35YjQjmDubw9H3Zusi7iDtLJKuqldOy9dFb6ul70GywZhF5K2g7j71jhsCj_C53trp51cl7XhNpPZppmzmZFteHNuZUh_ukavvucNECI30Lb6zajDSGSGyFzXet6C_mNC3gOP-MNrAXk4HSzExZ3LCuGsS5HtK3Nx066WxMgGKSQmhSlo8594a5Jwfq41UjqdyVZLMtFj"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                    <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
                                    <span className="text-xs font-mono font-bold tracking-widest text-on-surface uppercase">
                                        Live Processing Mode
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default CourseCurriculum;
