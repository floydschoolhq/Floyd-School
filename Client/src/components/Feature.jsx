/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaLaptopCode, FaChalkboardTeacher, FaGamepad } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

// --- Visual Components ---

const thinkSkoolMedia = [
  { type: 'image', url: '/download (1).jpg', tags: ["Live IDE", "Industrial Coding"] },
  { type: 'image', url: '/download (2).jpg', tags: ["3D Simulations", "Visual Logic"] },
  { type: 'image', url: '/download (3).jpg', tags: ["AI Benchmarks", "Adaptive Learning"] },
  { type: 'image', url: '/download (4).jpg', tags: ["Expert Mentorship", "Direct Access"] },
  { type: 'image', url: '/download (5).jpg', tags: ["Production Apps", "Portfolio Build"] },
  { type: 'video', url: '/grok-video-0e958d78-170d-42d9-a50e-06942a955b6c.mp4', tags: ["Interactive Demo", "Real-time Ops"] }
];

const traditionalMedia = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', tags: ["Passive Reading"] },
  { type: 'image', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', tags: ["Static Context"] },
  { type: 'image', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', tags: ["Fragmented Loops"] }
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
    <div className={`flex flex-col bg-white rounded-[3.5rem] p-8 lg:p-12 border ${isTraditional ? 'border-slate-100 grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100' : 'border-[#2563EB]/20 shadow-[0_40px_80px_-20px_rgba(245,175,175,0.15)]'} transition-all duration-700 h-full`}>
      <div className="mb-10 text-left">
        <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-['Outfit'] ${isTraditional ? 'bg-slate-50 text-slate-400 border border-slate-100' : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/10'}`}>
          {subtitle}
        </span>
        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight leading-none">
          {title.split(' ')[0]} <span className={isTraditional ? 'text-slate-300' : 'text-[#2563EB]'}>{title.split(' ').slice(1).join(' ')}</span>
        </h3>
      </div>

      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl group/media">
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

      <div className="mt-8 flex gap-2 flex-wrap min-h-[32px]">
        {currentMedia.tags?.map((tag, i) => (
          <span key={i} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border font-['Outfit'] ${isTraditional ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-[#FBEFEF] text-[#2563EB] border-[#F9DFDF]'}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Feature = () => {
  return (
    <section className="py-32 bg-[#FCF8F8] relative overflow-hidden" id="feature-section">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2563EB_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-white border border-[#FBEFEF] shadow-sm mb-6"
          >
            <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.4em] font-['Outfit']">Simultaneous Comparison</span>
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 font-['Outfit'] tracking-tighter leading-none">
            Experience the <span className="text-[#2563EB]">Difference</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Witness the transition from passive absorbing to active creation in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
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
              subtitle="ThinkSkool Path"
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
