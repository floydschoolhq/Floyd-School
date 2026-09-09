import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Users, User, ChevronLeft, ChevronRight, Calendar, Sparkles, Zap, Brain, Rocket, Award } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Programs', id: 'online-focus' },
  { name: 'Learning Journey', id: 'roadmap' },
  { name: 'Technology Domains', id: 'ecosystem' },
  { name: 'Why Floyd', id: 'why-us' },
  { name: 'Student Projects', id: 'student-projects' },
  { name: 'Hackathons', href: '/hackathon' },
];

const useScrolledPast = (threshold = 60) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
};

/* ── Dynamic Design Variations — morphs colors, typography accents, layouts, and taglines ── */
const DYNAMIC_DESIGNS = [
  {
    id: 'design-blue',
    bgGradient: 'linear-gradient(135deg, #07092b 0%, #0f154d 50%, #080a33 100%)',
    accentColor: '#facc15', // Yellow badge
    accentTextColor: '#07092b',
    taglineGradient: 'linear-gradient(90deg, #38BDF8, #FACC15, #ff7d1a)',
    eyebrow: 'FUTURE READY TECHNOLOGY EDUCATION FOR CLASSES 6 TO 12',
    eyebrowBorder: '#38BDF8',
    pills: [
      { text: 'AI & Machine Learning', bg: '#ff7d1a' },
      { text: 'Coding & Web Development', bg: '#10cb6a' },
      { text: 'Cybersecurity', bg: '#38bdf8' },
      { text: 'IoT & Robotics', bg: '#ff4b93' },
    ],
    btnGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    btnGlow: 'rgba(139,92,246,0.4)',
    photos: [
      { src: '/startup_media/photo_3.jpg', title: 'HANDS ON LEARNING', desc: 'Students explore, experiment and build alongside Floyd mentors.' },
      { src: '/startup_media/photo_12.jpg', title: 'MENTOR LED LEARNING', desc: 'Practical technology education delivered directly on campus.' },
      { src: '/startup_media/photo_1.jpg', title: 'REAL PROJECTS', desc: 'Students turn ideas into working technology projects.' },
      { src: '/startup_media/photo_7.jpg', title: 'FUTURE INNOVATORS', desc: 'Hands on technology education for Classes 6 to 12.' },
    ],
    frameStyle: 'flower',
    doodleColor: '#6C63FF',
  },
  {
    id: 'design-purple',
    bgGradient: 'linear-gradient(135deg, #160829 0%, #2b0b4a 50%, #110521 100%)',
    accentColor: '#00D4FF', // Cyan badge
    accentTextColor: '#0c041a',
    taglineGradient: 'linear-gradient(90deg, #f472b6, #a78bfa, #38bdf8)',
    eyebrow: 'FUTURE READY TECHNOLOGY EDUCATION FOR CLASSES 6 TO 12',
    eyebrowBorder: '#f472b6',
    pills: [
      { text: 'AI & Machine Learning', bg: '#a78bfa' },
      { text: 'Coding & Web Development', bg: '#38bdf8' },
      { text: 'Cybersecurity', bg: '#f472b6' },
      { text: 'IoT & Robotics', bg: '#10b981' },
    ],
    btnGradient: 'linear-gradient(135deg, #ec4899, #d946ef)',
    btnGlow: 'rgba(236,72,153,0.4)',
    photos: [
      { src: '/startup_media/photo_1.jpg', title: 'HANDS ON LEARNING', desc: 'Students explore, experiment and build alongside Floyd mentors.' },
      { src: '/startup_media/photo_4.jpg', title: 'MENTOR LED LEARNING', desc: 'Practical technology education delivered directly on campus.' },
      { src: '/startup_media/photo_8.jpg', title: 'REAL PROJECTS', desc: 'Students turn ideas into working technology projects.' },
      { src: '/startup_media/photo_2.jpg', title: 'FUTURE INNOVATORS', desc: 'Hands on technology education for Classes 6 to 12.' },
    ],
    frameStyle: 'arch',
    doodleColor: '#ec4899',
  },
  {
    id: 'design-emerald',
    bgGradient: 'linear-gradient(135deg, #031c18 0%, #083830 50%, #021411 100%)',
    accentColor: '#fb923c', // Orange badge
    accentTextColor: '#031c18',
    taglineGradient: 'linear-gradient(90deg, #34d399, #fb923c, #facc15)',
    eyebrow: 'FUTURE READY TECHNOLOGY EDUCATION FOR CLASSES 6 TO 12',
    eyebrowBorder: '#34d399',
    pills: [
      { text: 'AI & Machine Learning', bg: '#fb923c' },
      { text: 'Coding & Web Development', bg: '#34d399' },
      { text: 'Cybersecurity', bg: '#facc15' },
      { text: 'IoT & Robotics', bg: '#38bdf8' },
    ],
    btnGradient: 'linear-gradient(135deg, #10b981, #059669)',
    btnGlow: 'rgba(16,185,129,0.4)',
    photos: [
      { src: '/startup_media/photo_12.jpg', title: 'HANDS ON LEARNING', desc: 'Students explore, experiment and build alongside Floyd mentors.' },
      { src: '/startup_media/photo_7.jpg', title: 'MENTOR LED LEARNING', desc: 'Practical technology education delivered directly on campus.' },
      { src: '/startup_media/photo_5.jpg', title: 'REAL PROJECTS', desc: 'Students turn ideas into working technology projects.' },
      { src: '/startup_media/photo_9.jpg', title: 'FUTURE INNOVATORS', desc: 'Hands on technology education for Classes 6 to 12.' },
    ],
    frameStyle: 'quad',
    doodleColor: '#10b981',
  },
  {
    id: 'design-crimson',
    bgGradient: 'linear-gradient(135deg, #240615 0%, #420b27 50%, #1a040f 100%)',
    accentColor: '#38bdf8', // Blue badge
    accentTextColor: '#1a040f',
    taglineGradient: 'linear-gradient(90deg, #f43f5e, #fb923c, #a855f7)',
    eyebrow: 'FUTURE READY TECHNOLOGY EDUCATION FOR CLASSES 6 TO 12',
    eyebrowBorder: '#f43f5e',
    pills: [
      { text: 'AI & Machine Learning', bg: '#f43f5e' },
      { text: 'Coding & Web Development', bg: '#a855f7' },
      { text: 'Cybersecurity', bg: '#38bdf8' },
      { text: 'IoT & Robotics', bg: '#10b981' },
    ],
    btnGradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    btnGlow: 'rgba(244,63,94,0.4)',
    photos: [
      { src: '/startup_media/photo_6.jpg', title: 'HANDS ON LEARNING', desc: 'Students explore, experiment and build alongside Floyd mentors.' },
      { src: '/startup_media/photo_10.jpg', title: 'MENTOR LED LEARNING', desc: 'Practical technology education delivered directly on campus.' },
      { src: '/startup_media/photo_11.jpg', title: 'REAL PROJECTS', desc: 'Students turn ideas into working technology projects.' },
      { src: '/startup_media/photo_3.jpg', title: 'FUTURE INNOVATORS', desc: 'Hands on technology education for Classes 6 to 12.' },
    ],
    frameStyle: 'matrix',
    doodleColor: '#f43f5e',
  },
];

const PartnershipHero = () => {
  const scrolled = useScrolledPast(60);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [designIndex, setDesignIndex] = useState(0);

  const currentDesign = DYNAMIC_DESIGNS[designIndex];

  // Auto morph design every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDesignIndex((prev) => (prev + 1) % DYNAMIC_DESIGNS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const nextDesign = () => setDesignIndex((prev) => (prev + 1) % DYNAMIC_DESIGNS.length);
  const prevDesign = () => setDesignIndex((prev) => (prev - 1 + DYNAMIC_DESIGNS.length) % DYNAMIC_DESIGNS.length);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleNavClick = (link) => {
    if (link.href) {
      window.location.href = link.href;
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    link.href = '/Floyd_School_Brochure.pdf';
    link.download = 'Floyd_School_Brochure.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap');
      `}</style>

      {/* ── Sticky Navbar ─────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(7, 9, 43, 0.95)' : 'rgba(7, 9, 43, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: scrolled ? '0 8px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-[1350px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left Brand */}
          <div
            className="flex flex-col items-start leading-none cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/logo-white.png"
              alt="Floyd School"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            </div>

          {/* Center Links Capsule */}
          <div
            className="hidden md:flex items-center rounded-full py-1.5 px-3 shadow-lg border border-white/20"
            style={{ background: 'linear-gradient(90deg, #B854A2 0%, #38BDF8 100%)' }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id || link.href}
                onClick={() => handleNavClick(link)}
                className="text-xs font-bold text-white px-3.5 py-1.5 rounded-full hover:bg-white/15 transition-all duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleDownloadBrochure}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sky-300 hover:bg-white/10"
            >
              <Download size={14} /> Download Brochure
            </button>

            <button
              onClick={() => scrollTo('partner-form')}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer text-slate-300 hover:bg-white/10"
            >
              Contact Us
            </button>

            <button
              onClick={() => (window.location.href = '/login')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer text-pink-300 border border-pink-400/50 hover:bg-pink-500/10"
            >
              <User size={13} />
              Login
            </button>

            <button
              onClick={() => (window.location.href = '/student/signup')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer hover:scale-[1.03] transition-all"
              style={{
                background: '#B854A2',
                boxShadow: '0 4px 14px rgba(184, 84, 162, 0.4)',
              }}
            >
              <Users size={14} />
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#07092b] border-b border-white/10 px-6 py-4 space-y-3"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id || link.href}
                  onClick={() => handleNavClick(link)}
                  className="block w-full text-left text-sm font-semibold text-slate-200 py-2 border-b border-white/5"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleDownloadBrochure}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-white"
                >
                  <Download size={14} /> Download Brochure
                </button>
                <button
                  onClick={() => scrollTo('partner-form')}
                  className="py-2.5 rounded-xl bg-pink-600 text-xs font-bold text-white text-center"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Dynamic Hero Banner Section (Morphs theme, colors & layouts every slide) ────── */}
      <motion.section
        key={currentDesign.id}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[90vh] pt-28 pb-16 flex items-center justify-center overflow-hidden transition-all duration-1000"
        style={{
          background: currentDesign.bgGradient,
        }}
      >
        {/* Background Doodle Vectors */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none">
            <path
              d="M -100 200 C 300 100, 400 500, 800 300 C 1100 150, 1300 600, 1600 400"
              stroke={currentDesign.doodleColor}
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <path
              d="M 100 600 C 400 400, 600 750, 1100 500 C 1300 350, 1500 700, 1700 550"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </svg>
        </div>

        {/* Outer container */}
        <div className="max-w-[1340px] mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* ── Left Content (Morphing text & badges) ──────────────────────── */}
          <motion.div
            key={`left-${designIndex}`}
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/[0.05] border border-white/10 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">NEP 2020 & CBSE Curriculum</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Classes 6 to 12</span>
              </span>
            </div>

            {/* Headline — 2 lines */}
            <h1
              className="font-black text-white tracking-tight uppercase"
              style={{
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.1,
                fontSize: 'clamp(2.1rem, 3.8vw, 3.5rem)',
              }}
            >
              <span className="block text-white">
                Every Student Has A Destination.
              </span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                We Find The Shortest Path.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              Hands on technology education delivered directly on campus, where students learn with expert mentors, explore emerging technologies and build real projects.
            </p>

            {/* Monotone Domain Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {currentDesign.pills.map((pill) => (
                <span
                  key={pill.text}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/10 hover:border-white/20 hover:text-white transition-colors"
                >
                  {pill.text}
                </span>
              ))}
            </div>

            {/* CTA Buttons & Style controls */}
            <div className="pt-3 space-y-3">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollTo('partner-form')}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-all duration-200 cursor-pointer shadow-md"
                >
                  <Calendar size={16} />
                  Book a Discovery Session
                </button>

                <button
                  onClick={() => scrollTo('online-focus')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 cursor-pointer backdrop-blur-md"
                >
                  Explore Programs
                </button>

                {/* Design indicator dots */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/15">
                  {DYNAMIC_DESIGNS.map((d, i) => (
                    <button
                      key={d.id}
                      onClick={() => setDesignIndex(i)}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: i === designIndex ? '20px' : '8px',
                        background: i === designIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Small subtext */}
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Begin with a complimentary 1 day technology immersion on campus.
              </p>
            </div>
          </motion.div>

          {/* ── Right Content: Morphing Photo Frame Layout ──────────────── */}
          <motion.div
            key={`right-${designIndex}`}
            className="lg:col-span-5 relative flex items-center justify-center mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={prevDesign}
              className="absolute left-2 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-all hover:bg-black/90 sm:-left-5 shadow-2xl"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Dynamic Frame Photo Container */}
            <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px] aspect-square p-2">
              
              {/* Outer glow aura */}
              <div
                className="absolute inset-0 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-700"
                style={{
                  background: `radial-gradient(circle, ${currentDesign.accentColor} 0%, ${currentDesign.doodleColor} 60%, transparent 80%)`,
                }}
              />

              {/* Photo grid frame morphing based on design */}
              <div className="relative w-full h-full overflow-hidden rounded-3xl p-1">
                
                {currentDesign.frameStyle === 'flower' && (
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3.5">
                    <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl border border-white/20 group">
                      <img src={currentDesign.photos[0].src} alt="Lab" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                        <span className="text-[10px] font-black uppercase text-amber-300">{currentDesign.photos[0].title}</span>
                        <span className="text-[8px] text-slate-300 leading-tight line-clamp-2">{currentDesign.photos[0].desc}</span>
                      </div>
                    </div>
                    <div className="relative row-span-2 overflow-hidden rounded-[3rem] shadow-xl border border-white/20 group">
                      <img src={currentDesign.photos[1].src} alt="Robotics" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                        <span className="text-xs font-black uppercase text-cyan-300">{currentDesign.photos[1].title}</span>
                        <span className="text-[9px] text-slate-300 leading-tight mt-0.5">{currentDesign.photos[1].desc}</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-full shadow-xl border border-white/20 group">
                      <img src={currentDesign.photos[2].src} alt="Classroom" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-center text-white">
                        <span className="text-[9px] font-black uppercase text-pink-300">{currentDesign.photos[2].title}</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentDesign.frameStyle === 'arch' && (
                  <div className="w-full h-full grid grid-cols-12 gap-3">
                    <div className="col-span-7 relative overflow-hidden rounded-t-[5rem] rounded-b-[2.5rem] shadow-xl border border-white/20 group">
                      <img src={currentDesign.photos[0].src} alt="AI" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                        <span className="text-xs font-black uppercase text-cyan-300">{currentDesign.photos[0].title}</span>
                        <span className="text-[10px] text-slate-300 leading-tight mt-1">{currentDesign.photos[0].desc}</span>
                      </div>
                    </div>
                    <div className="col-span-5 space-y-3 flex flex-col justify-between">
                      <div className="h-1/2 relative overflow-hidden rounded-[2rem] shadow-xl border border-white/20 group">
                        <img src={currentDesign.photos[1].src} alt="Design" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                          <span className="text-[9px] font-black uppercase text-pink-300">{currentDesign.photos[1].title}</span>
                        </div>
                      </div>
                      <div className="h-1/2 relative overflow-hidden rounded-full shadow-xl border border-white/20 group">
                        <img src={currentDesign.photos[2].src} alt="App" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-center text-white">
                          <span className="text-[9px] font-black uppercase text-amber-300">{currentDesign.photos[2].title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentDesign.frameStyle === 'quad' && (
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3">
                    {currentDesign.photos.map((p, idx) => (
                      <div key={idx} className="relative overflow-hidden rounded-[2rem] shadow-xl border border-white/20 group">
                        <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                          <span className="text-[10px] font-black uppercase text-cyan-300">{p.title}</span>
                          <span className="text-[8px] text-slate-300 leading-tight line-clamp-1">{p.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentDesign.frameStyle === 'matrix' && (
                  <div className="w-full h-full relative overflow-hidden rounded-[3.5rem] shadow-2xl border-2 border-white/25">
                    <img src={currentDesign.photos[0].src} alt="Main" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-400">{currentDesign.photos[0].title}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">{currentDesign.photos[0].desc}</p>
                    </div>
                  </div>
                )}

                {/* Floating badge */}
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={nextDesign}
              className="absolute right-2 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-all hover:bg-black/90 sm:-right-5 shadow-2xl"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>

        </div>
      </motion.section>
    </>
  );
};

export default PartnershipHero;
