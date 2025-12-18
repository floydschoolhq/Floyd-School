import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, PlayCircle, FileText } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket']
});

const ClassroomPage = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassroomData();
    fetchActiveLiveClass();

    socket.on('liveClass:started', (liveClass) => {
      setActiveLiveClass(liveClass);
    });

    socket.on('liveClass:ended', (classId) => {
      setActiveLiveClass(prev => (prev?._id === classId ? null : prev));
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
    } catch (error) {
      console.error('Failed to fetch active live class:', error);
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
          My Classroom <span className="text-[#fca96d]">Resources</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">Access your lessons, assignments, and recordings through our elite framework.</p>
      </motion.div>

      {/* Live Class Banner */}
      {activeLiveClass && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 bg-gradient-to-r from-[#fca96d] to-orange-500 rounded-2xl p-0.5 shadow-xl shadow-[#fca96d]/10"
        >
          <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                <div className="w-12 h-12 bg-red-50/50 rounded-full flex items-center justify-center border border-red-100">
                  <PlayCircle className="text-red-500 w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-900 text-xl font-black tracking-tight font-['Outfit']">Live Class in Session</h3>
                <p className="text-sm font-medium text-slate-500 font-['Inter']">{activeLiveClass.title}: {activeLiveClass.topic}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Instructor: {activeLiveClass.mentorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 font-['Outfit']">
              <div className="text-right hidden md:block">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Started at</p>
                <p className="text-slate-900 font-black">
                  {new Date(activeLiveClass.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <a
                href={activeLiveClass.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 uppercase text-xs tracking-widest cursor-pointer"
              >
                Join Now <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] ml-2 font-black">LIVE</span>
              </a>
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
              <GradientCard gradient="from-sky-500 via-blue-500 to-indigo-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${course.modules?.some(m => !m.completed)
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-green-500'
                      }`} />
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg tracking-tight">{course.title}</h3>
                      <p className="text-xs font-medium text-slate-500">{course.instructor?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Progress</div>
                      <div className="text-lg font-black text-[#fca96d]">
                        {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors">
                      Continue
                    </button>
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          ))}
          {courses.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium italic text-sm">No curriculum units assigned yet.</p>
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
              <GradientCard gradient="from-purple-500 to-indigo-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1 tracking-tight">{assignment.title}</h3>
                    <p className="text-xs font-medium text-slate-500 mb-4">{assignment.course?.title}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${assignment.status === 'published'
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
              <p className="font-medium italic text-sm">No active assignments found.</p>
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
        <GradientCard gradient="from-emerald-500 to-cyan-500">
          <div className="text-center py-8">
            <PlayCircle className="w-12 h-12 mx-auto mb-4 text-[#fca96d] opacity-50" />
            <p className="text-slate-900 font-black text-lg mb-1 tracking-tight">Archive Repository</p>
            <p className="text-sm font-medium text-slate-500 mb-6">Review previous technical deep dives and workshops.</p>
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