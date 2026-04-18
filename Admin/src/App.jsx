import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import GlobalNotificationListener from './components/GlobalNotificationListener';

// Admin Pages
import Login from './pages/Login';
import PlatformAnalytics from './pages/PlatformAnalytics';
import UserGovernance from './pages/UserGovernance';
import CourseGovernance from './pages/CourseGovernance';
import LeadIntelligence from './pages/LeadIntelligence';
import ChatbotLeadsPage from './pages/ChatbotLeadsPage';
import SchoolPartnershipLeadsPage from './pages/SchoolPartnershipLeadsPage';
import GlobalNotifications from './pages/GlobalNotifications';
import SystemSettings from './pages/SystemSettings';
import SuccessEngine from './pages/SuccessEngine';
import SecurityLogs from './pages/SecurityLogs';
import AccessRequests from './pages/AccessRequests';
import LiveMonitoring from './pages/LiveMonitoring';
import StudentRegistrations from './pages/StudentRegistrations';
import RecordingsManagement from './pages/RecordingsManagement';
import PaymentTracking from './pages/PaymentTracking';
import AIMLEnrollmentPage from './pages/AIMLEnrollmentPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <SocketProvider>
          <GlobalNotificationListener />
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
              <Route path="requests" element={<AccessRequests />} />
              <Route path="student-registrations" element={<StudentRegistrations />} />
              <Route path="ai-ml-enrollment" element={<AIMLEnrollmentPage />} />
              <Route path="courses" element={<CourseGovernance />} />
              <Route path="leads" element={<LeadIntelligence />} />
              <Route path="chatbot-leads" element={<ChatbotLeadsPage />} />
              <Route path="school-partnership-leads" element={<SchoolPartnershipLeadsPage />} />
              <Route path="broadcast" element={<GlobalNotifications />} />
              <Route path="success-engine" element={<SuccessEngine />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="monitoring" element={<LiveMonitoring />} />
              <Route path="recordings" element={<RecordingsManagement />} />
              <Route path="payments" element={<PaymentTracking />} />
              <Route path="logs" element={<SecurityLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
