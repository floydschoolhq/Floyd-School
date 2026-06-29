import { CardContainer, CardBody, CardItem } from "../ui/3d-card";

const TheProblem = () => {
  return (
    <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-red-500/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-8 px-4">
          <span className="inline-block px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
            The Problem
          </span>
          <h2 className="text-[1.5rem] sm:text-2xl font-black text-white leading-[1.2] mb-3 max-w-3xl mx-auto">
            Schools teach concepts.
            <br />
            <span className="text-orange-400">We teach students to build real things.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mx-auto leading-relaxed mb-2 text-balance">
            AI, ML, and IoT reshape industries—yet schools use 20-year-old curricula, skipping today's essential tech skills.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium text-balance">
            Floyd School fills the gap, swapping lectures for building real apps, AI, and hardware guided by professional engineers.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-red-500/10 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-4xl mx-auto">
            Schools teach concepts.
            <br />
            <span className="text-orange-400">We teach students to build real things.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed text-balance">
            AI, ML, and IoT reshape industries—yet schools use 20-year-old curricula, skipping today's essential tech skills.
          </p>
          <p className="text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed mt-2 font-medium text-balance">
            Floyd School fills the gap, swapping lectures for building real apps, AI, and hardware guided by professional engineers.
          </p>
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="md:hidden space-y-4 max-w-md mx-auto">
          {/* Traditional Learning */}
          <CardContainer className="w-full">
            <CardBody className="relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-2xl p-5 w-full h-auto">
              <CardItem translateZ="50" className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-white">Traditional Learning</h3>
              </CardItem>
              <CardItem translateZ="60" as="ul" className="space-y-3">
                {[
                  'Outdated syllabus',
                  'Mostly theory',
                  'No real projects',
                  'Limited exposure'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium text-sm">{item}</span>
                  </li>
                ))}
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* VS Divider */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-black text-slate-500 tracking-widest uppercase">vs</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* With Floyd School */}
          <CardContainer className="w-full">
            <CardBody className="relative bg-gradient-to-br from-blue-900/20 to-orange-900/20 border-2 border-blue-500/30 rounded-2xl p-5 shadow-lg shadow-blue-500/10 w-full h-auto">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-full blur-2xl" />
              <CardItem translateZ="50" className="flex items-center gap-4 mb-4 relative z-10">
                <h3 className="text-lg font-bold text-white">With Floyd School</h3>
              </CardItem>
              <CardItem translateZ="60" as="ul" className="space-y-3 relative z-10">
                {[
                  'Industry-current tech skills',
                  '100% hands-on building',
                  'Real projects every month',
                  'Mentored by engineers'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium text-sm">{item}</span>
                  </li>
                ))}
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Comparison Cards - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional School Card */}
          <CardContainer className="w-full">
            <CardBody className="relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-2 border-white/10 rounded-3xl p-6 md:p-8 w-full h-auto">
              <CardItem translateZ="50" className="flex items-center gap-5 mb-4">
                <h3 className="text-xl font-bold text-white">Traditional School</h3>
              </CardItem>
              <CardItem translateZ="100" as="ul" className="space-y-3">
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
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* With Floyd School Card */}
          <CardContainer className="w-full">
            <CardBody className="relative bg-gradient-to-br from-blue-900/20 to-orange-900/20 border-2 border-blue-500/30 rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-500/10 w-full h-auto">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
              <CardItem translateZ="50" className="flex items-center gap-5 mb-4 relative z-10">
                <h3 className="text-xl font-bold text-white">With Floyd School</h3>
              </CardItem>
              <CardItem translateZ="100" as="ul" className="space-y-3 relative z-10">
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
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
