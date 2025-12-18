import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaBell, FaArrowRight, FaUsers } from 'react-icons/fa';
import api from '../api/axios';

const Masterclasses = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchMasterclasses = async () => {
            try {
                const res = await api.get('/masterclasses');
                if (Array.isArray(res.data)) {
                    setEvents(res.data);
                } else {
                    console.error("Masterclasses data is not an array:", res.data);
                    setEvents([]);
                }
            } catch (err) {
                console.error("Failed to fetch masterclasses", err);
            }
        };

        fetchMasterclasses();
    }, []);

    return (
        <section className="bg-white py-24 border-t border-slate-100 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <p className="text-[#fca96d] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Technical Deep Dives</p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-['Outfit']">
                            Expert Integration <span className="text-[#fca96d]">Sessions</span>
                        </h2>
                    </div>
                    <div>
                        <button className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-[#fca96d] transition-colors font-['Outfit']">
                            View all events <FaArrowRight />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30, scale: 0.95 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg font-['Outfit']">
                                FREE
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center gap-1 font-['Outfit']">
                                        <FaCalendarAlt /> {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • <FaClock /> {event.time}
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-[#fca96d] transition-colors font-['Outfit']">
                                        {event.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <img src={event.image} alt={event.instructor} className="w-12 h-12 rounded-full border-2 border-slate-100" />
                                <div>
                                    <p className="text-sm font-black text-slate-900 font-['Outfit']">{event.instructor}</p>
                                    <p className="text-xs text-slate-500 font-medium font-['Inter']">{event.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {event.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-['Outfit']">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-widest font-['Outfit']">
                                    <FaUsers />
                                    <span>{event.students ? event.students + '+' : '0'} registered</span>
                                </div>
                                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-[#fca96d] transition-all shadow-lg active:scale-95">
                                    <FaBell />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Masterclasses;
