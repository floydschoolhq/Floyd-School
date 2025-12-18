import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, PlayCircle, FileText } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api from '../../api/axios';

const ClassroomPage = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassroomData();
  }, []);

  const fetchClassroomData = async () => {
    try {
      const [coursesRes, assignmentsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/assignments')
      ]);
      setCourses(coursesRes.data);
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Failed to fetch classroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
          My Classroom Resources
        </h1>
        <p className="text-slate-400">Access your lessons, assignments, and recordings</p>
      </motion.div>

      {/* Live Class Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-1 shadow-lg shadow-orange-500/20"
      >
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute top-0 -right-1"></div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500">
                <PlayCircle className="text-red-500 w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Live Class in Session</h3>
              <p className="text-slate-300">Data Structures & Algorithms: Graph Theory</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-400 uppercase font-bold">Started at</p>
              <p className="text-white font-mono">10:00 AM</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all">
              Join Now <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">LIVE</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Current Lessons */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-400" />
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
                      <h3 className="font-semibold text-white text-lg">{course.title}</h3>
                      <p className="text-sm text-slate-300">{course.instructor?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Progress</div>
                      <div className="text-lg font-bold text-sky-400">
                        {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          ))}
          {courses.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No lessons available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignments */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-400" />
          Assignments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GradientCard gradient="from-purple-500 via-pink-500 to-rose-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{assignment.title}</h3>
                    <p className="text-sm text-slate-300 mb-2">{assignment.course?.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${assignment.status === 'published'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-green-500/20 text-green-400'
                    }`}>
                    {assignment.status}
                  </span>
                </div>
              </GradientCard>
            </motion.div>
          ))}
          {assignments.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No assignments available</p>
            </div>
          )}
        </div>
      </div>

      {/* Class Recordings */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-emerald-400" />
          Recent Class Recordings
        </h2>
        <GradientCard gradient="from-emerald-500 via-teal-500 to-cyan-500">
          <div className="text-center py-8">
            <PlayCircle className="w-12 h-12 mx-auto mb-3 text-white/70" />
            <p className="text-white font-medium mb-2">Class Recordings</p>
            <p className="text-sm text-slate-300 mb-4">Access recorded sessions and lectures</p>
            <button className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors">
              View All Recordings
            </button>
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default ClassroomPage;