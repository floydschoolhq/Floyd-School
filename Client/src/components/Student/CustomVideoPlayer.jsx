import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Volume1, VolumeX, Settings, ChevronDown, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUALITY_LABELS = {
    highres: '4K',
    hd2160: '4K',
    hd1440: '1440p',
    hd1080: '1080p',
    hd720: '720p',
    large: '480p',
    medium: '360p',
    small: '240p',
    tiny: '144p',
    auto: 'Auto'
};

const QUALITY_PRIORITY = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];

const CustomVideoPlayer = ({ videoUrl, autoPlay = false, onReady, isLive = false, scheduledStart = null }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const apiLoaded = useRef(false);
    const playerReady = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [qualityLevels, setQualityLevels] = useState([]);
    const [currentQuality, setCurrentQuality] = useState('auto');
    const [showControls, setShowControls] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const videoId = extractYouTubeId(videoUrl);

    useEffect(() => {
        if (!apiLoaded.current) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
            apiLoaded.current = true;
        }

        window.onYouTubeIframeAPIReady = () => {
            initializePlayer();
        };

        if (window.YT && window.YT.Player) {
            initializePlayer();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (playerReady.current && playerRef.current && videoId) {
            playerRef.current.loadVideoById(videoId);
            setIsLoaded(true);
        }
    }, [videoId]);

    useEffect(() => {
        let timeout;
        if (isPlaying) {
            timeout = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, showControls]);

    const initializePlayer = useCallback(() => {
        if (!videoId || playerReady.current) return;

        playerRef.current = new window.YT.Player('custom-yt-player', {
            videoId,
            suggestedQuality: 'hd1080',
            playerVars: {
                controls: 0,
                modestbranding: 1,
                showinfo: 0,
                iv_load_policy: 3,
                disablekb: 1,
                fs: 0,
                rel: 0,
                autoplay: autoPlay ? 1 : 0,
                playsinline: 1,
                origin: window.location.origin
            },
            events: {
                onReady: handlePlayerReady,
                onStateChange: handleStateChange,
                onPlaybackQualityChange: handleQualityChange
            }
        });
    }, [videoId, autoPlay, handlePlayerReady, handleStateChange, handleQualityChange]);

    const handlePlayerReady = useCallback((event) => {
        playerReady.current = true;
        setIsPlaying(autoPlay);
        setIsLoaded(true);

        if (isLive && scheduledStart) {
            const elapsedSeconds = Math.max(0, Math.floor((new Date().getTime() - new Date(scheduledStart).getTime()) / 1000));
            event.target.seekTo(elapsedSeconds, true);
        }

        // Suggest HD 1080 for premium streaming experience
        event.target.setPlaybackQuality('hd1080');

        const availableLevels = event.target.getAvailableQualityLevels();
        if (availableLevels && availableLevels.length > 0) {
            setQualityLevels(availableLevels);
            setCurrentQuality(event.target.getPlaybackQuality() || 'auto');
        }

        if (onReady) onReady();
    }, [autoPlay, onReady, isLive, scheduledStart]);

    const handleStateChange = useCallback((event) => {
        switch (event.data) {
            case window.YT.PlayerState.PLAYING:
                setIsPlaying(true);
                break;
            case window.YT.PlayerState.PAUSED:
                setIsPlaying(false);
                break;
            case window.YT.PlayerState.ENDED:
                setIsPlaying(false);
                break;
            default:
                break;
        }
    }, []);

    const handleQualityChange = useCallback(() => {
        if (playerRef.current) {
            setCurrentQuality(playerRef.current.getPlaybackQuality() || 'auto');
        }
    }, []);

    const extractYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const togglePlay = () => {
        if (!playerRef.current || !playerReady.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            if (isLive && scheduledStart) {
                const elapsedSeconds = Math.max(0, Math.floor((new Date().getTime() - new Date(scheduledStart).getTime()) / 1000));
                playerRef.current.seekTo(elapsedSeconds, true);
            }
            playerRef.current.playVideo();
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const setQuality = (quality) => {
        if (!playerRef.current || !playerReady.current) return;
        playerRef.current.setPlaybackQuality(quality);
        setCurrentQuality(quality);
        setShowSettings(false);
    };

    const getQualityLabel = (level) => {
        return QUALITY_LABELS[level] || level;
    };

    const getAvailableQualities = () => {
        const levels = qualityLevels.length > 0 ? qualityLevels : QUALITY_PRIORITY;
        return ['auto', ...levels];
    };

    const VolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX size={20} />;
        if (volume < 50) return <Volume1 size={20} />;
        return <Volume2 size={20} />;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black group overflow-hidden rounded-xl"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* YouTube Player */}
            <div
                id="custom-yt-player"
                className="w-full h-full pointer-events-none"
                style={{ transform: 'scale(1.25)', transformOrigin: 'center' }}
            />

            {/* Overlay Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
                    >
                        {/* Center Play Button */}
                        {!isPlaying && (
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={togglePlay}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                    <Play size={40} className="text-white ml-1" fill="white" />
                                </div>
                            </motion.button>
                        )}

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause size={20} className="text-white" fill="white" />
                                ) : (
                                    <Play size={20} className="text-white" fill="white" />
                                )}
                            </button>

                            {/* Volume */}
                            <div className="flex items-center gap-2 group/volume">
                                <button
                                    onClick={toggleMute}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <VolumeIcon className="text-white" />
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                            </div>

                            {/* Dynamic Live Indicator badge */}
                            {isLive && (
                                <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-3 py-1.5 rounded-full select-none ml-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#EF4444]" />
                                    <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Live Broadcast</span>
                                </div>
                            )}

                            <div className="flex-1" />

                            {/* Quality Settings */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Settings size={18} className="text-white" />
                                    <span className="text-white text-xs font-bold">
                                        {getQualityLabel(currentQuality)}
                                    </span>
                                    <ChevronDown size={14} className="text-white" />
                                </button>

                                <AnimatePresence>
                                    {showSettings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute bottom-full right-0 mb-2 bg-slate-900/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 min-w-[140px]"
                                        >
                                            <div className="p-2">
                                                <p className="text-[10px] font-semibold text-slate-400 font-medium px-3 py-2">Quality</p>
                                                {getAvailableQualities().map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setQuality(level)}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            currentQuality === level
                                                                ? 'bg-sky-500/20 text-sky-400'
                                                                : 'text-white hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {getQualityLabel(level)}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default CustomVideoPlayer;
