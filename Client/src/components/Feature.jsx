/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaLaptopCode, FaChalkboardTeacher, FaGamepad } from 'react-icons/fa';
import { GlowingCard } from './ui/GlowingCard';

// --- Visual Components ---

const OldWayVisual = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 p-12 text-center shadow-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 mx-auto md:mx-0">
          <FaBook size={40} />
        </div>
        <h3 className="text-3xl font-black text-slate-400 mb-4 font-['Outfit'] text-left">Passive Memorization</h3>
        <p className="text-slate-400 font-medium text-left leading-relaxed">Traditional methods focus on static content delivery, where students consumes information without active participation or real-world feedback loops.</p>
      </div>
      <div className="flex-1 bg-slate-50 rounded-[2rem] p-8 grayscale opacity-60">
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-full w-full"></div>
          <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
          <div className="h-24 bg-slate-200 rounded-2xl w-full mt-6"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const NewWayVisual = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-4xl mx-auto bg-white rounded-[3rem] border-2 border-[#F5AFAF]/20 p-12 text-center shadow-[0_40px_80px_-20px_rgba(245,175,175,0.2)] relative overflow-hidden group font-['Inter']"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F5AFAF] to-[#F5AFAF]"></div>
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 text-left">
        <div className="w-20 h-20 bg-[#FBEFEF] rounded-2xl flex items-center justify-center text-[#F5AFAF] mb-6 shadow-lg shadow-[#F5AFAF]/20">
          <FaLaptopCode size={40} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4 font-['Outfit']">Interactive Mastery</h3>
        <p className="text-slate-600 font-medium leading-relaxed">The ThinkSkool way integrates live code execution, adaptive AI assessments, and immersive 3D simulations that respond to your input in real-time.</p>
        <div className="mt-8 flex gap-3">
          <span className="px-4 py-2 bg-[#F5AFAF]/10 text-[#F5AFAF] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#F5AFAF]/20">Live Execution</span>
          <span className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Real-time Feedback</span>
        </div>
      </div>
      <div className="flex-1 bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-[#F5AFAF]/20">
        <div className="space-y-4 relative z-10">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
          <div className="flex items-center gap-3">
            <div className="w-1 bg-[#F5AFAF] h-12 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-[#F5AFAF]/30 rounded-full w-full"></div>
              <div className="h-3 bg-white/5 rounded-full w-3/4"></div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-32 bg-[#F5AFAF]/10 rounded-2xl w-full mt-6 border border-[#F5AFAF]/20 flex items-center justify-center"
          >
            <FaGamepad className="text-5xl text-[#F5AFAF] opacity-40" />
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Feature = () => {
  const [activeTab, setActiveTab] = useState('new'); // 'old' | 'new'

  return (
    <section className="py-24 bg-[#FCF8F8]" id="feature-section">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 font-['Outfit'] tracking-tighter">Experience the <span className="text-[#F5AFAF]">Difference</span></h2>

          {/* Switcher */}
          <div className="inline-flex bg-white p-2 rounded-full border border-[#FBEFEF] shadow-lg">
            <button
              onClick={() => setActiveTab('old')}
              className={`px-8 py-3 rounded-full text-base font-black uppercase tracking-widest transition-all duration-300 font-['Outfit'] ${activeTab === 'old'
                ? 'bg-slate-100 text-slate-600 shadow-inner'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              The Old Way
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-8 py-3 rounded-full text-base font-black uppercase tracking-widest transition-all duration-300 font-['Outfit'] ${activeTab === 'new'
                ? 'bg-[#F5AFAF] text-white shadow-[0_10px_20px_-5px_rgba(245,175,175,0.4)]'
                : 'text-slate-400 hover:text-[#F5AFAF]'
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
