import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Clock, CheckCircle2, Award, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batchId: '',
    dueDate: '',
    maxMarks: 100
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchAssignments();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/offline-admin/batches');
      setBatches(res.data.data || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/assignments');
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      batchId: batches[0]?._id || '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxMarks: 100
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await api.post('/offline-admin/assignments', formData);
      setModalOpen(false);
      fetchAssignments();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Task / Homework Title',
      accessor: 'title',
      render: (a) => (
        <div>
          <p className="font-semibold text-slate-100">{a.title}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{a.description}</p>
        </div>
      )
    },
    {
      header: 'Assigned Batch & School',
      accessor: 'batch',
      render: (a) => (
        <div className="text-xs">
          <p className="text-slate-200 font-medium">{a.batch?.name || 'Batch'}</p>
          <p className="text-[11px] text-blue-400 font-mono">{a.school?.name || a.batch?.code || 'School'}</p>
        </div>
      )
    },
    {
      header: 'Deadline',
      accessor: 'dueDate',
      className: 'font-mono text-xs text-slate-300',
      render: (a) => a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'
    },
    {
      header: 'Max Marks',
      accessor: 'maxMarks',
      className: 'text-center font-mono text-xs text-slate-200',
      render: (a) => `${a.maxMarks || 100} pts`
    },
    {
      header: 'Submissions',
      accessor: 'submissionCount',
      className: 'text-center font-mono text-xs',
      render: (a) => (
        <span className="font-semibold text-emerald-400">{a.submissionCount || 0}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (a) => (
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
          {a.status || 'published'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Laboratory Homework & Tasks</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Offline STEM laboratory challenges, MicroPython assignments, and student project submissions.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Laboratory Challenge</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={assignments}
        searchKey="title"
        searchPlaceholder="Search assignments by title..."
        loading={loading}
      />

      {/* Modal: Create Assignment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-lg p-6 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Publish Laboratory Challenge
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Available instantly to students in the assigned cohort on the <strong>SchoolStudent</strong> portal.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Offline Batch *</label>
                <select
                  required
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Batch...</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Challenge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 04: Ultrasonic Sensor Calibration"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description & Requirements *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide wiring instructions, code parameters, and deliverable format..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs"
                >
                  {submitting ? 'Publishing...' : 'Publish Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
