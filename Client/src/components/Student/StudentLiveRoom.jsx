
import React, { useState, useEffect } from 'react';
import AgoraRTC, {
    AgoraRTCProvider,
    useRTCClient,
    RemoteUser,
    useRemoteUsers,
    useJoin,
    useClientEvent
} from 'agora-rtc-react';
import {
    Maximize2, Volume2, VolumeX, MessageSquare,
    ShieldCheck, Zap, Info, Play
} from 'lucide-react';

const StudentLiveRoom = ({ appId, channelName, token, uid }) => {
    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "live", role: "audience" }));

    return (
        <AgoraRTCProvider client={client}>
            <ParticipantRoom
                appId={appId}
                channelName={channelName}
                token={token}
                uid={uid}
            />
        </AgoraRTCProvider>
    );
};

const ParticipantRoom = ({ appId, channelName, token, uid }) => {
    const [isMuted, setIsMuted] = useState(false);
    const remoteUsers = useRemoteUsers();

    // Join as audience
    useJoin({ appid: appId, channel: channelName, token: token, uid: uid });

    // Host is usually the first remote user or we can filter by role if needed
    // In this simple setup, any remote user is likely the host
    const hostUser = remoteUsers.find(user => user.videoTrack);

    return (
        <div className="w-full h-full bg-slate-900 relative overflow-hidden group">
            {/* Viewport */}
            <div className="w-full h-full flex items-center justify-center">
                {hostUser ? (
                    <RemoteUser
                        user={hostUser}
                        playAudio={!isMuted}
                        playVideo={true}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-6 p-12 text-center">
                        <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center animate-pulse">
                            <Zap className="text-sky-500 w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 italic">Awaiting Signal...</h3>
                            <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">
                                Successfully handshaked with the uplink. Waiting for the mentor to initialize the stream.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Info Bar */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3 pointer-events-auto">
                    <div className="px-3 py-1.5 bg-sky-500 rounded-full flex items-center gap-2 shadow-lg shadow-sky-500/20">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Connected</span>
                    </div>
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-[9px] font-bold tracking-widest uppercase">
                        Agora Real-time Node
                    </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <button className="p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-sky-500 transition-colors">
                        <Info size={16} />
                    </button>
                    <button className="p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-sky-500 transition-colors">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 md:gap-4 px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 max-w-[90vw]">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 md:p-3 rounded-xl transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <div className="hidden md:block h-6 w-px bg-white/20 mx-2"></div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-[7px] md:text-[8px] font-black text-sky-400 uppercase tracking-widest leading-none mb-1">Status</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck size={10} className="text-emerald-400" />
                        <span className="hidden xs:inline">Secure Node</span>
                    </span>
                </div>

                <div className="hidden md:block h-6 w-px bg-white/20 mx-2"></div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 rounded-lg border border-sky-500/20">
                    <Play size={10} className="text-sky-500 fill-current" />
                    <span className="text-[9px] md:text-[10px] font-black text-sky-500 uppercase tracking-widest italic">Live Session</span>
                </div>
            </div>

            {/* Watermark */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 vertical-text pointer-events-none opacity-20 select-none">
                <span className="text-[10px] font-black text-white uppercase tracking-[1em]">THINKSKOOL FRAMEWORK</span>
            </div>
        </div>
    );
};

export default StudentLiveRoom;
