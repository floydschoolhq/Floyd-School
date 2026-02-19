/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

const About = () => {
  return (
    <div className="min-h-screen bg-[#FCF8F8] py-32 relative overflow-hidden" id="about">
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-center mb-24"
        >
          <span className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">ThinkSkool Philosophy</span>
          <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 tracking-tighter leading-none">
            Engineering <br className="hidden md:block" /> Excellence.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Card 1: For Schools */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="group"
          >
            <GlowingCard containerClassName="rounded-[3.5rem]" className="rounded-[3rem]">
              <div className="h-full flex flex-col items-center text-center p-10 lg:p-16 relative overflow-hidden">
                {/* Accent Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl group-hover:bg-[#2563EB]/10 transition-colors duration-700" />

                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 backdrop-blur-md flex items-center justify-center mb-10 border border-white/10 shadow-3xl transition-all duration-700 group-hover:rotate-6 group-hover:scale-110">
                  <FaSchool className="text-6xl text-slate-100 opacity-80 group-hover:opacity-100 group-hover:text-[#2563EB] transition-all" />
                </div>

                <h3 className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-tight">In-School <span className="text-[#2563EB]">Bootcamps</span></h3>

                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                  We bring elite engineering talent to your campus for intensive, hands-on learning sprints that align with your institutional goals.
                  <span className="block mt-6 text-[#2563EB] font-black uppercase tracking-[0.2em] text-[11px]">OFFLINE TECHNICAL DEEP DIVES.</span>
                </p>

                <div className="mt-auto pt-10 border-t border-white/5 w-full flex justify-center items-center gap-6">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Industrial Grade</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Frictionless</span>
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
            <GlowingCard containerClassName="rounded-[3.5rem]" className="rounded-[3rem]">
              <div className="h-full flex flex-col items-center text-center p-10 lg:p-16 relative overflow-hidden">
                {/* Accent Glow */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl group-hover:bg-[#2563EB]/10 transition-colors duration-700" />

                <div className="w-32 h-32 rounded-[2.5rem] bg-[#2563EB]/10 backdrop-blur-md flex items-center justify-center mb-10 border border-[#2563EB]/20 shadow-3xl transition-all duration-700 group-hover:-rotate-6 group-hover:scale-110">
                  <FaUserGraduate className="text-6xl text-[#2563EB] drop-shadow-[0_0_15px_rgba(245,175,175,0.4)]" />
                </div>

                <h3 className="text-4xl lg:text-5xl font-black text-slate-100 mb-8 tracking-tight">Independent <span className="text-[#2563EB]">Quest</span></h3>

                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                  Forge professional skills in AI, Robotics, and Architecture via ThinkSkool Pulse—our world-class online learning ecosystem.
                  <span className="block mt-6 text-[#2563EB] font-black uppercase tracking-[0.2em] text-[11px]">ONLINE PRODUCTION MASTERY.</span>
                </p>

                <div className="mt-auto pt-10 border-t border-white/5 w-full flex justify-center items-center gap-6">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Future Ready</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mastery First</span>
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
