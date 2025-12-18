/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaLaptopCode, FaChalkboardTeacher, FaGamepad } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

// --- Visual Components ---

const OldWayVisual = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="w-full h-[400px] bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-8 text-center grayscale opacity-70"
  >
    <FaBook className="text-8xl text-slate-500 mb-6" />
    <h3 className="text-2xl font-bold text-slate-400 mb-2">Passive Learning</h3>
    <p className="text-slate-500">Static textbooks, theory memorization, and zero interaction.</p>
  </motion.div>
);

const NewWayVisual = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="w-full h-[400px] relative"
  >
    <GlowingCard>
      <div className="h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Floating Icons Background */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 text-[#fca96d]/20 text-6xl"
        >
          <FaGamepad />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 text-blue-500/20 text-6xl"
        >
          <FaLaptopCode />
        </motion.div>

        <FaLaptopCode className="text-8xl text-[#FF8C00] mb-6 relative z-10" />
        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Interactive Labs</h3>
        <p className="text-blue-200 relative z-10">Live code execution, 3D simulations, and gamified progress.</p>
      </div>
    </GlowingCard>
  </motion.div>
);

const Feature = () => {
  const [activeTab, setActiveTab] = useState('new'); // 'old' | 'new'

  return (
    <section className="py-24 bg-slate-950" id="feature-section">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Experience the Difference</h2>

          {/* Switcher */}
          <div className="inline-flex bg-slate-900 p-2 rounded-full border border-slate-800">
            <button
              onClick={() => setActiveTab('old')}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${activeTab === 'old'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              The Old Way
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${activeTab === 'new'
                  ? 'bg-[#FF8C00] text-white shadow-[0_0_20px_rgba(255,140,0,0.5)]'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              ThinkSkool Way
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'old' ? (
              <OldWayVisual key="old" />
            ) : (
              <NewWayVisual key="new" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Feature;
