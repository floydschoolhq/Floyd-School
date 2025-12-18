import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaChalkboardTeacher, FaComments, FaArrowRight, FaRobot, FaChartLine, FaUserTie, FaCloud } from 'react-icons/fa';

const StudentEcosystem = () => {
    return (
        <section className="bg-slate-50 py-24 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Everything You Need</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Complete <span className="text-orange-500">Student Ecosystem</span>
                    </h2>
                    <p className="text-base text-slate-500 max-w-2xl mx-auto">
                        Tools designed to help you focus on learning, building, and growing.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Chatbot Support",
                            icon: <FaRobot />,
                            desc: "24/7 Continuous learning assistance.",
                            color: "text-slate-900",
                            bg: "bg-slate-100"
                        },
                        {
                            title: "Built-in Coding IDE",
                            icon: <FaCode />,
                            desc: "Practice directly on the platform with no setup.",
                            color: "text-orange-500",
                            bg: "bg-orange-50"
                        },
                        {
                            title: "Progress Monitoring",
                            icon: <FaChartLine />,
                            desc: "Real-time interactions available to school admins and parents.",
                            color: "text-black",
                            bg: "bg-slate-200"
                        },
                        {
                            title: "Mentor Access",
                            icon: <FaUserTie />,
                            desc: "1:1 expert guidance throughout learning.",
                            color: "text-orange-600",
                            bg: "bg-orange-100"
                        },
                        {
                            title: "Secure Cloud",
                            icon: <FaCloud />,
                            desc: "Safe & private student learning space.",
                            color: "text-slate-700",
                            bg: "bg-slate-50"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                            }}
                            whileHover={{
                                y: -15,
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-slate-100 group cursor-pointer"
                        >
                            <div className={`w-16 h-16 ${feature.bg} rounded-xl flex items-center justify-center text-3xl ${feature.color} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                                {feature.desc}
                            </p>
                            <a href="#" className={`font-bold flex items-center gap-2 ${feature.color} text-sm group-hover:gap-3 transition-all`}>
                                Learn more <FaArrowRight size={12} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudentEcosystem;
