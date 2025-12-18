import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, Briefcase, Play, Volume2, VolumeX } from 'lucide-react';
import api from '../api/axios';

const WhyUsVideo = () => {
    const [data, setData] = useState(null);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/why-us');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch Why Us data", err);
            }
        };
        fetchData();
    }, []);

    if (!data || !data.video || !data.features) return null;

    const IconMap = {
        'Chat': MessageCircle,
        'User': User,
        'Briefcase': Briefcase
    };

    return (
        <section className="bg-[#0f1115] py-24 relative overflow-hidden font-['Inter']">
            {/* Background Text */}
            <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
                <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent stroke-text opacity-5 whitespace-nowrap"
                    style={{ WebkitTextStroke: '2px #333' }}>
                    THE EDGE
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <p className="text-[#fca96d] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Elite Standards</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white font-['Outfit']">
                        The ThinkSkool <span className="text-[#fca96d]">Advantage</span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left: Video Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative max-w-sm mx-auto"
                    >
                        <div className="bg-[#1a1d21] rounded-3xl p-2 border border-slate-800 shadow-2xl">
                            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[500px]">
                                {/* Video */}
                                <video
                                    src="/Untitled video - Made with Clipchamp.mp4"
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted={muted}
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                                {/* Mute Button */}
                                <button
                                    onClick={() => setMuted(!muted)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>

                                {/* Caption Overlay */}
                                <div className="absolute bottom-24 left-6 right-6">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 inline-block">
                                        <p className="text-white text-lg font-medium leading-snug">
                                            "{data.video?.caption || 'Experience the ThinkSkool advantage'}"
                                        </p>
                                    </div>
                                </div>

                                {/* Speaker Info */}
                                <div className="absolute bottom-6 left-6 font-['Outfit']">
                                    <h3 className="text-[#fca96d] font-black text-xl">{data.video?.speakerName}</h3>
                                    <p className="text-slate-400 text-sm font-medium">{data.video?.speakerRole}</p>
                                </div>

                                {/* Progress Ring (Visual Only for now) */}
                                <div className="absolute bottom-6 right-6 w-10 h-10 border-2 border-slate-700 rounded-full flex items-center justify-center text-xs text-white font-mono">
                                    23
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Features */}
                    <div className="space-y-8">
                        {data.features.map((feature, index) => {
                            const Icon = IconMap[feature.icon] || MessageCircle;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    className="bg-[#16191d] rounded-2xl p-6 flex items-center gap-6 border border-slate-800 hover:border-slate-700 transition-colors group"
                                >
                                    <div className={`w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="text-white text-xl font-black group-hover:text-[#fca96d] transition-colors font-['Outfit']">
                                        {feature.title}
                                    </h3>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyUsVideo;
