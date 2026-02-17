
import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
    AgoraRTCProvider,
    useRTCClient,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useJoin,
    LocalUser,
    RemoteUser,
    useRemoteUsers,
    useClientEvent
} from 'agora-rtc-react';
import {
    Mic, MicOff, Video, VideoOff, Monitor, PhoneOff,
    Settings, Users, MessageSquare, Share, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveRoom = ({ appId, channelName, token, uid, onEndClass }) => {
    // Agora Client
    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "live", role: "host" }));

    return (
        <AgoraRTCProvider client={client}>
            <Room
                appId={appId}
                channelName={channelName}
                token={token}
                uid={uid}
                onEndClass={onEndClass}
            />
        </AgoraRTCProvider>
    );
};

const Room = ({ appId, channelName, token, uid, onEndClass }) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Tracks
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicOn);
    const { localCameraTrack } = useLocalCameraTrack(isCamOn);

    // Publish
    usePublish([localMicrophoneTrack, localCameraTrack]);

    // Join
    useJoin({ appid: appId, channel: channelName, token: token, uid: uid });

    const remoteUsers = useRemoteUsers();

    // Toggle Handlers
    const toggleMic = () => setIsMicOn(prev => !prev);
    const toggleCam = () => setIsCamOn(prev => !prev);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative">
            {/* Header / Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-rose-500 rounded-lg flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Studio</span>
                    </div>
                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                        {channelName}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2 text-white/80">
                        <Users size={14} />
                        <span className="text-xs font-bold">{remoteUsers.length} Viewers</span>
                    </div>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
                {/* Local User (Broadcaster) */}
                <div className={`relative w-full h-full transition-all ${isScreenSharing ? 'w-1/4 h-1/4 absolute bottom-4 right-4 z-50 rounded-2xl border-2 border-slate-700 shadow-xl' : ''}`}>
                    <LocalUser
                        audioTrack={localMicrophoneTrack}
                        cameraTrack={localCameraTrack}
                        playAudio={false} // Don't play own audio
                        playVideo={isCamOn}
                        className="w-full h-full object-cover"
                    />

                    {!isCamOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 border border-slate-800">
                            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                                <VideoOff className="text-slate-600" size={32} />
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-bold">
                        You (Host)
                    </div>
                </div>

                {/* Placeholder for Screen Share (Implementation requires separate track logic) */}
                {isScreenSharing && (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
                        <div className="text-center">
                            <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-sm font-bold uppercase tracking-widest">Screen Sharing Active</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Control Bar */}
            <div className="bg-slate-900 p-4 md:p-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 border-t border-slate-800 relative z-30">
                <ControlBtn
                    onClick={toggleMic}
                    active={isMicOn}
                    icon={isMicOn ? Mic : MicOff}
                    label={isMicOn ? 'Mute' : 'Unmute'}
                    color={isMicOn ? 'bg-slate-800' : 'bg-rose-500/20 text-rose-500'}
                />

                <ControlBtn
                    onClick={toggleCam}
                    active={isCamOn}
                    icon={isCamOn ? Video : VideoOff}
                    label={isCamOn ? 'Stop Video' : 'Start Video'}
                    color={isCamOn ? 'bg-slate-800' : 'bg-rose-500/20 text-rose-500'}
                />

                <div className="hidden md:block w-px h-10 bg-slate-800 mx-2"></div>

                <ControlBtn
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    active={isScreenSharing}
                    icon={Monitor}
                    label="Screen"
                    color={isScreenSharing ? 'bg-sky-500 text-white' : 'bg-slate-800'}
                />

                <ControlBtn
                    onClick={() => { }}
                    active={false}
                    icon={Settings}
                    label="Settings"
                    color="bg-slate-800"
                />

                <div className="hidden md:block w-px h-10 bg-slate-800 mx-2"></div>

                <button
                    onClick={onEndClass}
                    className="group flex flex-col items-center gap-1.5 min-w-[60px] md:min-w-[80px]"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-rose-500 hover:bg-rose-600 transition-all flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 active:scale-95">
                        <PhoneOff className="text-white" size={20} />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-500 transition-colors">End</span>
                </button>
            </div>
        </div>
    );
};

const ControlBtn = ({ onClick, active, icon: Icon, label, color }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center gap-1.5 min-w-[60px] md:min-w-[80px]"
    >
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl transition-all flex items-center justify-center ${color} hover:bg-slate-700 text-white group-hover:scale-105 active:scale-95`}>
            <Icon size={18} />
        </div>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{label}</span>
    </button>
);

export default LiveRoom;
