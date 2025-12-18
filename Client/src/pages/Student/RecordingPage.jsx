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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-600">
                    Class Recordings Archive
                </h1>
                <p className="text-slate-400">Catch up on missed lectures and tutorials at your own pace</p>
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
                            gradient="from-rose-500 via-pink-500 to-purple-500"
                            className="hover:scale-105 transition-transform cursor-pointer group"
                        >
                            {/* Thumbnail */}
                            <div className="bg-slate-800/50 h-40 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                                <div className="text-6xl">{recording.thumbnail}</div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="font-semibold text-white text-lg mb-2">{recording.title}</h3>

                            <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{recording.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{recording.duration}</span>
                                </div>
                            </div>

                            {/* Watch Button */}
                            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" />
                                Watch Now
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
                className="text-center text-sm text-slate-500 mt-8"
            >
                Recordings are available 24 hours after the live session
            </motion.p>
        </div>
    );
};

export default RecordingsPage;