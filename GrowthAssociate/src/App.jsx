import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupportHub from './pages/SupportHub';
import DiscussionModeration from './pages/DiscussionModeration';
import StudentList from './pages/StudentList';
import Escalations from './pages/Escalations';

// Placeholder for pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center text-orange-500 border border-orange-100">
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
    </div>
    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{title}</h2>
    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Support Node initializing...</p>
    <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
      <div className="w-1/3 h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]"></div>
    </div>
  </div>
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
            <Route index element={<Dashboard />} />
            <Route path="support" element={<SupportHub />} />
            <Route path="discussions" element={<DiscussionModeration />} />
            <Route path="students" element={<StudentList />} />
            <Route path="escalations" element={<Escalations />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
