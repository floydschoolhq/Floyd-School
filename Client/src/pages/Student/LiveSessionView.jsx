import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { PlayCircle, CheckCircle, Clock, Trash2, ArrowLeft, Monitor, Shield, ExternalLink } from 'lucide-react';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';
import api from '../../api/axios';
import { useSocket } from '../../contexts/SocketProvider';
import { PortalContext } from '../../contexts/PortalProvider';

// ─── Helper ──────────────────────────────────────────────────────────────────

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getGoogleDriveFileId = (url) => {
    if (!url) return null;
    const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})[/?]?/);
    if (matchD && matchD[1]) return matchD[1];
    
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
    if (matchId && matchId[1]) return matchId[1];
    
    if (url.match(/^[a-zA-Z0-9_-]{25,}$/)) return url;
    return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const LiveSessionView = ({ liveClass: propLiveClass, onBack: propOnBack }) => {
    const { socket } = useSocket();
    const { activeLiveClass: contextLiveClass, setActiveLiveClass: setContextLiveClass, setView, user } = useContext(PortalContext);

    const [fetchedLiveClass, setFetchedLiveClass] = useState(null);
    const [loading, setLoading] = useState(!propLiveClass && !contextLiveClass);
    const [myDoubt, setMyDoubt] = useState(null);
    const [isSignaling, setIsSignaling] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [participantCount, setParticipantCount] = useState(0);
    const stageRef = useRef(null);

    const liveClass = propLiveClass || contextLiveClass || fetchedLiveClass;
    const onBack = propOnBack || (() => setView('Classroom'));

    // ─── ALL HANDLERS DEFINED FIRST (before any useEffect) ─────────────────

    // useCallback ensures stable references AND prevents TDZ in minified builds
    const fetchMyCurrentDoubt = useCallback(async (classId) => {
        if (!classId) return;
        try {
            const res = await api.get(`/doubts/${classId}/my`);
            setMyDoubt(res.data || null);
        } catch (_err) {
            // No active doubt is expected
        }
    }, []);

    const handleRaiseHand = useCallback(async () => {
        if (!liveClass || myDoubt || isSignaling) return;
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
    }, [liveClass, myDoubt, isSignaling]);

    const handleTerminateDoubt = useCallback(async () => {
        if (!myDoubt) return;
        const doubtId = myDoubt._id;
        setMyDoubt(null);
        try {
            await api.delete(`/doubts/${doubtId}`);
        } catch (error) {
            console.error('Failed to terminate doubt:', error);
        }
    }, [myDoubt]);

    const getEmbedUrl = useCallback(() => {
        if (!liveClass) return null;
        const { platform, meetingLink, startedAt, videoUrl } = liveClass;

        if (videoUrl) return videoUrl;

        const startSeconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));

        if (platform === 'youtube') {
            const videoId = getYouTubeId(meetingLink);
            return videoId
                ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&fs=0&showinfo=0&autohide=1&start=${startSeconds}`
                : null;
        }
        if (platform === 'jitsi') {
            // Force Full HD 1080p resolution stream constraints and video fitting
            const hqConfig = 'config.resolution=1080&config.constraints.video.height=1080&config.constraints.video.width=1920&config.disableDeepLinking=true&interfaceConfig.VIDEO_LAYOUT_FIT=true&config.channelLastN=20';
            return meetingLink.includes('#') ? `${meetingLink}&${hqConfig}` : `${meetingLink}#${hqConfig}`;
        }
        if (platform === 'premiere') {
            const videoId = getYouTubeId(meetingLink);
            return videoId
                ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&fs=0&showinfo=0&autohide=1&start=${startSeconds}`
                : meetingLink;
        }
        if (platform === 'google-drive-iframe' || platform === 'google-drive-direct') {
            const fileId = getGoogleDriveFileId(meetingLink);
            return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : meetingLink;
        }
        return null;
    }, [liveClass]);

    // ─── EFFECTS (all handlers are defined above) ───────────────────────────

    // Prevent right-click
    useEffect(() => {
        const preventContext = (e) => e.preventDefault();
        window.addEventListener('contextmenu', preventContext);
        return () => window.removeEventListener('contextmenu', preventContext);
    }, []);

    // Socket listeners - only when liveClass and socket are available
    useEffect(() => {
        if (!liveClass || !socket) return;

        fetchMyCurrentDoubt(liveClass._id);
        socket.emit('liveClass:join', {
            classId: liveClass._id,
            user: {
                _id: user?._id || user?.id,
                name: user?.name,
                email: user?.email,
                avatar: user?.avatar
            }
        });

        const onCountUpdate = ({ count }) => setParticipantCount(count);
        const onDoubtResolved = (resolvedDoubt) => {
            setMyDoubt(prev => prev?._id === resolvedDoubt._id ? { ...prev, isResolved: true } : prev);
        };
        const onDoubtDeleted = (deletedDoubtId) => {
            setMyDoubt(prev => prev?._id === deletedDoubtId ? null : prev);
        };
        const onLiveClassEnded = (classId) => {
            if (liveClass._id === classId) {
                setFetchedLiveClass(null);
                setContextLiveClass(null);
            }
        };
        const onScheduledLiveEnded = (liveId) => {
            if (liveClass._id === liveId) {
                setFetchedLiveClass(null);
                setContextLiveClass(null);
            }
        };

        socket.on('liveClass:countUpdate', onCountUpdate);
        socket.on('doubt:resolved', onDoubtResolved);
        socket.on('doubt:deleted', onDoubtDeleted);
        socket.on('liveClass:ended', onLiveClassEnded);
        socket.on('scheduledLive:ended', onScheduledLiveEnded);

        return () => {
            socket.emit('liveClass:leave', liveClass._id);
            socket.off('liveClass:countUpdate', onCountUpdate);
            socket.off('doubt:resolved', onDoubtResolved);
            socket.off('doubt:deleted', onDoubtDeleted);
            socket.off('liveClass:ended', onLiveClassEnded);
            socket.off('scheduledLive:ended', onScheduledLiveEnded);
        };
    }, [liveClass?._id, socket, fetchMyCurrentDoubt, setContextLiveClass, user]);

    // Fetch active session when page loads without a prop/context live class
    useEffect(() => {
        if (propLiveClass || contextLiveClass) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchActiveSession = async () => {
            try {
                // 1. Try Jitsi-style active live class
                const res = await api.get('/live-classes/active');
                if (!cancelled && res.data) {
                    const courseId = res.data.course?._id || res.data.course || '';
                    const userGrantedCourses = user?.permissions?.grantedCourses || [];
                    const coursesRes = await api.get('/courses');
                    const courses = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data?.data || []);

                    const hasAccess =
                        userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId.toString()) ||
                        courses.some(c => (c._id || c).toString() === courseId.toString());

                    if (hasAccess || user?.role === 'admin' || user?.role === 'mentor') {
                        const normalized = {
                            ...res.data,
                            mentorName: res.data.mentorName || res.data.mentor?.name || 'Instructor',
                            startedAt: res.data.startedAt || new Date()
                        };
                        if (!cancelled) {
                            setFetchedLiveClass(normalized);
                            setContextLiveClass(normalized);
                            setLoading(false);
                        }
                        return;
                    }
                }

                // 2. Fallback: look for a scheduled live with status === 'live'
                const scheduledRes = await api.get('/scheduled-live/upcoming');
                const scheduledData = Array.isArray(scheduledRes.data) ? scheduledRes.data : [];
                const activeScheduled = scheduledData.find(l => l.status === 'live');

                if (!cancelled && activeScheduled) {
                    const courseId = activeScheduled.course?._id || activeScheduled.course || '';
                    const userGrantedCourses = user?.permissions?.grantedCourses || [];
                    const coursesRes = await api.get('/courses');
                    const courses = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data?.data || []);

                    const hasAccess =
                        userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId.toString()) ||
                        courses.some(c => (c._id || c).toString() === courseId.toString());

                    if (hasAccess || user?.role === 'admin' || user?.role === 'mentor') {
                        const normalized = {
                            ...activeScheduled,
                            mentorName: activeScheduled.mentorName || activeScheduled.mentor?.name || 'Instructor',
                            topic: activeScheduled.description || activeScheduled.topic || 'Live Session',
                            startedAt: activeScheduled.actualStart || activeScheduled.scheduledStart || new Date()
                        };
                        if (!cancelled) {
                            setFetchedLiveClass(normalized);
                            setContextLiveClass(normalized);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch active session:', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchActiveSession();
        return () => { cancelled = true; };
    }, [propLiveClass, contextLiveClass, user, setContextLiveClass]);

    // ─── RENDER ─────────────────────────────────────────────────────────────

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
                <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-10 border border-slate-100 animate-bounce">
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

    const embedUrl = getEmbedUrl();

    return (
        <div
            className="min-h-screen bg-slate-50 flex flex-col select-none"
            onContextMenu={(e) => e.preventDefault()}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Stage */}
                <div className="w-full aspect-video lg:flex-1 bg-slate-900 relative flex flex-col" ref={stageRef}>
                    <div className="flex-1 relative overflow-hidden">
                        {embedUrl ? (
                            <div className="absolute inset-0 overflow-hidden bg-black">
                                {liveClass.platform === 'jitsi' ? (
                                    <iframe
                                        className="absolute inset-0 w-full h-full border-0"
                                        src={embedUrl}
                                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                                        title="Live Stream"
                                    />
                                ) : (liveClass.platform === 'google-drive-iframe' || liveClass.platform === 'google-drive-direct') ? (
                                    <iframe
                                        className="absolute inset-0 w-full h-full border-0 bg-black"
                                        src={embedUrl}
                                        allow="autoplay; fullscreen"
                                        title="Google Drive Stream"
                                    />
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
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-12 bg-black/80">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mb-6 sm:mb-8 animate-pulse">
                                    <Monitor className="text-[#2563EB] w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2 sm:mb-4">External Link Detected</h2>
                                <p className="text-slate-400 max-w-sm sm:max-w-md mx-auto font-medium mb-6 sm:mb-10 text-xs sm:text-base leading-relaxed">
                                    This session uses a secure external platform ({liveClass.platform?.toUpperCase() || 'EXTERNAL'}).
                                </p>
                                <a
                                    href={liveClass.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#2563EB] hover:bg-white text-white hover:text-slate-950 px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-xs sm:text-base transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                    Join Meeting <ExternalLink size={16} strokeWidth={3} />
                                </a>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-40">
                                    <Shield size={12} className="text-white" />
                                    <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure Connection</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat */}
                <div className="w-full lg:w-96 flex-1 min-h-0 bg-white border-l border-slate-200 flex flex-col">
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
