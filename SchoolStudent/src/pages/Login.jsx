import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { GraduationCap, Mail, Lock, Building2, ArrowRight, User, ChevronRight } from 'lucide-react';

/* ─── Hand-drawn SVG Artwork Panel ────────────────────────────────────────
   Chalkboard dark background with sketch-style robot, circuit doodles,
   code symbols and real floydschool.in copy.
──────────────────────────────────────────────────────────────────────────── */
const ArtPanel = () => (
  <div
    className="relative flex-1 min-h-screen overflow-hidden flex flex-col"
    style={{ background: '#0d1117' }}
  >
    {/* Subtle paper grain texture overlay */}
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}
    />

    {/* Main SVG Illustration */}
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 640 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Circuit board traces (background) ────────────────────────── */}
      <g stroke="rgba(255,255,255,0.07)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M0 180 H120 V220 H200 V180 H320 V260 H420" />
        <path d="M640 300 H520 V340 H440 V300 H320 V380" />
        <path d="M0 480 H100 V520 H220 V560 H320" />
        <path d="M640 600 H500 V560 H380 V600 H260 V640" />
        <path d="M160 0 V80 H220 V140" />
        <path d="M480 900 V820 H420 V760" />
        {/* Solder dots */}
        <circle cx="120" cy="180" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="200" cy="220" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="320" cy="180" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="520" cy="300" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="440" cy="340" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="100" cy="480" r="3" fill="rgba(255,255,255,0.1)" />
      </g>

      {/* ── Robot character (hand-drawn sketch style) ─────────────────── */}
      <g stroke="rgba(255,255,255,0.88)" strokeLinecap="round" strokeLinejoin="round">

        {/* Robot Head */}
        <rect x="252" y="180" width="136" height="110" rx="16"
          strokeWidth="2.8" stroke="rgba(255,255,255,0.9)"
          fill="rgba(255,255,255,0.04)" />
        {/* Antenna */}
        <line x1="320" y1="180" x2="320" y2="152" strokeWidth="2.5" />
        <circle cx="320" cy="146" r="8" strokeWidth="2.5" fill="rgba(99,211,157,0.25)"
          stroke="rgba(99,211,157,0.9)" />
        {/* Eyes */}
        <rect x="276" y="210" width="30" height="24" rx="6"
          strokeWidth="2.5" fill="rgba(99,211,157,0.2)" stroke="rgba(99,211,157,0.85)" />
        <rect x="334" y="210" width="30" height="24" rx="6"
          strokeWidth="2.5" fill="rgba(99,211,157,0.2)" stroke="rgba(99,211,157,0.85)" />
        <circle cx="291" cy="222" r="5" fill="rgba(99,211,157,0.7)" stroke="none" />
        <circle cx="349" cy="222" r="5" fill="rgba(99,211,157,0.7)" stroke="none" />
        {/* Mouth - smile */}
        <path d="M286 262 Q320 282 354 262" strokeWidth="2.5" stroke="rgba(255,200,87,0.9)" />
        {/* Ear ports */}
        <rect x="241" y="215" width="12" height="20" rx="4"
          strokeWidth="2" fill="rgba(255,255,255,0.06)" />
        <rect x="387" y="215" width="12" height="20" rx="4"
          strokeWidth="2" fill="rgba(255,255,255,0.06)" />
        {/* Brow lines */}
        <line x1="276" y1="205" x2="306" y2="205" strokeWidth="2" stroke="rgba(255,255,255,0.5)" />
        <line x1="334" y1="205" x2="364" y2="205" strokeWidth="2" stroke="rgba(255,255,255,0.5)" />

        {/* Neck */}
        <rect x="304" y="290" width="32" height="22" rx="4"
          strokeWidth="2.2" fill="rgba(255,255,255,0.04)" />

        {/* Robot Body */}
        <rect x="234" y="312" width="172" height="140" rx="18"
          strokeWidth="2.8" fill="rgba(255,255,255,0.03)" />
        {/* Chest panel */}
        <rect x="264" y="336" width="112" height="72" rx="10"
          strokeWidth="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" />
        {/* Chest buttons / indicators */}
        <circle cx="290" cy="358" r="7" strokeWidth="2" fill="rgba(99,211,157,0.25)"
          stroke="rgba(99,211,157,0.7)" />
        <circle cx="316" cy="358" r="7" strokeWidth="2" fill="rgba(255,200,87,0.25)"
          stroke="rgba(255,200,87,0.7)" />
        <circle cx="342" cy="358" r="7" strokeWidth="2" fill="rgba(248,113,113,0.25)"
          stroke="rgba(248,113,113,0.7)" />
        {/* Mini screen on chest */}
        <rect x="275" y="376" width="90" height="22" rx="4"
          strokeWidth="1.5" fill="rgba(99,211,157,0.1)" stroke="rgba(99,211,157,0.5)" />
        <text x="283" y="392" fontFamily="monospace" fontSize="9"
          fill="rgba(99,211,157,0.9)">printf("hello!");</text>

        {/* Left arm */}
        <path d="M234 330 Q204 348 196 380 Q190 406 202 424"
          strokeWidth="2.8" fill="rgba(255,255,255,0.04)" />
        <rect x="186" y="422" width="32" height="22" rx="8"
          strokeWidth="2.5" fill="rgba(255,255,255,0.04)" />

        {/* Right arm - holding book */}
        <path d="M406 330 Q436 348 444 380 Q450 406 438 424"
          strokeWidth="2.8" fill="rgba(255,255,255,0.04)" />
        <rect x="422" y="422" width="32" height="22" rx="8"
          strokeWidth="2.5" fill="rgba(255,255,255,0.04)" />
        {/* Book in right hand */}
        <rect x="434" y="436" width="52" height="66" rx="4"
          strokeWidth="2" fill="rgba(255,200,87,0.1)" stroke="rgba(255,200,87,0.7)" />
        <line x1="434" y1="456" x2="486" y2="456" strokeWidth="1.5"
          stroke="rgba(255,200,87,0.4)" />
        <line x1="434" y1="466" x2="486" y2="466" strokeWidth="1.5"
          stroke="rgba(255,200,87,0.4)" />
        <line x1="434" y1="476" x2="480" y2="476" strokeWidth="1.5"
          stroke="rgba(255,200,87,0.4)" />
        <line x1="434" y1="486" x2="478" y2="486" strokeWidth="1.5"
          stroke="rgba(255,200,87,0.4)" />

        {/* Legs */}
        <rect x="258" y="452" width="56" height="80" rx="14"
          strokeWidth="2.5" fill="rgba(255,255,255,0.03)" />
        <rect x="326" y="452" width="56" height="80" rx="14"
          strokeWidth="2.5" fill="rgba(255,255,255,0.03)" />
        {/* Feet */}
        <rect x="248" y="524" width="72" height="22" rx="8"
          strokeWidth="2.2" fill="rgba(255,255,255,0.04)" />
        <rect x="320" y="524" width="72" height="22" rx="8"
          strokeWidth="2.2" fill="rgba(255,255,255,0.04)" />

        {/* Knee joints */}
        <circle cx="286" cy="494" r="6" strokeWidth="2"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.4)" />
        <circle cx="354" cy="494" r="6" strokeWidth="2"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.4)" />
      </g>

      {/* ── Decorative doodles scattered around ──────────────────────── */}

      {/* Top-left: Atom doodle */}
      <g transform="translate(72, 100)" stroke="rgba(99,211,157,0.65)" strokeWidth="2" fill="none" strokeLinecap="round">
        <ellipse cx="0" cy="0" rx="38" ry="16" />
        <ellipse cx="0" cy="0" rx="38" ry="16" transform="rotate(60)" />
        <ellipse cx="0" cy="0" rx="38" ry="16" transform="rotate(120)" />
        <circle cx="0" cy="0" r="6" fill="rgba(99,211,157,0.3)" stroke="rgba(99,211,157,0.7)" strokeWidth="2.5" />
      </g>

      {/* Top-right: Code brackets </> */}
      <g transform="translate(530, 130)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <text fontFamily="monospace" fontSize="38" fontWeight="bold"
          fill="none" stroke="rgba(255,200,87,0.6)" strokeWidth="2"
          x="-28" y="14">&lt;/&gt;</text>
      </g>

      {/* Mid-left: Lightbulb doodle */}
      <g transform="translate(84, 420)" stroke="rgba(255,200,87,0.7)" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M0,-32 Q28,-32 28,0 Q28,22 14,34 L14,46 L-14,46 L-14,34 Q-28,22 -28,0 Q-28,-32 0,-32 Z" />
        <line x1="-14" y1="50" x2="14" y2="50" />
        <line x1="-12" y1="56" x2="12" y2="56" />
        <line x1="-6" y1="62" x2="6" y2="62" />
        {/* Glow lines */}
        <line x1="0" y1="-42" x2="0" y2="-54" strokeWidth="2" stroke="rgba(255,200,87,0.5)" />
        <line x1="30" y1="-24" x2="40" y2="-32" strokeWidth="2" stroke="rgba(255,200,87,0.5)" />
        <line x1="-30" y1="-24" x2="-40" y2="-32" strokeWidth="2" stroke="rgba(255,200,87,0.5)" />
      </g>

      {/* Mid-right: Gear */}
      <g transform="translate(576, 440)">
        <circle cx="0" cy="0" r="22" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" fill="rgba(255,255,255,0.04)" />
        <circle cx="0" cy="0" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="rgba(255,255,255,0.06)" />
        {[0,45,90,135,180,225,270,315].map(a => {
          const r = a * Math.PI / 180;
          const x1 = Math.cos(r) * 22; const y1 = Math.sin(r) * 22;
          const x2 = Math.cos(r) * 34; const y2 = Math.sin(r) * 34;
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.4)" strokeWidth="5" strokeLinecap="round" />;
        })}
      </g>

      {/* Bottom-left: WiFi / signal waves */}
      <g transform="translate(90, 660)" stroke="rgba(99,211,157,0.55)" fill="none" strokeLinecap="round">
        <path d="M-52,0 Q0,-52 52,0" strokeWidth="2" />
        <path d="M-34,0 Q0,-34 34,0" strokeWidth="2.5" />
        <path d="M-16,0 Q0,-16 16,0" strokeWidth="2.5" />
        <circle cx="0" cy="4" r="5" fill="rgba(99,211,157,0.5)" stroke="rgba(99,211,157,0.7)" strokeWidth="2" />
      </g>

      {/* Bottom-right: Pencil doodle */}
      <g transform="translate(548, 680)" stroke="rgba(255,200,87,0.65)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M-6,-40 L-14,36 L0,46 L14,36 L6,-40 Z" />
        <line x1="-6" y1="-40" x2="6" y2="-40" />
        <path d="M-14,36 L0,56 L14,36" />
        <line x1="-10" y1="28" x2="10" y2="28" />
      </g>

      {/* Scattered dots / stars */}
      {[
        [148,72,3],[502,88,2.5],[60,280,2],[580,250,3],[130,560,2.5],[540,580,2],
        [200,680,3],[460,720,2],[300,120,2],[420,160,2.5],[160,780,2],[500,790,2.5]
      ].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r}
          fill={i%3===0 ? 'rgba(99,211,157,0.6)' : i%3===1 ? 'rgba(255,200,87,0.6)' : 'rgba(255,255,255,0.35)'}
          stroke="none" />
      ))}

      {/* Cross-hatch sketchy lines for texture (lower area) */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeLinecap="round">
        <line x1="0" y1="820" x2="200" y2="640" />
        <line x1="0" y1="860" x2="240" y2="660" />
        <line x1="640" y1="820" x2="440" y2="640" />
        <line x1="640" y1="860" x2="400" y2="660" />
      </g>

      {/* ── Small handwritten-style labels around robot ───────────────── */}
      <text x="100" y="344" fontFamily="'Courier New', monospace" fontSize="11"
        fill="rgba(255,255,255,0.3)" transform="rotate(-12, 100, 344)">build.</text>
      <text x="500" y="344" fontFamily="'Courier New', monospace" fontSize="11"
        fill="rgba(255,255,255,0.3)" transform="rotate(8, 500, 344)">learn.</text>
      <text x="160" y="572" fontFamily="'Courier New', monospace" fontSize="11"
        fill="rgba(255,255,255,0.3)" transform="rotate(-6, 160, 572)">create.</text>
      <text x="448" y="560" fontFamily="'Courier New', monospace" fontSize="11"
        fill="rgba(255,255,255,0.3)" transform="rotate(10, 448, 560)">think.</text>
    </svg>

    {/* ── Text Content overlay ──────────────────────────────────────────── */}
    <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center bg-white/6">
          <GraduationCap className="text-white" size={18} />
        </div>
        <div>
          <p className="text-white font-black text-base tracking-tight leading-none">FLOYD SCHOOL</p>
          <p className="text-white/35 text-[10px] font-mono tracking-widest uppercase">floydschool.in</p>
        </div>
      </div>

      {/* Main headline — real copy from floydschool.in */}
      <div className="max-w-xs space-y-4">
        <div className="space-y-1">
          <p className="text-white/40 text-[11px] font-mono tracking-widest uppercase">Student Portal</p>
          <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight">
            You learn by doing,<br />
            <span style={{ color: '#63d39d' }}>not by watching.</span>
          </h1>
        </div>
        <p className="text-white/45 text-sm font-medium leading-relaxed">
          Master tech with live projects, 1-on-1 mentorship, and real-world skills in AI, Robotics & Web Dev.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {['Robotics', 'AI', 'Web Dev', 'Electronics', 'IoT'].map(tag => (
            <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full border"
              style={{ border: '1px solid rgba(99,211,157,0.3)', color: 'rgba(99,211,157,0.8)', background: 'rgba(99,211,157,0.06)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-white/18 text-[11px] font-mono">
        © 2026 FloydSchool Education Technologies Pvt. Ltd.
      </p>
    </div>
  </div>
);

/* ─── Main Login Page ────────────────────────────────────────────────────── */
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [schools, setSchools] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isManualSchool, setIsManualSchool] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: '', email: '', password: '',
    grade: 'Grade 10', section: 'A',
    fatherName: '', studentMobile: '', fatherMobile: '',
    schoolId: '', schoolNameManual: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await api.get('/school-student/public-schools');
        setSchools(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSignUpData(prev => ({ ...prev, schoolId: res.data.data[0]._id }));
        } else {
          setIsManualSchool(true);
          setSignUpData(prev => ({ ...prev, schoolId: 'other' }));
        }
      } catch {
        setIsManualSchool(true);
        setSignUpData(prev => ({ ...prev, schoolId: 'other' }));
      }
    };
    fetchSchools();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      if (!['school_student', 'admin', 'student'].includes(res.data.user.role)) {
        addToast('Access denied: Not a school student account', 'error');
        setLoading(false); return;
      }
      login(res.data.user, res.data.token);
      addToast('Signed in successfully!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Invalid email or password', 'error');
    } finally { setLoading(false); }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isManualSchool && !signUpData.schoolId) { addToast('Please select your school', 'error'); return; }
    if (isManualSchool && !signUpData.schoolNameManual.trim()) { addToast('Please type your school name', 'error'); return; }
    setLoading(true);
    try {
      const res = await api.post('/school-student/register', {
        ...signUpData,
        schoolId: isManualSchool ? 'other' : signUpData.schoolId
      });
      login(res.data.data, res.data.token);
      addToast('Registration submitted! Awaiting batch allotment.', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally { setLoading(false); }
  };

  const input = "w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all font-medium";
  const inputBare = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all font-medium";
  const label = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Art panel – left */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[54%]">
        <ArtPanel />
      </div>

      {/* Auth panel – right */}
      <div className="flex-1 min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <GraduationCap className="text-white" size={16} />
          </div>
          <span className="font-black text-slate-900 tracking-tight">FLOYD SCHOOL</span>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Student Registration' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isSignUp
                ? 'Register your admission — your mentor will allot you a batch.'
                : 'Sign in to access your batch schedule, sessions & homework.'}
            </p>
          </div>

          {/* Tab */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button onClick={() => setIsSignUp(false)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${!isSignUp ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
              <User size={12} /> Sign In
            </button>
            <button onClick={() => setIsSignUp(true)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isSignUp ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
              <ChevronRight size={12} /> New Registration
            </button>
          </div>

          {/* Sign In */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className={label}>Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input type="email" required value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="student@floydschool.in" className={input} />
                </div>
              </div>
              <div>
                <label className={label}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input type="password" required value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••" className={input} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
                <ArrowRight size={14} />
              </button>
              <p className="text-center text-xs text-slate-500">
                New student?{' '}
                <button type="button" onClick={() => setIsSignUp(true)}
                  className="text-slate-900 font-bold hover:underline">Register here →</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-2.5">
              {/* School */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={label}>{isManualSchool ? 'Type School Name' : 'Select School'}</label>
                  <button type="button"
                    onClick={() => {
                      if (isManualSchool) { setIsManualSchool(false); setSignUpData(prev => ({ ...prev, schoolId: schools[0]?._id || '' })); }
                      else { setIsManualSchool(true); setSignUpData(prev => ({ ...prev, schoolId: 'other' })); }
                    }}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 underline">
                    {isManualSchool ? '← Pick from list' : '✏️ Type manually'}
                  </button>
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 text-slate-400" size={13} />
                  {isManualSchool ? (
                    <input type="text" required autoFocus
                      value={signUpData.schoolNameManual}
                      onChange={e => setSignUpData({ ...signUpData, schoolNameManual: e.target.value })}
                      placeholder="e.g. St. Xavier's High School, Delhi"
                      className={input} />
                  ) : (
                    <select value={signUpData.schoolId}
                      onChange={e => {
                        if (e.target.value === 'other') { setIsManualSchool(true); setSignUpData({ ...signUpData, schoolId: 'other' }); }
                        else { setSignUpData({ ...signUpData, schoolId: e.target.value }); }
                      }}
                      className={input}>
                      {schools.map(s => <option key={s._id} value={s._id}>{s.name} ({s.city})</option>)}
                      <option value="other">✏️ Other / Type manually...</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className={label}>Student Full Name</label>
                <input type="text" required value={signUpData.name}
                  onChange={e => setSignUpData({ ...signUpData, name: e.target.value })}
                  placeholder="e.g. Vikram Singh" className={inputBare} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={label}>Grade</label>
                  <input type="text" required value={signUpData.grade}
                    onChange={e => setSignUpData({ ...signUpData, grade: e.target.value })}
                    placeholder="Grade 10" className={inputBare} />
                </div>
                <div>
                  <label className={label}>Section</label>
                  <input type="text" required value={signUpData.section}
                    onChange={e => setSignUpData({ ...signUpData, section: e.target.value })}
                    placeholder="A" className={inputBare} />
                </div>
              </div>

              <div>
                <label className={label}>Father's Full Name</label>
                <input type="text" required value={signUpData.fatherName}
                  onChange={e => setSignUpData({ ...signUpData, fatherName: e.target.value })}
                  placeholder="e.g. Rajesh Singh" className={inputBare} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={label}>Student Mobile</label>
                  <input type="tel" required value={signUpData.studentMobile}
                    onChange={e => setSignUpData({ ...signUpData, studentMobile: e.target.value })}
                    placeholder="+91 98765 43210" className={inputBare} />
                </div>
                <div>
                  <label className={label}>Father Mobile</label>
                  <input type="tel" required value={signUpData.fatherMobile}
                    onChange={e => setSignUpData({ ...signUpData, fatherMobile: e.target.value })}
                    placeholder="+91 98765 00000" className={inputBare} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={label}>Email</label>
                  <input type="email" required value={signUpData.email}
                    onChange={e => setSignUpData({ ...signUpData, email: e.target.value })}
                    placeholder="student@gmail.com" className={inputBare} />
                </div>
                <div>
                  <label className={label}>Password</label>
                  <input type="password" required value={signUpData.password}
                    onChange={e => setSignUpData({ ...signUpData, password: e.target.value })}
                    placeholder="••••••••" className={inputBare} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Admission Registration'}
                <ArrowRight size={14} />
              </button>

              <p className="text-center text-xs text-slate-500">
                Already registered?{' '}
                <button type="button" onClick={() => setIsSignUp(false)}
                  className="text-slate-900 font-bold hover:underline">Sign in →</button>
              </p>
            </form>
          )}

          <p className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200 font-mono">
            Floyd School · floydschool.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
