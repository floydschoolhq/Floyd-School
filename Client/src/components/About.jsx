/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-24 relative overflow-hidden" id="about">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className='text-5xl md:text-7xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500'
        >
          We Bridge The Gap.
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
                <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-blue-500/10">
                  <FaSchool className="text-5xl text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">For Schools</h3>
                {/* ThinkSkool Description */}
                <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
                  <span className="text-blue-400 font-bold">Think</span><span className="text-yellow-400 font-bold">Skool</span> is a school-integrated STEM education program designed to makeduling conflicts. We handle the tech.
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
                <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-orange-500/10">
                  <FaUserGraduate className="text-5xl text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">For Students</h3>
                <p className="text-slate-400 text-lg">
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