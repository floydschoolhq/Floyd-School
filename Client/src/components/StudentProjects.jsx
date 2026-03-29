import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Code2,
  ExternalLink,
  Github,
  Star,
  Users,
  Calendar,
  Zap,
  Trophy,
  Rocket,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  Layers,
  Cpu,
  Smartphone,
  Globe,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
// The original file already had this import, but the instruction implies adding it again in a specific spot.
// To avoid duplication and maintain correctness, I'm assuming the intent was to ensure it's present and
// if it was missing, to add it in the specified location. Since it's already present, and the instruction
// shows it being added *before* ScrollDarkenHeading, I'm moving the existing import to that position.
// If the intent was to have two identical imports, that would be redundant but syntactically valid.
// Given the prompt to make it syntactically correct and faithful, moving the existing one to the
// specified new location seems the most reasonable interpretation.
// import useIsMobile from '../hooks/useIsMobile'; // This line was originally here, now moved up.

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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya",
      course: "Web Dev Bootcamp"
    },
    liveUrl: "https://thinkskool-bootcamp-webdev-project.vercel.app/"
  },
  {
    id: 4,
    title: "Task Management App",
    category: "Mobile Development",
    description: "Collaborative task management app with real-time updates and team features",
    image: "/projects/task_management.jpg",
    tech: ["React Native", "Firebase", "Redux", "Animations"],
    stats: { stars: 298, forks: 67, views: "2.1k" },
    featured: true,
    color: "cyan",
    author: {
      name: "Arjun Nair",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      course: "Mobile App Development"
    },
    liveUrl: "#"
  }
];

const TechIcon = ({ tech, index }) => {
  const getIcon = (tech) => {
    const iconMap = {
      'React': <Code2 size={14} />,
      'Node.js': <Database size={14} />,
      'OpenAI API': <Cpu size={14} />,
      'WebSocket': <Globe size={14} />,
      'Next.js': <Layers size={14} />,
      'MongoDB': <Database size={14} />,
      'Stripe': <Zap size={14} />,
      'Tailwind': <Layers size={14} />,
      'Arduino': <Cpu size={14} />,
      'Raspberry Pi': <Cpu size={14} />,
      'Python': <Code2 size={14} />,
      'MQTT': <Globe size={14} />,
      'React Native': <Smartphone size={14} />,
      'Firebase': <Database size={14} />,
      'Redux': <Layers size={14} />,
      'Animations': <Zap size={14} />,
      'Scapy': <Database size={14} />,
      'Nmap': <Globe size={14} />,
      'Plotly': <Database size={14} />,
      'PostgreSQL': <Database size={14} />,
      'Docker': <Layers size={14} />
    };
    return iconMap[tech] || <Code2 size={14} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium flex items-center gap-1"
    >
      {getIcon(tech)}
      <span>{tech}</span>
    </motion.div>
  );
};

const ProjectCard = ({ project, index, isFeatured }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

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
        {/* Main Card - Mobile Static */}
        <div className="relative h-24 overflow-hidden bg-slate-100">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[6px] font-bold text-slate-800">
            {project.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5">
          {/* Title */}
          <h3 className="text-xs font-bold text-slate-900 mb-1.5 line-clamp-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-[10px] leading-relaxed mb-2 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-0.5 mb-2">
            {project.tech.slice(0, 2).map((tech, i) => (
              <TechIcon key={i} tech={tech} index={i} />
            ))}
            {project.tech.length > 2 && (
              <span className="text-[6px] text-slate-500">+{project.tech.length - 2}</span>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-4 h-4 rounded-full border border-white shadow-sm"
              />
              <div>
                <p className="text-[9px] font-semibold text-slate-800">{project.author.name}</p>
                <p className="text-[6px] text-slate-500">{project.author.course}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <div className="flex items-center gap-0.5">
                <Star size={8} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[6px] font-medium">{project.stats.stars}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Eye size={8} />
                <span className="text-[6px] font-medium">{project.stats.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ scale, y: isMobile ? 0 : y }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer ${
        isFeatured 
          ? 'lg:col-span-2 lg:row-span-2 md:col-span-1 md:row-span-2' 
          : 'lg:col-span-1 md:row-span-1'
      }`}
    >
      {/* Glow Effect on Hover - CSS Transition for Performance */}
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${project.color}-500/10 0%, ${project.color}-600/10 50%, ${project.color}-500/10 100%)`
        }}
      />

      {/* 3D Floating Elements - Optimized */}
      <AnimatePresence mode="wait">
        {isHovered && !isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
              style={{ zIndex: 20 }}
            >
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
            </motion.div>
            {project.featured && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-4 right-4 text-xs font-bold text-white bg-black/80 px-2 py-1 rounded"
                style={{ zIndex: 20 }}
              >
                FEATURED
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <div className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 ease-out ${
        isFeatured 
          ? `bg-gradient-to-br ${colorGradients[project.color]} border-2 shadow-2xl` 
          : 'border-slate-200/60 shadow-lg group-hover:shadow-xl'
      }`}>
        
        {/* Project Image */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100">
          <motion.div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${project.image})` }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800"
          >
            {project.category}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xl font-bold text-slate-900 mb-3 line-clamp-2"
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3"
          >
            {project.description}
          </motion.p>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {project.tech.slice(0, 3).map((tech, i) => (
              <TechIcon key={i} tech={tech} index={i} />
            ))}
            {project.tech.length > 3 && (
              <span className="text-xs text-slate-500">+{project.tech.length - 3} more</span>
            )}
          </motion.div>

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform duration-200 ease-out"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">{project.author.name}</p>
                <p className="text-xs text-slate-500">{project.author.course}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-slate-500">
              <motion.div
                className="flex items-center gap-1 transition-transform duration-200 ease-out"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{project.stats.stars}</span>
              </motion.div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span className="text-xs font-medium">{project.stats.views}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-4 left-4 right-4 flex gap-2"
              style={{ zIndex: 30 }}
            >
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 px-3 py-2 bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 shadow-lg transition-transform duration-200 ease-out"
              >
                <ExternalLink size={12} />
                Live
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StudentProjects = () => {
  const [filter, setFilter] = useState('all');
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);

  const featuredProjects = PROJECTS_DATA.filter(p => p.featured);
  const allProjects = PROJECTS_DATA;

  const filteredProjects = filter === 'featured' ? featuredProjects : allProjects;

  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = isMobile ? window.innerWidth * 0.85 : 640; // Card width + gap
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
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10">
          <div className="mb-14 px-4 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter uppercase leading-[1.1] mb-4 text-center">
              These are real projects students actually build.
            </h2>
            <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center px-2">
              By the end of a ThinkSkool program every student has something working, something they built themselves and something they can show the world.
            </p>
          </div>

          {/* Filter Tabs - Mobile */}
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

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6 scrollbar-hide">
             {filteredProjects.map((project) => (
               <div 
                 key={project.id} 
                 className="snap-center shrink-0 w-[85vw] bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col active:scale-[0.98] transition-all duration-300"
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
                          <img src={project.author.avatar} alt={project.author.name} className="w-10 h-10 rounded-full border border-slate-100" />
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

          <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full opacity-60">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Swipe to view more</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
          </div>

          <div className="mt-16 text-center">
             <button className="w-full bg-slate-50 border border-slate-200 text-slate-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all">
                Join Research Lab <ArrowRight size={16} className="text-blue-600" />
             </button>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section id="student-projects" className="pb-20 md:pb-28 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%)"
            ],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl">
            These are real projects students actually build.
          </ScrollDarkenHeading>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg mt-6 max-w-3xl mx-auto leading-relaxed"
          >
            By the end of a ThinkSkool program every student has something working, something they built themselves and something they can show the world.
          </motion.p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-12"
        >
          {['all', 'featured'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === tab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === 'all' ? 'All Projects' : 'Featured Only'}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 auto-rows-auto"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isFeatured={project.featured}
            />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={() => {
              const el = document.getElementById('online-focus');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/25 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building Your Own Project
            <ArrowRight size={20} />
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-slate-600 mt-4"
          >
            Join our courses and turn your ideas into reality
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentProjects;
