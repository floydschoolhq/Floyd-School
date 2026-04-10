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

const PROJECTS_DATA = [
  {
    id: 1,
    title: "Snake Game",
    category: "Game Development",
    description: "A classic Snake game built with modern web technologies — smooth controls, score tracking, and addictive gameplay.",
    image: "/projects/snake_game.png",
    tech: ["JavaScript", "HTML5", "CSS3"],
    stats: { stars: 142, forks: 28, views: "950" },
    featured: false,
    color: "green",
    author: {
      name: "Priya Sharma",
      avatar: "P",
      course: "Web Dev Bootcamp"
    },
    liveUrl: "https://snakegame1-nine.vercel.app/"
  },
  {
    id: 2,
    title: "AI Expense Coach",
    category: "Full Stack Development",
    description: "An AI-powered personal finance coach that helps users track expenses, set budgets, and get smart spending insights.",
    image: "/projects/E_commerce.png",
    tech: ["React", "Node.js", "AI API", "Firebase"],
    stats: { stars: 189, forks: 32, views: "1.1k" },
    featured: true,
    color: "blue",
    author: {
      name: "Rahul Verma",
      avatar: "R",
      course: "Full Stack Web Dev"
    },
    liveUrl: "https://ai-expense-coach--shansharma.replit.app/"
  },
  {
    id: 5,
    title: "Todo App",
    category: "Productivity",
    description: "A clean and intuitive todo application to manage daily tasks with priority levels, deadlines, and progress tracking.",
    image: "/projects/task_management.jpg",
    tech: ["React", "CSS3", "LocalStorage"],
    stats: { stars: 98, forks: 21, views: "620" },
    featured: false,
    color: "purple",
    author: {
      name: "Sneha Patel",
      avatar: "S",
      course: "Web Dev Bootcamp"
    },
    liveUrl: "https://todo-app-delta-one-65.vercel.app/"
  },
  {
    id: 3,
    title: "School Website",
    category: "Web Development",
    description: "A fully responsive school website featuring course listings, faculty profiles, admissions info, and a modern design.",
    image: "/projects/IoT-For-Home-Automation.jpg",
    tech: ["HTML5", "CSS3", "JavaScript"],
    stats: { stars: 176, forks: 34, views: "1.4k" },
    featured: true,
    color: "orange",
    author: {
      name: "Kavya Reddy",
      avatar: "K",
      course: "Web Dev Bootcamp"
    },
    liveUrl: "https://thinkskool-bootcamp-webdev-project.vercel.app/"
  },
  {
    id: 4,
    title: "Netflix Clone",
    category: "Full Stack Development",
    description: "A fully functional Netflix clone with movie browsing, trailer playback, user authentication, and personalized recommendations.",
    image: "/projects/netflix_clone.png",
    tech: ["React", "Node.js", "MongoDB", "TMDB API", "Stripe"],
    stats: { stars: 342, forks: 89, views: "3.2k" },
    featured: true,
    color: "red",
    author: {
      name: "Vikram Singh",
      avatar: "V",
      course: "Full Stack Web Dev"
    },
    liveUrl: "https://netfixcopy9.vercel.app/"
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

const ProjectCard = ({ project, index, isFeatured }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const colorGradients = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30'
  };

  if (isMobile) {
    return (
      <div
        className={`relative bg-white rounded-lg border overflow-hidden transition-all duration-300 ${
          isFeatured 
            ? `bg-gradient-to-br ${colorGradients[project.color]} border-2 shadow-md` 
            : 'border-slate-200/60 shadow-sm'
        }`}
      >
        <div className="relative h-24 overflow-hidden bg-slate-100">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[6px] font-bold text-slate-800">
            {project.category}
          </div>
        </div>

        <div className="p-4 flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">
            {project.title}
          </h3>

          <p className="text-slate-600 text-[10px] leading-relaxed mb-3">
            {project.description}
          </p>

          <div className="flex flex-wrap justify-center gap-1 mb-3">
            {project.tech.slice(0, 2).map((tech, i) => (
              <TechIcon key={i} tech={tech} />
            ))}
            {project.tech.length > 2 && (
              <span className="text-[7px] text-slate-500 font-bold">+{project.tech.length - 2}</span>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-6 h-6 rounded-full border border-white shadow-sm"
              />
              <p className="text-[8px] font-bold text-slate-800">{project.author.name}</p>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[8px] font-bold">{project.stats.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={10} />
                <span className="text-[8px] font-bold">{project.stats.views}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer will-change-transform hover:-translate-y-1 transition-transform duration-300 ${
        isFeatured 
          ? 'lg:col-span-2 lg:row-span-2 md:col-span-1 md:row-span-2' 
          : 'lg:col-span-1 md:row-span-1'
      }`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${project.color}-500/10 0%, ${project.color}-600/10 50%, ${project.color}-500/10 100%)`
        }}
      />

      {isHovered && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center z-20">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
        </div>
      )}
      {project.featured && isHovered && (
        <div className="absolute top-4 right-4 text-xs font-bold text-white bg-black/80 px-2 py-1 rounded z-20">
          FEATURED
        </div>
      )}

      <div className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 ease-out ${
        isFeatured 
          ? `bg-gradient-to-br ${colorGradients[project.color]} border-2 shadow-2xl` 
          : 'border-slate-200/60 shadow-lg group-hover:shadow-xl'
      }`}>
        
        <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100">
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800">
            {project.category}
          </div>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
            {project.title}
          </h3>

          <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-sm">
            {project.description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {project.tech.slice(0, 3).map((tech, i) => (
              <TechIcon key={i} tech={tech} />
            ))}
            {project.tech.length > 3 && (
              <span className="text-xs text-slate-500 font-bold">+{project.tech.length - 3} more</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col items-center gap-3">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
              />
              <div className="text-center">
                <p className="text-base font-bold text-slate-900">{project.author.name}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{project.author.course}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1 hover:scale-105 transition-transform">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{project.stats.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span className="text-xs font-medium">{project.stats.views}</span>
              </div>
            </div>
          </div>
        </div>

        {isHovered && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-30">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <ExternalLink size={12} />
              Live
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentProjects = () => {
  const [filter, setFilter] = useState('all');
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const mobileScrollRef = useRef(null);
  const scrollRef = useRef(null);

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
    }, 3000);

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

  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = isMobile ? window.innerWidth * 0.85 : 640;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
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

          <div className="flex justify-center gap-3 mb-12">
            {['all', 'featured'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'bg-white text-slate-400 border border-slate-200/50'
                }`}
              >
                {tab === 'all' ? 'All Projects' : 'Featured Only'}
              </button>
            ))}
          </div>

          <div 
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6 scrollbar-hide"
          >
             {filteredProjects.map((project) => (
               <div 
                 key={project.id} 
                 className="snap-center shrink-0 w-[85vw] bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col hover:scale-[0.98] transition-all duration-300"
               >
                 <div className="aspect-[16/10] overflow-hidden relative border-b border-slate-100/30">
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-900 border border-white/20 shadow-sm">
                       {project.category}
                   </div>
                 </div>
                 
                 <div className="p-8">
                   <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight leading-tight">{project.title}</h3>
                   <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-8 line-clamp-2">{project.description}</p>
                   
                   <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100/30">
<div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full border border-slate-100 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                               <span className="text-sm font-bold text-white">{project.author.avatar}</span>
                           </div>
                           <div>
                              <p className="text-[11px] font-black text-slate-900 uppercase leading-none mb-1">{project.author.name}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{project.author.course}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-1">
                           <Star size={12} className="text-orange-500 fill-orange-500" />
                           <span className="text-[10px] font-black text-slate-900">{project.stats.stars}</span>
                       </div>
                   </div>
                   
                   <div className="flex gap-3">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Launch</a>
                    </div>
                 </div>
               </div>
             ))}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-2 mb-8">
            {filteredProjects.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  mobileActiveIndex === idx ? 'w-8 bg-blue-600' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-center mt-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
                  EXPLORE
              </span>
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
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === tab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Projects' : 'Featured Only'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 auto-rows-auto">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isFeatured={project.featured}
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
