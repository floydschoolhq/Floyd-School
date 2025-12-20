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
