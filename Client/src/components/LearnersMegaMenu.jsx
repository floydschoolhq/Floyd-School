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
            className="absolute top-full left-1/2 -translate-x-[40%] mt-4 w-[900px] bg-white rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-slate-100/80 overflow-hidden z-[100]"
        >
            <div className="flex min-h-[500px]">
                {/* Left Panel: Domains */}
                <div className="w-[38%] bg-slate-50 p-6 border-r border-slate-100 flex flex-col gap-2 relative">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Domains</h3>
                    {LEARNERS_DATA.map((domain) => {
                        const isActive = activeDomain?.id === domain.id;
                        return (
                            <button
                                key={domain.id}
                                onMouseEnter={() => setActiveDomain(domain)}
                                className={`group relative w-full flex items-start p-4 transition-all duration-300 rounded-2xl text-left ${
                                    isActive ? "bg-white shadow-sm border border-slate-100/50" : "hover:bg-slate-100/50 border border-transparent"
                                }`}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"
                                    />
                                )}
                                <div className="flex gap-4 items-start w-full">
                                    <div className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        <domain.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <div>
                                        <p className={`text-[14px] font-bold tracking-tight mb-1 ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                                            {domain.label}
                                        </p>
                                        <p className="text-[12px] text-slate-500 leading-snug">
                                            {domain.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Panel: Courses & Bootcamps */}
                <div className="w-[62%] bg-white flex flex-col justify-between">
                    <div className="p-8 pb-4 relative h-full">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-[80px] pointer-events-none" />

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            {/* Certifications (Left Col) */}
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Industrial Certifications</h3>
                                <div className="flex flex-col gap-2">
                                    {activeDomain.certifications.map((cert, idx) => (
                                        <Link
                                            key={idx}
                                            to="/online-program#explore-programs"
                                            className="group flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300 items-center justify-between"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <cert.icon size={16} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{cert.title}</p>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Industrial Program</p>
                                                </div>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Bootcamps (Right Col) */}
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Foundational Bootcamps</h3>
                                <div className="flex flex-col gap-1">
                                    {activeDomain.bootcamps.map((camp, idx) => (
                                        <Link
                                            key={idx}
                                            to="/online-program#explore-programs"
                                            className="group px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between"
                                        >
                                            <span className="text-[13px] font-medium text-slate-600 group-hover:text-blue-600">{camp.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Banner */}
                    <Link to="/online-program#explore-programs" className="group">
                        <div className="mx-6 mb-6 mt-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden relative">
                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                            
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
                                    <Rocket size={20} className="text-white fill-white/20" />
                                </div>
                                <div>
                                    <p className="font-bold text-[14px] leading-tight mb-1">Join our global network of learners</p>
                                    <p className="text-blue-100 text-[12px] font-medium">Start your engineering journey today.</p>
                                </div>
                            </div>
                            <div className="relative z-10 bg-white/10 hover:bg-white/20 transition-colors p-2.5 rounded-full backdrop-blur-sm group-hover:scale-110 duration-300">
                                <ArrowRight size={16} className="text-white" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default LearnersMegaMenu;
