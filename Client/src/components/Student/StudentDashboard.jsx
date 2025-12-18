import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Calendar, FileText } from 'lucide-react';
import { PortalContext } from '../Context/PortalProvider';
import { GradientCard, StatCard } from '../dashboard/GradientCard';
import { NotificationPanel } from '../dashboard/NotificationPanel';
import { ProgressChart } from '../dashboard/ProgressChart';
import { LogoutButton } from '../dashboard/LogoutButton';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';

const StudentDashboard = () => {
  const usePortal = () => useContext(PortalContext);
  const { user } = usePortal();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, notifications } = useSocket(user?._id);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
            className="text-sm font-semibold text-sky-400"
          >
            Welcome back, {user?.name}!
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white mt-1 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600"
          >
            Your Digital Classroom Awaits.
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
          title="Enrolled Courses"
          value={dashboardData?.stats?.enrolledCourses || 0}
          icon={BookOpen}
          gradient="from-sky-500 to-blue-600"
        />
        <StatCard
          title="Pending Assignments"
          value={dashboardData?.stats?.pendingAssignments || 0}
          icon={Clock}
          gradient="from-orange-500 to-red-600"
        />
        <StatCard
          title="Completed"
          value={dashboardData?.stats?.completedAssignments || 0}
          icon={Award}
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Overall Progress"
          value={`${dashboardData?.overallProgress || 0}%`}
          icon={TrendingUp}
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress */}
        <GradientCard className="lg:col-span-1" gradient="from-sky-500 via-blue-500 to-indigo-500">
          <h3 className="text-xl font-bold text-white mb-6">Overall Course Progress</h3>
          <div className="flex justify-center">
            <ProgressChart
              progress={dashboardData?.overallProgress || 0}
              subtitle={`${dashboardData?.completedModules || 0} of ${dashboardData?.totalModules || 0} modules completed`}
              color="#0ea5e9"
            />
          </div>
        </GradientCard>

        {/* Latest Assignments */}
        <GradientCard className="lg:col-span-2" gradient="from-purple-500 via-pink-500 to-rose-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Latest Assignments</h3>
            <Calendar className="w-6 h-6 text-white/70" />
          </div>
          <div className="space-y-4">
            {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
              dashboardData.assignments.slice(0, 3).map((assignment) => (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-sky-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{assignment.title}</h4>
                      <p className="text-sm text-slate-400 mb-2">{assignment.course?.title}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${new Date(assignment.dueDate) > new Date()
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                          }`}>
                          {new Date(assignment.dueDate) > new Date() ? 'Active' : 'Overdue'}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors">
                      View
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active assignments</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white mb-6">My Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData?.courses && dashboardData.courses.length > 0 ? (
            dashboardData.courses.map((course) => (
              <GradientCard
                key={course._id}
                gradient="from-indigo-500 via-purple-500 to-pink-500"
                className="hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{course.title}</h4>
                    <p className="text-sm text-slate-300">{course.instructor?.name}</p>
                  </div>
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${course.modules?.filter(m => m.completed).length / course.modules?.length * 100 || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                    </span>
                  </div>
                </div>
              </GradientCard>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No courses enrolled yet</p>
              <button className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors">
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;