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
          Learning <span className="text-[#2563EB]">Journey</span>
        </h1>
        <p className="text-base font-medium text-slate-500">Comprehensive overview of your academic trajectory and milestones.</p>
      </motion.div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
          <div className="flex flex-col items-center text-center font-['Inter']">
            <h3 className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB] mb-6 font-['Outfit']">Curriculum Integrity</h3>
            <ProgressChart
              progress={dashboardData?.overallProgress || 0}
              subtitle={`${dashboardData?.completedModules || 0} of ${dashboardData?.totalModules || 0} modules`}
              color="#2563EB"
            />
          </div>
        </GradientCard>

        <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
          <div className="flex flex-col items-center text-center py-6 font-['Inter']">
            <h3 className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB] mb-8 font-['Outfit']">Average Grade Point</h3>
            <div className="mb-4">
              <span className="text-7xl font-black text-slate-900 tracking-tighter font-['Outfit']">{avgScore}%</span>
            </div>
            <p className="text-\[13px\] font-black uppercase tracking-widest text-slate-400 mt-4 px-4 py-1 bg-slate-50 rounded-full border border-slate-100">
              Verified across {dashboardData?.submissions?.length || 0} Assessments
            </p>
          </div>
        </GradientCard>

        <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
          <div className="flex flex-col items-center text-center py-6 font-['Inter']">
            <h3 className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB] mb-8 font-['Outfit']">Active Tracks</h3>
            <div className="mb-4">
              <span className="text-7xl font-black text-slate-900 tracking-tighter font-['Outfit']">{dashboardData?.totalCourses || 0}</span>
            </div>
            <p className="text-\[13px\] font-black uppercase tracking-widest text-slate-400 mt-4 px-4 py-1 bg-slate-50 rounded-full border border-slate-100">
              Proprietary learning paths
            </p>
          </div>
        </GradientCard>
      </div>

      {/* Detailed Progress Overview */}
      <div className="font-['Inter']">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-['Outfit']">
          <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
            <TrendingUp className="w-5 h-5" />
          </div>
          Granular Module Tracking
        </h2>
        <GradientCard gradient="from-[#2563EB] to-[#FBEFEF]">
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
                      <span className="text-base font-black text-slate-900 tracking-tight">{course.title}</span>
                      <span className="text-base font-black text-[#2563EB]">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-[#2563EB] to-[#2563EB] h-full rounded-full"
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