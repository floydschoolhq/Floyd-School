import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Database, Cloud, Smartphone } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import { LogoLoop } from './common/LogoLoop';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
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

// Mobile 3D Icon Component
const MobileIcon = ({ tech, position }) => {
  return (
    <group position={position}>
      <Float speed={4} rotationIntensity={1.5} floatIntensity={2}>
        <Html
          center
          distanceFactor={10}
          zIndexRange={[0, 10]}
          className="pointer-events-none select-none"
        >
          <div 
            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-[1.2rem] border border-slate-200/50 flex items-center justify-center shadow-lg transition-transform active:scale-110"
            style={{ 
              boxShadow: `0 8px 30px ${tech.color}10`,
            }}
          >
            <tech.icon size={26} style={{ color: tech.color }} />
          </div>
        </Html>
      </Float>
    </group>
  );
};

const MobileTechGlobe = () => {
  const allTechs = useMemo(() => {
    // Curated essential technologies for mobile globe to reduce density
    return [
      { icon: SiReact, name: "React", color: "#61DAFB" },
      { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
      { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
      { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
      { icon: SiPython, name: "Python", color: "#3776AB" },
      { icon: SiOpenai, name: "OpenAI", color: "#412991" },
      { icon: SiTensorflow, name: "TensorFlow", color: "#FF6F00" },
      { icon: SiPytorch, name: "PyTorch", color: "#EE4C2C" },
      { icon: SiFlutter, name: "Flutter", color: "#02569B" },
      { icon: SiArduino, name: "Arduino", color: "#00979D" },
      { icon: SiRaspberrypi, name: "Raspberry Pi", color: "#C51A4A" },
      { icon: SiGooglecloud, name: "Google Cloud", color: "#4285F4" },
      { icon: SiPostgresql, name: "PostgreSQL", color: "#336791" },
      { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
      { icon: SiUnity, name: "Unity", color: "#000000" },
      { icon: SiUnrealengine, name: "Unreal", color: "#313131" },
      { icon: SiLinux, name: "Linux", color: "#FCC624" },
      { icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
      { icon: SiOpencv, name: "OpenCV", color: "#5C3EE8" }
    ];
  }, []);

  const count = allTechs.length;
  const radius = 5.5; // Slightly larger radius for fewer icons to look more spacious
  
  const positions = useMemo(() => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      points.push([x * radius, y * radius, z * radius]);
    }
    return points;
  }, [count]);

  const groupRef = useRef();
  
  return (
    <group ref={groupRef}>
      {allTechs.map((tech, i) => (
        <MobileIcon key={`${tech.name}-${i}`} tech={tech} position={positions[i]} />
      ))}
    </group>
  );
};

const TechStackStats = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section className="pt-20 pb-12 bg-white relative z-10 w-full flex flex-col items-center overflow-hidden">
                {/* Background Text Accent */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
                  <h2 className="text-[25vw] font-bold leading-none uppercase -rotate-12 transform -translate-y-20">
                    TECH<br/>STACK
                  </h2>
                </div>

                <div className="relative z-30 w-full px-6 text-center space-y-2">
                    {/* Badge removed */}
                    <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-widest leading-tight">
                        Technologies <br />
                        <span className="text-orange-500">You Will Learn</span>
                    </h2>
                    {/* Swipe instruction removed */}
                </div>

                <div className="relative w-full mt-10 px-4 md:px-0">
                    <div className="relative w-[85%] aspect-square flex items-center justify-center mx-auto rounded-[2rem] overflow-hidden">
                        {/* Side Scroll Zones Indication */}
                        <div className="absolute inset-y-0 -left-1 w-4 z-20 pointer-events-none flex items-center justify-center">
                            <div className="h-16 w-1 bg-slate-200/50 rounded-full blur-[2px]" />
                        </div>
                        <div className="absolute inset-y-0 -right-1 w-4 z-20 pointer-events-none flex items-center justify-center">
                            <div className="h-16 w-1 bg-slate-200/50 rounded-full blur-[2px]" />
                        </div>

                        <div className="absolute inset-x-0 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none h-16 top-0" />
                        <div className="absolute inset-x-0 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none h-16 bottom-0" />
                        
                        <div className="w-full h-full">
                          <Suspense fallback={null}>
                            <Canvas dpr={[1, 2]} style={{ touchAction: 'pan-y' }}>
                                <PerspectiveCamera makeDefault position={[0, 0, 16]} />
                                <ambientLight intensity={2} />
                                <pointLight position={[10, 10, 10]} intensity={1.5} />
                                <MobileTechGlobe />
                                <OrbitControls 
                                  enableZoom={false} 
                                  autoRotate={true}
                                  enablePan={false}
                                  rotateSpeed={2.5}
                                  enableDamping={true}
                                  dampingFactor={0.02}
                                  enableRotate={true}
                                />
                            </Canvas>
                          </Suspense>
                        </div>
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

            <div className="relative mb-20 w-full">

                
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
