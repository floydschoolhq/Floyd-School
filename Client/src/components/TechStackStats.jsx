import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2, Cpu, Database, Cloud, Smartphone } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { LogoLoop } from './common/LogoLoop';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiPython, 
  SiNodedotjs, 
  SiUnity, 
  SiUnrealengine,
  SiGooglecloud,
  SiFramer,
  SiJavascript,
  SiTensorflow,
  SiPytorch,
  SiOpenai,
  SiArduino,
  SiRaspberrypi,
  SiRos,
  SiCplusplus,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiFlutter,
  SiLinux,
  SiOpencv,
  SiHtml5,
  SiExpress,
  SiGit
} from 'react-icons/si';

// TechIcon component for desktop
const TechIcon = ({ icon: Icon, label, color }) => {
    const isMobile = useIsMobile();
    return (
        <div className="group relative flex flex-col items-center gap-4 py-4 cursor-default">
            {/* Minimal Glow Effect */}
            {!isMobile && (
                <div 
                    className="absolute inset-x-0 top-6 bottom-10 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-full"
                    style={{ backgroundColor: color }}
                />
            )}
            
            {/* Icon Container - Scaled down & Non-interactive feel */}
            <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[1.2rem] transition-all duration-500 ease-[0.23,1,0.32,1] ${!isMobile ? "group-hover:border-slate-200 group-hover:shadow-md" : ""}`}>
                <Icon size={isMobile ? 24 : 32} style={{ color: color }} className="filter drop-shadow-sm transition-transform duration-500" />
            </div>
            
            {/* Label - Smaller Typography */}
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] transition-colors duration-300 group-hover:text-slate-600">
                {label}
            </span>
        </div>
    );
};

const techLogos = [
    { node: <TechIcon icon={SiTensorflow} label="Machine Learning" color="#FF6F00" />, title: "Machine Learning" },
    { node: <TechIcon icon={SiOpenai} label="AI" color="#412991" />, title: "AI" },
    { node: <TechIcon icon={SiUnity} label="Robotics" color="#000000" />, title: "Robotics" },
    { node: <TechIcon icon={SiLinux} label="IoT" color="#FCC624" />, title: "IoT" },
    { node: <TechIcon icon={SiHtml5} label="HTML" color="#E34F26" />, title: "HTML" },
    { node: <TechIcon icon={SiJavascript} label="JavaScript" color="#F7DF1E" />, title: "JavaScript" },
    { node: <TechIcon icon={SiReact} label="React" color="#61DAFB" />, title: "React" },
    { node: <TechIcon icon={SiNodedotjs} label="Node.js" color="#339933" />, title: "Node.js" },
    { node: <TechIcon icon={SiExpress} label="Express" color="#000000" />, title: "Express" },
    { node: <TechIcon icon={SiPython} label="Python" color="#3776AB" />, title: "Python" },
    { node: <TechIcon icon={SiGit} label="Git" color="#F05032" />, title: "Git" },
    { node: <TechIcon icon={SiMongodb} label="MongoDB" color="#47A248" />, title: "MongoDB" },
    { node: <TechIcon icon={SiPostgresql} label="PostgreSQL" color="#336791" />, title: "PostgreSQL" },
    { node: <TechIcon icon={SiNextdotjs} label="Next.js" color="#000000" />, title: "Next.js" },
    { node: <TechIcon icon={SiTypescript} label="TypeScript" color="#3178C6" />, title: "TypeScript" },
];

// Modern tech categories for mobile
const TECH_CATEGORIES = [
  {
    title: "Frontend",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    technologies: [
      { icon: SiReact, name: "React", color: "#61DAFB" },
      { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
      { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
      { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" }
    ]
  },
  {
    title: "Backend",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    technologies: [
      { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
      { icon: SiPython, name: "Python", color: "#3776AB" },
      { icon: SiPostgresql, name: "PostgreSQL", color: "#336791" },
      { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
      { icon: SiFirebase, name: "Firebase", color: "#FFCA28" }
    ]
  },
  {
    title: "AI/ML",
    icon: Cpu,
    color: "from-purple-500 to-blue-500",
    technologies: [
      { icon: SiTensorflow, name: "TensorFlow", color: "#FF6F00" },
      { icon: SiPytorch, name: "PyTorch", color: "#EE4C2C" },
      { icon: SiOpenai, name: "OpenAI", color: "#412991" },
      { icon: SiOpencv, name: "OpenCV", color: "#5C3EE8" }
    ]
  },
  {
    title: "Mobile & IoT",
    icon: Smartphone,
    color: "from-orange-500 to-red-500",
    technologies: [
      { icon: SiFlutter, name: "Flutter", color: "#02569B" },
      { icon: SiArduino, name: "Arduino", color: "#00979D" },
      { icon: SiRaspberrypi, name: "Raspberry Pi", color: "#C51A4A" },
      { icon: SiLinux, name: "Linux", color: "#FCC624" }
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "from-indigo-500 to-blue-500",
    technologies: [
      { icon: SiGooglecloud, name: "Google Cloud", color: "#4285F4" },
      { icon: SiUnity, name: "Unity", color: "#000000" },
      { icon: SiUnrealengine, name: "Unreal", color: "#313131" }
    ]
  }
];

const TechStackStats = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const handleExplorePrograms = () => {
        // Scroll to the courses section
        const coursesSection = document.getElementById('online-focus');
        if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback to navigate if section doesn't exist
            navigate('/online-program#explore-programs');
        }
    };

    if (isMobile) {
        return (
            <section className="bg-[#FDFCFB] pt-20 pb-16 overflow-hidden">
                {/* Mobile Header */}
                <div className="px-6 mb-12">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 text-[#F97316] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-orange-500/20">
                            <Terminal size={14} />
                            Skills for the Future
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                            Cutting-Edge <br/>
                            <span className="text-[#F97316]">Technologies</span> You Will Learn
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            From AI & Robotics to Full-Stack Development
                        </p>
                    </div>
                </div>

                {/* Tech Categories Grid */}
                <div className="px-5 space-y-6">
                    {TECH_CATEGORIES.map((category, categoryIndex) => {
                        const CategoryIcon = category.icon;
                        return (
                            <div
                                key={category.title}
                                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100"
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10`}>
                                        <CategoryIcon className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">{category.title}</h3>
                                        <div className="w-12 h-1 bg-[#F97316] rounded-full mt-1 opacity-50" />
                                    </div>
                                </div>

                                {/* Technologies Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    {category.technologies.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100/50"
                                        >
                                            <div 
                                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm"
                                            >
                                                <tech.icon 
                                                    size={22} 
                                                    style={{ color: tech.color }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-black text-slate-600 text-center uppercase tracking-tight">
                                                {tech.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="px-6 mt-16">
                    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                        
                        <h3 className="font-black text-xl mb-3 text-white uppercase tracking-tight">
                            Ready to Master <span className="text-[#F97316]">The Future?</span>
                        </h3>
                        <p className="text-slate-400 text-sm mb-6 font-medium">
                            Join our programs and build real-world products using these tools.
                        </p>
                        <button 
                            onClick={handleExplorePrograms}
                            className="w-full bg-[#F97316] text-white py-4 rounded-2xl font-black text-base uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                        >
                            Explore Programs
                        </button>
                    </div>
                </div>
            </section>
        );
    }


    // Desktop section
    return (
        <section className="bg-white pt-12 md:pt-20 pb-12 md:pb-20 overflow-hidden">
            {/* Tech Showcase Header - Multi-layered HUD style */}
            <div className="w-full max-w-7xl mx-auto px-4 text-center mb-24 relative">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex flex-col items-center relative z-10"
                >
                    <h2 className="font-bold uppercase tracking-[0.3em] md:tracking-[0.7em] text-5xl md:text-7xl leading-none whitespace-nowrap text-center">
                        {["Technologies", "you", "will", "learn"].map((word, i) => {
                            return (
                                <motion.span
                                    key={i}
                                    animate="animate"
                                    variants={{
                                        animate: {
                                            filter: [
                                                "brightness(1) drop-shadow(0 0 0px rgba(249, 115, 22, 0))",
                                                "brightness(1.8) drop-shadow(0 0 20px rgba(249, 115, 22, 0.4))",
                                                "brightness(1) drop-shadow(0 0 0px rgba(249, 115, 22, 0))"
                                            ],
                                            transition: {
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: i * 0.3,
                                            }
                                        }
                                    }}
                                    className={`text-orange-500 inline-block ${i > 0 ? 'ml-3' : ''}`}
                                >
                                    {word}
                                </motion.span>
                            );
                        })}
                    </h2>
                </motion.div>
            </div>

            {/* Full Width Tech Loop */}
            <div className="relative mb-20 w-full">
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-white via-white to-transparent w-20 md:w-32 left-0" />
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-l from-white via-white to-transparent w-20 md:w-32 right-0" />
                
                <div className="w-full overflow-hidden -ml-8 md:-ml-16">
                    {!isMobile && (
                        <LogoLoop
                            logos={techLogos}
                            speed={35}
                            direction="left"
                            logoHeight={40}
                            gap={100}
                            pauseOnHover={true}
                            scaleOnHover={false}
                            fadeOut={false}
                            ariaLabel="Technology stack"
                        />
                    )}
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4">
                {/* Stats Grid removed permanently */}
            </div>
        </section>
    );
};

export default TechStackStats;
