import React from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Calendar, Clock } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';

const MOCK_RECORDINGS = [
    { id: 1, title: 'Introduction to JavaScript', date: '2024-01-15', duration: '1h 30m', thumbnail: '🎥' },
    { id: 2, title: 'Python Basics', date: '2024-01-18', duration: '2h 00m', thumbnail: '🐍' },
    { id: 3, title: 'Web Development Fundamentals', date: '2024-01-20', duration: '1h 45m', thumbnail: '🌐' },
    { id: 4, title: 'Database Design', date: '2024-01-22', duration: '1h 15m', thumbnail: '💾' },
    { id: 5, title: 'React Components', date: '2024-01-25', duration: '2h 30m', thumbnail: '⚛️' },
    { id: 6, title: 'API Development', date: '2024-01-27', duration: '1h 50m', thumbnail: '🔌' }
];

const RecordingsPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 font-['Inter']"
            >
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit']">
                    Session <span className="text-[#fca96d]">Archive</span>
                </h1>
                <p className="text-sm font-medium text-slate-500">Review proprietary sessions and technical deep dives at your convenience.</p>
            </motion.div>

            {/* Recordings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_RECORDINGS.map((recording, index) => (
                    <motion.div
                        key={recording.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GradientCard
                            gradient="from-[#fca96d] to-orange-500"
                            className="hover:scale-[1.02] transition-transform cursor-pointer group"
                        >
                            {/* Thumbnail */}
                            <div className="bg-slate-50 h-40 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border border-slate-100">
                                <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{recording.thumbnail}</div>
                                <div className="absolute inset-0 bg-[#fca96d]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 bg-[#fca96d]/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                        <Play className="w-6 h-6 text-[#fca96d] fill-[#fca96d] ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight font-['Outfit']">{recording.title}</h3>

                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-['Inter']">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{recording.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{recording.duration}</span>
                                </div>
                            </div>

                            {/* Watch Button */}
                            <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 font-['Outfit']">
                                <Play className="w-4 h-4 fill-white" />
                                Start Session
                            </button>
                        </GradientCard>
                    </motion.div>
                ))}
            </div>

            {/* Footer Note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-12 font-['Outfit']"
            >
                Archive availability: 24 hours post-session integration.
            </motion.p>
        </div>
    );
};

export default RecordingsPage;