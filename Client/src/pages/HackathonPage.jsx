import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import SEO from '../components/common/SEO';

const HackathonPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const viewParam = searchParams.get('view'); // 'school' | 'participant' | null

  const [activeView, setActiveView] = useState(viewParam || null);

  useEffect(() => {
    setActiveView(viewParam || null);
  }, [viewParam]);

  const [hostFormData, setHostFormData] = useState({
    schoolName: '', schoolAddress: '', city: '', state: '', principalName: '',
    yourName: '', designation: '', email: '', phone: '', whatsappSame: true,
    whatsappNumber: '', preferredMonth: '', expectedStudents: '', hallAvailable: '',
    projectorAvailable: '', additionalInfo: ''
  });

  const [studentFormData, setStudentFormData] = useState({
    teamName: '', schoolName: '', city: '', classGroup: '', teamMembers: '2',
    teamLeaderName: '', teamLeaderClass: '', teamLeaderWhatsapp: '', teamLeaderEmail: '',
    teammate2Name: '', teammate2Class: '', teammate3Name: '', teammate3Class: '',
    teammate4Name: '', teammate4Class: '', parentName: '', parentRelationship: '',
    parentWhatsapp: '', parentEmail: '', previousHackathon: '', additionalInfo: ''
  });

  const [hostSubmitted, setHostSubmitted] = useState(false);
  const [studentSubmitted, setStudentSubmitted] = useState(false);
  const [submittingHost, setSubmittingHost] = useState(false);
  const [submittingStudent, setSubmittingStudent] = useState(false);

  const handleHostSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingHost(true);
      const payload = {
        ...hostFormData,
        whatsappNumber: hostFormData.whatsappSame ? hostFormData.phone : hostFormData.whatsappNumber
      };
      
      const response = await api.post('/hackathon/school-lead', payload);
      if (response.data.success) {
        toast.success('Host request submitted!');
        setHostSubmitted(true);
      } else {
        toast.error(response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting school host form:', error);
      toast.error(error.response?.data?.message || 'Error submitting request. Please try again.');
    } finally {
      setSubmittingHost(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingStudent(true);
      const response = await api.post('/hackathon/participant-lead', studentFormData);
      if (response.data.success) {
        toast.success('Team registered successfully!');
        setStudentSubmitted(true);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering team:', error);
      toast.error(error.response?.data?.message || 'Error registering team. Please try again.');
    } finally {
      setSubmittingStudent(false);
    }
  };

  const handleHostChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHostFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'whatsappSame' && checked) {
      setHostFormData(prev => ({ ...prev, whatsappNumber: prev.phone }));
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectView = (view) => {
    navigate(`/hackathon?view=${view}`, { replace: true });
  };

  // ─── SELECTION SCREEN ───────────────────────────────────────────
  if (!activeView) {
    return (
      <div className="bg-white text-slate-900 font-inter selection:bg-blue-500 selection:text-white min-h-screen">
        <SEO title="Student Idea Hackathon - ThinkSkool" description="Where school students stop consuming technology and start building with it." />

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center h-20">
              <div className="flex-1 flex justify-start pl-2">
                <Link to="/school-partnerships" className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="text-blue-600">think</span><span className="text-orange-500">skool</span>
                </Link>
              </div>
              <div className="flex-1 flex justify-end pr-2">
                <Link to="/school-partnerships" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
                  ← Back to Partnerships
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Selection Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-blue-50 via-orange-50 to-white overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-300/[0.08] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[30%] left-[50%] w-[300px] h-[300px] bg-violet-300/[0.05] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-5xl mx-auto w-full relative z-10 text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-bold mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
              ThinkSkool Student Idea Hackathon
            </div>

            {/* Title with Gradient Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight mb-4">
              Where school students stop<br/>consuming technology
              <br/><span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">and start building with it.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              A one-day inter-school innovation challenge. Conducted on campus. Fully managed by ThinkSkool. Free for every school involved.
            </p>

            {/* Selection Prompt */}
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-3">I am a...</h2>
            <p className="text-sm text-slate-500 mb-8">Choose how you want to be part of the hackathon</p>

            {/* Two Cards with Enhanced Styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* School Card */}
              <button
                onClick={() => selectView('school')}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border-2 border-slate-100 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-3 text-left cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-blue-50/30 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zM12 14v7" />
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">School</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    Host the hackathon at your school. ThinkSkool manages everything — you provide the space and students.
                  </p>

                  <div className="flex items-center text-blue-600 font-bold text-sm sm:text-base gap-2 group-hover:gap-3 transition-all">
                    Host the Hackathon
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </button>

              {/* Participant Card */}
              <button
                onClick={() => selectView('participant')}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border-2 border-slate-100 hover:border-orange-400 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-3 text-left cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:to-orange-50/30 transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">Participant</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    Register your team and compete. Open to Classes 7–12. No coding knowledge needed.
                  </p>

                  <div className="flex items-center text-orange-600 font-bold text-sm sm:text-base gap-2 group-hover:gap-3 transition-all">
                    Register to Participate
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── SCHOOL VIEW ────────────────────────────────────────────────
  if (activeView === 'school') {
    return (
      <div className="bg-white text-slate-900 font-inter selection:bg-blue-500 selection:text-white">
        <SEO title="Host the Hackathon - ThinkSkool" description="Put your school at the centre of something real. Host the ThinkSkool Student Idea Hackathon." />

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center h-20">
              <div className="flex-1 flex justify-start pl-2">
                <Link to="/school-partnerships" className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="text-blue-600">think</span><span className="text-orange-500">skool</span>
                </Link>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white shadow-md transition-all"
                  >
                    School
                  </button>
                  <button
                    onClick={() => selectView('participant')}
                    className="px-5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                  >
                    Participant
                  </button>
                </div>
              </div>
              <div className="flex-1 flex justify-end pr-2">
                <Link to="/school-partnerships" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
                  ← Back
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-blue-50 via-orange-50 to-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-orange-300/[0.08] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-[1440px] mx-auto w-full relative z-10 pt-2 sm:pt-4">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              {/* Mobile toggle */}
              <div className="sm:hidden flex items-center bg-slate-100 rounded-xl p-1 mb-2">
                <button className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white shadow-md transition-all">School</button>
                <button onClick={() => selectView('participant')} className="px-5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">Participant</button>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-bold animate-bounce" style={{ animationDuration: '2s' }}>ThinkSkool Presents</div>
              <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight max-w-5xl">
                Where school students stop consuming technology<br/><span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">and start building with it.</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-600 max-w-3xl leading-relaxed px-4 font-medium">
                A one-day inter-school innovation challenge. Conducted on campus. Fully managed by ThinkSkool. Free for every school involved.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 w-full max-w-4xl px-4">
                {['Schools Participated', 'Students Competed', 'Cities', 'Events Conducted'].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                    <div className="text-xl md:text-3xl font-black text-slate-900 mb-1">{stat.split(' ')[0]}</div>
                    <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.split(' ').slice(1).join(' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Host the Hackathon Content */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">Host the Hackathon</div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6">Put your school at the centre of something real.</h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
                The ThinkSkool Student Idea Hackathon is a structured, high-energy, one-day innovation event for students of Classes 7 to 12. It runs entirely on your school premises. ThinkSkool manages everything from coordination to judging to prizes to certificates. Your school provides the space and the students. That is it.
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                This is not a science fair. It is not a quiz. It is a real innovation challenge where students identify problems from the world around them, build their own solutions and present them live to a panel of industry professionals, working engineers and national and international hackathon winners who give every team direct, honest feedback.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">No prior coding knowledge required. No preparation burden on your staff. No cost to your school.</p>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What Happens on the Day</h3>
              <div className="space-y-4">
                {[
                  { time: '9:00 AM', event: 'Event kickoff and problem statement briefing' },
                  { time: '9:30 AM', event: 'Teams begin working on their solutions' },
                  { time: '1:00 PM', event: 'Midday check-in with mentors' },
                  { time: '2:00 PM', event: 'Final presentations begin' },
                  { time: '4:00 PM', event: 'Judging and deliberation' },
                  { time: '5:00 PM', event: 'Prize ceremony, certificates and closing' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex-shrink-0 w-24 md:w-28 text-blue-600 font-bold text-sm md:text-base bg-blue-50 rounded-lg px-3 py-2 text-center group-hover:bg-blue-100 transition-colors">{item.time}</div>
                    <div className="text-slate-700 font-medium">{item.event}</div>
                  </div>
                ))}
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mt-6">Every team gets personalised feedback from the judges. The best ideas do not stop at the event. Outstanding teams are mentored further and given a clear path to state, national and international competitions.</p>
            </div>

            {/* What Your School Receives */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What Your School Receives</h3>
              <div className="space-y-6">
                {[
                  { icon: '🏫', title: 'Brand Visibility', desc: 'Your school is featured as the official host institution across all ThinkSkool platforms, social media channels and partner networks. Your name appears on every certificate, banner and communication issued for the event.' },
                  { icon: '🎯', title: 'Student Excellence', desc: 'Students from nearby schools participate under your roof. You witness your students solve real problems, present with confidence and compete at a level most schools never give them access to.' },
                  { icon: '🏆', title: 'National Recognition', desc: 'Top teams from your school are supported to represent you at regional, national and international competitions. Every achievement they earn carries your school\'s name forward.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-4xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Series */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">The Series</h3>
              <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl border border-slate-200">
                <p className="text-lg text-slate-700 leading-relaxed font-medium">This hackathon is part of a growing series ThinkSkool is building across school campuses, residential communities, corporate offices and eventually at a national level. Schools that become host partners early are part of every edition that follows. The series is building toward a national inter-school innovation championship. Your school can be part of that from day one.</p>
              </div>
            </div>

            {/* What We Need */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What We Need From You</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '📅', text: 'One full school day' },
                  { icon: '🏢', text: 'A hall or open space for teams to work and present' },
                  { icon: '📽️', text: 'A projector or screen if available' }
                ].map((req, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <div className="text-4xl mb-3">{req.icon}</div>
                    <span className="text-slate-700 font-medium">{req.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mt-6 text-center font-medium">Everything else is on ThinkSkool. Logistics. Coordination. Judging panel. Prizes. Certificates. Materials. All of it.</p>
            </div>

            {/* Host Form */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-6 md:p-12 shadow-2xl border border-slate-200">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Bring the Hackathon to Your School</h3>
                <p className="text-slate-600 mb-8">Fill in your details and our team will reach out within 24 hours to discuss the next steps.</p>

                {hostSubmitted ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center animate-bounce" style={{ animationDuration: '1s' }}>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h4 className="text-2xl font-bold text-green-800 mb-2">Thank You</h4>
                    <p className="text-green-700">We have received your request and our team will reach out to you within 24 hours on the WhatsApp number you provided. We look forward to bringing this to {hostFormData.schoolName}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleHostSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">School Name *</label><input type="text" name="schoolName" required value={hostFormData.schoolName} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">City / District *</label><input type="text" name="city" required value={hostFormData.city} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    </div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">School Address *</label><input type="text" name="schoolAddress" required value={hostFormData.schoolAddress} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">State *</label><input type="text" name="state" required value={hostFormData.state} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Principal Name *</label><input type="text" name="principalName" required value={hostFormData.principalName} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Your Name (if different) *</label><input type="text" name="yourName" required value={hostFormData.yourName} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Your Designation *</label><input type="text" name="designation" required value={hostFormData.designation} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Official School Email *</label><input type="email" name="email" required value={hostFormData.email} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label><input type="tel" name="phone" required value={hostFormData.phone} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number *</label><input type="tel" name="whatsappNumber" required value={hostFormData.whatsappSame ? hostFormData.phone : hostFormData.whatsappNumber} onChange={handleHostChange} disabled={hostFormData.whatsappSame} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500" /><label className="flex items-center mt-2"><input type="checkbox" name="whatsappSame" checked={hostFormData.whatsappSame} onChange={handleHostChange} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" /><span className="ml-2 text-sm text-slate-600">Same as phone number</span></label></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Preferred Month to Host *</label><select name="preferredMonth" required value={hostFormData.preferredMonth} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select month</option>{['May','June','July','August','September','October','November','Other'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Expected Number of Students *</label><select name="expectedStudents" required value={hostFormData.expectedStudents} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select range</option>{['Under 50','50 to 100','100 to 200','200 and above'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Hall or open space available? *</label><select name="hallAvailable" required value={hostFormData.hallAvailable} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select option</option>{['Yes','We can arrange one','Not sure'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Projector or screen? *</label><select name="projectorAvailable" required value={hostFormData.projectorAvailable} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select option</option>{['Yes','No','Not sure'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                    </div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Anything you want to tell us (optional)</label><textarea name="additionalInfo" rows={4} value={hostFormData.additionalInfo} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300 resize-none" /></div>
                    <button type="submit" disabled={submittingHost} className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed">{submittingHost ? 'Submitting Request...' : 'Submit Request'}</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── PARTICIPANT VIEW ───────────────────────────────────────────
  return (
    <div className="bg-white text-slate-900 font-inter selection:bg-blue-500 selection:text-white">
      <SEO title="Participate in the Hackathon - ThinkSkool" description="You have ideas. This is where they get tested. Register your team for the ThinkSkool Student Idea Hackathon." />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center h-20">
            <div className="flex-1 flex justify-start pl-2">
              <Link to="/school-partnerships" className="text-2xl md:text-3xl font-black tracking-tight">
                <span className="text-blue-600">think</span><span className="text-orange-500">skool</span>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => selectView('school')}
                  className="px-5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                >
                  School
                </button>
                <button
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-orange-500 text-white shadow-md transition-all"
                >
                  Participant
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-end pr-2">
              <Link to="/school-partnerships" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Participant Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-24 md:pt-28 pb-16 md:pb-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-500/[0.08] rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-blue-300/[0.08] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            {/* Mobile toggle */}
            <div className="sm:hidden flex items-center bg-slate-100 rounded-xl p-1 mb-2">
              <button onClick={() => selectView('school')} className="px-5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">School</button>
              <button className="px-5 py-2 rounded-lg text-sm font-bold bg-orange-500 text-white shadow-md transition-all">Participant</button>
            </div>

            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-sm font-bold animate-bounce" style={{ animationDuration: '2s' }}>Participate</div>
            <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight max-w-5xl">
              You have ideas.<br/><span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">This is where they get tested.</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-600 max-w-4xl leading-relaxed px-4 font-medium">The ThinkSkool Student Idea Hackathon is open to students of Classes 7 to 12. You do not need to know how to code. You do not need a tech background. You need a real problem you care about and a team willing to work on it.</p>
          </div>
        </div>
      </section>

      {/* Participant Content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-lg text-slate-600 leading-relaxed">Form a team of 2 to 4. Pick something broken in the world around you. Build your solution. Walk into a room and present it to a panel of industry professionals and national hackathon winners who will challenge your thinking, push your idea further and give you feedback no classroom ever will.</p>
            <p className="text-lg text-slate-600 leading-relaxed mt-4">The best teams do not just win on the day. They get mentored, refined and put on a path to state, national and international competitions where their ideas get a much bigger stage.</p>
          </div>

          {/* What You Walk Away With */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What You Will Walk Away With</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '📜', title: 'Certificate', desc: 'Every participant receives a certificate on the day.' },
                { icon: '💡', title: 'Real Feedback', desc: 'Direct, honest feedback from industry professionals and hackathon winners.' },
                { icon: '🏆', title: 'Top Prizes', desc: 'Cash prizes, medals, goodies and entry to next level for top 3 teams.' },
                { icon: '🚀', title: 'Mentorship', desc: 'Outstanding ideas get mentorship and representation at competitions.' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Judging Panel */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">The Judging Panel</h3>
            <div className="p-6 md:p-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl border border-slate-200">
              <p className="text-lg text-slate-700 leading-relaxed font-medium">Industry professionals. Engineers. Entrepreneurs. National and international hackathon winners. They are not here to grade you on what you know. They are here to challenge what you think.</p>
            </div>
          </div>

          {/* Prizes */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Prizes and Recognition</h3>
            <div className="space-y-4">
              {[
                { icon: '🥇', title: 'First Place', desc: 'Cash Prize + Medal + Certificate of Excellence + ThinkSkool Goodies + Entry to next level', color: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200' },
                { icon: '🥈', title: 'Second Place', desc: 'Cash Prize + Medal + Certificate of Excellence + ThinkSkool Goodies + Entry to next level', color: 'from-slate-50 to-slate-100', border: 'border-slate-200' },
                { icon: '🥉', title: 'Third Place', desc: 'Cash Prize + Medal + Certificate of Excellence + ThinkSkool Goodies + Entry to next level', color: 'from-orange-50 to-orange-100', border: 'border-orange-200' },
                { icon: '📜', title: 'All Participants', desc: 'Certificate of Participation', color: 'from-blue-50 to-blue-100', border: 'border-blue-200' }
              ].map((prize, idx) => (
                <div key={idx} className={`flex items-start gap-4 p-5 md:p-6 bg-gradient-to-r ${prize.color} rounded-xl border ${prize.border} hover:shadow-lg transition-all duration-300`}>
                  <div className="text-4xl flex-shrink-0">{prize.icon}</div>
                  <div><div className="font-bold text-slate-900 text-lg">{prize.title}</div><div className="text-slate-600">{prize.desc}</div></div>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mt-6 text-center font-medium">Top ideas selected for national and international showcases.</p>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">FAQ</h3>
            <div className="space-y-4">
              {[
                { q: 'Do I need to know coding to participate?', a: 'No. This is an ideas and problem solving challenge. If you can think clearly and communicate your idea, you can compete.' },
                { q: 'How big can a team be?', a: 'Teams can have 2 to 4 students. Solo participation is not allowed.' },
                { q: 'Can students from different schools form a team?', a: 'When the event is hosted at a school, teams must be from the schools invited to that edition. For independent editions, teams can be from anywhere.' },
                { q: 'Is there a registration fee?', a: 'No. Participation is completely free.' },
                { q: 'What should we bring on the day?', a: 'Your school ID, a laptop if you have one, and your idea. Everything else is provided.' },
                { q: 'What happens to the best ideas after the event?', a: 'Top teams are mentored by the ThinkSkool team and given opportunities to present at regional, national and international competitions.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 md:p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{item.q}</h4>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Registration Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-3xl p-6 md:p-12 shadow-2xl border border-slate-200">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Register Your Team</h3>
              <p className="text-slate-600 mb-8">One person registers on behalf of the full team. Make sure all details are correct before submitting.</p>

              {studentSubmitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center animate-bounce" style={{ animationDuration: '1s' }}>
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-bold text-green-800 mb-2">You are registered</h4>
                  <p className="text-green-700">We will send event details, venue and timing to your WhatsApp number at least 48 hours before the event. If you have any questions reach us at info@thinkskool.in or +91 83688 01220.</p>
                </div>
              ) : (
                <form onSubmit={handleStudentSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Team Name *</label><input type="text" name="teamName" required value={studentFormData.teamName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">School Name *</label><input type="text" name="schoolName" required value={studentFormData.schoolName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">City *</label><input type="text" name="city" required value={studentFormData.city} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Class Group *</label><select name="classGroup" required value={studentFormData.classGroup} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select class group</option>{['Class 7-8','Class 9-10','Class 11-12'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Number of Team Members *</label><select name="teamMembers" required value={studentFormData.teamMembers} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>

                  <div className="border-t-2 border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Team Leader Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teamLeaderName" required value={studentFormData.teamLeaderName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Class and Section *</label><input type="text" name="teamLeaderClass" required placeholder="e.g., 10-A" value={studentFormData.teamLeaderClass} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number *</label><input type="tel" name="teamLeaderWhatsapp" required value={studentFormData.teamLeaderWhatsapp} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label><input type="email" name="teamLeaderEmail" required value={studentFormData.teamLeaderEmail} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    </div>
                  </div>

                  <div className="border-t-2 border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Teammate 2 Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teammate2Name" required value={studentFormData.teammate2Name} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Class *</label><input type="text" name="teammate2Class" required value={studentFormData.teammate2Class} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    </div>
                  </div>

                  {studentFormData.teamMembers === '3' || studentFormData.teamMembers === '4' ? (
                    <div className="border-t-2 border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-900 text-lg mb-4">Teammate 3 Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teammate3Name" required value={studentFormData.teammate3Name} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Class *</label><input type="text" name="teammate3Class" required value={studentFormData.teammate3Class} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      </div>
                    </div>
                  ) : null}

                  {studentFormData.teamMembers === '4' ? (
                    <div className="border-t-2 border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-900 text-lg mb-4">Teammate 4 Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teammate4Name" required value={studentFormData.teammate4Name} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Class *</label><input type="text" name="teammate4Class" required value={studentFormData.teammate4Class} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      </div>
                    </div>
                  ) : null}

                  <div className="border-t-2 border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Parent Details (Team Leader's Parent)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Parent Name *</label><input type="text" name="parentName" required value={studentFormData.parentName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Relationship *</label><select name="parentRelationship" required value={studentFormData.parentRelationship} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select relationship</option>{['Father','Mother','Guardian'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Parent WhatsApp Number *</label><input type="tel" name="parentWhatsapp" required value={studentFormData.parentWhatsapp} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Parent Email (optional)</label><input type="email" name="parentEmail" value={studentFormData.parentEmail} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300" /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Have you participated in a hackathon before? *</label><select name="previousHackathon" required value={studentFormData.previousHackathon} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300"><option value="">Select option</option>{['Yes','No','This is our first time'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                  </div>

                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Anything you want to tell us (optional)</label><textarea name="additionalInfo" rows={4} value={studentFormData.additionalInfo} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-slate-300 resize-none" /></div>

                  <button type="submit" disabled={submittingStudent} className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed">{submittingStudent ? 'Registering Team...' : 'Register My Team'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HackathonPage;
