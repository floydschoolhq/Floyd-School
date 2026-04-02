import React, { useState, useEffect } from 'react';
import { Calendar, Play, Trash2, Loader2, X, Video, ExternalLink, Link, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const VideoUploadPage = () => {
    const toast = useToast();
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [videoUrl, setVideoUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await api.get('/scheduled-live');
            setVideos(res.data);
        } catch (err) {
            console.error('Failed to fetch videos:', err);
        } finally {
            setLoading(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoUrl || !title || !scheduledDate || !scheduledTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        const videoId = extractYouTubeId(videoUrl);
        if (!videoId) {
            toast.error('Invalid YouTube URL. Example: https://www.youtube.com/watch?v=VIDEO_ID');
            return;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        setSubmitting(true);
        try {
            const scheduledStart = new Date(`${scheduledDate}T${scheduledTime}`);
            await api.post('/scheduled-live', {
                title,
                description,
                videoUrl: embedUrl,
                scheduledStart: scheduledStart.toISOString()
            });
            
            toast.success('Live session scheduled successfully');
            setVideoUrl('');
            setTitle('');
            setDescription('');
            setScheduledDate('');
            setScheduledTime('');
            fetchVideos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to schedule');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this scheduled live session?')) return;
        
        try {
            await api.delete(`/scheduled-live/${videoId}`);
            toast.success('Session deleted');
            fetchVideos();
        } catch (err) {
            toast.error('Failed to delete session');
        }
    };

    const handleStartLive = async (liveId) => {
        try {
            await api.put(`/scheduled-live/${liveId}/start`);
            toast.success('Live session started');
            fetchVideos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to start live');
        }
    };

    const handleEndLive = async (liveId) => {
        try {
            await api.put(`/scheduled-live/${liveId}/end`);
            toast.success('Live session ended');
            fetchVideos();
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
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusStyles[status] || statusStyles.scheduled}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Schedule <span className="text-sky-500">Live Session</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Add a YouTube video link and schedule your live session
                    </p>
                </div>
            </header>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-[2.5rem] border border-red-100">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Youtube size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase mb-3">How it works</h3>
                        <ol className="space-y-2 text-sm text-slate-600 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                <span>Upload your video to <a href="https://youtube.com/upload" target="_blank" rel="noopener noreferrer" className="text-red-600 underline font-bold">YouTube</a></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                <span>Copy the video URL (e.g., <code className="bg-white px-2 py-1 rounded-lg text-xs">https://www.youtube.com/watch?v=VIDEO_ID</code>)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                <span>Paste the URL below, fill in details, and schedule your session</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* YouTube URL Form */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                        <Link size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Schedule Live Session</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paste your YouTube URL and set schedule</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YouTube URL *</label>
                        <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                            required
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                        />
                        <p className="text-xs text-slate-400 font-medium ml-1">Supports: youtube.com/watch, youtu.be, youtube.com/embed</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter session title"
                                required
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time *</label>
                            <input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                required
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {submitting ? (
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

            {/* Sessions List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 uppercase">Your Sessions</h3>
                </div>

                {videos.length === 0 ? (
                    <div className="p-12 text-center opacity-50">
                        <Video className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="font-bold text-slate-400 uppercase">No sessions scheduled yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {videos.map((video) => (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-full md:w-48 h-28 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {video.thumbnailUrl ? (
                                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Video className="w-10 h-10 text-slate-300" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-black text-slate-900 truncate">{video.title}</h4>
                                        {getStatusBadge(video.status)}
                                    </div>
                                    {video.description && (
                                        <p className="text-sm text-slate-500 mb-2 truncate">{video.description}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {formatDate(video.scheduledStart)}
                                        </span>
                                        {video.mentor?.name && (
                                            <span>by {video.mentor.name}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {video.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleStartLive(video._id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <Play size={14} />
                                            Go Live
                                        </button>
                                    )}
                                    {video.status === 'live' && (
                                        <button
                                            onClick={() => handleEndLive(video._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-red-600 transition-colors flex items-center gap-2"
                                        >
                                            <X size={14} />
                                            End Live
                                        </button>
                                    )}
                                    {video.videoUrl && (
                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            <ExternalLink size={18} className="text-slate-400" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(video._id)}
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
    );
};

export default VideoUploadPage;
