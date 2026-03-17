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
  SiOpencv
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
    { node: <TechIcon icon={SiReact} label="React" color="#61DAFB" />, title: "React" },
    { node: <TechIcon icon={SiNextdotjs} label="Next.js" color="#000000" />, title: "Next.js" },
    { node: <TechIcon icon={SiTensorflow} label="TensorFlow" color="#FF6F00" />, title: "TensorFlow" },
    { node: <TechIcon icon={SiArduino} label="Arduino" color="#00979D" />, title: "Arduino" },
    { node: <TechIcon icon={SiPython} label="Python" color="#3776AB" />, title: "Python" },
    { node: <TechIcon icon={SiNodedotjs} label="Node.js" color="#339933" />, title: "Node.js" },
    { node: <TechIcon icon={SiTailwindcss} label="Tailwind" color="#06B6D4" />, title: "Tailwind" },
    { node: <TechIcon icon={SiTypescript} label="TypeScript" color="#3178C6" />, title: "TypeScript" },
    { node: <TechIcon icon={SiMongodb} label="MongoDB" color="#47A248" />, title: "MongoDB" },
    { node: <TechIcon icon={SiPostgresql} label="PostgreSQL" color="#336791" />, title: "PostgreSQL" },
    { node: <TechIcon icon={SiFirebase} label="Firebase" color="#FFCA28" />, title: "Firebase" },
    { node: <TechIcon icon={SiGooglecloud} label="Cloud" color="#4285F4" />, title: "Cloud" },
    { node: <TechIcon icon={SiJavascript} label="JS" color="#F7DF1E" />, title: "JS" },
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
            <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-20 pb-16 overflow-hidden">
                {/* Modern Mobile Header */}
                <div className="px-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            <Terminal size={12} />
                            Technologies We Master
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            Cutting-Edge Tech Stack
                        </h2>
                        <p className="text-slate-600 text-sm">
                            From AI to IoT, we've got you covered
                        </p>
                    </motion.div>
                </div>

                {/* Tech Categories Grid */}
                <div className="px-4 space-y-6">
                    {TECH_CATEGORIES.map((category, categoryIndex) => {
                        const CategoryIcon = category.icon;
                        return (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: categoryIndex * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <CategoryIcon className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{category.title}</h3>
                                        <p className="text-slate-500 text-xs">{category.technologies.length} technologies</p>
                                    </div>
                                </div>

                                {/* Technologies Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    {category.technologies.map((tech, techIndex) => {
                                        const TechIcon = tech.icon;
                                        return (
                                            <motion.div
                                                key={tech.name}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                                                className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                            >
                                                <div 
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                                                    style={{ backgroundColor: tech.color + '20' }}
                                                >
                                                    <tech.icon 
                                                        size={20} 
                                                        style={{ color: tech.color }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-700 text-center">
                                                    {tech.name}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="px-4 mt-[12.6%]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white scale-[0.9] mx-[5%]"
                    >
                        <h3 className="font-bold text-lg mb-2">
                            Ready to Learn These Technologies?
                        </h3>
                        <p className="text-sm opacity-90 mb-4">
                            Join our programs and master the tech stack that powers the future
                        </p>
                        <button 
                            onClick={handleExplorePrograms}
                            className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Explore Programs
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Desktop section
    return (
        <section className="bg-white pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden">
            {/* Tech Showcase Header - Multi-layered HUD style */}
            <div className="w-full max-w-7xl mx-auto px-4 text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex flex-col items-center"
                >
                    <h2 className="text-slate-900 font-black uppercase tracking-[0.2em] md:tracking-[0.55em] text-[16px] md:text-[24px] leading-none whitespace-nowrap text-center">
                        Technologies we master
                    </h2>
                </motion.div>
            </div>

            {/* Full Width Tech Loop */}
            <div className="w-full max-w-7xl mx-auto relative mb-20">
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-white via-transparent to-white w-24 md:w-64 left-0" />
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-l from-white via-transparent to-white w-24 md:w-64 right-0" />
                
                <div className="w-full overflow-hidden">
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
