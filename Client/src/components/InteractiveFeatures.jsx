import React from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Code,
  Brain,
  Users,
  Sparkles,
  Rocket,
  MessageSquare
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const InteractiveFeatures = ({ isFeaturesExpanded }) => {
  const interactiveFeaturesList = [
    {
      icon: <PlayCircle />,
      title: 'HD Video Content',
      description: 'Crystal clear video lessons with expert instructors',
      detail: 'Stream in 4K with adaptive bitrate technology.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Code />,
      title: 'Integrated Code Editor',
      description: 'Practice coding directly in the browser with real-time feedback',
      detail: 'Supports 20+ languages with linting and auto-complete.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Brain />,
      title: 'AI-Powered Quizzes',
      description: 'Adaptive assessments that adjust to your learning pace',
      detail: 'Personalized knowledge gaps identification.',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  const communityFeaturesList = [
    {
      icon: <Sparkles />,
      title: 'Master 23+ AI Tools',
      description: 'Master generative AI and prompt engineering for modern workflows',
      detail: 'Tailored solutions for your specific AI-driven challenges.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Sparkles />,
      title: '24/7 Expert Support',
      description: 'Get help whenever you need it from our technical staff',
      detail: 'Average response time under 15 minutes.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <MessageSquare />,
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
    <section id="how-it-works" className="py-24 bg-white text-slate-900 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Orbs removed for Apple White theme */}
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
              <div className="mb-12">
                <ScrollDarkenHeading sizeClass="text-3xl md:text-5xl">
                  Interactive Learning
                </ScrollDarkenHeading>
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
              <div className="mb-12">
                <ScrollDarkenHeading sizeClass="text-3xl md:text-5xl">
                  Community & Support
                </ScrollDarkenHeading>
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
    whileHover={{ }}
    className="group relative p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-default overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

    <div className="flex items-start gap-8 relative z-10">
      <div className="shrink-0 relative flex items-center justify-center py-2">
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative z-10 text-slate-900 drop-shadow-sm group-hover:scale-125 transition-transform duration-500">
          {React.cloneElement(feature.icon, { size: 32, strokeWidth: 1.5 })}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-slate-900">
          {feature.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-1 font-medium">
          {feature.description}
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {feature.detail}
        </p>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-700" />
  </motion.div>
);

export default InteractiveFeatures;
