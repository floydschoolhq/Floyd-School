import { motion } from 'framer-motion';
import { Terminal, Code2 } from 'lucide-react';
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
    { node: <TechIcon icon={SiTypescript} label="TypeScript" color="#3178C6" />, title: "TypeScript" },
    { node: <TechIcon icon={SiPython} label="Python" color="#3776AB" />, title: "Python" },
    { node: <TechIcon icon={SiPytorch} label="PyTorch" color="#EE4C2C" />, title: "PyTorch" },
    { node: <TechIcon icon={SiRaspberrypi} label="Raspberry Pi" color="#C51A4A" />, title: "Raspberry Pi" },
    { node: <TechIcon icon={SiTailwindcss} label="Tailwind" color="#06B6D4" />, title: "Tailwind" },
    { node: <TechIcon icon={SiNodedotjs} label="Node.js" color="#339933" />, title: "Node.js" },
    { node: <TechIcon icon={SiOpenai} label="OpenAI" color="#412991" />, title: "OpenAI" },
    { node: <TechIcon icon={SiRos} label="ROS" color="#22314E" />, title: "ROS" },
    { node: <TechIcon icon={SiUnity} label="Unity" color="#000000" />, title: "Unity" },
    { node: <TechIcon icon={SiCplusplus} label="C++" color="#00599C" />, title: "C++" },
    { node: <TechIcon icon={SiFirebase} label="Firebase" color="#FFCA28" />, title: "Firebase" },
    { node: <TechIcon icon={SiMongodb} label="MongoDB" color="#47A248" />, title: "MongoDB" },
    { node: <TechIcon icon={SiUnrealengine} label="Unreal" color="#000000" />, title: "Unreal" },
    { node: <TechIcon icon={SiFlutter} label="Flutter" color="#02569B" />, title: "Flutter" },
    { node: <TechIcon icon={SiLinux} label="Linux" color="#FCC624" />, title: "Linux" },
    { node: <TechIcon icon={SiOpencv} label="OpenCV" color="#5C3EE8" />, title: "OpenCV" },
    { node: <TechIcon icon={SiGooglecloud} label="Cloud" color="#4285F4" />, title: "Cloud" },
    { node: <TechIcon icon={SiJavascript} label="JS" color="#F7DF1E" />, title: "JS" },
];

const TechStackStats = () => {
    const isMobile = useIsMobile();

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
                            scaleOnHover={false}
                            fadeOut={false}
                            ariaLabel="Technology stack"
                        />
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Stats Grid removed permanently */}
            </div>
        </section>
    );
};

export default TechStackStats;
