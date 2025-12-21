import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaBuilding, FaGlobe, FaGoogle, FaAmazon, FaMicrosoft } from 'react-icons/fa';
import { Headphones, MessageSquare, PlayCircle, Star, Award, Briefcase } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ x: 10 }}
        className="flex items-center gap-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-[#2563EB]/30 transition-all group"
    >
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-[#2563EB] shadow-lg group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
            <Icon size={20} />
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-black text-slate-100 uppercase tracking-widest font-['Outfit']">{title}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{desc}</span>
        </div>
    </motion.div>
);

const Faculty = () => {
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await api.get('/mentors');
                if (Array.isArray(res.data)) {
                    setMentors(res.data);
                } else {
                    console.error("Mentors data is not an array:", res.data);
                    setMentors([]);
                }
            } catch (err) {
                console.error("Failed to fetch mentors", err);
            }
        };

        fetchMentors();
    }, []);

    return (
        <section className="bg-[#FCF8F8] py-24 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Distinguished Faculty</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight font-['Outfit']">
                        Industry Visionaries & <span className="text-[#2563EB]">Engineering</span> Leaders
                    </h2>
                    <p className="text-base font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Our mentorship ecosystem is powered by veterans from the world's most innovative technology conglomerates, bringing decades of production experience to your learning journey.
                    </p>
                </div>

                {/* Feature Showcase Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 bg-slate-900 rounded-[3.5rem] p-8 lg:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group"
                >
                    {/* Background Decorative Pattern */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                        {/* Video Side */}
                        <div className="w-full lg:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 relative bg-slate-800">
                            <video
                                src="/Untitled video - Made with Clipchamp.mp4"
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-['Outfit']">Live Session Sample</span>
                            </div>
                        </div>

                        {/* Features Side */}
                        <div className="w-full lg:w-1/2 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FeatureItem icon={Headphones} title="1:1 Support" desc="Instant Mentor Access" />
                                <FeatureItem icon={MessageSquare} title="Post-Class Chat" desc="24/7 Doubt Clearance" />
                                <FeatureItem icon={PlayCircle} title="Live Classes" desc="Interactive Coding" />
                                <FeatureItem icon={Star} title="Expert sessions" desc="Industry Insights" />
                                <FeatureItem icon={Award} title="Certifications" desc="Global Recognition" />
                                <FeatureItem icon={Briefcase} title="Hands-On Projects" desc="Production Systems" />
                            </div>

                            <div className="pt-6 border-t border-slate-800 flex justify-between items-center sm:flex-row flex-col gap-4">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest font-['Outfit']">Complete Learning Ecosystem</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-[0.2em] font-['Outfit'] shadow-lg shadow-[#2563EB]/20"
                                >
                                    Explore Program
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mentors.map((mentor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                y: -15,
                                scale: 1.03,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                        >
                            <div className="relative h-64 overflow-hidden bg-slate-200">
                                {/* Use a placeholder if the specific image loads fail, but these are reliable static URLs for this context or use generic */}
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    onError={(e) => { e.target.src = `https://i.pravatar.cc/300?u=${index}` }}
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex items-center gap-2 text-white">
                                        {/* Simple mapping logic */}
                                        {mentor.companyIcon === 'Google' && <FaGoogle />}
                                        {mentor.companyIcon === 'Amazon' && <FaAmazon />}
                                        {mentor.companyIcon === 'Microsoft' && <FaMicrosoft />}
                                        {mentor.companyIcon === 'Globe' && <FaGlobe />}
                                        {!['Google', 'Amazon', 'Microsoft', 'Globe'].includes(mentor.companyIcon) && <FaBuilding />}

                                        <span className="text-xs font-black uppercase tracking-widest font-['Outfit']">{mentor.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-black text-slate-900 mb-1 font-['Outfit']">{mentor.name}</h3>
                                <p className="text-sm text-[#2563EB] font-black mb-3 font-['Outfit'] uppercase tracking-wider">{mentor.role}</p>
                                <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium">
                                    {mentor.bio}
                                </p>

                                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <FaLinkedinIn size={20} />
                                    </button>
                                    <button className="text-sm font-black text-slate-900 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest font-['Outfit']">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faculty;
