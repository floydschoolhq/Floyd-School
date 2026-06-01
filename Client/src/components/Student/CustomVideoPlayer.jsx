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

function getGoogleDriveFileId(url) {
    if (!url) return null;
    const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})[/?]?/);
    if (matchD && matchD[1]) return matchD[1];
    
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
    if (matchId && matchId[1]) return matchId[1];
    
    if (url.match(/^[a-zA-Z0-9_-]{25,}$/)) return url;
    return null;
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
    const [isMuted, setIsMuted] = useState(autoPlay || isLive);
    const [showSettings, setShowSettings] = useState(false);
    const [qualityLevels, setQualityLevels] = useState([]);
    const [currentQuality, setCurrentQuality] = useState('auto');
    const [showControls, setShowControls] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Derive videoId safely — extractYouTubeId is a module-level function, never in TDZ
    const videoId = extractYouTubeId(videoUrl);
    
    // Google Drive direct streaming resolution
    const fileId = getGoogleDriveFileId(videoUrl);
    const directVideoUrl = fileId ? `https://docs.google.com/uc?export=download&id=${fileId}` : videoUrl;

    // Local storage key for recorded video playback resumption
    const progressKey = videoUrl ? `thinkskool_playback_${encodeURIComponent(videoUrl)}` : null;

    // ─── ALL HANDLERS before any useEffect that references them ────────────

    const handleVideoLoadedMetadata = useCallback(() => {
        setIsLoaded(true);
        if (videoRef.current) {
            videoRef.current.volume = volume / 100;
            videoRef.current.muted = isMuted;

            if (isLive && scheduledStart) {
                const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
                videoRef.current.currentTime = elapsedSeconds;
            } else if (!isLive && progressKey) {
                const savedTime = localStorage.getItem(progressKey);
                if (savedTime) {
                    videoRef.current.currentTime = parseFloat(savedTime);
                }
            }

            if (autoPlay) {
                videoRef.current.play().catch(() => {});
            }
        }
        if (onReady) onReady();
    }, [autoPlay, onReady, isLive, scheduledStart, volume, isMuted, progressKey]);

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
        setIsPlaying(autoPlay || isLive);
        setIsLoaded(true);

        if (isLive && scheduledStart) {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
            event.target.seekTo(elapsedSeconds, true);
        } else if (!isLive && progressKey) {
            const savedTime = localStorage.getItem(progressKey);
            if (savedTime) {
                event.target.seekTo(parseFloat(savedTime), true);
            }
        }

        event.target.setPlaybackQuality('hd1080');

        if (isMuted) {
            event.target.mute();
        } else {
            event.target.unMute();
        }

        if (autoPlay || isLive) {
            event.target.playVideo();
        }

        const availableLevels = event.target.getAvailableQualityLevels();
        if (availableLevels?.length > 0) {
            setQualityLevels(availableLevels);
            setCurrentQuality(event.target.getPlaybackQuality() || 'auto');
        }

        if (onReady) onReady();
    }, [autoPlay, onReady, isLive, scheduledStart, isMuted, progressKey]);

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
        if (isLive && isPlaying) return; // Disallow pausing during active live broadcasts!
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

    const formatTime = useCallback((timeInSeconds) => {
        if (isNaN(timeInSeconds)) return '0:00';
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    const handleSeekChange = useCallback((e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (videoId) {
            if (playerRef.current && playerReady.current) {
                playerRef.current.seekTo(time, true);
            }
        } else {
            if (videoRef.current) {
                videoRef.current.currentTime = time;
            }
        }
    }, [videoId]);

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

    const syncLiveTime = useCallback(() => {
        if (!isLive || !scheduledStart) return;
        let elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(scheduledStart).getTime()) / 1000));
        
        if (videoId) {
            if (playerRef.current && playerReady.current && typeof playerRef.current.seekTo === 'function') {
                const duration = playerRef.current.getDuration() || 0;
                if (duration > 0 && elapsedSeconds > duration) {
                    elapsedSeconds = duration;
                }
                const currentYTTime = playerRef.current.getCurrentTime() || 0;
                if (Math.abs(currentYTTime - elapsedSeconds) > 3) {
                    playerRef.current.seekTo(elapsedSeconds, true);
                }
            }
        } else {
            if (videoRef.current) {
                const duration = videoRef.current.duration || 0;
                if (duration > 0 && elapsedSeconds > duration) {
                    elapsedSeconds = duration;
                }
                const currentVideoTime = videoRef.current.currentTime || 0;
                if (Math.abs(currentVideoTime - elapsedSeconds) > 3) {
                    videoRef.current.currentTime = elapsedSeconds;
                }
            }
        }
    }, [isLive, scheduledStart, videoId]);

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

    useEffect(() => {
        let interval;
        if (isPlaying && videoId && !isLive && playerReady.current && playerRef.current) {
            interval = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const t = playerRef.current.getCurrentTime();
                    setCurrentTime(t);
                    setDuration(playerRef.current.getDuration() || 0);
                    if (progressKey && t > 0) {
                        localStorage.setItem(progressKey, t.toString());
                    }
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, videoId, isLive, progressKey]);

    useEffect(() => {
        let interval;
        if (isPlaying && isLive && scheduledStart) {
            // Sync immediately on play/resume
            syncLiveTime();
            // Periodically check and align time drift every 2 seconds
            interval = setInterval(() => {
                syncLiveTime();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isLive, scheduledStart, syncLiveTime]);

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
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
            ) : (
                <video
                    ref={videoRef}
                    src={directVideoUrl}
                    playsInline
                    preload="auto"
                    muted={isMuted}
                    autoPlay={autoPlay || isLive}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    onTimeUpdate={() => {
                        if (videoRef.current) {
                            const t = videoRef.current.currentTime;
                            setCurrentTime(t);
                            if (!isLive && progressKey && t > 0) {
                                localStorage.setItem(progressKey, t.toString());
                            }
                        }
                    }}
                    onLoadedMetadata={() => {
                        handleVideoLoadedMetadata();
                        if (videoRef.current) {
                            setDuration(videoRef.current.duration || 0);
                        }
                    }}
                    onPlay={() => {
                        setIsPlaying(true);
                        setHasStartedPlaying(true);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setIsLoaded(true)}
                />
            )}

            {/* Premium Click & Pointer Blocker */}
            <div 
                onClick={() => {
                    togglePlay();
                    setShowControls(true);
                }}
                className="absolute inset-0 bg-transparent z-10 pointer-events-auto cursor-pointer"
            />

            {/* Pulsing Mute Alert Indicator */}
            {isLive && isPlaying && isMuted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={toggleMute}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse z-20 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                    <VolumeX size={12} /> Tap to Unmute
                </motion.div>
            )}

            {/* Overlay Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-20"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                togglePlay();
                            }
                        }}
                    >
                        {/* Center Play Button */}
                        {!isPlaying && !isLive && (
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

                        {/* Custom Timeline Progress Bar (Recorded sessions only) */}
                        {!isLive && duration > 0 && (
                            <div className="absolute bottom-16 left-4 right-4 flex items-center gap-3">
                                <span className="text-white text-xs font-semibold select-none">{formatTime(currentTime)}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    step="0.1"
                                    value={currentTime}
                                    onChange={handleSeekChange}
                                    className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
                                />
                                <span className="text-white text-xs font-semibold select-none">{formatTime(duration)}</span>
                            </div>
                        )}

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
                            {!isLive && (
                                <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                    {isPlaying
                                        ? <Pause size={20} className="text-white" fill="white" />
                                        : <Play size={20} className="text-white" fill="white" />
                                    }
                                </button>
                            )}

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
                                    <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Live</span>
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
            {!isLoaded && (
                <div 
                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-30 transition-all duration-500 text-center select-none"
                >
                    <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default CustomVideoPlayer;
