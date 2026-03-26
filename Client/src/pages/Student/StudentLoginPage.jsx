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

