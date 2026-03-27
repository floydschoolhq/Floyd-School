import { LogOutIcon } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { PortalContext } from '../../components/Context/PortalProvider';
import BrandLogo from '../../components/common/BrandLogo';
import { useFirebaseAuth } from '../../components/Context/FirebaseAuthContext';
import toast from 'react-hot-toast';

const StudentLoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useContext(PortalContext);
  const { loginWithGoogle } = useFirebaseAuth();

  const handleExit = () => {
    navigate('/');
  };

  const handleFirebaseLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const firebaseUser = await loginWithGoogle();
      
      // Send Firebase user data to backend
      const res = await api.post('/auth/firebase/callback', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      const userData = res.data;
      updateUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      
      if (userData.needsProfileCompletion) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Firebase auth error', err);
      const errorMessage = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      const res = await api.post('/auth/login', { email, password });
      const userData = res.data;
      updateUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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

          <div className="text-center space-y-6">
            <div className="text-left">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Student <span className="text-[#2563EB]">Login</span></h3>
              <p className="text-slate-500 text-sm font-medium">Sign in to your engineering dashboard</p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                 {error}
              </div>
            )}

            {/* Email/Password Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 text-sm"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In with Email'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-500">or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleFirebaseLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isSubmitting ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>

        {/* Floating Back Link */}
        <button
          onClick={handleExit}
          className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 text-[13px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100"
        >
          <LogOutIcon size={12} className="rotate-180" /> Return to Home
        </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLoginPage;

