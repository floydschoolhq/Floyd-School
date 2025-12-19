import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CourseManagement from './pages/CourseManagement';
import LiveClassCenter from './pages/LiveClassCenter';
import StudentLeads from './pages/StudentLeads';
import AssignmentGrading from './pages/AssignmentGrading';
import StudentRoster from './pages/StudentRoster';
import SupportTickets from './pages/SupportTickets';

// Placeholder for other pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{title}</h2>
    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Node initialization in progress...</p>
    <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
      <div className="w-1/3 h-full bg-sky-500 animate-[loading_2s_ease-in-out_infinite]"></div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="assignments" element={<AssignmentGrading />} />
                <Route path="live" element={<LiveClassCenter />} />
                <Route path="leads" element={<StudentLeads />} />
                <Route path="roster" element={<StudentRoster />} />
                <Route path="support" element={<SupportTickets />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
