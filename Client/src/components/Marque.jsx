import React from 'react';
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

const techLogos = [
  { node: <SiReact size={32} className="text-[#61DAFB]" />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs size={32} className="text-[#000000]" />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript size={32} className="text-[#3178C6]" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss size={32} className="text-[#06B6D4]" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiPython size={32} className="text-[#3776AB]" />, title: "Python", href: "https://www.python.org" },
  { node: <SiNodedotjs size={32} className="text-[#339933]" />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiUnity size={32} className="text-[#000000]" />, title: "Unity", href: "https://unity.com" },
  { node: <SiUnrealengine size={32} className="text-[#000000]" />, title: "Unreal Engine", href: "https://www.unrealengine.com" },
  { node: <SiGooglecloud size={32} className="text-[#4285F4]" />, title: "Cloud", href: "https://cloud.google.com" },
  { node: <div className="text-[16px] font-bold text-slate-800 whitespace-nowrap">Cybersecurity</div>, title: "Cybersecurity" },
  { node: <div className="text-[16px] font-bold text-slate-800 whitespace-nowrap">Full Stack</div>, title: "Full Stack" },
  { node: <SiJavascript size={30} className="text-[#F7DF1E]" />, title: "JavaScript", href: "https://javascript.info" },
  { node: <SiFramer size={32} className="text-[#0055FF]" />, title: "Framer", href: "https://www.framer.com" },
];

const Marque = () => {
  return (
    <div className="w-full bg-[#FFF9FA] py-10 border-b border-[#FBEFEF] relative z-10 overflow-hidden">
      <div className="text-center mb-10">
        <p className="text-[#2563EB] font-bold uppercase tracking-[0.4em] text-[10px] opacity-60">Technologies We Master</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <LogoLoop
          logos={techLogos}
          speed={45}
          direction="left"
          logoHeight={45}
          gap={80}
          pauseOnHover={true}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#FFF9FA"
          ariaLabel="Technology stack"
        />
      </div>
    </div>
  );
};

export default Marque;

