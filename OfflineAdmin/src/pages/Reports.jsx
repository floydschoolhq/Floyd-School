import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function Reports() {
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    api.get('/offline-admin/schools').then(r => setSchools(r.data.data || [])).catch(() => {});
    api.get('/offline-admin/batches').then(r => setBatches(r.data.data || [])).catch(() => {});
  }, []);

  const handleDownloadReport = async (type) => {
    setDownloading(true);
    setStatusMsg('');
    try {
      const res = await api.get('/offline-admin/reports/export', {
        params: { type, school: selectedSchool, batch: selectedBatch },
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `floyd_${type}_export_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setStatusMsg(`Downloaded ${type} report successfully.`);
    } catch (err) {
      console.error('Failed to export report:', err);
      setStatusMsg('Error exporting report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Institutional Data Exports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal CSV and spreadsheet exports for administrative compliance, attendance audits, and parent reporting.
          </p>
        </div>
      </div>

      {/* Filter Parameters */}
      <div className="admin-card p-5 bg-slate-900/60 border-slate-800 space-y-3">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
          Export Filter Scope
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Partner School</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Partner Schools</option>
              {schools.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Laboratory Cohort / Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Batches</option>
              {batches
                .filter(b => !selectedSchool || b.school?._id === selectedSchool || b.school === selectedSchool)
                .map(b => (
                  <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                ))}
            </select>
          </div>
        </div>
        {statusMsg && <p className="text-xs text-emerald-400 font-mono mt-2">{statusMsg}</p>}
      </div>

      {/* Available Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="admin-card p-5 bg-slate-900/40 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Student Enrollment & Credential Roster</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Full student export containing permanent Floyd Student IDs, roll numbers, guardian contact numbers, school, and cohort assignments.
            </p>
          </div>
          <button
            onClick={() => handleDownloadReport('students')}
            disabled={downloading}
            className="btn-primary mt-5 justify-center text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Student Roster (CSV)</span>
          </button>
        </div>

        <div className="admin-card p-5 bg-slate-900/40 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Comprehensive Attendance Ledger</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Session-by-session laboratory log including date, topics covered, mentor faculty liaison, present student headcount, and absentee numbers.
            </p>
          </div>
          <button
            onClick={() => handleDownloadReport('attendance')}
            disabled={downloading}
            className="btn-primary mt-5 justify-center text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Attendance Ledger (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
