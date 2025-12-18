import React from 'react';
import { motion } from 'framer-motion';
// Icons from lucide-react for modern, clean visual representation
import { Cpu, ShieldCheck, Zap, Code, BookOpen, GraduationCap } from 'lucide-react';

const Course = () => {
    // Define the course data with titles, descriptions, and corresponding icons
    const courseData = [
        {
            title: "AI & Machine Learning",
            icon: Cpu,
            description: "Students explore how AI identifies patterns and makes predictions. They train simple models and understand how intelligent systems respond to different inputs.",
            color: "text-[#fca96d]",
            bg: "bg-[#fca96d]/10",
        },
        {
            title: "Cybersecurity",
            icon: ShieldCheck,
            description: "Students learn about digital safety, online risks, and protective measures. Ethical hacking simulations help them understand how cyberattacks happen and how to defend against them.",
            color: "text-slate-800",
            bg: "bg-slate-100",
        },
        {
            title: "IoT & Robotics",
            icon: Zap,
            description: "Students work with sensors, microcontrollers, and automation. They observe how devices interact and build simple automated systems rooted in IoT concepts.",
            color: "text-black",
            bg: "bg-gray-100",
        },
        {
            title: "Web/App Development",
            icon: Code,
            description: "Students learn the structure of digital products by designing basic web layouts and understanding how user interfaces connect logically.",
            color: "text-[#fca96d]",
            bg: "bg-[#fca96d]/10",
        },
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
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* Header and Introduction */}
                <motion.h2
                    className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Our Core Technology Programs
                </motion.h2>
                <motion.p
                    className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    ThinkSkool offers practical, industry-relevant technology programs that help
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
                    {courseData.map((course, index) => (
                        <motion.div
                            key={index}
                            className={`flex flex-col text-left p-6 rounded-2xl shadow-xl transition-all duration-300 border-t-4 border-b-4 border-transparent hover:border-blue-500 hover:shadow-2xl`}
                            variants={cardVariants}
                            whileHover={{ scale: 1.05, translateY: -5 }} // Interactive lift on hover
                        >
                            <div className={`p-4 rounded-xl mb-4 w-fit ${course.bg} ${course.color}`}>
                                <course.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {course.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed grow">
                                {course.description}
                            </p>
                        </motion.div>
                    ))}
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
