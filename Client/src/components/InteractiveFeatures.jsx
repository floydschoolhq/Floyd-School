import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  Code,
  Brain,
  Users,
  Sparkles,
  MessageSquare,
  Zap,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';
import useIsMobile from '../hooks/useIsMobile';

const colorMap = {
  orange: 'bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 border-white/10 hover:from-[#1a1a1a] hover:to-[#151515]/95 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20',
  amber: 'bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 border-white/10 hover:from-[#1a1a1a] hover:to-[#151515]/95 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/20',
  warm: 'bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 border-white/10 hover:from-[#1a1a1a] hover:to-[#151515]/95 hover:border-orange-600/50 hover:shadow-xl hover:shadow-orange-600/20',
  coral: 'bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 border-white/10 hover:from-[#1a1a1a] hover:to-[#151515]/95 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/20',
  sunset: 'bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 border-white/10 hover:from-[#1a1a1a] hover:to-[#151515]/95 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/20',
  gold: 'bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 border-white/10 hover:from-[#1a1a1a] hover:to-[#151515]/95 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/20'
};

const iconColorMap = {
  orange: 'text-white bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80 border-white/10 shadow-lg shadow-black/20 group-hover:text-orange-400 group-hover:shadow-orange-500/30',
  amber: 'text-white bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80 border-white/10 shadow-lg shadow-black/20 group-hover:text-amber-400 group-hover:shadow-amber-500/30',
  warm: 'text-white bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80 border-white/10 shadow-lg shadow-black/20 group-hover:text-orange-300 group-hover:shadow-orange-600/30',
  coral: 'text-white bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80 border-white/10 shadow-lg shadow-black/20 group-hover:text-rose-400 group-hover:shadow-rose-500/30',
  sunset: 'text-white bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80 border-white/10 shadow-lg shadow-black/20 group-hover:text-pink-400 group-hover:shadow-pink-500/30',
  gold: 'text-white bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80 border-white/10 shadow-lg shadow-black/20 group-hover:text-yellow-400 group-hover:shadow-yellow-500/30'
};

const accentColorMap = {
  orange: 'text-orange-400',
  amber: 'text-amber-400',
  warm: 'text-orange-300',
  coral: 'text-rose-400',
  sunset: 'text-pink-400',
  gold: 'text-yellow-400'
};

const FeatureCard = React.memo(({ feature, index }) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const sectionRef = useRef(null);
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
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    controls.start({
      background: [
        "linear-gradient(45deg, transparent 30%, rgba(251, 146, 60, 0.1) 50%, transparent 70%)",
        "linear-gradient(45deg, transparent 40%, rgba(251, 146, 60, 0.2) 60%, transparent 80%)",
        "linear-gradient(45deg, transparent 30%, rgba(251, 146, 60, 0.1) 50%, transparent 70%)"
      ],
      transition: { duration: 2, repeat: Infinity }
    });
  };

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        rotateX: 0,
        rotateY: 0,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: !isHovered ? rotateX : 0,
        rotateY: !isHovered ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-8 rounded-3xl border transition-all duration-700 cursor-default flex flex-col h-full items-start text-left backdrop-blur-sm ${colorMap[feature.color]}`}
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={controls}
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(251, 146, 60, 0.05) 50%, transparent 100%)"
        }}
      />

      {/* Floating Particles */}
      <AnimatePresence>
        {isHovered && !isMobile && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -30 - (i * 15)],
                  x: [0, (Math.random() - 0.5) * 40]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2 + i * 0.3, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                className="absolute w-1 h-1 bg-orange-400/40 rounded-full"
                style={{
                  top: `${20 + i * 25}%`,
                  left: `${10 + i * 30}%`
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Decorative Corner */}
      <motion.div 
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 0.15, rotate: 0 }}
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="absolute top-0 right-0 p-4"
      >
        <Sparkles size={40} className="text-white/20" />
      </motion.div>

      {/* Enhanced Scanning Lines */}
      <motion.div 
        initial={isMobile ? {} : { top: "-100%" }}
        whileHover={!isMobile ? { 
          top: "100%",
          transition: { duration: 1.5, ease: "easeInOut" }
        } : {}}
        transition={isMobile ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"
      />
      <motion.div 
        initial={isMobile ? {} : { left: "-100%" }}
        whileHover={!isMobile ? { 
          left: "100%",
          transition: { duration: 2, ease: "easeInOut" }
        } : {}}
        transition={isMobile ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent z-20 pointer-events-none"
      />

      {/* Subtle HUD Decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
        className="absolute top-4 right-6 text-[8px] font-bold text-white/50 uppercase tracking-[0.2em] pointer-events-none"
      >
        LF_SYS // 0{index + 1}
      </motion.div>

      {/* Pulse Ring Effect */}
      <motion.div 
        className="absolute inset-0 rounded-3xl border border-orange-500/30 pointer-events-none"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: index * 0.5,
          ease: "easeOut"
        }}
      />

      {/* Dash/Grid Background Layer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.02 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] rounded-3xl" 
      />

      <div className="relative z-10 flex flex-col items-start flex-1 w-full font-sans">
        {/* Icon Area - Flattened & Refined */}
        <div className="mb-8 relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 transition-all duration-700 group-hover:scale-110 group-hover:shadow-xl ${iconColorMap[feature.color]}`}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {React.cloneElement(feature.icon, { size: 24, strokeWidth: 2 })}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col flex-1">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            whileHover={{ x: 5 }}
            className="text-2xl font-bold mb-4 tracking-tight text-white leading-tight"
          >
            {feature.title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
            className="text-white/80 text-[16px] leading-relaxed mb-6 font-medium"
          >
            {feature.description}
          </motion.p>
        </div>

        {/* Footer Detail - Clean Version */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
          className="w-full pt-6 border-t border-white/5 flex items-center justify-between"
        >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.8, duration: 0.5 }}
              className="flex items-center gap-2"
            >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  whileHover={{ scale: 1.2, rotate: 180 }}
                >
                  <Sparkles size={14} className={accentColorMap[feature.color]} />
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.9, duration: 0.3 }}
                  className="text-[13px] font-bold text-white/60 uppercase tracking-widest"
                >
                  {feature.detail}
                </motion.span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1, rotate: 45 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shadow-md border border-white/10"
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight size={14} className="text-white/80" />
              </motion.div>
            </motion.div>
        </motion.div>
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
    color: 'orange',
    capabilities: ['4K Ultra HD', 'Adaptive Streaming', 'Offline Mode']
  },
  {
    icon: <Code />,
    title: 'Integrated Editor',
    description: 'Practice coding directly in the browser with real-time feedback and cloud sync.',
    detail: 'Supports 20+ languages',
    color: 'amber',
    capabilities: ['VSC Engine', 'Git Integration', 'IntelliSense']
  },
  {
    icon: <Brain />,
    title: 'AI-Powered Quizzes',
    description: 'Adaptive assessments that adjust to your learning pace and map knowledge gaps.',
    detail: 'Personalized knowledge mapping',
    color: 'warm',
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
    color: 'sunset',
    capabilities: ['Live Chat', 'Ticket System', 'Code Review']
  },
  {
    icon: <MessageSquare />,
    title: '1:1 Doubt Session',
    description: 'Get personalized one-on-one guidance from industry veterans to audit your projects.',
    detail: 'Tailored tech solutions',
    color: 'gold',
    capabilities: ['Direct AMA', 'Project Audit', 'Resume Review']
  },
];

const InteractiveFeatures = ({ isFeaturesExpanded }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <section id="how-it-works" className="py-8 bg-[#050505] text-white relative overflow-hidden">
        <div className="max-w-95% mx-auto px-2 relative z-10">
          <div className="flex flex-col">
            {/* Header - Mobile */}
            <div className="text-center mb-6">
              <h2 className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2 font-sans">Experience the future</h2>
              <h3 className="text-lg font-black text-white leading-tight">
                Interactive Learning & Support
              </h3>
            </div>

            {/* Features Grid - Mobile Horizontal Scrolling */}
            <div className="mb-8">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                {allFeatures.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-64" 
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="p-2.5 rounded-lg border border-white/10 bg-gradient-to-br from-[#151515]/95 to-[#0a0a0a]/90 h-full">
                      {/* Icon */}
                      <div className="mb-1.5">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#151515]/80">
                          {React.cloneElement(feature.icon, { size: 12, strokeWidth: 2 })}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h4 className="text-xs font-bold text-white mb-1">
                        {feature.title}
                      </h4>
                      
                      <p className="text-white/60 text-[10px] leading-relaxed mb-1.5">
                        {feature.description}
                      </p>

                      {/* Footer */}
                      <div className="pt-1.5 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <Sparkles size={6} className="text-orange-400" />
                          <span className="text-[6px] font-bold text-white/60 uppercase">
                            {feature.detail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#050505] text-white relative overflow-hidden">
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
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/50 mb-6 font-sans">Experience the future</h2>
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
