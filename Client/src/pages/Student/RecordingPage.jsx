import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Play, Calendar, Clock, X, GraduationCap, PlayCircle, BookOpen, MessageSquare } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';
import CommentSection from '../../components/Student/CommentSection';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-slate-900 text-xl font-black animate-pulse uppercase tracking-widest">Accessing Archive...</div>
            </div>
        );
    }

    // Flatten modules from all courses
    const courseModules = courses.flatMap(course =>
        (course.modules || []).map(module => ({
            ...module,
            courseTitle: course.title,
            instructor: course.instructor?.name || 'ThinkSkool Master',
            isLiveArchive: false
        }))
    );

    const liveArchiveModules = liveRecordings.map(lc => ({
        _id: lc._id,
        title: lc.title,
        videoUrl: lc.meetingLink, // In 'premiere' and 'youtube' modes, this is the video URL
        courseTitle: 'Live Session Archive',
        instructor: lc.mentorName || 'ThinkSkool Mentor',
        isLiveArchive: true,
        createdAt: lc.startedAt
    }));

    const allModules = [...liveArchiveModules, ...courseModules].filter(m => m.videoUrl);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 font-['Inter']"
            >
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit']">
                    Session <span className="text-[#2563EB]">Archive</span>
                </h1>
                <p className="text-base font-medium text-slate-500">Review proprietary sessions and technical deep dives at your convenience.</p>
            </motion.div>

            {/* Recordings Grid */}
            {allModules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allModules.map((module, index) => (
                        <motion.div
                            key={module._id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GradientCard
                                gradient="from-[#2563EB] to-[#2563EB]"
                                className="hover:scale-[1.02] transition-transform cursor-pointer group"
                            >
                                {/* Thumbnail Placeholder */}
                                <div className="bg-slate-900 h-40 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border border-slate-100">
                                    {getYouTubeId(module.videoUrl) ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${getYouTubeId(module.videoUrl)}/mqdefault.jpg`}
                                            alt={module.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <Video className="w-12 h-12 text-white/20" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-\[12px\] font-black text-white/60 uppercase tracking-widest truncate">{module.courseTitle}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-[#2563EB]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 bg-[#2563EB]/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <Play className="w-6 h-6 text-[#2563EB] fill-[#2563EB] ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-slate-900 text-lg tracking-tight font-['Outfit'] line-clamp-1">{module.title}</h3>
                                    <p className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB]">{module.instructor}</p>
                                </div>

                                <div className="mt-6 flex items-center justify-between gap-4">
                                    <button
                                        onClick={() => setSelectedVideo(module)}
                                        className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 font-['Outfit']"
                                    >
                                        <Play className="w-4 h-4 fill-white" />
                                        Watch
                                    </button>
                                </div>
                            </GradientCard>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
                    <BookOpen size={64} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-base">No synchronized recordings found</p>
                    <p className="text-slate-300 text-base font-bold mt-2 italic">Waiting for mentor to link curriculum modules...</p>
                </div>
            )}

            {/* Video Player Portal */}
            <AnimatePresence>
                {selectedVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVideo(null)}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="aspect-video bg-black relative">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.videoUrl)}?autoplay=1&rel=0`}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-8 flex items-center justify-between gap-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-sky-50 text-sky-500 px-3 py-1 rounded-full text-\[13px\] font-black uppercase tracking-widest">
                                            {selectedVideo.courseTitle}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-\[13px\] font-black text-slate-400 uppercase tracking-widest">
                                            {selectedVideo.instructor}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit'] italic">
                                        {selectedVideo.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Discussion Area */}
                            <div className="px-8 pb-12 max-h-[400px] overflow-y-auto custom-scrollbar">
                                <CommentSection moduleId={selectedVideo._id} moduleTitle={selectedVideo.title} />
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
                className="text-center text-\[13px\] font-black text-slate-400 uppercase tracking-widest mt-12 font-['Outfit']"
            >
                Archive availability: Synchronized with Mentor Curriculum Nodes.
            </motion.p>
        </div>
    );
};

export default RecordingsPage;