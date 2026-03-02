import React from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Code,
  Brain,
  Users,
  Zap,
  Trophy,
  Sparkles,
  Rocket,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

const InteractiveFeatures = ({ isFeaturesExpanded }) => {
  const PRIMARY_BLUE = '#2563EB';

  const interactiveFeaturesList = [
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'HD Video Content',
      description: 'Crystal clear video lessons with expert instructors',
      detail: 'Stream in 4K with adaptive bitrate technology.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Integrated Code Editor',
      description: 'Practice coding directly in the browser with real-time feedback',
      detail: 'Supports 20+ languages with linting and auto-complete.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Quizzes',
      description: 'Adaptive assessments that adjust to your learning pace',
      detail: 'Personalized knowledge gaps identification.',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  const communityFeaturesList = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Master & Upskill AI',
      description: 'Master generative AI and prompt engineering for modern workflows',
      detail: 'Tailored solutions for your specific AI-driven challenges.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '24/7 Expert Support',
      description: 'Get help whenever you need it from our technical staff',
      detail: 'Average response time under 15 minutes.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: '1:1 Doubt Session',
      description: 'Get personalized one-on-one guidance from industry mentors',
      detail: 'Tailored solutions for your specific technical challenges.',
      color: 'from-yellow-400 to-orange-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="how-it-works" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isFeaturesExpanded ? 1 : 0,
            height: isFeaturesExpanded ? 'auto' : 0
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

            {/* Interactive Learning Section */}
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <Rocket className="text-blue-500 w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                  Interactive <span className="text-blue-600">Learning</span>
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isFeaturesExpanded ? "visible" : "hidden"}
                className="space-y-6"
              >
                {interactiveFeaturesList.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </motion.div>
            </div>

            {/* Community & Support Section */}
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <Users className="text-indigo-500 w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                  Community <span className="text-indigo-600">& Support</span>
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isFeaturesExpanded ? "visible" : "hidden"}
                className="space-y-6"
              >
                {communityFeaturesList.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden"
  >
    {/* Gradient decoration */}
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

    <div className="flex items-start gap-6 relative z-10">
      <div className={`shrink-0 p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
        {feature.icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
          {feature.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-1">
          {feature.description}
        </p>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {feature.detail}
        </p>
      </div>
    </div>

    {/* Subtle bottom border animation */}
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-700" />
  </motion.div>
);

export default InteractiveFeatures;


