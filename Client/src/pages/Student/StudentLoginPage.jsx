import { User, LogIn, LogOutIcon, ArrowRight } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { PortalContext } from '../../components/Context/PortalProvider';
import BrandLogo from '../../components/common/BrandLogo';
import GoogleSignInButton from '../../components/GoogleSignInButton';

const StudentLoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(PortalContext);

  const handleExit = () => {
    navigate('/');
  };

  const handleGoogleSignIn = () => {
    // Google OAuth 2.0 configuration
    const GOOGLE_CLIENT_ID = '683836409943-rguv1rgoq4dhi12pm6n4da325d4r16iv.apps.googleusercontent.com';
    const REDIRECT_URI = `${window.location.origin}/complete-profile`;
    
    console.log('Google OAuth initiated with redirect URI:', REDIRECT_URI);
    
    // Google OAuth scopes
    const scopes = [
      'openid',
      'email',
      'profile'
    ].join(' ');

    // Construct Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', Math.random().toString(36).substring(7)); // Add random state for security

    // Store Google sign-in initiation in session storage
    sessionStorage.setItem('googleSignIn', 'true');

    // Redirect to Google OAuth
    window.location.href = authUrl.toString();
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

            <GoogleSignInButton 
              text="Sign in with Google" 
              onClick={handleGoogleSignIn}
            />
          </div>
        </div>

        {/* Floating Back Link */}
        <button
          onClick={handleExit}
          className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 text-[13px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100"
        >
          <LogOutIcon size={12} className="rotate-180" /> Return to Home
        </button>
      </motion.div>
    </div>
  );
};

export default StudentLoginPage;

