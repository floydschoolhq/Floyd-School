import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

/* ─── Hand-drawn SVG Blueprint Artwork Panel ─────────────────────────────
   Chalkboard dark background with STEM laboratory circuitry, microcontrollers,
   sensors, and mentor instruction themes.
──────────────────────────────────────────────────────────────────────────── */
const ArtPanel = () => (
  <div
    className="relative flex-1 min-h-screen overflow-hidden flex flex-col justify-between p-12 select-none"
    style={{ background: '#0b1120' }}
  >
    {/* Subtle paper grain texture overlay */}
    <div
      className="absolute inset-0 opacity-[0.035] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px'
      }}
    />

    {/* Blueprint technical grid */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(100,160,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }}
    />

    {/* SVG Circuit & Classroom Schematics */}
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 640 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="rgba(100,160,255,0.12)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M0 160 H140 V200 H280" />
        <path d="M640 220 H500 V260 H360" />
        <path d="M0 500 H120 V540 H260 V500 H380" />
        <path d="M640 680 H520 V640 H400 V680 H300" />
        <path d="M180 0 V120 H220 V180" />
        <path d="M460 900 V780 H420 V720" />
      </g>

      {/* Solder connection points */}
      {[[140,160],[280,200],[500,220],[360,260],[120,500],[260,540],[520,680],[400,640]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="rgba(100,160,255,0.25)" stroke="rgba(100,160,255,0.4)" strokeWidth="1.5" />
      ))}

      {/* Microcontroller & Laboratory Outline */}
      <g stroke="rgba(255,255,255,0.85)" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Development board outline */}
        <rect x="210" y="320" width="220" height="260" rx="14" strokeWidth="2.5" fill="rgba(255,255,255,0.03)" />
        {/* MCU Chip */}
        <rect x="260" y="380" width="120" height="120" rx="8" strokeWidth="2" fill="rgba(100,160,255,0.08)" stroke="rgba(100,160,255,0.6)" />
        <text x="295" y="445" fill="rgba(255,255,255,0.8)" fontSize="14" fontFamily="monospace" fontWeight="bold">ARM-M4</text>
        {/* Pin header rails */}
        <line x1="225" y1="345" x2="225" y2="555" strokeWidth="2" strokeDasharray="4 6" stroke="rgba(255,255,255,0.4)" />
        <line x1="415" y1="345" x2="415" y2="555" strokeWidth="2" strokeDasharray="4 6" stroke="rgba(255,255,255,0.4)" />
        {/* Status LED indicator */}
        <circle cx="240" cy="350" r="4" fill="rgba(99,211,157,0.8)" stroke="none" />
      </g>
    </svg>

    {/* Brand Header */}
    <div className="relative z-10 flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white font-bold">
        <GraduationCap size={22} />
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-black tracking-tight text-base">FLOYD SCHOOL</span>
          <span className="bg-white/10 text-white/90 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/20">
            MentorSchool
          </span>
        </div>
        <p className="text-white/40 text-xs font-mono">Offline Laboratory Operations Portal</p>
      </div>
    </div>

    {/* Hero Copy */}
    <div className="relative z-10 max-w-md space-y-4">
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
        <Cpu size={13} />
        <span>Physical STEM & Robotics Curriculum</span>
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight leading-snug">
        Conduct and orchestrate offline STEM classrooms.
      </h1>
      <p className="text-white/60 text-xs leading-relaxed font-medium">
        Take session attendance, assign hands-on challenges, evaluate student quizzes, and share hardware workbooks with assigned cohorts.
      </p>

      <div className="pt-2 space-y-2">
        {[
          'One-click batch attendance & analytics',
          'Instant student quiz & homework evaluations',
          'Standardized lesson plans & lab guides',
          'Seamless sync with Student and Partner School portals'
        ].map((f) => (
          <div key={f} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 bg-blue-500/20 border border-blue-400/40">
              <CheckCircle2 size={11} className="text-blue-300" />
            </div>
            <span className="text-white/70 text-xs font-medium">{f}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="relative z-10 text-white/30 text-[11px] font-mono">
      © 2026 FloydSchool Education Technologies Pvt. Ltd.
    </div>
  </div>
);

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
      await login(email.trim(), password);
      addToast('Welcome to MentorSchool Portal', 'success');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      addToast(
        err.response?.data?.message || err.message || 'Login failed. Verify your mentor credentials.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all font-medium';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Artwork Panel */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[56%]">
        <ArtPanel />
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-8 sm:p-12 lg:p-16">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center space-x-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="font-black text-slate-900 text-base tracking-tight">FLOYD SCHOOL</span>
            <span className="ml-2 bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
              MentorSchool
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-7">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Mentor Sign In
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Sign in with your authorized Floyd School mentor credentials to manage assigned batches and students.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mentor Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mentor.test@floydschool.in"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-modern-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to MentorSchool'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Institutional note */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <ShieldCheck size={13} className="text-slate-900" />
              <span>Institutional Access Only</span>
            </div>
            <p className="leading-snug text-slate-500">
              Offline mentors must be registered by a Floyd School administrator or school coordinator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
