import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Tailwind config is assumed to be set up in your project with the same config
// Google Fonts (Manrope, Inter, Material Symbols) should be added to your index.html or global CSS

const SchoolPartnership = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    schoolName: "",
    contactPerson: "",
    designation: "",
    phone: "",
    city: "",
    domain: "AI & Machine Learning",
    students: "",
    requirements: "",
  });

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to home page
  const navigateToHome = () => {
    navigate('/');
  };

  // Scroll to domains section instead of navigating
  const navigateToCourses = () => {
    scrollToSection('domains');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Basic validation
    if (!formData.schoolName || !formData.contactPerson || !formData.phone) {
      alert('Please fill in all required fields (School Name, Contact Person, and Phone Number)');
      return;
    }
    
    // Here you would typically send the data to your backend
    // For now, we'll show a success message
    alert(`Thank you for your partnership request, ${formData.contactPerson}! We will contact you at ${formData.phone} within 24 hours.`);
    
    // Reset form
    setFormData({
      schoolName: "",
      contactPerson: "",
      designation: "",
      phone: "",
      city: "",
      domain: "AI & Machine Learning",
      students: "",
      requirements: "",
    });
  };

  return (
    <div className="bg-slate-950 text-white font-inter selection:bg-blue-500 selection:text-white">

      {/* ── Top Nav ── */}
      <nav className="bg-slate-900/90 backdrop-blur-lg border-b border-blue-900/30 top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <div 
            className="text-2xl font-extrabold tracking-tighter font-bold cursor-pointer hover:opacity-80 transition-colors"
            onClick={navigateToHome}
          >
            <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={navigateToCourses}
              className="text-blue-400 font-bold border-b-2 border-blue-400 pb-1 font-bold tracking-tight hover:text-blue-300 transition-colors cursor-pointer"
            >
              Programs
            </button>
            <button 
              onClick={() => scrollToSection('roadmap')}
              className="text-slate-300 font-medium hover:text-blue-400 transition-colors duration-300 font-bold tracking-tight cursor-pointer"
            >
              Roadmap
            </button>
            <button 
              onClick={() => scrollToSection('domains')}
              className="text-slate-300 font-medium hover:text-blue-400 transition-colors duration-300 font-bold tracking-tight cursor-pointer"
            >
              Domains
            </button>
          </div>
          <button 
            onClick={() => scrollToSection('partner-form')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded shadow-sm hover:opacity-90 transition-opacity font-bold text-sm tracking-wide cursor-pointer"
          >
            Partner With Us
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden pt-20 pb-32 px-8 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <span className="text-blue-400 font-bold text-xs tracking-widest uppercase mb-6 block">
              For Schools and Institutions
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8">
              We come to your school.{" "}
              <span className="text-blue-400">We teach your students.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-xl mb-6 leading-relaxed">
              <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span> delivers live technology education directly on your campus. Our mentors plan, manage and run everything. Your school provides space. Your students get education.
            </p>
            <p className="text-2xl font-bold text-blue-400 mb-10">
              The first 7 days are completely free.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('partner-form')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold tracking-widest uppercase flex items-center gap-3 hover:opacity-90 transition-all cursor-pointer"
              >
                Partner With Us
                <span className="text-lg">→</span>
              </button>
              <button 
                onClick={navigateToCourses}
                className="bg-slate-800 text-blue-400 px-8 py-4 rounded-lg font-bold tracking-widest uppercase border border-blue-500/30 hover:bg-slate-700 transition-all cursor-pointer"
              >
                View Domains
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600/20 to-transparent rounded-full absolute -top-12 -right-12 w-full -z-10 opacity-50" />
            <img
              src="/images/frontview.jpg"
              alt="Students in classroom"
              className="rounded-xl shadow-2xl object-cover aspect-[4/5] w-3/4 mx-auto"
            />
          </div>
        </div>
      </header>

      {/* ── Trust Bar ── */}
      <section className="bg-slate-950 py-12 px-8 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "100+", label: "Students Taught", delay: "0s" },
              { value: "5", label: "Technology Domains", delay: "0.2s" },
              { value: "Live", label: "On Campus Classes", delay: "0.4s", pulse: true },
              { value: "Industry", label: "Designed Curriculum", delay: "0.6s" },
            ].map(({ value, label, delay, pulse }) => (
              <div 
                key={label} 
                className="flex flex-col items-center md:items-start group cursor-default"
                style={{ animationDelay: delay }}
              >
                <div className="relative">
                  <h3 className={`text-4xl font-bold text-blue-400 font-headline mb-1 group-hover:text-blue-300 transition-all duration-500 ${pulse ? 'animate-pulse' : ''}`}>
                    {value}
                  </h3>
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <span className="text-sm font-semibold tracking-wider uppercase text-slate-400 group-hover:text-slate-300 transition-colors duration-300 relative">
                  {label}
                  {/* Underline animation */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bootcamp Gallery ── */}
      <section className="py-24 px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-4 block">
              Our Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Bootcamp Gallery
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Moments from our hands-on technology bootcamps delivered in schools across the country.
            </p>
          </div>
          
          {/* Gallery Grid - 6 Cards Evenly Distributed */}
          <div className="grid grid-cols-4 gap-2 auto-rows-[200px]">
            {/* Row 1 - 4 single cards */}
            <div className="col-span-1 group relative overflow-hidden rounded-lg">
              <img src="/images/bootcamp-1.jpg" alt="Students in bootcamp" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">Students in bootcamp</p>
              </div>
            </div>
            <div className="col-span-1 group relative overflow-hidden rounded-lg">
              <img src="/images/bootcamp-2.jpg" alt="Coding session" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">Coding session</p>
              </div>
            </div>
            <div className="col-span-1 group relative overflow-hidden rounded-lg">
              <img src="/images/bootcamp-4.jpg" alt="Students around laptop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">Students around laptop</p>
              </div>
            </div>
            <div className="col-span-1 group relative overflow-hidden rounded-lg">
              <img src="/images/bootcamp-5.jpg" alt="Robot building" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">Robot building</p>
              </div>
            </div>
            
            {/* Row 2 - 2 wide cards */}
            <div className="col-span-2 group relative overflow-hidden rounded-lg">
              <img src="/images/bootcamp-6.jpg" alt="Team collaboration" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">Team collaboration</p>
              </div>
            </div>
            <div className="col-span-2 group relative overflow-hidden rounded-lg">
              <img src="/images/frontview.jpg" alt="Classroom view" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">Classroom view</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Your School Gets ── */}
      <section className="py-24 px-8 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-4 block">
              What You Get
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              A Complete Technology Education Partnership
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From first session to final certification, we handle every operational detail.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-20">
            <div className="group cursor-default">
              <h3 className="text-xl font-bold text-blue-300 mb-4 relative inline-block">
                School Recognition
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Position your school as a leader in future-tech education within your region.
              </p>
            </div>
            <div className="group cursor-default">
              <h3 className="text-xl font-bold text-blue-300 mb-4 relative inline-block">
                Industry Professionals
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Students learn from active engineers who bring real-world context into classroom.
              </p>
            </div>
            <div className="group cursor-default">
              <h3 className="text-xl font-bold text-blue-300 mb-4 relative inline-block">
                Admin Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Complete visibility into attendance, grades, and student progress.
              </p>
            </div>
            <div className="group cursor-default">
              <h3 className="text-xl font-bold text-blue-300 mb-4 relative inline-block">
                Session Recordings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Every live session recorded for students to revisit and master at their pace.
              </p>
            </div>
            <div className="group cursor-default">
              <h3 className="text-xl font-bold text-blue-300 mb-4 relative inline-block">
                Custom Curriculum
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Learning paths tailored to align with your school's schedule and goals.
              </p>
            </div>
            <div className="group cursor-default">
              <h3 className="text-xl font-bold text-blue-300 mb-4 relative inline-block">
                Zero Management
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                We provide trainers, content, and framework. You provide the space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Students Get ── */}
      <section className="bg-slate-950 pt-32 pb-48 w-full relative overflow-hidden">
        {/* Refined Headline Section with Subtle Blue Tint & Hover */}
        <div className="w-full px-8 mb-32 relative z-10 border-b border-white/5 pb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tighter text-blue-50/90 text-center whitespace-nowrap overflow-hidden hover:text-blue-400 transition-all duration-700 cursor-default group">
            Practical skills, <span className="text-blue-400/80 group-hover:text-blue-400">verified projects</span> & national level recognition.
          </h2>
        </div>

        {/* Enhanced Minimalist Feature List - Animated Features */}
        <div className="max-w-[1600px] mx-auto px-8 relative z-10">
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {[
              { 
                title: "REAL WORLD PROJECTS", 
                desc: "Moving beyond theoretical tutorials. Students engineer functional applications, AI models, and integrated hardware systems that address industry challenges."
              },
              { 
                title: "THINKSKOOL CERTIFICATION", 
                desc: "A credential that carries weight. Our certification process involves rigorous project validation and peer-reviewed technical assessment."
              },
              { 
                title: "TECHNICAL MENTORSHIP", 
                desc: "Direct access to practitioners. Every student receives personalized technical feedback and architectural guidance during live development sessions."
              },
              { 
                title: "PERFORMANCE TRACKING", 
                desc: "Granular data on student progress. Individual dashboards provide transparency into skill acquisition, project milestones, and developmental areas."
              },
              { 
                title: "NATIONAL HACKATHONS", 
                desc: "A stage for innovation. Students compete at the national level, presenting their solutions to a jury of senior engineers and product leaders."
              },
              { 
                title: "KNOWLEDGE REPOSITORIES", 
                desc: "Long-term learning retention. Comprehensive archives of every live session are maintained for permanent student access and ongoing reference."
              },
            ].map((item) => (
              <div 
                key={item.title} 
                className="group flex flex-col items-start border-l border-white/5 pl-10 hover:border-blue-500/50 hover:bg-blue-500/[0.02] py-4 -ml-4 transition-all duration-500 rounded-r-2xl"
              >
                <h3 className="text-2xl font-bold text-blue-50/90 mb-4 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-500 tracking-tight uppercase leading-none">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 text-lg leading-relaxed max-w-sm group-hover:text-slate-200 transition-colors font-medium">
                  {item.desc}
                </p>
                
                <div className="mt-10 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-1000 ease-out" />
              </div>
            ))}
          </div>

          {/* Mobile: Vertical Marquee */}
          <div className="md:hidden">
            <div className="relative overflow-hidden h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border-4 border-blue-500">
              <div className="animate-marquee-vertical flex flex-col gap-6 absolute">
                {/* Duplicate items for seamless scrolling */}
                {[
                  { 
                    title: "🚀 REAL WORLD PROJECTS", 
                    desc: "Moving beyond theoretical tutorials. Students engineer functional applications!"
                  },
                  { 
                    title: "🏆 THINKSKOOL CERTIFICATION", 
                    desc: "A credential that carries weight in the industry!"
                  },
                  { 
                    title: "👨‍💻 TECHNICAL MENTORSHIP", 
                    desc: "Direct access to practitioners and live feedback!"
                  },
                  { 
                    title: "📊 PERFORMANCE TRACKING", 
                    desc: "Granular data on student progress and milestones!"
                  },
                  { 
                    title: "🎯 NATIONAL HACKATHONS", 
                    desc: "Compete at national level with industry leaders!"
                  },
                  { 
                    title: "📚 KNOWLEDGE REPOSITORIES", 
                    desc: "Long-term learning retention with comprehensive archives!"
                  },
                  // Duplicate for seamless loop
                  { 
                    title: "🚀 REAL WORLD PROJECTS", 
                    desc: "Moving beyond theoretical tutorials. Students engineer functional applications!"
                  },
                  { 
                    title: "🏆 THINKSKOOL CERTIFICATION", 
                    desc: "A credential that carries weight in the industry!"
                  },
                  { 
                    title: "👨‍💻 TECHNICAL MENTORSHIP", 
                    desc: "Direct access to practitioners and live feedback!"
                  },
                  { 
                    title: "📊 PERFORMANCE TRACKING", 
                    desc: "Granular data on student progress and milestones!"
                  },
                  { 
                    title: "🎯 NATIONAL HACKATHONS", 
                    desc: "Compete at national level with industry leaders!"
                  },
                  { 
                    title: "📚 KNOWLEDGE REPOSITORIES", 
                    desc: "Long-term learning retention with comprehensive archives!"
                  },
                ].map((item, index) => (
                  <div 
                    key={`${item.title}-${index}`}
                    className="flex flex-col items-start border-l-4 border-yellow-400 pl-6 py-4 bg-slate-800/50 rounded-r-xl flex-shrink-0 w-full max-w-sm mx-auto"
                  >
                    <h3 className="text-lg font-bold text-yellow-400 mb-2 uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="py-24 px-8 bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span> Program Roadmap
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Your journey from discovery to certification, designed for maximum impact and learning.
            </p>
          </div>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transform -translate-y-1/2"></div>
              
              {/* Timeline Cards */}
              <div className="relative flex justify-between items-center">
                {[
                  { num: "01", title: "Demo Bootcamp", desc: "A 7-day high-energy intro for all students to find their spark.", icon: "⚡" },
                  { num: "02", title: "Domain Selection", desc: "Guided counseling to pick technology path that fits their talent.", icon: "🎯" },
                  { num: "03", title: "Full 4 Month Program", desc: "Deep-dive technical training on campus with specialized mentors.", icon: "�" },
                  { num: "04", title: "National Hackathon", desc: "Students build and showcase products in a nationwide competition.", icon: "🏆" },
                  { num: "05", title: "Certification", desc: "Institutional recognition and career-ready skill verification.", icon: "🎓" },
                ].map((item, index) => (
                  <div key={item.num} className="flex flex-col items-center group">
                    {/* Connection Point */}
                    <div className="relative">
                      <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-slate-900 shadow-lg shadow-blue-600/50 group-hover:scale-125 transition-transform duration-300"></div>
                      {/* Vertical Line */}
                      <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-blue-600 to-transparent ${index === 4 ? 'hidden' : ''}`}></div>
                    </div>
                    
                    {/* Card */}
                    <div className="mt-8 bg-slate-800/80 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 w-64 shadow-xl hover:shadow-2xl hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-2">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto">
                          {item.num}
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-3 text-center">{item.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed text-center">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="lg:hidden">
            <div className="relative max-w-3xl mx-auto">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  { num: "01", title: "Demo Bootcamp", desc: "A 7-day high-energy intro for all students to find their spark.", icon: "⚡" },
                  { num: "02", title: "Domain Selection", desc: "Guided counseling to pick technology path that fits their talent.", icon: "🎯" },
                  { num: "03", title: "Full 4 Month Program", desc: "Deep-dive technical training on campus with specialized mentors.", icon: "�" },
                  { num: "04", title: "National Hackathon", desc: "Students build and showcase products in a nationwide competition.", icon: "🏆" },
                  { num: "05", title: "Certification", desc: "Institutional recognition and career-ready skill verification.", icon: "🎓" },
                ].map((item, index) => (
                  <div key={item.num} className="flex items-start space-x-6 group">
                    {/* Timeline Dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-slate-900 shadow-lg shadow-blue-600/50 group-hover:scale-125 transition-transform duration-300"></div>
                    </div>
                    
                    {/* Card */}
                    <div className="flex-1 bg-slate-800/80 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-600/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {item.num}
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section id="domains" className="py-24 px-8 bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Five Domains. Or a Curriculum Built Specifically for Your School.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Choose from our expert-designed technology tracks or let us create a custom program tailored to your institution's unique needs.
            </p>
          </div>

          {/* Unique Domain Cards Design */}
          <div className="relative">
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-900 border-2 border-blue-500/50 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 z-20">
              <div className="font-bold text-lg">
                <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span>
              </div>
            </div>

            {/* Domain Cards in Circle - 4 Cards */}
            <div className="relative h-[700px] w-full flex items-center justify-center">
              {[
                { 
                  title: "AI & Machine Learning", 
                  desc: "Understanding models, neural networks, and creating predictive software.",
                  angle: 45
                },
                { 
                  title: "Web Development", 
                  desc: "Building responsive, modern web applications from frontend to backend.",
                  angle: 135
                },
                { 
                  title: "Cybersecurity", 
                  desc: "Learning fundamentals of network protection and ethical hacking.",
                  angle: 225
                },
                { 
                  title: "IoT & Robotics", 
                  desc: "Integrating software with hardware to build smart automated devices.",
                  angle: 315
                },
              ].map((domain, index) => {
                // Calculate position using trigonometry for perfect circle
                const radius = 300;
                const angleRad = (domain.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;
                
                return (
                  <div key={domain.title} className="absolute" style={{
                    transform: `translate(${x}px, ${y}px)`,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-128px',
                    marginTop: '-100px'
                  }}>
                    {/* Connection Line */}
                    <div className={`absolute w-48 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 opacity-30`}
                      style={{
                        left: '128px',
                        top: '100px',
                        transform: `rotate(${domain.angle + 180}deg)`,
                        transformOrigin: '0 0'
                      }}
                    ></div>
                    
                    {/* Domain Card */}
                    <div className="group">
                      <div className={`bg-slate-800/60 backdrop-blur-sm border border-blue-900/30 rounded-2xl p-6 w-64 shadow-xl hover:shadow-2xl hover:border-blue-600/50 transition-all duration-500 hover:scale-105 transform hover:-translate-y-2`}>
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full blur-2xl opacity-20`}></div>
                        
                        <div className="relative z-10">
                          <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg text-white font-bold text-sm mb-4 shadow-lg`}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                            {domain.title}
                          </h3>
                          
                          <p className="text-slate-300 text-sm leading-relaxed mb-4 group-hover:text-slate-200 transition-colors duration-300">
                            {domain.desc}
                          </p>
                          
                          {index === 0 && (
                            <button 
                              onClick={() => navigate('/course/1')}
                              className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                            >
                              Explore
                              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Curriculum Option */}
          <div className="text-center mt-32 mb-16">
            <div className="inline-flex flex-col items-center gap-6 p-8 bg-slate-800/40 backdrop-blur-sm border-2 border-dashed border-blue-500/30 rounded-3xl hover:border-blue-500/50 transition-all duration-300">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-2xl">+</div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Custom Curriculum</h3>
                <p className="text-slate-300 mb-6 max-w-md">
                  We can design a bespoke tech track that aligns perfectly with your school's specific pedagogy and goals.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Design Your Program
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Partner ── */}
      <section className="py-24 px-8 bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Why Partner With <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span>?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We provide an institutional-grade solution that bridges the gap between traditional schooling and industry reality.
            </p>
          </div>

          {/* Feature Cards - No Containers, No Emojis */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "No cost to evaluate", 
                desc: "Experience our pedagogy first-hand with 7-day free trial. No risk, no commitment needed to start.",
                number: "01"
              },
              { 
                title: "Complete management", 
                desc: "We handle staff, scheduling, and technical requirements. Your current teachers can focus on their core subjects.",
                number: "02"
              },
              { 
                title: "Measurable outcomes", 
                desc: "Clear progress reporting and tangible student portfolios that parents can see and appreciate.",
                number: "03"
              },
            ].map((item, index) => (
              <div key={item.title} className="group relative">
                {/* Card without container background */}
                <div className="relative p-8 h-full transition-all duration-300 hover:-translate-y-2">
                  {/* Number Badge */}
                  <div className="relative mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 border border-blue-900/50 rounded-lg text-blue-400 font-bold text-lg shadow-lg group-hover:scale-110 group-hover:border-blue-500/70 transition-all duration-300">
                      {item.number}
                    </div>
                    {/* Decorative Line */}
                    <div className="absolute top-6 left-12 w-20 h-0.5 bg-blue-900/50 transform scale-x-0 group-hover:scale-x-100 group-hover:bg-blue-500/50 transition-all duration-300 origin-left"></div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300 mb-6">
                      {item.desc}
                    </p>
                    
                    {/* Learn More Link */}
                    <button className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors group">
                      Learn more
                      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                  
                  {/* Bottom Border */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-blue-900/30 transform scale-x-0 group-hover:scale-x-100 group-hover:bg-blue-500/30 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 font-medium">Ready to transform your school's tech education?</span>
              </div>
              <button 
                onClick={() => scrollToSection('partner-form')}
                className="text-white font-bold bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Form ── */}
      <section id="partner-form" className="py-24 px-8 bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Start Your Institutional Journey
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Bring <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span> to your campus. Fill out the form, and our regional head will contact you within 24 hours.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-900/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Left Side - Info */}
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 p-12 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-blue-500/10"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-8">Partnership Details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-200 font-bold text-sm">01</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">For Schools</h4>
                        <p className="text-blue-100 text-sm">Classes 6-12</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-200 font-bold text-sm">02</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Batch Size</h4>
                        <p className="text-blue-100 text-sm">25-100+ Students</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-200 font-bold text-sm">03</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Response Time</h4>
                        <p className="text-blue-100 text-sm">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trust Badge */}
                  <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                    <span className="text-blue-200 text-sm font-medium">Quick Response Guaranteed</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="md:col-span-3 p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">School Name *</label>
                      <input 
                        name="schoolName" 
                        type="text" 
                        value={formData.schoolName} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white placeholder-slate-500" 
                        placeholder="Enter your school name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Contact Person *</label>
                      <input 
                        name="contactPerson" 
                        type="text" 
                        value={formData.contactPerson} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500" 
                        placeholder="Contact person name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Designation</label>
                      <input 
                        name="designation" 
                        type="text" 
                        value={formData.designation} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500" 
                        placeholder="Your designation"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number *</label>
                      <input 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500" 
                        placeholder="Phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">City</label>
                      <input 
                        name="city" 
                        type="text" 
                        value={formData.city} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500" 
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Preferred Domain</label>
                      <select 
                        name="domain" 
                        value={formData.domain} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="IoT & Robotics">IoT & Robotics</option>
                        <option value="Custom Curriculum">Custom Curriculum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Approx. Students</label>
                      <input 
                        name="students" 
                        type="number" 
                        value={formData.students} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500" 
                        placeholder="Number of students"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Specific Requirements</label>
                      <textarea 
                        name="requirements" 
                        rows={4} 
                        value={formData.requirements} 
                        onChange={handleChange} 
                        className="w-full bg-slate-900/50 border border-blue-900/30 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500 resize-none" 
                        placeholder="Tell us about your specific requirements..."
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Submit Partnership Request →
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                      We respond within 24 hours of submission.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 backdrop-blur-xl border-t border-blue-900/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-12 py-16 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="font-bold">
              <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span>
            </div>
            <p className="text-sm tracking-wide text-slate-400 max-w-xs leading-relaxed">
              Bridging the gap between classroom and tech industry. We are building the next generation of engineers, right where they are.
            </p>
            <div className="text-xs text-slate-500"> 2024 <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span> Institutional Group. All architectural rights reserved.</div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              {["Admissions", "Faculty", "Research"].map((link) => (
                <button 
                  key={link} 
                  onClick={() => alert(`${link} page coming soon!`)}
                  className="text-slate-400 hover:text-blue-400 transition-all text-sm text-left cursor-pointer"
                >
                  {link}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {[
                { name: "Privacy Policy", action: () => alert("Privacy Policy will be available soon!") },
                { name: "Terms of Service", action: () => alert("Terms of Service will be available soon!") },
                { name: "Contact", action: () => navigate('/contact') }
              ].map((link) => (
                <button 
                  key={link.name}
                  onClick={link.action}
                  className="text-slate-400 hover:text-blue-400 transition-all text-sm text-left cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolPartnership;
