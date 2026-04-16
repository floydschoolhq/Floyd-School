const TheProblem = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-red-500/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-12 px-4">
          <span className="inline-block px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            The Problem
          </span>
          <h2 className="text-[1.75rem] sm:text-2xl font-black text-white leading-[1.2] mb-5 max-w-3xl mx-auto">
            Schools teach concepts.
            <br />
            <span className="text-orange-400">We teach students to build real things.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            AI, Machine Learning, Cybersecurity, Web Development, IoT. These technologies are reshaping every industry — yet most schools in India still run a curriculum designed 20 years ago.
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            thinkskool fills that gap. We make students build real technology — apps, AI models, smart hardware — with guidance from engineers.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            The Problem
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 max-w-4xl mx-auto">
            Schools teach concepts.
            <br />
            <span className="text-orange-400">We teach students to build real things.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            AI, Machine Learning, Cybersecurity, Web Development, IoT. These technologies are reshaping every industry on the planet — yet most schools in India still run a curriculum designed 20 years ago, completely skipping the skills that actually matter today.
          </p>
          <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mt-4 font-medium">
            thinkskool fills that gap. We don't lecture. We make students build real technology — functional apps, AI models, smart hardware — with guidance from engineers who do this for a living.
          </p>
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="md:hidden max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">📚</div>
              <h3 className="text-xl font-bold text-white">Traditional Learning</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Outdated syllabus',
                'Mostly theory',
                'No real projects',
                'Limited exposure'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-slate-300 font-medium text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comparison Cards - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional School Card */}
          <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-4xl">📚</div>
              <h3 className="text-2xl font-bold text-white">Traditional School</h3>
            </div>
            <ul className="space-y-5">
              {[
                'Outdated syllabus',
                'Theory-only approach',
                'No real-world projects',
                'No industry exposure'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-slate-300 font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With thinkskool Card */}
          <div className="relative bg-gradient-to-br from-blue-900/20 to-orange-900/20 border-2 border-blue-500/30 rounded-3xl p-8 md:p-10 shadow-xl shadow-blue-500/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="text-4xl">🚀</div>
              <h3 className="text-2xl font-bold text-white">With thinkskool</h3>
            </div>
            <ul className="space-y-5 relative z-10">
              {[
                'Industry-current tech skills',
                '100% hands-on building',
                'Real projects every month',
                'Mentored by engineers'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
