import React from 'react';
import { motion } from 'framer-motion';

// Technology & Skill Focus Logos
const ReactLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-cyan-500">React</span></span>;
const NodeLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-green-600">Node.js</span></span>;
const PythonLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-blue-500">Python</span></span>;
const AIMLLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-purple-600">AI/ML</span></span>;
const CloudLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-[#fca96d]">Cloud</span></span>;
const WebDevLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-blue-600">Web Dev</span></span>;
const MobileLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-green-500">Mobile</span></span>;

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
    <div className="w-full bg-white py-12 border-b border-slate-100">
      <div className="text-center mb-8">
        <p className="text-slate-500 font-semibold tracking-wide uppercase text-sm">Technologies We Master</p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        <motion.div
          className="flex gap-16 min-w-max items-center"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...logos, ...logos, ...logos, ...logos].map((LogoItem, index) => (
            <div key={index} className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer">
              <LogoItem.component />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marque;
