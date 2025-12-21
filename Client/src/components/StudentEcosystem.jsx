import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaArrowRight, FaRobot, FaChartLine, FaUserTie, FaCloud, FaCheckCircle, FaTimes } from 'react-icons/fa';

const FEATURES = [
    {
        title: "Chatbot Support",
        miniTitle: "Neural Core Integration",
        icon: <FaRobot />,
        desc: "24/7 Continuous learning assistance.",
        color: "text-slate-900",
        bg: "bg-[#FBEFEF]",
        details: [
            { label: "Contextual AI", desc: "Trained on our specific curriculum and your code repo." },
            { label: "Instant Debugging", desc: "Real-time error identification and resolution steps." },
            { label: "suggestive Path", desc: "Suggests specific modules to review based on mistakes." }
        ]
    },
    {
        title: "Built-in Coding IDE",
        miniTitle: "Cloud Deployment Terminal",
        icon: <FaCode />,
        desc: "Practice directly on the platform with no setup.",
        color: "text-[#2563EB]",
        bg: "bg-[#2563EB]/10",
        details: [
            { label: "Zero-Config", desc: "Start coding instantly with no local environment setup." },
            { label: "Multi-Language", desc: "Full support for JS, Python, C++, and Java." },
            { label: "Cloud Compilers", desc: "Low-latency execution on high-performance nodes." }
        ]
    },
    {
        title: "Progress Monitoring",
        miniTitle: "Performance Vector Analytics",
        icon: <FaChartLine />,
        desc: "Real-time interactions available to school admins and parents.",
        color: "text-[#2D2D2D]",
        bg: "bg-[#F9DFDF]",
        details: [
            { label: "Precision Metrics", desc: "Track every module and quiz with granular accuracy." },
            { label: "Stakeholder Dash", desc: "Dedicated portals for admins and parents." },
            { label: "Predictive Engines", desc: "Identifies learning bottlenecks before they occur." }
        ]
    },
    {
        title: "Expert Guidance",
        miniTitle: "Human Intelligence Tier",
        icon: <FaUserTie />,
        desc: "1:1 technical support and code reviews.",
        color: "text-[#2563EB]",
        bg: "bg-[#2563EB]/20",
        details: [
            { label: "Mentorship", desc: "Weekly dedicated sessions with industry leads." },
            { label: "Code Review", desc: "High-level architectural feedback on your projects." },
            { label: "Career Strategy", desc: "Direct access to FAANG hiring managers." }
        ]
    },
    {
        title: "Secure Cloud",
        miniTitle: "Fortified Infrastructure",
        icon: <FaCloud />,
        desc: "Safe & private student learning space.",
        color: "text-slate-700",
        bg: "bg-white",
        details: [
            { label: "Private Sandbox", desc: "Dedicated, isolated environment for every student." },
            { label: "Persistent Sync", desc: "Access your workspace from any device globally." },
            { label: "Enterprise Security", desc: "Protected by industry-leading encryption protocols." }
        ]
    }
];

const StudentEcosystem = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <section className="bg-[#FCF8F8] py-24 border-t border-[#FBEFEF] font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Holistic Infrastructure</p>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight font-['Outfit']">
                        Proprietary <span className="text-[#2563EB]">Learning</span> Ecosystem
                    </h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto text-sm leading-relaxed">
                        A cohesive suite of advanced engineering tools engineered to accelerate your path from conceptual understanding to technical excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedFeature(feature)}
                            className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(245,175,175,0.08)] hover:shadow-[0_40px_80px_-12px_rgba(245,175,175,0.15)] transition-all duration-500 border border-[#FBEFEF] group cursor-pointer"
                        >
                            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center text-3xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm shadow-[#2563EB]/5`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 font-['Outfit'] tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed mb-6 text-xs font-medium">
                                {feature.desc}
                            </p>
                            <div className={`font-black flex items-center gap-2 ${feature.color} text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all font-['Outfit']`}>
                                Learn more <FaArrowRight size={10} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feature Deep Dive Modal */}
            <AnimatePresence>
                {selectedFeature && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setSelectedFeature(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-10 relative">
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <FaTimes />
                                </button>

                                <div className="flex items-center gap-6 mb-10">
                                    <div className={`w-16 h-16 ${selectedFeature.bg} rounded-2xl flex items-center justify-center text-4xl ${selectedFeature.color} shadow-sm`}>
                                        {selectedFeature.icon}
                                    </div>
                                    <div>
                                        <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-1 font-['Outfit']">
                                            {selectedFeature.miniTitle}
                                        </p>
                                        <h3 className="text-3xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                                            {selectedFeature.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-10">
                                    {selectedFeature.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-start gap-4 group">
                                            <div className="mt-1 flex-shrink-0">
                                                <FaCheckCircle className="text-[#2563EB]/40 group-hover:text-[#2563EB] transition-colors" size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 mb-1 font-['Outfit']">{detail.label}</h4>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{detail.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-['Outfit']">
                                        Architected for Excellence
                                    </p>
                                    <button
                                        onClick={() => setSelectedFeature(null)}
                                        className="bg-[#2D2D2D] hover:bg-[#2563EB] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 font-['Outfit']"
                                    >
                                        Return to Ecosystem
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default StudentEcosystem;
