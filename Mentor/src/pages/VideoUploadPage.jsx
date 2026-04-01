import React, { useState, useEffect, useRef } from 'react';
import { Upload, Calendar, Clock, Play, Trash2, Loader2, X, Video, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const VideoUploadPage = () => {
    const toast = useToast();
    const fileInputRef = useRef(null);
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const [scheduleModal, setScheduleModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [scheduling, setScheduling] = useState(false);

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

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024 * 1024) {
                toast.error('File size exceeds 2GB limit');
                return;
            }
            setSelectedFile(file);
            setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !title) {
            toast.error('Please select a video and provide a title');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const res = await api.post('/scheduled-live/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            });
            
            toast.success('Video uploaded successfully');
            setSelectedFile(null);
            setTitle('');
            setDescription('');
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchVideos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (!selectedVideo || !scheduledDate || !scheduledTime) {
            toast.error('Please select date and time');
            return;
        }

        setScheduling(true);
        try {
            const scheduledStart = new Date(`${scheduledDate}T${scheduledTime}`);
            await api.post('/scheduled-live', {
                title: selectedVideo.title,
                apiVideoId: selectedVideo.apiVideoId,
                scheduledStart: scheduledStart.toISOString(),
                description: selectedVideo.description
            });
            
            toast.success('Video scheduled successfully');
            setScheduleModal(false);
            setSelectedVideo(null);
            setScheduledDate('');
            setScheduledTime('');
            fetchVideos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to schedule');
        } finally {
            setScheduling(false);
        }
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        
        try {
            await api.delete(`/scheduled-live/${videoId}`);
            toast.success('Video deleted');
            fetchVideos();
        } catch (err) {
            toast.error('Failed to delete video');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
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
                        Video <span className="text-sky-500">Library</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Upload and schedule live video sessions for your students
                    </p>
                </div>
            </header>

            {/* Upload Section */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                        <Upload size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Upload Video</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Supported: MP4, WebM, MOV (Max 2GB)</p>
                    </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-sky-300 transition-colors">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                            {selectedFile ? (
                                <div className="flex items-center justify-center gap-4">
                                    <Video className="w-12 h-12 text-sky-500" />
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-500">{(selectedFile.size / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="p-2 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold">Click to upload or drag and drop</p>
                                </>
                            )}
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter video title"
                                required
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description"
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-sky-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-sky-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Upload Video
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Videos List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 uppercase">Your Videos</h3>
                </div>

                {videos.length === 0 ? (
                    <div className="p-12 text-center opacity-50">
                        <Video className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="font-bold text-slate-400 uppercase">No videos uploaded yet</p>
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
                                        {video.mentorName && (
                                            <span>by {video.mentorName}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {video.status === 'scheduled' && (
                                        <button
                                            onClick={() => {
                                                setSelectedVideo(video);
                                                setScheduleModal(true);
                                            }}
                                            className="px-4 py-2 bg-sky-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-sky-600 transition-colors flex items-center gap-2"
                                        >
                                            <Calendar size={14} />
                                            Schedule
                                        </button>
                                    )}
                                    {video.videoUrl && (
                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            <Play size={18} className="text-slate-400" />
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

            {/* Schedule Modal */}
            <AnimatePresence>
                {scheduleModal && selectedVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setScheduleModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase">Schedule Live</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedVideo.title}</p>
                                </div>
                                <button
                                    onClick={() => setScheduleModal(false)}
                                    className="p-3 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSchedule} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 outline-none focus:border-sky-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={scheduling}
                                    className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {scheduling ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Calendar size={18} />
                                            Schedule Now
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoUploadPage;