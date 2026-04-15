const SchoolBenefits = () => {
  const benefits = [
    { 
      title: "School Recognition", 
      desc: "Position your school as a leader in future-tech education within your region.",
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    },
    { 
      title: "Industry Professionals", 
      desc: "Students learn from active engineers who bring real-world context into classroom.",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0m0-2v2m0 16V5m0 16H9m3 0h3"
    },
    { 
      title: "Admin Dashboard", 
      desc: "Complete visibility into attendance, grades, and student progress.",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    },
    { 
      title: "Session Recordings", 
      desc: "Every live session recorded for students to revisit and master at their pace.",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    },
    { 
      title: "Custom Curriculum", 
      desc: "Learning paths tailored to align with your school's schedule and goals.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    },
    { 
      title: "Zero Management", 
      desc: "We provide trainers, content, and framework. You provide the space.",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    },
  ];

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-4 block">
            What You Get
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            What Your School Gets
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            We handle everything from curriculum design to delivery. You get the credit for preparing students for the future.
          </p>
        </div>

        {/* Mobile: List Layout */}
        <div className="lg:hidden space-y-6">
          {benefits.map((item, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-blue-900/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-50/90 mb-3 tracking-tight uppercase">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop: Elegant List Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 gap-x-16 gap-y-12">
            {benefits.map((item, idx) => (
              <div key={idx} className="group flex items-start gap-6 py-4 border-b border-white/5 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-600/5 flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-blue-600/10 transition-all duration-300">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolBenefits;
