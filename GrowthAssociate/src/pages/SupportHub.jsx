import React, { useState, useEffect } from 'react';
import {
    MessageCircle,
    Search,
    Send,
    User,
    MoreVertical,
    Paperclip,
    Smile,
    AlertTriangle,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const SupportHub = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/support/tickets');
            setTickets(res.data.tickets);
        } catch (err) {
            console.error('Failed to fetch tickets', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();

        if (socket) {
            socket.on('support:ticket_new', (newTicket) => {
                setTickets(prev => [newTicket, ...prev]);
            });

            socket.on('support:message_received', (data) => {
                setTickets(prev => prev.map(t => {
                    if (t._id === data.ticketId) {
                        return { ...t, messages: [...t.messages, data.message] };
                    }
                    return t;
                }));

                setSelectedTicket(prev => {
                    if (prev?._id === data.ticketId) {
                        return { ...prev, messages: [...prev.messages, data.message] };
                    }
                    return prev;
                });
            });
        }

        return () => {
            if (socket) {
                socket.off('support:ticket_new');
                socket.off('support:message_received');
            }
        };
    }, [socket]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedTicket) return;

        try {
            const res = await api.post(`/support/tickets/${selectedTicket._id}/messages`, { text: message });
            setSelectedTicket(res.data.ticket);
            setMessage('');
            fetchTickets();
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6 overflow-hidden">
            {/* Ticket List */}
            <div className="w-1/3 bg-white rounded-[2.5rem] border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        Support <span className="text-orange-500 text-sm font-bold bg-orange-100 px-2 py-0.5 rounded-lg">Queue</span>
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {tickets.map((ticket) => (
                        <motion.div
                            key={ticket._id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 rounded-[1.5rem] border cursor-pointer transition-all ${selectedTicket?._id === ticket._id
                                ? 'bg-orange-50 border-orange-200 shadow-md'
                                : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.status}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${ticket.priority === 'high' ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <p className="text-sm font-black text-slate-900 line-clamp-1">{ticket.subject}</p>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center text-[8px] font-black">
                                        {ticket.student?.name?.[0] || '?'}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">{ticket.student?.name}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 flex flex-col overflow-hidden shadow-sm relative">
                {selectedTicket ? (
                    <>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 shadow-inner text-xl font-black">
                                    {selectedTicket.student?.name?.[0]}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{selectedTicket.student?.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                        {selectedTicket.subject}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 font-bold">
                            {selectedTicket.messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] space-y-1 ${msg.sender === user._id ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-4 rounded-2xl text-sm shadow-sm border ${msg.sender === user._id
                                            ? 'bg-orange-500 text-white rounded-tr-none border-orange-600'
                                            : 'bg-white text-slate-900 rounded-tl-none border-slate-200'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 bg-white">
                            <div className="relative group bg-slate-50 rounded-2xl border-2 border-slate-100 focus-within:border-orange-500 focus-within:bg-white transition-all p-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your response transmission..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-900 p-2"
                                />
                                <button type="submit" className="bg-orange-500 text-white p-3 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">
                                    <Send size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
                        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-200">
                            <MessageCircle size={64} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Terminal Idle</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Select a student node to initiate support.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportHub;
