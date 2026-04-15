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
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-[-5%] w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-[-5%] w-[500px] h-[500px] bg-orange-500/[0.04] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            What Your School Gets
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            A Complete Technology Education Partnership
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            From first session to final certification — we handle every operational detail.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${idx % 2 === 0 ? 'from-blue-500/10 to-cyan-500/10' : 'from-orange-500/10 to-red-500/10'} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
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
