import { User, LogIn, LogOutIcon, ArrowRight } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { PortalContext } from '../../components/Context/PortalProvider';
import BrandLogo from '../../components/common/BrandLogo';

const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(PortalContext);

  const handleExit = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    // Domain restriction check
    /* 
    if (!email.toLowerCase().endsWith('@thinkskool.com')) {
      toast.error('Invalid Domain', 'Student access requires a @thinkskool.com email address.');
      return;
    }
    */

    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        role: 'student',
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));

      if (updateUser) {
        updateUser(response.data);
      }

      navigate('/student');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2563EB]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FBEFEF]/30 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(245,175,175,0.1),0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-[#FBEFEF] relative overflow-hidden group">
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent"></div>

          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center cursor-pointer group/logo" onClick={handleExit}>
              <BrandLogo size="md" theme="brand" shine={true} />
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-left">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Student <span className="text-[#2563EB]">Login</span></h3>
              <p className="text-slate-500 text-sm font-medium">Welcome back to your engineering dashboard</p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wide ml-1 mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium shadow-inner"
                />
              </div>
              <div className="group">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wide ml-1 mb-2 block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium shadow-inner"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={!email || !password || isSubmitting}
              className={`w-full group relative overflow-hidden rounded-2xl p-5 font-black text-\[14px\] uppercase tracking-[0.3em] transition-all duration-500
                ${(!email || !password || isSubmitting)
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]'
                }
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Logging In...
                  </>
                ) : (
                  <>Log In <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </motion.button>

            {/* Signup link removed as per new access control policy */}
          </form>
        </div>

        {/* Floating Back Link */}
        <button
          onClick={handleExit}
          className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 text-\[13px\] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100"
        >
          <LogOutIcon size={12} className="rotate-180" /> Return to Home
        </button>
      </motion.div>
    </div>
  );
};

export default StudentLoginPage;

