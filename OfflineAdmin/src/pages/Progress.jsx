import React, { useState, useEffect } from 'react';
import { TrendingUp, Building2, Layers, Users, BookOpen, ChevronRight, Award, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schools'); // 'schools' | 'batches'

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/progress');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch progress analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const schoolProgress = data?.schoolProgress || [];
  const batchProgress = data?.batchProgress || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Institutional Progress Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Combined academic attainment indices across partner institutions, classroom cohorts, and laboratory exercises.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-md text-xs font-medium">
          <button
            onClick={() => setActiveTab('schools')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'schools' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Combined School View
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'batches' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Batch-Wise Performance
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
          Computing academic telemetry pipelines...
        </div>
      ) : activeTab === 'schools' ? (
        /* School-wise combined view */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolProgress.map(sc => (
            <div key={sc.schoolId} className="admin-card p-5 bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold text-xs">
                    {sc.schoolCode}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{sc.schoolName}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {sc.totalBatches} Cohorts • {sc.totalStudents} Active Students
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Attainment Index</span>
                  <p className="text-xl font-bold text-blue-400">{sc.overallProgress}%</p>
                </div>
              </div>

              {/* Metric Progress Bars */}
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Attendance Rate</span>
                    <span className="font-semibold text-emerald-400">{sc.attendanceRate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${sc.attendanceRate}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Homework Submissions</span>
                    <span className="font-semibold text-blue-400">{sc.assignmentCompletion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${sc.assignmentCompletion}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Quiz Average Score</span>
                    <span className="font-semibold text-amber-400">{sc.quizAverage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${sc.quizAverage}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Batch-wise detailed cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchProgress.map(bp => (
            <div key={bp.batchId} className="admin-card p-5 bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800/40">
                    {bp.batchCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-1.5">{bp.batchName}</h3>
                  <p className="text-[11px] text-slate-400">{bp.schoolName}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-400">{bp.courseProgress}%</span>
                  <p className="text-[10px] text-slate-500 font-mono">Progress</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <p className="text-[10px] text-slate-500 uppercase">Attendance</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{bp.attendanceRate}%</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <p className="text-[10px] text-slate-500 uppercase">Quiz Avg</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{bp.quizAverage}%</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <p className="text-[10px] text-slate-500 uppercase">Homework</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{bp.assignmentCompletion}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
