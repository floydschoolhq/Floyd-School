import React from 'react';
import { motion } from 'framer-motion';

// Simple SVG Logos for the ticker
const GoogleLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-blue-500">G</span>oogle</span>;
const MicrosoftLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-red-500">M</span>icrosoft</span>;
const AmazonLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1">amazon</span>;
const AdobeLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-red-500">A</span>dobe</span>;
const SamsungLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-blue-800">SAMSUNG</span></span>;
const WalmartLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1"><span className="text-blue-500">Walmart</span></span>;
const UberLogo = () => <span className="text-2xl font-bold text-slate-500 flex items-center gap-1">Uber</span>;

const logos = [
  { id: 1, component: GoogleLogo },
  { id: 2, component: MicrosoftLogo },
  { id: 3, component: AmazonLogo },
  { id: 4, component: AdobeLogo },
  { id: 5, component: SamsungLogo },
  { id: 6, component: WalmartLogo },
  { id: 7, component: UberLogo },
];

const Marque = () => {
  return (
    <div className="w-full bg-white py-12 border-b border-slate-100">
      <div className="text-center mb-8">
        <p className="text-slate-500 font-semibold tracking-wide uppercase text-sm">Our Alumni Work At</p>
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