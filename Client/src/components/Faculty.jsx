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
        <section className="bg-[#FCF8F8] py-20 border-t border-[#FBEFEF] relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.5em] text-[10px] mb-4">Distinguished Faculty</p>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">
                        Industry Visionaries & <span className="text-[#2563EB]">Engineering</span> Leaders
                    </h2>
                    <p className="text-sm font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest opacity-80">
                        Our mentorship ecosystem is powered by veterans from the world's most innovative technology conglomerates.
                    </p>
                </div>

                {/* Feature Showcase Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 bg-white rounded-[3.5rem] p-8 lg:p-12 shadow-2xl border border-[#FBEFEF] relative overflow-hidden shadow-blue-500/5 transition-all duration-700 hover:shadow-blue-500/10"
                >
                    <div className="flex flex-col lg:flex-row gap-20 items-center relative z-10">
                        {/* Video Side */}
                        <div className="w-full lg:w-1/2 aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#FBEFEF] relative bg-slate-950 group">
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
                            <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white shadow-2xl ring-1 ring-black/5">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em]">
                                    Live Bootcamp Session
                                </span>
                            </div>
                        </div>

                        {/* Features Side */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <FeatureItem icon={Headphones} title="1:1 Support" desc="Instant Mentor Access" />
                                <FeatureItem icon={MessageSquare} title="Post-Class Chat" desc="24/7 Doubt Clearance" />
                                <FeatureItem icon={PlayCircle} title="Live Classes" desc="Interactive Coding" />
                                <FeatureItem icon={Star} title="Expert sessions" desc="Industry Insights" />
                                <FeatureItem icon={Award} title="Certifications" desc="Global Recognition" />
                                <FeatureItem icon={Briefcase} title="Hands-On Projects" desc="Production Systems" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Infinite Leader Marquee */}
            <div className="relative w-full overflow-hidden py-10">
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#FCF8F8] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#FCF8F8] to-transparent z-20 pointer-events-none" />

                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: [0, -2560] }} // Adjust based on card width + gap
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 50,
                            ease: "linear",
                        },
                    }}
                    whileHover={{ transition: { duration: 100 } }} // Optional: slow down on hover
                >
                    {marqueeItems.map((mentor, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[2rem] overflow-hidden border border-[#FBEFEF] shadow-sm group cursor-pointer hover:border-[#2563EB]/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 min-w-[300px] w-[300px]"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-950">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-100 group-hover:scale-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                                    <div className="flex items-center gap-2 text-[#2563EB]">
                                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                                            {React.cloneElement(mentor.companyIcon, { size: 12 })}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">{mentor.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight truncate group-hover:text-[#2563EB] transition-colors">{mentor.name}</h3>
                                <p className="text-[#2563EB] font-black text-[10px] mb-4 uppercase tracking-[0.25em] truncate">{mentor.role}</p>
                                <p className="text-slate-500 text-[11px] mb-6 leading-relaxed font-bold uppercase tracking-widest opacity-70 line-clamp-2">
                                    {mentor.bio}
                                </p>

                                <div className="flex justify-between items-center border-t border-slate-50 pt-5">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2563EB] transition-all">
                                        <FaLinkedinIn size={16} />
                                    </div>
                                    <button className="text-[10px] font-black text-slate-600 bg-slate-50 px-5 py-2.5 rounded-xl hover:bg-[#2563EB] hover:text-white transition-all uppercase tracking-[0.2em] border border-slate-100 hover:border-transparent shadow-sm">
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

