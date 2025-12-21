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
            <section className="bg-[#FCF8F8] py-24 border-t border-[#FBEFEF] font-['Inter']">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white h-96 rounded-[2.8rem] border border-slate-100 animate-pulse"></div>
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
        <section className="bg-[#FCF8F8] py-24 border-t border-[#FBEFEF] font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1 rounded-full bg-white border border-[#FBEFEF] shadow-sm">
                            <span className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] font-['Outfit']">Technical Deep Dives</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter font-['Outfit'] leading-none">
                            Expert Integration <span className="text-[#2563EB]">Sessions</span>
                        </h2>
                    </div>
                    <div>
                        <button className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all font-['Outfit'] shadow-sm hover:shadow-md">
                            View all events <FaArrowRight className="text-[12px]" />
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
                                whileHover={{ y: -12 }}
                                className="bg-white rounded-[2.8rem] border border-slate-100 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(245,175,175,0.12)] transition-all duration-500 relative group cursor-pointer"
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-8 right-8 px-4 py-1.5 ${event.isFree ? 'bg-slate-900' : 'bg-emerald-500'} text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full font-['Outfit'] z-10 shadow-lg`}>
                                    {event.isFree ? 'FREE' : 'PREMIUM'}
                                </div>

                                {/* Header Info */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit'] mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <FaCalendarAlt className="text-[#2563EB]/60" />
                                            {new Date(event.scheduledDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <div className="flex items-center gap-1.5">
                                            <FaClock className="text-[#2563EB]/60" />
                                            {event.startTime}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-[1.2] group-hover:text-[#2563EB] transition-colors font-['Outfit'] tracking-tight">
                                        {event.title}
                                    </h3>
                                </div>

                                {/* Instructor Section */}
                                <div className="flex items-center gap-4 py-6 border-y border-slate-50 mb-8">
                                    <div className="relative">
                                        <img src={event.instructorImage} alt={event.instructorName} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-[#2563EB]/10 transition-all" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 font-['Outfit'] tracking-tight">{event.instructorName}</p>
                                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider font-['Outfit'] mt-0.5 opacity-70">{event.instructorRole}</p>
                                    </div>
                                </div>

                                {/* Footer Controls */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {event.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/5 px-3 py-1.5 rounded-xl border border-[#2563EB]/10 font-['Outfit']">
                                                {tag}
                                            </span>
                                        ))}
                                        {event.attendeeCount !== undefined && (
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest font-['Outfit'] ml-auto">
                                                <FaUsers className="text-slate-300" />
                                                <span>{event.attendeeCount}+</span>
                                            </div>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => isRegistered ? handleUnregister(event._id) : handleRegister(event._id)}
                                        disabled={registering[event._id]}
                                        className={`w-12 h-12 flex items-center justify-center ${isRegistered ? 'bg-emerald-500' : 'bg-slate-900'
                                            } text-white rounded-2xl hover:bg-[#2563EB] transition-all shadow-xl shadow-slate-900/10 active:shadow-inner disabled:opacity-50`}
                                    >
                                        {registering[event._id] ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : isRegistered ? (
                                            <FaCheck size={14} />
                                        ) : (
                                            <FaBell size={14} />
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
