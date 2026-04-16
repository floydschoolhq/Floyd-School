const WhyPartnerWithUs = () => {
  const reasons = [
    {
      icon: '🎯',
      title: 'No Cost to Evaluate',
      description: 'Experience our pedagogy first-hand with a 7-day free bootcamp. No risk, no commitment needed to start. See real results before any decision.'
    },
    {
      icon: '⚙️',
      title: 'Complete Management',
      description: 'We handle staff, scheduling, content, and all technical requirements. Your current teachers focus entirely on their core subjects — zero disruption.'
    },
    {
      icon: '📈',
      title: 'Measurable Outcomes',
      description: 'Clear progress reporting, tangible student portfolios, and visible project outcomes that parents can see and appreciate. No guesswork.'
    }
  ];

  const mobileReasons = [
    {
      icon: '🎯',
      title: 'No Risk Start',
      description: '7-day free demo before commitment'
    },
    {
      icon: '⚙️',
      title: 'Complete Management',
      description: 'We handle mentors, content, and operations'
    },
    {
      icon: '📈',
      title: 'Real Outcomes',
      description: 'Projects, progress tracking, and visible results'
    }
  ];

  return (
    <section id="why-us" className="py-24 px-4 sm:px-6 lg:px-12 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 left-[-10%] w-[400px] h-[400px] bg-orange-500/[0.08] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-10">
          <span className="inline-block px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Why Partner With Us
          </span>
          <h2 className="text-2xl font-black text-white leading-tight mb-3">
            A Smart Upgrade for Your Institution
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            We connect school learning with real industry skills.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Why Partner With Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Three Reasons Schools Choose
            <br />
            <span className="text-blue-400">thinkskool.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            We bridge the gap between traditional schooling and industry reality.
          </p>
        </div>

        {/* Reasons Cards - Mobile */}
        <div className="md:hidden grid grid-cols-1 gap-4 max-w-md mx-auto">
          {mobileReasons.map((reason, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl flex-shrink-0">{reason.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1">{reason.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reasons Cards - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-2xl p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${idx === 0 ? 'from-blue-500/20 to-cyan-500/20' : idx === 1 ? 'from-purple-500/20 to-pink-500/20' : 'from-orange-500/20 to-red-500/20'} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6">{reason.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{reason.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPartnerWithUs;
