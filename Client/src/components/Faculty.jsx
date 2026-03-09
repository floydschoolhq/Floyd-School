import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn, FaBuilding, FaGlobe, FaGoogle, FaAmazon, FaMicrosoft } from 'react-icons/fa';
import { Headphones, MessageSquare, PlayCircle, Star, Award, Briefcase, X, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import shivamImg from '../assets/tutors/shivam.jpg';
import raghavImg from '../assets/tutors/raghav.jpg';
import abhayImg from '../assets/tutors/abhay.jpg';


import slide1 from '../assets/slideshow/slide1.jpg';
import slide2 from '../assets/slideshow/slide2.jpg';
import slide3 from '../assets/slideshow/slide3.jpg';
import slide4 from '../assets/slideshow/slide4.jpg';
import slide5 from '../assets/slideshow/slide5.jpg';
import slide6 from '../assets/slideshow/slide6.jpg';
import slide7 from '../assets/slideshow/slide7.jpg';
import slide8 from '../assets/slideshow/slide8.jpg';

const SLIDES = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ x: 6 }}
        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-[#FBEFEF] hover:border-[#2563EB]/20 hover:shadow-sm transition-all group"
    >
        <div className="shrink-0 relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon size={20} className="text-[#2563EB] drop-shadow-[0_0_6px_rgba(37,99,235,0.3)] relative z-10 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 tracking-tight">{title}</span>
            <span className="text-[13px] font-medium text-slate-400 tracking-tight mt-0.5">{desc}</span>
        </div>
    </motion.div>
);

const LEADERS = [
    {
        name: "Shivam Mishra",
        role: "Founder of ThinkSkool | AI/ML Engineer",
        company: "ThinkSkool",
        companyIcon: <FaBuilding />,
        image: shivamImg,
        bio: "Visionary founder of ThinkSkool, architecting the future of STEM education through advanced AI and machine learning integration.",
        linkedin: "https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in",
        tags: ["AI/ML", "Founder", "Visionary"]
    },
    {
        name: "Raghav",
        role: "Lead Mentor & Product Architect",
        company: "ThinkSkool",
        companyIcon: <FaBuilding />,
        image: raghavImg,
        bio: "Leading industrial engineering programs with a focus on production-scale systems and AI architecture.",
        linkedin: "https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        tags: ["Lead Mentor", "Architect", "Industrial Eng"]
    },
    {
        name: "Abhay Singh Chauhan",
        role: "ThinkSkool Management & Web Development",
        company: "ThinkSkool",
        companyIcon: <FaBuilding />,
        image: abhayImg,
        bio: "Full-stack enthusiast focused on building premium web experiences and scalable frontend architectures.",
        linkedin: "https://www.linkedin.com/in/abhay-singh-chauhan-485706310",
        tags: ["Web Dev", "Management", "Full Stack"]
    },
    {
        name: "Anamika Vashisth",
        role: "Coordination in UI/UX and System Designing",
        company: "ThinkSkool",
        companyIcon: <FaBuilding />,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        bio: "Specializing in UI/UX coordination and system design to ensure seamless and intuitive user experiences.",
        linkedin: "#",
        tags: ["UI/UX", "System Design", "Coordination"]
    }
];


const Faculty = () => {
    const [selectedMentor, setSelectedMentor] = React.useState(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="experts" className="bg-[#FFF9FA] py-8 border-t border-[#FBEFEF] relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[80px] pointer-events-none opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                        We deliver <span className="text-[#2563EB]">Engineering Excellence.</span>
                    </h2>
                </div>

                {/* Feature Showcase Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-2xl border border-[#FBEFEF] relative overflow-hidden shadow-blue-500/5 transition-all duration-700 hover:shadow-blue-500/10"
                >
                    <div className="flex flex-col lg:flex-row gap-20 items-center relative z-10">
                        {/* Slideshow Side */}
                        <div className="w-full lg:w-1/2 aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#FBEFEF] relative bg-slate-950 group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSlide}
                                    src={SLIDES[currentSlide]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-[3s]"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/20">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                <span className="text-[14px] font-bold text-white tracking-tight">
                                    Our Industrial Ecosystem
                                </span>
                            </div>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-8 right-8 flex gap-2">
                                {SLIDES.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-white/30'}`}
                                    />
                                ))}
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

            {/* Static Leader Grid */}
            <div className="relative w-full py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", damping: 15, stiffness: 60 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                        <span className="text-[#2563EB]">Mentors</span>
                    </h2>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, type: "spring", damping: 25, stiffness: 40 }}
                    className="max-w-5xl mx-auto px-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
                        {LEADERS.map((mentor, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedMentor(mentor)}
                                className="bg-white rounded-[2rem] overflow-hidden border border-[#FBEFEF] shadow-sm group cursor-pointer hover:border-[#2563EB]/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 w-full max-w-[300px]"
                            >
                                <div className="relative h-64 overflow-hidden bg-slate-900">
                                    <img
                                        src={mentor.image}
                                        alt={mentor.name}
                                        className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 scale-[2.2] group-hover:scale-[2.4]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute inset-x-0 bottom-0 p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                                                {React.cloneElement(mentor.companyIcon, { size: 12, className: "text-white" })}
                                            </div>
                                            <span className="text-[13px] font-bold tracking-tight">
                                                <span className="text-[#2563EB]">Think</span>
                                                <span className="text-[#F97316]">Skool</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-[22px] font-bold text-slate-800 mb-1 tracking-tight truncate group-hover:text-[#2563EB] transition-colors">{mentor.name}</h3>
                                    <p className="text-[#2563EB] font-semibold text-[15px] mb-4 tracking-tight truncate">{mentor.role}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {mentor.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-blue-50 rounded-full text-[13px] font-medium text-[#2563EB] tracking-tight border border-blue-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center border-t border-slate-50 pt-5">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2563EB] transition-all">
                                            <FaLinkedinIn size={18} />
                                        </div>
                                        <button className="text-[15px] font-semibold text-slate-600 bg-slate-50 px-5 py-2.5 rounded-xl hover:bg-[#2563EB] hover:text-white transition-all tracking-tight border border-slate-100 hover:border-transparent shadow-sm">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                        onClick={() => setSelectedMentor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-5xl overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-white/20 select-none"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Left Side: Industrial Profile Photo */}
                                <div className="md:w-[42%] h-[450px] md:h-auto relative overflow-hidden group/modal-img">
                                    <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.4)_100%)]" />

                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />

                                    <img
                                        src={selectedMentor.image}
                                        alt={selectedMentor.name}
                                        className="absolute inset-0 min-w-full min-h-full w-full h-full object-cover object-center transition-transform duration-1000 group-hover/modal-img:scale-110"
                                        style={{ objectFit: 'cover' }}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

                                    <div className="absolute bottom-10 left-10 right-10 z-20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="relative flex items-center justify-center w-10 h-10">
                                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 opacity-100" />
                                                {React.cloneElement(selectedMentor.companyIcon, {
                                                    size: 24,
                                                    className: "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] relative z-10"
                                                })}
                                            </div>
                                            <span className="text-[14px] font-bold tracking-tight">
                                                <span className="text-[#2563EB]">Think</span>
                                                <span className="text-[#F97316]">Skool</span>
                                            </span>
                                        </div>

                                        <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-3xl">
                                            <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-1">{selectedMentor.name}</h2>
                                            <p className="text-[#2563EB] font-semibold text-[14px] tracking-tight opacity-90">Industrial Grade Portfolio</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Biography & Links */}
                                <div className="md:w-[58%] p-10 lg:p-16 relative bg-white flex flex-col justify-center">
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#2563EB] hover:bg-slate-100 transition-all border border-slate-100 group"
                                    >
                                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>

                                    <div className="max-w-md">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/50 rounded-lg border border-blue-100/50 mb-6">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                                            <p className="text-[#2563EB] font-bold tracking-tight text-[13px]">Verification Active</p>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 leading-[1.1]">{selectedMentor.role}</h3>

                                        <div className="w-12 h-1 bg-[#2563EB] mb-8 rounded-full" />

                                        <p className="text-slate-500 font-medium tracking-tight text-[15px] leading-relaxed opacity-80 mb-10 border-l-2 border-slate-100 pl-6">
                                            {selectedMentor.bio}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-12">
                                            {selectedMentor.tags.map(tag => (
                                                <span key={tag} className="px-4 py-2 bg-slate-50 rounded-xl text-[14px] font-medium text-slate-600 tracking-tight border border-slate-200/50 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition-colors cursor-default">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                            <a
                                                href={selectedMentor.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-3 bg-[#2563EB] text-white py-5 rounded-2xl font-bold text-[15px] tracking-tight shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <FaLinkedinIn size={14} /> Profile Data
                                            </a>
                                            <button
                                                onClick={() => setSelectedMentor(null)}
                                                className="flex items-center justify-center gap-3 bg-slate-950 text-white py-5 rounded-2xl font-bold text-[15px] tracking-tight hover:bg-slate-800 transition-all duration-300 border border-transparent hover:border-white/10"
                                            >
                                                Return Home
                                            </button>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 right-10 pointer-events-none opacity-[0.05] select-none text-[80px] font-black leading-none tracking-tighter uppercase whitespace-nowrap">
                                        <span className="text-[#2563EB]">Think</span>
                                        <span className="text-[#F97316]">Skool</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Faculty;

