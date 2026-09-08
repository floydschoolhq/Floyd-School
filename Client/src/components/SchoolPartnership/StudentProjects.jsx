import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

import boy1 from '../../assets/avatars/boy1.jpg';
import boy2 from '../../assets/avatars/boy2.jpg';
import boy3 from '../../assets/avatars/boy3.avif';
import girl1 from '../../assets/avatars/girl1.jpg';
import girl2 from '../../assets/avatars/girl2.avif';
import girl3 from '../../assets/avatars/girl3.avif';

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Smart Irrigation System',
    category: 'IOT',
    description: 'Students combine sensors, programming and automation to create a system that responds to real world soil moisture and weather conditions.',
    image: '/projects/IoT-For-Home-Automation.jpg',
    tech: ['IoT', 'Sensors', 'ESP32', 'Automation'],
    stats: { stars: 198, views: '1.4k' },
    featured: true,
    color: '#10b981',
    author: {
      name: 'Aarav Mehta & Team',
      avatar: boy1,
      course: 'IoT & Robotics Lab'
    },
    liveUrl: '#'
  },
  {
    id: 2,
    title: 'AI Expense Coach',
    category: 'AI',
    description: 'An AI-powered financial coach providing smart budgeting, spending analysis, and real-time expense guidance.',
    image: '/projects/E_commerce.png',
    tech: ['React', 'Python', 'AI & NLP', 'Analytics'],
    stats: { stars: 245, views: '2.1k' },
    featured: true,
    color: '#3B82F6',
    author: {
      name: 'Rohan Sharma & Diya Sen',
      avatar: boy2,
      course: 'AI & Machine Learning'
    },
    liveUrl: 'https://ai-expense-coach.vercel.app/'
  },
  {
    id: 3,
    title: 'Autonomous Obstacle Rover',
    category: 'ROBOTICS',
    description: 'Hardware robotics rover built with ultrasonic sensors, motor drivers, and obstacle navigation logic to autonomously map safe pathways.',
    image: '/projects/task_management.jpg',
    tech: ['Robotics', 'Arduino', 'Embedded C++', 'Microcontroller'],
    stats: { stars: 182, views: '1.2k' },
    featured: true,
    color: '#8B5CF6',
    author: {
      name: 'Sneha Patel & Kabir Roy',
      avatar: girl1,
      course: 'Robotics & Hardware'
    },
    liveUrl: '#'
  },
  {
    id: 4,
    title: 'Netflix Clone Platform',
    category: 'CYBERSECURITY',
    description: 'A full-featured video streaming web application replicating the Netflix experience with real-time catalogs and media playback.',
    image: '/projects/netflix_clone.png',
    tech: ['React', 'Firebase', 'TMDB API', 'Tailwind'],
    stats: { stars: 210, views: '1.8k' },
    featured: true,
    color: '#EF4444',
    author: {
      name: 'Vikram Singh',
      avatar: boy3,
      course: 'Full Stack Track'
    },
    liveUrl: 'https://netfixcopy9.vercel.app/'
  },
  {
    id: 5,
    title: 'Smart Campus Energy Monitor',
    category: 'INNOVATION',
    description: 'An IoT-enabled dashboard tracking and optimizing school electricity consumption across campus laboratories and classrooms.',
    image: '/projects/IoT-For-Home-Automation.jpg',
    tech: ['IoT', 'Cloud Analytics', 'React', 'Sensors'],
    stats: { stars: 176, views: '1.5k' },
    featured: false,
    color: '#F97316',
    author: {
      name: 'Kavya Reddy & Team',
      avatar: girl2,
      course: 'STEM & Innovation'
    },
    liveUrl: '#'
  },
  {
    id: 6,
    title: 'Retro Arcade Snake Game',
    category: 'CODING',
    description: 'Classic retro arcade Snake game built with responsive controls, smooth collision physics, and real-time score tracking.',
    image: '/projects/snake_game.png',
    tech: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Game Logic'],
    stats: { stars: 230, views: '1.9k' },
    featured: false,
    color: '#06B6D4',
    author: {
      name: 'Ananya Gupta & Team',
      avatar: girl3,
      course: 'Coding & Game Dev'
    },
    liveUrl: 'https://snakegame1-nine.vercel.app/'
  }
];

const CATEGORIES = ['ALL', 'AI', 'CODING', 'ROBOTICS', 'IOT', 'CYBERSECURITY', 'INNOVATION'];

/* ─── Single Card with full-card click expand ─────────────────── */
const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = (e) => {
    // Prevent toggle when clicking the external link
    if (e.target.closest('a[data-external]')) return;
    setExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, layout: { duration: 0.35 } }}
      onClick={handleCardClick}
      className={`group relative bg-white rounded-3xl border overflow-hidden shadow-lg transition-all duration-300 flex flex-col cursor-pointer select-none
        ${expanded
          ? 'border-blue-400/60 shadow-2xl shadow-blue-500/10 ring-2 ring-blue-500/20'
          : 'border-slate-200/80 hover:shadow-xl hover:-translate-y-1.5'
        }
        ${project.featured && !expanded ? 'ring-2 ring-blue-500/10' : ''}
      `}
      style={{ willChange: 'transform' }}
    >
      {/* ── Image Area ── */}
      <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${expanded ? 'scale-105' : 'group-hover:scale-105'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 ${expanded ? 'opacity-70' : 'opacity-50 group-hover:opacity-40'}`} />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-800 shadow-sm">
          {project.category}
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
            Featured
          </div>
        )}

        {/* Tap/Click hint when collapsed */}
        {!expanded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-800 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronDown size={12} />
            View Details
          </div>
        )}

        {/* Collapse hint when expanded */}
        {expanded && (
          <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md text-slate-700">
            <ChevronUp size={14} />
          </div>
        )}
      </div>

      {/* ── Always-visible Summary Row ── */}
      <div className="px-7 pt-5 pb-4 flex items-center justify-between gap-3 shrink-0 border-b border-slate-100 min-h-[4.5rem]">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-1">
          {project.title}
        </h3>
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown size={14} />
        </div>
      </div>

      {/* ── Expandable Detail Panel ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-7 py-5 flex flex-col gap-5">

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {project.description}
              </p>

              {/* Tech Chips */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Author Row + Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shadow-sm shrink-0">
                    <img
                      src={project.author.avatar}
                      alt={project.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{project.author.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{project.author.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-700">{project.stats.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={13} />
                    <span className="text-xs font-bold text-slate-700">{project.stats.views}</span>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-external="true"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white text-center shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}cc 100%)` }}
              >
                <ExternalLink size={14} />
                View Project
              </a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed bottom padding */}
      {!expanded && <div className="h-4" />}
    </motion.div>
  );
};

/* ─── Mobile Card (click-to-expand same behaviour) ────────────── */
const MobileProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="snap-center shrink-0 w-[85vw] bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-md flex flex-col cursor-pointer select-none"
      onClick={(e) => {
        if (e.target.closest('a[data-external]')) return;
        setExpanded((p) => !p);
      }}
    >
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden relative bg-slate-100 border-b border-slate-100 shrink-0">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-800 border border-white/40 shadow-sm">
          {project.category}
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-100 shrink-0 min-h-[3.75rem]">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-1">
          {project.title}
        </h3>
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown size={13} />
        </div>
      </div>

      {/* Expandable Detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="m-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{project.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-semibold">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
                    <img src={project.author.avatar} alt={project.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{project.author.name}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{project.author.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold">{project.stats.stars}</span>
                </div>
              </div>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-external="true"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest text-center shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={13} />
                View Project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && <div className="h-3" />}
    </div>
  );
};

/* ─── Main Section ────────────────────────────────────────────── */
const StudentProjects = () => {
  const [filter, setFilter] = useState('ALL');
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const mobileScrollRef = useRef(null);

  const filteredProjects = filter === 'ALL'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === filter);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      if (!mobileScrollRef.current) return;
      const nextIndex = (mobileActiveIndex + 1) % filteredProjects.length;
      const scrollAmount = mobileScrollRef.current.offsetWidth * 0.85 + 24;
      mobileScrollRef.current.scrollTo({ left: nextIndex * scrollAmount, behavior: 'smooth' });
      setMobileActiveIndex(nextIndex);
    }, 3500);
    return () => clearInterval(interval);
  }, [isMobile, mobileActiveIndex, filteredProjects.length]);

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const scrollPosition = mobileScrollRef.current.scrollLeft;
    const cardWidth = mobileScrollRef.current.offsetWidth * 0.85 + 24;
    setMobileActiveIndex(Math.round(scrollPosition / cardWidth));
  };

  return (
    <section id="student-projects" className="py-24 px-6 lg:px-12 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full setu-body text-xs font-bold uppercase tracking-widest mb-4 text-indigo-600 bg-indigo-50 border border-indigo-100 shadow-sm">
            <Sparkles size={14} className="text-amber-500" />
            STUDENT PROJECTS
          </span>
          <h2
            className="setu-heading font-black text-slate-900 mb-4 uppercase tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            THEY LEARN IT.{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)' }}>
              THEN THEY BUILD IT.
            </span>
          </h2>
          <p className="setu-body text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed mb-3">
            Every project is an opportunity for students to turn knowledge into something they can see, use and share.
          </p>
          <p className="text-slate-400 text-xs font-medium flex items-center justify-center gap-1.5">
            <ChevronDown size={13} className="text-blue-400" />
            Tap any card to explore the project
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {CATEGORIES.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                filter === tab
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile Carousel */}
        {isMobile ? (
          <div>
            <div
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6 scrollbar-hide"
            >
              {filteredProjects.map((project) => (
                <MobileProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4 mb-2">
              {filteredProjects.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    mobileActiveIndex === idx ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <a
            href="#partnership-form"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer text-sm md:text-base"
          >
            <span>Partner With Floyd School For Your Campus</span>
            <ArrowRight size={18} />
          </a>
          <p className="text-slate-500 text-xs md:text-sm mt-3 font-medium">
            Empower your students to build industry-level projects
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentProjects;
