import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, MessageCircle, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';

const LiveChatSidebar = ({ classId }) => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [studentCount, setStudentCount] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (classId) {
            fetchMessages();

            if (socket) {
                socket.emit('liveClass:join', classId);

                socket.on('liveClass:message', (msg) => {
                    setMessages(prev => [...prev, msg]);
                });

                socket.on('liveClass:countUpdate', ({ count }) => {
                    setStudentCount(count);
                });
            }

            return () => {
                if (socket) {
                    socket.off('liveClass:message');
                    socket.off('liveClass:countUpdate');
                }
            };
        }
    }, [classId, socket]);

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
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 shadow-2xl">
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
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-800">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        placeholder="Broadcast response..."
                        className="w-full bg-slate-950 text-white text-[11px] font-bold rounded-xl pl-4 pr-12 py-3 border-2 border-slate-800 focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-700"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-1.5 top-1.5 p-2 bg-sky-500 text-white rounded-lg shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Send size={14} strokeWidth={3} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LiveChatSidebar;
