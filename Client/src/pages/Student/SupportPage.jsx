import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LifeBuoy,
    Plus,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    Search,
    ChevronRight,
    X,
    MessageCircle,
    User,
    Shield
} from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
});

const SupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [newTicketData, setNewTicketData] = useState({ subject: '', issue: '', priority: 'medium' });
    const [currentUser, setCurrentUser] = useState(null);

    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchInitialData();

        socket.on('message:received', (data) => {
            if (selectedTicket && data.ticketId === selectedTicket._id) {
                setTickets(prev => prev.map(t =>
                    t._id === data.ticketId
                        ? { ...t, messages: [...t.messages, data.message] }
                        : t
                ));
            }
        });

        socket.on('ticket:updated', (updatedTicket) => {
            setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
            if (selectedTicket?._id === updatedTicket._id) {
                setSelectedTicket(updatedTicket);
            }
        });

        return () => {
            socket.off('message:received');
            socket.off('ticket:updated');
        };
    }, [selectedTicket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedTicket?.messages]);

    const fetchInitialData = async () => {
        try {
            const [ticketsRes, userRes] = await Promise.all([
                api.get('/support'),
                api.get('/auth/me')
            ]);
            setTickets(ticketsRes.data);
            setCurrentUser(userRes.data);
            socket.emit('auth:join', userRes.data._id);
        } catch (error) {
            console.error('Failed to fetch support data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/support', newTicketData);
            setTickets([res.data, ...tickets]);
            setShowNewTicketModal(false);
            setNewTicketData({ subject: '', issue: '', priority: 'medium' });
        } catch (error) {
            console.error('Failed to create ticket:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            const res = await api.post(`/support/${selectedTicket._id}/messages`, { text: newMessage });
            const updatedTicket = { ...selectedTicket, messages: [...selectedTicket.messages, res.data] };
            setSelectedTicket(updatedTicket);
            setTickets(tickets.map(t => t._id === selectedTicket._id ? updatedTicket : t));
            setNewMessage('');

            socket.emit('message:send', {
                ticketId: selectedTicket._id,
                message: res.data,
                receiverId: selectedTicket.assignedTo
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-slate-900 text-xl font-black animate-pulse uppercase tracking-widest">Securing Support Channel...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-['Inter']"
                >
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit'] italic">
                        Technical <span className="text-sky-500">Concierge</span>
                    </h1>
                    <p className="text-base font-medium text-slate-500">Direct integration with growth architects for proprietary support.</p>
                </motion.div>

                <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-\[13px\] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                    <Plus size={16} /> Raise Ticket
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
                {/* Tickets Sidebar */}
                <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <motion.div
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 ${selectedTicket?._id === ticket._id
                                        ? 'bg-white border-sky-500 shadow-xl shadow-sky-500/5'
                                        : 'bg-white border-transparent hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-full text-\[11px\] font-black uppercase tracking-widest ${ticket.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                                            ticket.status === 'in-progress' ? 'bg-sky-50 text-sky-600' :
                                                'bg-slate-100 text-slate-500'
                                        }`}>
                                        {ticket.status}
                                    </div>
                                    <div className="text-\[11px\] font-black text-slate-400 uppercase">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 truncate font-['Outfit']">{ticket.subject}</h3>
                                <div className="flex items-center gap-2 text-\[13px\] font-black text-slate-400 uppercase tracking-widest">
                                    <MessageSquare size={12} />
                                    {ticket.messages.length} Correspondence
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 text-center">
                            <LifeBuoy size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-400 text-base font-black uppercase tracking-widest">No Active Tickets</p>
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-8 flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 backdrop-blur-sm sticky top-0 z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 font-['Outfit']">{selectedTicket.subject}</h2>
                                        <div className="flex items-center gap-2 text-\[13px\] font-bold text-slate-400 uppercase tracking-widest">
                                            <div className={`w-2 h-2 rounded-full ${selectedTicket.assignedTo ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`} />
                                            {selectedTicket.assignedTo ? 'Connected with Architect' : 'Awaiting Assignment'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`px-4 py-2 rounded-xl text-\[13px\] font-black uppercase tracking-widest border ${selectedTicket.priority === 'urgent' ? 'bg-rose-50 border-rose-100 text-rose-500' :
                                            'bg-slate-50 border-slate-100 text-slate-500'
                                        }`}>
                                        {selectedTicket.priority} Priority
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                                    <p className="text-\[13px\] font-black text-slate-400 uppercase tracking-widest mb-2">Original Inquiry</p>
                                    <p className="text-base font-medium text-slate-700 leading-relaxed">{selectedTicket.issue}</p>
                                </div>

                                {selectedTicket.messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === currentUser?._id
                                                ? 'bg-slate-900 text-white rounded-br-none'
                                                : 'bg-slate-100 text-slate-700 rounded-bl-none'
                                            }`}>
                                            <p className="text-base font-medium leading-relaxed">{msg.text}</p>
                                            <p className={`text-\[11px\] mt-2 font-black uppercase tracking-widest ${msg.sender === currentUser?._id ? 'text-white/40' : 'text-slate-400'
                                                }`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-8 bg-slate-50/30 border-t border-slate-50">
                                <form onSubmit={handleSendMessage} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 pr-16 text-base font-bold outline-none focus:border-sky-500 transition-all placeholder:text-slate-300 shadow-lg shadow-slate-200/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="absolute right-2 top-2 bottom-2 aspect-square bg-sky-500 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-all disabled:opacity-50 disabled:bg-slate-400 shadow-lg shadow-sky-500/20"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                                <MessageCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] mb-2">Select a channel</h2>
                            <p className="text-base text-slate-400 font-medium max-w-xs">Initialize a correspondence to resolve technical roadblocks.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {showNewTicketModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewTicketModal(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl"
                        >
                            <h2 className="text-3xl font-black text-slate-900 mb-8 font-['Outfit'] italic">New <span className="text-sky-500">Inquiry</span></h2>

                            <form onSubmit={handleCreateTicket} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-\[13px\] font-black text-slate-400 uppercase ml-1">Subject Matter</label>
                                    <input
                                        required
                                        placeholder="e.g. Authentication Node Error"
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all"
                                        value={newTicketData.subject}
                                        onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-\[13px\] font-black text-slate-400 uppercase ml-1">Technical Details</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Describe the roadblock in detail..."
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-sky-500 transition-all resize-none"
                                        value={newTicketData.issue}
                                        onChange={(e) => setNewTicketData({ ...newTicketData, issue: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-\[13px\] font-black text-slate-400 uppercase ml-1">Priority Protocol</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['medium', 'urgent'].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setNewTicketData({ ...newTicketData, priority: p })}
                                                className={`py-3 rounded-xl text-\[13px\] font-black uppercase tracking-widest border-2 transition-all ${newTicketData.priority === p
                                                        ? 'bg-sky-50 border-sky-500 text-sky-600'
                                                        : 'bg-white border-slate-100 text-slate-400'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-\[13px\] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all mt-4"
                                >
                                    Initialize Inquiry
                                </button>
                            </form>

                            <button
                                onClick={() => setShowNewTicketModal(false)}
                                className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupportPage;
