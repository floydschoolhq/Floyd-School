const FourStageLearning = () => {
  const stages = [
    {
      number: '01',
      icon: '🔍',
      title: 'Discover',
      description: 'Understand the big picture. How do these technologies work and why do they matter?',
      goal: 'Build curiosity & context'
    },
    {
      number: '02',
      icon: '📖',
      title: 'Learn',
      description: 'Go deep into core skills, tools and logic through exercises students actually do.',
      goal: 'Master core skills'
    },
    {
      number: '03',
      icon: '🛠️',
      title: 'Build',
      description: 'Build a complete working project from start to finish with mentor guidance.',
      goal: 'Ship a real project'
    },
    {
      number: '04',
      icon: '🚀',
      title: 'Launch',
      description: 'Present work, earn certification, leave with something real and portfolio-worthy.',
      goal: 'Graduate as a builder'
    }
  ];

  const mobileStages = [
    {
      title: 'Discover',
      description: 'Understand concepts & real-world use'
    },
    {
      title: 'Learn',
      description: 'Develop core technical skills'
    },
    {
      title: 'Build',
      description: 'Create real working projects'
    },
    {
      title: 'Launch',
      description: 'Present project & earn certificate'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-orange-500/[0.08] rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-10">
          <span className="inline-block px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Our Pedagogy
          </span>
          <h2 className="text-2xl font-black text-white leading-tight mb-3">
            4-Step Learning Model
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From understanding to real project creation.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Four-Stage Learning Model
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            From Curiosity to
            <br />
            <span className="text-purple-400">Confidence in Four Steps.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Every Floyd School program follows the same proven framework — from curiosity to creation.
          </p>
        </div>

        {/* Stages Grid - Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          {mobileStages.map((stage, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-xl p-5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute -top-3 left-5 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-500/30">
                0{idx + 1}
              </div>
              <div className="pt-3">
                <h3 className="text-lg font-bold text-white mb-3">{stage.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stages Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="relative group"
            >
              {/* Connector Line */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-1/2"></div>
              )}
              
              <div className="group relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2" h-full>
                <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
                  {stage.number}
                </div>
                
                <div className="pt-4">
                  <div className="text-5xl mb-4">{stage.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{stage.title}</h3>
                  <p className="text-slate-400 text-base leading-relaxed mb-4">
                    {stage.description}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Goal</div>
                    <div className="text-sm font-bold text-purple-400">{stage.goal}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourStageLearning;
