import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  School, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  CheckCircle2, 
  BookOpen,
  ArrowUpRight,
  Shield,
  FileCheck
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/partner-school/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Active Offline Batches', 
      value: stats?.totalBatches || 0, 
      subtext: 'Configured & Running', 
      icon: School, 
      badge: 'Active'
    },
    { 
      label: 'Enrolled Students', 
      value: stats?.totalStudents || 0, 
      subtext: `Quota: ${stats?.studentQuota || 500} Max`, 
      icon: Users, 
      badge: 'Verified'
    },
    { 
      label: 'Attendance Rate', 
      value: `${stats?.attendanceRate !== undefined ? stats.attendanceRate : 0}%`, 
      subtext: 'Verified by Mentors', 
      icon: CalendarCheck, 
      badge: 'Optimal'
    },
    { 
      label: 'Exams & Projects', 
      value: (stats?.totalQuizzes || 0) + (stats?.totalAssignments || 0), 
      subtext: 'Quizzes & Practical Work', 
      icon: FileSpreadsheet, 
      badge: 'Published'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Modern Minimalist Official Header Card */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                School Administration Portal
              </span>
              <span className="text-slate-500 text-xs font-mono">• Code: {stats?.schoolCode || 'SCH-OFFLINE'}</span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {stats?.schoolName || 'Partner School'} Operations
            </h1>

            <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
              Monitoring offline classes, enrolled student directories, attendance logs, and marks reports.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-2.5 shrink-0">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Allocated Student Quota</p>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold text-slate-900 font-mono">{stats?.totalStudents || 0}</span>
              <span className="text-slate-500 text-xs">/ {stats?.studentQuota || 500} Total Enrolled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="card-modern rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{card.value}</h3>
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Icon size={15} />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Status & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Modules & Status */}
        <div className="lg:col-span-2 card-modern rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="text-slate-700" size={16} />
                Curriculum Integration & Verification Status
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Active modules running in partnership with FloydSchool STEM Labs.</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              Active Status
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 font-bold">
                <BookOpen size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Microcontroller & Practical Robotics Module</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Breadboard circuits, MicroPython programming, ultrasonic sensors, and actuator control conducted weekly by offline mentors.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 font-bold">
                <CheckCircle2 size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Automated Daily Attendance Verification</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Attendance logged by offline mentors during lab sessions immediately syncs to your partner school portal with full export capabilities.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 font-bold">
                <FileCheck size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Practical Evaluation & Projects</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Students submit real project files and code solutions reviewed and graded directly by offline mentors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Modern Shortcuts */}
        <div className="card-modern rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Administrative Actions</h2>

          <div className="space-y-2">
            <a 
              href="/batches" 
              className="flex items-center justify-between py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all group"
            >
              <span>➕ Configure New Offline Batch</span>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </a>

            <a 
              href="/students" 
              className="flex items-center justify-between py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all group"
            >
              <span>📋 View Student Directory</span>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </a>

            <a 
              href="/attendance" 
              className="flex items-center justify-between py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all group"
            >
              <span>📊 Export Attendance CSV Spreadsheet</span>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </a>

            <a 
              href="/support" 
              className="flex items-center justify-between py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all group"
            >
              <span>💬 Contact Helpdesk Support</span>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
