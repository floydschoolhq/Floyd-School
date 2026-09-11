import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  Layers,
  CalendarCheck,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  KeyRound,
  FileText,
  HelpCircle,
  Activity,
  Plus
} from 'lucide-react';
import StatCard from '../components/StatCard';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/dashboard');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const counts = data?.counts || {};
  const academic = data?.academic || {};
  const alerts = data?.alerts || {};
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Global Command Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational governance and performance telemetry across all Floyd School partner institutions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/import')}
            className="btn-primary"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk Excel Import</span>
          </button>
          <button
            onClick={() => navigate('/schools')}
            className="btn-secondary"
          >
            <Plus className="w-4 h-4" />
            <span>Add School</span>
          </button>
        </div>
      </div>

      {/* Global Institution KPIs */}
      <div>
        <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-400 mb-3 uppercase">
          Ecosystem Vital Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Partner Schools"
            value={counts.totalSchools}
            subtitle={`${counts.activeSchools || 0} active institutions`}
            icon={Building2}
            color="blue"
            onClick={() => navigate('/schools')}
          />
          <StatCard
            title="Enrolled Students"
            value={counts.totalStudents}
            subtitle={`${counts.activeStudents || 0} active students`}
            icon={Users}
            color="emerald"
            onClick={() => navigate('/students')}
          />
          <StatCard
            title="Assigned Mentors"
            value={counts.totalMentors}
            subtitle={`${counts.activeMentors || 0} mentors active`}
            icon={Briefcase}
            color="purple"
            onClick={() => navigate('/mentors')}
          />
          <StatCard
            title="Offline Batches"
            value={counts.totalBatches}
            subtitle={`${counts.activeBatches || 0} running cohorts`}
            icon={Layers}
            color="amber"
            onClick={() => navigate('/batches')}
          />
        </div>
      </div>

      {/* Academic Performance Telemetry & Operational Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Analytics Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Academic Telemetry
            </h2>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="admin-card p-4">
              <p className="text-[11px] font-medium text-slate-400 uppercase">Avg Attendance</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{academic.averageAttendance || 0}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Across all sessions</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-[11px] font-medium text-slate-400 uppercase">Homework Done</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{academic.assignmentCompletionRate || 0}%</p>
              <p className="text-[10px] text-slate-500 mt-1">{academic.totalAssignments || 0} active tasks</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-[11px] font-medium text-slate-400 uppercase">Quiz Turnout</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{academic.quizParticipationRate || 0}%</p>
              <p className="text-[10px] text-slate-500 mt-1">{academic.totalQuizzes || 0} published quizzes</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-[11px] font-medium text-slate-400 uppercase">Quiz Avg Score</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{academic.averageQuizScore || 0}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Cohort benchmark</p>
            </div>
          </div>

          {/* Today's Classroom Activity */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-slate-200">Today's Classroom Activity</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 rounded-md bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400">Classes Logged Today</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{counts.todayClasses || 0}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Recorded by mentors</p>
              </div>
              <div className="p-3.5 rounded-md bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400">Students Attended Today</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">{counts.todayAttendanceCount || 0}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Present / verified in labs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Alerts & Incident Warnings */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
            Operational Attention
          </h2>

          <div className="admin-card p-5 space-y-3.5">
            {/* Alert: Pending Approvals */}
            <div
              onClick={() => navigate('/students?status=pending')}
              className="p-3 rounded-md bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div>
                  <p className="text-xs font-medium text-slate-200">Pending Registrations</p>
                  <p className="text-[11px] text-slate-400">{alerts.pendingApprovalStudents || 0} students await verification</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Alert: Unassigned Students */}
            <div
              onClick={() => navigate('/students')}
              className="p-3 rounded-md bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <p className="text-xs font-medium text-slate-200">Unassigned Students</p>
                  <p className="text-[11px] text-slate-400">{alerts.unassignedStudents || 0} students without a batch</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Alert: Low Attendance */}
            <div
              onClick={() => navigate('/attendance')}
              className="p-3 rounded-md bg-slate-900/80 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <div>
                  <p className="text-xs font-medium text-slate-200">Attendance Risk</p>
                  <p className="text-[11px] text-slate-400">Below {alerts.lowAttendanceThreshold || 75}% threshold</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Platform Status Card */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ecosystem Status:</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                alerts.maintenanceStatus === 'OPERATIONAL'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {alerts.maintenanceStatus || 'OPERATIONAL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operations Matrix */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
            Administrative Shortcuts
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => navigate('/import')}
              className="admin-card p-3.5 text-left hover:border-blue-500/40 transition-colors cursor-pointer group"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-slate-200">Excel Import</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Bulk provision students</p>
            </button>
            <button
              onClick={() => navigate('/credentials')}
              className="admin-card p-3.5 text-left hover:border-blue-500/40 transition-colors cursor-pointer group"
            >
              <KeyRound className="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-slate-200">Credentials</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Generate & export</p>
            </button>
            <button
              onClick={() => navigate('/batches')}
              className="admin-card p-3.5 text-left hover:border-blue-500/40 transition-colors cursor-pointer group"
            >
              <Layers className="w-4 h-4 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-slate-200">New Batch</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Configure schedule</p>
            </button>
            <button
              onClick={() => navigate('/maintenance')}
              className="admin-card p-3.5 text-left hover:border-blue-500/40 transition-colors cursor-pointer group"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-slate-200">Maintenance</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Switch portal mode</p>
            </button>
          </div>
        </div>

        {/* Recent Audit Trail Activity */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Recent Administrative Audit Trail
            </h2>
            <button
              onClick={() => navigate('/audit-logs')}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="admin-card overflow-hidden">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No recent administrative events logged.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {recentActivities.slice(0, 5).map((log, idx) => (
                  <div key={log._id || idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <div>
                        <span className="font-semibold text-slate-200 font-mono text-[11px]">{log.action}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-300">{log.targetName || log.targetType}</span>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          By <span className="text-slate-400">{log.actorName}</span> ({log.actorRole})
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
