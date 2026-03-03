import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Terminal, ShieldCheck, ArrowRight, Laptop, Cpu, Globe, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const LEARNERS_DATA = [
    {
        id: 'ai',
        label: 'Artificial Intelligence',
        icon: Brain,
        description: 'Master neural networks and predictive modeling.',
        certifications: [
            { title: 'AI & Machine Learning', icon: Brain, link: '/course' },
            { title: 'Neural Systems Architecture', icon: Cpu, link: '/course' }
        ],
        bootcamps: [
            { title: 'Intro to GenAI', link: '/course' },
            { title: 'Python for Data Science', link: '/course' }
        ]
    },
    {
        id: 'web',
        label: 'Web & Cloud',
        icon: Code,
        description: 'Build scalable cloud-native architectures.',
        certifications: [
            { title: 'Fullstack Engineering', icon: Code, link: '/course' },
            { title: 'Cloud Infrastructure', icon: Globe, link: '/course' }
        ],
        bootcamps: [
            { title: 'React Performance', link: '/course' },
            { title: 'Node.js Mastery', link: '/course' }
        ]
    },
    {
        id: 'robotics',
        label: 'Robotics & IoT',
        icon: Terminal,
        description: 'Hardware integration and autonomous systems.',
        certifications: [
            { title: 'IoT Systems Design', icon: Terminal, link: '/course' },
            { title: 'Robotics Control Systems', icon: Laptop, link: '/course' }
        ],
        bootcamps: [
            { title: 'Embedded Electronics', link: '/course' },
            { title: 'C++ for Engineers', link: '/course' }
        ]
    },
    {
        id: 'security',
        label: 'Cybersecurity',
        icon: ShieldCheck,
        description: 'Industrial security and zero-trust protocols.',
        certifications: [
            { title: 'Cyber Defense Ops', icon: ShieldCheck, link: '/course' },
            { title: 'Zero Trust Architecture', icon: Rocket, link: '/course' }
        ],
        bootcamps: [
            { title: 'Security Audit v1', link: '/course' },
            { title: 'Ethical Hacking Intro', link: '/course' }
        ]
    }
];

const LearnersMegaMenu = ({ isDarkPage }) => {
    const [activeDomain, setActiveDomain] = useState(LEARNERS_DATA[0]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-1/2 -translate-x-[40%] mt-4 w-[850px] bg-[#0A0F1E] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden z-[100]"
        >
            <div className="flex min-h-[500px]">
                {/* Left Panel: Domains */}
                <div className="w-[35%] bg-white/5 p-8 border-r border-white/10 flex flex-col gap-2">
                    <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-6 px-3">Domains</h3>
                    {LEARNERS_DATA.map((domain) => (
                        <button
                            key={domain.id}
                            onMouseEnter={() => setActiveDomain(domain)}
                            className={`group flex items-start p-4 transition-all duration-300 text-left ${activeDomain?.id === domain.id
                                ? "text-white"
                                : "text-white/40 hover:text-white/80"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-left">
                                    <p className={`text-[13px] font-semibold tracking-tight leading-none uppercase ${activeDomain?.id === domain.id ? "text-white" : "text-white/40"}`}>{domain.label}</p>
                                    <p className="text-[10px] font-medium mt-2 opacity-30 uppercase tracking-widest">{domain.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Right Panel: Courses */}
                <div className="w-[65%] p-10 relative bg-[#0A0F1E]">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] pointer-events-none" />

                    <div className="grid grid-cols-2 gap-10 h-full relative z-10">
                        {/* Certifications */}
                        <div className="col-span-1">
                            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-6">Industrial Certifications</h3>
                            <div className="flex flex-col gap-3">
                                {activeDomain.certifications.map((cert, idx) => (
                                    <Link
                                        key={idx}
                                        to="/online-program#explore-programs"
                                        className="group py-4 transition-all duration-500 border-b border-white/[0.03] hover:border-white/10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-semibold text-white/80 group-hover:text-white uppercase tracking-tight transition-colors">{cert.title}</p>
                                                <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest mt-1">Industrial Program</p>
                                            </div>
                                            <ArrowRight size={14} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all duration-500" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Bootcamps */}
                        <div className="col-span-1">
                            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-6">Foundational Bootcamps</h3>
                            <div className="space-y-1">
                                {activeDomain.bootcamps.map((camp, idx) => (
                                    <Link
                                        key={idx}
                                        to="/online-program#explore-programs"
                                        className="block py-3 text-[11px] font-medium text-white/30 hover:text-white/80 transition-all tracking-widest uppercase"
                                    >
                                        {camp.title}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-12 py-8 border-t border-white/5 opacity-80 group cursor-pointer transition-all text-left">
                                <p className="text-[10px] font-medium text-white/20 mb-2 uppercase tracking-widest">Ready to Master?</p>
                                <p className="text-[13px] text-white font-medium leading-relaxed mb-6 uppercase tracking-tight">Join our global network of learners and start your engineering journey today.</p>
                                <div className="flex items-center gap-3 text-[11px] font-semibold text-white uppercase tracking-widest group-hover:gap-5 transition-all">
                                    Explore Industrial Academy <ArrowRight size={14} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LearnersMegaMenu;
