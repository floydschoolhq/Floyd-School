import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Clock, Trash2, ArrowLeft, Users, Monitor, Shield, ExternalLink } from 'lucide-react';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import api from '../../api/axios';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
});

const LiveSessionView = ({ liveClass, onBack }) => {
    const [myDoubt, setMyDoubt] = useState(null);
    const [isSignaling, setIsSignaling] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);

    useEffect(() => {
        fetchMyCurrentDoubt(liveClass._id);
        socket.emit('liveClass:join', liveClass._id);

        socket.on('liveClass:countUpdate', ({ count }) => {
            setParticipantCount(count);
        });

        socket.on('doubt:resolved', (resolvedDoubt) => {
            setMyDoubt(prev => (prev?._id === resolvedDoubt._id ? { ...prev, isResolved: true } : prev));
        });

        socket.on('doubt:deleted', (deletedDoubtId) => {
            if (myDoubt && myDoubt._id === deletedDoubtId) {
                setMyDoubt(null);
            }
        });

        return () => {
            socket.off('liveClass:countUpdate');
            socket.off('doubt:resolved');
            socket.off('doubt:deleted');
        };
    }, [liveClass._id]);

    const fetchMyCurrentDoubt = async (classId) => {
        try {
            const res = await api.get(`/doubts/${classId}/my`);
            setMyDoubt(res.data);
        } catch (error) {
            // No doubt exists
        }
    };

    const handleRaiseHand = async () => {
        if (!liveClass || myDoubt) return;
        setIsSignaling(true);
        try {
            const res = await api.post('/doubts', {
                liveClassId: liveClass._id,
                question: 'Student is requesting technical assistance or has a live doubt.'
            });
            setMyDoubt(res.data);
        } catch (error) {
            console.error('Failed to signal mentor:', error);
        } finally {
            setIsSignaling(false);
        }
    };

    const handleTerminateDoubt = async () => {
        if (!myDoubt) return;
        try {
            const doubtId = myDoubt._id;
            setMyDoubt(null);
            await api.delete(`/doubts/${doubtId}`);
        } catch (error) {
            console.error('Failed to terminate doubt:', error);
        }
    };

    const getEmbedUrl = () => {
        const { platform, meetingLink } = liveClass;
        if (platform === 'youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = meetingLink.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
        }
        if (platform === 'jitsi') {
            // Jitsi links usually look like https://meet.jit.si/RoomName
            // Embed URL is same but we can use the Jitsi IFrame API or just the URL
            return meetingLink;
        }
        return null;
    };

    const embedUrl = getEmbedUrl();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-tight font-['Outfit'] italic">
                            LIVE <span className="text-[#2563EB] not-italic">SESSION</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                            {liveClass.title} • {liveClass.topic}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-xl border border-sky-100">
                        <Users className="w-4 h-4 text-sky-500" />
                        <span className="text-xs font-black text-sky-600 uppercase tracking-widest">{participantCount} Watching</span>
                    </div>

                    {myDoubt ? (
                        <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border-2 text-xs ${myDoubt.isResolved
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                            }`}>
                            {myDoubt.isResolved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            <span className="uppercase tracking-widest">
                                {myDoubt.isResolved ? 'Resolved' : 'Signaled'}
                            </span>
                            {myDoubt.isResolved && (
                                <button
                                    onClick={handleTerminateDoubt}
                                    className="ml-2 bg-blue-100/50 hover:bg-blue-100 text-blue-600 p-1 rounded-lg transition-colors"
                                >
                                    <Trash2 size={10} strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleRaiseHand}
                            disabled={isSignaling}
                            className="bg-slate-900 border-2 border-slate-900 hover:bg-white hover:text-slate-900 text-white px-5 py-2 rounded-xl font-black transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
                        >
                            {isSignaling ? 'Signaling...' : 'Raise Hand'}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Stage Area */}
                <div className="flex-1 bg-slate-900 relative flex flex-col">
                    <div className="flex-1 relative overflow-hidden">
                        {embedUrl ? (
                            <iframe
                                className="w-full h-full border-0"
                                src={embedUrl}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                title="Live Stream"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay bg-black/80">
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mb-8 animate-pulse">
                                    <Monitor className="text-[#2563EB] w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">External Link Detected</h2>
                                <p className="text-slate-400 max-w-md mx-auto font-medium mb-10 leading-relaxed">
                                    This session is using a secure external platform ({liveClass.platform?.toUpperCase() || 'EXTERNAL'}). Please bridge the connection using the satellite link below.
                                </p>
                                <a
                                    href={liveClass.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#2563EB] hover:bg-white text-slate-950 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-2xl shadow-[#2563EB]/20 flex items-center gap-3"
                                >
                                    Join Meeting <ExternalLink size={20} strokeWidth={3} />
                                </a>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-40">
                                    <Shield size={14} className="text-white" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure Connection</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Overlay for Stream */}
                    <div className="absolute top-6 left-6 pointer-events-none">
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest italic">{liveClass.platform === 'youtube' ? 'Live' : 'Real-time'} Stream</span>
                        </div>
                    </div>
                </div>

                {/* Terminal/Chat Area */}
                <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
                    <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <PlayCircle size={16} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Live Chat</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chat Room</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <LiveChatSidebar classId={liveClass._id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveSessionView;
