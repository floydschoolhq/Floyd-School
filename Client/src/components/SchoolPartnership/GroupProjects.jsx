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

import boy1 from '../../assets/avatars/boy1.jpg';
import boy2 from '../../assets/avatars/boy2.jpg';
import boy3 from '../../assets/avatars/boy3.avif';
import girl1 from '../../assets/avatars/girl1.jpg';
import girl2 from '../../assets/avatars/girl2.avif';
import girl3 from '../../assets/avatars/girl3.avif';

const PROJECTS_DATA = [
  {
    id: 1,
    name: "Snake Game",
    description: "A classic Snake game built with modern web technologies — smooth controls, score tracking, and addictive gameplay.",
    category: "Game Development",
    image: "/projects/snake_game.png",
    link: "https://snakegame1-nine.vercel.app/",
    tech: ["JavaScript", "HTML5", "CSS3"],
    student: {
      name: "Priya Sharma",
      program: "Web Dev Bootcamp",
      image: "/assets/girl1-B1PlKgIA.jpg"
    },
    stats: { stars: 142, views: 950 },
    featured: false,
    color: "green"
  },
  {
    id: 2,
    name: "AI Expense Coach",
    description: "An AI-powered personal finance coach that helps users track expenses, set budgets, and get smart spending insights.",
    category: "Full Stack Development",
    image: "/projects/E_commerce.png",
    link: "https://ai-expense-coach--shansharma.replit.app/",
    tech: ["React", "Node.js", "AI API", "+1 more"],
    featured: true,
    student: {
      name: "Rahul Verma",
      program: "Full Stack Web Dev",
      image: "/assets/boy1-hVNs9-xq.jpg"
    },
    stats: { stars: 189, views: "1.1k" },
    color: "blue"
  },
  {
    id: 3,
    name: "Todo App",
    description: "A clean and intuitive todo application to manage daily tasks with priority levels, deadlines, and progress tracking.",
    category: "Productivity",
    image: "/projects/task_management.jpg",
    link: "https://todo-app-delta-one-65.vercel.app/",
    tech: ["React", "CSS3", "LocalStorage"],
    student: {
      name: "Sneha Patel",
      program: "Web Dev Bootcamp",
      image: "/assets/girl2-FrxMyR6l.avif"
    },
    stats: { stars: 98, views: 620 },
    featured: false,
    color: "purple"
  },
  {
    id: 4,
    name: "School Website",
    description: "A fully responsive school website featuring course listings, faculty profiles, admissions info, and a modern design.",
    category: "Web Development",
    image: "/projects/IoT-For-Home-Automation.jpg",
    link: "https://thinkskool-bootcamp-webdev-project.vercel.app/",
    tech: ["HTML5", "CSS3", "JavaScript"],
    featured: true,
    student: {
      name: "Kavya Reddy",
      program: "Web Dev Bootcamp",
      image: "/assets/girl3-BwaFsbNB.avif"
    },
    stats: { stars: 176, views: "1.4k" },
    color: "orange"
  },
  {
    id: 5,
    name: "Netflix Clone",
    description: "A fully functional Netflix clone with movie browsing, trailer playback, user authentication, and personalized recommendations.",
    category: "Full Stack Development",
    image: "/projects/netflix_clone.png",
    link: "https://netfixcopy9.vercel.app/",
    tech: ["React", "Node.js", "MongoDB", "+2 more"],
    featured: true,
    student: {
      name: "Vikram Singh",
      program: "Full Stack Web Dev",
      image: "/assets/boy2-zXUvLf2x.jpg"
    },
    stats: { stars: 342, views: "3.2k" },
    color: "red"
  },
  {
    id: 6,
    name: "AI Face Detection System",
    description: "An intelligent computer vision application that detects and recognizes human faces in real-time using AI-powered image processing. The system can be used for smart attendance, security monitoring, and identity verification.",
    category: "AI & Computer Vision",
    image: "/projects/ai_face_detection.jpg",
    link: "https://ai-face-detection-cqepauwtt5b4fc8h2yjnpa.streamlit.app/",
    tech: ["Python", "OpenCV", "AI", "Vision"],
    featured: true,
    student: {
      name: "lovleen Sharma",
      program: "AI & Machine Learning Bootcamp",
      image: "/assets/boy3.jpg"
    },
    stats: { stars: 245, views: 850 },
    color: "cyan"
  },
  {
    id: 7,
    name: "Digital Piano",
    description: "An interactive web-based piano that allows users to play musical notes using keyboard keys or mouse clicks. Designed to demonstrate event handling, audio integration, and responsive UI for real-time sound interaction.",
    category: "Interactive Media",
    image: "/projects/digital_piano.jpg",
    link: "https://piano-ecru-rho.vercel.app/piano.html",
    tech: ["HTML", "CSS", "JavaScript"],
    featured: true,
    student: {
      name: "Arpit Sharma",
      program: "Web Development Bootcamp",
      image: "/assets/boy3.jpg"
    },
    stats: { stars: 168, views: 540 },
    color: "indigo"
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
      'Docker': <Layers size={14} />,
      'OpenCV': <Cpu size={14} />,
      'AI': <Cpu size={14} />,
      'Vision': <Eye size={14} />
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

const ProjectCard = ({ project, index, isFeatured, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

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
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[6px] font-bold text-slate-800">
            {project.category}
          </div>
        </div>

        <div className="p-4 flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">
            {project.name}
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
              <div className="w-8 h-8 rounded-full border border-white shadow-sm overflow-hidden bg-slate-100">
                <img
                  src={project.student.image}
                  alt={project.student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[8px] font-bold text-slate-800">{project.student.name}</p>
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
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative group cursor-pointer will-change-transform hover:-translate-y-1 transition-transform duration-300 block ${
        isFeatured 
          ? 'lg:col-span-2 lg:row-span-2 md:col-span-1 md:row-span-2' 
          : 'lg:col-span-1 md:row-span-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        
        <div className="relative h-36 md:h-40 overflow-hidden bg-slate-100">
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-800">
            {project.category}
          </div>
        </div>

        <div className="p-5 flex flex-col items-center text-center">
          <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            {project.name}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-3 max-w-sm line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {project.tech.slice(0, 3).map((tech, i) => (
              <TechIcon key={i} tech={tech} />
            ))}
            {project.tech.length > 3 && (
              <span className="text-[10px] text-slate-500 font-bold">+{project.tech.length - 3} more</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform overflow-hidden bg-slate-100">
                <img
                  src={project.student.image}
                  alt={project.student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">{project.student.name}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{project.student.program}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex items-center gap-0.5 hover:scale-105 transition-transform">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-medium">{project.stats.stars}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Eye size={12} />
                <span className="text-[10px] font-medium">{project.stats.views}</span>
              </div>
            </div>
          </div>
        </div>

        {isHovered && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-30">
            <a
              href={project.link}
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
    </a>
  );
};

const GroupProjects = () => {
  const [filter, setFilter] = useState('all');
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mobileScrollRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featuredProjects = PROJECTS_DATA.filter(p => p.featured);
  const allProjects = PROJECTS_DATA;

  const filteredProjects = filter === 'featured' ? featuredProjects : allProjects;

  const handleMobileScroll = (e) => {
    if (!isMobile) return;
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.offsetWidth * 0.85 + 24;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== mobileActiveIndex) {
      setMobileActiveIndex(newIndex);
    }
  };

  const skills = [
    'Leadership',
    'Team Collaboration',
    'Problem Solving',
    'Project Management',
    'Technical Communication',
    'Critical Thinking'
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-10">
          <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Build Together
          </span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3">
            Group Projects That Build
            <br />
            <span className="text-blue-600">Leaders, Not Just Coders</span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Students are placed in teams to collaborate on real technology projects. They learn to divide work, communicate ideas, resolve conflicts, and ship a product together — the exact skills the tech industry demands.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Build Together
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            Group Projects That Build
            <br />
            <span className="text-blue-600">Leaders, Not Just Coders</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Students are placed in teams to collaborate on real technology projects. They learn to divide work, communicate ideas, resolve conflicts, and ship a product together — the exact skills the tech industry demands.
          </p>
        </div>

        {/* Filter Tabs - Mobile */}
        <div className="md:hidden flex justify-center gap-3 mb-10">
          {['all', 'featured'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${
                filter === tab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab === 'all' ? 'All' : 'Featured'}
            </button>
          ))}
        </div>

        {/* Filter Tabs - Desktop */}
        <div className="hidden md:flex justify-center gap-4 mb-12">
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

        {/* Projects Grid - Mobile */}
        <div className="md:hidden relative mb-12">
          <div 
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-2 -mx-2 pb-4 scrollbar-hide"
          >
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-[85vw] max-w-[340px] snap-center"
              >
                <ProjectCard
                  project={project}
                  index={index}
                  isFeatured={project.featured}
                  isMobile={true}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => {
                if (mobileScrollRef.current) {
                  mobileScrollRef.current.scrollBy({ left: -mobileScrollRef.current.offsetWidth * 0.85, behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (mobileScrollRef.current) {
                  mobileScrollRef.current.scrollBy({ left: mobileScrollRef.current.offsetWidth * 0.85, behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {filteredProjects.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === mobileActiveIndex ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Projects Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16 auto-rows-auto">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isFeatured={project.featured}
              isMobile={false}
            />
          ))}
        </div>

        {/* CTA - Mobile */}
        <div className="md:hidden text-center">
          <button
            onClick={() => {
              document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-transform text-sm"
          >
            Start Your Project
            <ArrowRight size={16} />
          </button>
          <p className="text-slate-600 text-xs mt-3">
            Partner with us to bring real projects to your school
          </p>
        </div>

        {/* CTA - Desktop */}
        <div className="hidden md:block text-center">
          <button
            onClick={() => {
              document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            Start Building Your Own Project
            <ArrowRight size={20} />
          </button>
          <p className="text-slate-600 mt-4">
            Partner with us and bring real projects to your school
          </p>
        </div>
      </div>
    </section>
  );
};

export default GroupProjects;
