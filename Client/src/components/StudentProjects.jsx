import React, { useState, useRef, useEffect } from 'react';
import {
  Code2,
  ExternalLink,
  Star,
  Eye,
  ArrowRight,
  Layers,
  Cpu,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

import boy1 from '../assets/avatars/boy1.jpg';
import boy2 from '../assets/avatars/boy2.jpg';
import boy3 from '../assets/avatars/boy3.avif';
import girl1 from '../assets/avatars/girl1.jpg';
import girl2 from '../assets/avatars/girl2.avif';
import girl3 from '../assets/avatars/girl3.avif';

const PROJECTS_DATA = [
  {
    id: 1,
    title: "Smart Irrigation System",
    category: "IoT & Automation",
    description: "Students combine sensors, programming and automation to create a system that responds to real world soil and weather conditions.",
    image: "/projects/IoT-For-Home-Automation.jpg",
    tech: ["IoT", "Sensors", "ESP32", "Automation"],
    stats: { stars: 198, forks: 45, views: "1.4k" },
    featured: true,
    color: "green",
    author: {
      name: "Aarav Mehta & Team",
      avatar: boy1,
      course: "IoT & Robotics"
    },
    liveUrl: "#"
  },
  {
    id: 2,
    title: "AI Expense Coach",
    category: "AI & FinTech",
    description: "An AI-powered financial coach providing smart budgeting, spending analysis, and real-time expense guidance.",
    image: "/projects/E_commerce.png",
    tech: ["React", "Python", "AI & NLP", "Analytics"],
    stats: { stars: 245, forks: 52, views: "2.1k" },
    featured: true,
    color: "blue",
    author: {
      name: "Rohan Sharma & Diya Sen",
      avatar: boy2,
      course: "AI & Machine Learning"
    },
    liveUrl: "https://ai-expense-coach.vercel.app/"
  },
  {
    id: 3,
    title: "Autonomous Obstacle Rover",
    category: "Robotics",
    description: "Hardware robotics rover built with ultrasonic sensors, motor drivers, and obstacle navigation logic.",
    image: "/projects/task_management.jpg",
    tech: ["Robotics", "Arduino", "Embedded C++"],
    stats: { stars: 182, forks: 38, views: "1.2k" },
    featured: true,
    color: "purple",
    author: {
      name: "Sneha Patel & Kabir Roy",
      avatar: girl1,
      course: "Robotics Lab"
    },
    liveUrl: "#"
  },
  {
    id: 4,
    title: "Netflix Clone Platform",
    category: "Full Stack & Web",
    description: "A full-featured video streaming web application replicating the Netflix experience with real-time catalogs and media playback.",
    image: "/projects/netflix_clone.png",
    tech: ["React", "Firebase", "TMDB API", "Tailwind"],
    stats: { stars: 210, forks: 41, views: "1.8k" },
    featured: true,
    color: "red",
    author: {
      name: "Vikram Singh",
      avatar: boy3,
      course: "Full Stack Track"
    },
    liveUrl: "https://netfixcopy9.vercel.app/"
  },
  {
    id: 5,
    title: "Smart Campus Energy Monitor",
    category: "STEM & Innovation",
    description: "An IoT-enabled dashboard tracking and optimizing school electricity consumption across classrooms.",
    image: "/projects/IoT-For-Home-Automation.jpg",
    tech: ["IoT", "Cloud Analytics", "React"],
    stats: { stars: 176, forks: 30, views: "1.5k" },
    featured: false,
    color: "orange",
    author: {
      name: "Kavya Reddy & Team",
      avatar: girl2,
      course: "STEM & Innovation"
    },
    liveUrl: "#"
  },
  {
    id: 6,
    title: "Retro Arcade Snake Game",
    category: "Game Dev & Logic",
    description: "Classic retro arcade Snake game built with responsive controls, smooth collision physics, and real-time score tracking.",
    image: "/projects/snake_game.png",
    tech: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Logic"],
    stats: { stars: 230, forks: 48, views: "1.9k" },
    featured: false,
    color: "cyan",
    author: {
      name: "Ananya Gupta & Team",
      avatar: girl3,
      course: "Coding & Game Dev"
    },
    liveUrl: "https://snakegame1-nine.vercel.app/"
  }
];

const TechIcon = ({ tech }) => {
  const getIcon = (tech) => {
    const iconMap = {
      'React': <Code2 size={14} />,
      'Node.js': <Database size={14} />,
      'OpenAI API': <Cpu size={14} />,
      'WebSocket': <Globe size={14} />,
      'Next.js': <Layers size={14} />,
      'MongoDB': <Database size={14} />,
      'Stripe': <Cpu size={14} />,
      'TMDB API': <Cpu size={14} />,
      'Tailwind': <Layers size={14} />,
      'Arduino': <Cpu size={14} />,
      'Raspberry Pi': <Cpu size={14} />,
      'Python': <Code2 size={14} />,
      'MQTT': <Globe size={14} />,
      'React Native': <Smartphone size={14} />,
      'Firebase': <Database size={14} />,
      'Redux': <Layers size={14} />,
      'Animations': <Cpu size={14} />,
      'Scapy': <Database size={14} />,
      'Nmap': <Globe size={14} />,
      'Plotly': <Database size={14} />,
      'PostgreSQL': <Database size={14} />,
      'Docker': <Layers size={14} />
    };
    return iconMap[tech] || <Code2 size={14} />;
  };

  return (
    <div className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium flex items-center gap-1">
      {getIcon(tech)}
      <span>{tech}</span>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="group h-full flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
      {/* Image Banner */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm border border-white/40">
          {project.category}
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Star size={11} className="fill-white" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem] font-medium">
          {project.description}
        </p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5 min-h-[1.75rem]">
          {project.tech.slice(0, 3).map((tech, i) => (
            <TechIcon key={i} tech={tech} />
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Pinned Meta (Author + Stats) */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shadow-sm shrink-0">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{project.author.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">{project.author.course}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 shrink-0 ml-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700">{project.stats.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span className="text-xs font-bold text-slate-700">{project.stats.views}</span>
            </div>
          </div>
        </div>

        {/* Launch / View Button */}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
        >
          <ExternalLink size={13} />
          <span>View Project</span>
        </a>
      </div>
    </div>
  );
};

const StudentProjects = () => {
  const [filter, setFilter] = useState('all');
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const mobileScrollRef = useRef(null);

  const featuredProjects = PROJECTS_DATA.filter(p => p.featured);
  const allProjects = PROJECTS_DATA;

  const filteredProjects = filter === 'featured' ? featuredProjects : allProjects;

  // Auto-scroll logic for mobile
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      if (!mobileScrollRef.current) return;

      const nextIndex = (mobileActiveIndex + 1) % filteredProjects.length;
      const scrollAmount = mobileScrollRef.current.offsetWidth * 0.85 + 24; // Card width (85vw) + gap (6)
      
      mobileScrollRef.current.scrollTo({
        left: nextIndex * scrollAmount,
        behavior: 'smooth'
      });
      setMobileActiveIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [isMobile, mobileActiveIndex, filteredProjects.length]);

  const handleMobileScroll = (e) => {
    if (!isMobile) return;
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.offsetWidth * 0.85 + 24;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== mobileActiveIndex) {
      setMobileActiveIndex(newIndex);
    }
  };

  if (isMobile) {
    return (
      <section id="student-projects" className="pb-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10">
          <div className="mb-14 px-4 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter uppercase leading-[1.1] mb-4 text-center">
              These are real projects students actually build.
            </h2>
          </div>

          <div className="flex justify-center gap-3 mb-10">
            {['all', 'featured'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white text-slate-400 border border-slate-200/80 shadow-sm'
                }`}
              >
                {tab === 'all' ? 'All Projects' : 'Featured Only'}
              </button>
            ))}
          </div>

          <div 
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6 scrollbar-hide items-stretch"
          >
             {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="snap-center shrink-0 w-[85vw] sm:w-[340px] flex flex-col"
                >
                  <ProjectCard project={project} />
                </div>
             ))}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4 mb-4">
            {filteredProjects.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  mobileActiveIndex === idx ? 'w-8 bg-blue-600' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="student-projects" className="pb-20 md:pb-28 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle at 20%_50%,rgba(251,146,60,0.05)_0%,transparent_50%),radial-gradient(circle at 80%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl">
            These are real projects students actually build.
          </ScrollDarkenHeading>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {['all', 'featured'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                filter === tab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              {tab === 'all' ? 'All Projects' : 'Featured Only'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              const el = document.getElementById('online-focus');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            Start Building Your Own Project
            <ArrowRight size={20} />
          </button>
          <p className="text-slate-600 mt-4">
            Join our courses and turn your ideas into reality
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentProjects;
