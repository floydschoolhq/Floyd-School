/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-24 relative overflow-hidden font-['Inter']" id="about">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#fca96d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 tracking-tighter font-['Outfit']"
        >
          Engineering Excellence.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: For Schools */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlowingCard>
              <div className="h-full flex flex-col items-center text-center p-8">
                <div className="w-24 h-24 bg-slate-900/5 rounded-full flex items-center justify-center mb-6 ring-4 ring-slate-900/5">
                  <FaSchool className="text-5xl text-slate-900" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 font-['Outfit']">For Schools</h3>
                {/* ThinkSkool Description */}
                <p className="text-lg text-slate-500 mb-6 leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
                  <span className="text-slate-900 font-black">think</span><span className="text-[#fca96d] font-black">skool</span> is a school-integrated STEM education program designed to eliminate scheduling conflicts. We handle the tech.
                </p>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Card 2: For Students */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <GlowingCard>
              <div className="h-full flex flex-col items-center text-center p-8">
                <div className="w-24 h-24 bg-[#fca96d]/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-[#fca96d]/10">
                  <FaUserGraduate className="text-5xl text-[#fca96d]" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 font-['Outfit']">For Students</h3>
                <p className="text-slate-500 text-lg">
                  Future-ready skills in AI, Robotics, and Coding. Building creators, not just consumers.
                </p>
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
