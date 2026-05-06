import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PartnershipHero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Programs', action: () => navigate('/course') },
    { name: 'Roadmap', action: () => scrollToSection('roadmap') },
    { name: 'Domains', action: () => scrollToSection('domains') },
    { name: 'Why Us', action: () => scrollToSection('why-us') },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center h-20 relative">
            {/* Logo Group */}
            <div className="flex-1 flex justify-start pl-2">
              <div className="flex flex-col items-start">
                <Link 
                  to="/" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-2xl md:text-3xl font-black tracking-tight"
                >
                  <span className="text-blue-600">think</span>
                  <span className="text-orange-500">skool</span>
                </Link>
                <span className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide">Learn Beyond Classroom</span>
              </div>
            </div>

            {/* Centered Desktop Nav */}
            <div className="hidden md:flex items-center justify-center gap-10 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="relative text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300 group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center justify-end flex-1 pr-2">
              <button
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
              >
                Partner With Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 ml-auto"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-slate-200">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="block w-full text-left text-slate-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => {
                  document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
              >
                Partner With Us
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-blue-50 via-orange-50 to-white overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-orange-300/[0.08] rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-[1440px] mx-auto w-full relative z-10 pt-2 sm:pt-4">
          {/* Mobile-optimized layout - hidden on desktop */}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 block md:hidden">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              For Schools
            </div>

            {/* Headline */}
            <h1 className="text-[1.75rem] sm:text-[2rem] font-black text-slate-900 leading-[1.2] tracking-tight max-w-3xl">
              We come to your school.<br/>
              <span className="text-orange-500">We teach students.</span>
            </h1>

            {/* Subtext */}
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed px-4">
              thinkskool delivers live technology education directly on your campus. Our mentors handle everything.
            </p>

            {/* Free Trial Banner */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold text-xs">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              7 days free trial
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col w-full gap-3 max-w-sm px-4">
              <button
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full px-4 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
              >
                Partner With Us →
              </button>
              <button
                onClick={() => scrollToSection('domains')}
                className="w-full px-4 py-3.5 bg-white text-slate-700 font-bold text-sm rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                View Domains ↓
              </button>
            </div>

            {/* Stats - Improved Mobile Display */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm px-4 mt-2">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                <div className="text-lg font-black text-slate-900 mb-1">1000+</div>
                <div className="text-[10px] text-slate-500 font-medium">Students Taught</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                <div className="text-lg font-black text-slate-900 mb-1">5</div>
                <div className="text-[10px] text-slate-500 font-medium">Tech Domains</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                <div className="text-lg font-black text-slate-900 mb-1">Live</div>
                <div className="text-[10px] text-slate-500 font-medium">On-Campus Classes</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                <div className="text-lg font-black text-slate-900 mb-1">Industry</div>
                <div className="text-[10px] text-slate-500 font-medium">Designed Curriculum</div>
              </div>
            </div>
          </div>

          {/* Desktop layout - hidden on mobile */}
          <div className="hidden md:flex flex-col items-center text-center space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              For Schools & Institutions
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight max-w-5xl">
              We come to your school.
              <br />
              <span className="text-orange-500">We teach your students.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
              thinkskool delivers live technology education directly on your campus. Our mentors plan, manage and run everything. Your school provides space. Your students get real skills.
            </p>

            {/* Highlight Line */}
            <div className="flex items-center gap-3 text-green-700 font-semibold text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              The first 1 days are completely free.
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Partner With Us →
              </button>
              <button
                onClick={() => scrollToSection('domains')}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-lg rounded-xl border-2 border-slate-300 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View Domains ↓
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8 w-full max-w-4xl">
              {[
                { value: '1000+', label: 'Students Taught' },
                { value: '5', label: 'Technology Domains' },
                { value: 'Live', label: 'On-Campus Classes' },
                { value: 'Industry', label: 'Designed Curriculum' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-sm md:text-base text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnershipHero;
