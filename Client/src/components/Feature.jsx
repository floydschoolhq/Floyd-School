/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaLaptopCode, FaChalkboardTeacher, FaGamepad } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

// --- Visual Components ---

const thinkSkoolMedia = [
  { type: 'image', url: '/images/interactive/lab_1.jpg', tags: ["Modern Labs", "Hands-on Tech"] },
  { type: 'image', url: '/images/interactive/lab_2.jpg', tags: ["Expert Mentorship", "Skill Building"] },
  { type: 'image', url: '/images/interactive/lab_3.jpg', tags: ["Studio Learning", "Interactive IDE"] },
  { type: 'image', url: '/images/interactive/lab_4.jpg', tags: ["Team Collaboration", "Real Projects"] },
  { type: 'video', url: '/grok-video-0e958d78-170d-42d9-a50e-06942a955b6c.mp4', tags: ["Live Training", "Deep Mastery"] }
];

const traditionalMedia = [
  { type: 'image', url: '/images/passive/govt_school_1.png', tags: ["Passive Reading", "Traditional Setup"] },
  { type: 'image', url: '/images/passive/govt_school_2.png', tags: ["Static Context", "Lecturing Mode"] },
  { type: 'image', url: '/images/passive/govt_school_3.png', tags: ["Fragmented Loops", "Limited Interaction"] }
];

const MediaSlideshow = ({ media, title, subtitle, isTraditional }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [media.length]);

  const currentMedia = media[currentIndex];

  return (
    <div className={`flex flex-col bg-white rounded-[2rem] p-4 lg:p-5 border ${isTraditional ? 'border-slate-100 grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100' : 'border-[#2563EB]/20 shadow-[0_15px_30px_-10px_rgba(37,99,235,0.08)]'} transition-all duration-700 h-full`}>
      <div className="mb-4 text-left">
        <span className={`inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${isTraditional ? 'bg-slate-50 text-slate-400 border border-slate-100' : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/10'}`}>
          {subtitle}
        </span>
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-none">
          {title.split(' ')[0]} <span className={isTraditional ? 'text-slate-300' : 'text-[#2563EB]'}>{title.split(' ').slice(1).join(' ')}</span>
        </h3>
      </div>

      <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl group/media">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={currentMedia.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent ${isTraditional ? 'mix-blend-overlay' : ''}`} />
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-6 left-8 right-8 z-10">
          <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
              className={`h-full ${isTraditional ? 'bg-slate-400' : 'bg-[#2563EB]'}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap min-h-[32px]">
        {currentMedia.tags?.map((tag, i) => (
          <span key={i} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border ${isTraditional ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-[#FBEFEF] text-[#2563EB] border-[#F9DFDF]'}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Feature = () => {
  return (
    <section className="py-10 bg-[#FFF9FA] relative overflow-hidden" id="feature-section">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2563EB_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1050px] mx-auto px-6">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-white border border-[#FBEFEF] shadow-sm mb-4"
          >
            <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.4em]">Simultaneous Comparison</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight leading-none">
            Experience the <span className="text-[#2563EB]">Difference</span>
          </h2>
          <p className="text-slate-500 font-semibold text-sm max-w-xl mx-auto">Witness the transition from passive absorbing to active creation in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MediaSlideshow
              media={traditionalMedia}
              subtitle="Traditional Model"
              title="Passive Consumption"
              isTraditional={true}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MediaSlideshow
              media={thinkSkoolMedia}
              subtitle={<><span className="text-blue-600">ThinkSkool</span> Path</>}
              title="Interactive Mastery"
              isTraditional={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Feature;

