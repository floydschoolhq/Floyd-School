import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaBuilding, FaGlobe, FaGoogle, FaAmazon, FaMicrosoft } from 'react-icons/fa';
import api from '../api/axios';

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
        <section className="bg-slate-50 py-24 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-[#fca96d] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Distinguished Faculty</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight font-['Outfit']">
                        Industry Visionaries & <span className="text-[#fca96d]">Engineering</span> Leaders
                    </h2>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Our mentorship ecosystem is powered by veterans from the world's most innovative technology conglomerates, bringing decades of production experience to your learning journey.
                    </p>
                </div>

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
                                <p className="text-sm text-[#fca96d] font-black mb-3 font-['Outfit'] uppercase tracking-wider">{mentor.role}</p>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
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
