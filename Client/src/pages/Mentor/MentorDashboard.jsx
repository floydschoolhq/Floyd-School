import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { PortalContext } from '../../components/Context/PortalProvider';
import { GradientCard, StatCard } from '../../components/dashboard/GradientCard';
import { NotificationPanel } from '../../components/dashboard/NotificationPanel';
import { LogoutButton } from '../../components/dashboard/LogoutButton';
import { CreateCourseModal, CreateAssignmentModal } from '../../components/dashboard/CreateModals';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';

const MentorDashboard = () => {
  const { user } = useContext(PortalContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, notifications } = useSocket(user?._id);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/mentor');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = (newCourse) => {
    // Refresh dashboard data
    fetchDashboardData();
  };

  const handleAssignmentCreated = (newAssignment) => {
    // Refresh dashboard data
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-emerald-400"
          >
            Welcome back, {user?.name}!
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white mt-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600"
          >
            Mentor Dashboard
          </motion.h1>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Live</span>
            </div>
          )}
          <NotificationPanel notifications={notifications} />
          <LogoutButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Courses"
          value={dashboardData?.stats?.totalCourses || 0}
          icon={BookOpen}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Total Students"
          value={dashboardData?.stats?.totalStudents || 0}
          icon={Users}
          gradient="from-sky-500 to-blue-600"
        />
        <StatCard
          title="Pending Reviews"
          value={dashboardData?.stats?.pendingReviews || 0}
          icon={Clock}
          gradient="from-orange-500 to-red-600"
        />
        <StatCard
          title="Total Assignments"
          value={dashboardData?.stats?.totalAssignments || 0}
          icon={FileText}
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* My Courses */}
        <GradientCard className="lg:col-span-2" gradient="from-emerald-500 via-teal-500 to-cyan-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">My Courses</h3>
            <BookOpen className="w-6 h-6 text-white/70" />
          </div>
          <div className="space-y-4">
            {dashboardData?.courses && dashboardData.courses.length > 0 ? (
              dashboardData.courses.map((course) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{course.title}</h4>
                      <p className="text-sm text-slate-400 mb-2">{course.category}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.enrolledStudents?.length || 0} students
                        </span>
                        <span className={`px-2 py-1 rounded-full ${course.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-500/20 text-slate-400'
                          }`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Manage
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No courses created yet</p>
              </div>
            )}
          </div>
        </GradientCard>

        {/* Quick Actions */}
        <GradientCard gradient="from-purple-500 via-pink-500 to-rose-500">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowCourseModal(true)}
              className="w-full p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Create New Course
            </button>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="w-full p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Create Assignment
            </button>
            <button className="w-full p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <Users className="w-5 h-5" />
              View All Students
            </button>
            <button className="w-full p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              View Analytics
            </button>
          </div>
        </GradientCard>
      </div>

      {/* Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <GradientCard gradient="from-orange-500 via-red-500 to-pink-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Pending Reviews</h3>
            <Clock className="w-6 h-6 text-white/70" />
          </div>
          <div className="space-y-3">
            {dashboardData?.pendingSubmissions && dashboardData.pendingSubmissions.length > 0 ? (
              dashboardData.pendingSubmissions.slice(0, 5).map((submission) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{submission.student?.name}</p>
                      <p className="text-xs text-slate-400">{submission.assignment?.title}</p>
                    </div>
                    <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-medium transition-colors">
                      Review
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>All caught up!</p>
              </div>
            )}
          </div>
        </GradientCard>

        {/* Recent Graded */}
        <GradientCard gradient="from-green-500 via-emerald-500 to-teal-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recently Graded</h3>
            <CheckCircle className="w-6 h-6 text-white/70" />
          </div>
          <div className="space-y-3">
            {dashboardData?.gradedSubmissions && dashboardData.gradedSubmissions.length > 0 ? (
              dashboardData.gradedSubmissions.map((submission) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{submission.student?.name}</p>
                      <p className="text-xs text-slate-400">{submission.assignment?.title}</p>
                    </div>
                    <span className="text-lg font-bold text-green-400">
                      {submission.grade}%
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No graded submissions yet</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>

      {/* Modals */}
      <CreateCourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSuccess={handleCourseCreated}
      />
      <CreateAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onSuccess={handleAssignmentCreated}
        courses={dashboardData?.courses || []}
      />
    </div>
  );
};

export default MentorDashboard;