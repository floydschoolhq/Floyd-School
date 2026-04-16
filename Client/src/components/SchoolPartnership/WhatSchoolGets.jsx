const WhatSchoolGets = () => {
  const features = [
    {
      icon: '👨‍💻',
      title: 'Industry Mentors',
      description: 'Students learn from active engineers and AI specialists who bring real-world context into every class — not just textbook theory.'
    },
    {
      icon: '📊',
      title: 'Admin Dashboard',
      description: 'Principals and management get complete visibility — attendance, grades, project completion, and every student\'s performance in real time.'
    },
    {
      icon: '📝',
      title: 'Assignments & Quizzes',
      description: 'Structured assignments and quizzes after every module ensure students retain concepts and build skills progressively.'
    },
    {
      icon: '💬',
      title: 'Live Doubt Support',
      description: 'Doubts solved in-class in real time by the mentor. Between sessions, students use the AI-powered doubt chatbot — they\'re never stuck.'
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Parent Visibility',
      description: 'Parents see their child\'s progress dashboard — completed work, upcoming sessions, project milestones, and performance reports.'
    },
    {
      icon: '🎥',
      title: 'Session Recordings',
      description: 'Every live session is recorded and accessible. Students rewatch classes at their pace, ensuring nothing is ever missed.'
    },
    {
      icon: '🏆',
      title: 'School Recognition',
      description: 'Position your school as a leader in future-tech education within your region. Parents notice schools that invest in tomorrow\'s skills.'
    },
    {
      icon: '✨',
      title: 'Zero Management',
      description: 'We provide trainers, content, scheduling, and the entire framework. Your school provides the space. Your teachers stay focused on their subjects.'
    }
  ];

  const mobileFeatures = [
    {
      icon: '👨‍💻',
      title: 'Industry Mentors',
      desc: 'Learn from real engineers & AI experts'
    },
    {
      icon: '📊',
      title: 'Admin Dashboard',
      desc: 'Track attendance & student progress'
    },
    {
      icon: '📝',
      title: 'Assignments & Quizzes',
      desc: 'Structured skill development'
    },
    {
      icon: '💬',
      title: 'Live Doubt Support',
      desc: 'Mentor + AI doubt solving'
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Parent Access',
      desc: 'Parents track student progress'
    },
    {
      icon: '🎥',
      title: 'Session Recordings',
      desc: 'Rewatch classes anytime'
    },
    {
      icon: '🏆',
      title: 'School Recognition',
      desc: 'Position as future-ready institution'
    },
    {
      icon: '✨',
      title: 'Zero Management',
      desc: 'We manage training & operations'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-[-5%] w-[600px] h-[600px] bg-blue-500/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-[-5%] w-[500px] h-[500px] bg-orange-500/[0.08] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-10">
          <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            What Your School Gets
          </span>
          <h2 className="text-3xl font-black text-white leading-tight mb-4">
            Complete Tech Partnership
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            We handle training, content, and support — your school provides the space.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            What Your School Gets
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            A Partnership That Delivers
            <br />
            <span className="text-blue-400">Real Value, Not Just Talk.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            From first session to final certification — we handle every operational detail.
          </p>
        </div>

        {/* Mobile Features List */}
        <div className="md:hidden max-w-md mx-auto space-y-3">
          {mobileFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-gradient-to-r from-[#0f0f0f] to-[#141414] border border-white/10 rounded-xl p-3.5 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white mb-0.5 truncate">{feature.title}</h3>
                <p className="text-sm text-slate-400 truncate">{feature.desc}</p>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${idx % 2 === 0 ? 'from-blue-500/20 to-cyan-500/20' : 'from-orange-500/20 to-red-500/20'} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatSchoolGets;
