import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, MessageCircle, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
});

const LiveChatSidebar = ({ classId, user }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [studentCount, setStudentCount] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (classId) {
            fetchMessages();
            socket.emit('liveClass:join', classId);

            socket.on('liveClass:message', (msg) => {
                setMessages(prev => [...prev, msg]);
            });

            socket.on('liveClass:countUpdate', ({ count }) => {
                setStudentCount(count);
            });

            return () => {
                socket.off('liveClass:message');
                socket.off('liveClass:countUpdate');
            };
        }
    }, [classId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/live-chat/${classId}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await api.post('/live-chat', {
                classId,
                text: input
            });
            setInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-80 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight flex items-center gap-2">
                        Class <span className="text-blue-500 font-black">Transmission</span>
                    </h3>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded-lg">
                        <Users size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-500">{studentCount}</span>
                    </div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Interaction Active</p>
            </div>

            {/* Chat Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className="group">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[10px] font-black uppercase tracking-tight ${msg.role === 'mentor' || msg.role === 'admin' ? 'text-amber-500' : 'text-slate-400'
                                }`}>
                                {msg.senderName}
                            </span>
                            {(msg.role === 'mentor' || msg.role === 'admin') && (
                                <ShieldCheck size={10} className="text-amber-500" />
                            )}
                            <span className="text-[8px] font-bold text-slate-600 ml-auto">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className={`text-xs leading-relaxed font-medium transition-colors ${msg.role === 'mentor' || msg.role === 'admin' ? 'text-white' : 'text-slate-300'
                            }`}>
                            {msg.text}
                        </p>
                    </div>
                ))}

                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                        <MessageCircle size={48} className="text-slate-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awaiting Signal...</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-800">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Broadcast message..."
                        className="w-full bg-slate-950 text-white text-[11px] font-bold rounded-xl pl-4 pr-12 py-3 border-2 border-slate-800 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-1.5 top-1.5 p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Send size={14} strokeWidth={3} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LiveChatSidebar;
