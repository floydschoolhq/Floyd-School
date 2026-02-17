
import React, { useState, useEffect } from 'react';
import {
    Monitor, Users, Shield, Zap, Search,
    Play, Eye, EyeOff, Radio, Signal,
    ChevronRight, ExternalLink, RefreshCw, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import AgoraRTC, {
    AgoraRTCProvider,
    useRTCClient,
    RemoteUser,
    useRemoteUsers,
    useJoin
} from 'agora-rtc-react';

const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || "PLACEHOLDER_APP_ID";

const LiveMonitoring = () => {
    const [activeClasses, setActiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchActiveClasses();
        const interval = setInterval(fetchActiveClasses, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveClasses = async () => {
        try {
            const res = await api.get('/live-classes/active-all');
            setActiveClasses(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
        } catch (error) {
            console.error('Failed to fetch active classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const filteredClasses = activeClasses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                            <Monitor size={28} />
                        </div>
                        LIVE <span className="text-orange-500">SESSION MONITOR</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px] ml-1">
                        Operational support oversight for all active instructional frequencies.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search active sessions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl font-bold text-slate-900 outline-none focus:border-orange-500 transition-all w-64 text-xs"
                        />
                    </div>
                    <button
                        onClick={() => { setLoading(true); fetchActiveClasses(); }}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {selectedClass ? (
                    <motion.div
                        key="observation-mode"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => setSelectedClass(null)}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest group"
                        >
                            <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Return to Grid View
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl relative aspect-video">
                                {selectedClass.platform === 'agora' ? (
                                    <SilentObservationRoom
                                        appId={AGORA_APP_ID}
                                        channelName={selectedClass.channelName}
                                        token={selectedClass.token}
                                    />
                                ) : (selectedClass.platform === 'youtube' || selectedClass.platform === 'premiere') && getYouTubeId(selectedClass.meetingLink) ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${getYouTubeId(selectedClass.meetingLink)}?autoplay=1&rel=0&modestbranding=1&controls=0`}
                                        title="Live Session Monitor"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 border border-orange-100">
                                            <Heart className="text-orange-500" size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">External Stream Portal</h3>
                                        <p className="text-slate-500 text-xs max-w-sm mb-8 font-medium">
                                            This node uses {selectedClass.platform.toUpperCase()}.
                                            Access is available via the external satellite link below.
                                        </p>
                                        <a
                                            href={selectedClass.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-8 py-4 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/10"
                                        >
                                            Bridge External Link <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Session Intelligence</h3>
                                    <div className="space-y-4">
                                        <NodeInfo label="Mentor" value={selectedClass.mentorName} />
                                        <NodeInfo label="Session" value={selectedClass.title} />
                                        <NodeInfo label="Focus" value={selectedClass.topic} />
                                        <NodeInfo label="Status" value="Operational" color="text-emerald-500" />
                                        <NodeInfo label="Protocol" value={selectedClass.platform.toUpperCase()} />
                                    </div>
                                </div>

                                <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-white">
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic text-center">Support Toolkit</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase leading-relaxed mb-6 text-center">
                                        Associates monitor session health and provide tactical support to instructional staff.
                                    </p>
                                    <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                        Signal Mentor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map(c => (
                                <ClassCard
                                    key={c._id}
                                    liveClass={c}
                                    onObserve={() => setSelectedClass(c)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                                    <Signal size={32} className="text-slate-400" />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No Instructional Signals Detected</p>
                                <p className="text-slate-400 font-bold text-xs mt-2 italic">Waiting for instructional uplink...</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ClassCard = ({ liveClass, onObserve }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-orange-500/50 transition-all group relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
            <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${liveClass.platform === 'agora' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {liveClass.platform === 'agora' && <Zap size={10} fill="currentColor" />}
                {liveClass.platform}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,1)]"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Live</span>
            </div>
        </div>

        <div className="mb-8">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{liveClass.mentorName}</p>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-orange-500 transition-colors line-clamp-1">{liveClass.title}</h4>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1 italic">{liveClass.topic}</p>
        </div>

        <div className="flex items-center gap-4">
            <button
                onClick={onObserve}
                className="flex-1 py-4 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/10 hover:bg-orange-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
                <Eye size={16} />
                Monitor
            </button>
            <a
                href={liveClass.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100"
            >
                <ExternalLink size={18} />
            </a>
        </div>
    </div>
);

const NodeInfo = ({ label, value, color = "text-slate-900" }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest truncate max-w-[150px] ${color}`}>{value}</span>
    </div>
);


const SilentObservationRoom = ({ appId, channelName, token }) => {
    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "live", role: "audience" }));

    return (
        <AgoraRTCProvider client={client}>
            <ObservationFeed
                appId={appId}
                channelName={channelName}
                token={token}
            />
        </AgoraRTCProvider>
    );
};

const ObservationFeed = ({ appId, channelName, token }) => {
    const [isMuted, setIsMuted] = useState(true);
    const remoteUsers = useRemoteUsers();

    useJoin({ appid: appId, channel: channelName, token: token, uid: 0 });

    const hostUser = remoteUsers.find(user => user.videoTrack);

    return (
        <div className="w-full h-full bg-black relative group">
            {hostUser ? (
                <RemoteUser
                    user={hostUser}
                    playAudio={!isMuted}
                    playVideo={true}
                    className="w-full h-full object-contain"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-center p-12">
                    <Signal className="text-slate-800 mb-6" size={48} />
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Signal Stream...</p>
                </div>
            )}

            <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="px-3 py-1.5 bg-sky-500 text-white rounded-full flex items-center gap-2 shadow-lg shadow-sky-500/20">
                    <Eye size={12} strokeWidth={3} />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Silent Observer</span>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-4">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isMuted ? 'text-red-500 hover:bg-red-500/10' : 'text-sky-500 hover:bg-sky-500/10'}`}
                >
                    {isMuted ? 'Muted' : 'Audio On'}
                </button>
            </div>
        </div>
    );
};

export default LiveMonitoring;
