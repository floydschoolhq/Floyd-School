import React, { useState, useEffect } from 'react';
import { Bell, Send, CheckCircle2, AlertCircle, Users, Building2, Layers, Briefcase } from 'lucide-react';
import api from '../api/axios';

export default function Notifications() {
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [targetType, setTargetType] = useState('all');
  const [targetId, setTargetId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [error, setError] = useState('');

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
      console.error('Failed to load notification targets:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');
    setSending(true);

    try {
      const res = await api.post('/offline-admin/announcements', {
        title,
        message,
        targetType,
        targetId: targetId || null
      });
      setSuccessNotice(res.data.message || 'Announcement broadcasted successfully');
      setTitle('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to broadcast announcement');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">System Broadcast Announcements</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispatch real-time in-app alerts, calendar updates, and operational notices to offline portal users.
          </p>
        </div>
      </div>

      <div className="admin-card p-6 bg-slate-900/60 border-slate-800 max-w-2xl">
        {successNotice && (
          <div className="mb-4 p-3.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience *</label>
              <select
                value={targetType}
                onChange={(e) => { setTargetType(e.target.value); setTargetId(''); }}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Entire Offline Community (Students, Mentors, Coordinators)</option>
                <option value="students">All Offline Students</option>
                <option value="mentors">All Offline Mentors</option>
                <option value="school">Specific Partner School</option>
                <option value="batch">Specific Laboratory Batch</option>
              </select>
            </div>

            {targetType === 'school' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select School *</label>
                <select
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose School...</option>
                  {schools.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'batch' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Batch *</label>
                <select
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose Batch...</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Announcement Subject / Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule Change: Robotics Lab Session Rescheduled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Message Content *</label>
            <textarea
              required
              rows={4}
              placeholder="Provide all session timings, equipment instructions, or exam notices..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="btn-primary py-2.5 px-5 text-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Broadcasting...' : 'Broadcast Announcement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
