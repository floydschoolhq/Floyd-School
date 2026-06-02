import React, { useState, useEffect } from 'react';
import {
    Video,
    Users,
    MessageSquare,
    Check,
    Loader2,
    Play,
    AlertCircle,
    Link as LinkIcon,
    ExternalLink,
    Square,
    MessageCircle,
    Calendar,
    Trash2,
    Clock,
    Youtube,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import LiveChatSidebar from '../components/LiveChatSidebar';
// ─── TTS Schedule (12 weeks × 3 classes) ────────────────────────────────────
const TTS_SCHEDULE = [
  ['What is Python & Why It Matters; Setting Up Environment; Variables & Data Types','User Input; If/Else Conditions; Writing Your First Working Program','Recap & Hands-On Practice'],
  ['For Loops & While Loops','Functions with Parameters and Return Values','Lists & Dictionaries; Organising and Working with Data'],
  ['Reading and Writing Files Permanently','Installing and Using Python Libraries','Combining All Concepts into One Real Build'],
  ['Error Handling with Try and Except','Introduction to Classes and Objects (OOP)','Month 1 Consolidation & Free Build Session'],
  ['Using ChatGPT as a Coding Partner; Prompt Engineering Basics','Connecting to the OpenAI API','Building a Chatbot with a Custom Personality'],
  ['What is an API; JSON Data Handling','Fetching Live Weather and News Data from Real External Services','Build & Deploy the Live Data App'],
  ['How Computers Learn from Data; Supervised vs Unsupervised Learning','Loading Real Datasets with Pandas','Training First ML Model with Scikit-learn'],
  ['Classification Models and Decision Trees','Training, Testing and Accuracy Scoring','Saving and Reusing a Trained Model with Pickle'],
  ['Intro to Computer Vision; How OpenCV Works; Loading Images','Applying Filters, Detecting Edges with OpenCV','Live Webcam Feed & Real-Time Face Detection'],
  ['What Flask Is; How Web Apps Work; Routes, Templates & Local Server','Forms, User Input; Connecting Trained ML Model to Web Interface','Finalize and Test Flask ML Prediction Web App'],
  ['Capstone: Face Recognition Engine on Live Webcam; Auto-Log Attendance with Name & Time','Capstone: Save Records to CSV Spreadsheet; Build Flask Attendance Live Dashboard','Full System Integration, Testing & End-to-End Walkthrough'],
  ['Final Testing & Presentation Prep','Rehearsal with Mentor Feedback; Polish Presentation','LIVE DEMO DAY — Present AI Face Recognition Attendance System'],
];

const LiveClassCenter = () => {
    const socket = useSocket();
    const toast = useToast();
    const [activeClass, setActiveClass] = useState(null);
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentCount, setStudentCount] = useState(0);
    const [viewers, setViewers] = useState([]);
    const [activeTab, setActiveTab] = useState('doubts'); // 'doubts', 'chat', or 'viewers'
    const [doubtsLoading, setDoubtsLoading] = useState(false);
    const [starting, setStarting] = useState(false);

    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('youtube');
    const [meetingLink, setMeetingLink] = useState('');
    const [durationMin, setDurationMin] = useState(60);
    const [durationSec, setDurationSec] = useState(0);
    const [error, setError] = useState('');

    // Premiere selection state
    const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [searchingRecordings, setSearchingRecordings] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [classNumber, setClassNumber] = useState(1);
    const [scheduleCourse, setScheduleCourse] = useState('');
    const [scheduleModule, setScheduleModule] = useState('');
    const [scheduleClassNumber, setScheduleClassNumber] = useState(1);

    // ── Auto-fill title from schedule when module + class number are selected ──
    useEffect(() => {
        if (!selectedCourse || !selectedModule) return;
        const modIdx = courses.find(c => c._id === selectedCourse)?.modules?.findIndex(m => m._id === selectedModule) ?? -1;
        if (modIdx < 0 || !TTS_SCHEDULE[modIdx]) return;
        const autoTitle = TTS_SCHEDULE[modIdx][classNumber - 1] || '';
        if (autoTitle) {
            setTitle(autoTitle);
            setTopic(autoTitle);
        }
    }, [selectedCourse, selectedModule, classNumber, courses]);

    // ── Auto-fill scheduled live title from schedule ──
    useEffect(() => {
        if (!scheduleCourse || !scheduleModule) return;
        const modIdx = courses.find(c => c._id === scheduleCourse)?.modules?.findIndex(m => m._id === scheduleModule) ?? -1;
        if (modIdx < 0 || !TTS_SCHEDULE[modIdx]) return;
        const autoTitle = TTS_SCHEDULE[modIdx][scheduleClassNumber - 1] || '';
        if (autoTitle) setScheduleTitle(autoTitle);
    }, [scheduleCourse, scheduleModule, scheduleClassNumber, courses]);

    // Auto duration detection handled below helpers

    // Scheduled sessions state
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [scheduleDescription, setScheduleDescription] = useState('');
    const [scheduleVideoUrl, setScheduleVideoUrl] = useState('');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduling, setScheduling] = useState(false);

    // View mode: 'broadcast', 'schedule', or 'archive'
    const [viewMode, setViewMode] = useState('broadcast');

    // Archive state
    const [archives, setArchives] = useState([]);
    const [loadingArchives, setLoadingArchives] = useState(false);

    // YouTube Helper
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Google Drive Helper
    const getGoogleDriveFileId = (url) => {
        if (!url) return null;
        const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})[/?]?/);
        if (matchD && matchD[1]) return matchD[1];
        
        const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
        if (matchId && matchId[1]) return matchId[1];
        
        if (url.match(/^[a-zA-Z0-9_-]{25,}$/)) return url;
        return null;
    };

    // Auto duration detection for YouTube, Google Drive, and MP4 links
    useEffect(() => {
        if (!meetingLink) return;
        
        const detectDuration = async () => {
            const ytId = getYouTubeId(meetingLink);
            if (ytId) {
                // Fetch YouTube video length using a hidden temporary player
                if (!window.YT) {
                    const tag = document.createElement('script');
                    tag.src = 'https://www.youtube.com/iframe_api';
                    const firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                }
                
                const getYtDuration = () => {
                    const tempContainer = document.createElement('div');
                    tempContainer.style.position = 'absolute';
                    tempContainer.style.width = '0';
                    tempContainer.style.height = '0';
                    tempContainer.style.opacity = '0';
                    tempContainer.style.pointerEvents = 'none';
                    document.body.appendChild(tempContainer);
                    
                    let tempPlayer;
                    tempPlayer = new window.YT.Player(tempContainer, {
                        videoId: ytId,
                        playerVars: { autoplay: 0, controls: 0 },
                        events: {
                            onReady: (event) => {
                                const dur = event.target.getDuration();
                                if (dur && !isNaN(dur) && dur > 0) {
                                    setDurationMin(Math.floor(dur / 60));
                                    setDurationSec(Math.round(dur % 60));
                                    toast.success(`Automatically detected YouTube video length: ${Math.floor(dur / 60)}m ${Math.round(dur % 60)}s`);
                                }
                                tempPlayer.destroy();
                                tempContainer.remove();
                            },
                            onError: () => {
                                tempPlayer.destroy();
                                tempContainer.remove();
                            }
                        }
                    });
                };

                if (window.YT && window.YT.Player) {
                    getYtDuration();
                } else {
                    const checkYtLoaded = setInterval(() => {
                        if (window.YT && window.YT.Player) {
                            clearInterval(checkYtLoaded);
                            getYtDuration();
                        }
                    }, 500);
                    setTimeout(() => clearInterval(checkYtLoaded), 10000);
                }
                return;
            }

            const fileId = getGoogleDriveFileId(meetingLink);
            let detectUrl = meetingLink;
            if (fileId) {
                detectUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
            }
            
            const isDrive = !!fileId;
            const isMp4 = detectUrl.toLowerCase().endsWith('.mp4') || detectUrl.includes('/uploads/');
            
            if (isDrive || isMp4 || detectUrl.startsWith('http')) {
                try {
                    const tempVideo = document.createElement('video');
                    tempVideo.src = detectUrl;
                    tempVideo.preload = 'metadata';
                    tempVideo.onloadedmetadata = () => {
                        const dur = tempVideo.duration;
                        if (dur && !isNaN(dur) && dur > 0) {
                            setDurationMin(Math.floor(dur / 60));
                            setDurationSec(Math.round(dur % 60));
                            toast.success(`Automatically detected video length: ${Math.floor(dur / 60)}m ${Math.round(dur % 60)}s`);
                        }
                    };
                    tempVideo.onerror = () => {
                        // Silent ignore for non-HTML5 streams
                    };
                } catch (e) {
                    console.error('Failed to auto-detect video duration:', e);
                }
            }
        };
        
        detectDuration();
    }, [meetingLink]);

    useEffect(() => {
        fetchActiveClass();
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setCourses(data);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        }
    };

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

                socket.on('liveClass:countUpdate', ({ count, viewers: activeViewers }) => {
                    setStudentCount(count);
                    if (activeViewers) {
                        setViewers(activeViewers);
                    }
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

        if (!selectedCourse) {
            setError('Please select a course for this broadcast');
            setStarting(false);
            return;
        }

        try {
            const res = await api.post('/live-classes/start', {
                title,
                topic,
                platform,
                meetingLink,
                duration: (durationMin * 60) + parseInt(durationSec || 0),
                courseId: selectedCourse,
                moduleId: selectedModule || undefined,
                classNumber: Number(classNumber) || 1
            });
            setActiveClass(res.data);
            toast.success('Live broadcast node established');
            setTitle('');
            setTopic('');
            setMeetingLink('');
            setSelectedCourse('');
            setSelectedModule('');
            setClassNumber(1);
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

    // Scheduled sessions functions
    useEffect(() => {
        fetchScheduledSessions();
    }, []);

    const fetchScheduledSessions = async () => {
        try {
            const res = await api.get('/scheduled-live');
            setScheduledSessions(res.data);
            
            const archRes = await api.get('/live-classes/archive');
            setArchives(archRes.data);
        } catch (err) {
            console.error('Failed to fetch scheduled sessions:', err);
        } finally {
            setLoadingSessions(false);
            setLoadingArchives(false);
        }
    };

    const extractYouTubeId = (url) => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (!scheduleVideoUrl || !scheduleTitle || !scheduleDate || !scheduleTime || !scheduleCourse) {
            toast.error('Please fill in all required fields including Course');
            return;
        }

        const videoId = extractYouTubeId(scheduleVideoUrl);
        if (!videoId) {
            toast.error('Invalid YouTube URL. Example: https://www.youtube.com/watch?v=VIDEO_ID');
            return;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        setScheduling(true);
        try {
            const scheduledStart = new Date(`${scheduleDate}T${scheduleTime}`);
            await api.post('/scheduled-live', {
                title: scheduleTitle,
                description: scheduleDescription,
                videoUrl: embedUrl,
                scheduledStart: scheduledStart.toISOString(),
                course: scheduleCourse,
                module: scheduleModule || undefined,
                classNumber: Number(scheduleClassNumber) || 1
            });
            
            toast.success('Live session scheduled successfully');
            setScheduleTitle('');
            setScheduleDescription('');
            setScheduleVideoUrl('');
            setScheduleDate('');
            setScheduleTime('');
            setScheduleCourse('');
            setScheduleModule('');
            setScheduleClassNumber(1);
            setShowScheduleForm(false);
            fetchScheduledSessions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to schedule');
        } finally {
            setScheduling(false);
        }
    };

    const handleDeleteSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this scheduled session?')) return;
        try {
            await api.delete(`/scheduled-live/${sessionId}`);
            toast.success('Session deleted');
            fetchScheduledSessions();
        } catch (err) {
            toast.error('Failed to delete session');
        }
    };

    const handleStartSession = async (sessionId) => {
        try {
            await api.put(`/scheduled-live/${sessionId}/start`);
            toast.success('Live session started');
            fetchScheduledSessions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to start live');
        }
    };

    const handleEndSession = async (sessionId) => {
        try {
            await api.put(`/scheduled-live/${sessionId}/end`);
            toast.success('Live session ended');
            fetchScheduledSessions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to end live');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            scheduled: 'bg-amber-100 text-amber-700 border-amber-200',
            live: 'bg-green-100 text-green-700 border-green-200',
            ended: 'bg-gray-100 text-gray-700 border-gray-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase border ${statusStyles[status] || statusStyles.scheduled}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Live Session <span className="text-sky-500">Command Center</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Broadcast knowledge in real-time or schedule YouTube sessions.
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

            {/* View Mode Tabs */}
            <div className="flex bg-slate-900 p-2 gap-2 rounded-2xl w-fit">
                <button
                    onClick={() => setViewMode('broadcast')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === 'broadcast'
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Video size={14} />
                    Live Broadcast
                </button>
                <button
                    onClick={() => setViewMode('schedule')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === 'schedule'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Calendar size={14} />
                    Scheduled Sessions
                    {scheduledSessions.filter(s => s.status === 'scheduled').length > 0 && (
                        <span className="bg-amber-500 text-[8px] px-1.5 py-0.5 rounded-full">
                            {scheduledSessions.filter(s => s.status === 'scheduled').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setViewMode('archive')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === 'archive'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <BookOpen size={14} />
                    View Archives
                </button>
            </div>

            {viewMode === 'broadcast' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Control Panel */}
                    <div className="lg:col-span-7">
                        <AnimatePresence>
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
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Course *</label>
                                          <select
                                              value={selectedCourse}
                                              onChange={(e) => {
                                                  setSelectedCourse(e.target.value);
                                                  setSelectedModule('');
                                              }}
                                              required
                                              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                          >
                                              <option value="">Choose Course...</option>
                                              {courses.map(course => (
                                                  <option key={course._id} value={course._id}>{course.title}</option>
                                              ))}
                                          </select>
                                      </div>

                                      {selectedCourse && (
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Module / Unit Link</label>
                                              <select
                                                  value={selectedModule}
                                                  onChange={(e) => setSelectedModule(e.target.value)}
                                                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                              >
                                                  <option value="">Choose Module (Optional)...</option>
                                                  {courses.find(c => c._id === selectedCourse)?.modules?.map((m, idx) => (
                                                      <option key={m._id || idx} value={m._id}>M{idx + 1}: {m.title}</option>
                                                  ))}
                                              </select>
                                          </div>
                                      )}

                                      {selectedCourse && selectedModule && (() => {
                                          const modIdx = courses.find(c => c._id === selectedCourse)?.modules?.findIndex(m => m._id === selectedModule) ?? -1;
                                          const classNames = (modIdx >= 0 && TTS_SCHEDULE[modIdx]) ? TTS_SCHEDULE[modIdx] : ['Class 1','Class 2','Class 3'];
                                          return (
                                              <div className="space-y-2">
                                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Number *</label>
                                                  <select
                                                      value={classNumber}
                                                      onChange={(e) => setClassNumber(Number(e.target.value))}
                                                      required
                                                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                                  >
                                                      {classNames.map((name, i) => (
                                                          <option key={i + 1} value={i + 1}>Class {i + 1}: {name}</option>
                                                      ))}
                                                  </select>
                                              </div>
                                          );
                                       })()}

                                     <div className="space-y-2">
                                         <div className="flex items-center justify-between ml-1 mb-1">
                                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Title *</label>
                                             {selectedModule && <span className="text-[9px] text-sky-500 font-semibold uppercase tracking-wider">Auto-filled from schedule</span>}
                                         </div>
                                        <input
                                            type="text"
                                            placeholder="Select a module and class above to auto-fill"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className={`w-full border p-4 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all shadow-inner ${
                                                selectedModule && title
                                                    ? 'bg-sky-50 border-sky-200 focus:border-sky-500'
                                                    : 'bg-slate-50 border-slate-200 focus:border-sky-500'
                                            }`}
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
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { id: 'premiere', label: 'Simulated Live' },
                                                { id: 'youtube', label: 'YouTube' },
                                                { id: 'jitsi', label: 'Jitsi Meet' },
                                                { id: 'google-drive-iframe', label: 'GDrive IFrame' },
                                                { id: 'google-drive-direct', label: 'GDrive Direct' },
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
                                            Satellite Link (Meeting URL)
                                        </label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            {platform === 'premiere' ? (
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

                                    {meetingLink && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Live Broadcast Duration
                                                </label>
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Auto-Synced to Stream
                                                </span>
                                            </div>
                                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-lg">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Detected Duration</span>
                                                    <span className="text-xs text-slate-400 font-medium">Broadcast will terminate automatically when the video completes one full run.</span>
                                                </div>
                                                <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-black text-sky-400 min-w-[100px] text-center shadow-inner">
                                                    {Math.floor(durationMin / 60) > 0 ? `${Math.floor(durationMin / 60)}h ` : ''}{durationMin % 60}m {durationSec}s
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                        ) : (activeClass.platform === 'google-drive-iframe' || activeClass.platform === 'google-drive-direct') && getGoogleDriveFileId(activeClass.meetingLink) ? (
                                            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-slate-700 shadow-2xl relative group/preview">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://drive.google.com/file/d/${getGoogleDriveFileId(activeClass.meetingLink)}/preview`}
                                                    title="Google Drive Stream Preview"
                                                    frameBorder="0"
                                                    allow="autoplay; fullscreen"
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
                                                    GDrive Stream
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
                            <button
                                onClick={() => setActiveTab('viewers')}
                                className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'viewers'
                                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Users size={14} />
                                Viewers
                                {viewers.length > 0 && (
                                    <span className="bg-sky-500/20 text-sky-400 text-[8px] px-1.5 py-0.5 rounded-full font-black">{viewers.length}</span>
                                )}
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
                        ) : activeTab === 'chat' ? (
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
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 p-6">
                                {activeClass ? (
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Students Watching</span>
                                            <span className="bg-sky-500/10 text-sky-600 text-[10px] px-2.5 py-1 rounded-xl font-bold">{viewers.length} Students</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                            {viewers.length > 0 ? (
                                                viewers.map((student, idx) => (
                                                    <motion.div
                                                        key={student._id || idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-inner uppercase">
                                                            {student.avatar ? (
                                                                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                student.name?.charAt(0) || 'S'
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-black text-slate-900 truncate">{student.name}</h4>
                                                            <p className="text-[9px] font-bold text-slate-400 truncate uppercase mt-0.5">{student.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider">Watching</span>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-20">
                                                    <Users size={48} className="mb-4 text-slate-400" />
                                                    <p className="font-black uppercase text-[10px] tracking-[0.2em]">No Viewers Yet</p>
                                                    <p className="text-[9px] font-bold mt-1 uppercase">Waiting for students to join the uplink...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-10">
                                        <Users size={48} className="mb-4" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Uplink Inactive</p>
                                        <p className="text-[9px] font-bold mt-2 uppercase">Start a live session to trace active viewers</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            ) : viewMode === 'archive' ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 uppercase">Live Class Archives (Recordings)</h3>
                        <span className="text-xs font-bold text-slate-400">
                            {archives.length} recordings
                        </span>
                    </div>

                    {loadingArchives ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
                        </div>
                    ) : archives.length === 0 ? (
                        <div className="p-12 text-center opacity-50">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="font-bold text-slate-400 uppercase">No recordings available</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {archives.map((session) => (
                                <motion.div
                                    key={session._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-full md:w-48 h-28 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-[10px] font-black text-white/80 uppercase tracking-widest truncate">{session.topic}</p>
                                        </div>
                                        <Video className="w-10 h-10 text-slate-300 z-10" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-black text-slate-900 truncate">{session.title}</h4>
                                            {getStatusBadge(session.status)}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                Ended {formatDate(session.endedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {session.meetingLink && (
                                            <a
                                                href={session.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-sky-500 transition-colors flex items-center gap-2"
                                            >
                                                <ExternalLink size={14} />
                                                View Recording
                                            </a>
                                        )}
                                        <button
                                            onClick={async () => {
                                                if(window.confirm('Delete this recording permanently?')) {
                                                    try {
                                                        await api.delete(`/live-classes/${session._id}`);
                                                        toast.success('Recording deleted');
                                                        fetchScheduledSessions();
                                                    } catch (e) {
                                                        toast.error('Failed to delete recording');
                                                    }
                                                }
                                            }}
                                            className="p-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                                            title="Delete Recording"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Schedule Form */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                                <Youtube size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase">Schedule YouTube Session</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paste YouTube URL and set schedule</p>
                            </div>
                        </div>

                        <form onSubmit={handleScheduleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Course *</label>
                                <select
                                    value={scheduleCourse}
                                    onChange={(e) => {
                                        setScheduleCourse(e.target.value);
                                        setScheduleModule('');
                                    }}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Choose Course...</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            {scheduleCourse && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Module / Unit Link *</label>
                                    <select
                                        value={scheduleModule}
                                        onChange={(e) => setScheduleModule(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Choose Module...</option>
                                        {courses.find(c => c._id === scheduleCourse)?.modules?.map((m, idx) => (
                                            <option key={m._id || idx} value={m._id}>M{idx + 1}: {m.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {scheduleCourse && scheduleModule && (() => {
                                const modIdx = courses.find(c => c._id === scheduleCourse)?.modules?.findIndex(m => m._id === scheduleModule) ?? -1;
                                const classNames = (modIdx >= 0 && TTS_SCHEDULE[modIdx]) ? TTS_SCHEDULE[modIdx] : ['Class 1','Class 2','Class 3'];
                                return (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Number *</label>
                                        <select
                                            value={scheduleClassNumber}
                                            onChange={(e) => setScheduleClassNumber(Number(e.target.value))}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                        >
                                            {classNames.map((name, i) => (
                                                <option key={i + 1} value={i + 1}>Class {i + 1}: {name}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })()}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YouTube URL *</label>
                                <input
                                    type="url"
                                    value={scheduleVideoUrl}
                                    onChange={(e) => setScheduleVideoUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                                />
                                <p className="text-xs text-slate-400 font-medium ml-1">Supports: youtube.com/watch, youtu.be, youtube.com/embed</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1 mb-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Title *</label>
                                        {scheduleModule && <span className="text-[9px] text-red-400 font-semibold uppercase tracking-wider">Auto-filled from schedule</span>}
                                    </div>
                                    <input
                                        type="text"
                                        value={scheduleTitle}
                                        onChange={(e) => setScheduleTitle(e.target.value)}
                                        placeholder="Select module & class above to auto-fill"
                                        required
                                        className={`w-full border p-4 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all ${
                                            scheduleModule && scheduleTitle
                                                ? 'bg-red-50 border-red-200 focus:border-red-400'
                                                : 'bg-slate-50 border-slate-200 focus:border-red-500'
                                        }`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <input
                                        type="text"
                                        value={scheduleDescription}
                                        onChange={(e) => setScheduleDescription(e.target.value)}
                                        placeholder="Brief description (optional)"
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date *</label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time *</label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={scheduling}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {scheduling ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Scheduling...
                                    </>
                                ) : (
                                    <>
                                        <Calendar size={20} />
                                        Schedule Live Session
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Scheduled Sessions List */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 uppercase">Your Sessions</h3>
                            <span className="text-xs font-bold text-slate-400">
                                {scheduledSessions.length} total
                            </span>
                        </div>

                        {loadingSessions ? (
                            <div className="p-12 text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
                            </div>
                        ) : scheduledSessions.length === 0 ? (
                            <div className="p-12 text-center opacity-50">
                                <Video className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                <p className="font-bold text-slate-400 uppercase">No sessions scheduled yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {scheduledSessions.map((session) => (
                                    <motion.div
                                        key={session._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-full md:w-48 h-28 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {session.thumbnailUrl ? (
                                                <img src={session.thumbnailUrl} alt={session.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Video className="w-10 h-10 text-slate-300" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-black text-slate-900 truncate">{session.title}</h4>
                                                {getStatusBadge(session.status)}
                                            </div>
                                            {session.description && (
                                                <p className="text-sm text-slate-500 mb-2 truncate">{session.description}</p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatDate(session.scheduledStart)}
                                                </span>
                                                {session.mentor?.name && (
                                                    <span>by {session.mentor.name}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            {session.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleStartSession(session._id)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-green-600 transition-colors flex items-center gap-2"
                                                >
                                                    <Play size={14} />
                                                    Go Live
                                                </button>
                                            )}
                                            {session.status === 'live' && (
                                                <button
                                                    onClick={() => handleEndSession(session._id)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-red-600 transition-colors flex items-center gap-2"
                                                >
                                                    <Square size={14} className="fill-current" />
                                                    End Live
                                                </button>
                                            )}
                                            {session.videoUrl && (
                                                <a
                                                    href={session.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                                >
                                                    <ExternalLink size={18} className="text-slate-400" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDeleteSession(session._id)}
                                                className="p-2 border border-red-200 text-red-400 rounded-xl hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
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
