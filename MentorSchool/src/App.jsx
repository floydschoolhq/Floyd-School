import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import MainLayout from './components/Layout/MainLayout';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyClasses from './pages/MyClasses';
import MyBatches from './pages/MyBatches';
import BatchDetails from './pages/BatchDetails';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import Quizzes from './pages/Quizzes';
import Homework from './pages/Homework';
import Materials from './pages/Materials';
import ClassGuides from './pages/ClassGuides';
import Profile from './pages/Profile';
import MaintenanceGuard from './components/MaintenanceGuard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <LoadingSpinner text="Authenticating mentor session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MaintenanceGuard>
            <Routes>
              <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="batches" element={<MyBatches />} />
              <Route path="batches/:id" element={<BatchDetails />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="students" element={<Students />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="homework" element={<Homework />} />
              <Route path="materials" element={<Materials />} />
              <Route path="guides" element={<ClassGuides />} />
              <Route path="profile" element={<Profile />} />
            </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MaintenanceGuard>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
