import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { School, Lock, Mail, ArrowRight, Users, BookOpen, Award, BarChart2, Star, CheckCircle2 } from 'lucide-react';

/* ─── Floating Particle ─────────────────────────────────────────────────── */
const Particle = ({ style }) => (
  <div className="absolute rounded-full opacity-20 animate-pulse" style={style} />
);

/* ─── Art Panel ──────────────────────────────────────────────────────────── */
const ArtPanel = () => {
  const stats = [
    { icon: Users, label: 'Students Enrolled', value: '2,400+' },
    { icon: BookOpen, label: 'Active Sessions', value: '320+' },
    { icon: Award, label: 'Partner Schools', value: '32' },
    { icon: BarChart2, label: 'Attendance Rate', value: '94%' },
  ];

  const features = [
    'Real-time student roster & roll numbers',
    'Parent contact directory management',
    'Batch schedule & timetable control',
    'Homework assignment tracking',
    'Attendance analytics dashboard',
  ];

  return (
    <div className="relative flex-1 min-h-screen overflow-hidden flex flex-col justify-between p-10 lg:p-14"
      style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[65%] h-[65%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[55%] h-[55%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)' }} />
        <div className="absolute top-[50%] left-[55%] w-[35%] h-[35%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.18) 0%, transparent 70%)' }} />
      </div>

      {/* Floating particles */}
      {[
        { width: 6, height: 6, background: '#a78bfa', top: '12%', left: '25%', animationDelay: '0s' },
        { width: 10, height: 10, background: '#22d3ee', top: '28%', left: '72%', animationDelay: '0.7s' },
        { width: 7, height: 7, background: '#fb923c', top: '58%', left: '12%', animationDelay: '1.4s' },
        { width: 5, height: 5, background: '#f472b6', top: '72%', left: '65%', animationDelay: '0.3s' },
        { width: 9, height: 9, background: '#a78bfa', top: '88%', left: '38%', animationDelay: '2s' },
        { width: 6, height: 6, background: '#22d3ee', top: '18%', left: '55%', animationDelay: '1.1s' },
      ].map((p, i) => <Particle key={i} style={p} />)}

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

      {/* Top Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)' }}>
            <School className="text-white" size={22} />
          </div>
          <div>
            <p className="text-white font-black text-lg tracking-tight leading-none">FLOYDSCHOOL</p>
            <p className="text-white/45 text-[11px] font-medium tracking-wider uppercase">Partner School Network</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-8">
        {/* Badge */}
        <div>
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-3 py-1 mb-5 backdrop-blur"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Star size={12} className="text-violet-400 fill-violet-400" />
            <span className="text-white/75 text-[11px] font-semibold tracking-wider uppercase">India's #1 School STEM Collaboration Platform</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Empower Your
            <span className="block" style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              School with
            </span>
            <span className="block text-white/85">World-Class Labs</span>
          </h1>
          <p className="text-white/45 text-sm font-medium mt-4 leading-relaxed max-w-sm">
            The complete operations dashboard for partner schools — manage students, batches, schedules and parent communication in one place.
          </p>
        </div>

        {/* Feature checklist */}
        <div className="space-y-2 max-w-xs">
          {features.map(f => (
            <div key={f} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)' }}>
                <CheckCircle2 size={11} className="text-violet-300" />
              </div>
              <span className="text-white/60 text-xs font-medium">{f}</span>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label}
              className="rounded-xl p-3 hover:bg-white/10 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <Icon size={14} className="text-violet-300 mb-1.5" />
              <p className="text-white font-black text-xl leading-none">{value}</p>
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <p className="text-white/20 text-[11px] font-mono">© 2026 FloydSchool Education Technologies Pvt. Ltd.</p>
      </div>
    </div>
  );
};

/* ─── Main Login Page ────────────────────────────────────────────────────── */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome to Partner School Portal', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Login failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-all font-medium";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Art Panel ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%]">
        <ArtPanel />
      </div>

      {/* ── Right Auth Panel ───────────────────────── */}
      <div className="flex-1 min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-8 sm:p-12 lg:p-14">
        {/* Mobile branding */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)' }}>
            <School className="text-white" size={18} />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">FLOYDSCHOOL</span>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              School Coordinator<br />Sign In
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Access your school's student roster, batch management, and parent communication dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Coordinator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="coordinator@partnerschool.edu"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              style={{
                background: loading ? '#64748b' : 'linear-gradient(135deg, #7c3aed, #0891b2)',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.3)'
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Trust signals */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your account gives you access to</p>
            {[
              'Live student attendance & class logs',
              'Batch schedule & venue management',
              'Parent contact & communication tools',
            ].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-violet-500 shrink-0" />
                <span className="text-xs text-slate-600 font-medium">{f}</span>
              </div>
            ))}
          </div>

          {/* Bottom link */}
          <p className="text-center text-xs text-slate-400 font-medium">
            Interested in partnering?{' '}
            <a href="https://floydschool.in" target="_blank" rel="noreferrer"
              className="text-violet-600 font-semibold hover:underline">
              Learn More →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
