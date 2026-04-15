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

  return (
    <section id="why-us" className="py-24 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 left-[-10%] w-[400px] h-[400px] bg-orange-500/[0.04] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Why Partner With Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            An Institutional-Grade Solution
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            We bridge the gap between traditional schooling and industry reality.
          </p>
        </div>

        {/* Reasons Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${idx === 0 ? 'from-blue-500/10 to-cyan-500/10' : idx === 1 ? 'from-purple-500/10 to-pink-500/10' : 'from-orange-500/10 to-red-500/10'} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6">{reason.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {reason.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPartnerWithUs;
