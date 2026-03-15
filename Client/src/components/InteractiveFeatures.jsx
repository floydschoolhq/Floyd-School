import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  PlayCircle,
  Code,
  Brain,
  Users,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';

const colorMap = {
  blue: 'bg-blue-50/80 border-blue-100/60 hover:bg-blue-100/40 hover:border-blue-300/50',
  emerald: 'bg-emerald-50/80 border-emerald-100/60 hover:bg-emerald-100/40 hover:border-emerald-300/50',
  purple: 'bg-purple-50/80 border-purple-100/60 hover:bg-purple-100/40 hover:border-purple-300/50',
  orange: 'bg-orange-50/80 border-orange-100/60 hover:bg-orange-100/40 hover:border-orange-300/50',
  cyan: 'bg-cyan-50/80 border-cyan-100/60 hover:bg-cyan-100/40 hover:border-cyan-300/50',
  amber: 'bg-amber-50/80 border-amber-100/60 hover:bg-amber-100/40 hover:border-amber-300/50'
};

const iconColorMap = {
  blue: 'text-blue-700 bg-blue-100/50 border-blue-200/50 shadow-sm',
  emerald: 'text-emerald-700 bg-emerald-100/50 border-emerald-200/50 shadow-sm',
  purple: 'text-purple-700 bg-purple-100/50 border-purple-200/50 shadow-sm',
  orange: 'text-orange-700 bg-orange-100/50 border-orange-200/50 shadow-sm',
  cyan: 'text-cyan-700 bg-cyan-100/50 border-cyan-200/50 shadow-sm',
  amber: 'text-amber-700 bg-amber-100/50 border-amber-200/50 shadow-sm'
};

const accentColorMap = {
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  purple: 'text-purple-400',
  orange: 'text-orange-500',
  cyan: 'text-cyan-400',
  amber: 'text-amber-500'
};

const FeatureCard = React.memo(({ feature, index }) => {
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className={`group relative p-8 rounded-3xl border transition-all duration-500 cursor-default flex flex-col h-full items-start text-left ${colorMap[feature.color]}`}
    >
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={40} className="text-slate-400" />
      </div>

      {/* Animated Scanning Line */}
      <motion.div 
        initial={isMobile ? {} : { top: "-100%" }}
        whileHover={!isMobile ? { top: "100%" } : {}}
        transition={isMobile ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent z-20 pointer-events-none"
      />

      {/* Subtle HUD Decoration */}
      <div className="absolute top-4 right-6 text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em] pointer-events-none opacity-20">
        LF_SYS // 0{index + 1}
      </div>

      {/* Dash/Grid Background Layer */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex flex-col items-start flex-1 w-full font-sans">
        {/* Icon Area - Flattened & Refined */}
        <div className="mb-8 relative">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 transition-all duration-700 group-hover:scale-110 group-hover:shadow-md ${iconColorMap[feature.color]}`}>
            {React.cloneElement(feature.icon, { size: 24, strokeWidth: 2 })}
          </div>
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col flex-1">
          <h3 className="text-2xl font-bold mb-4 tracking-tight text-slate-900 leading-tight">
            {feature.title}
          </h3>
          
          <p className="text-slate-500 text-[16px] leading-relaxed mb-6 font-medium">
            {feature.description}
          </p>
        </div>

        {/* Footer Detail - Clean Version */}
        <div className="w-full pt-6 border-t border-slate-100/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sparkles size={14} className={accentColorMap[feature.color]} />
                <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{feature.detail}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <PlayCircle size={14} className="text-slate-400" />
            </div>
        </div>
      </div>
    </motion.div>
  );
});

const allFeatures = [
  {
    icon: <PlayCircle />,
    title: 'HD Video Content',
    description: 'Crystal clear video lessons with expert instructors and adaptive streaming for all devices.',
    detail: '4K adaptive quality',
    color: 'blue',
    capabilities: ['4K Ultra HD', 'Adaptive Streaming', 'Offline Mode']
  },
  {
    icon: <Code />,
    title: 'Integrated Editor',
    description: 'Practice coding directly in the browser with real-time feedback and cloud sync.',
    detail: 'Supports 20+ languages',
    color: 'emerald',
    capabilities: ['VSC Engine', 'Git Integration', 'IntelliSense']
  },
  {
    icon: <Brain />,
    title: 'AI-Powered Quizzes',
    description: 'Adaptive assessments that adjust to your learning pace and map knowledge gaps.',
    detail: 'Personalized knowledge mapping',
    color: 'purple',
    capabilities: ['NLP Analysis', 'Dynamic Levels', 'Instant Review']
  },
  {
    icon: <Sparkles />,
    title: 'Master 23+ AI Tools',
    description: 'Master generative AI and prompt engineering workflows for modern industrial standards.',
    detail: 'Tailored AI solutions',
    color: 'orange',
    capabilities: ['GPT-4 Access', 'Midjourney Lab', 'Prompt Library']
  },
  {
    icon: <Users />,
    title: 'Expert Support',
    description: 'Get help whenever you need it from our dedicated 24/7 technical staff.',
    detail: '15 min response time',
    color: 'cyan',
    capabilities: ['Live Chat', 'Ticket System', 'Code Review']
  },
  {
    icon: <MessageSquare />,
    title: '1:1 Doubt Session',
    description: 'Get personalized one-on-one guidance from industry veterans to audit your projects.',
    detail: 'Tailored tech solutions',
    color: 'amber',
    capabilities: ['Direct AMA', 'Project Audit', 'Resume Review']
  },
];

const InteractiveFeatures = ({ isFeaturesExpanded }) => {
  const isMobile = useIsMobile();
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={isMobile ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          animate={{
            opacity: isFeaturesExpanded ? 1 : 0,
            height: isFeaturesExpanded ? 'auto' : 0
          }}
          transition={isMobile ? { duration: 0 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="flex flex-col">
            <motion.div 
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={isFeaturesExpanded ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 font-sans">Experience the future</h2>
              <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl">
                Interactive Learning & Support
              </ScrollDarkenHeading>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                {allFeatures.map((feature, index) => (
                    <FeatureCard 
                        key={index} 
                        feature={feature} 
                        index={index} 
                    />
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;
