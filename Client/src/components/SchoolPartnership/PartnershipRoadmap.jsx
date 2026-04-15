const PartnershipRoadmap = () => {
  const roadmapSteps = [
    {
      number: "01",
      title: "Demo Bootcamp",
      subtitle: "Week 1",
      description: "A 7-day high-energy intro for all students to find their spark. Hands-on, exciting, and completely free."
    },
    {
      number: "02",
      title: "Domain Selection",
      subtitle: "Week 2",
      description: "Guided counseling to pick the technology path that fits their talent and interest. No wrong choices — only right starts."
    },
    {
      number: "03",
      title: "Full Program",
      subtitle: "4 Months",
      description: "Deep-dive technical training on campus with specialized mentors. 2 classes per week, real projects every month, assignments, quizzes, and continuous progress tracking."
    },
    {
      number: "04",
      title: "National Hackathon",
      subtitle: "Capstone",
      description: "Students build and showcase products in a 48-hour nationwide inter-school competition. Real judges, real stakes, real recognition."
    },
    {
      number: "05",
      title: "Certification",
      subtitle: "Graduation",
      description: "Official thinkskool Certificate of Completion — awarded for demonstrated skills and completed projects, not just attendance. Carries weight on college applications."
    }
  ];

  return (
    <section id="roadmap" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 block">
            Program Roadmap
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Your Journey From Discovery to Certification
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Designed for maximum impact and learning — every step has a purpose.
          </p>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {roadmapSteps.map((step, idx) => (
            <div key={idx} className="relative pl-8">
              <div className="absolute left-0 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {step.number}
              </div>
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {step.subtitle}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Circular Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-blue-400 transform -translate-x-1/2"></div>
            
            <div className="space-y-0">
              {roadmapSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 pr-8">
                    <div className={`text-right ${idx % 2 === 0 ? '' : 'text-left'}`}>
                      <div className="inline-block bg-white border-2 border-slate-200 rounded-2xl p-6 max-w-md shadow-lg hover:border-blue-400 transition-colors">
                        <div className="flex items-center gap-3 mb-3 justify-end">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {step.subtitle}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                        </div>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-lg shadow-blue-600/30 text-white text-sm font-bold">
                    {step.number}
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipRoadmap;
