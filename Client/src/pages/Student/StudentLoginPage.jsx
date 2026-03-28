import { LogOutIcon, CheckCircle } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { PortalContext } from '../../components/Context/PortalProvider';
import BrandLogo from '../../components/common/BrandLogo';
import { useFirebaseAuth } from '../../components/Context/FirebaseAuthContext';
import toast from 'react-hot-toast';

const StudentLoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [firebaseUserData, setFirebaseUserData] = useState(null);
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
      
      setFirebaseUserData({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      setShowMobileForm(true);
      toast.success('Please enter your mobile number');
    } catch (err) {
      console.error('Firebase auth error', err);
      const errorMessage = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!mobileNumber || mobileNumber.length < 10) {
        setError('Please enter a valid mobile number');
        toast.error('Please enter a valid mobile number');
        return;
      }
      
      const res = await api.post('/auth/firebase/callback', {
        ...firebaseUserData,
        mobileNumber
      });
      
      const userData = res.data;
      updateUser(userData);
      setShowSuccessPopup(true);
      
    } catch (err) {
      console.error('Mobile submission error', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save information. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
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
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent"></div>

          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center cursor-pointer group/logo" onClick={handleExit}>
              <BrandLogo size="md" theme="brand" shine={true} />
            </div>
          </header>

          <AnimatePresence mode="wait">
            {!showMobileForm ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="text-left">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    Student <span className="text-[#2563EB]">Login</span>
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Sign in with Google to continue
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
              </motion.div>
            ) : !showSuccessPopup ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="text-left">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    Enter <span className="text-[#2563EB]">Mobile</span>
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Please provide your mobile number to complete registration
                  </p>
                </div>
                
                {firebaseUserData && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">{firebaseUserData.name}</p>
                    <p className="text-xs text-blue-500">{firebaseUserData.email}</p>
                  </div>
                )}
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleMobileSubmit} className="space-y-4 pt-2">
                  <div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all text-sm"
                      required
                      maxLength={15}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 text-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>

                <button
                  onClick={() => setShowMobileForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
                >
                  Go back
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showSuccessPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-white rounded-[2.5rem] flex flex-col items-center justify-center p-8 z-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                  Thank You!
                </h3>
                
                <p className="text-slate-500 text-center mb-6 text-sm">
                  Your information is taken. We will contact you soon.
                </p>
                
                <button
                  onClick={handleSuccessClose}
                  className="bg-[#2563EB] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors text-sm"
                >
                  OK
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showSuccessPopup && (
            <button
              onClick={handleExit}
              className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 text-[13px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100"
            >
              <LogOutIcon size={12} className="rotate-180" /> Return to Home
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLoginPage;

