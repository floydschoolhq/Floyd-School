import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaBuilding, FaGlobe, FaGoogle, FaAmazon, FaMicrosoft } from 'react-icons/fa';
import { Headphones, MessageSquare, PlayCircle, Star, Award, Briefcase } from 'lucide-react';
import api from '../api/axios';

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ x: 6 }}
        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-[#FBEFEF] hover:border-[#2563EB]/20 hover:shadow-sm transition-all group"
    >
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] border border-blue-100 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
            <Icon size={18} />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{title}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{desc}</span>
        </div>
    </motion.div>
);

const LEADERS = [
    {
        name: "Neha Gupta",
        role: "Tech Lead",
        company: "Swiggy",
        companyIcon: <FaBuilding />,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        bio: "Building scalable backend systems for hyper-growth logistics.",
        linkedin: "#"
    },
    {
        name: "Amit Patel",
        role: "SDE III",
        company: "Amazon",
        companyIcon: <FaAmazon />,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        bio: "Expert in distributed systems and cloud infrastructure optimization.",
        linkedin: "#"
    },
    {
        name: "Rahul Verma",
        role: "Product Manager",
        company: "Microsoft",
        companyIcon: <FaMicrosoft />,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        bio: "Ex-IIT Bombay, leading Azure Cloud developer ecosystem teams.",
        linkedin: "#"
    },
    {
        name: "Priya Sharma",
        role: "Senior Data Scientist",
        company: "Google",
        companyIcon: <FaGoogle />,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        bio: "AI Researcher with 8+ years exp in NLP and Deep Learning.",
        linkedin: "#"
    },
    {
        name: "Siddharth Rao",
        role: "Eng Manager",
        company: "Meta",
        companyIcon: <FaGlobe />,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        bio: "Scaled social infrastructure to 2B+ users globally.",
        linkedin: "#"
    },
    {
        name: "Ananya Singh",
        role: "UX Director",
        company: "Apple",
        companyIcon: <FaBuilding />,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        bio: "Pioneering spatial computing interfaces and human-centric design.",
        linkedin: "#"
    },
    {
        name: "Vikram Malhotra",
        role: "Cloud Architect",
        company: "AWS",
        companyIcon: <FaAmazon />,
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
        bio: "Lead architect for serverless computing and edge operations.",
        linkedin: "#"
    },
    {
        name: "Ishita Kapoor",
        role: "AI Researcher",
        company: "NVIDIA",
        companyIcon: <FaGlobe />,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
        bio: "Focusing on large language models and GPU-accelerated computing.",
        linkedin: "#"
    }
];

const Faculty = () => {
    // Create a continuous loop array
    const marqueeItems = [...LEADERS, ...LEADERS];

    return (
        <section className="bg-[#000000] py-20 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <p className="text-blue-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4">Distinguished Faculty</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                        Industry Visionaries & <span className="text-blue-500">Engineering</span> Leaders
                    </h2>
                </div>

                {/* Feature Showcase Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-8 lg:p-12 shadow-2xl border border-white/10 relative overflow-hidden shadow-blue-500/5 transition-all duration-700 hover:shadow-blue-500/10"
                >
                    <div className="flex flex-col lg:flex-row gap-20 items-center relative z-10">
                        {/* Video Side */}
                        <div className="w-full lg:w-1/2 aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative bg-slate-950 group">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                            >
                                <source src="/Untitled video - Made with Clipchamp.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-2xl">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">
                                    Live Bootcamp Session
                                </span>
                            </div>
                        </div>

                        {/* Features Side */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                                {[
                                    { icon: Headphones, title: "1:1 Support", desc: "Instant Mentor Access" },
                                    { icon: MessageSquare, title: "Post-Class Chat", desc: "24/7 Doubt Clearance" },
                                    { icon: PlayCircle, title: "Live Classes", desc: "Interactive Coding" },
                                    { icon: Star, title: "Expert sessions", desc: "Industry Insights" },
                                    { icon: Award, title: "Certifications", desc: "Global Recognition" },
                                    { icon: Briefcase, title: "Hands-On Projects", desc: "Production Systems" }
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 6 }}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/20 hover:bg-white/10 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <feature.icon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white uppercase tracking-widest">{feature.title}</span>
                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-0.5">{feature.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Infinite Leader Marquee */}
            <div className="relative w-full overflow-hidden py-10">
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: [0, -2560] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 50,
                            ease: "linear",
                        },
                    }}
                    whileHover={{ transition: { duration: 100 } }}
                >
                    {marqueeItems.map((mentor, index) => (
                        <div
                            key={index}
                            className="bg-[#111111] rounded-[2rem] overflow-hidden border border-white/5 shadow-sm group cursor-pointer hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 min-w-[300px] w-[300px]"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-950">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-100 group-hover:scale-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                                            {React.cloneElement(mentor.companyIcon, { size: 12 })}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">{mentor.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight truncate group-hover:text-blue-400 transition-colors">{mentor.name}</h3>
                                <p className="text-blue-500 font-black text-[10px] mb-4 uppercase tracking-[0.25em] truncate">{mentor.role}</p>
                                <p className="text-white/40 text-[11px] mb-6 leading-relaxed font-bold uppercase tracking-widest opacity-70 line-clamp-2">
                                    {mentor.bio}
                                </p>

                                <div className="flex justify-between items-center border-t border-white/5 pt-5">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all">
                                        <FaLinkedinIn size={16} />
                                    </div>
                                    <button className="text-[10px] font-black text-white/60 bg-white/5 px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-[0.2em] border border-white/10 hover:border-transparent shadow-sm">
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Faculty;

