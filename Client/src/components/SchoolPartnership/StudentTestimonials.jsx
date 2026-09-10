import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────
   Testimonial Data — swap these for real assets
   ────────────────────────────────────────────── */
const AUTO_ADVANCE_SECONDS = 10;

const TESTIMONIALS = [
  {
    name: 'Aaradhya',
    grade: 'Grade 7',
    category: 'Learning journey',
    video: '/startup_media/video_1.mp4',
    poster: '/startup_media/photo_1.jpg',
    duration: '1:08',
    quote: 'Floyd School changed the way I think about technology. I built my first AI project in just three weeks and it felt incredible.',
  },
  {
    name: 'Rohan',
    grade: 'Grade 8',
    category: 'School community',
    video: '/startup_media/video_2.mp4',
    poster: '/startup_media/photo_3.jpg',
    duration: '1:12',
    quote: 'The mentors here actually care. They do not just teach — they sit with you, debug with you, and celebrate when your project works.',
  },
  {
    name: 'Meera',
    grade: 'Grade 9',
    category: 'Support received',
    video: '/startup_media/video_3.mp4',
    poster: '/startup_media/photo_5.jpg',
    duration: '1:15',
    quote: 'I was never confident with computers before Floyd. Now I have built three websites and I am learning cybersecurity. It is unreal.',
  },
  {
    name: 'Arjun',
    grade: 'Grade 10',
    category: 'Tech projects',
    video: '/startup_media/video_4.mp4',
    poster: '/startup_media/photo_7.jpg',
    duration: '1:22',
    quote: 'The hackathons and real projects pushed me beyond what I thought was possible. I presented my IoT project to actual industry mentors.',
  },
  {
    name: 'Kavya',
    grade: 'Grade 6',
    category: 'First experience',
    video: '/startup_media/video_5.mp4',
    poster: '/startup_media/photo_9.jpg',
    duration: '1:05',
    quote: 'My first day at Floyd lab I thought coding would be boring. By the end of the week I had made a game. I cannot wait for the next class.',
  },
];

const CATEGORIES = ['Students', 'Parents', 'Alumni'];

/* ── Helpers ─────────────────────── */
const getPrev = (i, len) => (i - 1 + len) % len;
const getNext = (i, len) => (i + 1) % len;

/* ── Tiny inline SVG icons ───────── */
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2.5v11l9-5.5z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="3" y="2" width="3.5" height="12" rx="1" />
    <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
  </svg>
);
const VolumeIcon = ({ muted }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h2l3-3v10l-3-3H3V6z" fill="currentColor" />
    {!muted && (
      <>
        <path d="M11 5.5a3.5 3.5 0 010 5" />
        <path d="M13 3.5a6 6 0 010 9" />
      </>
    )}
    {muted && <line x1="12" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" />}
  </svg>
);
const ExpandIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 1 13 1 13 5" />
    <polyline points="5 13 1 13 1 9" />
    <line x1="13" y1="1" x2="8.5" y2="5.5" />
    <line x1="1" y1="13" x2="5.5" y2="8.5" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4l-5 5 5 5" />
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4l5 5-5 5" />
  </svg>
);

/* ─────────────────────────────────────────────────────────
   Background Poster Layer (uses poster images instead of
   auto-playing videos to avoid resource contention)
   ───────────────────────────────────────────────────────── */
const BgPosterLayer = ({ poster, style, className = '', animationClass = '' }) => (
  <div
    className={`absolute pointer-events-none select-none ${animationClass} ${className}`}
    style={{ ...style, willChange: 'transform' }}
  >
    <img
      src={poster}
      alt=""
      loading="lazy"
      className="w-full h-full object-cover"
      style={{ objectFit: 'cover' }}
    />
  </div>
);

/* ─────────────────────────────────────────────────────────
   Video Card
   Uses a local ref for the <video> element and forwards it
   via the setVideoRef callback so the parent can track it.
   ───────────────────────────────────────────────────────── */
const VideoCard = ({
  testimonial,
  isActive,
  isSide,
  onClick,
  setVideoRef,
  isPlaying,
  isMuted,
  onToggleMute,
  onTogglePlay,
  currentTime,
}) => {
  const localVideoRef = useRef(null);
  const formattedTime = `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`;

  // Forward the video element to the parent ref array whenever the element mounts
  const handleVideoRef = useCallback((el) => {
    localVideoRef.current = el;
    if (setVideoRef) setVideoRef(el);
  }, [setVideoRef]);

  // Sync the muted attribute to the actual video element whenever it changes
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Auto-play when this card becomes active, pause when it's not
  useEffect(() => {
    const vid = localVideoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{ borderRadius: '20px' }}
      onClick={isActive ? onTogglePlay : onClick}
      role="button"
      tabIndex={0}
      aria-label={isActive ? `${isPlaying ? 'Pause' : 'Play'} ${testimonial.name}'s testimonial` : `View ${testimonial.name}'s testimonial`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isActive ? onTogglePlay() : onClick();
        }
      }}
    >
      {/* Video element */}
      <video
        ref={handleVideoRef}
        src={testimonial.video}
        poster={testimonial.poster}
        muted={isMuted}
        loop
        playsInline
        preload={isActive ? 'auto' : 'metadata'}
        className="w-full h-full object-cover"
        style={{
          display: 'block',
          borderRadius: '20px',
        }}
      />

      {/* Dark bottom gradient for info */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '55%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          borderRadius: '0 0 20px 20px',
        }}
      />

      {/* Minimal video controls — only on active */}
      {isActive && (
        <div className="absolute bottom-[70px] left-4 right-4 flex items-center gap-3 z-10">
          {/* Play/pause small */}
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
            className="text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Time */}
          <span className="text-[11px] text-white/60 font-medium tabular-nums tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {formattedTime} / {testimonial.duration}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon muted={isMuted} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const vid = localVideoRef.current;
              if (vid) {
                if (vid.requestFullscreen) vid.requestFullscreen();
                else if (vid.webkitEnterFullScreen) vid.webkitEnterFullScreen();
              }
            }}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Fullscreen"
          >
            <ExpandIcon />
          </button>
        </div>
      )}

      {/* Side card play indicator */}
      {isSide && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <PlayIcon />
          </div>
        </div>
      )}

      {/* Student info */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex items-baseline gap-3">
          <span className="text-white font-semibold text-sm tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {testimonial.name}
          </span>
          <span className="text-white/50 text-xs font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {testimonial.grade}
          </span>
        </div>
        <p className="text-white/40 text-[11px] mt-0.5 font-medium tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {testimonial.category}
        </p>
      </div>

      {/* Subtle border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '20px',
          border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
const StudentTestimonials = ({ testimonials = TESTIMONIALS }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  const videoRefs = useRef([]);
  const timeUpdateRef = useRef(null);

  const len = testimonials.length;
  const prevIndex = getPrev(activeIndex, len);
  const nextIndex = getNext(activeIndex, len);

  /* ── Video playback management ── 
     Play/pause is now handled inside each VideoCard via its own
     useEffect on isActive. We just reset tracking state here. */
  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
  }, [activeIndex]);

  /* ── Time tracking for active video ── */
  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    const onTimeUpdate = () => setCurrentTime(activeVideo.currentTime);
    activeVideo.addEventListener('timeupdate', onTimeUpdate);
    timeUpdateRef.current = onTimeUpdate;

    return () => {
      activeVideo.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [activeIndex]);

  const goTo = useCallback((index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => getNext(prev, len));
  }, [len]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => getPrev(prev, len));
  }, [len]);

  const togglePlay = useCallback(() => {
    const vid = videoRefs.current[activeIndex];
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, [activeIndex]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      // Sync muted state to the active video element immediately
      const vid = videoRefs.current[activeIndex];
      if (vid) vid.muted = newMuted;
      return newMuted;
    });
  }, [activeIndex]);

  /* ── Auto-advance timer ── */
  const autoAdvanceRef = useRef(null);
  const resetAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    autoAdvanceRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => getNext(prev, len));
    }, AUTO_ADVANCE_SECONDS * 1000);
  }, [len]);

  useEffect(() => {
    if (isPlaying) {
      resetAutoAdvance();
    } else {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    }
    return () => { if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current); };
  }, [isPlaying, resetAutoAdvance]);

  // Reset timer on manual navigation
  useEffect(() => {
    if (isPlaying) resetAutoAdvance();
  }, [activeIndex, isPlaying, resetAutoAdvance]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  /* ── Touch swipe support for mobile ── */
  const touchStart = useRef(null);
  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStart.current = null;
  };

  /* ── Animation variants ── */
  const cardVariants = {
    enter: (dir) => ({
      opacity: 0,
      scale: 0.88,
      x: dir > 0 ? 120 : -120,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir) => ({
      opacity: 0,
      scale: 0.88,
      x: dir > 0 ? -120 : 120,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const sideCardVariants = {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.92, transition: { duration: 0.4 } },
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #080b1a 0%, #0c0f24 30%, #0a0d20 70%, #070a18 100%)',
        paddingTop: 'clamp(4rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
      }}
      aria-label="Student video testimonials"
    >
      {/* ── Cinematic Background Poster Layers (uses images to avoid video resource contention) ── */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Layer 1: Left — slow drift up-right */}
        <BgPosterLayer
          poster={testimonials[activeIndex]?.poster}
          animationClass="st-bg-drift-1"
          style={{
            top: '-15%',
            left: '-20%',
            width: '75%',
            height: '130%',
            filter: 'blur(30px) brightness(0.4)',
            opacity: 0.18,
          }}
        />

        {/* Layer 2: Right — slow drift down-left */}
        <BgPosterLayer
          poster={testimonials[nextIndex]?.poster}
          animationClass="st-bg-drift-2"
          style={{
            top: '-10%',
            right: '-25%',
            width: '70%',
            height: '120%',
            filter: 'blur(35px) brightness(0.35)',
            opacity: 0.14,
          }}
        />

        {/* Layer 3: Upper center — slow drift diagonal */}
        <BgPosterLayer
          poster={testimonials[prevIndex]?.poster}
          animationClass="st-bg-drift-3"
          style={{
            top: '-30%',
            left: '10%',
            width: '90%',
            height: '100%',
            filter: 'blur(45px) brightness(0.3)',
            opacity: 0.10,
          }}
        />

        {/* Dark vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(8,11,26,0.7) 70%, rgba(8,11,26,0.95) 100%),
              linear-gradient(180deg, rgba(8,11,26,0.6) 0%, transparent 20%, transparent 80%, rgba(8,11,26,0.8) 100%)
            `,
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p
            className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-5"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Outfit', sans-serif" }}
          >
            Real Stories. Brighter Tomorrows.
          </p>

          {/* Main heading */}
          <h2
            className="font-bold text-white mb-5"
            style={{
              fontSize: 'clamp(1.85rem, 4.5vw, 3.2rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            What our{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #7c6aff, #a78bfa)' }}
            >
              students
            </span>{' '}
            say
          </h2>

          {/* Subheading */}
          <p
            className="max-w-xl mx-auto leading-relaxed"
            style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
            }}
          >
            Hear directly from our students about their journey,
            <br className="hidden sm:block" />
            their experiences and what makes our school special.
          </p>
        </motion.div>

        {/* ── Video Carousel ── */}
        <div
          className="relative flex items-center justify-center gap-4 lg:gap-6"
          style={{ minHeight: 'clamp(220px, 30vw, 360px)' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* ── Left Side Card (hidden on mobile) ── */}
          <div className="hidden md:block flex-shrink-0" style={{ width: 'clamp(180px, 17vw, 320px)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`side-left-${prevIndex}`}
                variants={sideCardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  aspectRatio: '16/10',
                  opacity: 0.65,
                  cursor: 'pointer',
                }}
              >
                <VideoCard
                  testimonial={testimonials[prevIndex]}
                  isActive={false}
                  isSide={true}
                  onClick={goPrev}
                  setVideoRef={(el) => { videoRefs.current[prevIndex] = el; }}
                  isPlaying={false}
                  isMuted={true}
                  onToggleMute={() => {}}
                  onTogglePlay={() => {}}
                  currentTime={0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Center Card ── */}
          <div
            className="flex-shrink-0 w-full md:w-auto"
            style={{
              width: '100%',
              maxWidth: 'clamp(260px, 38vw, 540px)',
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`center-${activeIndex}`}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ aspectRatio: '16/10' }}
              >
                <VideoCard
                  testimonial={testimonials[activeIndex]}
                  isActive={true}
                  isSide={false}
                  onClick={() => {}}
                  setVideoRef={(el) => { videoRefs.current[activeIndex] = el; }}
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
                  onTogglePlay={togglePlay}
                  currentTime={currentTime}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Side Card (hidden on mobile) ── */}
          <div className="hidden md:block flex-shrink-0" style={{ width: 'clamp(180px, 17vw, 320px)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`side-right-${nextIndex}`}
                variants={sideCardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  aspectRatio: '16/10',
                  opacity: 0.65,
                  cursor: 'pointer',
                }}
              >
                <VideoCard
                  testimonial={testimonials[nextIndex]}
                  isActive={false}
                  isSide={true}
                  onClick={goNext}
                  setVideoRef={(el) => { videoRefs.current[nextIndex] = el; }}
                  isPlaying={false}
                  isMuted={true}
                  onToggleMute={() => {}}
                  onTogglePlay={() => {}}
                  currentTime={0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Dot indicators (mobile) ── */}
        <div className="flex md:hidden justify-center gap-2 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                background: i === activeIndex ? '#7c6aff' : 'rgba(255,255,255,0.15)',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* ── Text-based Review Quote ── */}
        <div className="max-w-2xl mx-auto mt-8 md:mt-10 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`quote-${activeIndex}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              {/* Quote */}
              <p
                className="leading-relaxed italic"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                "{testimonials[activeIndex]?.quote}"
              </p>

              {/* Attribution */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span
                  className="w-5 h-px"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                />
                <span
                  className="text-xs font-medium tracking-wide"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {testimonials[activeIndex]?.name}, {testimonials[activeIndex]?.grade}
                </span>
                <span
                  className="w-5 h-px"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation Controls ── */}
        <motion.div
          className="flex items-center justify-center mt-10 md:mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Prev Arrow */}
            <button
              onClick={goPrev}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
              }}
              aria-label="Previous testimonial"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              <ArrowLeft />
            </button>

            {/* Category tabs */}
            <div className="flex items-center gap-0">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(i)}
                  className="relative px-3 sm:px-4 py-1.5 text-xs sm:text-[13px] font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    color: activeCategory === i ? '#ffffff' : 'rgba(255,255,255,0.35)',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  aria-label={`Show ${cat} testimonials`}
                >
                  <span className="flex items-center gap-1.5">
                    {activeCategory === i && (
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#7c6aff' }}
                      />
                    )}
                    {cat}
                  </span>

                  {/* Separator */}
                  {i < CATEGORIES.length - 1 && (
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={goNext}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                background: '#7c6aff',
                color: '#ffffff',
              }}
              aria-label="Next testimonial"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6b5ce7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#7c6aff';
              }}
            >
              <ArrowRight />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Background hover/drift keyframes + reduced-motion ── */}
      <style>{`
        @keyframes st-drift-1 {
          0%, 100% { transform: scale(1.6) translate(0, 0); }
          25%      { transform: scale(1.6) translate(12px, -18px); }
          50%      { transform: scale(1.65) translate(-8px, -10px); }
          75%      { transform: scale(1.6) translate(6px, 14px); }
        }
        @keyframes st-drift-2 {
          0%, 100% { transform: scale(1.7) translate(0, 0); }
          30%      { transform: scale(1.7) translate(-15px, 10px); }
          60%      { transform: scale(1.72) translate(10px, 20px); }
          85%      { transform: scale(1.7) translate(-6px, -12px); }
        }
        @keyframes st-drift-3 {
          0%, 100% { transform: scale(2) translate(0, 0); }
          20%      { transform: scale(2) translate(18px, 12px); }
          45%      { transform: scale(2.03) translate(-12px, 8px); }
          70%      { transform: scale(2) translate(8px, -16px); }
        }
        .st-bg-drift-1 { animation: st-drift-1 18s ease-in-out infinite; }
        .st-bg-drift-2 { animation: st-drift-2 22s ease-in-out infinite; }
        .st-bg-drift-3 { animation: st-drift-3 26s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .st-bg-drift-1,
          .st-bg-drift-2,
          .st-bg-drift-3 {
            animation: none !important;
          }
          .student-testimonials-section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StudentTestimonials;
