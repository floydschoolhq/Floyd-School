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
        <section className="bg-[#FCF8F8] py-24 relative overflow-hidden font-['Inter']">
            {/* Background Text */}
            <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
                <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent stroke-text opacity-5 whitespace-nowrap"
                    style={{ WebkitTextStroke: '2px #F5AFAF' }}>
                    THE EDGE
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <p className="text-[#F5AFAF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Elite Standards</p>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 font-['Outfit'] tracking-tighter">
                        The ThinkSkool <span className="text-[#F5AFAF]">Advantage</span>
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
                        <div className="bg-white rounded-[3rem] p-4 border border-[#FBEFEF] shadow-2xl">
                            <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] max-h-[500px]">
                                {/* Video */}
                                <video
                                    src="/Untitled video - Made with Clipchamp.mp4"
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted={muted}
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

                                {/* Mute Button */}
                                <button
                                    onClick={() => setMuted(!muted)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/20"
                                >
                                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>

                                {/* Caption Overlay */}
                                <div className="absolute bottom-24 left-6 right-6">
                                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 inline-block border border-white/10">
                                        <p className="text-white text-lg font-medium leading-snug">
                                            "{data.video?.caption || 'Experience the ThinkSkool advantage'}"
                                        </p>
                                    </div>
                                </div>

                                {/* Speaker Info */}
                                <div className="absolute bottom-6 left-6 font-['Outfit']">
                                    <h3 className="text-[#F5AFAF] font-black text-xl tracking-tight">{data.video?.speakerName}</h3>
                                    <p className="text-slate-300 text-sm font-medium">{data.video?.speakerRole}</p>
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
                                    className="bg-white rounded-[2rem] p-8 flex items-center gap-8 border border-[#FBEFEF] hover:border-[#F5AFAF]/20 shadow-lg hover:shadow-2xl transition-all group"
                                >
                                    <div className={`w-16 h-16 rounded-3xl bg-[#FBEFEF] flex items-center justify-center text-[#F5AFAF] group-hover:scale-110 transition-transform shadow-sm shrink-0`}>
                                        <Icon size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 text-2xl font-black group-hover:text-[#F5AFAF] transition-colors font-['Outfit'] tracking-tight mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                            {feature.description || feature.desc || "Join the elite league of future-ready engineers with hands-on technical mastery."}
                                        </p>
                                    </div>
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
