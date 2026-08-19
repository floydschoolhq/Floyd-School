import React, { useState, useEffect } from 'react';
import {
    Monitor, Users, Search,
    Play, Eye, Trash2, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const LiveMonitoring = () => {
    const [activeClasses, setActiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [archives, setArchives] = useState([]);
    const [viewMode, setViewMode] = useState('active');

    useEffect(() => {
        fetchActiveClasses();
        const interval = setInterval(fetchActiveClasses, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveClasses = async () => {
        try {
            const res = await api.get('/live-classes/active-all');
            setActiveClasses(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
            const archRes = await api.get('/live-classes/archive');
            setArchives(Array.isArray(archRes.data) ? archRes.data : []);
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

    const handleEndNode = async (id) => {
        if (!window.confirm('Terminate this live class session and disconnect all participants?')) return;
        try {
            await api.put(`/live-classes/${id}/end`);
            toast.success('Session terminated successfully');
            setSelectedClass(null);
            fetchActiveClasses();
        } catch (error) {
            console.error('Termination failed:', error);
            toast.error('Failed to terminate session');
        }
    };

    const filteredClasses = activeClasses.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mentorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Monitor className="text-blue-600" />
                        Live Class Monitoring
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        Real-time oversight of active mentoring sessions & recorded archives
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                        <button 
                            onClick={() => setViewMode('active')} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'active' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Active Classes
                        </button>
                        <button 
                            onClick={() => setViewMode('archive')} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'archive' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Recordings
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 py-2 pl-9 pr-4 rounded-xl font-medium text-slate-900 outline-none focus:border-blue-500 shadow-xs w-52 text-xs"
                        />
                    </div>
                    <button
                        onClick={() => { setLoading(true); fetchActiveClasses(); }}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 shadow-xs cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {viewMode === 'archive' ? (
                    <motion.div key="archive-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {archives.length > 0 ? (
                                archives.filter(arch => arch.title?.toLowerCase().includes(searchTerm.toLowerCase())).map(arch => (
                                    <div key={arch._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition-all">
                                        <div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">{arch.mentorName || 'Unknown Mentor'}</p>
                                            <h4 className="text-base font-bold text-slate-900 mt-1">{arch.title}</h4>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                            <a href={arch.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                                                View Recording
                                            </a>
                                            <button 
                                                onClick={async () => {
                                                    if (window.confirm('Delete this recording?')) {
                                                        try {
                                                            await api.delete(`/live-classes/` + arch._id);
                                                            fetchActiveClasses();
                                                        } catch (e) {
                                                            console.error(e);
                                                        }
                                                    }
                                                }} 
                                                className="text-rose-600 bg-rose-50 p-2 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium col-span-3">
                                    No archive recordings found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : selectedClass ? (
                    <motion.div
                        key="observation-mode"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase">Live Active</span>
                                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedClass.title}</h3>
                                <p className="text-xs text-slate-500 font-medium">Instructor: {selectedClass.mentorName}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEndNode(selectedClass._id)}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    End Session
                                </button>
                                <button 
                                    onClick={() => setSelectedClass(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                                >
                                    Back
                                </button>
                            </div>
                        </div>

                        {selectedClass.streamType === 'youtube' && selectedClass.youtubeUrl ? (
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedClass.youtubeUrl)}?autoplay=1`}
                                    title="Session Feed"
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
                                Live session observer active.
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map(cls => (
                                <div key={cls._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <Users size={12} /> {cls.participantCount || 0}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-900">{cls.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{cls.mentorName}</p>
                                    </div>
                                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                                        <button
                                            onClick={() => setSelectedClass(cls)}
                                            className="flex-1 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Eye size={14} /> Monitor Session
                                        </button>
                                        <button
                                            onClick={() => handleEndNode(cls._id)}
                                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                                            title="End Session"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium col-span-3">
                                No active live sessions currently broadcasted.
                            </div>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveMonitoring;
