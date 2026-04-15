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

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Our Pedagogy
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            The Four-Stage Learning Model
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Every thinkskool program follows the same proven framework — from curiosity to creation.
          </p>
        </div>

        {/* Stages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="relative group"
            >
              {/* Connector Line */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-1/2"></div>
              )}
              
              <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
                  {stage.number}
                </div>
                
                <div className="pt-4">
                  <div className="text-5xl mb-4">{stage.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {stage.description}
                  </p>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Goal</div>
                    <div className="text-sm font-bold text-blue-600">{stage.goal}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Arrow */}
        <div className="flex lg:hidden justify-center mt-8 gap-4">
          {stages.map((_, idx) => (
            <div key={idx} className="w-2 h-2 rounded-full bg-blue-300"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourStageLearning;
