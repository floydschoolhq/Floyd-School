import { useState } from 'react';
import { Star, Radio, ArrowRight } from 'lucide-react';

const PartnershipDomains = () => {
  const [filter, setFilter] = useState('live');

  const batches = [
    {
      id: 1,
      title: "Foundation of AI and Machine Learning",
      image: "/images/ai-course.jpg",
      rating: 4.9,
      status: "live",
      duration: "3 month",
      modules: "4 Modules",
      features: ["Live Sessions"],
      featured: true
    },
    {
      id: 2,
      title: "Foundations of Web Development",
      image: "/images/web-course.jpg",
      rating: 4.8,
      status: "live",
      duration: "4 month",
      modules: "5 Modules",
      features: ["Live Sessions", "Project-Based"],
      featured: false
    },
    {
      id: 3,
      title: "Cybersecurity Essentials",
      image: "/images/cyber-course.jpg",
      rating: 4.7,
      status: "coming-soon",
      duration: "4 month",
      modules: "4 Modules",
      features: ["Hands-On Labs"],
      featured: false
    },
    {
      id: 4,
      title: "IoT & Robotics",
      image: "/images/iot-course.jpg",
      rating: 4.9,
      status: "coming-soon",
      duration: "4 month",
      modules: "6 Modules",
      features: ["Hardware Kit Included"],
      featured: false
    }
  ];

  const filteredBatches = batches.filter(batch => batch.status === filter);

  return (
    <section id="domains" className="relative py-20 lg:py-28 overflow-hidden transition-colors duration-500 bg-[#050508]">
      {/* Dotted Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none invert brightness-200"
        style={{
          backgroundImage: 'radial-gradient(rgb(226, 232, 240) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.4
        }}
      />
      
      {/* Glowing Blur Effects */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[100px] -ml-[350px] -mt-[350px] bg-blue-600/8"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[80px] -mr-[300px] -mb-[300px] bg-purple-600/5"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-2 rounded-full border-2 border-blue-500/50 text-blue-400 font-bold text-sm tracking-widest uppercase mb-4 shadow-lg shadow-blue-500/30 bg-blue-500/5">
            Technology Domains
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Five Domains. Or One Built For Your School.
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Choose from expert-designed tracks or let us create a custom program tailored to your institution.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter('live')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              filter === 'live'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setFilter('coming-soon')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              filter === 'coming-soon'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Batches List */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer will-change-transform bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border border-white/10 hover:border-blue-500/50"
            >
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="relative flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative w-full lg:w-[46%] lg:min-h-[280px] overflow-hidden">
                  <img
                    alt={batch.title}
                    className="absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
                    src={batch.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 lg:p-6 flex flex-col items-center text-center justify-center">
                  <h3 className="text-2xl lg:text-[1.75rem] font-black tracking-tight leading-snug mb-4 pb-1 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                    {batch.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                    <span className="font-bold flex items-center gap-1 text-white text-sm">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      {batch.rating} Rating
                    </span>
                    {batch.features.map((feature, idx) => (
                      <span key={idx} className="flex items-center gap-1 font-semibold text-emerald-400 text-sm">
                        <Radio size={14} />
                        {feature}
                      </span>
                    ))}
                    <span className="text-slate-400 text-sm">{batch.duration}</span>
                    <span className="text-slate-400 text-sm">{batch.modules}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <button className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wide hover:scale-105 hover:-translate-y-0.5 transition-all shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-600/30 hover:shadow-blue-500/40">
                      Apply Now
                    </button>
                    <button className="px-4 py-3 rounded-xl font-medium text-xs hover:translate-x-2 transition-all flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/5">
                      View Curriculum
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnershipDomains;
