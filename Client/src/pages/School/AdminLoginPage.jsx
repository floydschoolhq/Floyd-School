import { Shield, LogIn, LogOutIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Removed 'api' import since we are bypassing the API call
// import api from '../../api/axios';
import { DottedGlowBackground } from '../../components/ui/dotted-background';

const LOGO_BLUE = '#007FFF';
const LOGO_ORANGE = '#FF8C00';

// Define the expected credentials from environment variables
// Note: process.env access depends on your bundler (e.g., vite uses import.meta.env)
const ADMIN_EMAIL = import.meta.env.REACT_APP_ADMIN_EMAIL || "thinkskool@gmail.com";
const ADMIN_PASSWORD = import.meta.env.REACT_APP_ADMIN_PASSWORD || "thinkskool@123";

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/role');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);

    // --- MODIFIED AUTHENTICATION LOGIC ---
    // Perform client-side check against environment variables
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // **Warning: No token or proper user info is generated here.**
      // You must decide what to store to simulate a successful login.
      // For a simple bypass, we simulate a token/user info.

      // SIMULATING a successful login/session (INSECURE)
      localStorage.setItem('token', 'local-admin-token');
      localStorage.setItem('userInfo', JSON.stringify({
        email: ADMIN_EMAIL,
        role: 'school-admin',
        // Add other necessary fields your app expects
      }));

      // Navigate after a small delay to show "Logging in..." state
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/school-admin');
      }, 1000); // Simulate network latency

    } else {
      // Local credentials mismatch
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Local Admin Login Failed: Invalid email or password.');
      }, 1000); // Simulate network latency
    }
    // --- END MODIFIED AUTHENTICATION LOGIC ---
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <DottedGlowBackground
        className="absolute inset-0"
        opacity={0.5}
        gap={20}
        radius={1.2}
        colorDarkVar="--color-neutral-700"
        glowColorDarkVar="--color-purple-600"
        speedMin={0.2}
        speedMax={0.8}
      />

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700">
          <div className="text-2xl font-extrabold cursor-pointer" onClick={handleExit}>
            <span style={{ color: LOGO_BLUE }}>think</span>
            <span style={{ color: LOGO_ORANGE }}>skool</span>
          </div>
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer text-slate-300 bg-slate-800 rounded-full hover:bg-red-900/50 hover:text-red-400 transition duration-300"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center justify-center space-x-3 pb-4">
            <Shield className="text-purple-400 w-6 h-6" />
            <h3 className="text-2xl font-bold text-white">Admin Login</h3>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={!email || !password || isSubmitting}
            className={`flex items-center justify-center gap-2 p-3 font-semibold text-white rounded-lg transition-all duration-300
                            ${(!email || !password || isSubmitting)
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-linear-to-r from-purple-600 to-violet-600 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02]'
              }
                        `}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <><LogIn className="w-5 h-5" /> Log In as Admin</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;