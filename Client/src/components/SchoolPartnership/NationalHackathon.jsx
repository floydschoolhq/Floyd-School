import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Target, Award, Users, ChevronRight, Zap } from 'lucide-react';

const NationalHackathon = () => {
  const features = [
    {
      title: 'Global Competition',
      highlight: 'Schools from across India compete',
      icon: <Globe className="w-6 h-6" />,
      desc: 'Students face off against the brightest minds from top institutions nationwide.'
    },
    {
      title: 'Industry Challenges',
      highlight: 'Real-world problem solving',
      icon: <Target className="w-6 h-6" />,
      desc: 'Solve actual problems sourced from industry leaders and tech pioneers.'
    },
    {
      title: 'Elite Recognition',
      highlight: 'Certificates valued in admissions',
      icon: <Award className="w-6 h-6" />,
      desc: 'Earn credentials that carry weight on college applications and resumes.'
    },
    {
      title: 'Expert Feedback',
      highlight: 'Judged by senior engineers',
      icon: <Users className="w-6 h-6" />,
      desc: 'Get direct evaluation and mentorship from veterans at top-tier tech firms.'
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#fafafc] relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Header Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-full mb-20 px-0"
        >
          <h2 className="text-4xl md:text-5xl lg:text-[60px] font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
            48 Hours. Schools Across India. <br />
            <span className="text-blue-600">One Champion.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Exclusive 48-hour national competition where students solve real-world industry problems, collaborate across domains, and compete for elite recognition.
          </p>
        </motion.div>

        {/* Feature Cards: Gapless Sleek Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 px-4 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div style={{ perspective: '1200px' }} className="h-full">
                <motion.div
                  style={{
                    transform: 'translate3d(0px, 0px, -50px) rotateX(10deg) scale(1)',
                    borderRadius: '40px',
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)', 
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: `
                      0 0 40px rgba(0, 0, 0, 0.2),
                      0 50px 70px -20px rgba(0, 0, 0, 0.4),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.05)
                    `,
                    transformStyle: 'preserve-3d'
                  }}
                  whileHover={{
                    transform: 'translate3d(0px, -10px, 20px) rotateX(0deg) scale(1.02)',
                    background: 'linear-gradient(145deg, rgba(30, 58, 138, 1) 0%, rgba(15, 23, 42, 1) 100%)', // Subtle Indigo/Blue shift on hover
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    boxShadow: `
                      0 30px 60px rgba(0, 0, 0, 0.6),
                      0 0 40px rgba(59, 130, 246, 0.1)
                    `,
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="p-10 relative flex flex-col items-center justify-center text-center h-full min-h-[440px] cursor-pointer group"
                >
                  <div className="relative z-10 w-full flex flex-col items-center" style={{ transform: 'translateZ(50px)' }}>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500 transform group-hover:-translate-y-2">
                      {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
                    </div>
                    
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-xl font-bold text-white mb-4 leading-tight">
                      {feature.highlight}
                    </p>
                    
                    <p className="text-slate-400 text-base leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                  
                  {/* Minimalist Bottom Shimmer Line */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action: Moved to Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 px-12 py-6 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-[0_20px_50px_-20px_rgba(249,115,22,0.4)]"
          >
            Register Your School
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default NationalHackathon;
