import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { GraduationCap, Mail, Lock, Building2, ArrowRight, BookOpen, Users, Award, Zap, Star, ChevronRight, User } from 'lucide-react';

/* ─── Floating Particle ─────────────────────────────────────────────────── */
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full opacity-20 animate-pulse"
    style={style}
  />
);

/* ─── Art Panel ──────────────────────────────────────────────────────────── */
const ArtPanel = () => {
  const stats = [
    { icon: Users, label: 'Active Students', value: '2,400+' },
    { icon: BookOpen, label: 'Batches Running', value: '48' },
    { icon: Award, label: 'Schools Partnered', value: '32' },
    { icon: Zap, label: 'Sessions Completed', value: '8,900+' },
  ];

  return (
    <div className="relative flex-1 min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-10 lg:p-14">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] right-[20%] w-[40%] h-[40%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Floating particles */}
      {[
        { width: 6, height: 6, background: '#818cf8', top: '15%', left: '20%', animationDelay: '0s' },
        { width: 10, height: 10, background: '#34d399', top: '30%', left: '70%', animationDelay: '0.8s' },
        { width: 8, height: 8, background: '#fbbf24', top: '60%', left: '15%', animationDelay: '1.5s' },
        { width: 5, height: 5, background: '#f472b6', top: '75%', left: '60%', animationDelay: '0.4s' },
        { width: 12, height: 12, background: '#818cf8', top: '85%', left: '35%', animationDelay: '2s' },
        { width: 7, height: 7, background: '#34d399', top: '20%', left: '50%', animationDelay: '1.2s' },
      ].map((p, i) => <Particle key={i} style={p} />)}

      {/* Geometric grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Top Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
            <GraduationCap className="text-white" size={22} />
          </div>
          <div>
            <p className="text-white font-black text-lg tracking-tight leading-none">FLOYDSCHOOL</p>
            <p className="text-white/50 text-[11px] font-medium tracking-wider uppercase">Offline Learning Platform</p>
          </div>
        </div>
      </div>

      {/* Main Headline */}
      <div className="relative z-10 space-y-6">
        {/* Large artistic headline */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4 backdrop-blur">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-white/80 text-[11px] font-semibold tracking-wider uppercase">India's Leading STEM Lab Network</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Unlock Your
            <span className="block" style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Future in
            </span>
            <span className="block text-white/90">STEM & Science</span>
          </h1>
          <p className="text-white/50 text-sm font-medium mt-4 leading-relaxed max-w-sm">
            Join India's most advanced hands-on robotics, electronics & coding labs — right inside your school.
          </p>
        </div>

        {/* Floating achievement cards */}
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label}
              className="bg-white/8 backdrop-blur border border-white/10 rounded-xl p-3 hover:bg-white/12 transition-all group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon size={13} className="text-indigo-300" />
                </div>
              </div>
              <p className="text-white font-black text-xl leading-none">{value}</p>
              <p className="text-white/45 text-[10px] font-semibold uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial strip */}
        <div className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-xl p-3 max-w-sm backdrop-blur">
          <div className="flex -space-x-2 shrink-0">
            {['#818cf8', '#34d399', '#fbbf24', '#f472b6'].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: c }}>
                {['R', 'A', 'S', 'P'][i]}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white/90 text-xs font-semibold leading-snug">"Best science lab program in our city!"</p>
            <p className="text-white/40 text-[10px] font-medium">— 2,400+ students enrolled this year</p>
          </div>
        </div>
      </div>

      {/* Bottom footer note */}
      <div className="relative z-10">
        <p className="text-white/25 text-[11px] font-mono">© 2026 FloydSchool Education Technologies Pvt. Ltd.</p>
      </div>
    </div>
  );
};

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
        setLoading(false);
        return;
      }
      login(res.data.user, res.data.token);
      addToast('Signed in successfully!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isManualSchool && !signUpData.schoolId) {
      addToast('Please select your school', 'error'); return;
    }
    if (isManualSchool && !signUpData.schoolNameManual.trim()) {
      addToast('Please type your school name', 'error'); return;
    }
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
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all font-medium";
  const inputClsNoIcon = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all font-medium";
  const labelCls = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Art Panel (hidden on mobile) ─────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%]">
        <ArtPanel />
      </div>

      {/* ── Right Auth Panel ───────────────────────── */}
      <div className="flex-1 min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Mobile branding */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
            <GraduationCap className="text-white" size={18} />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">FLOYDSCHOOL</span>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Student Admission' : 'Welcome back'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isSignUp
                ? 'Register your admission to get your batch allotted by your mentor.'
                : 'Sign in to access your batch schedule, sessions & homework.'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                !isSignUp ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User size={13} />
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isSignUp ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ChevronRight size={13} />
              New Registration
            </button>
          </div>

          {/* ── Sign In Form ── */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input type="email" required value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="student@floydschool.in"
                    className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input type="password" required value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputCls} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                <span>{loading ? 'Authenticating...' : 'Sign In to Student Portal'}</span>
                <ArrowRight size={15} />
              </button>
              <p className="text-center text-xs text-slate-500 font-medium">
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsSignUp(true)} className="text-slate-900 font-bold hover:underline">
                  Register here →
                </button>
              </p>
            </form>
          ) : (
            /* ── Sign Up Form ── */
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              {/* School */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>{isManualSchool ? 'Type School Name' : 'Select School'}</label>
                  <button type="button"
                    onClick={() => {
                      if (isManualSchool) {
                        setIsManualSchool(false);
                        setSignUpData(prev => ({ ...prev, schoolId: schools[0]?._id || '' }));
                      } else {
                        setIsManualSchool(true);
                        setSignUpData(prev => ({ ...prev, schoolId: 'other' }));
                      }
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline">
                    {isManualSchool ? '← Pick from list' : '✏️ Enter manually'}
                  </button>
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  {isManualSchool ? (
                    <input type="text" required autoFocus
                      value={signUpData.schoolNameManual}
                      onChange={e => setSignUpData({ ...signUpData, schoolNameManual: e.target.value })}
                      placeholder="e.g. St. Xavier's High School, Delhi"
                      className={inputCls} />
                  ) : (
                    <select value={signUpData.schoolId}
                      onChange={e => {
                        if (e.target.value === 'other') { setIsManualSchool(true); setSignUpData({ ...signUpData, schoolId: 'other' }); }
                        else { setSignUpData({ ...signUpData, schoolId: e.target.value }); }
                      }}
                      className={inputCls}>
                      {schools.map(s => <option key={s._id} value={s._id}>{s.name} ({s.city})</option>)}
                      <option value="other">✏️ Other / Type manually...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className={labelCls}>Student Full Name</label>
                <input type="text" required value={signUpData.name}
                  onChange={e => setSignUpData({ ...signUpData, name: e.target.value })}
                  placeholder="e.g. Vikram Singh" className={inputClsNoIcon} />
              </div>

              {/* Grade / Section */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Class / Grade</label>
                  <input type="text" required value={signUpData.grade}
                    onChange={e => setSignUpData({ ...signUpData, grade: e.target.value })}
                    placeholder="Grade 10" className={inputClsNoIcon} />
                </div>
                <div>
                  <label className={labelCls}>Section</label>
                  <input type="text" required value={signUpData.section}
                    onChange={e => setSignUpData({ ...signUpData, section: e.target.value })}
                    placeholder="A" className={inputClsNoIcon} />
                </div>
              </div>

              {/* Father name */}
              <div>
                <label className={labelCls}>Father's Full Name</label>
                <input type="text" required value={signUpData.fatherName}
                  onChange={e => setSignUpData({ ...signUpData, fatherName: e.target.value })}
                  placeholder="e.g. Rajesh Singh" className={inputClsNoIcon} />
              </div>

              {/* Mobiles */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Student Mobile</label>
                  <input type="tel" required value={signUpData.studentMobile}
                    onChange={e => setSignUpData({ ...signUpData, studentMobile: e.target.value })}
                    placeholder="+91 98765 43210" className={inputClsNoIcon} />
                </div>
                <div>
                  <label className={labelCls}>Father Mobile</label>
                  <input type="tel" required value={signUpData.fatherMobile}
                    onChange={e => setSignUpData({ ...signUpData, fatherMobile: e.target.value })}
                    placeholder="+91 98765 00000" className={inputClsNoIcon} />
                </div>
              </div>

              {/* Email / Password */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Gmail / Email</label>
                  <input type="email" required value={signUpData.email}
                    onChange={e => setSignUpData({ ...signUpData, email: e.target.value })}
                    placeholder="student@gmail.com" className={inputClsNoIcon} />
                </div>
                <div>
                  <label className={labelCls}>Create Password</label>
                  <input type="password" required value={signUpData.password}
                    onChange={e => setSignUpData({ ...signUpData, password: e.target.value })}
                    placeholder="••••••••" className={inputClsNoIcon} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-1">
                <span>{loading ? 'Submitting...' : 'Submit Admission Registration'}</span>
                <ArrowRight size={15} />
              </button>

              <p className="text-center text-xs text-slate-500 font-medium">
                Already registered?{' '}
                <button type="button" onClick={() => setIsSignUp(false)} className="text-slate-900 font-bold hover:underline">
                  Sign in →
                </button>
              </p>
            </form>
          )}

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-200">
            Secure platform by FloydSchool Education Technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
