/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

const About = () => {
  return (
    <div className="bg-white py-20 relative overflow-hidden" id="about">
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
          <span className="font-bold uppercase tracking-[0.5em] text-[11px] mb-6 block text-blue-600">Our Mission</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
            Training <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500">Excellence.</span>
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
            <GlowingCard containerClassName="rounded-2xl" className="rounded-2xl">
              <div className="h-full flex flex-col items-center text-center p-10 lg:p-14 relative overflow-hidden bg-slate-50 border border-slate-100 shadow-sm rounded-2xl group-hover:bg-white group-hover:shadow-xl group-hover:shadow-blue-500/5 group-hover:border-blue-100 transition-all duration-500">
                {/* Accent Glow */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-3xl group-hover:bg-[#2563EB]/30 transition-colors duration-700" />

                <div className="relative flex items-center justify-center mb-10 h-24 w-24">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <FaSchool className="text-5xl text-slate-400 group-hover:text-blue-400 transition-all drop-shadow-[0_0_15px_rgba(37,99,235,0.4)] relative z-10 group-hover:scale-110 group-hover:rotate-6" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-8 tracking-tight uppercase">School <span className="text-blue-600">Programs</span></h3>

                <p className="text-[12px] text-slate-400 mb-10 leading-relaxed font-medium">
                  We establish professional engineering labs within school campuses to provide students with practical, industry-standard training.
                  <span className="block mt-8 text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px]">Practical Learning.</span>
                </p>

                <div className="mt-auto pt-10 border-t border-slate-100 w-full flex justify-center items-center gap-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Industrial Scale</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 shadow-sm" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Deep Tech</span>
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
            <GlowingCard containerClassName="rounded-2xl" className="rounded-2xl">
              <div className="h-full flex flex-col items-center text-center p-10 lg:p-14 relative overflow-hidden bg-slate-50 border border-slate-100 shadow-sm rounded-2xl group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/5 group-hover:border-indigo-100 transition-all duration-500">
                {/* Accent Glow */}
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-colors duration-700" />

                <div className="relative flex items-center justify-center mb-10 h-24 w-24">
                  <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-150 opacity-100 transition-opacity duration-700" />
                  <FaUserGraduate className="text-5xl text-blue-400 drop-shadow-[0_0_20px_rgba(37,99,235,0.6)] relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-all" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-8 tracking-tight uppercase">Skills for <span className="text-blue-600">Students</span></h3>

                <p className="text-[12px] text-slate-400 mb-10 leading-relaxed font-bold uppercase tracking-widest">
                  Build professional skills with <span className="text-blue-400">Floyd School</span>—a comprehensive learning platform for modern engineering.
                  <span className="block mt-8 text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px]">Practical Projects.</span>
                </p>

                <div className="mt-auto pt-10 border-t border-slate-100 w-full flex justify-center items-center gap-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Future Proof</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20 shadow-sm" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Career Growth</span>
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

