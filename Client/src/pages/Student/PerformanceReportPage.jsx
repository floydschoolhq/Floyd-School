import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, BarChart3 } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import { ProgressChart } from '../../components/dashboard/ProgressChart';
import api from '../../api/axios';

const PerformanceReportPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setSubmissions(response.data.submissions || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const skills = [
    { name: 'Algorithms', score: 95 },
    { name: 'Debugging', score: 85 },
    { name: 'JavaScript', score: 75 },
    { name: 'Database', score: 65 }
  ];

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
        <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Detailed Performance Reports
        </h1>
        <p className="text-slate-400">View in-depth analysis of scores, participation, and skill mastery</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GradientCard gradient="from-green-500 to-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Completed Assignments</p>
              <h3 className="text-3xl font-bold text-white">{stats.completedAssignments || 0}</h3>
            </div>
            <Award className="w-12 h-12 text-white/50" />
          </div>
        </GradientCard>

        <GradientCard gradient="from-sky-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Average Score</p>
              <h3 className="text-3xl font-bold text-white">
                {submissions.length > 0
                  ? Math.round(submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.length)
                  : 0}%
              </h3>
            </div>
            <TrendingUp className="w-12 h-12 text-white/50" />
          </div>
        </GradientCard>

        <GradientCard gradient="from-purple-500 to-pink-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Enrolled Courses</p>
              <h3 className="text-3xl font-bold text-white">{stats.enrolledCourses || 0}</h3>
            </div>
            <Target className="w-12 h-12 text-white/50" />
          </div>
        </GradientCard>
      </div>

      {/* Skill Breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-400" />
          Skill Breakdown
        </h2>
        <GradientCard gradient="from-indigo-500 via-purple-500 to-pink-500">
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-white font-medium w-32">{skill.name}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-sky-400 to-blue-600 h-3 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-sky-400 font-bold w-16 text-right">{skill.score}%</span>
              </motion.div>
            ))}
          </div>
        </GradientCard>
      </div>

      {/* Historical Score Trends */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Historical Score Trends</h2>
        <GradientCard gradient="from-cyan-500 via-teal-500 to-emerald-500">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {submissions.map((submission, index) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {submission.assignment?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-bold ${submission.grade >= 90 ? 'text-green-400' :
                          submission.grade >= 70 ? 'text-yellow-400' :
                            'text-red-400'
                        }`}>
                        {submission.grade ? `${submission.grade}%` : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${submission.status === 'graded'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                      No submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default PerformanceReportPage;