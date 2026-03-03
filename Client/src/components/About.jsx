/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

const About = () => {
  return (
    <div className="bg-slate-950 py-20 relative overflow-hidden" id="about">
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2563EB]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-center mb-20"
        >
          <span className="font-bold uppercase tracking-[0.5em] text-[11px] mb-6 block text-blue-400">Thinkskool Philosophy</span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
            Engineering <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Excellence.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card 1: For Schools */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="group"
          >
            <GlowingCard containerClassName="rounded-[3rem]" className="rounded-[2.5rem]">
              <div className="h-full flex flex-col items-center text-center p-10 lg:p-14 relative overflow-hidden bg-slate-900/50 backdrop-blur-3xl border border-white/10 shadow-3xl rounded-[2.5rem]">
                {/* Accent Glow */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-3xl group-hover:bg-[#2563EB]/30 transition-colors duration-700" />

                <div className="relative flex items-center justify-center mb-10 h-24 w-24">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <FaSchool className="text-5xl text-slate-400 group-hover:text-blue-400 transition-all drop-shadow-[0_0_15px_rgba(37,99,235,0.4)] relative z-10 group-hover:scale-110 group-hover:rotate-6" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-black text-white mb-8 tracking-tight uppercase">Institutional <span className="text-blue-400">Legacy</span></h3>

                <p className="text-[12px] text-slate-400 mb-10 leading-relaxed font-medium">
                  We build professional engineering infrastructure within your campus through immersive industrial labs that redefine academic benchmarks.
                  <span className="block mt-8 text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px]">Offline Industrial Integration.</span>
                </p>

                <div className="mt-auto pt-10 border-t border-white/5 w-full flex justify-center items-center gap-8">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Industrial Scale</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Deep Tech</span>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Card 2: For Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="group"
          >
            <GlowingCard containerClassName="rounded-[3rem]" className="rounded-[2.5rem]">
              <div className="h-full flex flex-col items-center text-center p-10 lg:p-14 relative overflow-hidden bg-slate-900/50 backdrop-blur-3xl border border-white/10 shadow-3xl rounded-[2.5rem]">
                {/* Accent Glow */}
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-colors duration-700" />

                <div className="relative flex items-center justify-center mb-10 h-24 w-24">
                  <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-150 opacity-100 transition-opacity duration-700" />
                  <FaUserGraduate className="text-5xl text-blue-400 drop-shadow-[0_0_20px_rgba(37,99,235,0.6)] relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-all" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-black text-white mb-8 tracking-tight uppercase">Global <span className="text-blue-400">Mastery</span></h3>

                <p className="text-[12px] text-slate-400 mb-10 leading-relaxed font-bold uppercase tracking-widest">
                  Forge professional supremacy via <span className="text-blue-400">thinkskool</span>—the world's most advanced autonomous learning ecosystem.
                  <span className="block mt-8 text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px]">Hybrid Production Pipelines.</span>
                </p>

                <div className="mt-auto pt-10 border-t border-white/5 w-full flex justify-center items-center gap-8">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Future Proof</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Career X</span>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;

