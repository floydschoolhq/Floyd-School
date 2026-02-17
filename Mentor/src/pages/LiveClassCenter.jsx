import React, { useState, useEffect } from 'react';
import {
    Video,
    Layout,
    Users,
    MessageSquare,
    Check,
    Loader2,
    Play,
    AlertCircle,
    Link as LinkIcon,
    ExternalLink,
    Square,
    Lock,
    Unlock,
    MessageCircle,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import LiveChatSidebar from '../components/LiveChatSidebar';
import LiveRoom from '../components/LiveRoom';

const LiveClassCenter = () => {
    const socket = useSocket();
    const toast = useToast();
    const [activeClass, setActiveClass] = useState(null);
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentCount, setStudentCount] = useState(0);
    const [activeTab, setActiveTab] = useState('doubts'); // 'doubts' or 'chat'
    const [doubtsLoading, setDoubtsLoading] = useState(false);

    // YouTube Helper
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const [starting, setStarting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('agora');
    const [meetingLink, setMeetingLink] = useState('');
    const [durationMin, setDurationMin] = useState(60);
    const [durationSec, setDurationSec] = useState(0);
    const [error, setError] = useState('');

    // Premiere selection state
    const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [searchingRecordings, setSearchingRecordings] = useState(false);

    const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || "PLACEHOLDER_APP_ID"; // User will need to provide this

    useEffect(() => {
        fetchActiveClass();
    }, []);

    useEffect(() => {
        if (activeClass) {
            fetchDoubts();

            if (socket) {
                socket.on('doubt:new', (newDoubt) => {
                    if (newDoubt.liveClass === activeClass._id) {
                        setDoubts(prev => [newDoubt, ...prev]);
                        toast.info(`New signal from ${newDoubt.studentName}`);
                    }
                });

                socket.on('doubt:resolved', (resolvedDoubt) => {
                    setDoubts(prev => prev.map(d =>
                        d._id === resolvedDoubt._id ? { ...d, isResolved: true } : d
                    ));
                });

                socket.on('liveClass:countUpdate', ({ count }) => {
                    setStudentCount(count);
                });

                socket.on('doubt:deleted', (deletedDoubtId) => {
                    setDoubts(prev => prev.filter(d => d._id !== deletedDoubtId));
                    toast.info('Doubt terminated by student');
                });

                socket.emit('liveClass:join', activeClass._id);
            }

            return () => {
                if (socket) {
                    socket.off('doubt:new');
                    socket.off('doubt:resolved');
                }
            };
        }
    }, [activeClass, socket]);

    const fetchActiveClass = async () => {
        try {
            const res = await api.get('/live-classes/active');
            setActiveClass(res.data);
        } catch (err) {
            console.error('Failed to fetch active class:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoubts = async () => {
        if (!activeClass) return;
        setDoubtsLoading(true);
        try {
            const res = await api.get(`/doubts/${activeClass._id}`);
            setDoubts(res.data);
        } catch (err) {
            console.error('Failed to fetch doubts:', err);
        } finally {
            setDoubtsLoading(false);
        }
    };

    const fetchCoursesForPremiere = async () => {
        setSearchingRecordings(true);
        try {
            const res = await api.get('/courses');
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setCourses(data);
            setIsRecordingModalOpen(true);
        } catch (err) {
            toast.error('Failed to access archives');
            console.error(err);
        } finally {
            setSearchingRecordings(false);
        }
    };

    const handleSelectRecording = (module) => {
        setMeetingLink(module.videoUrl);
        if (!title) setTitle(`Premiere: ${module.title}`);
        if (!topic) setTopic(module.description || 'Simulated Live Broadcast');
        if (module.duration) {
            setDurationMin(Math.floor(module.duration / 60));
            setDurationSec(module.duration % 60);
        }
        setIsRecordingModalOpen(false);
        toast.info(`Linked: ${module.title}`);
    };

    useEffect(() => {
        const preventContext = (e) => e.preventDefault();
        window.addEventListener('contextmenu', preventContext);
        return () => window.removeEventListener('contextmenu', preventContext);
    }, []);

    const handleStart = async (e) => {
        e.preventDefault();
        setStarting(true);
        setError('');

        try {
            const res = await api.post('/live-classes/start', {
                title,
                topic,
                platform,
                meetingLink,
                duration: (durationMin * 60) + parseInt(durationSec || 0)
            });
            setActiveClass(res.data);
            toast.success('Live broadcast node established');
            setTitle('');
            setTopic('');
            setMeetingLink('');
        } catch (err) {
            let msg = err.response?.data?.message || 'Failed to initiate live session';
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                msg += ': ' + err.response.data.errors.join(', ');
            }
            setError(msg);
            toast.error(msg);
        } finally {
            setStarting(false);
        }
    };

    const handleEnd = async () => {
        if (!activeClass) return;
        if (!window.confirm('Are you sure you want to terminate this broadcast?')) return;

        try {
            await api.put(`/live-classes/${activeClass._id}/end`);
            setActiveClass(null);
            setDoubts([]);
            toast.success('Broadcast session terminated');
        } catch (err) {
            toast.error('Failed to end current session');
            console.error('Failed to end class:', err);
        }
    };

    const handleResolveDoubt = async (id) => {
        try {
            await api.patch(`/doubts/${id}/resolve`);
            setDoubts(prev => prev.map(d => d._id === id ? { ...d, isResolved: true } : d));
        } catch (err) {
            console.error('Failed to resolve doubt:', err);
        }
    };

    const unresolvedDoubts = doubts.filter(d => !d.isResolved);

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Live Session <span className="text-sky-500">Command Center</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Broadcast knowledge in real-time to your students.
                    </p>
                </div>
                {activeClass && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
                            <Users size={16} className="text-sky-500" />
                            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{studentCount} Active</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Now</span>
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Control Panel */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {!activeClass ? (
                            <motion.div
                                key="start-form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                                        <Video size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase">Initialize Session</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Connect with your audience</p>
                                    </div>
                                </div>

                                <form onSubmit={handleStart} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Masterclass on Advanced System Design"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Focus Area (Topic)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Distributed Databases & Consensus"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Streaming Platform</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {[
                                                { id: 'agora', label: 'Inbuilt (Agora)' },
                                                { id: 'premiere', label: 'Simulated Live' },
                                                { id: 'youtube', label: 'YouTube' },
                                                { id: 'jitsi', label: 'Jitsi Meet' },
                                                { id: 'google-meet', label: 'Google Meet' },
                                                { id: 'zoom', label: 'Zoom' }
                                            ].map(p => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setPlatform(p.id)}
                                                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${platform === p.id
                                                        ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
                                                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-sky-200'
                                                        }`}
                                                >
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            {platform === 'agora' ? 'Broadcast Mode' : 'Satellite Link (Meeting URL)'}
                                        </label>
                                        <div className="relative">
                                            <LinkIcon className={`absolute left-4 top-1/2 -translate-y-1/2 ${platform === 'agora' ? 'text-sky-500' : 'text-slate-400'}`} size={18} />
                                            {platform === 'agora' ? (
                                                <div className="w-full bg-sky-50 border-2 border-sky-100 p-4 pl-12 rounded-2xl font-bold text-sky-700">
                                                    Inbuilt Studio Mode Selected
                                                </div>
                                            ) : platform === 'premiere' ? (
                                                <div className="flex gap-3">
                                                    <input
                                                        type="url"
                                                        placeholder="Paste Video Source URL (YouTube/Drive/etc) OR use Archive -->"
                                                        value={meetingLink}
                                                        onChange={(e) => setMeetingLink(e.target.value)}
                                                        required
                                                        className="flex-1 bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={fetchCoursesForPremiere}
                                                        disabled={searchingRecordings}
                                                        className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        {searchingRecordings ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                                                        Archive
                                                    </button>
                                                </div>
                                            ) : (
                                                <input
                                                    type="url"
                                                    placeholder="Paste any meeting link (Google Meet, Zoom, YouTube, etc.)"
                                                    value={meetingLink}
                                                    onChange={(e) => setMeetingLink(e.target.value)}
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Session Duration (Manual Input)
                                            </label>
                                            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                                                Precision Timing
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Min"
                                                        value={durationMin}
                                                        onChange={(e) => setDurationMin(parseInt(e.target.value) || 0)}
                                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Min</span>
                                                </div>
                                                <div className="relative flex-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        placeholder="Sec"
                                                        value={durationSec}
                                                        onChange={(e) => setDurationSec(parseInt(e.target.value) || 0)}
                                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Sec</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-950 border border-slate-800 px-4 py-4 rounded-2xl text-xs font-black text-sky-400 min-w-[100px] text-center shadow-lg">
                                                {Math.floor(durationMin / 60)}h {durationMin % 60}m {durationSec}s
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-black uppercase">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        disabled={starting}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-sky-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {starting ? 'Acquiring Uplink...' : (
                                            <>
                                                <Play size={20} className="fill-current" />
                                                Initiate Broadcast
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            activeClass.platform === 'agora' ? (
                                <LiveRoom
                                    appId={AGORA_APP_ID}
                                    channelName={activeClass.channelName}
                                    token={activeClass.token}
                                    uid={0}
                                    onEndClass={handleEnd}
                                />
                            ) : (
                                <motion.div
                                    key="active-session"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl text-white overflow-hidden relative h-full flex flex-col justify-center"
                                >
                                    {/* Visualizer effect */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
                                                <Video size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{activeClass.title}</h3>
                                                <p className="text-sky-400 font-bold uppercase tracking-widest text-xs mt-2">{activeClass.topic}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Broadcast Node */}
                                            {getYouTubeId(activeClass.meetingLink) ? (
                                                <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-slate-700 shadow-2xl relative group/preview">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${getYouTubeId(activeClass.meetingLink)}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&fs=0`}
                                                        title="YouTube Live Session"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        className="relative z-10 pointer-events-none"
                                                    ></iframe>

                                                    {/* Secure Intercept Overlay for Mentor */}
                                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-transparent pointer-events-auto">
                                                        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex items-start justify-between px-6 pt-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
                                                                <span className="text-[8px] font-black text-sky-400 uppercase tracking-[0.3em] font-mono">PREVIEW_SECURE // MONITOR_ONLY</span>
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-0 border-[10px] border-slate-900/50 pointer-events-none"></div>
                                                    </div>

                                                    <div className="absolute top-4 right-4 z-30 bg-rose-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                                                        Live Broadcast
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4">
                                                        <Video className="text-white/20" size={32} />
                                                    </div>
                                                    <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Standard Signal Active</p>
                                                    <p className="text-white/10 text-[10px] mt-2 max-w-[200px]">Uplink established via Zoom/Meet. Preview unavailable for standard protocols.</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Depth</p>
                                                    <p className="text-2xl font-black text-white">{unresolvedDoubts.length} <span className="text-sky-400 text-xs leading-none uppercase">Queries</span></p>
                                                </div>
                                                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-lg font-black text-emerald-400 uppercase tracking-widest mt-1">Operational</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <a
                                                href={activeClass.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-400 hover:text-white transition-all shadow-xl active:scale-[0.98]"
                                            >
                                                Join Main Space
                                                <ExternalLink size={18} />
                                            </a>
                                            <button
                                                onClick={handleEnd}
                                                className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98]"
                                            >
                                                <Square size={18} className="fill-current" />
                                                Terminate Session
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>

                {/* Doubt Queue & Live Chat Tabs */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] max-h-[800px]">
                        {/* Tab Header */}
                        <div className="flex bg-slate-900 p-2 gap-2">
                            <button
                                onClick={() => setActiveTab('doubts')}
                                className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'doubts'
                                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <AlertCircle size={14} />
                                Doubt Queue
                                {unresolvedDoubts.length > 0 && (
                                    <span className="bg-rose-500 text-[8px] px-1.5 py-0.5 rounded-full">{unresolvedDoubts.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'chat'
                                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <MessageCircle size={14} />
                                Live Chat
                            </button>
                        </div>

                        {activeTab === 'doubts' ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
                                    {doubts.length > 0 ? (
                                        doubts.map((doubt, idx) => (
                                            <motion.div
                                                key={doubt._id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`p-5 rounded-2xl border transition-all ${doubt.isResolved
                                                    ? 'bg-slate-100 border-slate-200 opacity-60'
                                                    : 'bg-white border-slate-200 shadow-sm hover:border-sky-300'}`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{doubt.studentName}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                                            {new Date(doubt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    {!doubt.isResolved && (
                                                        <button
                                                            onClick={() => handleResolveDoubt(doubt._id)}
                                                            className="p-1.5 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-500 hover:text-white transition-all"
                                                        >
                                                            <Check size={14} strokeWidth={3} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className={`text-xs font-bold ${doubt.isResolved ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                                    {doubt.question}
                                                </p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-20">
                                            <MessageSquare size={48} className="mb-4" />
                                            <p className="font-black uppercase text-[10px] tracking-[0.2em]">Queue Neutral</p>
                                            <p className="text-[9px] font-bold mt-1 uppercase">Waiting for student signals...</p>
                                        </div>
                                    )}
                                </div>

                                {activeClass && (
                                    <div className="p-4 bg-white border-t border-slate-100">
                                        <button
                                            onClick={fetchDoubts}
                                            className="w-full py-2 text-[9px] font-black uppercase text-slate-400 hover:text-sky-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            Force Resync Queue <Loader2 size={12} className={doubtsLoading ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {activeClass ? (
                                    <LiveChatSidebar classId={activeClass._id} />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-10">
                                        <MessageCircle size={48} className="mb-4" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Chat Offline</p>
                                        <p className="text-[9px] font-bold mt-2 uppercase">Initialize session to activate terminal</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Recording Selection Modal */}
            <AnimatePresence>
                {isRecordingModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRecordingModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase">Select from Archive</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bridging curriculum modules to live events</p>
                                </div>
                                <button
                                    onClick={() => setIsRecordingModalOpen(false)}
                                    className="p-3 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    <Square size={20} className="text-slate-400 rotate-45" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                                {courses.length > 0 ? (
                                    courses.map(course => (
                                        <div key={course._id} className="space-y-3">
                                            <h4 className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em] ml-1">{course.title}</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {(course.modules || []).filter(m => m.videoUrl).map(module => (
                                                    <button
                                                        key={module._id}
                                                        onClick={() => handleSelectRecording(module)}
                                                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-sky-300 hover:bg-white transition-all group"
                                                    >
                                                        <div className="flex items-center gap-4 text-left">
                                                            <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-sky-500 transition-colors">
                                                                <Play size={16} className="fill-current" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 line-clamp-1">{module.title}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase">Module Resource</p>
                                                            </div>
                                                        </div>
                                                        <Check size={18} className="text-slate-200 group-hover:text-sky-500 transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center py-20 opacity-30">
                                        <Video size={48} className="mb-4" />
                                        <p className="font-black uppercase text-xs tracking-widest">No recordings found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveClassCenter;
