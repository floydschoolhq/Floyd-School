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

import useIsMobile from '../hooks/useIsMobile';

const Marque = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full bg-white py-12 px-6 border-b border-slate-50 relative z-10 overflow-hidden">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">
            Professional Stacks
          </div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            Technologies <span className="text-blue-600">We Teach.</span>
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-y-10 gap-x-4 opacity-40">
          {techLogos.map((tech, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center grayscale">
              <div className="mb-2">{tech.node}</div>
              {tech.title && !["Full Stack", "Cybersecurity"].includes(tech.title) && (
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">{tech.title}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
            <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-3">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white" />
                    ))}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">+12 More Industry Stacks</span>
            </div>
        </div>
      </div>
    );
  }

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

