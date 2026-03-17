import { Cpu, ShieldCheck, Zap, Code, BookOpen, GraduationCap, Terminal, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OnlineCourseFocus from './OnlineCourseFocus';

const Course = () => {
    const navigate = useNavigate();
    
    // Define the course data with actual course information
    const courseData = [
        {
            _id: '1',
            title: "Foundation of AI and Machine Learning",
            description: "Master neural networks, predictive modeling, and deep learning architectures. Build production-grade AI models that solve real-world problems.",
            icon: Cpu,
            duration: "3-4 Months",
            rating: 4.9,
            tags: ["AI", "Python", "ML"],
            live: true
        },
        {
            _id: '2',
            title: "Web Architecture",
            description: "Engineer high-performance full-stack applications with scalable cloud infrastructure. Architect resilient, distributed systems.",
            icon: Code,
            duration: "3-4 Months",
            rating: 4.8,
            tags: ["React", "Node", "Cloud"],
            comingSoon: true
        },
        {
            _id: '3',
            title: "IoT & Robotics",
            description: "Bridge the gap between hardware and software with autonomous systems. Design, build, and program smart robotic networks.",
            icon: Terminal,
            duration: "3-4 Months",
            rating: 4.7,
            tags: ["Embedded", "C++", "Sensors"],
            comingSoon: true
        },
        {
            _id: '4',
            title: "Cybersecurity Ops",
            description: "Become the shield of the digital world through threat analysis and zero-trust protocols. Master offensive and defensive strategies.",
            icon: ShieldCheck,
            duration: "3-4 Months",
            rating: 4.7,
            tags: ["Security", "Networks", "Defense"],
            comingSoon: true
        }
    ];

    const handleCardClick = (course) => {
        navigate(`/course/${course._id}`);
    };

    // Framer Motion variants for the main container (staggering)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Delay between each card's appearance
            },
        },
    };

    // Framer Motion variants for individual course cards
    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15
            }
        },
    };

    return (
        <div className="min-h-screen bg-[#060C1B] text-white selection:bg-orange-600 selection:text-white relative font-['Outfit']">
            {/* Dot grid - matching Program Roadmap */}
            <div className="fixed inset-0 opacity-[0.05] bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none z-0" />
            {/* Glows - matching Program Roadmap */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-700/12 blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-indigo-700/10 blur-[100px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10">
                {/* Technical Specializations Section */}
                <section className="py-24 md:py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        {/* Header and Introduction */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
                            <Zap size={12} fill="currentColor" />
                            <span>Technical Specializations</span>
                        </div>
                        
                        <motion.h2
                            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Core <span className="text-blue-500">Technology</span> Programs
                        </motion.h2>
                        <motion.p
                            className="text-xl text-slate-400 mb-24 max-w-2xl mx-auto font-medium leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className="font-bold tracking-tight lowercase"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span> architected practical, industry-relevant curriculum tracks that transform students into modern software creators.
                        </motion.p>

                        {/* Course Cards Grid - Two Row Layout */}
                        <motion.div
                            className="space-y-12"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            {/* First Row - Single Course Card (Foundation of AI) */}
                            <div className="flex justify-center">
                                {courseData.length > 0 && courseData[0].live && (
                                    <motion.div
                                        key="ai-course"
                                        className="group relative perspective-[1500px] w-full max-w-2xl"
                                        variants={cardVariants}
                                    >
                                        <motion.div
                                            className="bg-blue-50/95 backdrop-blur-xl border border-blue-300/60 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col text-left p-8 pt-16 h-full cursor-pointer relative z-10"
                                            style={{ transformStyle: 'preserve-3d' }}
                                            whileHover={{ 
                                                rotateY: 8, 
                                                rotateX: -8, 
                                                z: 40,
                                                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)",
                                                borderColor: "rgba(59, 130, 246, 0.8)"
                                            }}
                                            onClick={() => handleCardClick(courseData[0])}
                                        >
                                            {/* Course content for AI course */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
                                                    {(() => {
                                                        const IconComponent = courseData[0].icon;
                                                        return <IconComponent size={28} className="text-blue-600" />;
                                                    })()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{courseData[0].duration}</span>
                                                        {courseData[0].live && (
                                                            <span className="px-2 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold uppercase">
                                                                LIVE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className={i < Math.floor(courseData[0].rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                                                        ))}
                                                        <span className="text-[11px] font-semibold text-slate-600 ml-1">{courseData[0].rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                                {courseData[0].title}
                                            </h3>
                                            
                                            <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-slate-700 transition-colors">
                                                {courseData[0].description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {courseData[0].tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-[10px] font-semibold uppercase tracking-wide">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-blue-600 font-black text-sm uppercase tracking-widest group-hover:text-blue-700 transition-colors">
                                                    Explore Program
                                                </span>
                                                <ArrowRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Second Row - Three Course Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                                {courseData.slice(1).map((course, index) => (
                                    <motion.div
                                        key={index}
                                        className="group relative perspective-[1500px]"
                                        variants={cardVariants}
                                    >
                                        <motion.div
                                            className="bg-blue-50/95 backdrop-blur-xl border border-blue-300/60 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col text-left p-6 pt-12 h-full cursor-pointer relative z-10"
                                            style={{ transformStyle: 'preserve-3d' }}
                                            whileHover={{ 
                                                rotateY: 8, 
                                                rotateX: -8, 
                                                z: 40,
                                                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)",
                                                borderColor: "rgba(59, 130, 246, 0.8)"
                                            }}
                                            onClick={() => handleCardClick(course)}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
                                                    {(() => {
                                                        const IconComponent = course.icon;
                                                        return <IconComponent size={20} className="text-blue-600" />;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{course.duration}</span>
                                                        {course.comingSoon && (
                                                            <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[8px] font-bold uppercase">
                                                                COMING SOON
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} className={i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                                                        ))}
                                                        <span className="text-[9px] font-semibold text-slate-600 ml-1">{course.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                                                {course.title}
                                            </h3>
                                            
                                            <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3 group-hover:text-slate-700 transition-colors">
                                                {course.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {course.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-700 text-[8px] font-semibold uppercase tracking-wide">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-blue-600 font-black text-xs uppercase tracking-widest group-hover:text-blue-700 transition-colors">
                                                    Explore
                                                </span>
                                                <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Active Batches Section - Dark Theme */}
                <div className="border-t border-white/5">
                    <OnlineCourseFocus variant="dark" />
                </div>
            </div>
        </div>
    );
};

export default Course;
