const NationalHackathon = () => {
  const features = [
    'Schools from across India compete',
    'Real-world problem solving',
    'Certificates valued in admissions',
    'Judged by senior engineers'
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.05] rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/[0.1] rounded-full blur-[120px]"></div>
        {/* Animated stars */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Label */}
          <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
            Exclusive Access
          </span>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            National Inter-School
            <br />
            <span className="text-orange-400">Hackathon</span>
          </h2>

          {/* Body */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12">
            Every student enrolled in the full program gets exclusive access to a 48-hour national-level competition between schools across India. Students solve real-world problems, collaborate across domains, and compete for recognition that carries genuine weight on college applications.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white hover:bg-slate-100 text-blue-600 font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Register Your School →
          </button>
        </div>
      </div>
    </section>
  );
};

export default NationalHackathon;
