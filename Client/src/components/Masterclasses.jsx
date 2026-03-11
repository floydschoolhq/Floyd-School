import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaBell, FaArrowRight, FaUsers, FaCheck } from 'react-icons/fa';
import api from '../api/axios';

const Masterclasses = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState({});

    useEffect(() => {
        fetchMasterclasses();
    }, []);

    const fetchMasterclasses = async () => {
        try {
            const res = await api.get('/masterclasses?upcoming=true');
            let data = Array.isArray(res.data) ? res.data : res.data.data || [];
            setEvents(data.slice(0, 3)); // Show only first 3
        } catch (err) {
            console.error("Failed to fetch masterclasses", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        setRegistering({ ...registering, [eventId]: true });
        try {
            await api.post(`/masterclasses/${eventId}/register`);
            // Refresh to get updated registration status
            fetchMasterclasses();
        } catch (err) {
            console.error('Registration failed:', err);
            alert(err.response?.data?.message || 'Failed to register');
        } finally {
            setRegistering({ ...registering, [eventId]: false });
        }
    };

    const handleUnregister = async (eventId) => {
        setRegistering({ ...registering, [eventId]: true });
        try {
            await api.post(`/masterclasses/${eventId}/unregister`);
            fetchMasterclasses();
        } catch (err) {
            console.error('Unregistration failed:', err);
        } finally {
            setRegistering({ ...registering, [eventId]: false });
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-32 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white h-96 rounded-2xl border border-slate-100 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return null; // Don't show section if no events
    }

    return (
        <section className="bg-white py-32 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-6">
                        <div className="inline-block px-5 py-2 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 shadow-2xl">
                            <span className="text-[#2563EB] font-bold uppercase tracking-[0.4em] text-[10px]">Technical Sessions</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-extrabold text-slate-950 tracking-tighter leading-none uppercase">
                            Expert <span className="text-[#2563EB]">Masterclasses</span>
                        </h2>
                    </div>
                    <div>
                        <button className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[11px] hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                            View All Events <FaArrowRight className="text-[14px]" />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {events.map((event, index) => {
                        const isRegistered = event.registeredStudents?.some(
                            s => s._id === localStorage.getItem('userId')
                        );

                        return (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -15, scale: 1.02 }}
                                className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm transition-all duration-500 relative group cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100"
                            >
                                <div className="absolute inset-0 bg-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Status Badge */}
                                <div className={`absolute top-10 right-10 px-5 py-2 ${event.isFree ? 'bg-slate-100 text-slate-600' : 'bg-[#2563EB] text-white'} text-[10px] font-bold uppercase tracking-[0.2em] rounded-full z-10 shadow-sm border border-slate-100`}>
                                    {event.isFree ? 'FREE' : 'PREMIUM'}
                                </div>

                                {/* Header Info */}
                                <div className="mb-10 relative z-10">
                                    <div className="flex items-center gap-5 text-slate-500 font-bold text-[10px] uppercase tracking-[0.25em] mb-6">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-[#2563EB]" />
                                            {new Date(event.scheduledDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-blue-400" />
                                            {event.startTime}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-slate-900 leading-[1.1] group-hover:text-blue-600 transition-colors tracking-tight uppercase">
                                        {event.title}
                                    </h3>
                                </div>

                                {/* Instructor Section */}
                                <div className="flex items-center gap-5 py-8 border-y border-slate-100 mb-10 relative z-10">
                                    <div className="relative">
                                        <img src={event.instructorImage} alt={event.instructorName} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white/5 group-hover:ring-slate-900/20 transition-all shadow-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-base font-extrabold text-slate-900 tracking-tight uppercase">{event.instructorName}</p>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1 opacity-80">{event.instructorRole}</p>
                                    </div>
                                </div>

                                {/* Footer Controls */}
                                <div className="flex items-center justify-between gap-6 relative z-10">
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {event.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 px-4 py-2 rounded-xl border border-[#2563EB]/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            isRegistered ? handleUnregister(event._id) : handleRegister(event._id);
                                        }}
                                        disabled={registering[event._id]}
                                        className={`w-14 h-14 flex items-center justify-center ${isRegistered ? 'bg-emerald-500' : 'bg-[#2563EB]'
                                            } text-white rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 active:shadow-inner disabled:opacity-50`}
                                    >
                                        {registering[event._id] ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : isRegistered ? (
                                            <FaCheck size={16} />
                                        ) : (
                                            <FaBell size={16} />
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Masterclasses;

