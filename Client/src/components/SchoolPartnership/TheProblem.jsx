const TheProblem = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-red-500/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            The Problem
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
            Schools teach concepts.
            <br />
            <span className="text-orange-500">We teach students to build real things.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            AI, Machine Learning, Cybersecurity, Web Development, IoT. These technologies are reshaping every industry on the planet — yet most schools in India still run a curriculum designed 20 years ago, completely skipping the skills that actually matter today.
          </p>
          <p className="text-lg md:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mt-4 font-medium">
            thinkskool fills that gap. We don't lecture. We make students build real technology — functional apps, AI models, smart hardware — with guidance from engineers who do this for a living.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional School Card */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-4xl">📚</div>
              <h3 className="text-2xl font-bold text-slate-900">Traditional School</h3>
            </div>
            <ul className="space-y-5">
              {[
                'Outdated syllabus',
                'Theory-only approach',
                'No real-world projects',
                'No industry exposure'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With thinkskool Card */}
          <div className="relative bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200 rounded-3xl p-8 md:p-10 shadow-xl shadow-blue-500/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="text-4xl">🚀</div>
              <h3 className="text-2xl font-bold text-slate-900">With thinkskool</h3>
            </div>
            <ul className="space-y-5 relative z-10">
              {[
                'Industry-current tech skills',
                '100% hands-on building',
                'Real projects every month',
                'Mentored by engineers'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium text-lg">{item}</span>
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
