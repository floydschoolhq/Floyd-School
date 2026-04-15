import { useNavigate } from 'react-router-dom';

const PartnershipDomains = () => {
  const navigate = useNavigate();

  const domains = [
    {
      number: "01",
      featured: true,
      tag: "FEATURED / MOST REQUESTED",
      title: "Foundations of Web Development",
      desc: "HTML, CSS, JavaScript — from zero to building and deploying a fully functional, responsive website. Students leave with a live, working site they built entirely themselves.",
      duration: "4 Months",
      status: "7-Day Free Trial",
      level: "Beginner Friendly",
      topics: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Deployment"],
      icon: "💻",
      color: "from-blue-600 to-cyan-500"
    },
    {
      number: "02",
      featured: false,
      title: "AI & Machine Learning",
      desc: "Python fundamentals, OpenAI APIs, computer vision, and building a complete AI Face Recognition Attendance System.",
      duration: "3 Months",
      status: "Live Now",
      level: "",
      topics: [],
      icon: "🤖",
      color: "from-purple-600 to-pink-500"
    },
    {
      number: "03",
      featured: false,
      title: "Cybersecurity",
      desc: "Ethical hacking, network protection, digital forensics — learning how systems are attacked and how to defend them.",
      duration: "4 Months",
      status: "7-Day Free Trial",
      level: "",
      topics: [],
      icon: "🔒",
      color: "from-green-600 to-emerald-500"
    },
    {
      number: "04",
      featured: false,
      title: "IoT & Robotics",
      desc: "Integrating software with hardware — sensors, microcontrollers, and building smart automated devices from scratch.",
      duration: "4 Months",
      status: "7-Day Free Trial",
      level: "",
      topics: [],
      icon: "🔧",
      color: "from-orange-600 to-red-500"
    },
    {
      number: "+",
      featured: false,
      title: "Custom Curriculum",
      desc: "Need something different? We design a bespoke tech track that aligns perfectly with your school's specific pedagogy and goals.",
      duration: "",
      status: "",
      level: "",
      topics: [],
      isCustom: true,
      icon: "✨",
      color: "from-slate-600 to-blue-500"
    }
  ];

  return (
    <section id="domains" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-orange-500/[0.04] rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 block">
            Technology Domains
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Five Domains. Or One Built For Your School.
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Choose from expert-designed tracks or let us create a custom program tailored to your institution.
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden flex overflow-x-auto gap-4 pb-4 snap-x px-2">
          {domains.map((domain, idx) => (
            <div key={idx} className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center">
              <div className={`bg-white border-2 ${domain.featured ? 'border-orange-300 shadow-lg shadow-orange-500/10' : 'border-slate-200'} rounded-2xl p-6 h-full relative`}>
                {domain.featured && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    🔥 {domain.tag}
                  </div>
                )}
                <div className="text-4xl mb-4">{domain.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{domain.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{domain.desc}</p>
                {domain.duration && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{domain.duration}</span>
                    {domain.status && <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{domain.status}</span>}
                    {domain.level && <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{domain.level}</span>}
                  </div>
                )}
                {domain.isCustom && (
                  <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    Design Your Program →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((domain, idx) => (
            <div 
              key={idx} 
              className={`group relative bg-white border-2 ${domain.featured ? 'border-orange-300 shadow-xl shadow-orange-500/10' : 'border-slate-200 hover:border-blue-300'} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${domain.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {domain.featured && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  🔥 {domain.tag}
                </div>
              )}
              
              <div className="relative z-10">
                <div className="text-5xl mb-6">{domain.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {domain.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">{domain.desc}</p>
                
                {domain.duration && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{domain.duration}</span>
                    {domain.status && <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">{domain.status}</span>}
                    {domain.level && <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{domain.level}</span>}
                  </div>
                )}
                
                {domain.topics && domain.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {domain.topics.map((topic, tIdx) => (
                      <span key={tIdx} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{topic}</span>
                    ))}
                  </div>
                )}
                
                {domain.isCustom && (
                  <button 
                    onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Design Your Program
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnershipDomains;
