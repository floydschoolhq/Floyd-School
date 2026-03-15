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
import ScrollStack, { ScrollStackItem } from './common/ScrollStack';
import useIsMobile from '../hooks/useIsMobile';

const colorMap = {
  blue: 'hover:border-slate-200/40',
  emerald: 'hover:border-slate-200/40',
  purple: 'hover:border-slate-200/40',
  orange: 'hover:border-slate-200/40',
  cyan: 'hover:border-slate-200/40',
  amber: 'hover:border-slate-200/40'
};

const iconColorMap = {
  blue: 'text-indigo-600 bg-white shadow-xl',
  emerald: 'text-emerald-600 bg-white shadow-xl',
  purple: 'text-violet-600 bg-white shadow-xl',
  orange: 'text-amber-600 bg-white shadow-xl',
  cyan: 'text-sky-600 bg-white shadow-xl',
  amber: 'text-slate-600 bg-white shadow-xl'
};

const accentColorMap = {
  blue: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-violet-400',
  orange: 'bg-amber-500',
  cyan: 'bg-sky-400',
  amber: 'bg-orange-500'
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
    <ScrollStackItem itemClassName="!bg-transparent !shadow-none !m-0 !rounded-none overflow-visible">
      <motion.div
        style={!isMobile ? {
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
          transform: "translateZ(0)"
        } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative p-10 md:p-14 rounded-[3rem] border border-slate-100 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.02)] transition-all duration-700 cursor-default overflow-hidden ${colorMap[feature.color]}`}
      >
        {/* Animated Scanning Line */}
        <motion.div 
          initial={isMobile ? {} : { top: "-100%" }}
          whileHover={!isMobile ? { top: "100%" } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent z-20 pointer-events-none"
        />

        {/* HUD Decoration */}
        <div className="absolute top-8 left-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] pointer-events-none opacity-40">
          LEARNING_ENGINE // 0{index + 1}
        </div>

        {/* Dash/Grid Background Layer */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr_1.2fr] items-center gap-12 relative z-10" style={{ transform: "translateZ(60px)" }}>
          {/* Left Panel: Capabilities */}
          <div className="hidden lg:flex flex-col gap-6 relative">
            {feature.capabilities?.map((cap, i) => (
              <div key={i} className="flex items-center gap-4 group/cap">
                <span className="text-[12px] font-bold text-slate-400 tracking-tight transition-colors">#{cap}</span>
              </div>
            ))}
          </div>

          {/* Center Area: Primary Content */}
          <div className="flex flex-col items-center justify-center text-center relative">
            {/* Icon Area */}
            <div className="mb-10 relative">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center border border-slate-50 transition-all duration-700 group-hover:scale-110 ${iconColorMap[feature.color]}`}
              >
                {React.cloneElement(feature.icon, { size: 40, strokeWidth: 1.2 })}
              </motion.div>
            </div>
            
            {/* Text Content */}
            <div className="max-w-md mx-auto relative">
              <h3 className="text-3xl font-bold mb-4 tracking-tight text-slate-900 leading-tight uppercase">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 text-[15px] leading-relaxed mb-8 font-medium">
                {feature.description}
              </p>
              
              <div className="flex items-center justify-center gap-3 text-slate-800">
                <Sparkles size={16} className="text-slate-400" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {feature.detail}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Metrics */}
          <div className="hidden lg:flex flex-col gap-10 items-end text-right relative">
            {feature.metrics?.map((metric, i) => (
              <div key={i} className="group/metric">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-slate-800 tracking-tighter mb-2">{metric.value}</p>
                <div className="w-24 h-1 bg-slate-50 rounded-full overflow-hidden ml-auto">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%', transition: { delay: i * 0.2, duration: 1.5 } }}
                        className={`h-full ${accentColorMap[feature.color]} opacity-20`}
                    />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </ScrollStackItem>
  );
});

const allFeatures = [
  {
    icon: <PlayCircle />,
    title: 'HD Video Content',
    description: 'Crystal clear video lessons with expert instructors and adaptive streaming for all devices.',
    detail: 'Stream in 4K adaptive quality',
    color: 'blue',
    capabilities: ['4K Ultra HD', 'Adaptive Streaming', 'Offline Mode'],
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Latency', value: '20ms' }
    ]
  },
  {
    icon: <Code />,
    title: 'Integrated Editor',
    description: 'Practice coding directly in the browser with real-time feedback and cloud sync.',
    detail: 'Supports 20+ languages',
    color: 'emerald',
    capabilities: ['VSC Engine', 'Git Integration', 'IntelliSense'],
    metrics: [
      { label: 'Compile', value: 'Instant' },
      { label: 'Cloud Save', value: 'Sync' }
    ]
  },
  {
    icon: <Brain />,
    title: 'AI-Powered Quizzes',
    description: 'Adaptive assessments that adjust to your learning pace and map knowledge gaps.',
    detail: 'Personalized knowledge gaps',
    color: 'purple',
    capabilities: ['NLP Analysis', 'Dynamic Levels', 'Instant Review'],
    metrics: [
      { label: 'Accuracy', value: 'AI-Audit' },
      { label: 'Adaptive', value: '1:1' }
    ]
  },
  {
    icon: <Sparkles />,
    title: 'Master 23+ AI Tools',
    description: 'Master generative AI and prompt engineering workflows for modern industrial standards.',
    detail: 'Tailored AI solutions',
    color: 'orange',
    capabilities: ['GPT-4 Access', 'Midjourney Lab', 'Prompt Library'],
    metrics: [
      { label: 'Tools', value: '23+' },
      { label: 'Industrial', value: 'V.2.0' }
    ]
  },
  {
    icon: <Users />,
    title: 'Expert Support',
    description: 'Get help whenever you need it from our dedicated 24/7 technical staff.',
    detail: '15 min response time',
    color: 'cyan',
    capabilities: ['Live Chat', 'Ticket System', 'Code Review'],
    metrics: [
      { label: 'SLA', value: '15 MIN' },
      { label: 'Rating', value: '5.0' }
    ]
  },
  {
    icon: <MessageSquare />,
    title: '1:1 Doubt Session',
    description: 'Get personalized one-on-one guidance from industry veterans to audit your projects.',
    detail: 'Tailored tech solutions',
    color: 'amber',
    capabilities: ['Direct AMA', 'Project Audit', 'Resume Review'],
    metrics: [
      { label: 'Expertise', value: 'Senior' },
      { label: 'Sessions', value: 'Unlimited' }
    ]
  },
];

const InteractiveFeatures = ({ isFeaturesExpanded }) => {
  const isMobile = useIsMobile();
  return (
    <section id="how-it-works" className="py-16 md:py-32 bg-white text-slate-900 relative overflow-hidden">
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
              className="text-center mb-12"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 font-sans">Experience the future</h2>
              <ScrollDarkenHeading sizeClass="text-4xl md:text-6xl">
                Interactive Learning & Support
              </ScrollDarkenHeading>
            </motion.div>

            {isMobile ? (
              <div className="flex flex-col items-center gap-8">
                {allFeatures.map((feature, index) => (
                  <FeatureCard 
                    key={index} 
                    feature={feature} 
                    index={index} 
                  />
                ))}
              </div>
            ) : (
              <ScrollStack 
                key={isFeaturesExpanded ? 'v2-expanded' : 'v2-collapsed'}
                useWindowScroll={true} 
                itemDistance={280} 
                itemStackDistance={10}
                stackPosition="12%"
                baseScale={0.94}
                itemScale={0.015}
                className="!overflow-visible !h-auto mt-6"
              >
                {allFeatures.map((feature, index) => (
                  <FeatureCard 
                    key={index} 
                    feature={feature} 
                    index={index} 
                  />
                ))}
              </ScrollStack>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;
