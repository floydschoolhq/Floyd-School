import React from 'react';
import { motion } from 'framer-motion';

// Technology & Skill Focus Logos
const ReactLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-cyan-500">React</span></span>;
const NodeLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-green-600">Node.js</span></span>;
const PythonLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-blue-500">Python</span></span>;
const AIMLLogo = () => <span className="text-2xl font-black text-slate-500 flex items-center gap-1"><span className="text-purple-600">AI/ML</span></span>;
const CloudLogo = () => <span className="text-2xl font-black text-slate-500 flex items-center gap-1"><span className="text-[#2563EB]">Cloud</span></span>;
const WebDevLogo = () => <span className="text-2xl font-black text-slate-500 flex items-center gap-1"><span className="text-blue-600">Web Dev</span></span>;
const MobileLogo = () => <span className="text-2xl font-black text-slate-500 flex items-center gap-1"><span className="text-emerald-500">Mobile</span></span>;

const logos = [
  { id: 1, component: ReactLogo },
  { id: 2, component: NodeLogo },
  { id: 3, component: PythonLogo },
  { id: 4, component: AIMLLogo },
  { id: 5, component: CloudLogo },
  { id: 6, component: WebDevLogo },
  { id: 7, component: MobileLogo },
];

const Marque = () => {
  return (
    <div className="w-full bg-[#FCF8F8] py-10 border-b border-[#FBEFEF] relative z-10">
      <div className="text-center mb-6">
        <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[9px] opacity-60">Technologies We Master</p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FCF8F8] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FCF8F8] to-transparent z-10"></div>

        <motion.div
          className="flex gap-20 min-w-max items-center"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {[...logos, ...logos, ...logos, ...logos].map((LogoItem, index) => (
            <div key={index} className="opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-110 cursor-pointer">
              <LogoItem.component />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marque;
