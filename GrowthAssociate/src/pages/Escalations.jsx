import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const Escalations = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/growth/escalations');
            setTickets(res.data.tickets);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        if (!window.confirm('Mark this issue as resolved?')) return;
        try {
            await api.put(`/support/tickets/${id}/close`);
            fetchTickets();
        } catch (err) {
            alert('Failed to close ticket');
        }
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <AlertTriangle className="text-rose-500" size={32} />
                        Issue <span className="text-rose-500">Escalations</span>
                    </h2>
                    <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">
                        Urgent student support requests requiring attention.
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-3xl animate-pulse"></div>
                    ))
                ) : tickets.length > 0 ? (
                    tickets.map((ticket, idx) => (
                        <motion.div
                            key={ticket._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>

                            <div className="flex flex-col lg:flex-row gap-8 justify-between">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                            {ticket.priority || 'High'} Priority
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{ticket.subject}</h3>
                                        <p className="text-slate-500 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            {ticket.issue}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                            {ticket.student.name.charAt(0)}
                                        </div>
                                        <span>{ticket.student.name}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{ticket.student.email}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                    <button
                                        onClick={() => { }} // Could link to a detail view or open a modal
                                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2 justify-center"
                                    >
                                        <MessageCircle size={16} /> Reply
                                    </button>
                                    <button
                                        onClick={() => handleResolve(ticket._id)}
                                        className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:text-emerald-500 hover:border-emerald-200 transition-all flex items-center gap-2 justify-center"
                                    >
                                        <CheckCircle size={16} /> Resolve
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                        <CheckCircle size={48} className="mx-auto mb-4 text-emerald-400" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase">All Clear</h3>
                        <p className="text-slate-400 font-bold mt-2">No active escalations requiring your attention.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Escalations;
