import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import GlobalNotificationListener from './components/GlobalNotificationListener';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupportHub from './pages/SupportHub';
import DiscussionModeration from './pages/DiscussionModeration';
import StudentList from './pages/StudentList';
import Escalations from './pages/Escalations';
import LiveMonitoring from './pages/LiveMonitoring';
import SchoolPartnerships from './pages/SchoolPartnerships';

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
              <Route path="support" element={<SupportHub />} />
              <Route path="school-partnerships" element={<SchoolPartnerships />} />
              <Route path="discussions" element={<DiscussionModeration />} />
              <Route path="students" element={<StudentList />} />
              <Route path="escalations" element={<Escalations />} />
              <Route path="monitoring" element={<LiveMonitoring />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
