import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Volume1, VolumeX, Settings, ChevronDown, Play, Pause, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants (module scope – always safe) ────────────────────────────────

const QUALITY_LABELS = {
    highres: '4K', hd2160: '4K', hd1440: '1440p', hd1080: '1080p',
    hd720: '720p', large: '480p', medium: '360p', small: '240p', tiny: '144p', auto: 'Auto'
};
const QUALITY_PRIORITY = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];

// Module-level helper – NOT inside the component so it is never in TDZ
function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ─── Component ─────────────────────────────────────────────────────────────

const CustomVideoPlayer = ({ videoUrl, autoPlay = false, onReady, isLive = false, scheduledStart = null }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const apiLoaded = useRef(false);
    const playerReady = useRef(false);
    const videoRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [qualityLevels, setQualityLevels] = useState([]);
    const [currentQuality, setCurrentQuality] = useState('auto');
    const [showControls, setShowControls] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

    // Derive videoId safely — extractYouTubeId is a module-level function, never in TDZ
    const videoId = extractYouTubeId(videoUrl);

    // ─── ALL HANDLERS before any useEffect that references them ────────────

    const handleVideoLoadedMetadata = useCallback(() => {
        setIsLoaded(true);
        if (videoRef.current) {
            videoRef.current.volume = volume / 100;
            videoRef.current.muted = isMuted;

            if (isLive && scheduledStart) {
                const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
                videoRef.current.currentTime = elapsedSeconds;
            }

            if (autoPlay) {
                videoRef.current.play().catch(() => {});
            }
        }
        if (onReady) onReady();
    }, [autoPlay, onReady, isLive, scheduledStart, volume, isMuted]);

    const handleQualityChange = useCallback(() => {
        if (playerRef.current) {
            setCurrentQuality(playerRef.current.getPlaybackQuality() || 'auto');
        }
    }, []);

    const handleStateChange = useCallback((event) => {
        if (!window.YT) return;
        switch (event.data) {
            case window.YT.PlayerState.PLAYING:
                setIsPlaying(true);
                setHasStartedPlaying(true);
                break;
            case window.YT.PlayerState.PAUSED:   setIsPlaying(false); break;
            case window.YT.PlayerState.ENDED:    setIsPlaying(false); break;
            default: break;
        }
    }, []);

    const handlePlayerReady = useCallback((event) => {
        playerReady.current = true;
        setIsPlaying(autoPlay);
        setIsLoaded(true);

        if (isLive && scheduledStart) {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
            event.target.seekTo(elapsedSeconds, true);
        }

        event.target.setPlaybackQuality('hd1080');

        const availableLevels = event.target.getAvailableQualityLevels();
        if (availableLevels?.length > 0) {
            setQualityLevels(availableLevels);
            setCurrentQuality(event.target.getPlaybackQuality() || 'auto');
        }

        if (onReady) onReady();
    }, [autoPlay, onReady, isLive, scheduledStart]);

    const initializePlayer = useCallback(() => {
        if (!videoId || playerReady.current || !window.YT?.Player) return;

        playerRef.current = new window.YT.Player('custom-yt-player', {
            videoId,
            suggestedQuality: 'hd1080',
            playerVars: {
                controls: 0, modestbranding: 1, showinfo: 0,
                iv_load_policy: 3, disablekb: 1, fs: 0, rel: 0,
                autoplay: autoPlay ? 1 : 0, playsinline: 1,
                origin: window.location.origin
            },
            events: {
                onReady: handlePlayerReady,
                onStateChange: handleStateChange,
                onPlaybackQualityChange: handleQualityChange
            }
        });
    }, [videoId, autoPlay, handlePlayerReady, handleStateChange, handleQualityChange]);

    const togglePlay = useCallback(() => {
        if (videoId) {
            if (!playerRef.current || !playerReady.current) return;
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                if (isLive && scheduledStart) {
                    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
                    playerRef.current.seekTo(elapsed, true);
                }
                playerRef.current.playVideo();
            }
        } else {
            if (!videoRef.current) return;
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                if (isLive && scheduledStart) {
                    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
                    videoRef.current.currentTime = elapsed;
                }
                videoRef.current.play().catch(() => {});
            }
        }
    }, [videoId, isPlaying, isLive, scheduledStart]);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoId) {
            if (playerRef.current) {
                playerRef.current.setVolume(newVolume);
            }
        } else {
            if (videoRef.current) {
                videoRef.current.volume = newVolume / 100;
                videoRef.current.muted = newVolume === 0;
            }
        }
    }, [videoId]);

    const toggleMute = useCallback(() => {
        const newMute = !isMuted;
        setIsMuted(newMute);
        if (videoId) {
            if (playerRef.current) {
                if (newMute) {
                    playerRef.current.mute();
                } else {
                    playerRef.current.unMute();
                }
            }
        } else {
            if (videoRef.current) {
                videoRef.current.muted = newMute;
            }
        }
    }, [videoId, isMuted]);
    const setQuality = useCallback((quality) => {
        if (!playerRef.current || !playerReady.current) return;
        playerRef.current.setPlaybackQuality(quality);
        setCurrentQuality(quality);
        setShowSettings(false);
    }, []);

    const getQualityLabel = useCallback((level) => QUALITY_LABELS[level] || level, []);

    const getAvailableQualities = useCallback(() => {
        const levels = qualityLevels.length > 0 ? qualityLevels : QUALITY_PRIORITY;
        return ['auto', ...levels];
    }, [qualityLevels]);

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    // ─── EFFECTS (all handlers already defined above) ──────────────────────

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (!videoId) return;
        if (!apiLoaded.current) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
            apiLoaded.current = true;
        }

        window.onYouTubeIframeAPIReady = () => { initializePlayer(); };

        if (window.YT?.Player) {
            initializePlayer();
        }

        return () => {
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) {}
                playerRef.current = null;
            }
        };
    }, [initializePlayer, videoId]);

    useEffect(() => {
        if (playerReady.current && playerRef.current && videoId) {
            setHasStartedPlaying(false);
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

    // ─── Volume Icon helper ────────────────────────────────────────────────

    const VolumeIcon = isMuted || volume === 0
        ? <VolumeX size={20} />
        : volume < 50
            ? <Volume1 size={20} />
            : <Volume2 size={20} />;

    // ─── RENDER ─────────────────────────────────────────────────────────────

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black group overflow-hidden rounded-xl"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Player Element */}
            {videoId ? (
                <div
                    id="custom-yt-player"
                    className="w-full h-full pointer-events-none"
                />
            ) : (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    playsInline
                    className="w-full h-full object-contain pointer-events-none"
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onPlay={() => {
                        setIsPlaying(true);
                        setHasStartedPlaying(true);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                />
            )}

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
                            <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                {isPlaying
                                    ? <Pause size={20} className="text-white" fill="white" />
                                    : <Play size={20} className="text-white" fill="white" />
                                }
                            </button>

                            <div className="flex items-center gap-2">
                                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                                    {VolumeIcon}
                                </button>
                                <input
                                    type="range" min="0" max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                            </div>

                            {isLive && (
                                <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-3 py-1.5 rounded-full select-none ml-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#EF4444]" />
                                    <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Live Broadcast</span>
                                </div>
                            )}

                            <div className="flex-1" />

                            {videoId && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowSettings(s => !s)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Settings size={18} className="text-white" />
                                        <span className="text-white text-xs font-bold">{getQualityLabel(currentQuality)}</span>
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
                                                    <p className="text-[10px] font-semibold text-slate-400 px-3 py-2">Quality</p>
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
                            )}

                            <button
                                onClick={toggleFullscreen}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white flex items-center justify-center ml-1"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            >
                                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {(!isLoaded || (autoPlay && !hasStartedPlaying)) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-30 transition-all duration-500">
                    <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default CustomVideoPlayer;
