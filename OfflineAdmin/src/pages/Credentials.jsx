import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, Download, RefreshCw, CheckCircle2, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

export default function Credentials() {
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [targetType, setTargetType] = useState('students');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [sRes, bRes] = await Promise.all([
        api.get('/offline-admin/schools'),
        api.get('/offline-admin/batches')
      ]);
      setSchools(sRes.data.data || []);
      setBatches(bRes.data.data || []);
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  const handleExportCredentials = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const res = await api.get('/offline-admin/reports/export', {
        params: { type: 'students', school: selectedSchool, batch: selectedBatch },
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `floyd_credentials_roster_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMessage('Export downloaded successfully.');
    } catch (err) {
      console.error('Failed to export credentials report:', err);
      setMessage('Failed to generate export file.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Credential Management Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic identity issuance, initial password policies, institutional logins, and distribution reports.
          </p>
        </div>
      </div>

      {/* Security Architecture Card */}
      <div className="admin-card p-5 bg-slate-900/60 border-slate-800 flex items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Cryptographic Security Guarantee</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            All user passwords in the Floyd School ecosystem are salted and encrypted with <strong>bcrypt (10 rounds)</strong>. Plaintext passwords are never saved into MongoDB and cannot be retrieved retroactively. Temporary passwords can be exported strictly once during initial onboarding or provisioning.
          </p>
        </div>
      </div>

      {/* Report Exporter Control Panel */}
      <div className="admin-card p-6 bg-slate-900/40 border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Export Institutional Identity Roster</h3>
        <p className="text-xs text-slate-400">
          Select target filters to export an institutional credential and student identity report.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Portal Audience</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="students">School Students (SchoolStudent Portal)</option>
              <option value="mentors">Teaching Staff (MentorSchool Portal)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Filter by School</label>
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
            <label className="block text-xs font-medium text-slate-300 mb-1">Filter by Batch</label>
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

        {message && (
          <p className="text-xs text-emerald-400 font-mono pt-2">{message}</p>
        )}

        <div className="pt-4 flex items-center justify-end border-t border-slate-800">
          <button
            onClick={handleExportCredentials}
            disabled={generating}
            className="btn-primary py-2.5 px-5 text-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{generating ? 'Compiling Report...' : 'Download Identity Roster (CSV)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
