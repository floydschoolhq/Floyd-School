const NationalHackathon = () => {
  const features = [
    'Schools from across India compete',
    'Real-world problem solving',
    'Certificates valued in admissions',
    'Judged by senior engineers'
  ];

  const mobileHighlights = [
    'Real-world problem solving',
    'Collaborate in teams',
    'Recognized certificates',
    'Evaluated by industry experts'
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-[120px] -ml-[300px] -mt-[300px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px] -mr-[250px] -mb-[250px]"></div>
        {/* Animated stars */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header - Mobile */}
          <div className="md:hidden mb-10">
            <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Exclusive Access
            </span>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3">
              National Inter-School Hackathon
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Students compete with peers across India by building real-world technology solutions.
            </p>
          </div>

          {/* Section Header - Desktop */}
          <div className="hidden md:block mb-12">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              National Hackathon
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
              48 Hours. Schools Across India.
              <br />
              <span className="text-blue-600">One Champion.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Every student enrolled in the full program gets exclusive access to a 48-hour national-level competition between schools across India. Students solve real-world problems, collaborate across domains, and compete for recognition that carries genuine weight on college applications.
            </p>
          </div>

          {/* Highlights - Mobile */}
          <div className="md:hidden mb-10">
            <h3 className="text-base font-bold text-slate-900 mb-4">Highlights</h3>
            <div className="grid grid-cols-2 gap-3">
              {mobileHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-700 font-medium text-xs">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features - Desktop */}
          <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-200 rounded-xl p-4"
              >
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-slate-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg text-sm"
            >
              Register Your School
            </button>
          </div>

          {/* CTA - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-xl"
            >
              Register Your School
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NationalHackathon;
