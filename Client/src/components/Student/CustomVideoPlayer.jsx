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
    const ytContainerRef = useRef(null);
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

    // Derive videoId safely
    const videoId = extractYouTubeId(videoUrl);
    
    // Google Drive direct streaming resolution
    const fileId = getGoogleDriveFileId(videoUrl);
    const directVideoUrl = fileId ? `https://docs.google.com/uc?export=download&id=${fileId}` : videoUrl;

    // Local storage key for recorded video playback resumption
    const progressKey = videoUrl ? `thinkskool_playback_${encodeURIComponent(videoUrl)}` : null;

    // ─── Stable Refs for Asynchronous Actions (Latest Ref Pattern) ────────────────────
    const latestRef = useRef({
        autoPlay,
        isLive,
        scheduledStart,
        onReady,
        isMuted,
        volume,
        isPlaying,
        progressKey,
    });
    useEffect(() => {
        latestRef.current = {
            autoPlay,
            isLive,
            scheduledStart,
            onReady,
            isMuted,
            volume,
            isPlaying,
            progressKey,
        };
    });

    // ─── Direct Video Event Handlers ───────────────────────────────────────────

    const handleVideoLoadedMetadata = useCallback(() => {
        setIsLoaded(true);
        if (videoRef.current) {
            videoRef.current.volume = latestRef.current.volume / 100;
            videoRef.current.muted = latestRef.current.isMuted;

            if (latestRef.current.isLive && latestRef.current.scheduledStart) {
                const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(latestRef.current.scheduledStart).getTime()) / 1000));
                videoRef.current.currentTime = elapsedSeconds;
            } else if (!latestRef.current.isLive && latestRef.current.progressKey) {
                const savedTime = localStorage.getItem(latestRef.current.progressKey);
                if (savedTime) {
                    videoRef.current.currentTime = parseFloat(savedTime);
                }
            }

            if (latestRef.current.autoPlay) {
                videoRef.current.play().catch(() => {});
            }
        }
        if (latestRef.current.onReady) latestRef.current.onReady();
    }, []);

    // ─── Control Action Callbacks ──────────────────────────────────────────────

    const togglePlay = useCallback(() => {
        if (latestRef.current.isLive && latestRef.current.isPlaying) return; // Disallow pausing during active live broadcasts!
        if (videoId) {
            if (!playerRef.current || !playerReady.current) return;
            if (latestRef.current.isPlaying) {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
            } else {
                if (latestRef.current.isLive && latestRef.current.scheduledStart) {
                    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(latestRef.current.scheduledStart).getTime()) / 1000));
                    playerRef.current.seekTo(elapsed, true);
                }
                playerRef.current.playVideo();
                setIsPlaying(true);
            }
        } else {
            if (!videoRef.current) return;
            if (latestRef.current.isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                if (latestRef.current.isLive && latestRef.current.scheduledStart) {
                    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(latestRef.current.scheduledStart).getTime()) / 1000));
                    videoRef.current.currentTime = elapsed;
                }
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
            }
        }
    }, [videoId]);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoId) {
            if (playerRef.current && playerReady.current) {
                playerRef.current.setVolume(newVolume);
                if (newVolume > 0 && playerRef.current.isMuted()) {
                    playerRef.current.unMute();
                }
            }
        } else {
            if (videoRef.current) {
                videoRef.current.volume = newVolume / 100;
                videoRef.current.muted = newVolume === 0;
            }
        }
    }, [videoId]);

    const toggleMute = useCallback(() => {
        const newMute = !latestRef.current.isMuted;
        setIsMuted(newMute);
        if (videoId) {
            if (playerRef.current && playerReady.current) {
                if (newMute) {
                    playerRef.current.mute();
                } else {
                    playerRef.current.unMute();
                    playerRef.current.setVolume(latestRef.current.volume || 50);
                }
            }
        } else {
            if (videoRef.current) {
                videoRef.current.muted = newMute;
                if (!newMute) {
                    videoRef.current.volume = latestRef.current.volume / 100;
                }
            }
        }
    }, [videoId]);

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
        if (!latestRef.current.isLive || !latestRef.current.scheduledStart) return;
        let elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(latestRef.current.scheduledStart).getTime()) / 1000));
        
        if (videoId) {
            if (playerRef.current && playerReady.current && typeof playerRef.current.seekTo === 'function') {
                const durationVal = playerRef.current.getDuration() || 0;
                if (durationVal > 0 && elapsedSeconds > durationVal) {
                    elapsedSeconds = durationVal;
                }
                const currentYTTime = playerRef.current.getCurrentTime() || 0;
                if (Math.abs(currentYTTime - elapsedSeconds) > 3) {
                    playerRef.current.seekTo(elapsedSeconds, true);
                }
            }
        } else {
            if (videoRef.current) {
                const durationVal = videoRef.current.duration || 0;
                if (durationVal > 0 && elapsedSeconds > durationVal) {
                    elapsedSeconds = durationVal;
                }
                const currentVideoTime = videoRef.current.currentTime || 0;
                if (Math.abs(currentVideoTime - elapsedSeconds) > 3) {
                    videoRef.current.currentTime = elapsedSeconds;
                }
            }
        }
    }, [videoId]);

    // ─── YouTube Setup Effect (Strictly Single Run per videoId) ──────────────────

    useEffect(() => {
        if (!videoId) return;

        // 1. Create a clean child element inside the stable ref container to bypass React Virtual DOM conflicts
        const targetDiv = document.createElement('div');
        targetDiv.className = 'w-full h-full';
        if (ytContainerRef.current) {
            ytContainerRef.current.innerHTML = '';
            ytContainerRef.current.appendChild(targetDiv);
        }

        let ytPlayer = null;
        playerReady.current = false;

        const onPlayerReady = (event) => {
            playerReady.current = true;
            playerRef.current = event.target; // STABLE FIX: Use event.target instead of parent scoped ytPlayer!

            // Initial sound setup - start muted to prevent aggressive browser autoplay blocking
            if (latestRef.current.isMuted) {
                event.target.mute();
            } else {
                event.target.unMute();
                event.target.setVolume(latestRef.current.volume);
            }

            // Precise seek resumption
            if (latestRef.current.isLive && latestRef.current.scheduledStart) {
                const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(latestRef.current.scheduledStart).getTime()) / 1000));
                event.target.seekTo(elapsedSeconds, true);
            } else if (!latestRef.current.isLive && latestRef.current.progressKey) {
                const savedTime = localStorage.getItem(latestRef.current.progressKey);
                if (savedTime) {
                    event.target.seekTo(parseFloat(savedTime), true);
                }
            }

            event.target.setPlaybackQuality('hd1080');

            if (latestRef.current.autoPlay || latestRef.current.isLive) {
                event.target.playVideo();
                setIsPlaying(true);
            }

            // Sync quality levels
            const availableLevels = event.target.getAvailableQualityLevels();
            if (availableLevels && availableLevels.length > 0) {
                setQualityLevels(availableLevels);
                setCurrentQuality(event.target.getPlaybackQuality() || 'auto');
            }

            setIsLoaded(true);
            if (latestRef.current.onReady) latestRef.current.onReady();
        };

        const onPlayerStateChange = (event) => {
            if (!window.YT) return;
            switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                    setIsPlaying(true);
                    setHasStartedPlaying(true);
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
        };

        const onPlayerQualityChange = (event) => {
            setCurrentQuality(event.target.getPlaybackQuality() || 'auto');
        };

        const init = () => {
            if (!window.YT?.Player) return;
            // STABLE FIX: Pass explicit width/height: '100%' so YouTube iframe scales properly inside absolute bounds!
            ytPlayer = new window.YT.Player(targetDiv, {
                width: '100%',
                height: '100%',
                videoId,
                suggestedQuality: 'hd1080',
                playerVars: {
                    controls: 0, modestbranding: 1, showinfo: 0,
                    iv_load_policy: 3, disablekb: 1, fs: 0, rel: 0,
                    autoplay: latestRef.current.autoPlay ? 1 : 0, playsinline: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                    onPlaybackQualityChange: onPlayerQualityChange
                }
            });
        };

        if (!apiLoaded.current) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
            apiLoaded.current = true;
        }

        if (window.YT?.Player) {
            init();
        } else {
            const prevCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevCallback) prevCallback();
                init();
            };
        }

        return () => {
            playerReady.current = false;
            if (ytPlayer) {
                try { ytPlayer.destroy(); } catch (_) {}
            }
            if (ytContainerRef.current) {
                ytContainerRef.current.innerHTML = '';
            }
            playerRef.current = null;
        };
    }, [videoId]);

    // ─── Peripheral Control Effects ──────────────────────────────────────────

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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
            syncLiveTime();
            interval = setInterval(() => {
                syncLiveTime();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isLive, scheduledStart, syncLiveTime]);

    // ─── Volume Icon Helper ────────────────────────────────────────────────

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
            {/* Player Element wrapper */}
            {videoId ? (
                <div
                    ref={ytContainerRef}
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

            {/* Click Blocker Layer (Triggers play/pause on empty areas) */}
            <div 
                onClick={() => {
                    togglePlay();
                    setShowControls(true);
                }}
                className="absolute inset-0 bg-transparent z-10 pointer-events-auto cursor-pointer"
            />

            {/* Pulsing Mute Alert Indicator (Elevated to z-30 to stack on top of controls layout) */}
            {isLive && isPlaying && isMuted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse z-30 cursor-pointer shadow-md flex items-center gap-1.5"
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlay();
                                }}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
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
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
                                />
                                <span className="text-white text-xs font-semibold select-none">{formatTime(duration)}</span>
                            </div>
                        )}

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
                            {!isLive && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePlay();
                                    }} 
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                                >
                                    {isPlaying
                                        ? <Pause size={20} className="text-white" fill="white" />
                                        : <Play size={20} className="text-white" fill="white" />
                                    }
                                </button>
                            )}

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMute();
                                    }} 
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white cursor-pointer"
                                >
                                    {VolumeIcon}
                                </button>
                                <input
                                    type="range" min="0" max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    onClick={(e) => e.stopPropagation()}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSettings(s => !s);
                                        }}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setQuality(level);
                                                            }}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFullscreen();
                                }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white flex items-center justify-center ml-1 cursor-pointer"
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
