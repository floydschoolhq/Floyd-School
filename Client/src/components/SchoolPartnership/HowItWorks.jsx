const HowItWorks = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-orange-500/[0.04] rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            Zero Risk. Maximum Impact.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            We operate in two simple phases. You evaluate us first — for free. Then decide.
          </p>
        </div>

        {/* Two Phases */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Phase 1 */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
            <div className="bg-white border-2 border-green-200 rounded-3xl p-8 md:p-10 shadow-lg shadow-green-500/5 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-wider">
                  FREE
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
                7-Day Demo Bootcamp
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                Our mentors physically come to your school and run a high-energy, hands-on technology bootcamp — at zero cost. Students write real code, build mini-projects, and experience what learning technology actually feels like.
              </p>
              <ul className="space-y-4">
                {[
                  '7 days of live, on-campus sessions',
                  'Hands-on projects from day one',
                  'No commitment, no cost',
                  'Students keep everything they build'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 md:p-10 shadow-lg shadow-blue-500/5 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider">
                  FULL PROGRAM
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
                4-Month Deep Dive Course
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                If the school and students love the bootcamp, we continue with the full program — 2 classes per week, on your campus, with specialized mentors in the chosen domain. Students pay individually, not the school.
              </p>
              <ul className="space-y-4">
                {[
                  '2 live classes per week on campus',
                  'For students in Class 7 to 12',
                  'Real projects built every month',
                  'Certification + National Hackathon access'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex justify-center mt-8 lg:hidden">
          <svg className="w-8 h-8 text-slate-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Desktop Arrow */}
        <div className="hidden lg:flex justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-16 h-16 bg-white rounded-full border-2 border-slate-200 shadow-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
