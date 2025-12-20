import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { io } from 'socket.io-client';
import { PortalContext } from '../Context/PortalProvider';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
});

const ChatSupport = () => {
    const { user } = useContext(PortalContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (user?._id) {
            socket.emit('authenticate', user._id);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen && !ticket && user) {
            initializeChat();
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleMessage = (data) => {
            if (data.ticketId === ticket?._id) {
                setMessages(prev => {
                    const exists = prev.find(m => m._id === data.message._id);
                    if (exists) return prev;
                    return [...prev, {
                        ...data.message,
                        type: data.message.sender === user?._id ? 'user' : 'associate'
                    }];
                });
            }
        };

        socket.on('support:message_received', handleMessage);

        return () => {
            socket.off('support:message_received', handleMessage);
        };
    }, [ticket, user]);

    const initializeChat = async () => {
        setLoading(true);
        try {
            const res = await api.get('/support/tickets');
            // Look for active chat session
            const existingChat = res.data.tickets.find(t =>
                t.subject === 'Live Chat Session' &&
                t.status !== 'closed'
            );

            if (existingChat) {
                setTicket(existingChat);
                setMessages(existingChat.messages.map(m => ({
                    ...m,
                    type: (m.sender?._id || m.sender) === user?._id ? 'user' : 'associate'
                })));
            } else {
                setMessages([{ type: 'bot', text: 'Connecting you with a Growth Associate... 👋' }]);
            }
        } catch (error) {
            console.error('Failed to init chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !user || isSending) return;

        const userMsg = input;
        setInput("");
        setIsSending(true);

        try {
            let currentTicket = ticket;
            if (!currentTicket) {
                const res = await api.post('/support/tickets', {
                    subject: 'Live Chat Session',
                    issue: userMsg,
                    priority: 'medium'
                });
                currentTicket = res.data.ticket;
                setTicket(currentTicket);
                setMessages([{ type: 'user', text: userMsg }]);
            } else {
                const res = await api.post(`/support/tickets/${currentTicket._id}/messages`, { text: userMsg });
                const newMsg = res.data.ticket.messages[res.data.ticket.messages.length - 1];
                setMessages(prev => [...prev, { ...newMsg, type: 'user' }]);
            }
        } catch (error) {
            console.error('Chat failed:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleResolve = async () => {
        if (!ticket) return;
        try {
            await api.put(`/support/tickets/${ticket._id}/close`);
            setTicket(null);
            setMessages(prev => [...prev, { type: 'bot', text: 'This session has been marked as resolved. 👋' }]);

            // Optional: Close modal after short delay
            setTimeout(() => {
                setIsOpen(false);
                setMessages([]); // Reset for next time
            }, 2000);
        } catch (error) {
            console.error('Failed to resolve ticket:', error);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-slate-950 border border-slate-800 w-80 md:w-96 rounded-[2rem] shadow-2xl overflow-hidden mb-4 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#F5AFAF] p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-950/10 p-2.5 rounded-2xl backdrop-blur-md border border-slate-950/10">
                                    <MessageSquare className="text-slate-950 w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-slate-950 font-black text-base uppercase tracking-tight">Growth Hotline</h3>
                                    <p className="text-slate-950/60 text-[13px] font-bold flex items-center gap-1 uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Live Architect
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {ticket && (
                                    <button
                                        onClick={handleResolve}
                                        className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/80 hover:text-green-400 hover:bg-green-400/20 transition-all border border-transparent hover:border-green-400/50"
                                        title="Mark as Resolved"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-xl bg-slate-950/10 flex items-center justify-center text-slate-950/80 hover:text-slate-950 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="h-[400px] bg-slate-950 p-6 overflow-y-auto space-y-4 custom-scrollbar"
                        >
                            {loading && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                                    <Loader2 className="animate-spin" size={24} />
                                    <span className="text-[13px] font-black uppercase tracking-widest">Syncing Nodes...</span>
                                </div>
                            )}

                            {!loading && messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-[1.25rem] p-4 text-base font-medium leading-relaxed ${msg.type === 'user'
                                        ? 'bg-[#F5AFAF] text-slate-950 rounded-br-none shadow-lg shadow-[#F5AFAF]/20'
                                        : 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Query architecture..."
                                className="flex-1 bg-slate-950 text-white text-base font-bold rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-[#F5AFAF]/50 transition-all placeholder:text-slate-600"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isSending}
                                className="bg-[#F5AFAF] hover:bg-[#F5AFAF]/90 text-slate-950 p-3 rounded-xl transition-all shadow-lg shadow-[#F5AFAF]/20 disabled:opacity-50 active:scale-95"
                            >
                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={3} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#F5AFAF] hover:bg-[#F5AFAF]/90 text-slate-950 w-16 h-16 rounded-[1.5rem] shadow-2xl shadow-[#F5AFAF]/30 flex items-center justify-center transition-all group"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />}
            </motion.button>
        </div>
    );
};

export default ChatSupport;
