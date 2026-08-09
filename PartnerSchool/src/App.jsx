import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import BatchManagement from './pages/BatchManagement';
import StudentRoster from './pages/StudentRoster';
import AttendanceOverview from './pages/AttendanceOverview';
import QuizAssignmentReports from './pages/QuizAssignmentReports';
import HelpSupport from './pages/HelpSupport';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="batches" element={<BatchManagement />} />
              <Route path="students" element={<StudentRoster />} />
              <Route path="attendance" element={<AttendanceOverview />} />
              <Route path="assessments" element={<QuizAssignmentReports />} />
              <Route path="support" element={<HelpSupport />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
