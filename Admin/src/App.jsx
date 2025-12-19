import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import PlatformAnalytics from './pages/PlatformAnalytics';
import UserGovernance from './pages/UserGovernance';

// Placeholder for pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <div className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center text-sky-500 border border-slate-800 shadow-2xl relative">
      <div className="absolute inset-0 bg-sky-500/10 blur-2xl rounded-full animate-pulse"></div>
      <Shield size={48} className="relative z-10" />
    </div>
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{title}</h2>
      <p className="text-sky-500/60 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Secure Sector 01...</p>
    </div>
    <div className="w-64 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
      <div className="w-1/3 h-full bg-sky-500 animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(56,189,248,0.8)]"></div>
    </div>
  </div>
);

const Shield = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PlatformAnalytics />} />
            <Route path="users" element={<UserGovernance />} />
            <Route path="logs" element={<Placeholder title="Security Protocol Logs" />} />
            <Route path="notifications" element={<Placeholder title="Global Broadcast" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
