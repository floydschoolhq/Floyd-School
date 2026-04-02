import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, PlayCircle, FileText, Trash2, X } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';
import { io } from 'socket.io-client';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';

import { PortalContext } from '../../components/Context/PortalProvider';
import { useSocket } from '../../components/Context/SocketContext';
import { useContext } from 'react';

const ClassroomPage = () => {
  const socket = useSocket();

  const { user, setView, setActiveLiveClass: setGlobalActiveLiveClass } = useContext(PortalContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [scheduledLives, setScheduledLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myDoubt, setMyDoubt] = useState(null);
  const [isSignaling, setIsSignaling] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [activeScheduledVideo, setActiveScheduledVideo] = useState(null);

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

  useEffect(() => {
    fetchClassroomData();
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
      socket.off('liveClass:started');
      socket.off('liveClass:ended');
    };
  }, []);

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
      if (res.data) {
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
      const [coursesRes, assignmentsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/assignments')
      ]);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data);
      setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : assignmentsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch classroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-slate-900 text-xl font-black animate-pulse">Initializing Framework...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative">
      {!user?.permissions?.canAccessCourses && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">
            Access <span className="text-blue-600">Pending</span>
          </h2>
          <p className="text-slate-500 max-w-md font-medium mb-8 text-sm leading-relaxed">
            Your classroom access is currently being set up. <br />
            Please request access from your administrator to view the full curriculum.
          </p>
          <button
            onClick={handleRequestAccess}
            disabled={requestingAccess}
            className="px-10 py-5 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
          >
            {requestingAccess ? 'Processing...' : 'Request Course Access'}
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
          My Classroom <span className="text-[#2563EB]">Resources</span>
        </h1>
        <p className="text-base font-medium text-slate-500">Access your lessons, assignments, and recordings through our elite framework.</p>
      </motion.div>

      {/* Active Scheduled Video Player */}
      {activeScheduledVideo && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">{activeScheduledVideo.title}</h3>
              <p className="text-xs text-slate-500 font-medium">by {activeScheduledVideo.mentorName || activeScheduledVideo.mentor?.name}</p>
            </div>
            <button
              onClick={() => setActiveScheduledVideo(null)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="aspect-video bg-black">
            <CustomVideoPlayer
              videoUrl={activeScheduledVideo.videoUrl}
              autoPlay={true}
            />
          </div>
        </motion.div>
      )}

      {/* Live Class Banner */}
      {(activeLiveClass || scheduledLives.some(l => l.status === 'live' || l.status === 'scheduled')) && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 bg-gradient-to-r from-[#2563EB] to-[#2563EB] rounded-2xl p-0.5 shadow-xl shadow-[#2563EB]/10"
        >
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
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
                      <h3 className="text-slate-900 text-xl font-black tracking-tight">Live Class in Session</h3>
                      <p className="text-base font-medium text-slate-500">{activeLiveClass.title}: {activeLiveClass.topic}</p>
                      <p className="text-[13px] text-slate-400 font-bold uppercase mt-1">Instructor: {activeLiveClass.mentorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {myDoubt ? (
                      <div className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-2 ${myDoubt.isResolved
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                        }`}>
                        {myDoubt.isResolved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        <span className="text-[13px] uppercase tracking-widest">
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
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10 uppercase text-base tracking-widest cursor-pointer disabled:opacity-50"
                      >
                        {isSignaling ? 'Sending Signal...' : 'Raise Hand'}
                      </button>
                    )}
                    <div className="h-10 w-[1px] bg-slate-100 mx-1 hidden md:block"></div>
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-[13px] text-slate-400 uppercase font-black tracking-widest">Started at</p>
                      <p className="text-slate-900 font-black">
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
                      Join Meeting <span className="bg-white/20 px-2 py-0.5 rounded text-[13px] ml-2 font-black">LIVE</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Scheduled Lives */}
            {scheduledLives.filter(l => l.status === 'scheduled').length > 0 && (
              <div className="border-t border-slate-100 pt-6 mt-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Upcoming Video Sessions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledLives.filter(l => l.status === 'scheduled').map(live => (
                    <div 
                      key={live._id} 
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-red-300 transition-colors cursor-pointer"
                      onClick={() => setActiveScheduledVideo(live)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="text-red-500 w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-black text-slate-900 text-sm truncate">{live.title}</h5>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {new Date(live.scheduledStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">by {live.mentorName || live.mentor?.name}</p>
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

      {/* Current Lessons */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
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
                      <h3 className="font-bold text-slate-800 text-lg tracking-tight">{course.title}</h3>
                      <p className="text-base font-medium text-slate-500">{course.instructor?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[13px] font-black tracking-widest text-slate-400 uppercase">Progress</div>
                      <div className="text-lg font-black text-[#2563EB]">
                        {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                      </div>
                    </div>
                    <button
                      onClick={() => window.location.href = '/student/recordings'}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-base font-bold transition-colors"
                    >
                      Study Node
                    </button>
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          ))}
          {courses.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium italic text-base">No curriculum units assigned yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignments */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
            <FileText className="w-5 h-5" />
          </div>
          Technical Assignments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1 tracking-tight">{assignment.title}</h3>
                    <p className="text-base font-medium text-slate-500 mb-4">{assignment.course?.title}</p>
                    <div className="flex items-center gap-2 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[13px] font-black uppercase tracking-tighter ${assignment.status === 'published'
                    ? 'bg-orange-50 text-orange-600 border border-orange-100'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                    {assignment.status}
                  </span>
                </div>
              </GradientCard>
            </motion.div>
          ))}
          {assignments.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium italic text-base">No active assignments found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Class Recordings */}
      <div className="mb-10">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
            <PlayCircle className="w-5 h-5" />
          </div>
          Integration Sessions
        </h2>
        <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
          <div className="text-center py-8">
            <PlayCircle className="w-12 h-12 mx-auto mb-4 text-[#2563EB] opacity-50" />
            <p className="text-slate-900 font-black text-lg mb-1 tracking-tight">Archive Repository</p>
            <p className="text-base font-medium text-slate-500 mb-6">Review previous technical deep dives and workshops.</p>
            <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10">
              Browse Archive
            </button>
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default ClassroomPage;
