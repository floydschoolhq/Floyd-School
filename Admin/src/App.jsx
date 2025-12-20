import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Admin Pages
import Login from './pages/Login';
import PlatformAnalytics from './pages/PlatformAnalytics';
import UserGovernance from './pages/UserGovernance';
import CourseGovernance from './pages/CourseGovernance';
import LeadIntelligence from './pages/LeadIntelligence';
import GlobalNotifications from './pages/GlobalNotifications';
import SystemSettings from './pages/SystemSettings';
import SecurityLogs from './pages/SecurityLogs';

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
            <Route index element={<PlatformAnalytics />} /> {/* Keep index for default, or change to analytics */}
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="users" element={<UserGovernance />} />
            <Route path="courses" element={<CourseGovernance />} />
            <Route path="leads" element={<LeadIntelligence />} />
            <Route path="broadcast" element={<GlobalNotifications />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="logs" element={<SecurityLogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
