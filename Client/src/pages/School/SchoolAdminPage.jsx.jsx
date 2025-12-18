/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Activity, TrendingUp, UserCheck, Shield, Menu, X } from 'lucide-react';
import { PortalContext } from '../../components/Context/PortalProvider';
import { GradientCard, StatCard } from '../../components/dashboard/GradientCard';
import { NotificationPanel } from '../../components/dashboard/NotificationPanel';
import { LogoutButton } from '../../components/dashboard/LogoutButton';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';

const SchoolAdminPage = () => {
  const { user } = useContext(PortalContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, notifications } = useSocket(user?._id);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/admin');
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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-purple-400"
          >
            Welcome!
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white mt-1 bg-clip-text bg-linear-to-r from-purple-400 to-pink-600"
          >
            Admin Dashboard
          </motion.h1>
        </div>
        <div className="flex items-center gap-4">

      {/* 2. Toggle Button: Only visible on small screens (up to md breakpoint) */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* 3. Conditional Rendering and Responsive Classes */}
      {/* - hidden: Hides the container by default (on small screens).
        - md:flex: Overrides 'hidden' and uses flex layout on medium screens and larger.
        - flex-col: Stacks items vertically when the menu is manually opened (on small screen).
        - md:flex-row: Switches back to horizontal on medium screens.
        - ${isMenuOpen ? 'flex' : 'hidden'}: Shows the menu content if the button is clicked.
      */}
      <div 
        className={`
          flex items-center gap-4 
          ${isMenuOpen ? 'absolute top-16 right-4 p-4 bg-slate-800 rounded-lg shadow-xl flex-col z-50 min-w-[200px]' : 'hidden'} 
          md:flex md:flex-row md:static md:p-0 md:bg-transparent
        `}
      >
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={dashboardData?.stats?.totalUsers || 0}
          icon={Users}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Total Courses"
          value={dashboardData?.stats?.totalCourses || 0}
          icon={BookOpen}
          gradient="from-sky-500 to-blue-600"
        />
        <StatCard
          title="Total Assignments"
          value={dashboardData?.stats?.totalAssignments || 0}
          icon={FileText}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Total Submissions"
          value={dashboardData?.stats?.totalSubmissions || 0}
          icon={Activity}
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GradientCard gradient="from-blue-500 via-indigo-500 to-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Students</p>
              <h3 className="text-4xl font-bold text-white">{dashboardData?.stats?.students || 0}</h3>
            </div>
            <UserCheck className="w-12 h-12 text-white/50" />
          </div>
        </GradientCard>

        <GradientCard gradient="from-emerald-500 via-teal-500 to-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Mentors</p>
              <h3 className="text-4xl font-bold text-white">{dashboardData?.stats?.mentors || 0}</h3>
            </div>
            <Users className="w-12 h-12 text-white/50" />
          </div>
        </GradientCard>

        <GradientCard gradient="from-purple-500 via-pink-500 to-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Admins</p>
              <h3 className="text-4xl font-bold text-white">{dashboardData?.stats?.admins || 0}</h3>
            </div>
            <Shield className="w-12 h-12 text-white/50" />
          </div>
        </GradientCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Courses */}
        <GradientCard gradient="from-cyan-500 via-blue-500 to-indigo-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Courses</h3>
            <BookOpen className="w-6 h-6 text-white/70" />
          </div>
          <div className="space-y-3">
            {dashboardData?.recentCourses && dashboardData.recentCourses.length > 0 ? (
              dashboardData.recentCourses.map((course) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{course.title}</p>
                      <p className="text-xs text-slate-400">
                        by {course.instructor?.name} • {course.enrolledStudents?.length || 0} students
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${course.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-500/20 text-slate-400'
                      }`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No courses yet</p>
              </div>
            )}
          </div>
        </GradientCard>

        {/* Recent Users */}
        <GradientCard gradient="from-purple-500 via-pink-500 to-rose-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Users</h3>
            <Users className="w-6 h-6 text-white/70" />
          </div>
          <div className="space-y-3">
            {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 ? (
              dashboardData.recentUsers.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'student' ? 'bg-sky-500/20 text-sky-400' :
                      user.role === 'mentor' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                      {user.role}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No users yet</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <GradientCard gradient="from-orange-500 via-red-500 to-pink-500">
          <div className="space-y-3">
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.slice(0, 10).map((activity) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.message}</p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-white/70">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default SchoolAdminPage;
