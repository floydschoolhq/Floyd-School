const StudentBenefits = () => {
  const benefits = [
    { 
      title: "REAL WORLD PROJECTS", 
      desc: "Students build portfolio-ready projects that demonstrate practical skills to future employers."
    },
    { 
      title: "INDUSTRY CERTIFICATES", 
      desc: "Earn recognized certificates upon completion that boost academic and career credentials."
    },
    { 
      title: "MENTORSHIP PROGRAM", 
      desc: "Direct guidance from industry professionals who share insights and career pathways."
    },
    { 
      title: "NATIONAL COMPETITIONS", 
      desc: "Participate in hackathons and tech competitions with students from across the country."
    },
    { 
      title: "CAREER READINESS", 
      desc: "Develop technical and soft skills essential for success in modern tech careers."
    },
    { 
      title: "KNOWLEDGE REPOSITORIES", 
      desc: "Long-term learning retention. Comprehensive archives of every live session are maintained for permanent student access and ongoing reference."
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white pt-24 pb-24 w-full relative overflow-hidden">
      {/* Decorative 3D elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Desktop Heading */}
        <div className="hidden lg:block text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tighter text-slate-900">
            Practical skills, <span className="text-blue-600">verified projects</span> & national level recognition.
          </h2>
        </div>

        {/* Mobile Heading */}
        <div className="lg:hidden text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tighter text-slate-900">
            Practical skills, <span className="text-blue-600">verified projects</span> & national level recognition.
          </h2>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden flex overflow-x-auto gap-4 pb-6 snap-x px-4">
          {benefits.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-[90vw] max-w-[340px] snap-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden min-h-[180px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-orange-500/5 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight uppercase leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => (
            <div key={idx} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200 transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-orange-500/5 rounded-full blur-3xl group-hover:blur-2xl transition-all"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight uppercase leading-none group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentBenefits;
