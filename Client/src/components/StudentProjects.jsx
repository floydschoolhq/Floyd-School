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
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';

const PROJECTS_DATA = [
  {
    id: 1,
    title: "AI Chat Assistant",
    category: "Artificial Intelligence",
    description: "Advanced conversational AI with natural language processing capabilities",
    image: "/projects/ai-chat.png",
    tech: ["React", "Node.js", "OpenAI API", "WebSocket"],
    stats: { stars: 234, forks: 45, views: "1.2k" },
    featured: false,
    color: "purple",
    author: {
      name: "Priya Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      course: "AI & ML Mastery"
    },
    liveUrl: "https://example.com/ai-chat",
    githubUrl: "https://github.com/example/ai-chat"
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    category: "Full Stack Development",
    description: "Complete online shopping platform with payment integration and admin dashboard",
    image: "/projects/E_commerce.png",
    tech: ["Next.js", "MongoDB", "Stripe", "Tailwind"],
    stats: { stars: 189, forks: 32, views: "980" },
    featured: true,
    color: "blue",
    author: {
      name: "Rahul Verma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      course: "Full Stack Web Dev"
    },
    liveUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/example/ecommerce"
  },
  {
    id: 5,
    title: "Cybersecurity Tool",
    category: "Cybersecurity",
    description: "Network security scanner with vulnerability assessment and reporting",
    image: "/projects/cybersecurity_tool.jpg",
    tech: ["Python", "Scapy", "Nmap", "React"],
    stats: { stars: 412, forks: 89, views: "3.4k" },
    featured: false,
    color: "red",
    author: {
      name: "Sneha Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
      course: "Cybersecurity Ops"
    },
    liveUrl: "https://example.com/cyber-tool",
    githubUrl: "https://github.com/example/cyber-tool"
  },
  {
    id: 3,
    title: "IoT Smart Home",
    category: "IoT & Robotics",
    description: "Home automation system with real-time monitoring and mobile app control",
    image: "/projects/IoT-For-Home-Automation.jpg",
    tech: ["Arduino", "Raspberry Pi", "Python", "MQTT"],
    stats: { stars: 156, forks: 28, views: "756" },
    featured: true,
    color: "orange",
    author: {
      name: "Kavya Reddy",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya",
      course: "IoT & Robotics"
    },
    liveUrl: "https://example.com/smart-home",
    githubUrl: "https://github.com/example/smart-home"
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
    color: "green",
    author: {
      name: "Arjun Nair",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      course: "Mobile App Development"
    },
    liveUrl: "https://example.com/task-app",
    githubUrl: "https://github.com/example/task-app"
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="px-3 py-2 bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg transition-transform duration-200 ease-out"
              >
                <ExternalLink size={12} />
                Live
              </motion.a>
              <motion.a
                href={project.githubUrl}
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg transition-transform duration-200 ease-out"
              >
                <Github size={12} />
                Code
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
      <section id="student-projects" className="py-8 pb-16 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 relative overflow-hidden">
        {/* Simplified Background for Mobile */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-5 w-12 h-12 bg-orange-500/3 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-5 w-10 h-10 bg-blue-500/2 rounded-full blur-xl" />
        </div>

        <div className="max-w-95% mx-auto px-2 relative z-10">
          {/* Header - Mobile */}
          <div className="text-center mt-16 mb-6 sm:mt-20 md:mt-16">
            <h2 className="text-xl font-black text-slate-900 mb-2 leading-tight">
              Student Projects
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed px-1">
              Real projects built by our students.
            </p>
          </div>

          {/* Filter Tabs - Mobile */}
          <div className="flex justify-center gap-2 mb-4">
            {['all', 'featured'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2 py-1 rounded-md font-bold text-xs transition-all duration-300 ${
                  filter === tab
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {tab === 'all' ? 'All' : 'Featured'}
              </button>
            ))}
          </div>

          {/* Projects Grid - Mobile Horizontal Scrolling */}
          <div className="mb-8 relative">
            {/* Enhanced Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 z-20">
              <button 
                onClick={() => scroll('left')}
                className="p-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg transition-all scale-90 hover:scale-100 active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-20">
              <button 
                onClick={() => scroll('right')}
                className="p-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg transition-all scale-90 hover:scale-100 active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div 
              ref={scrollRef}
              className="overflow-hidden py-12 -mx-4 px-6 overflow-x-auto snap-x snap-mandatory" 
              style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  scrollPaddingLeft: '1.5rem',
                  scrollPaddingRight: '1.5rem'
              }}
            >
              {/* webkit-scrollbar hiding applied via a hacky style tag */}
              <style>{`
                .student-projects .overflow-x-auto::-webkit-scrollbar { display: none; }
              `}</style>
              <div className="flex gap-4 w-max">
                {filteredProjects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className="flex-shrink-0 w-80" 
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <ProjectCard
                      project={project}
                      index={index}
                      isFeatured={project.featured}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {filteredProjects.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === 0 ? 'bg-orange-500 w-6' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA Section - Mobile */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-md w-full max-w-[200px]">
              <Rocket size={12} />
              Start Building
            </div>
            <p className="text-slate-600 text-xs mt-2 px-2">
              Join our courses and turn ideas into reality
            </p>
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
    );
  }

  return (
    <section id="student-projects" className="py-20 md:py-28 pb-32 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 relative overflow-hidden">
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
          className="text-center mt-16 mb-16 sm:mt-20 md:mt-16"
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
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
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
          <motion.div
            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket size={20} />
            Start Building Your Own Project
            <ArrowRight size={20} />
          </motion.div>
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
