import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, PlayCircle, FileText, Trash2 } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';
import { io } from 'socket.io-client';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import { PortalContext } from '../../components/Context/PortalProvider';
import { useContext } from 'react';

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ClassroomPage = () => {
  const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
  });

  const { setView, setActiveLiveClass: setGlobalActiveLiveClass } = useContext(PortalContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myDoubt, setMyDoubt] = useState(null);
  const [isSignaling, setIsSignaling] = useState(false);

  useEffect(() => {
    fetchClassroomData();
    fetchActiveLiveClass();

    socket.on('liveClass:started', (liveClass) => {
      setActiveLiveClass(liveClass);
    });

    socket.on('liveClass:ended', (classId) => {
      setActiveLiveClass(prev => (prev?._id === classId ? null : prev));
      setMyDoubt(null);
    });

    socket.on('doubt:resolved', (resolvedDoubt) => {
      setMyDoubt(prev => (prev?._id === resolvedDoubt._id ? { ...prev, isResolved: true } : prev));
    });

    socket.on('doubt:new', (newDoubt) => {
      // Just to be safe, if student raises doubt on another device
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

  const fetchActiveLiveClass = async () => {
    try {
      const res = await api.get('/live-classes/active');
      setActiveLiveClass(res.data);
      if (res.data) {
        fetchMyCurrentDoubt(res.data._id);
        socket.emit('liveClass:join', res.data._id);
      }
    } catch (error) {
      console.error('Failed to fetch active live class:', error);
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
      // Optimistic UI update
      const doubtId = myDoubt._id;
      setMyDoubt(null);
      await api.delete(`/doubts/${doubtId}`);
    } catch (error) {
      console.error('Failed to terminate doubt:', error);
      // Revert if failed (optional, but good practice if we stored previous state)
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-['Inter']"
      >
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit']">
          My Classroom <span className="text-[#2563EB]">Resources</span>
        </h1>
        <p className="text-base font-medium text-slate-500">Access your lessons, assignments, and recordings through our elite framework.</p>
      </motion.div>

      {/* Live Class Banner */}
      {activeLiveClass && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 bg-gradient-to-r from-[#2563EB] to-[#2563EB] rounded-2xl p-0.5 shadow-xl shadow-[#2563EB]/10"
        >
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                  <div className="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center border border-blue-100">
                    <PlayCircle className="text-blue-500 w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl font-black tracking-tight font-['Outfit']">Live Class in Session</h3>
                  <p className="text-base font-medium text-slate-500 font-['Inter']">{activeLiveClass.title}: {activeLiveClass.topic}</p>
                  <p className="text-[13px] text-slate-400 font-bold uppercase mt-1">Instructor: {activeLiveClass.mentorName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-['Outfit']">
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

            {/* Live Class Stream + Chat */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px] mb-12">
              <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                {getYouTubeId(activeLiveClass.meetingLink) ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeId(activeLiveClass.meetingLink)}?autoplay=1`}
                    title="Live Session"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900 gap-6 p-8 text-center bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay bg-black/60">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-pulse">
                      <PlayCircle size={40} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Embedded Live Session</h3>
                      <p className="text-slate-300 font-medium max-w-md mx-auto">This session can be viewed directly within our secure terminal environment.</p>
                    </div>
                    <button
                      onClick={() => {
                        setGlobalActiveLiveClass(activeLiveClass);
                        setView('LiveSession');
                      }}
                      className="mt-2 bg-[#2563EB] text-slate-900 px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-xl shadow-[#2563EB]/20 flex items-center gap-3"
                    >
                      Join Meeting Now <CheckCircle size={16} />
                    </button>
                    <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mt-4">Platform: {activeLiveClass.platform?.toUpperCase() || new URL(activeLiveClass.meetingLink).hostname}</p>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-80 h-full rounded-3xl overflow-hidden shadow-2xl">
                <LiveChatSidebar classId={activeLiveClass._id} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Lessons */}
      <div className="mb-8 font-['Inter']">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-['Outfit']">
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
      <div className="mb-8 font-['Inter']">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-['Outfit']">
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
      <div className="mb-10 font-['Inter']">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-['Outfit']">
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