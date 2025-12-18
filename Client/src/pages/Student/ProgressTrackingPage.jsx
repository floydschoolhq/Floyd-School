import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import { ProgressChart } from '../../components/dashboard/ProgressChart';
import api from '../../api/axios';

const ProgressTrackingPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
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

  const avgScore = dashboardData?.submissions?.length > 0
    ? Math.round(dashboardData.submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / dashboardData.submissions.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-600">
          Student Progress Tracking
        </h1>
        <p className="text-slate-400">Monitor your learning journey and achievements</p>
      </motion.div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GradientCard gradient="from-teal-500 via-cyan-500 to-blue-500">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Module Completion</h3>
            <ProgressChart
              progress={dashboardData?.overallProgress || 0}
              subtitle={`${dashboardData?.completedModules || 0} of ${dashboardData?.totalModules || 0} modules`}
              color="#14b8a6"
            />
          </div>
        </GradientCard>

        <GradientCard gradient="from-blue-500 via-indigo-500 to-purple-500">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Average Score</h3>
            <div className="mb-4">
              <span className="text-6xl font-extrabold text-white">{avgScore}%</span>
            </div>
            <p className="text-sm text-white/70">
              Based on {dashboardData?.submissions?.length || 0} graded assignments
            </p>
          </div>
        </GradientCard>

        <GradientCard gradient="from-green-500 via-emerald-500 to-teal-500">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Enrolled Courses</h3>
            <div className="mb-4">
              <span className="text-6xl font-extrabold text-white">{dashboardData?.totalCourses || 0}</span>
            </div>
            <p className="text-sm text-white/70">
              Active learning paths
            </p>
          </div>
        </GradientCard>
      </div>

      {/* Detailed Progress Overview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Detailed Progress Overview</h2>
        <GradientCard gradient="from-purple-500 via-pink-500 to-rose-500">
          <div className="space-y-6">
            {/* Course Progress Bars */}
            {dashboardData?.courses && dashboardData.courses.length > 0 ? (
              dashboardData.courses.map((course, index) => {
                const progress = Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0);
                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{course.title}</span>
                      <span className="text-sky-400 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-sky-400 to-blue-600 h-3 rounded-full"
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 text-white/70">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No courses enrolled yet</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default ProgressTrackingPage;