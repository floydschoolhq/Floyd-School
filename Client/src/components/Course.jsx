import React from 'react';
import { motion } from 'framer-motion';
// Icons from lucide-react for modern, clean visual representation
import { Cpu, ShieldCheck, Zap, Code, BookOpen, GraduationCap } from 'lucide-react';

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
        <section className="py-16 md:py-24 bg-[#FCF8F8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* Header and Introduction */}
                <motion.h2
                    className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Core <span className="text-[#2563EB]">Technology</span> Programs
                </motion.h2>
                <motion.p
                    className="text-lg text-slate-600 mb-20 max-w-2xl mx-auto font-medium leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span className="text-blue-600">ThinkSkool</span> offers practical, industry-relevant technology programs that help
                    students understand and apply modern concepts through hands-on learning.
                </motion.p>

                {/* Course Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }} // Triggers animation on scroll
                >
                    {courseData.length > 0 ? (
                        courseData.map((course, index) => (
                            <motion.div
                                key={index}
                                className={`flex flex-col text-left p-8 rounded-[2.5rem] bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.1)] transition-all duration-500 border border-[#FBEFEF] hover:border-[#2563EB]/20`}
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, translateY: -5 }} // Interactive lift on hover
                            >
                                <div className={`p-4 rounded-2xl mb-6 w-fit ${course.bg} ${course.color} shadow-sm`}>
                                    <course.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                    {course.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed grow text-sm font-medium">
                                    {course.description}
                                </p>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white border border-dashed border-blue-100 rounded-[3rem] flex flex-col items-center justify-center text-center">
                            <Zap size={48} className="text-blue-500/20 mb-6" />
                            <h4 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Technology Programs Under Construction</h4>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">We are syncing with industrial standards to bring you the best curriculum.</p>
                        </div>
                    )}
                </motion.div>

                {/* Call to action at the bottom */}
                <motion.div
                    className="mt-16 pt-8 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* <motion.button
                        className="bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(37, 99, 235, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => console.log('Navigate to course catalog/enrollment')}
                    >
                        View Full Course Catalog
                    </motion.button> */}
                </motion.div>
            </div>
        </section>
    );
};

export default Course;

