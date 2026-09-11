import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import Batches from './pages/Batches';
import Students from './pages/Students';
import Mentors from './pages/Mentors';
import Coordinators from './pages/Coordinators';
import ImportWizard from './pages/ImportWizard';
import Credentials from './pages/Credentials';
import Attendance from './pages/Attendance';
import Progress from './pages/Progress';
import Assignments from './pages/Assignments';
import Quizzes from './pages/Quizzes';
import Materials from './pages/Materials';
import Courses from './pages/Courses';
import Permissions from './pages/Permissions';
import Maintenance from './pages/Maintenance';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import SystemHealth from './pages/SystemHealth';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Protected Route Wrapper for Super Admin
function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span>Verifying Super Admin Authorization...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Offline Admin Workspace */}
          <Route
            path="/"
            element={
              <ProtectedAdminRoute>
                <Layout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="schools" element={<Schools />} />
            <Route path="batches" element={<Batches />} />
            <Route path="students" element={<Students />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="coordinators" element={<Coordinators />} />
            <Route path="import" element={<ImportWizard />} />
            <Route path="credentials" element={<Credentials />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="progress" element={<Progress />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="materials" element={<Materials />} />
            <Route path="courses" element={<Courses />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="system-health" element={<SystemHealth />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
