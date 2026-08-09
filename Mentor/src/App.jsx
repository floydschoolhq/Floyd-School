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
import SupportTickets from './pages/SupportTickets';
import RecordingsManagement from './pages/RecordingsManagement';
import OfflineAttendance from './pages/OfflineAttendance';
import AttendanceMonitoringSoftware from './pages/AttendanceMonitoringSoftware';
import GlobalNotificationListener from './components/GlobalNotificationListener';

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
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="assignments" element={<AssignmentGrading />} />
              <Route path="live" element={<LiveClassCenter />} />
              <Route path="offline-attendance" element={<OfflineAttendance />} />
              <Route path="attendance-monitoring" element={<AttendanceMonitoringSoftware />} />
              <Route path="leads" element={<StudentLeads />} />
              <Route path="support" element={<SupportTickets />} />
              <Route path="recordings" element={<RecordingsManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
