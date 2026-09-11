import React, { useState, useEffect } from 'react';
import { CalendarCheck, Filter, Download, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import api from '../api/axios';

export default function Attendance() {
  const [analytics, setAnalytics] = useState(null);
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedSchool, selectedBatch, startDate, endDate]);

  const fetchMetadata = async () => {
    try {
      const [sRes, bRes] = await Promise.all([
        api.get('/offline-admin/schools'),
        api.get('/offline-admin/batches')
      ]);
      setSchools(sRes.data.data || []);
      setBatches(bRes.data.data || []);
    } catch (err) {
      console.error('Failed to load filter metadata:', err);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSchool) params.school = selectedSchool;
      if (selectedBatch) params.batch = selectedBatch;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/offline-admin/attendance', { params });
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch attendance analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/offline-admin/reports/export', {
        params: { type: 'attendance', school: selectedSchool, batch: selectedBatch },
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `floyd_attendance_ledger_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export attendance CSV:', err);
    }
  };

  const metrics = analytics?.metrics || {};
  const sessions = analytics?.sessions || [];

  const columns = [
    {
      header: 'Session Date',
      accessor: 'date',
      className: 'font-mono text-xs text-slate-300',
      render: (s) => (
        <span>{new Date(s.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      )
    },
    {
      header: 'Institution & Cohort',
      accessor: 'school',
      render: (s) => (
        <div>
          <p className="font-semibold text-slate-100">{s.school}</p>
          <p className="text-[11px] text-blue-400 font-mono">{s.batch}</p>
        </div>
      )
    },
    {
      header: 'Hands-on Topic Covered',
      accessor: 'topicCovered',
      render: (s) => (
        <span className="text-xs text-slate-300 font-medium">{s.topicCovered || 'Practical STEM Lab'}</span>
      )
    },
    {
      header: 'Marked By Faculty',
      accessor: 'markedBy',
      render: (s) => (
        <span className="text-xs text-purple-400">{s.markedBy}</span>
      )
    },
    {
      header: 'Present / Total',
      accessor: 'presentCount',
      render: (s) => (
        <div className="text-xs font-mono">
          <span className="text-emerald-400 font-semibold">{s.presentCount}</span>
          <span className="text-slate-500"> / {s.totalStudents}</span>
        </div>
      )
    },
    {
      header: 'Turnout Rate',
      accessor: 'rate',
      render: (s) => (
        <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${
          s.rate >= 75 ? 'text-emerald-400' : 'text-amber-400'
        }`}>
          {s.rate}%
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Global Attendance Intelligence</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-institution attendance tracking, laboratory session records, and absenteeism analytics.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-secondary"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Attendance Ledger (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${metrics.overallRate || 0}%`}
          subtitle="Cohort average across all schools"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Sessions Logged"
          value={metrics.totalSessions || 0}
          subtitle="Faculty verified lab periods"
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Present Attendances"
          value={metrics.presentHeadcount || 0}
          subtitle="Cumulative students in class"
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Absent Attendances"
          value={metrics.absentHeadcount || 0}
          subtitle="Recorded absent marks"
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Filter Bar */}
      <div className="admin-card p-4 flex flex-wrap items-center gap-3 bg-slate-900/60 border-slate-800">
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Partner Schools</option>
          {schools.map(s => (
            <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
          ))}
        </select>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Batches</option>
          {batches.map(b => (
            <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
          ))}
        </select>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {(selectedSchool || selectedBatch || startDate || endDate) && (
          <button
            onClick={() => { setSelectedSchool(''); setSelectedBatch(''); setStartDate(''); setEndDate(''); }}
            className="text-xs text-blue-400 hover:text-blue-300 ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Session Ledger Table */}
      <DataTable
        columns={columns}
        data={sessions}
        searchKey="topicCovered"
        searchPlaceholder="Search sessions by topic covered or school..."
        loading={loading}
      />
    </div>
  );
}
