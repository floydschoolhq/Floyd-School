import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaBuilding, FaGlobe, FaGoogle, FaAmazon, FaMicrosoft } from 'react-icons/fa';
import axios from 'axios';

const Faculty = () => {
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/mentors');
                setMentors(res.data);
            } catch (err) {
                console.error("Failed to fetch mentors", err);
            }
        };

        fetchMentors();
    }, []);

    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Mentorship</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Learn from the <span className="text-orange-500">Masters</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Our faculty comprises experts from top tech companies who have been there, done that.
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

                                        <span className="text-xs font-bold uppercase">{mentor.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{mentor.name}</h3>
                                <p className="text-sm text-orange-500 font-bold mb-3">{mentor.role}</p>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    {mentor.bio}
                                </p>

                                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <FaLinkedinIn size={20} />
                                    </button>
                                    <button className="text-sm font-bold text-slate-900 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition-all">
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
