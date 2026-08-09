import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MyAttendance from './pages/MyAttendance';
import Quizzes from './pages/Quizzes';
import Assignments from './pages/Assignments';
import BatchSchedule from './pages/BatchSchedule';
import HelpSection from './pages/HelpSection';

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
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="schedule" element={<BatchSchedule />} />
              <Route path="help" element={<HelpSection />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
