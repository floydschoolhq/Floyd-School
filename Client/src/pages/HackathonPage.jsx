import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HackathonPage = () => {
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

  const handleHostSubmit = (e) => { e.preventDefault(); setHostSubmitted(true); };
  const handleStudentSubmit = (e) => { e.preventDefault(); setStudentSubmitted(true); };

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

  return (
    <div className="bg-white text-slate-900 font-inter selection:bg-blue-500 selection:text-white">
      <SEO title="Student Idea Hackathon - ThinkSkool" description="Where school students stop consuming technology and start building with it." />

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

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-blue-50 via-orange-50 to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-orange-300/[0.08] rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-[1440px] mx-auto w-full relative z-10 pt-2 sm:pt-4">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-bold">ThinkSkool Presents</div>
            <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight max-w-5xl">
              Where school students stop consuming technology<br/><span className="text-orange-500">and start building with it.</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-600 max-w-3xl leading-relaxed px-4">
              A one-day inter-school innovation challenge. Conducted on campus. Fully managed by ThinkSkool. Free for every school involved.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 w-full max-w-4xl px-4">
              {['Schools Participated', 'Students Competed', 'Cities', 'Events Conducted'].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="text-xl md:text-3xl font-black text-slate-900 mb-1">{stat.split(' ')[0]}</div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="for-schools" className="py-20 md:py-32 bg-white">
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
                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-24 text-blue-600 font-bold text-sm">{item.time}</div>
                  <div className="text-slate-700">{item.event}</div>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mt-6">Every team gets personalised feedback from the judges. The best ideas do not stop at the event. Outstanding teams are mentored further and given a clear path to state, national and international competitions.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What Your School Receives</h3>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>Your school is featured as the official host institution across all ThinkSkool platforms, social media channels and partner networks. Your name appears on every certificate, banner and communication issued for the event.</p>
              <p>Students from nearby schools participate under your roof. You witness your students solve real problems, present with confidence and compete at a level most schools never give them access to. School leadership gets to see the kind of student outcomes that take years of classroom education to produce, happen in a single day.</p>
              <p>Top teams from your school are supported to represent you at regional, national and international competitions. Every achievement they earn carries your school's name forward.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">The Series</h3>
            <p className="text-lg text-slate-600 leading-relaxed">This hackathon is part of a growing series ThinkSkool is building across school campuses, residential communities, corporate offices and eventually at a national level. Schools that become host partners early are part of every edition that follows. The series is building toward a national inter-school innovation championship. Your school can be part of that from day one.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What We Need From You</h3>
            <div className="space-y-4">
              {['One full school day', 'A hall or open space for teams to work and present', 'A projector or screen if available'].map((req, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-lg text-slate-700">{req}</span>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mt-6">Everything else is on ThinkSkool. Logistics. Coordination. Judging panel. Prizes. Certificates. Materials. All of it.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Bring the Hackathon to Your School</h3>
              <p className="text-slate-600 mb-8">Fill in your details and our team will reach out within 24 hours to discuss the next steps.</p>

              {hostSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">Thank You</h4>
                  <p className="text-green-700">We have received your request and our team will reach out to you within 24 hours on the WhatsApp number you provided. We look forward to bringing this to {hostFormData.schoolName}.</p>
                </div>
              ) : (
                <form onSubmit={handleHostSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">School Name *</label><input type="text" name="schoolName" required value={hostFormData.schoolName} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">City / District *</label><input type="text" name="city" required value={hostFormData.city} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">School Address *</label><input type="text" name="schoolAddress" required value={hostFormData.schoolAddress} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">State *</label><input type="text" name="state" required value={hostFormData.state} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Principal Name *</label><input type="text" name="principalName" required value={hostFormData.principalName} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Your Name (if different) *</label><input type="text" name="yourName" required value={hostFormData.yourName} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Your Designation *</label><input type="text" name="designation" required value={hostFormData.designation} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Official School Email *</label><input type="email" name="email" required value={hostFormData.email} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label><input type="tel" name="phone" required value={hostFormData.phone} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number *</label><input type="tel" name="whatsappNumber" required value={hostFormData.whatsappSame ? hostFormData.phone : hostFormData.whatsappNumber} onChange={handleHostChange} disabled={hostFormData.whatsappSame} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500" /><label className="flex items-center mt-2"><input type="checkbox" name="whatsappSame" checked={hostFormData.whatsappSame} onChange={handleHostChange} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" /><span className="ml-2 text-sm text-slate-600">Same as phone number</span></label></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Preferred Month to Host *</label><select name="preferredMonth" required value={hostFormData.preferredMonth} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select month</option>{['May','June','July','August','September','October','November','Other'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Expected Number of Students *</label><select name="expectedStudents" required value={hostFormData.expectedStudents} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select range</option>{['Under 50','50 to 100','100 to 200','200 and above'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Hall or open space available? *</label><select name="hallAvailable" required value={hostFormData.hallAvailable} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select option</option>{['Yes','We can arrange one','Not sure'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Projector or screen? *</label><select name="projectorAvailable" required value={hostFormData.projectorAvailable} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select option</option>{['Yes','No','Not sure'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Anything you want to tell us (optional)</label><textarea name="additionalInfo" rows={4} value={hostFormData.additionalInfo} onChange={handleHostChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" /></div>
                  <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">Submit Request</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="for-students" className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">Participate</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6">You have ideas. This is where they get tested.</h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">The ThinkSkool Student Idea Hackathon is open to students of Classes 7 to 12. You do not need to know how to code. You do not need a tech background. You need a real problem you care about and a team willing to work on it.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-lg text-slate-600 leading-relaxed">Form a team of 2 to 4. Pick something broken in the world around you. Build your solution. Walk into a room and present it to a panel of industry professionals and national hackathon winners who will challenge your thinking, push your idea further and give you feedback no classroom ever will.</p>
            <p className="text-lg text-slate-600 leading-relaxed mt-4">The best teams do not just win on the day. They get mentored, refined and put on a path to state, national and international competitions where their ideas get a much bigger stage.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">What You Will Walk Away With</h3>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>A certificate every participant receives on the day.</p>
              <p>Real feedback from people who have built companies, won at the highest levels and worked in the industry. Not theory. Not slides. Direct, honest feedback on your idea.</p>
              <p>For the top three teams: cash prizes, medals, ThinkSkool goodies and direct entry into the next stage of the ThinkSkool innovation series.</p>
              <p>For outstanding ideas: mentorship, project refinement support and representation at regional and national level competitions.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">The Judging Panel</h3>
            <p className="text-lg text-slate-600 leading-relaxed">Industry professionals. Engineers. Entrepreneurs. National and international hackathon winners. They are not here to grade you on what you know. They are here to challenge what you think.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Prizes and Recognition</h3>
            <div className="space-y-4">
              {[
                { icon: '🥇', title: 'First Place', desc: 'Cash Prize + Medal + Certificate of Excellence + ThinkSkool Goodies + Entry to next level' },
                { icon: '🥈', title: 'Second Place', desc: 'Cash Prize + Medal + Certificate of Excellence + ThinkSkool Goodies + Entry to next level' },
                { icon: '🥉', title: 'Third Place', desc: 'Cash Prize + Medal + Certificate of Excellence + ThinkSkool Goodies + Entry to next level' },
                { icon: '📜', title: 'All Participants', desc: 'Certificate of Participation' }
              ].map((prize, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="text-3xl">{prize.icon}</div>
                  <div><div className="font-bold text-slate-900 text-lg">{prize.title}</div><div className="text-slate-600">{prize.desc}</div></div>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mt-6">Top ideas selected for national and international showcases.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">FAQ</h3>
            <div className="space-y-6">
              {[
                { q: 'Do I need to know coding to participate?', a: 'No. This is an ideas and problem solving challenge. If you can think clearly and communicate your idea, you can compete.' },
                { q: 'How big can a team be?', a: 'Teams can have 2 to 4 students. Solo participation is not allowed.' },
                { q: 'Can students from different schools form a team?', a: 'When the event is hosted at a school, teams must be from the schools invited to that edition. For independent editions, teams can be from anywhere.' },
                { q: 'Is there a registration fee?', a: 'No. Participation is completely free.' },
                { q: 'What should we bring on the day?', a: 'Your school ID, a laptop if you have one, and your idea. Everything else is provided.' },
                { q: 'What happens to the best ideas after the event?', a: 'Top teams are mentored by the ThinkSkool team and given opportunities to present at regional, national and international competitions.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{item.q}</h4>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Register Your Team</h3>
              <p className="text-slate-600 mb-8">One person registers on behalf of the full team. Make sure all details are correct before submitting.</p>

              {studentSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">You are registered</h4>
                  <p className="text-green-700">We will send event details, venue and timing to your WhatsApp number at least 48 hours before the event. If you have any questions reach us at info@thinkskool.in or +91 83688 01220.</p>
                </div>
              ) : (
                <form onSubmit={handleStudentSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Team Name *</label><input type="text" name="teamName" required value={studentFormData.teamName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">School Name *</label><input type="text" name="schoolName" required value={studentFormData.schoolName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">City *</label><input type="text" name="city" required value={studentFormData.city} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Class Group *</label><select name="classGroup" required value={studentFormData.classGroup} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select class group</option>{['Class 7-8','Class 9-10','Class 11-12'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Number of Team Members *</label><select name="teamMembers" required value={studentFormData.teamMembers} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>

                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Team Leader Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teamLeaderName" required value={studentFormData.teamLeaderName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Class and Section *</label><input type="text" name="teamLeaderClass" required placeholder="e.g., 10-A" value={studentFormData.teamLeaderClass} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number *</label><input type="tel" name="teamLeaderWhatsapp" required value={studentFormData.teamLeaderWhatsapp} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label><input type="email" name="teamLeaderEmail" required value={studentFormData.teamLeaderEmail} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Teammate 2 Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teammate2Name" required value={studentFormData.teammate2Name} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Class *</label><input type="text" name="teammate2Class" required value={studentFormData.teammate2Class} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    </div>
                  </div>

                  {studentFormData.teamMembers === '3' || studentFormData.teamMembers === '4' ? (
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-900 text-lg mb-4">Teammate 3 Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teammate3Name" required value={studentFormData.teammate3Name} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Class *</label><input type="text" name="teammate3Class" required value={studentFormData.teammate3Class} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      </div>
                    </div>
                  ) : null}

                  {studentFormData.teamMembers === '4' ? (
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-900 text-lg mb-4">Teammate 4 Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label><input type="text" name="teammate4Name" required value={studentFormData.teammate4Name} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Class *</label><input type="text" name="teammate4Class" required value={studentFormData.teammate4Class} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      </div>
                    </div>
                  ) : null}

                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Parent Details (Team Leader's Parent)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Parent Name *</label><input type="text" name="parentName" required value={studentFormData.parentName} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Relationship *</label><select name="parentRelationship" required value={studentFormData.parentRelationship} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select relationship</option>{['Father','Mother','Guardian'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Parent WhatsApp Number *</label><input type="tel" name="parentWhatsapp" required value={studentFormData.parentWhatsapp} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Parent Email (optional)</label><input type="email" name="parentEmail" value={studentFormData.parentEmail} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Have you participated in a hackathon before? *</label><select name="previousHackathon" required value={studentFormData.previousHackathon} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="">Select option</option>{['Yes','No','This is our first time'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                  </div>

                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Anything you want to tell us (optional)</label><textarea name="additionalInfo" rows={4} value={studentFormData.additionalInfo} onChange={handleStudentChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" /></div>

                  <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">Register My Team</button>
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
