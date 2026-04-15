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
      
      {/* Desktop Heading */}
      <div className="hidden lg:block w-full px-8 mb-16 relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tighter text-slate-900 text-center">
          Practical skills, <span className="text-blue-600">verified projects</span> & national level recognition.
        </h2>
      </div>

      {/* Mobile Heading */}
      <div className="lg:hidden max-w-[1600px] mx-auto px-4 relative z-10">
        <div className="w-full px-6 mb-12 relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tighter text-slate-900 text-center">
            Practical skills, <span className="text-blue-600">verified projects</span> & national level recognition.
          </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-2">
          {benefits.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-[85vw] max-w-[300px] snap-center">
              <div className="bg-white rounded-2xl p-6 h-full min-h-[220px] shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight uppercase">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: 3D Interactive Cards */}
      <div className="hidden lg:block max-w-6xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-3 gap-8">
          {benefits.map((item, idx) => (
            <div key={idx} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight uppercase leading-none group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentBenefits;
