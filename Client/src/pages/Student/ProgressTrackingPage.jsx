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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-slate-900 text-xl font-black animate-pulse">Mapping Growth Trajectory...</div>
      </div>
    );
  }

  const avgScore = dashboardData?.submissions?.length > 0
    ? Math.round(dashboardData.submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / dashboardData.submissions.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-['Inter']"
      >
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit']">
          Learning <span className="text-[#fca96d]">Journey</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">Comprehensive overview of your academic trajectory and milestones.</p>
      </motion.div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <GradientCard gradient="from-teal-500 to-cyan-600">
          <div className="flex flex-col items-center text-center font-['Inter']">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-6 font-['Outfit']">Curriculum Integrity</h3>
            <ProgressChart
              progress={dashboardData?.overallProgress || 0}
              subtitle={`${dashboardData?.completedModules || 0} of ${dashboardData?.totalModules || 0} modules`}
              color="#14b8a6"
            />
          </div>
        </GradientCard>

        <GradientCard gradient="from-blue-500 to-indigo-600">
          <div className="flex flex-col items-center text-center py-6 font-['Inter']">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#fca96d] mb-8 font-['Outfit']">Average Grade Point</h3>
            <div className="mb-4">
              <span className="text-7xl font-black text-slate-900 tracking-tighter font-['Outfit']">{avgScore}%</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 px-4 py-1 bg-slate-50 rounded-full border border-slate-100">
              Verified across {dashboardData?.submissions?.length || 0} Assessments
            </p>
          </div>
        </GradientCard>

        <GradientCard gradient="from-emerald-500 to-teal-500">
          <div className="flex flex-col items-center text-center py-6 font-['Inter']">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-8 font-['Outfit']">Active Tracks</h3>
            <div className="mb-4">
              <span className="text-7xl font-black text-slate-900 tracking-tighter font-['Outfit']">{dashboardData?.totalCourses || 0}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 px-4 py-1 bg-slate-50 rounded-full border border-slate-100">
              Proprietary learning paths
            </p>
          </div>
        </GradientCard>
      </div>

      {/* Detailed Progress Overview */}
      <div className="font-['Inter']">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-['Outfit']">
          <div className="p-2 bg-[#fca96d]/10 rounded-lg text-[#fca96d]">
            <TrendingUp className="w-5 h-5" />
          </div>
          Granular Module Tracking
        </h2>
        <GradientCard gradient="from-purple-500 to-rose-500">
          <div className="space-y-8">
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
                    <div className="flex items-center justify-between mb-3 font-['Outfit']">
                      <span className="text-sm font-black text-slate-900 tracking-tight">{course.title}</span>
                      <span className="text-sm font-black text-[#fca96d]">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-[#fca96d] to-orange-500 h-full rounded-full"
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium italic">No curriculum data available.</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default ProgressTrackingPage;