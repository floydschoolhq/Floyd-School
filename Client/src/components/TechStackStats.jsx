import { motion } from 'framer-motion';
import { Star, Users, CheckCircle, BookOpen, Terminal, Code2 } from 'lucide-react';
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

import useIsMobile from '../hooks/useIsMobile';

const TechIcon = ({ icon: Icon, label, color, url }) => {
    const isMobile = useIsMobile();
    
    const handleClick = (e) => {
        if (url) {
            e.stopPropagation();
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.div 
            onClick={handleClick}
            className={`group relative flex flex-col items-center gap-4 py-8 cursor-pointer ${!isMobile ? "perspective-[1000px]" : ""}`}
            whileHover={!isMobile ? { scale: 1.05 } : {}}
        >
            {/* Glow/Shadow Base */}
            <div 
                className="absolute inset-x-0 top-1/2 -bottom-4 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700 rounded-full z-0"
                style={{ backgroundColor: color }}
            />
            
            {/* 3D Icon Card */}
            <motion.div 
                className="relative z-10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white border border-slate-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.02)] rounded-[2rem] transition-all duration-700 ease-[0.23,1,0.32,1] transform-style-3d group-hover:border-slate-200"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={!isMobile ? { 
                    rotateY: 15, 
                    rotateX: -15,
                    translateZ: 20,
                    boxShadow: "0 40px 80px -20px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.05)"
                } : {}}
            >
                {/* 3D Depth Layer 1 (Inner Shadow) */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/80 via-transparent to-black/5 pointer-events-none" />
                
                {/* 3D Depth Layer 2 (Outer Side) */}
                <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <motion.div 
                    className="relative z-20 flex items-center justify-center p-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                    style={{ transform: 'translateZ(30px)' }}
                >
                    <Icon 
                        size={isMobile ? 36 : 48} 
                        style={{ color: color }} 
                        className="transition-transform duration-700 group-hover:scale-110" 
                    />
                </motion.div>
            </motion.div>
            
            {/* Label with 3D lift */}
            <motion.span 
                className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] transition-all duration-500 group-hover:text-slate-900 group-hover:tracking-[0.4em]"
                style={{ transform: !isMobile ? 'translateZ(10px)' : 'none' }}
            >
                {label}
            </motion.span>
        </motion.div>
    );
};

const techLogos = [
    { node: <TechIcon icon={SiReact} label="React" color="#61DAFB" url="https://react.dev" />, title: "React", href: "https://react.dev" },
    { node: <TechIcon icon={SiNextdotjs} label="Next.js" color="#000000" url="https://nextjs.org" />, title: "Next.js", href: "https://nextjs.org" },
    { node: <TechIcon icon={SiTensorflow} label="TensorFlow" color="#FF6F00" url="https://www.tensorflow.org" />, title: "TensorFlow", href: "https://www.tensorflow.org" },
    { node: <TechIcon icon={SiArduino} label="Arduino" color="#00979D" url="https://www.arduino.cc" />, title: "Arduino", href: "https://www.arduino.cc" },
    { node: <TechIcon icon={SiTypescript} label="TypeScript" color="#3178C6" url="https://www.typescriptlang.org" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <TechIcon icon={SiPython} label="Python" color="#3776AB" url="https://www.python.org" />, title: "Python", href: "https://www.python.org" },
    { node: <TechIcon icon={SiPytorch} label="PyTorch" color="#EE4C2C" url="https://pytorch.org" />, title: "PyTorch", href: "https://pytorch.org" },
    { node: <TechIcon icon={SiRaspberrypi} label="Raspberry Pi" color="#C51A4A" url="https://www.raspberrypi.com" />, title: "Raspberry Pi", href: "https://www.raspberrypi.com" },
    { node: <TechIcon icon={SiTailwindcss} label="Tailwind" color="#06B6D4" url="https://tailwindcss.com" />, title: "Tailwind", href: "https://tailwindcss.com" },
    { node: <TechIcon icon={SiNodedotjs} label="Node.js" color="#339933" url="https://nodejs.org" />, title: "Node.js", href: "https://nodejs.org" },
    { node: <TechIcon icon={SiOpenai} label="OpenAI" color="#412991" url="https://openai.com" />, title: "OpenAI", href: "https://openai.com" },
    { node: <TechIcon icon={SiRos} label="ROS" color="#22314E" url="https://www.ros.org" />, title: "ROS", href: "https://www.ros.org" },
    { node: <TechIcon icon={SiUnity} label="Unity" color="#000000" url="https://unity.com" />, title: "Unity", href: "https://unity.com" },
    { node: <TechIcon icon={SiCplusplus} label="C++" color="#00599C" url="https://isocpp.org" />, title: "C++", href: "https://isocpp.org" },
    { node: <TechIcon icon={SiFirebase} label="Firebase" color="#FFCA28" url="https://firebase.google.com" />, title: "Firebase", href: "https://firebase.google.com" },
    { node: <TechIcon icon={SiMongodb} label="MongoDB" color="#47A248" url="https://www.mongodb.com" />, title: "MongoDB", href: "https://www.mongodb.com" },
    { node: <TechIcon icon={SiUnrealengine} label="Unreal" color="#000000" url="https://www.unrealengine.com" />, title: "Unreal", href: "https://www.unrealengine.com" },
    { node: <TechIcon icon={SiFlutter} label="Flutter" color="#02569B" url="https://flutter.dev" />, title: "Flutter", href: "https://flutter.dev" },
    { node: <TechIcon icon={SiLinux} label="Linux" color="#FCC624" url="https://www.kernel.org" />, title: "Linux", href: "https://www.kernel.org" },
    { node: <TechIcon icon={SiOpencv} label="OpenCV" color="#5C3EE8" url="https://opencv.org" />, title: "OpenCV", href: "https://opencv.org" },
    { node: <TechIcon icon={SiGooglecloud} label="Cloud" color="#4285F4" url="https://cloud.google.com" />, title: "Cloud", href: "https://cloud.google.com" },
    { node: <TechIcon icon={SiJavascript} label="JS" color="#F7DF1E" url="https://developer.mozilla.org/en-US/docs/Web/JavaScript" />, title: "JS", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
];

const TechStackStats = () => {
    const isMobile = useIsMobile();
    const stats = [
        { label: "Joined us", value: "1K+", icon: <Users className="w-5 h-5" /> },
        { label: "Premium Courses", value: "3 Months", icon: <CheckCircle className="w-5 h-5" /> },
        { label: "Active courses", value: "4+", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Average rating", value: "4.9★", icon: <Star className="w-5 h-5" /> },
    ];

    return (
        <section className="bg-white py-12 md:py-20 overflow-hidden">
            {/* Tech Showcase Header - Multi-layered HUD style */}
            <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex flex-col items-center"
                >
                    <div className="flex items-center gap-6 md:gap-8 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full border border-blue-500/30 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                            </div>
                            <div className="h-[1px] w-8 md:w-16 bg-slate-200/60" />
                        </div>
                        
                        <h2 className="text-slate-950 font-black uppercase tracking-[0.4em] md:tracking-[0.55em] text-[13px] md:text-[16px] leading-none whitespace-nowrap">
                            Technologies we master
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-8 md:w-16 bg-slate-200/60" />
                            <div className="w-2 h-2 rounded-full border border-blue-500/30 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="w-12 h-[3px] bg-slate-900 rounded-full" />
                        <div className="w-2 h-[3px] bg-blue-600 rounded-full" />
                        <div className="w-2 h-[3px] bg-blue-600 rounded-full" />
                        <div className="w-12 h-[3px] bg-slate-900 rounded-full" />
                    </div>
                </motion.div>
            </div>

            {/* Full Width Tech Loop */}
            <div className="w-full relative mb-20">
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-white via-transparent to-white w-24 md:w-64 left-0" />
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-l from-white via-transparent to-white w-24 md:w-64 right-0" />
                
                <div className="w-full overflow-hidden">
                    {isMobile ? (
                        <div className="flex flex-wrap justify-center gap-4 px-4 overflow-x-auto no-scrollbar pb-4">
                            {techLogos.map((logo, idx) => (
                                <div key={idx} className="scale-90 shrink-0">
                                    {logo.node}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <LogoLoop
                            logos={techLogos}
                            speed={35}
                            direction="left"
                            logoHeight={40}
                            gap={100}
                            pauseOnHover={true}
                            scaleOnHover={true}
                            fadeOut={false}
                            ariaLabel="Technology stack"
                        />
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">

                {/* Stats Grid */}
                <motion.div 
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#F1F1F1] rounded-2xl p-4 md:p-12 border border-slate-200/50"
                >
                    <div className="relative p-[1px] rounded-xl overflow-hidden group/stats-container">
                        {/* Moving Outline Tracer - Monochromatic - Sharpened Visibility */}
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_70%,#64748b_90%,#94a3b8_95%,transparent_100%)] opacity-100 z-0"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 relative bg-white rounded-xl p-8 shadow-sm z-10">
                            {stats.map((stat, i) => (
                                <div key={i} className={`group relative flex flex-col items-center justify-center text-center py-6 px-4 rounded-xl transition-all duration-500 hover:bg-slate-50/80 overflow-hidden ${i !== stats.length - 1 && !isMobile ? 'lg:border-r border-slate-100 lg:hover:border-transparent lg:rounded-none lg:hover:rounded-xl' : ''}`}>
                                    
                                    {/* Metallic Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-0" />
                                    
                                    <div className="flex items-center gap-2 mb-2 relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 tracking-[-0.04em] whitespace-nowrap">
                                            {stat.value}
                                        </span>
                                        {stat.icon && <div className="text-slate-200 transition-all duration-500 group-hover:text-slate-400 group-hover:scale-110 group-hover:-rotate-3">{stat.icon}</div>}
                                    </div>
                                    <span className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 justify-center relative z-10 transition-all duration-500 group-hover:text-slate-800">
                                        <div className="w-1 h-1 rounded-full bg-slate-300 transition-all duration-500 group-hover:scale-[2] group-hover:bg-slate-400" /> {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TechStackStats;
