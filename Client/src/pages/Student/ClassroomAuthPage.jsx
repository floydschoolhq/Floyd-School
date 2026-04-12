import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOutIcon, CheckCircle, BookOpen, Users, Calendar, PlayCircle } from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import BrandLogo from '../../components/common/BrandLogo';

const ClassroomAuthPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginWithGoogle } = useFirebaseAuth();

  const handleExit = () => {
    window.location.href = '/';
  };

  const handleFirebaseLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const firebaseUser = await loginWithGoogle();

      const response = await api.post('/auth/firebase/callback', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });

      const { token, ...userData } = response.data;

      const userInfo = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isClassroomAccess: true,
        timestamp: Date.now(),
        ...userData
      };

      sessionStorage.setItem('classroomUser', JSON.stringify(userInfo));
      sessionStorage.setItem('classroomToken', token);

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token);

      toast.success('Successfully logged in! Redirecting to classroom...');

      setTimeout(() => {
        window.location.href = '/classroom';
      }, 1500);

    } catch (err) {
      console.error('Firebase auth error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2563EB]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FBEFEF]/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 hidden lg:block"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-xl border border-white/20">
            <div className="mb-8">
              <BrandLogo size="lg" theme="brand" shine={true} />
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              ThinkSkool <span className="text-[#2563EB]">Classroom</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Access your personalized learning environment with live classes, recorded lectures, and interactive assignments.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PlayCircle className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Live Classes</h3>
                  <p className="text-sm text-slate-600">Join interactive sessions with expert instructors</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Recorded Lectures</h3>
                  <p className="text-sm text-slate-600">Access course content anytime, anywhere</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Peer Learning</h3>
                  <p className="text-sm text-slate-600">Collaborate with fellow students</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Assignments</h3>
                  <p className="text-sm text-slate-600">Track your progress and submit work</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md lg:max-w-lg"
        >
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_50px_100px_-20px_rgba(245,175,175,0.1),0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-[#FBEFEF] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent"></div>

            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center cursor-pointer group/logo" onClick={handleExit}>
                <BrandLogo size="md" theme="brand" shine={true} />
              </div>
            </header>

            <div className="text-center space-y-6">
              <div className="text-left">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                  Classroom <span className="text-[#2563EB]">Access</span>
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  Sign in with Google to access your personalized learning environment
                </p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleFirebaseLogin}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
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

              <div className="text-center pt-4">
                <p className="text-xs text-slate-400">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            <button
              onClick={handleExit}
              className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 text-[13px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100"
            >
              <LogOutIcon size={12} className="rotate-180" /> Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassroomAuthPage;
