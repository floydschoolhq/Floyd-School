import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, PlayCircle, FileText, Trash2, X, Video, Calendar, Users } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';
import { io } from 'socket.io-client';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';
import Masterclasses from '../../components/Masterclasses';
import AssignmentSubmissionModal from '../../components/Student/AssignmentSubmissionModal';
import { CardSkeleton, StatSkeleton } from '../../components/dashboard/SkeletonCard';
import { PortalContext } from '../../contexts/PortalProvider';
import { useSocket } from '../../contexts/SocketProvider';
import useIsMobile from '../../hooks/useIsMobile';

const ClassroomPage = () => {
  const { socket } = useSocket();
  const isMobile = useIsMobile(768);

  const { user, setView, setActiveLiveClass: setGlobalActiveLiveClass } = useContext(PortalContext);
  
  // Check if user is classroom user (from sessionStorage auth)
  const isClassroomUser = user?.isClassroomAccess === true;
  
  // Classroom users still need admin approval for content
  const canAccessContent = user?.permissions?.canAccessCourses;
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [scheduledLives, setScheduledLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myDoubt, setMyDoubt] = useState(null);
  const [isSignaling, setIsSignaling] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [activeScheduledVideo, setActiveScheduledVideo] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleRequestAccess = async () => {
    setRequestingAccess(true);
    try {
      await api.post('/students/request-access', {
        permission: 'canAccessCourses',
        message: 'Requesting access to course classroom'
      });
      alert('Access request submitted! An administrator will review your request shortly.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit access request');
    } finally {
      setRequestingAccess(false);
    }
  };

  const getSubmissionAssignmentId = (submission) => {
    return (submission?.assignment?._id || submission?.assignment || '').toString();
  };

  const getAssignmentSubmission = (assignmentId) => {
    return submissions.find(sub => getSubmissionAssignmentId(sub) === assignmentId.toString());
  };

  const handleAssignmentSubmitted = (submission) => {
    const assignmentId = getSubmissionAssignmentId(submission);

    setSubmissions(prev => [
      submission,
      ...prev.filter(item => getSubmissionAssignmentId(item) !== assignmentId)
    ]);

    setSelectedAssignment(null);
  };

  useEffect(() => {
    // Only connect socket if available
    if (!socket) {
      setLoading(false); // In case socket is missing but we're here
      return;
    }

    fetchActiveLiveClass();
    fetchScheduledLives();

    socket.on('liveClass:started', (liveClass) => {
      setActiveLiveClass(liveClass);
      setGlobalActiveLiveClass(liveClass);
    });

    socket.on('liveClass:ended', (classId) => {
      setActiveLiveClass(prev => (prev?._id === classId ? null : prev));
      setGlobalActiveLiveClass(null);
      setMyDoubt(null);
    });

    socket.on('scheduledLive:started', (scheduledLive) => {
      setScheduledLives(prev => prev.map(live => 
        live._id === scheduledLive._id ? { ...live, status: 'live' } : live
      ));
      setGlobalActiveLiveClass(scheduledLive);
    });

    socket.on('scheduledLive:ended', (liveId) => {
      setScheduledLives(prev => prev.map(live => 
        live._id === liveId ? { ...live, status: 'ended' } : live
      ));
    });

    socket.on('doubt:resolved', (resolvedDoubt) => {
      setMyDoubt(prev => (prev?._id === resolvedDoubt._id ? { ...prev, isResolved: true } : prev));
    });

    socket.on('doubt:new', (newDoubt) => {
      if (newDoubt.student === socket.userId) {
        setMyDoubt(newDoubt);
      }
    });

    socket.on('doubt:deleted', (deletedDoubtId) => {
      if (myDoubt && myDoubt._id === deletedDoubtId) {
        setMyDoubt(null);
      }
    });

    return () => {
      if (socket) {
        socket.off('liveClass:started');
        socket.off('liveClass:ended');
      }
    };
  }, [socket]); // Removed isClassroomUser dependency to let it run for all students

  useEffect(() => {
    fetchClassroomData();
  }, [user]);

  useEffect(() => {
    const preventContext = (e) => e.preventDefault();
    window.addEventListener('contextmenu', preventContext);
    return () => window.removeEventListener('contextmenu', preventContext);
  }, []);

  const fetchActiveLiveClass = async () => {
    try {
      const res = await api.get('/live-classes/active');
      setActiveLiveClass(res.data);
      setGlobalActiveLiveClass(res.data);
      if (res.data && socket) {
        fetchMyCurrentDoubt(res.data._id);
        socket.emit('liveClass:join', res.data._id);
      }
    } catch (error) {
      console.error('Failed to fetch active live class:', error);
    }
  };

  const fetchScheduledLives = async () => {
    try {
      const res = await api.get('/scheduled-live/upcoming');
      setScheduledLives(res.data);
    } catch (error) {
      console.error('Failed to fetch scheduled lives:', error);
    }
  };

  const fetchMyCurrentDoubt = async (classId) => {
    try {
      const res = await api.get(`/doubts/${classId}/my`);
      setMyDoubt(res.data);
    } catch (error) {
      // It's okay if no doubt exists
    }
  };

  const handleRaiseHand = async () => {
    if (!activeLiveClass || myDoubt) return;
    setIsSignaling(true);
    try {
      const res = await api.post('/doubts', {
        liveClassId: activeLiveClass._id,
        question: 'Student is requesting technical assistance or has a live doubt.'
      });
      setMyDoubt(res.data);
    } catch (error) {
      console.error('Failed to signal mentor:', error);
    } finally {
      setIsSignaling(false);
    }
  };

  const handleTerminateDoubt = async () => {
    if (!myDoubt) return;
    try {
      const doubtId = myDoubt._id;
      setMyDoubt(null);
      await api.delete(`/doubts/${doubtId}`);
    } catch (error) {
      console.error('Failed to terminate doubt:', error);
    }
  };

  const fetchClassroomData = async () => {
    try {
      const [coursesRes, assignmentsRes, dashboardRes] = await Promise.all([
        api.get('/courses'),
        api.get('/assignments'),
        api.get('/dashboard/student').catch(() => null)
      ]);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data);
      setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : assignmentsRes.data.data);
      setSubmissions(dashboardRes?.data?.submissions || []);
    } catch (error) {
      console.error('Failed to fetch classroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-base p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <CardSkeleton lines={3} />
              <CardSkeleton lines={2} />
            </div>
            <CardSkeleton lines={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'min-h-screen bg-surface-base transition-colors duration-500' : 'min-h-screen bg-surface-base transition-colors duration-500 p-6'} relative`}>
      {!canAccessContent && (
        <div className="absolute inset-0 z-[100] bg-surface-base/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-text-main mb-2 tracking-normal`}>
            Access <span className="text-blue-600">Pending</span>
          </h2>
          <p className="text-text-muted max-w-md font-medium mb-8 text-sm leading-relaxed">
            Your classroom access is currently being set up. <br />
            Please request access from your administrator to view the full curriculum.
          </p>
          <button
            onClick={handleRequestAccess}
            disabled={requestingAccess}
            className="px-10 py-5 bg-text-main text-white text-sm font-bold font-medium rounded-2xl hover:bg-blue-600 transition-all shadow-sm shadow-slate-900/10 disabled:opacity-50"
          >
            {requestingAccess ? 'Processing...' : 'Request Course Access'}
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isMobile ? 'px-4 py-6' : 'mb-8'}`}
      >
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-semibold text-text-main mb-2 tracking-normal`}>
          My Classroom <span className="text-[#2563EB]">Resources</span>
        </h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-text-muted`}>
          {isMobile 
            ? 'Access lessons, recordings & assignments on the go.'
            : 'Access your lessons, assignments, and recordings through our elite framework.'
          }
        </p>
      </motion.div>

      {/* Mobile-Optimized Live Class Banner */}
      {isMobile && (activeLiveClass || scheduledLives.some(l => l.status === 'live' || l.status === 'scheduled')) && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 mx-4"
        >
          <div className="bg-surface-soft border border-surface-el rounded-2xl p-0.5 shadow-sm shadow-[#2563EB]/10">
            <div className="bg-surface-base rounded-2xl p-4">
              {activeLiveClass && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <Video className="text-red-500 w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-text-main font-bold text-sm">LIVE NOW</h3>
                      <p className="text-text-main font-bold text-base">{activeLiveClass.title}</p>
                      <p className="text-text-muted text-xs">{activeLiveClass.mentorName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {myDoubt ? (
                      <div className={`flex-1 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-xs ${myDoubt.isResolved
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600 animate-pulse'
                        }`}>
                        {myDoubt.isResolved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="uppercase tracking-wider">
                          {myDoubt.isResolved ? 'Resolved' : 'Mentor Notified'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleRaiseHand}
                        disabled={isSignaling}
                        className="flex-1 bg-text-main text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                      >
                        {isSignaling ? 'Signaling...' : 'Raise Hand'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setGlobalActiveLiveClass(activeLiveClass);
                        setView('LiveSession');
                      }}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider"
                    >
                      Join Live
                    </button>
                  </div>
                </div>
              )}

              {/* Scheduled Lives for Mobile */}
              {scheduledLives.filter(l => l.status === 'scheduled').length > 0 && (
                <div className={`${activeLiveClass ? 'border-t border-surface-el pt-4 mt-4' : ''}`}>
                  <h4 className="text-xs font-semibold text-text-muted/70 font-medium mb-3">Upcoming Sessions</h4>
                  <div className="space-y-2">
                    {scheduledLives.filter(l => l.status === 'scheduled').slice(0, 2).map(live => (
                      <div 
                        key={live._id} 
                        className="bg-surface-soft rounded-lg p-3 flex items-center gap-3"
                        onClick={() => setActiveScheduledVideo(live)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="text-blue-500 w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-text-main text-sm truncate">{live.title}</h5>
                          <p className="text-xs text-text-muted">
                            {new Date(live.scheduledStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop Live Class Banner (Original) */}
      {!isMobile && (activeLiveClass || scheduledLives.some(l => l.status === 'live' || l.status === 'scheduled')) && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 bg-surface-soft border border-surface-el rounded-2xl p-0.5 shadow-sm shadow-[#2563EB]/10"
        >
          <div className="bg-surface-base rounded-2xl p-6 flex flex-col gap-6">
            {activeLiveClass && (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                      <div className="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center border border-blue-100">
                        <PlayCircle className="text-blue-500 w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-text-main text-xl font-semibold tracking-normal">Live Class in Session</h3>
                      <p className="text-base font-medium text-text-muted">{activeLiveClass.title}: {activeLiveClass.topic}</p>
                      <p className="text-[13px] text-text-muted/70 font-bold uppercase mt-1">Instructor: {activeLiveClass.mentorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {myDoubt ? (
                      <div className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-2 ${myDoubt.isResolved
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                        }`}>
                        {myDoubt.isResolved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        <span className="text-[13px] font-medium">
                          {myDoubt.isResolved ? 'Signal Resolved' : 'Mentor Signaled'}
                        </span>
                        {myDoubt.isResolved && (
                          <button
                            onClick={handleTerminateDoubt}
                            className="ml-2 bg-blue-100/50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-lg transition-colors border border-blue-200"
                            title="Close this doubt to ask a new one"
                          >
                            <Trash2 size={12} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleRaiseHand}
                        disabled={isSignaling}
                        className="bg-text-main hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10 uppercase text-base tracking-widest cursor-pointer disabled:opacity-50"
                      >
                        {isSignaling ? 'Sending Signal...' : 'Raise Hand'}
                      </button>
                    )}
                    <div className="h-10 w-[1px] bg-slate-100 mx-1 hidden md:block"></div>
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-[13px] text-text-muted/70 uppercase font-semibold tracking-widest">Started at</p>
                      <p className="text-text-main font-semibold">
                        {new Date(activeLiveClass.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setGlobalActiveLiveClass(activeLiveClass);
                        setView('LiveSession');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 uppercase text-base tracking-widest cursor-pointer"
                    >
                      Join Meeting <span className="bg-surface-base/20 px-2 py-0.5 rounded text-[13px] ml-2 font-semibold">LIVE</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Scheduled Lives */}
            {scheduledLives.filter(l => l.status === 'scheduled').length > 0 && (
              <div className="border-t border-surface-el pt-6 mt-4">
                <h4 className="text-sm font-semibold text-text-muted/70 font-medium mb-4">Upcoming Video Sessions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledLives.filter(l => l.status === 'scheduled').map(live => (
                    <div 
                      key={live._id} 
                      className="bg-surface-soft rounded-xl p-4 border border-surface-el hover:border-red-300 transition-colors cursor-pointer"
                      onClick={() => setActiveScheduledVideo(live)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="text-red-500 w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-text-main text-sm truncate">{live.title}</h5>
                          <p className="text-xs text-text-muted font-medium mt-1">
                            {new Date(live.scheduledStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] text-text-muted/70 font-bold uppercase mt-1">by {live.mentorName || live.mentor?.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Active Scheduled Video Player - Mobile Optimized */}
      {activeScheduledVideo && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${isMobile ? 'mb-6 mx-4' : 'mb-8'} bg-surface-base rounded-2xl overflow-hidden shadow-sm border border-surface-el`}
        >
          <div className="flex items-center justify-between p-4 border-b border-surface-el">
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-text-main`}>{activeScheduledVideo.title}</h3>
              <p className="text-xs text-text-muted font-medium">by {activeScheduledVideo.mentorName || activeScheduledVideo.mentor?.name}</p>
            </div>
            <button
              onClick={() => setActiveScheduledVideo(null)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={20} className="text-text-muted/70" />
            </button>
          </div>
          <div className={`${isMobile ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
            <CustomVideoPlayer
              videoUrl={activeScheduledVideo.videoUrl}
              autoPlay={true}
            />
          </div>
        </motion.div>
      )}

      {/* Mobile-Optimized Current Lessons */}
      {isMobile ? (
        <div className="mb-6 mx-4">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
              <BookOpen className="w-4 h-4" />
            </div>
            My Courses
          </h2>
          <div className="space-y-3">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface-base rounded-xl p-4 border border-surface-el shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${course.modules?.some(m => !m.completed)
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-green-500'
                      }`} />
                    <div>
                      <h3 className="font-bold text-text-main text-sm">{course.title}</h3>
                      <p className="text-xs text-text-muted">{course.instructor?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-text-muted/70 uppercase">Progress</div>
                    <div className="text-sm font-semibold text-blue-600">
                      {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-8 text-text-muted/70">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">No courses assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Current Lessons */
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-main mb-6 flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
              <BookOpen className="w-5 h-5" />
            </div>
            Current Lessons
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${course.modules?.some(m => !m.completed)
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-green-500'
                        }`} />
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg tracking-normal">{course.title}</h3>
                        <p className="text-base font-medium text-text-muted">{course.instructor?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[13px] font-semibold tracking-widest text-text-muted/70 uppercase">Progress</div>
                        <div className="text-lg font-semibold text-[#2563EB]">
                          {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = '/student/recordings'}
                        className="px-4 py-2 bg-text-main hover:bg-slate-800 text-white rounded-lg text-base font-bold transition-colors"
                      >
                        Study Node
                      </button>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-12 text-text-muted/70">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium italic text-base">No curriculum units assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile-Optimized Assignments */}
      {isMobile ? (
        <div className="mb-6 mx-4">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <FileText className="w-4 h-4" />
            </div>
            Assignments
          </h2>
          <div className="space-y-3">
            {assignments.slice(0, 2).map((assignment, index) => {
              const submission = getAssignmentSubmission(assignment._id);

              return (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface-base rounded-xl p-4 border border-surface-el shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-text-main text-sm mb-1">{assignment.title}</h3>
                      <p className="text-xs text-text-muted mb-2">{assignment.course?.title}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted/70">
                        <Clock className="w-3 h-3" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[11px] font-black uppercase tracking-widest ${submission
                          ? submission.status === 'graded'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                          }`}>
                          {submission
                            ? submission.status === 'graded'
                              ? 'Graded'
                              : 'Submitted'
                            : 'Not submitted'}
                        </span>

                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors ${submission
                            ? 'bg-surface-soft text-text-main border border-surface-el'
                            : 'bg-blue-500 text-white'
                            }`}
                        >
                          {submission ? 'View Submission' : 'Submit Work'}
                        </button>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${assignment.status === 'published'
                      ? 'bg-orange-50 text-orange-600 border border-orange-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                      {assignment.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            {assignments.length === 0 && (
              <div className="text-center py-8 text-text-muted/70">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">No active assignments.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Assignments */
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-main mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <FileText className="w-5 h-5" />
            </div>
            Technical Assignments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assignment, index) => {
              const submission = getAssignmentSubmission(assignment._id);

              return (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1 tracking-normal">{assignment.title}</h3>
                        <p className="text-base font-medium text-text-muted mb-4">{assignment.course?.title}</p>
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-text-muted/70 font-medium">
                          <Clock className="w-3 h-3" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>

                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                          <span className={`px-2 py-1 rounded text-[11px] font-black uppercase tracking-widest ${submission
                            ? submission.status === 'graded'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'bg-slate-50 text-slate-500 border border-slate-100'
                            }`}>
                            {submission
                              ? submission.status === 'graded'
                                ? 'Graded'
                                : 'Submitted'
                              : 'Not submitted'}
                          </span>

                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors ${submission
                              ? 'bg-surface-soft text-text-main border border-surface-el'
                              : 'bg-blue-500 text-white'
                              }`}
                          >
                            {submission ? 'View Submission' : 'Submit Work'}
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[13px] font-semibold uppercase tracking-normal ${assignment.status === 'published'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </GradientCard>
                </motion.div>
              );
            })}
            {assignments.length === 0 && (
              <div className="col-span-full text-center py-12 text-text-muted/70">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium italic text-base">No active assignments found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile-Optimized Class Recordings */}
      {isMobile ? (
        <div className="mb-6 mx-4">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <Video className="w-4 h-4" />
            </div>
            Recordings
          </h2>
          <div className="bg-surface-base rounded-xl p-4 border border-surface-el shadow-sm">
            <div className="text-center py-6">
              <Video className="w-10 h-10 mx-auto mb-3 text-blue-600 opacity-50" />
              <p className="text-text-main font-bold text-sm mb-1">Video Archive</p>
              <p className="text-xs text-text-muted mb-4">Watch previous sessions anytime.</p>
              <button 
                onClick={() => window.location.href = '/student/recordings'}
                className="w-full px-4 py-2 bg-text-main text-white rounded-lg font-bold text-sm transition-all"
              >
                Browse All Videos
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Class Recordings */
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-text-main mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <PlayCircle className="w-5 h-5" />
            </div>
            Integration Sessions
          </h2>
          <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
            <div className="text-center py-8">
              <PlayCircle className="w-12 h-12 mx-auto mb-4 text-[#2563EB] opacity-50" />
              <p className="text-text-main font-semibold text-lg mb-1 tracking-normal">Archive Repository</p>
              <p className="text-base font-medium text-text-muted mb-6">Review previous technical deep dives and workshops.</p>
              <button 
                onClick={() => window.location.href = '/student/recordings'}
                className="px-8 py-3 bg-text-main hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10"
              >
                Browse Archive
              </button>
            </div>
          </GradientCard>
        </div>
      )}

      {/* Masterclasses Integration */}
      {!isMobile && canAccessContent && (
        <div className="mt-8 mb-12 border-t border-surface-el pt-8">
          <Masterclasses />
        </div>
      )}

      {/* Mobile-Only: Quick Actions Footer */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface-base border-t border-surface-el p-4 z-50">
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/student/recordings'}
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Video className="w-3 h-3" />
              All Videos
            </button>
            <button
              onClick={() => window.location.href = '/student/dashboard'}
              className="flex-1 bg-text-main text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3 h-3" />
              Dashboard
            </button>
          </div>
        </div>
      )}

      <AssignmentSubmissionModal
        isOpen={Boolean(selectedAssignment)}
        assignment={selectedAssignment}
        submission={selectedAssignment ? getAssignmentSubmission(selectedAssignment._id) : null}
        onClose={() => setSelectedAssignment(null)}
        onSubmitted={handleAssignmentSubmitted}
      />
    </div>
  );
};

export default ClassroomPage;
