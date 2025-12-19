import React, { useState, useEffect } from 'react';
import {
    LifeBuoy,
    Search,
    MessageCircle,
    Clock,
    AlertCircle,
    CheckCircle2,
    User,
    ChevronRight,
    Send,
    ArrowLeft,
    Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const SupportTickets = () => {
    const toast = useToast();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/support/tickets');
            setTickets(res.data.tickets);
        } catch (err) {
            toast.error('Failed to fetch support tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setSending(true);
        try {
            const res = await api.post(`/support/tickets/${selectedTicket._id}/messages`, {
                text: reply
            });
            setSelectedTicket(res.data.ticket);
            setReply('');
            toast.success('Response transmitted');
            fetchTickets(); // Refresh listing too
        } catch (err) {
            toast.error('Failed to send response');
        } finally {
            setSending(false);
        }
    };

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-rose-500 text-white';
            case 'high': return 'bg-amber-500 text-white';
            case 'medium': return 'bg-sky-500 text-white';
            default: return 'bg-slate-400 text-white';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Support <span className="text-sky-500">Tickets</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Managing student technical and academic transmissions.
                    </p>
                </div>
            </header>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Tickets List */}
                <div className={`flex-1 flex flex-col gap-6 ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter transmissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:border-sky-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                            ))
                        ) : filteredTickets.length > 0 ? (
                            filteredTickets.map(ticket => (
                                <motion.div
                                    key={ticket._id}
                                    layoutId={ticket._id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-6 bg-white border rounded-3xl cursor-pointer transition-all hover:shadow-xl group ${selectedTicket?._id === ticket._id ? 'border-sky-500 shadow-lg' : 'border-slate-100 shadow-sm'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900">{ticket.student?.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-slate-900 group-hover:text-sky-500 transition-colors mb-2 line-clamp-1">
                                        {ticket.subject}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    ticket.status === 'in-progress' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                <MessageCircle size={12} /> {ticket.messages.length}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-500 transition-all" />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 italic">
                                <LifeBuoy size={48} className="mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">No active signals found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Detail (Chat) */}
                <div className={`lg:w-2/3 bg-white rounded-[3rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden ${!selectedTicket ? 'hidden lg:flex lg:opacity-30 pointer-events-none grayscale' : 'flex'}`}>
                    {selectedTicket ? (
                        <>
                            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="lg:hidden p-2 hover:bg-white/10 rounded-xl"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">{selectedTicket.subject}</h3>
                                        <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                                            Ticket ID: {selectedTicket._id.slice(-8)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriorityColor(selectedTicket.priority)}`}>
                                        {selectedTicket.priority} Priority
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
                                {selectedTicket.messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === selectedTicket.student?._id ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] p-6 rounded-3xl ${msg.sender === selectedTicket.student?._id
                                                ? 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                                                : 'bg-slate-900 text-white shadow-xl rounded-br-none'
                                            }`}>
                                            <div className="flex items-center justify-between gap-8 mb-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                                                    {msg.sender === selectedTicket.student?._id ? 'Student' : 'Mentor (You)'}
                                                </span>
                                                <span className="text-[9px] font-bold opacity-30">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendReply} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                                <input
                                    type="text"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type your verification or response..."
                                    className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none focus:border-sky-500 transition-all"
                                />
                                <button
                                    disabled={sending || !reply.trim()}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-sky-500 transition-all flex items-center gap-2"
                                >
                                    <Send size={16} />
                                    {sending ? 'Sending...' : 'Transmit'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <LifeBuoy size={64} className="text-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select a node to begin review</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
