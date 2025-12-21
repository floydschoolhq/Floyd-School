import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, BarChart3 } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import { ProgressChart } from '../../components/dashboard/ProgressChart';
import api from '../../api/axios';

const PerformanceReportPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setSubmissions(response.data.submissions || []);
      setStats(response.data.stats || {});
      setSkills(response.data.skillMatrix || []);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-slate-900 text-xl font-black animate-pulse">Analyzing Performance Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-['Inter']"
      >
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-['Outfit']">
          Performance <span className="text-[#2563EB]">Analytics</span>
        </h1>
        <p className="text-base font-medium text-slate-500">In-depth analysis of scores, participation, and skill mastery metrics.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 font-['Inter']">
        <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB] mb-1 font-['Outfit']">Completed Deliverables</p>
              <h3 className="text-3xl font-black text-white font-['Outfit']">{stats.completedAssignments || 0}</h3>
            </div>
            <div className="p-3 bg-[#2D2D2D] rounded-xl shadow-sm border border-[#2563EB]/20">
              <Award className="w-8 h-8 text-[#2563EB]" />
            </div>
          </div>
        </GradientCard>

        <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB] mb-1 font-['Outfit']">Average Integrity Score</p>
              <h3 className="text-3xl font-black text-slate-900 font-['Outfit']">
                {submissions.length > 0
                  ? Math.round(submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.length)
                  : 0}%
              </h3>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <TrendingUp className="w-8 h-8 text-[#2563EB]" />
            </div>
          </div>
        </GradientCard>

        <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-\[13px\] font-black uppercase tracking-widest text-[#2563EB] mb-1 font-['Outfit']">Active Specializations</p>
              <h3 className="text-3xl font-black text-slate-900 font-['Outfit']">{stats.enrolledCourses || 0}</h3>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <Target className="w-8 h-8 text-[#2563EB]" />
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Skill Breakdown */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-['Outfit']">
            <div className="p-2 bg-[#FBEFEF] rounded-lg text-[#2563EB]">
              <BarChart3 className="w-5 h-5" />
            </div>
            Skill Competency Matrix
          </h2>
          <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-base font-black uppercase tracking-widest">
                    <span className="text-[#2563EB]">{skill.name}</span>
                    <span className="text-white">{skill.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-[#2563EB] to-[#F9DFDF] h-full rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GradientCard>
        </div>

        {/* Note/Call to action */}
        <div className="flex flex-col justify-center font-['Inter']">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight font-['Outfit']">Ready for your next <span className="text-[#2563EB]">Level?</span></h3>
            <p className="text-base font-medium text-slate-500 mb-6 leading-relaxed">Your performance metrics indicate a strong grasp of fundamental concepts. Consider unlocking advanced engineering tracks to further accelerate your growth.</p>
            <button className="px-8 py-3 bg-[#2D2D2D] hover:bg-[#2563EB] text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 font-['Outfit'] uppercase text-base tracking-widest">
              Explore Advanced Tracks
            </button>
          </div>
        </div>
      </div>

      {/* Historical Score Trends */}
      <div className="font-['Inter']">
        <h2 className="text-xl font-black text-slate-900 mb-6 font-['Outfit']">Integration History</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-['Inter']">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-['Outfit']">
                  <th className="px-6 py-4 text-left text-\[13px\] font-black text-slate-400 uppercase tracking-widest">
                    Assessment
                  </th>
                  <th className="px-6 py-4 text-left text-\[13px\] font-black text-slate-400 uppercase tracking-widest">
                    Integrity Score
                  </th>
                  <th className="px-6 py-4 text-left text-\[13px\] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-\[13px\] font-black text-slate-400 uppercase tracking-widest">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {submissions.map((submission, index) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-base font-black text-slate-900">
                      {submission.assignment?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base">
                      <span className={`font-black ${submission.grade >= 90 ? 'text-emerald-500' :
                        submission.grade >= 70 ? 'text-[#2563EB]' :
                          'text-blue-500'
                        }`}>
                        {submission.grade ? `${submission.grade}%` : 'Validation Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base">
                      <span className={`px-2 py-1 rounded text-\[13px\] font-black uppercase tracking-tight ${submission.status === 'graded'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-[#FBEFEF] text-[#2563EB] border border-[#2563EB]/20'
                        }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-slate-500">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium italic">No submission records identified.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReportPage;