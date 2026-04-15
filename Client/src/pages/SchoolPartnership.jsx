import { useState } from "react";
import { useNavigate } from "react-router-dom";
import termsPDF from '../assets/pdf/finalthinkskoolTerms and Conditions.pdf';
import api from '../api/axios';

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.schoolName || !formData.contactPerson || !formData.phone) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/school-partnership/lead', formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        toast.success('Partnership request submitted successfully!');
        
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
      } else {
        toast.error(response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white font-inter selection:bg-blue-500 selection:text-white">
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
      <section className="bg-slate-950 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Mobile: Horizontal scrollable cards */}
          <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-12 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-2 px-2 md:px-0 snap-x">
            {[
              { value: "100+", label: "Students Taught", delay: "0s" },
              { value: "5", label: "Technology Domains", delay: "0.2s" },
              { value: "Live", label: "On Campus Classes", delay: "0.4s", pulse: true },
              { value: "Industry", label: "Designed Curriculum", delay: "0.6s" },
            ].map(({ value, label, delay, pulse }) => (
              <div 
                key={label} 
                className="flex-shrink-0 w-44 md:w-auto snap-center group cursor-default bg-slate-800/60 md:bg-transparent rounded-2xl md:rounded-none p-6 md:p-0 border border-slate-700/50 md:border-none"
                style={{ animationDelay: delay }}
              >
                <div className="flex flex-col md:block items-center text-center gap-2 md:gap-0">
                  <div className="text-4xl md:text-4xl font-bold text-blue-400 mb-1 group-hover:text-blue-300 transition-all duration-500">
                    {value}
                  </div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bootcamp Gallery (Light Theme) ── */}
      <section className="py-24 px-0 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 px-6">
            <span className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-4 block">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Bootcamp Gallery
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Moments from our hands-on technology bootcamps delivered in schools across the country.
            </p>
          </div>
          
          {/* Mobile: Horizontal scrollable carousel */}
          <div className="lg:hidden flex overflow-x-auto gap-4 pb-4 snap-x px-2">
            {[
              { src: "/images/bootcamp-1.jpg", alt: "Students in bootcamp", label: "Students in bootcamp" },
              { src: "/images/bootcamp-2.jpg", alt: "Coding session", label: "Coding session" },
              { src: "/images/bootcamp-4.jpg", alt: "Students around laptop", label: "Students around laptop" },
              { src: "/images/bootcamp-5.jpg", alt: "Robot building", label: "Robot building" },
              { src: "/images/bootcamp-6.jpg", alt: "Team collaboration", label: "Team collaboration" },
              { src: "/images/frontview.jpg", alt: "Classroom view", label: "Classroom view" },
            ].map((img, idx) => (
              <div key={idx} className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center">
                <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-lg">
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
                    <p className="absolute bottom-4 left-4 text-white font-medium">{img.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop: Professional Grid Gallery - No Scrolling */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-4 h-[500px]">
              {/* Column 1 - 2 tall images */}
              <div className="flex flex-col gap-4 h-full">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/bootcamp-1.jpg" alt="Students in bootcamp" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Students in bootcamp</p></div>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/bootcamp-5.jpg" alt="Robot building" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Robot building</p></div>
                  </div>
                </div>
              </div>
              {/* Column 2 - 2 normal images */}
              <div className="flex flex-col gap-4 h-full">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/bootcamp-2.jpg" alt="Coding session" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Coding session</p></div>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/bootcamp-6.jpg" alt="Team collaboration" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Team collaboration</p></div>
                  </div>
                </div>
              </div>
              {/* Column 3 - 2 normal images */}
              <div className="flex flex-col gap-4 h-full">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/bootcamp-4.jpg" alt="Students around laptop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Students around laptop</p></div>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/frontview.jpg" alt="Classroom view" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Classroom view</p></div>
                  </div>
                </div>
              </div>
              {/* Column 4 - 2 tall images */}
              <div className="flex flex-col gap-4 h-full">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/frontview.jpg" alt="Front view" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Front view</p></div>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                  <img src="/images/bootcamp-1.jpg" alt="Bootcamp session" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Bootcamp session</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Your School Gets ── */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
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
          
          {/* Mobile: Card carousel */}
          <div className="lg:hidden flex overflow-x-auto gap-4 pb-4 snap-x px-2">
            {[
              { title: "School Recognition", desc: "Position your school as a leader in future-tech education within your region." },
              { title: "Industry Professionals", desc: "Students learn from active engineers who bring real-world context into classroom." },
              { title: "Admin Dashboard", desc: "Complete visibility into attendance, grades, and student progress." },
              { title: "Session Recordings", desc: "Every live session recorded for students to revisit and master at their pace." },
              { title: "Custom Curriculum", desc: "Learning paths tailored to align with your school's schedule and goals." },
              { title: "Zero Management", desc: "We provide trainers, content, and framework. You provide the space." },
            ].map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-[85vw] max-w-[300px] snap-center">
                <div className="bg-slate-800/60 border border-blue-900/30 rounded-2xl p-6 h-full min-h-[200px]">
                  <h3 className="text-xl font-bold text-blue-300 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Elegant List Layout - No Containers */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-x-16 gap-y-12">
              {[
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
              ].map((item, idx) => (
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

      {/* <!-- What Students Get (Light Theme with 3D) --> */}
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

        {/* Mobile Only - Horizontal Scroll */}
        <div className="lg:hidden max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="w-full px-6 mb-12 relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tighter text-slate-900 text-center">
              Practical skills, <span className="text-blue-600">verified projects</span> & national level recognition.
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-2">
            {[
              { 
                title: "REAL WORLD PROJECTS", 
                desc: "Moving beyond theoretical tutorials. Students engineer functional applications, AI models, and integrated hardware systems."
              },
              { 
                title: "THINKSKOOL CERTIFICATION", 
                desc: "A credential that carries weight. Our certification process involves rigorous project validation."
              },
              { 
                title: "TECHNICAL MENTORSHIP", 
                desc: "Direct access to practitioners. Every student receives personalized technical feedback."
              },
              { 
                title: "PERFORMANCE TRACKING", 
                desc: "Granular data on student progress. Individual dashboards provide transparency."
              },
              { 
                title: "NATIONAL HACKATHONS", 
                desc: "A stage for innovation. Students compete at the national level."
              },
              { 
                title: "KNOWLEDGE REPOSITORIES", 
                desc: "Long-term learning retention. Comprehensive archives of every live session."
              },
            ].map((item, idx) => (
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
            ].map((item, idx) => (
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

      {/* <!-- Roadmap --> */}
      <section id="roadmap" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span> Program Roadmap
            </h2>
            <p className="text-base text-slate-300 max-w-3xl mx-auto">
              Your journey from discovery to certification, designed for maximum impact and learning.
            </p>
          </div>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transform -translate-y-1/2"></div>
              
              <div className="relative flex justify-between items-center">
                {[
                  { num: "01", title: "Demo Bootcamp", desc: "A 7-day high-energy intro for all students to find their spark." },
                  { num: "02", title: "Domain Selection", desc: "Guided counseling to pick technology path that fits their talent." },
                  { num: "03", title: "Full 3 Month Program", desc: "Deep-dive technical training on campus with specialized mentors." },
                  { num: "04", title: "National Hackathon", desc: "Students build and showcase products in a nationwide competition." },
                  { num: "05", title: "Certification", desc: "Institutional recognition and career-ready skill verification." },
                ].map((item, index) => (
                  <div key={item.num} className="flex flex-col items-center group">
                    <div className="relative">
                      <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-slate-900 shadow-lg shadow-blue-600/50 group-hover:scale-125 transition-transform duration-300"></div>
                      <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-blue-600 to-transparent ${index === 4 ? 'hidden' : ''}`}></div>
                    </div>
                    
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

          {/* Mobile: Swipeable Horizontal Timeline */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-2">
              {[
                { num: "01", title: "Demo Bootcamp", desc: "A 7-day high-energy intro for all students to find their spark." },
                { num: "02", title: "Domain Selection", desc: "Guided counseling to pick technology path that fits their talent." },
                { num: "03", title: "Full 3 Month Program", desc: "Deep-dive technical training on campus with specialized mentors." },
                { num: "04", title: "National Hackathon", desc: "Students build and showcase products in a nationwide competition." },
                { num: "05", title: "Certification", desc: "Institutional recognition and career-ready skill verification." },
              ].map((item, index) => (
                <div key={item.num} className="flex-shrink-0 w-[85vw] max-w-[300px] snap-center">
                  <div className="bg-slate-800/80 border border-blue-900/30 rounded-2xl p-6 shadow-xl min-h-[180px]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {item.num}
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-500/50"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section id="domains" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Five Domains. Or a Curriculum Built Specifically for Your School.
            </h2>
            <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Choose from our expert-designed technology tracks or let us create a custom program tailored to your institution's unique needs.
            </p>
          </div>

          {/* Mobile: Horizontal scrollable domain cards */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-2">
              {[
                { 
                  title: "AI & Machine Learning", 
                  desc: "Understanding models, neural networks, and creating predictive software."
                },
                { 
                  title: "Web Development", 
                  desc: "Building responsive, modern web applications from frontend to backend."
                },
                { 
                  title: "Cybersecurity", 
                  desc: "Learning fundamentals of network protection and ethical hacking."
                },
                { 
                  title: "IoT & Robotics", 
                  desc: "Integrating software with hardware to build smart automated devices."
                },
              ].map((domain, index) => (
                <div key={domain.title} className="flex-shrink-0 w-[85vw] max-w-[300px] snap-center">
                  <div className="bg-slate-800/60 border border-blue-900/30 rounded-2xl p-6 h-full min-h-[200px] hover:border-blue-600/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {domain.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {domain.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Circular Layout */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-900 border-2 border-blue-500/50 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 z-20">
                <div className="font-bold text-lg">
                  <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span>
                </div>
              </div>

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
                      <div className={`absolute w-48 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 opacity-30`}
                        style={{
                          left: '128px',
                          top: '100px',
                          transform: `rotate(${domain.angle + 180}deg)`,
                          transformOrigin: '0 0'
                        }}
                      ></div>
                      
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

          </div>
        </div>
      </section>

      {/* ── Why Partner ── */}
      <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Why Partner With <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span>?
            </h2>
            <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We provide an institutional-grade solution that bridges the gap between traditional schooling and industry reality.
            </p>
          </div>

          {/* Mobile: Horizontal scrollable */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-2">
              {[
                { 
                  title: "No cost to evaluate", 
                  desc: "Experience our pedagogy first-hand with 7-day free trial. No risk, no commitment.",
                  number: "01"
                },
                { 
                  title: "Complete management", 
                  desc: "We handle staff, scheduling, and technical requirements.",
                  number: "02"
                },
                { 
                  title: "Measurable outcomes", 
                  desc: "Clear progress reporting and tangible student portfolios.",
                  number: "03"
                },
              ].map((item) => (
                <div key={item.title} className="flex-shrink-0 w-[85vw] max-w-[300px] snap-center">
                  <div className="bg-slate-800/40 border border-blue-900/30 rounded-2xl p-6 h-full min-h-[200px] hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:block">
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
                  <div className="relative p-8 h-full transition-all duration-300 hover:-translate-y-2">
                    <div className="relative mb-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 border border-blue-900/50 rounded-lg text-blue-400 font-bold text-lg shadow-lg group-hover:scale-110 group-hover:border-blue-500/70 transition-all duration-300">
                        {item.number}
                      </div>
                      <div className="absolute top-6 left-12 w-20 h-0.5 bg-blue-900/50 transform scale-x-0 group-hover:scale-x-100 group-hover:bg-blue-500/50 transition-all duration-300 origin-left"></div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300 mb-6">
                        {item.desc}
                      </p>
                      
                      <button className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors group">
                        Learn more
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </button>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 h-0.5 bg-blue-900/30 transform scale-x-0 group-hover:scale-x-100 group-hover:bg-blue-500/30 transition-transform duration-300 origin-left"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-blue-300 font-medium text-sm">Ready to transform your school's tech education?</span>
              <button 
                onClick={() => scrollToSection('partner-form')}
                className="text-white font-bold bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Form ── */}
      <section id="partner-form" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Start Your Institutional Journey
            </h2>
            <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Bring <span className="text-blue-500">think</span> <span className="text-orange-500">skool</span> to your campus. Fill out the form, and our regional head will contact you within 24 hours.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-900/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Mobile: Stacked layout, Desktop: Side by side */}
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 p-12 text-white relative overflow-hidden">
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
                  
                  <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                    <span className="text-blue-200 text-sm font-medium">Quick Response Guaranteed</span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 p-12">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
                    <p className="text-slate-300 mb-6 max-w-md">
                      Your partnership request has been submitted successfully. Our team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
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
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Submit Partnership Request ?'
                        )}
                      </button>
                      <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                        We respond within 24 hours of submission.
                      </p>
                    </div>
                  </form>
                )}
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
                { name: "Terms of Service", action: () => window.open(termsPDF, '_blank') },
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
