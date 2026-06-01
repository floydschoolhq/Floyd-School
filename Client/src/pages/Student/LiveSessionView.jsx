import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { PlayCircle, CheckCircle, Clock, Trash2, ArrowLeft, Monitor, Shield, ExternalLink, Radio, MessageSquare, Hand } from 'lucide-react';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';
import api from '../../api/axios';
import { useSocket } from '../../contexts/SocketProvider';
import { PortalContext } from '../../contexts/PortalProvider';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

    // ─── Handlers ───────────────────────────────────────────────────────────

    const fetchMyCurrentDoubt = useCallback(async (classId) => {
        if (!classId) return;
        try {
            const res = await api.get(`/doubts/${classId}/my`);
            setMyDoubt(res.data || null);
        } catch (_err) { /* No active doubt is expected */ }
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

    // ─── Effects ────────────────────────────────────────────────────────────

    useEffect(() => {
        const preventContext = (e) => e.preventDefault();
        window.addEventListener('contextmenu', preventContext);
        return () => window.removeEventListener('contextmenu', preventContext);
    }, []);

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

    useEffect(() => {
        if (propLiveClass || contextLiveClass) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchActiveSession = async () => {
            try {
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

    // ─── Loading State ───────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 font-medium tracking-tight">Connecting to session…</p>
                </div>
            </div>
        );
    }

    // ─── Empty State ─────────────────────────────────────────────────────────

    if (!liveClass) {
        return (
            <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-7">
                    <Radio className="w-7 h-7 text-slate-300" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">No active session</h2>
                <p className="text-sm text-slate-500 max-w-[280px] leading-6 mb-9">
                    There's no live class running right now. Your mentor will notify you when a session begins.
                </p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        Back to Classroom
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-white text-slate-500 border border-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer flex items-center gap-2"
                    >
                        <Clock size={14} />
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    const embedUrl = getEmbedUrl();

    // ─── Main Layout ─────────────────────────────────────────────────────────

    return (
        <div
            className="h-screen bg-[#0f1117] flex flex-col select-none"
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* ── Top Bar ── */}
            <div className="shrink-0 bg-white border-b border-slate-200/80 px-5 py-3 flex items-center justify-between z-20 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">

                {/* Left: back · live badge · title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={15} strokeWidth={2.5} />
                    </button>

                    {/* Divider */}
                    <span className="w-px h-5 bg-slate-200" />

                    {/* Live badge */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 rounded-lg border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
                        <span className="text-[11px] font-bold text-red-600 tracking-widest">LIVE</span>
                    </div>

                    {/* Session title */}
                    <div className="hidden sm:flex flex-col gap-0.5">
                        <p className="text-[13px] font-semibold text-slate-800 leading-none">
                            {liveClass.title || 'Live Session'}
                        </p>
                        {(liveClass.topic || liveClass.course?.title) && (
                            <p className="text-[11px] text-slate-400 leading-none line-clamp-1">
                                {[liveClass.topic, liveClass.course?.title].filter(Boolean).join(' · ')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: raise hand / doubt status */}
                <div className="flex items-center gap-3">
                    {myDoubt ? (
                        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-[12px] font-medium transition-all ${
                            myDoubt.isResolved
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                        }`}>
                            {myDoubt.isResolved
                                ? <CheckCircle size={13} strokeWidth={2.5} />
                                : <Clock size={13} strokeWidth={2.5} />
                            }
                            <span>{myDoubt.isResolved ? 'Resolved' : 'Signaled — waiting…'}</span>
                            {myDoubt.isResolved && (
                                <button
                                    onClick={handleTerminateDoubt}
                                    className="ml-0.5 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={11} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleRaiseHand}
                            disabled={isSignaling}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-[12px] font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <Hand size={13} strokeWidth={2.5} />
                            {isSignaling ? 'Signaling…' : 'Raise Hand'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

                {/* ── Video Stage ── */}
                <div
                    className="w-full aspect-video lg:aspect-auto lg:flex-1 bg-black relative"
                    ref={stageRef}
                >
                    {embedUrl ? (
                        <div className="absolute inset-0">
                            {liveClass.platform === 'jitsi' ? (
                                <iframe
                                    className="absolute inset-0 w-full h-full border-0"
                                    src={embedUrl}
                                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                                    title="Live Stream"
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
                        /* External platform placeholder */
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 py-12 bg-[#0f1117]">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                <Monitor className="w-6 h-6 text-slate-500" />
                            </div>
                            <h2 className="text-base font-semibold text-white mb-2.5">External Platform</h2>
                            <p className="text-sm text-slate-400 max-w-[300px] leading-6 mb-8">
                                This session runs on <span className="text-slate-300 font-medium">{liveClass.platform?.toUpperCase() || 'an external platform'}</span>. Open it in a new tab to join.
                            </p>
                            <a
                                href={liveClass.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                            >
                                Join Meeting <ExternalLink size={14} strokeWidth={2.5} />
                            </a>
                            <div className="absolute bottom-6 flex items-center gap-2 opacity-25">
                                <Shield size={12} className="text-slate-400" />
                                <span className="text-[11px] text-slate-400 tracking-wide">Secure Connection</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Live Chat Panel ── */}
                <div className="w-full lg:flex-none lg:w-[270px] bg-white border-t border-slate-100 lg:border-t-0 lg:border-l lg:border-slate-200/70 flex flex-col min-h-0">

                    {/* Chat header */}
                    <div className="shrink-0 px-4 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                            <MessageSquare size={13} className="text-slate-500" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[12px] font-semibold text-slate-700 leading-none">Live Chat</p>
                            <p className="text-[10px] text-slate-400 leading-none">Session messages</p>
                        </div>
                    </div>

                    {/* Chat body */}
                    <div className="flex-1 overflow-hidden min-h-0">
                        <LiveChatSidebar classId={liveClass._id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveSessionView;
