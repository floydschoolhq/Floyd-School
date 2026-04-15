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

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-[-5%] w-[600px] h-[600px] bg-blue-500/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-[-5%] w-[500px] h-[500px] bg-orange-500/[0.08] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
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

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {feature.desc}
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
