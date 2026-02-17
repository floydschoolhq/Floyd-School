import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Calendar, FileText, Lock, Users, FileCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortalContext } from '../Context/PortalProvider';
import { GradientCard, StatCard } from '../dashboard/GradientCard';
import { NotificationPanel } from '../dashboard/NotificationPanel';
import { ProgressChart } from '../dashboard/ProgressChart';
import { LogoutButton } from '../dashboard/LogoutButton';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';

const StudentDashboard = () => {
  const usePortal = () => useContext(PortalContext);
  const { user, updateUser, setView } = usePortal();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const { isConnected, notifications } = useSocket(user?._id);

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Show warning if still loading after 7s
    const timer = setTimeout(() => {
      if (loading) setShowTimeoutWarning(true);
    }, 7000);

    return () => clearTimeout(timer);
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

  const handleRequestAccess = async () => {
    setRequestingAccess(true);
    try {
      await api.post('/students/request-access', {
        permission: 'canAccessCourses',
        message: 'Requesting access to course library'
      });
      alert('Access request submitted! An administrator will review your request shortly.');
    } catch (error) {
      console.error('Failed to request access:', error);
      alert(error.response?.data?.message || 'Failed to submit access request');
    } finally {
      setRequestingAccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-6">
        <div className="text-slate-900 text-xl font-black animate-pulse">Initializing Portal...</div>
        {showTimeoutWarning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 max-w-xs text-center p-4 bg-blue-50 rounded-2xl border border-blue-100"
          >
            <p className="text-sm font-bold text-blue-800">Connection is taking longer than expected.</p>
            <p className="text-xs text-blue-600">The ecosystem may be under high load. Please hold on or check your connection.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs font-black uppercase tracking-widest text-[#2563EB] hover:underline"
            >
              Force Refresh
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // Safety check: If user is not loaded, redirect or show error
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Authentication Required</h2>
          <p className="text-slate-500 mb-6">Please log in to access your dashboard.</p>
          <a href="/student/login" className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 relative overflow-hidden font-['Inter']">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#FBEFEF]/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between mb-12">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <p className="text-[13px] uppercase tracking-[0.4em] font-black text-slate-400 font-['Outfit']">
              Welcome Back: {user?.name}
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black text-slate-900 tracking-tighter font-['Outfit']"
          >
            Student <span className="text-[#2563EB]">Portal</span>
          </motion.h1>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[13px] font-black uppercase tracking-widest text-white">Live Support Active</span>
            </motion.div>
          )}
          <NotificationPanel notifications={notifications} />
          <LogoutButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard
          title="Active Modules"
          value={dashboardData?.stats?.enrolledCourses || 0}
          icon={BookOpen}
          gradient="from-[#2563EB] to-[#2563EB]"
        />
        <StatCard
          title="Pending Deliverables"
          value={dashboardData?.stats?.pendingAssignments || 0}
          icon={Clock}
          gradient="from-[#2D2D2D] to-[#1A1A1A]"
        />
        <StatCard
          title="Milestones Reached"
          value={dashboardData?.stats?.completedAssignments || 0}
          icon={Award}
          gradient="from-[#2563EB] to-[#2563EB]"
        />
        <StatCard
          title="Capability Level"
          value={`${dashboardData?.overallProgress || 0}%`}
          icon={TrendingUp}
          gradient="from-[#2D2D2D] to-[#1A1A1A]"
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Progress */}
        <GradientCard className="lg:col-span-1" gradient="from-[#2563EB] to-[#2563EB]">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight font-['Outfit']">Progression Metrics</h3>
          <div className="flex justify-center p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 shadow-inner">
            <ProgressChart
              progress={dashboardData?.overallProgress || 0}
              subtitle={`${dashboardData?.completedModules || 0} of ${dashboardData?.totalModules || 0} modules completed`}
              color="#2563EB"
            />
          </div>
        </GradientCard>

        {/* Latest Assignments */}
        <GradientCard className="lg:col-span-2" gradient="from-slate-900 to-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">Upcoming Assignments</h3>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <Calendar className="w-5 h-5 text-slate-900" />
            </div>
          </div>
          <div className="space-y-4">
            {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
              dashboardData.assignments.slice(0, 3).map((assignment) => (
                <motion.div
                  key={assignment._id}
                  whileHover={{ x: 4 }}
                  className="p-5 bg-white border border-[#FBEFEF] rounded-[1.5rem] hover:border-[#2563EB]/30 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900 mb-1 tracking-tight font-['Outfit']">{assignment.title}</h4>
                      <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4">{assignment.course?.title}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500">
                          <Clock className="w-3 h-3 text-[#2563EB]" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[13px] font-black uppercase tracking-widest shadow-sm ${new Date(assignment.dueDate) > new Date()
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-500 text-white'
                          }`}>
                          {new Date(assignment.dueDate) > new Date() ? 'On Track' : 'Urgent'}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-[#2D2D2D] text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#2563EB] transition-all shadow-lg hover:shadow-[#2563EB]/20 active:scale-95">
                      Start
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="text-base font-black uppercase tracking-[0.2em] text-slate-400">All deliverables verified</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-12 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-['Outfit']">Course Portfolio</h3>
          {!user.permissions?.canAccessCourses && (
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Lock size={10} /> Locked
            </span>
          )}
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <div className="relative">
          {/* Lock Overlay */}
          {!user.permissions?.canAccessCourses && (
            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center text-center p-8 border border-white/20">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 font-['Outfit']">Access Restricted</h4>
              <p className="text-slate-500 max-w-md font-medium mb-8">
                Your course portfolio is currently locked. Contact your administrator to unlock full access to the curriculum.
              </p>
              <button
                onClick={handleRequestAccess}
                disabled={requestingAccess}
                className="px-8 py-4 bg-[#2563EB] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestingAccess ? 'Submitting...' : 'Request Access'}
              </button>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${!user.permissions?.canAccessCourses ? 'blur-sm pointer-events-none select-none opacity-50' : ''}`}>
            {dashboardData?.courses && dashboardData.courses.length > 0 ? (
              dashboardData.courses.map((course) => (
                <GradientCard
                  key={course._id}
                  gradient="from-[#2563EB] to-[#F9DFDF]"
                  className="hover:scale-[1.02] transition-all duration-500 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 pr-4">
                      <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight leading-tight font-['Outfit']">{course.title}</h4>
                      <p className="text-[13px] font-black text-[#2563EB] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#2563EB]" /> {course.instructor?.name}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[13px] font-black uppercase tracking-widest">
                      {course.category}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-500 mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Mastery Progress</span>
                      <span className="text-slate-900">
                        {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.modules?.filter(m => m.completed).length / course.modules?.length * 100 || 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-[#2563EB] to-[#F9DFDF] h-full rounded-full"
                      />
                    </div>
                  </div>
                </GradientCard>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <BookOpen className="w-20 h-20 mx-auto mb-6 text-slate-200" />
                <p className="text-base font-black uppercase tracking-[0.3em] text-slate-400 mb-8">No courses found</p>
                <button className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-slate-900/30">
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
