import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code2,
  Eye,
  EyeOff,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  User,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { PortalContext } from '../contexts/PortalProvider';
import SEO from '../components/common/SEO';
import studentAvatar from '../assets/avatars/boy1.jpg';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'For Schools', to: '/school-partnerships' },
  { label: 'Programs', to: '/online-program' },
  { label: 'Exhibition', to: '/bootcamp-gallery' },
  { label: 'Downloads', to: '/downloads' },
  { label: 'FAQ', to: '/faq' },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(PortalContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy.');
      toast.error('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      updateUser(response.data);
      toast.success('Account created successfully! Welcome to Floyd School.');
      navigate('/student/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-950 flex flex-col justify-between" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SEO
        title="Student Registration — Floyd School"
        description="Create your student profile with Floyd School to unlock hands-on AI, Robotics, Coding, and Web Development courses."
      />

      {/* ── Header Navigation ── */}
      <header className="relative z-20 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1800px] items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Floyd School Home">
            <img
              src="/logo-black.png"
              alt="Floyd School"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          <nav className="hidden min-h-9 flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-[#c55bab] via-[#7f62bf] to-[#58c7e7] px-4 py-1.5 shadow-sm md:flex">
            <div className="flex max-w-4xl flex-wrap items-center justify-center gap-1.5">
              {NAV_ITEMS.map((item) => {
                const className =
                  'rounded-md px-3 py-1 text-[12px] font-extrabold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80';

                return item.to ? (
                  <Link key={item.label} to={item.to} className={className}>
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className={className}>
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/signup"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#cf61b0] px-3.5 text-[12px] font-black text-white shadow-sm transition hover:bg-[#bd4e9d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7a55c4]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register
            </Link>
            <Link
              to="/login"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#7057bd] bg-[#7057bd]/10 px-3.5 text-[12px] font-black text-[#7057bd] transition hover:bg-[#7057bd] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7a55c4]"
            >
              <User className="h-3.5 w-3.5" />
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Signup Section ── */}
      <main className="relative flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-16 flex items-center justify-center">
        {/* Floating Shapes */}
        <div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-[42%] h-2.5 w-2.5 rounded-full border-2 border-orange-400 opacity-70 animate-pulse" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[15%] top-[28%] text-4xl font-light text-green-500 opacity-60 select-none">~</div>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-6 text-xl font-medium text-[#7657ff] opacity-50 select-none">x</div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-16 left-1/2 h-0 w-0 border-b-[10px] border-l-[8px] border-t-[10px] border-b-transparent border-l-green-500 border-t-transparent opacity-60" />

        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16">
          
          {/* LEFT: Illustration */}
          <div className="hidden justify-center lg:flex">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[340px] w-[380px]"
            >
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 330" fill="none" aria-hidden="true">
                <path d="M90 145H48c-14 0-24-10-24-24V78h82" stroke="#7657c4" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M300 70h56v132c0 16-12 28-28 28h-54" stroke="#cf61b0" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M95 68h70" stroke="#7657c4" strokeWidth="2" />
                <path d="M258 42h58" stroke="#cf61b0" strokeWidth="2" />
              </svg>

              <div className="absolute left-1/2 top-1/2 h-56 w-64 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[52%_48%_44%_56%/58%_44%_56%_42%] bg-[#fff0c8] shadow-[0_20px_50px_rgba(247,217,71,0.25)] border-2 border-white">
                <img
                  src={studentAvatar}
                  alt="Floyd School Student"
                  className="h-full w-full scale-125 object-cover object-[center_42%]"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fff0c8] to-transparent" />
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-10 top-28 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100"
              >
                <GraduationCap className="h-5 w-5 text-[#7657c4]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute right-8 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100"
              >
                <BookOpen className="h-7 w-7 text-[#f26f33]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-12 left-14 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6657f5] text-white shadow-xl"
              >
                <Code2 className="h-7 w-7" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute right-16 top-[88px] flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff793f] text-white shadow-xl"
              >
                <Lightbulb className="h-6 w-6" />
              </motion.div>

              <div className="absolute left-[86px] top-[74px] h-3 w-3 rounded-full bg-[#ffb5b0]" />
              <div className="absolute left-[108px] top-[66px] h-3 w-3 rounded-full bg-[#5bc7e8]" />
              <div className="absolute bottom-8 right-[88px] h-5 w-5 rounded-full bg-[#f7d947]" />
              <div className="absolute bottom-10 right-10 h-5 w-5 rounded-full bg-[#ffb0b7]" />
            </motion.div>
          </div>

          {/* RIGHT: Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-[520px]"
          >
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#f5db3d_0%,#67cfdf_28%,#d35da8_57%,#7457bc_100%)] p-[6px] shadow-[0_18px_50px_rgba(116,87,188,0.17)]">
              <div className="rounded-[18px] bg-white px-5 py-7 sm:px-8 sm:py-8">
                <div className="mb-5 text-center">
                  <h1 className="text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">
                    Create your Floyd School account
                  </h1>
                  <p className="mt-2 text-xs font-medium text-slate-500">Start learning with your student profile</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 flex items-center gap-2"
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Full Name */}
                  <label className="relative block">
                    <span className="sr-only">Student full name</span>
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Student full name"
                      className="h-11 w-full rounded-xl border-0 bg-[#f1f1f4] pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#cf61b0]"
                      required
                    />
                  </label>

                  {/* Email */}
                  <label className="relative block">
                    <span className="sr-only">Your email address</span>
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Your email address"
                      className="h-11 w-full rounded-xl border-0 bg-[#f1f1f4] pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#cf61b0]"
                      required
                    />
                  </label>

                  {/* Phone */}
                  <label className="relative block">
                    <span className="sr-only">Parent phone number</span>
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Parent phone number (optional)"
                      className="h-11 w-full rounded-xl border-0 bg-[#f1f1f4] pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#cf61b0]"
                    />
                  </label>

                  {/* Passwords */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="relative block">
                      <span className="sr-only">Password</span>
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        className="h-11 w-full rounded-xl border-0 bg-[#f1f1f4] pl-10 pr-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#cf61b0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#cf61b0] focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </label>

                    <label className="relative block">
                      <span className="sr-only">Confirm password</span>
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm password"
                        className="h-11 w-full rounded-xl border-0 bg-[#f1f1f4] pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#cf61b0]"
                        required
                      />
                    </label>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 text-left text-xs font-semibold text-slate-700 select-none pt-1">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(event) => setAcceptTerms(event.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#cf61b0] focus:ring-[#cf61b0]"
                      required
                    />
                    <span>
                      By continuing you agree to our{' '}
                      <Link to="/terms" className="font-bold text-[#7057bd] hover:underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="font-bold text-[#7057bd] hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#cf61b0] via-[#7457bf] to-[#5fc6e9] px-4 text-sm font-black uppercase tracking-wider text-white shadow-md transition duration-200 hover:opacity-95 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="pt-2 text-center text-xs font-medium text-slate-600 border-t border-slate-100">
                    Already have an account?{' '}
                    <Link to="/login" className="font-black text-[#157eea] hover:text-[#cf61b0] transition-colors">
                      Log in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-4 text-center text-xs font-medium text-slate-400 border-t border-slate-100">
        © {new Date().getFullYear()} Floyd School · Empowering Young Innovators Across India
      </footer>
    </div>
  );
};

export default SignupPage;
