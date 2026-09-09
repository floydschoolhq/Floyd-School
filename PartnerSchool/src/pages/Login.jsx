import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { School, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

/* ─── Hand-drawn SVG Artwork Panel ────────────────────────────────────────
   Blueprint/chalkboard style — school building connected to nodes,
   circuit traces, tools, and real floydschool.in copy.
──────────────────────────────────────────────────────────────────────────── */
const ArtPanel = () => (
  <div
    className="relative flex-1 min-h-screen overflow-hidden flex flex-col"
    style={{ background: '#0b1120' }}
  >
    {/* Paper grain texture */}
    <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px'
      }}
    />

    {/* Blueprint grid */}
    <div className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(100,160,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
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
      {/* ── Circuit / connection lines ──────────────────────────────── */}
      <g stroke="rgba(100,160,255,0.12)" strokeWidth="1.5" strokeLinecap="round">
        {/* Horizontal traces */}
        <path d="M0 220 H140 V200 H280" />
        <path d="M640 280 H500 V260 H360" />
        <path d="M0 560 H120 V580 H260 V560 H380" />
        <path d="M640 640 H520 V620 H400 V640 H300" />
        {/* Vertical traces */}
        <path d="M180 0 V100 H220 V160" />
        <path d="M460 900 V800 H420 V740" />
        {/* Solder dots */}
        {[[140,220],[280,200],[500,280],[360,260],[120,560],[260,580],[520,640],[400,620]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="rgba(100,160,255,0.18)" stroke="rgba(100,160,255,0.35)" strokeWidth="1.5" />
        ))}
      </g>

      {/* ── School Building (hand-drawn) ─────────────────────────────── */}
      <g stroke="rgba(255,255,255,0.82)" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Main building body */}
        <rect x="190" y="320" width="260" height="200" rx="4" strokeWidth="2.8"
          fill="rgba(255,255,255,0.03)" />
        {/* Roof */}
        <path d="M174 320 L320 210 L466 320" strokeWidth="3" />
        {/* Roof ridge */}
        <line x1="320" y1="210" x2="320" y2="240" strokeWidth="2" stroke="rgba(255,255,255,0.5)" />
        {/* Flag on top */}
        <line x1="320" y1="200" x2="320" y2="160" strokeWidth="2" stroke="rgba(255,255,255,0.6)" />
        <path d="M320 160 L354 174 L320 188" strokeWidth="2" fill="rgba(255,200,87,0.25)"
          stroke="rgba(255,200,87,0.8)" />

        {/* Door */}
        <rect x="296" y="430" width="48" height="90" rx="4" strokeWidth="2.5"
          fill="rgba(255,255,255,0.04)" />
        {/* Door handle */}
        <circle cx="326" cy="480" r="3" fill="rgba(255,200,87,0.7)" stroke="none" />
        {/* Door arch top */}
        <path d="M296 444 Q320 420 344 444" strokeWidth="2" stroke="rgba(255,255,255,0.5)" />

        {/* Ground floor windows */}
        <rect x="214" y="360" width="54" height="46" rx="4" strokeWidth="2.2"
          fill="rgba(100,160,255,0.06)" stroke="rgba(100,160,255,0.5)" />
        <rect x="372" y="360" width="54" height="46" rx="4" strokeWidth="2.2"
          fill="rgba(100,160,255,0.06)" stroke="rgba(100,160,255,0.5)" />
        {/* Window cross-bars */}
        <line x1="241" y1="360" x2="241" y2="406" strokeWidth="1.5" stroke="rgba(100,160,255,0.35)" />
        <line x1="214" y1="383" x2="268" y2="383" strokeWidth="1.5" stroke="rgba(100,160,255,0.35)" />
        <line x1="399" y1="360" x2="399" y2="406" strokeWidth="1.5" stroke="rgba(100,160,255,0.35)" />
        <line x1="372" y1="383" x2="426" y2="383" strokeWidth="1.5" stroke="rgba(100,160,255,0.35)" />

        {/* Upper windows (in roof space) */}
        <rect x="258" y="270" width="40" height="32" rx="4" strokeWidth="2"
          fill="rgba(100,160,255,0.06)" stroke="rgba(100,160,255,0.45)" />
        <rect x="342" y="270" width="40" height="32" rx="4" strokeWidth="2"
          fill="rgba(100,160,255,0.06)" stroke="rgba(100,160,255,0.45)" />

        {/* Pillars */}
        <rect x="214" y="430" width="16" height="90" rx="3" strokeWidth="2"
          fill="rgba(255,255,255,0.03)" />
        <rect x="410" y="430" width="16" height="90" rx="3" strokeWidth="2"
          fill="rgba(255,255,255,0.03)" />

        {/* Steps */}
        <line x1="272" y1="520" x2="368" y2="520" strokeWidth="2.5" />
        <line x1="258" y1="510" x2="382" y2="510" strokeWidth="2" stroke="rgba(255,255,255,0.5)" />

        {/* "FLOYD SCHOOL" text on building */}
        <text x="320" y="348" fontFamily="'Courier New', monospace" fontSize="10"
          fill="rgba(255,255,255,0.5)" textAnchor="middle" letterSpacing="3">
          FLOYD SCHOOL
        </text>
      </g>

      {/* ── Connected nodes (partner schools) ─────────────────────────── */}
      {/* Node lines from building */}
      <g stroke="rgba(255,200,87,0.35)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="6 4">
        <line x1="190" y1="380" x2="100" y2="310" />
        <line x1="190" y1="430" x2="80" y2="480" />
        <line x1="190" y1="480" x2="110" y2="600" />
        <line x1="450" y1="380" x2="548" y2="310" />
        <line x1="450" y1="430" x2="568" y2="480" />
        <line x1="450" y1="480" x2="530" y2="600" />
      </g>

      {/* Partner school nodes */}
      {[
        [100, 310], [80, 480], [110, 600],
        [548, 310], [568, 480], [530, 600]
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" stroke="rgba(255,200,87,0.55)" strokeWidth="2"
            fill="rgba(255,200,87,0.07)" />
          <circle cx={cx} cy={cy} r="12" stroke="rgba(255,200,87,0.4)" strokeWidth="1.5"
            fill="rgba(255,200,87,0.12)" />
          <text x={cx} y={cy + 4} fontFamily="'Courier New', monospace" fontSize="9"
            fill="rgba(255,200,87,0.8)" textAnchor="middle">SCH</text>
        </g>
      ))}

      {/* ── Decorative doodles ─────────────────────────────────────────── */}

      {/* Top-left: Ruler / measuring tool */}
      <g transform="translate(68, 130)" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" fill="rgba(255,255,255,0.04)">
        <rect x="-10" y="-42" width="20" height="84" rx="3" />
        {[-30,-20,-10,0,10,20,30].map((y,i) => (
          <line key={i} x1={i%3===0 ? -10 : -6} y1={y} x2="10" y2={y} strokeWidth={i%3===0?2:1.5} stroke="rgba(255,255,255,0.4)" />
        ))}
      </g>

      {/* Top-right: Compass doodle */}
      <g transform="translate(572, 140)" stroke="rgba(100,160,255,0.65)" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <circle cx="0" cy="0" r="28" />
        <line x1="0" y1="-28" x2="0" y2="-38" strokeWidth="2" />
        <line x1="28" y1="0" x2="38" y2="0" strokeWidth="2" />
        <line x1="0" y1="28" x2="0" y2="38" strokeWidth="2" />
        <line x1="-28" y1="0" x2="-38" y2="0" strokeWidth="2" />
        <text x="-4" y="-12" fontFamily="monospace" fontSize="9" fill="rgba(100,160,255,0.7)">N</text>
        <circle cx="0" cy="0" r="4" fill="rgba(100,160,255,0.4)" stroke="rgba(100,160,255,0.7)" strokeWidth="2" />
      </g>

      {/* Mid-left: Pencil + protractor */}
      <g transform="translate(56, 680)" stroke="rgba(255,200,87,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* pencil */}
        <path d="M-8,-44 L-8,28 L0,44 L8,28 L8,-44 Z" />
        <line x1="-8" y1="-44" x2="8" y2="-44" />
        <line x1="-8" y1="24" x2="8" y2="24" />
      </g>

      {/* Bottom-right: Clipboard with checklist */}
      <g transform="translate(562, 680)" stroke="rgba(99,211,157,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="-28" y="-50" width="56" height="72" rx="4" fill="rgba(99,211,157,0.05)" />
        <rect x="-14" y="-60" width="28" height="14" rx="4" />
        {[-28,-14,0].map((y, i) => (
          <g key={i}>
            <circle cx="-14" cy={y} r="4" fill={i < 2 ? 'rgba(99,211,157,0.5)' : 'none'} />
            <line x1="-5" y1={y} x2="18" y2={y} strokeWidth="1.8" />
          </g>
        ))}
      </g>

      {/* Scattered dots */}
      {[
        [152,80,3],[488,96,2.5],[60,360,2],[580,360,3],[60,540,2.5],[580,540,2],
        [200,740,2.5],[440,740,2],[300,136,2],[140,440,2.5],[500,440,2]
      ].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r}
          fill={i%3===0 ? 'rgba(100,160,255,0.55)' : i%3===1 ? 'rgba(255,200,87,0.55)' : 'rgba(99,211,157,0.4)'}
          stroke="none" />
      ))}

      {/* Small sketchy labels */}
      <text x="42" y="516" fontFamily="'Courier New', monospace" fontSize="9"
        fill="rgba(255,255,255,0.2)" transform="rotate(-90,42,516)">manage.</text>
      <text x="598" y="516" fontFamily="'Courier New', monospace" fontSize="9"
        fill="rgba(255,255,255,0.2)" transform="rotate(90,598,516)">connect.</text>
      <text x="320" y="660" fontFamily="'Courier New', monospace" fontSize="9"
        fill="rgba(255,255,255,0.18)" textAnchor="middle">— structured path from basics to real-world outcomes —</text>

      {/* Cross-hatch texture at bottom corners */}
      <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeLinecap="round">
        <line x1="0" y1="840" x2="180" y2="680" />
        <line x1="0" y1="880" x2="200" y2="700" />
        <line x1="640" y1="840" x2="460" y2="680" />
        <line x1="640" y1="880" x2="440" y2="700" />
      </g>
    </svg>

    {/* ── Text Content overlay ──────────────────────────────────────────── */}
    <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center"
          style={{ background: 'rgba(100,160,255,0.1)' }}>
          <School className="text-white" size={18} />
        </div>
        <div>
          <p className="text-white font-black text-base tracking-tight leading-none">FLOYD SCHOOL</p>
          <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase">floydschool.in</p>
        </div>
      </div>

      {/* Main headline */}
      <div className="max-w-xs space-y-4">
        <div className="space-y-1">
          <p className="text-white/35 text-[11px] font-mono tracking-widest uppercase">Partner School Network</p>
          <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight">
            We teach you<br />
            <span style={{ color: '#64a0ff' }}>to think like</span><br />
            <span style={{ color: '#64a0ff' }}>a builder.</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm font-medium leading-relaxed">
          Industrial-grade tech training, 1-on-1 mentorship, and real-world project experience — inside your school.
        </p>
        {/* Features */}
        <div className="space-y-2 pt-1">
          {[
            'Manage student rosters & roll numbers',
            'Track batch schedules & attendance',
            'Parent contact communication tools',
          ].map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                style={{ background: 'rgba(100,160,255,0.15)', border: '1px solid rgba(100,160,255,0.4)' }}>
                <CheckCircle2 size={10} style={{ color: 'rgba(100,160,255,0.9)' }} />
              </div>
              <span className="text-white/50 text-xs font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-white/15 text-[11px] font-mono">
        © 2026 FloydSchool Education Technologies Pvt. Ltd.
      </p>
    </div>
  </div>
);

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

  const input = "w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-medium";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Art panel – left */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[56%]">
        <ArtPanel />
      </div>

      {/* Auth panel – right */}
      <div className="flex-1 min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-8 sm:p-12 lg:p-14">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
            <School className="text-white" size={18} />
          </div>
          <span className="font-black text-slate-900 tracking-tight">FLOYD SCHOOL</span>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              School Coordinator<br />Sign In
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Access your school's student roster, batch management, and operations dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Coordinator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="coordinator@partnerschool.edu"
                  className={input} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={input} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm">
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Access feature list */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your coordinator account gives you</p>
            {[
              'Live student roster & roll number registry',
              'Batch schedule & timetable management',
              'Attendance logs & parent contact directory',
              'Homework assignment & session tracker',
            ].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 font-medium">{f}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 font-mono">
            Interested in partnering?{' '}
            <a href="https://floydschool.in" target="_blank" rel="noreferrer"
              className="text-slate-700 font-bold hover:underline">floydschool.in →</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
