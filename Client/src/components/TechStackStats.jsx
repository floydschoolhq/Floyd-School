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
  SiJavascript
} from 'react-icons/si';

import useIsMobile from '../hooks/useIsMobile';

const TechIcon = ({ icon: Icon, label, color }) => {
    const isMobile = useIsMobile();
    return (
        <div className="group relative flex flex-col items-center gap-4 py-4">
            {/* Glow Effect */}
            {!isMobile && (
                <div 
                    className="absolute inset-x-0 top-6 bottom-12 opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500 rounded-full"
                    style={{ backgroundColor: color }}
                />
            )}
            
            {/* Icon Container - Glassmorphism touch */}
            <div className={`relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white border border-slate-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[1.5rem] transition-all duration-500 ease-[0.23,1,0.32,1] ${!isMobile ? "group-hover:-translate-y-3 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.06)] group-hover:border-slate-200" : ""}`}>
                <Icon size={isMobile ? 32 : 40} style={{ color: color }} className="filter drop-shadow-sm transition-transform duration-500 group-hover:scale-110" />
            </div>
            
            {/* Label - Premium Typography */}
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] transition-all duration-300 group-hover:text-slate-900 group-hover:tracking-[0.25em]">
                {label}
            </span>
        </div>
    );
};

const techLogos = [
    { node: <TechIcon icon={SiReact} label="React" color="#61DAFB" />, title: "React", href: "https://react.dev" },
    { node: <TechIcon icon={SiNextdotjs} label="Next.js" color="#000000" />, title: "Next.js", href: "https://nextjs.org" },
    { node: <TechIcon icon={SiTypescript} label="TypeScript" color="#3178C6" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <TechIcon icon={SiTailwindcss} label="Tailwind" color="#06B6D4" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <TechIcon icon={SiPython} label="Python" color="#3776AB" />, title: "Python", href: "https://www.python.org" },
    { node: <TechIcon icon={SiNodedotjs} label="Node.js" color="#339933" />, title: "Node.js", href: "https://nodejs.org" },
    { node: <TechIcon icon={SiUnity} label="Unity" color="#000000" />, title: "Unity", href: "https://unity.com" },
    { node: <TechIcon icon={SiUnrealengine} label="Unreal" color="#000000" />, title: "Unreal Engine", href: "https://www.unrealengine.com" },
    { node: <TechIcon icon={SiGooglecloud} label="Cloud" color="#4285F4" />, title: "Cloud", href: "https://cloud.google.com" },
    { node: <TechIcon icon={Terminal} label="Security" color="#0F172A" />, title: "Cybersecurity" },
    { node: <TechIcon icon={Code2} label="DevOps" color="#2563EB" />, title: "Full Stack" },
    { node: <TechIcon icon={SiJavascript} label="JS" color="#F7DF1E" />, title: "JavaScript", href: "https://javascript.info" },
    { node: <TechIcon icon={SiFramer} label="Framer" color="#0055FF" />, title: "Framer", href: "https://www.framer.com" },
];

const TechStackStats = () => {
    const isMobile = useIsMobile();
    const stats = [
        { label: "Joined us", value: "1K+", icon: <Users className="w-5 h-5" /> },
        { label: "Premium AI Courses", value: "3 Months", icon: <CheckCircle className="w-5 h-5" /> },
        { label: "Active courses", value: "4+", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Average rating", value: "4.9★", icon: <Star className="w-5 h-5" /> },
    ];

    return (
        <section className="bg-white py-12 md:py-20 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Tech Showcase */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-16 text-center">
                    <span className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[11px] whitespace-nowrap">
                        Technologies we master
                    </span>
                    <div className="flex-1 w-full overflow-hidden">
                        {isMobile ? (
                            <div className="flex flex-wrap justify-center gap-2">
                                {techLogos.slice(0, 6).map((logo, idx) => (
                                    <div key={idx} className="scale-75">
                                        {logo.node}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <LogoLoop
                                logos={techLogos}
                                speed={45}
                                direction="left"
                                logoHeight={40}
                                gap={70}
                                pauseOnHover={true}
                                scaleOnHover={true}
                                fadeOut={true}
                                fadeOutColor="#ffffff"
                                ariaLabel="Technology stack"
                            />
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div 
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#F1F1F1] rounded-2xl p-4 md:p-12 border border-slate-100/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 relative bg-white rounded-xl p-8 shadow-sm">
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
                </motion.div>
            </div>
        </section>
    );
};

export default TechStackStats;
