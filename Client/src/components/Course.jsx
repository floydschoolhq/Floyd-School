import { Cpu, ShieldCheck, Zap, Code, BookOpen, GraduationCap, Terminal, ArrowRight } from 'lucide-react';
import OnlineCourseFocus from './OnlineCourseFocus';

const Course = () => {
    // Define the course data with titles, descriptions, and corresponding icons
    const courseData = [
        {
            title: "Advanced AI",
            description: "Neural networks, predictive modeling, and deep learning architectures.",
            icon: Cpu,
            bg: "bg-blue-600/10",
            color: "text-blue-400"
        },
        {
            title: "Web Engine",
            description: "Full-stack engineering with scalable cloud infrastructure and real-time systems.",
            icon: Code,
            bg: "bg-blue-600/10",
            color: "text-blue-400"
        },
        {
            title: "Robotics Ops",
            description: "Hardware-software integration, autonomous systems, and sensor fusion.",
            icon: Terminal,
            bg: "bg-blue-600/10",
            color: "text-blue-400"
        },
        {
            title: "Cyber Defense",
            description: "Threat analysis, zero-trust protocols, and industrial security mastery.",
            icon: ShieldCheck,
            bg: "bg-blue-600/10",
            color: "text-blue-400"
        }
    ];

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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-600 selection:text-white relative font-['Outfit']">
            {/* Background Decorative Mesh - Industrial Dark */}
            <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-orange-500/10 rounded-full blur-[160px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[140px] -ml-48 -mb-48" />
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100" />
            </div>

            <div className="relative z-10">
                {/* Technical Specializations Section */}
                <section className="py-24 md:py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        {/* Header and Introduction */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
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
                            Core <span className="text-orange-500">Technology</span> Programs
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

                        {/* Course Cards Grid */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            {courseData.length > 0 ? (
                                courseData.map((course, index) => (
                                    <motion.div
                                        key={index}
                                        className="group relative perspective-[1500px]"
                                        variants={cardVariants}
                                    >
                                        <motion.div
                                            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col text-left p-8 pt-16 h-full cursor-pointer relative z-10"
                                            style={{ transformStyle: 'preserve-3d' }}
                                            whileHover={{ 
                                                rotateY: 8, 
                                                rotateX: -8, 
                                                z: 40,
                                                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)",
                                                borderColor: "rgba(249,115,22,0.3)"
                                            }}
                                        >
                                            {/* Mac Dots Overlay */}
                                            <div className="mac-browser-dots">
                                                <div className="mac-browser-dot mac-dot-red" />
                                                <div className="mac-browser-dot mac-dot-yellow" />
                                                <div className="mac-browser-dot mac-dot-green" />
                                            </div>

                                            {/* Icon with 3D lift */}
                                            <div 
                                                className={`p-4 rounded-2xl mb-8 w-fit bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white`}
                                                style={{ transform: 'translateZ(60px)' }}
                                            >
                                                <course.icon className="w-8 h-8" />
                                            </div>
                                            
                                            {/* Title with 3D lift */}
                                            <h3 
                                                className="text-2xl font-black text-white mb-4 tracking-tighter uppercase transition-colors duration-500 group-hover:text-orange-500"
                                                style={{ transform: 'translateZ(50px)' }}
                                            >
                                                {course.title}
                                            </h3>
                                            
                                            {/* Description with subtle lift */}
                                            <p 
                                                className="text-slate-400 leading-relaxed grow text-base font-medium"
                                                style={{ transform: 'translateZ(30px)' }}
                                            >
                                                {course.description}
                                            </p>

                                            {/* Play Button Subtle Overlay - Icon Only */}
                                            <div className="absolute top-8 right-8 text-white/5 group-hover:text-orange-500 transition-colors" style={{ transform: 'translateZ(60px)' }}>
                                                <ArrowRight size={24} />
                                            </div>

                                            {/* 3D Depth Decoration */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                        </motion.div>
                                    </motion.div>
                                ))
                            ) : null}
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

