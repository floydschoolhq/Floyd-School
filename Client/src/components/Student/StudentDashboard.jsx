import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Home,
  Lock, Users, FileText, Shield, Radio, Calendar,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PortalContext } from '../../contexts/PortalProvider';
import { GradientCard, StatCard } from '../dashboard/GradientCard';
import { NotificationPanel } from '../dashboard/NotificationPanel';
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

const StudentDashboard = () => {
  const navigate = useNavigate();
  const usePortal = () => useContext(PortalContext);
  const { user, activeLiveClass, setActiveLiveClass } = usePortal();
  const { theme, setTheme } = useTheme();
  const isModern = theme === 'modern';
  const toast = useToast();
  const { streak } = useStreak();
  const { celebrateSide } = useConfetti();

  const canAccessCourses = user?.permissions?.canAccessCourses;

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const { socket, isConnected, notifications } = useSocket();

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchLiveStatus()]);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleLiveClassStarted = (data) => {
      const userGrantedCourses = user?.permissions?.grantedCourses || [];
      const courseId = data.course?._id || data.course;
      const hasAccess = userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId?.toString());
      
      if (hasAccess) {
        setActiveLiveClass(data);
        toast.info('Live Class Started', `A live mentorship session is now ON AIR!`);
      }
    };

    const handleLiveClassEnded = () => {
      setActiveLiveClass(null);
      toast.info('Live Class Ended', 'The live mentorship session has ended.');
    };

    const handleScheduledLiveStarted = (data) => {
      const userGrantedCourses = user?.permissions?.grantedCourses || [];
      const courseId = data.course?._id || data.course;
      const hasAccess = userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId?.toString());
      
      if (hasAccess) {
        const normalized = {
          ...data,
          mentorName: data.mentorName || data.mentor?.name || 'Instructor',
          topic: data.description || data.topic || 'Live Session',
          startedAt: data.actualStart || data.scheduledStart || new Date()
        };
        setActiveLiveClass(normalized);
        toast.info('Live Class Started', `A live scheduled session is now ON AIR!`);
      }
    };

    const handleScheduledLiveEnded = () => {
      setActiveLiveClass(null);
    };

    socket.on('liveClass:started', handleLiveClassStarted);
    socket.on('liveClass:ended', handleLiveClassEnded);
    socket.on('scheduledLive:started', handleScheduledLiveStarted);
    socket.on('scheduledLive:ended', handleScheduledLiveEnded);

    return () => {
      socket.off('liveClass:started', handleLiveClassStarted);
      socket.off('liveClass:ended', handleLiveClassEnded);
      socket.off('scheduledLive:started', handleScheduledLiveStarted);
      socket.off('scheduledLive:ended', handleScheduledLiveEnded);
    };
  }, [socket, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setDashboardData(response.data);
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

  const fetchLiveStatus = async () => {
    try {
      const res = await api.get('/live-classes/active');
      if (res.data) setActiveLiveClass(res.data);
    } catch (_) {
      // No active class is fine
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
      toast.error('Submission Failed', error.response?.data?.message || 'Failed to transmit request.');
    } finally {
      setRequestingAccess(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-base">
        <div className="text-center">
          <h2 className="text-2xl font-black text-text-main mb-4">Authentication Required</h2>
          <a href="/student/login" className="px-6 py-3 bg-accent-primary text-white rounded-xl font-bold shadow-lg hover:bg-accent-secondary transition-all">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const enrolledCount   = dashboardData?.stats?.enrolledCourses ?? 0;
  const completedMods   = dashboardData?.completedModules ?? 0;
  const totalMods       = dashboardData?.totalModules ?? 0;
  const courses         = dashboardData?.courses ?? [];

  return (
    <div className="min-h-screen bg-surface-base p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-500">
      {/* Background accents */}
      {!isModern && (
        <>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div className="relative z-20 flex flex-col md:flex-row gap-6 md:gap-4 md:items-end justify-between mb-8 md:mb-12">
        <div className="flex flex-col">
          <DynamicGreeting name={user?.name} />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={isModern
              ? "text-2xl sm:text-3xl font-bold text-text-main mt-1"
              : "text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tighter -mt-1"}
          >
            {isModern ? 'Dashboard' : <><span className="text-accent-primary">Learning</span> Dashboard</>}
          </motion.h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto">
          <StreakWidget />

          {/* Theme switcher */}
          <div className="flex items-center gap-2 bg-surface-soft p-1 rounded-2xl border border-surface-el shadow-sm">
            {['modern', 'cyber'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${theme === t
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20 scale-105'
                  : 'text-text-muted hover:bg-surface-el hover:text-text-main'}`}
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

      {/* ── Live Class Banner (only when a class is live) ── */}
      {activeLiveClass && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-6 p-4 rounded-2xl border border-red-200 bg-red-50 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <div>
              <p className="text-sm font-bold text-red-700">Live Class in Progress</p>
              <p className="text-xs text-red-500">{activeLiveClass.title || 'Session started'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/live-session')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Join Now →
          </button>
        </motion.div>
      )}

      {/* ── Stats Row ── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">

        {/* Enrolled Courses — real */}
        <StatCard
          title="Enrolled Courses"
          value={enrolledCount}
          icon={BookOpen}
          gradient="from-accent-primary to-accent-primary"
        />

        {/* Modules Completed — real */}
        <StatCard
          title="Modules Completed"
          value={`${completedMods} / ${totalMods}`}
          icon={CheckCircle}
          gradient="from-text-main to-text-muted"
        />

        {/* Live Status — real */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => activeLiveClass && navigate('/student/live-session')}
          className={`p-5 rounded-3xl border bg-surface-soft transition-all ${activeLiveClass ? 'border-red-200 cursor-pointer' : 'border-surface-el'}`}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Live Class</p>
          <div className="flex items-center gap-2 mb-4">
            {activeLiveClass
              ? <><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /><span className="text-base font-black text-red-600">ON AIR</span></>
              : <><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /><span className="text-base font-black text-text-muted">Offline</span></>
            }
          </div>
          <div className="p-3 rounded-2xl bg-surface-el w-fit">
            <Radio className={`w-5 h-5 ${activeLiveClass ? 'text-red-500' : 'text-text-muted'}`} />
          </div>
        </motion.div>
      </div>

      {/* ── Main Grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-max">

        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-12"
        >
          <GradientCard className="h-full" gradient="from-text-main to-text-muted">
            <div className="flex items-center justify-between mb-6">
              <h3 className={isModern ? "text-lg font-semibold text-text-main" : "text-2xl font-black text-text-main tracking-tight"}>
                My Courses
              </h3>
              <button
                onClick={() => navigate('/student/schedule')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-soft border border-surface-el text-text-muted rounded-xl text-[11px] font-bold uppercase tracking-wider hover:border-accent-primary/40 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>

            {courses.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* Learning Stats / Call to Action Column */}
                <div className="lg:w-1/3 flex flex-col justify-between p-6 bg-gradient-to-br from-surface-soft to-surface-el/40 border border-surface-el rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent-primary/10 transition-colors" />
                  <div className="relative z-10">
                    <span className="px-2.5 py-1 bg-accent-primary/10 text-accent-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-accent-primary/20">
                      Learning Hub
                    </span>
                    <h4 className="text-xl font-black text-text-main mt-4 mb-2 tracking-tight italic">
                      Welcome Back, {user?.name?.split(' ')[0]}!
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed mb-6 font-medium">
                      You are currently enrolled in <span className="text-text-main font-bold">{courses.length} core {courses.length === 1 ? 'program' : 'programs'}</span>. Jump straight into your classroom or sync with your mentor.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => navigate('/student/classroom')}
                      className="w-full py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-accent-primary/10"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Enter Classroom
                    </button>
                    <button
                      onClick={() => navigate('/student/live-session')}
                      className="w-full py-3 bg-surface-soft hover:bg-surface-el border border-surface-el text-text-main rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5 text-accent-primary" /> Mentor Room
                    </button>
                  </div>
                </div>

                {/* Courses List Column */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.slice(0, 4).map((course) => (
                    <motion.div
                      key={course._id}
                      whileHover={{ y: -4, border: '1px solid var(--accent-primary)' }}
                      onClick={() => navigate('/student/classroom')}
                      className="p-5 bg-surface-base border border-surface-el rounded-3xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-0.5 bg-surface-soft text-text-muted rounded-lg text-[9px] font-black uppercase tracking-widest border border-surface-el">
                            {course.category || 'Technology'}
                          </span>
                          <div className="p-2 bg-accent-primary/5 rounded-xl text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-colors duration-500">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-base font-black text-text-main group-hover:text-accent-primary transition-colors mb-1 line-clamp-2 tracking-tight">
                          {course.title}
                        </h4>
                        <p className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                          <Users className="w-3 h-3 text-accent-primary" /> {course.instructor?.name || 'thinkskool Mentor'}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-surface-el flex items-center justify-between">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Access</span>
                        <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                          Learn Now →
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Complementary resource card if only 1 course enrolled to balance layout column spacing */}
                  {courses.length === 1 && (
                    <div className="p-5 bg-gradient-to-br from-surface-soft to-surface-el/40 border border-dashed border-surface-el rounded-3xl flex flex-col items-center justify-center text-center group hover:border-accent-primary/30 transition-colors">
                      <div className="p-3 bg-surface-base border border-surface-el rounded-2xl text-text-muted mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5 text-accent-primary" />
                      </div>
                      <h4 className="text-sm font-bold text-text-main tracking-tight mb-1">Looking for more?</h4>
                      <p className="text-[11px] text-text-muted max-w-[200px] leading-relaxed mb-4">
                        Discover other leading tracks in our Course Library below.
                      </p>
                      <a
                        href="#course-library"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('course-library')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[10px] font-black text-accent-primary uppercase tracking-widest hover:underline cursor-pointer"
                      >
                        Explore Library ↓
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-surface-soft rounded-2xl border border-dashed border-surface-el">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-surface-el" />
                <p className="text-sm font-semibold text-text-muted mb-1">No courses enrolled yet</p>
                <p className="text-xs text-text-muted">Your mentor will add you once setup is complete.</p>
              </div>
            )}
          </GradientCard>
        </motion.div>

        {/* Enrolled Courses full bleed — with lock overlay */}
        <motion.div
          id="course-library"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-12 mt-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <h3 className={isModern
              ? "text-xl sm:text-2xl font-bold text-text-main"
              : "text-2xl sm:text-3xl font-black text-text-main tracking-tighter"}>
              Course Library
            </h3>
            {!canAccessCourses && (
              <span className="px-4 py-1.5 bg-surface-soft text-text-muted rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-surface-el w-fit">
                <Lock size={12} className="text-accent-primary" /> Access Pending
              </span>
            )}
            <div className="h-px flex-1 bg-surface-el hidden sm:block" />
          </div>

          <div className="relative">
            {!canAccessCourses && (
              <div className="absolute inset-0 z-50 bg-surface-base/40 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center text-center p-8 border border-surface-el">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-16 h-16 bg-text-main rounded-[1.5rem] flex items-center justify-center mb-6 shadow-2xl"
                >
                  <Lock className="w-6 h-6 text-surface-base" />
                </motion.div>
                <h4 className="text-xl font-black text-text-main mb-2">Access Required</h4>
                <p className="text-text-muted max-w-sm font-medium mb-8 text-sm">
                  Your course access is pending admin approval. Click below to request access.
                </p>
                <button
                  onClick={handleRequestAccess}
                  disabled={requestingAccess}
                  className="px-8 py-4 bg-accent-primary text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-accent-secondary transition-all shadow-xl disabled:opacity-50 cursor-pointer flex items-center gap-3"
                >
                  {requestingAccess ? 'Sending…' : <><Shield className="w-4 h-4" /> Request Access</>}
                </button>
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!canAccessCourses ? 'blur-md pointer-events-none select-none opacity-40' : ''}`}>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <GradientCard
                    key={course._id}
                    gradient="from-accent-primary to-accent-secondary"
                    className="hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1 pr-4">
                        <h4 className="text-lg font-black text-text-main mb-2 tracking-tight leading-tight">{course.title}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-surface-soft border border-surface-el flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-accent-primary" />
                          </div>
                          <p className="text-[11px] font-bold text-accent-primary uppercase tracking-widest">
                            {course.instructor?.name}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-text-main text-surface-base rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{course.description}</p>
                  </GradientCard>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-surface-soft rounded-3xl border border-dashed border-surface-el">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-surface-el" />
                  <p className="text-base font-semibold text-text-muted">No courses available yet</p>
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
