/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

const About = () => {
  return (
    <div className="bg-[#0A0F1E] py-40 relative overflow-hidden font-['Outfit']" id="about">
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#2563EB]/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-blue-500/[0.04] rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-center mb-32"
        >
          <span className="text-[#2563EB] font-black uppercase tracking-[0.5em] text-[10px] mb-8 block">ThinkSkool Philosophy</span>
          <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-none uppercase">
            Engineering <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Excellence.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Card 1: For Schools */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="group"
          >
            <GlowingCard containerClassName="rounded-[4rem]" className="rounded-[3.5rem]">
              <div className="h-full flex flex-col items-center text-center p-12 lg:p-20 relative overflow-hidden bg-slate-950/20 backdrop-blur-3xl">
                {/* Accent Glow */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl group-hover:bg-[#2563EB]/20 transition-colors duration-700" />

                <div className="w-40 h-40 rounded-[3rem] bg-white/5 backdrop-blur-3xl flex items-center justify-center mb-12 border border-white/10 shadow-3xl transition-all duration-700 group-hover:rotate-6 group-hover:scale-110">
                  <FaSchool className="text-7xl text-white opacity-40 group-hover:opacity-100 group-hover:text-[#2563EB] transition-all" />
                </div>

                <h3 className="text-4xl lg:text-6xl font-black text-white mb-10 tracking-tighter uppercase font-['Outfit']">Institutional <span className="text-[#2563EB]">Legacy</span></h3>

                <p className="text-base text-slate-500 mb-12 leading-loose font-black uppercase tracking-widest font-['Outfit']">
                  We build professional engineering infrastructure within your campus through immersive industrial labs that redefine academic benchmarks.
                  <span className="block mt-8 text-[#2563EB] font-black uppercase tracking-[0.3em] text-[11px]">OFFLINE INDUSTRIAL INTEGRATION.</span>
                </p>

                <div className="mt-auto pt-12 border-t border-white/5 w-full flex justify-center items-center gap-8">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Industrial Scale</span>
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Deep Tech</span>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Card 2: For Students */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="group"
          >
            <GlowingCard containerClassName="rounded-[4rem]" className="rounded-[3.5rem]">
              <div className="h-full flex flex-col items-center text-center p-12 lg:p-20 relative overflow-hidden bg-slate-950/20 backdrop-blur-3xl">
                {/* Accent Glow */}
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl group-hover:bg-[#2563EB]/20 transition-colors duration-700" />

                <div className="w-40 h-40 rounded-[3rem] bg-[#2563EB]/10 backdrop-blur-3xl flex items-center justify-center mb-12 border border-[#2563EB]/20 shadow-3xl transition-all duration-700 group-hover:-rotate-6 group-hover:scale-110">
                  <FaUserGraduate className="text-7xl text-[#2563EB] drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
                </div>

                <h3 className="text-4xl lg:text-6xl font-black text-white mb-10 tracking-tighter uppercase font-['Outfit']">Global <span className="text-[#2563EB]">Mastery</span></h3>

                <p className="text-base text-slate-500 mb-12 leading-loose font-black uppercase tracking-widest font-['Outfit']">
                  Forge professional supremacy in AI and Robotics via ThinkSkool Pulse—the world's most advanced autonomous learning ecosystem.
                  <span className="block mt-8 text-[#2563EB] font-black uppercase tracking-[0.3em] text-[11px]">HYBRID PRODUCTION PIPELINES.</span>
                </p>

                <div className="mt-auto pt-12 border-t border-white/5 w-full flex justify-center items-center gap-8">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Future Proof</span>
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Career X</span>
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
