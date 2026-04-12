import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Calendar, FileText, Lock, Users, FileCheck, Shield, Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortalContext } from '../../contexts/PortalProvider';
import { GradientCard, StatCard } from '../dashboard/GradientCard';
import { NotificationPanel } from '../dashboard/NotificationPanel';
import { ProgressChart } from '../dashboard/ProgressChart';
import { LogoutButton } from '../dashboard/LogoutButton';
import { useSocket } from '../../contexts/SocketProvider';
import api from '../../api/axios';

import DynamicGreeting from '../dashboard/DynamicGreeting';
import { useTheme } from '../../contexts/ThemeProvider';
import { useToast } from '../../contexts/ToastProvider';
import { useStreak } from '../../hooks/useStreak';
import { useConfetti } from '../../hooks/useConfetti';
import { DashboardSkeleton } from '../dashboard/SkeletonCard';
import StreakWidget from '../dashboard/StreakWidget';

const Achievement3D = lazy(() => import('../dashboard/Achievement3D'));

const StudentDashboard = () => {
  const usePortal = () => useContext(PortalContext);
  const { user, updateUser, setView } = usePortal();
  const { theme, setTheme } = useTheme();
  const isModern = theme === 'modern';
  const toast = useToast();
  const { streak } = useStreak();
  const { celebrateSide } = useConfetti();

  const isClassroomUser = user?.isClassroomAccess === true;
  // Classroom users still need admin approval for courses
  const canAccessCourses = user?.permissions?.canAccessCourses;

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

      // Feature: Celebrate achievement on load if they have completed more than 5 assignments
      if (response.data?.stats?.completedAssignments > 5) {
        setTimeout(() => celebrateSide(), 1000);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Connection Error', 'Failed to synchronize dashboard metrics.');
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
      toast.success('Request Transmitted', 'An administrator will review your clearance shortly.');
    } catch (error) {
      console.error('Failed to request access:', error);
      toast.error('Submission Failed', error.response?.data?.message || 'Failed to transmit request.');
    } finally {
      setRequestingAccess(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Safety check: If user is not loaded, redirect or show error
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-base transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-black text-text-main mb-4 tracking-tight">Authentication Required</h2>
          <p className="text-text-muted mb-6">Please log in to access your dashboard.</p>
          <a href="/student/login" className="px-6 py-3 bg-accent-primary text-white rounded-xl font-bold shadow-lg hover:bg-accent-secondary transition-all">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base p-8 relative overflow-hidden transition-colors duration-500">
      {/* Background Accents */}
      {!isModern && (
        <>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
        </>
      )}

      {/* Header */}
      <div className="relative z-20 flex items-end justify-between mb-12">
        <div className="flex flex-col">
          <DynamicGreeting name={user?.name} />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={isModern ? "text-3xl font-bold text-text-main mt-1" : "text-5xl font-black text-text-main tracking-tighter -mt-1"}
          >
            {isModern ? "Dashboard" : <>Learning <span className="text-accent-primary">Control Center</span></>}
          </motion.h1>
        </div>
        <div className="flex items-center gap-4">
          <StreakWidget />

          {/* Theme Switcher Widget */}
          <div className="flex items-center gap-2 bg-surface-soft p-1 rounded-2xl border border-surface-el shadow-sm">
            {['modern', 'studio', 'cyber'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${theme === t
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20 scale-105'
                  : 'text-text-muted hover:bg-surface-el hover:text-text-main'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-text-main border border-surface-el rounded-2xl shadow-lg"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[13px] font-black uppercase tracking-widest text-surface-base">Live</span>
            </motion.div>
          )}
          <NotificationPanel notifications={notifications} />
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-text-main hover:bg-text-muted text-surface-base rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
          >
            <Home className="w-4 h-4" />
            Site
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Active Modules"
          value={dashboardData?.stats?.enrolledCourses || 0}
          icon={BookOpen}
          gradient="from-accent-primary to-accent-primary"
        />
        <StatCard
          title="Pending Deliverables"
          value={dashboardData?.stats?.pendingAssignments || 0}
          icon={Clock}
          gradient="from-text-main to-text-muted"
        />
        <StatCard
          title="Milestones Reached"
          value={dashboardData?.stats?.completedAssignments || 0}
          icon={Award}
          gradient="from-accent-primary to-accent-primary"
        />
        <StatCard
          title="Capability Level"
          value={`${dashboardData?.overallProgress || 0}%`}
          icon={TrendingUp}
          gradient="from-text-main to-text-muted"
        />
      </div>

      {/* Main Content Bento Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-max">

        {/* Mastery Analysis + 3D Badge Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Course Progress - Bento Item 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <GradientCard className="h-full" gradient="from-accent-primary to-accent-secondary">
              <h3 className={isModern ? "text-lg font-semibold text-text-main mb-6" : "text-xl font-black text-text-main mb-6 tracking-tight transition-colors duration-500"}>
                {isModern ? "Overall Progress" : "Mastery Analysis"}
              </h3>
              <div className={isModern ? "flex justify-center p-6 bg-surface-soft rounded-xl border border-surface-el transition-colors duration-500" : "flex justify-center p-6 bg-surface-soft/50 rounded-[2rem] border border-surface-el shadow-inner backdrop-blur-sm transition-colors duration-500"}>
                <ProgressChart
                  progress={dashboardData?.overallProgress || 0}
                  subtitle={`${dashboardData?.completedModules || 0} / ${dashboardData?.totalModules || 0} Units`}
                  color="var(--accent-primary)"
                  isModern={isModern}
                />
              </div>
            </GradientCard>
          </motion.div>

          {/* 3D Achievement Badge - Bento Item 1b */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex-1"
          >
            <GradientCard className="h-full overflow-hidden" gradient="from-accent-secondary to-accent-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className={isModern ? "p-2 bg-surface-soft rounded-lg text-text-muted" : "p-2.5 bg-surface-soft border border-surface-el rounded-xl"}>
                  <Sparkles className={isModern ? "w-4 h-4" : "w-5 h-5 text-accent-primary"} />
                </div>
                <h3 className={isModern ? "text-lg font-semibold text-text-main" : "text-xl font-black text-text-main tracking-tight transition-colors duration-500"}>Achievement</h3>
              </div>
              <Suspense fallback={
                <div className="h-56 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-surface-el border-t-accent-primary rounded-full animate-spin" />
                </div>
              }>
                <Achievement3D
                  title={dashboardData?.stats?.completedAssignments > 5 ? "Master" : "Rising Star"}
                  color="var(--accent-primary)"
                />
              </Suspense>
            </GradientCard>
          </motion.div>
        </div>

        {/* Latest Assignments - Bento Item 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8"
        >
          <GradientCard className="h-full" gradient="from-text-main to-text-muted">
            <div className={isModern ? "flex items-center justify-between mb-6" : "flex items-center justify-between mb-10"}>
              <h3 className={isModern ? "text-lg font-semibold text-text-main" : "text-2xl font-black text-text-main tracking-tight transition-colors duration-500"}>
                 {isModern ? "Recent Assignments" : "Mission Objectives"}
              </h3>
              <div className={isModern ? "hidden" : "p-4 bg-surface-soft border border-surface-el rounded-2xl transition-colors duration-500"}>
                <Calendar className="w-6 h-6 text-text-main" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
                dashboardData.assignments.slice(0, 4).map((assignment, idx) => (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className={isModern ? "p-4 sm:p-5 bg-surface-base border border-surface-el shadow-sm rounded-xl hover:border-accent-primary/20 transition-all duration-300 flex flex-col justify-between" : "p-6 bg-surface-base border border-surface-el rounded-[2rem] hover:border-accent-primary/50 transition-all duration-300 shadow-sm flex flex-col justify-between"}
                  >
                    <div>
                      <h4 className={isModern ? "text-base font-semibold text-text-main mb-1 line-clamp-1" : "text-lg font-black text-text-main mb-1 tracking-tight line-clamp-1"}>{assignment.title}</h4>
                      <p className={isModern ? "text-xs text-text-muted mb-4" : "text-[11px] font-black text-text-muted uppercase tracking-widest mb-4"}>{assignment.course?.title}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className={isModern ? "flex items-center gap-2 text-xs text-text-muted" : "flex items-center gap-2 text-[12px] font-black text-text-muted uppercase tracking-widest"}>
                        <Clock className={isModern ? "w-3 h-3 text-text-muted" : "w-3.5 h-3.5 text-accent-primary"} />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <button className={isModern ? "px-4 py-2 bg-text-main text-surface-base text-xs font-semibold rounded-lg hover:bg-text-muted transition-colors" : "px-5 py-2.5 bg-text-main text-surface-base text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-primary transition-all shadow-lg active:scale-95"}>
                        {isModern ? "View" : "Initiate"}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-surface-soft rounded-[2.5rem] border border-dashed border-surface-el">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-surface-el" />
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-text-muted">Directives Fulfilled</p>
                </div>
              )}
            </div>
          </GradientCard>
        </motion.div>

        {/* Enrolled Courses - Bento Item 3 (Full Width Below) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-12 mt-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <h3 className={isModern ? "text-2xl font-bold text-text-main" : "text-3xl font-black text-text-main tracking-tighter transition-colors duration-500"}>
              {isModern ? "Enrolled Courses" : "Learning Expeditions"}
            </h3>
            {!canAccessCourses && (
              <span className="px-4 py-1.5 bg-surface-soft text-text-muted rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-surface-el transition-colors duration-500">
                <Lock size={12} className="text-accent-primary" /> Locked Segment
              </span>
            )}
            <div className="h-px flex-1 bg-surface-el transition-colors duration-500" />
          </div>

          <div className="relative">
            {/* Lock Overlay */}
            {!canAccessCourses && (
              <div className="absolute inset-0 z-50 bg-surface-base/40 backdrop-blur-xl rounded-[3.5rem] flex flex-col items-center justify-center text-center p-12 border border-surface-el transition-all duration-500">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-24 h-24 bg-text-main rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl"
                >
                  <Lock className="w-10 h-10 text-surface-base" />
                </motion.div>
                <h4 className="text-3xl font-black text-text-main mb-3">Access Protocol Required</h4>
                <p className="text-text-muted max-w-md font-medium mb-10 text-lg">
                  This tactical segment is restricted. Initialize a request for administrative clearance to unlock the curriculum.
                </p>
                <button
                  onClick={handleRequestAccess}
                  disabled={requestingAccess}
                  className="px-10 py-5 bg-accent-primary text-white text-[13px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-accent-secondary transition-all shadow-2xl shadow-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {requestingAccess ? 'Transmitting...' : (
                    <span className="flex items-center gap-3">
                      Request Clearance <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${!canAccessCourses ? 'blur-md pointer-events-none select-none opacity-40 transition-all duration-700' : ''}`}>
              {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                dashboardData.courses.map((course, idx) => (
                  <GradientCard
                    key={course._id}
                    gradient="from-accent-primary to-accent-secondary"
                    className="hover:scale-[1.03] transition-all duration-500 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex-1 pr-6">
                        <h4 className={isModern ? "text-xl font-semibold text-text-main mb-3" : "text-2xl font-black text-text-main mb-3 tracking-tight leading-[1.1] transition-colors duration-500"}>{course.title}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-surface-soft border border-surface-el flex items-center justify-center overflow-hidden">
                            <Users className="w-4 h-4 text-accent-primary" />
                          </div>
                          <p className={isModern ? "text-sm text-text-muted transition-colors duration-500" : "text-[12px] font-black text-accent-primary uppercase tracking-widest"}>
                            {course.instructor?.name}
                          </p>
                        </div>
                      </div>
                      <span className={isModern ? "px-3 py-1 bg-surface-soft border border-surface-el text-text-muted rounded-md text-xs font-medium" : "px-4 py-2 bg-text-main text-surface-base rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg"}>
                        {course.category}
                      </span>
                    </div>
                    <p className="text-base font-medium text-text-muted mb-10 line-clamp-2 leading-relaxed transition-colors duration-500">{course.description}</p>
                    <div className="space-y-4">
                      <div className={isModern ? "flex items-center justify-between text-xs font-semibold text-text-muted" : "flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em]"}>
                        <span className="text-text-muted">{isModern ? "Progress" : "Mastery Index"}</span>
                        <span className="text-text-main">
                          {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-el rounded-full h-2.5 overflow-hidden shadow-inner transition-colors duration-500">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${course.modules?.filter(m => m.completed).length / course.modules?.length * 100 || 0}%` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className="bg-gradient-to-r from-accent-primary to-accent-secondary h-full rounded-full"
                        />
                      </div>
                    </div>
                  </GradientCard>
                ))
              ) : (
                <div className={isModern ? "col-span-full text-center py-16 bg-surface-base rounded-xl border border-surface-el transition-colors" : "col-span-full text-center py-24 bg-surface-soft rounded-[3.5rem] border border-dashed border-surface-el transition-colors duration-500"}>
                  <BookOpen className={isModern ? "w-12 h-12 mx-auto mb-4 text-text-muted/50" : "w-24 h-24 mx-auto mb-8 text-surface-el"} />
                  <p className={isModern ? "text-base font-semibold text-text-muted mb-6" : "text-lg font-black uppercase tracking-[0.4em] text-text-muted mb-10"}>{isModern ? "You are not enrolled in any courses yet." : "Historical Context Missing: No Courses"}</p>
                  <button className={isModern ? "px-6 py-2.5 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg transition-colors font-medium text-sm" : "px-12 py-6 bg-text-main hover:bg-accent-primary text-surface-base text-[14px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all shadow-2xl scale-100 hover:scale-105"}>
                    {isModern ? "Explore Courses" : "Refresh Feed"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;

