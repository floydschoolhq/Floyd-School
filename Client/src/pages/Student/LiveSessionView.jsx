import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Clock, Trash2, ArrowLeft, Users, Monitor, Shield, ExternalLink, Maximize, Minimize } from 'lucide-react';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';
import api from '../../api/axios';
import { useSocket } from '../../contexts/SocketProvider';
import { PortalContext } from '../../contexts/PortalProvider';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const LiveSessionView = ({ liveClass: propLiveClass, onBack: propOnBack }) => {
    const { socket } = useSocket();
    const { activeLiveClass: contextLiveClass, setActiveLiveClass: setContextLiveClass, setView, user } = useContext(PortalContext);
    
    const [fetchedLiveClass, setFetchedLiveClass] = useState(null);
    const [loading, setLoading] = useState(!propLiveClass && !contextLiveClass);
    const [myDoubt, setMyDoubt] = useState(null);
    const [isSignaling, setIsSignaling] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const stageRef = useRef(null);

    const liveClass = propLiveClass || contextLiveClass || fetchedLiveClass;
    const onBack = propOnBack || (() => setView('Classroom'));

    const toggleFullscreen = () => {
        if (!stageRef.current) return;
        if (!document.fullscreenElement) {
            stageRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    useEffect(() => {
        if (!liveClass || !socket) return;
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

        socket.on('liveClass:ended', (classId) => {
            if (liveClass && liveClass._id === classId) {
                setFetchedLiveClass(null);
                setContextLiveClass(null);
            }
        });

        socket.on('scheduledLive:ended', (liveId) => {
            if (liveClass && liveClass._id === liveId) {
                setFetchedLiveClass(null);
                setContextLiveClass(null);
            }
        });

        return () => {
            socket.off('liveClass:countUpdate');
            socket.off('doubt:resolved');
            socket.off('doubt:deleted');
            socket.off('liveClass:ended');
            socket.off('scheduledLive:ended');
        };
    }, [liveClass?._id, socket]);

    useEffect(() => {
        const preventContext = (e) => e.preventDefault();
        window.addEventListener('contextmenu', preventContext);
        return () => window.removeEventListener('contextmenu', preventContext);
    }, []);

    // IMPORTANT: fetchMyCurrentDoubt must be defined before any early returns
    // to avoid "cannot access before initialization" errors in production builds.
    const fetchMyCurrentDoubt = async (classId) => {
        try {
            const res = await api.get(`/doubts/${classId}/my`);
            if (res.data) {
                setMyDoubt(res.data);
            } else {
                setMyDoubt(null);
            }
        } catch (error) {
            // No doubt exists - this is expected
        }
    };

    useEffect(() => {
        if (propLiveClass || contextLiveClass) {
            setLoading(false);
            return;
        }

        const fetchActiveSession = async () => {
            try {
                // Try fetching standard active live class
                const res = await api.get('/live-classes/active');
                if (res.data) {
                    const courseId = res.data.course?._id || res.data.course || '';
                    const userGrantedCourses = user?.permissions?.grantedCourses || [];
                    
                    // Fetch courses to check access
                    const coursesRes = await api.get('/courses');
                    const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data || [];
                    
                    const hasAccess = userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId.toString()) ||
                                      courses.some(c => (c._id || c).toString() === courseId.toString());

                    if (hasAccess || user?.role === 'admin' || user?.role === 'mentor') {
                        const normalized = {
                            ...res.data,
                            mentorName: res.data.mentorName || res.data.mentor?.name || 'Instructor',
                            startedAt: res.data.startedAt || new Date()
                        };
                        setFetchedLiveClass(normalized);
                        setContextLiveClass(normalized);
                        setLoading(false);
                        return;
                    }
                }

                // If not found or no access, try fetching upcoming scheduled lives to see if one is 'live'
                const scheduledRes = await api.get('/scheduled-live/upcoming');
                const scheduledData = Array.isArray(scheduledRes.data) ? scheduledRes.data : [];
                const activeScheduled = scheduledData.find(l => l.status === 'live');
                if (activeScheduled) {
                    const courseId = activeScheduled.course?._id || activeScheduled.course || '';
                    const userGrantedCourses = user?.permissions?.grantedCourses || [];
                    
                    const coursesRes = await api.get('/courses');
                    const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data || [];

                    const hasAccess = userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId.toString()) ||
                                      courses.some(c => (c._id || c).toString() === courseId.toString());

                    if (hasAccess || user?.role === 'admin' || user?.role === 'mentor') {
                        const normalized = {
                            ...activeScheduled,
                            mentorName: activeScheduled.mentorName || activeScheduled.mentor?.name || 'Instructor',
                            topic: activeScheduled.description || activeScheduled.topic || 'Live Session',
                            startedAt: activeScheduled.actualStart || activeScheduled.scheduledStart || new Date()
                        };
                        setFetchedLiveClass(normalized);
                        setContextLiveClass(normalized);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch active session:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveSession();
    }, [propLiveClass, contextLiveClass, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    if (!liveClass) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-10 border border-slate-100 animate-bounce transition-all duration-1000">
                    <PlayCircle className="text-[#2563EB] w-16 h-16" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">
                    No active <span className="text-[#2563EB] not-italic">Broadcasts</span>
                </h2>
                <p className="text-slate-500 max-w-sm font-medium mb-12 text-lg leading-relaxed">
                    The instructional uplink is currently idle. Mentors will notify you when a technical deep dive begins.
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="px-10 py-5 bg-slate-900 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#2563EB] transition-all shadow-xl shadow-slate-200"
                    >
                        Return to Classroom
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-5 bg-white text-slate-400 border border-slate-200 rounded-2xl hover:text-slate-900 transition-all shadow-sm"
                    >
                        <Clock size={20} />
                    </button>
                </div>
            </div>
        );
    }

    // fetchMyCurrentDoubt is defined above the early returns to avoid production build issues

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
        const { platform, meetingLink, startedAt, videoUrl } = liveClass;

        if (videoUrl) {
            return videoUrl;
        }

        const startSeconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));

        if (platform === 'youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = meetingLink.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&fs=0&showinfo=0&autohide=1&start=${startSeconds}` : null;
        }
        if (platform === 'jitsi') {
            return meetingLink;
        }
        if (platform === 'premiere') {
            const videoId = getYouTubeId(meetingLink);
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&fs=0&showinfo=0&autohide=1&start=${startSeconds}` : meetingLink;
        }
        return null;
    };

    const embedUrl = getEmbedUrl();

    // Lockdown handlers
    const preventContext = (e) => e.preventDefault();

    return (
        <div
            className="min-h-screen bg-slate-50 flex flex-col select-none"
            onContextMenu={preventContext}
        >
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={onBack}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div>
                        <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight italic uppercase">
                            LIVE <span className="text-[#2563EB] not-italic">SESSION</span>
                        </h1>
                        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 line-clamp-1">
                            {liveClass.title} • {liveClass.topic} {liveClass.course && `• ${liveClass.course.title}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-xl border border-sky-100">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{participantCount} Watching</span>
                    </div>

                    {myDoubt ? (
                        <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all border-2 text-[9px] sm:text-xs ${myDoubt.isResolved
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                            }`}>
                            {myDoubt.isResolved ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            <span className="uppercase tracking-widest">
                                {myDoubt.isResolved ? 'Resolved' : 'Signaled'}
                            </span>
                            {myDoubt.isResolved && (
                                <button
                                    onClick={handleTerminateDoubt}
                                    className="ml-1 bg-blue-100/50 hover:bg-blue-100 text-blue-600 p-0.5 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Trash2 size={10} strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleRaiseHand}
                            disabled={isSignaling}
                            className="bg-slate-900 border-2 border-slate-900 hover:bg-white hover:text-slate-900 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl font-black transition-all uppercase text-[9px] sm:text-[10px] tracking-widest disabled:opacity-50 cursor-pointer"
                        >
                            {isSignaling ? 'Signaling...' : 'Raise Hand'}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Stage Area */}
                <div className="w-full aspect-video lg:flex-1 bg-slate-900 relative flex flex-col" ref={stageRef}>
                    <div className="flex-1 relative overflow-hidden">
                        {(embedUrl || liveClass.platform === 'jitsi') ? (
                            <div className="absolute inset-0 overflow-hidden bg-black">
                                {liveClass.platform === 'jitsi' ? (
                                    <iframe
                                        className="absolute inset-0 w-full h-full border-0"
                                        src={embedUrl}
                                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                                        title="Live Stream"
                                    ></iframe>
                                ) : (
                                    <CustomVideoPlayer
                                        videoUrl={embedUrl}
                                        autoPlay={true}
                                        isLive={true}
                                        scheduledStart={liveClass.actualStart || liveClass.scheduledStart || liveClass.startedAt}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-12 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay bg-black/80">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] border border-white/20 flex items-center justify-center mb-6 sm:mb-8 animate-pulse">
                                    <Monitor className="text-[#2563EB] w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2 sm:mb-4">External Link Detected</h2>
                                <p className="text-slate-400 max-w-sm sm:max-w-md mx-auto font-medium mb-6 sm:mb-10 text-xs sm:text-base leading-relaxed">
                                    This session is using a secure external platform ({liveClass.platform?.toUpperCase() || 'EXTERNAL'}). Please bridge the connection using the satellite link below.
                                </p>
                                <a
                                    href={liveClass.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#2563EB] hover:bg-white text-slate-950 px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-base transition-all transform hover:scale-105 shadow-2xl shadow-[#2563EB]/20 flex items-center gap-2.5 cursor-pointer"
                                >
                                    Join Meeting <ExternalLink size={16} strokeWidth={3} />
                                </a>

                                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 opacity-40">
                                    <Shield size={12} className="text-white" />
                                    <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure Connection</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Terminal/Chat Area */}
                <div className="w-full lg:w-96 flex-1 min-h-0 bg-white border-l border-slate-200 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <PlayCircle size={14} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Live Chat</h3>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chat Room</p>
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

