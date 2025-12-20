import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaBell, FaArrowRight, FaUsers } from 'react-icons/fa';
import api from '../api/axios';

const FALLBACK_EVENTS = [
    {
        title: "Large Language Model Architecture",
        date: new Date().toISOString(),
        time: "10:00 AM - 12:00 PM",
        instructor: "Dr. Elena Vance",
        role: "Senior AI Researcher",
        image: "https://i.pravatar.cc/150?u=elena",
        tags: ["LLM", "Transformers", "NLP"],
        students: 450
    },
    {
        title: "High-Frequency System Design",
        date: new Date(Date.now() + 86400000).toISOString(),
        time: "2:00 PM - 4:00 PM",
        instructor: "Mark Sterling",
        role: "Principal Systems Architect",
        image: "https://i.pravatar.cc/150?u=mark",
        tags: ["Distributed Systems", "Cloud"],
        students: 320
    },
    {
        title: "Neural Graphics & 3D Simulations",
        date: new Date(Date.now() + 172800000).toISOString(),
        time: "11:00 AM - 1:00 PM",
        instructor: "Sarah Chen",
        role: "Graphics Engineer",
        image: "https://i.pravatar.cc/150?u=sarah",
        tags: ["WebGPU", "Real-time Render"],
        students: 280
    }
];

const Masterclasses = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchMasterclasses = async () => {
            try {
                const res = await api.get('/masterclasses');
                let data = Array.isArray(res.data) ? res.data : res.data.data || [];

                if (data.length === 0) {
                    data = FALLBACK_EVENTS;
                }
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch masterclasses, using fallbacks", err);
                setEvents(FALLBACK_EVENTS);
            }
        };

        fetchMasterclasses();
    }, []);

    return (
        <section className="bg-[#FCF8F8] py-24 border-t border-[#FBEFEF] font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1 rounded-full bg-white border border-[#FBEFEF] shadow-sm">
                            <span className="text-[#F5AFAF] font-black uppercase tracking-[0.4em] text-[10px] font-['Outfit']">Technical Deep Dives</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter font-['Outfit'] leading-none">
                            Expert Integration <span className="text-[#F5AFAF]">Sessions</span>
                        </h2>
                    </div>
                    <div>
                        <button className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-[#F5AFAF] hover:border-[#F5AFAF]/30 transition-all font-['Outfit'] shadow-sm hover:shadow-md">
                            View all events <FaArrowRight className="text-[12px]" />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -12 }}
                            className="bg-white rounded-[2.8rem] border border-slate-100 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(245,175,175,0.12)] transition-all duration-500 relative group cursor-pointer"
                        >
                            {/* Floating Free Badge */}
                            <div className="absolute top-8 right-8 px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full font-['Outfit'] z-10 shadow-lg">
                                FREE
                            </div>

                            {/* Header Info */}
                            <div className="mb-8">
                                <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit'] mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-[#F5AFAF]/60" />
                                        {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <div className="flex items-center gap-1.5">
                                        <FaClock className="text-[#F5AFAF]/60" />
                                        {event.time}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 leading-[1.2] group-hover:text-[#F5AFAF] transition-colors font-['Outfit'] tracking-tight">
                                    {event.title}
                                </h3>
                            </div>

                            {/* Instructor Section */}
                            <div className="flex items-center gap-4 py-6 border-y border-slate-50 mb-8">
                                <div className="relative">
                                    <img src={event.image} alt={event.instructor} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-[#F5AFAF]/10 transition-all" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 font-['Outfit'] tracking-tight">{event.instructor}</p>
                                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider font-['Outfit'] mt-0.5 opacity-70">{event.role}</p>
                                </div>
                            </div>

                            {/* Footer Controls */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2 flex-1">
                                    {event.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[9px] font-black uppercase tracking-widest text-[#F5AFAF] bg-[#F5AFAF]/5 px-3 py-1.5 rounded-xl border border-[#F5AFAF]/10 font-['Outfit']">
                                            {tag}
                                        </span>
                                    ))}
                                    {event.students && (
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest font-['Outfit'] ml-auto">
                                            <FaUsers className="text-slate-300" />
                                            <span>{event.students}+</span>
                                        </div>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-[#F5AFAF] transition-all shadow-xl shadow-slate-900/10 active:shadow-inner"
                                >
                                    <FaBell size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Masterclasses;
