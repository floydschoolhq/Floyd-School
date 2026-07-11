import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Play, Calendar, Clock, X, GraduationCap, PlayCircle, BookOpen, MessageSquare } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import { CardSkeleton, StatSkeleton } from '../../components/dashboard/SkeletonCard';
import api from '../../api/axios';
import CommentSection from '../../components/Student/CommentSection';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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

const RecordingsPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [liveRecordings, setLiveRecordings] = useState([]);

    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const [coursesRes, liveRes] = await Promise.all([
                api.get('/courses'),
                api.get('/live-classes/archive')
            ]);
            const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data;
            setCourses(coursesData);
            setLiveRecordings(liveRes.data || []);
        } catch (error) {
            console.error('Failed to fetch recordings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-base p-3 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                        {[...Array(3)].map((_, i) => <StatSkeleton key={i} />)}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        <CardSkeleton lines={3} />
                        <CardSkeleton lines={2} />
                    </div>
                </div>
            </div>
        );
    }

    // Flatten modules from all courses
    const courseModules = courses.flatMap(course =>
        (course.modules || []).map(module => ({
            ...module,
            courseTitle: course.title,
            instructor: course.instructor?.name || 'Floyd School Instructor',
            isLiveArchive: false
        }))
    );

    const liveArchiveModules = liveRecordings.map(lc => ({
        ...lc,
        title: lc.title,
        videoUrl: lc.meetingLink, // In 'premiere' and 'youtube' modes, this is the video URL
        courseTitle: 'Live Class Recording',
        instructor: lc.mentorName || 'Floyd School Mentor',
        isLiveArchive: true,
        createdAt: lc.startedAt
    }));

    const allModules = [...liveArchiveModules, ...courseModules].filter(m => m.videoUrl);

    return (
        <div className="min-h-screen bg-surface-base p-3 sm:p-6 transition-colors duration-500 text-text-main">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8 p-3"
            >
                <h1 className="text-2xl sm:text-4xl font-black text-text-main mb-2 tracking-tight">
                    Class <span className="text-accent-primary">Recordings</span>
                </h1>
                <p className="text-xs sm:text-base font-medium text-text-muted">Review previous class recordings and video playbacks at your convenience.</p>
            </motion.div>

            {/* Recordings Grid */}
            {allModules.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {allModules.map((module, index) => (
                        <motion.div
                            key={module._id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-surface-soft border border-surface-el hover:border-accent-primary/20 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-5 cursor-pointer transition-all flex flex-col justify-between group"
                            onClick={() => setSelectedVideo(module)}
                        >
                            <div>
                                {/* Thumbnail Placeholder */}
                                <div className="bg-surface-base h-40 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden border border-surface-el/80">
                                    {getYouTubeId(module.videoUrl) ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${getYouTubeId(module.videoUrl)}/mqdefault.jpg`}
                                            alt={module.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-500"
                                        />
                                    ) : (
                                        <Video className="w-10 h-10 text-text-muted/30" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-[10px] font-bold text-white/95 uppercase tracking-wider truncate">{module.courseTitle}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1">
                                    <h3 className="font-bold text-text-main text-base tracking-tight line-clamp-1 group-hover:text-accent-primary transition-colors">{module.title}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{module.instructor}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedVideo(module);
                                    }}
                                    className="flex-1 py-2.5 bg-surface-base hover:bg-accent-primary border border-surface-el hover:border-accent-primary text-text-main hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    Watch Lecture
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-12 sm:py-20 text-center bg-surface-soft rounded-2xl sm:rounded-[3rem] border-2 sm:border-4 border-dashed border-surface-el">
                    <BookOpen size={48} className="mx-auto text-text-muted mb-4 sm:mb-6 opacity-30" />
                    <p className="text-text-muted font-black uppercase tracking-wider text-xs sm:text-base">No class recordings found</p>
                    <p className="text-text-muted/60 text-xs sm:text-base font-bold mt-2 italic">Recordings will appear here after the class ends.</p>
                </div>
            )}

            {/* Video Player Portal */}
            <AnimatePresence>
                {selectedVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto md:overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVideo(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-surface-soft border border-surface-el rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto h-auto md:h-[80vh]"
                        >
                            {/* Left Column: Video Player Container */}
                            <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative aspect-video md:aspect-auto md:h-full shrink-0">
                                <CustomVideoPlayer
                                    videoUrl={selectedVideo.videoUrl}
                                    autoPlay={true}
                                    isLive={false}
                                />
                            </div>

                            {/* Right Column: Title & Discussion Area */}
                            <div className="w-full md:w-1/3 flex flex-col flex-1 min-h-0 bg-surface-soft md:border-l md:border-surface-el h-auto md:h-full">
                                {/* Header */}
                                <div className="p-4 sm:p-6 flex items-center justify-between gap-4 border-b border-surface-el shrink-0">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="bg-accent-primary/10 text-accent-primary px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest border border-accent-primary/20">
                                                {selectedVideo.courseTitle}
                                            </span>
                                            <span className="text-[10px] sm:text-[11px] font-black text-text-muted uppercase tracking-widest truncate">
                                                {selectedVideo.instructor}
                                            </span>
                                        </div>
                                        <h2 className="text-sm sm:text-base font-black text-text-main tracking-tight leading-snug truncate">
                                            {selectedVideo.title}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="p-2 bg-surface-base hover:bg-surface-el rounded-xl text-text-main transition-all shrink-0 cursor-pointer border-none"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Scrollable Discussion Area */}
                                <div className="p-4 sm:p-6 overflow-y-visible md:overflow-y-auto custom-scrollbar flex-1 min-h-0 [&>div]:mt-0">
                                    <CommentSection moduleId={selectedVideo._id} moduleTitle={selectedVideo.title} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer Note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-wider mt-8 sm:mt-12"
            >
                Recordings are updated automatically after each class.
            </motion.p>
        </div>
    );
};

export default RecordingsPage;
