import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit, Building2, Mail, Phone, CheckCircle2, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [createdCredential, setCreatedCredential] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    schoolId: '',
    customPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchCoordinators();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/offline-admin/schools');
      setSchools(res.data.data || []);
    } catch (err) {
      console.error('Failed to load schools:', err);
    }
  };

  const fetchCoordinators = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/coordinators');
      setCoordinators(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch coordinators:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCreatedCredential(null);
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      schoolId: schools[0]?._id || '',
      customPassword: ''
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveCoordinator = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await api.post('/offline-admin/coordinators', formData);
      setCreatedCredential(res.data.data);
      fetchCoordinators();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create coordinator');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Coordinator Name',
      accessor: 'name',
      render: (c) => (
        <div>
          <p className="font-semibold text-slate-100">{c.name}</p>
          <p className="text-[11px] text-slate-400 font-mono">{c.email}</p>
        </div>
      )
    },
    {
      header: 'Assigned Partner School',
      accessor: 'school',
      render: (c) => (
        <span className="text-xs text-blue-400 font-medium">
          {c.school ? `${c.school.name} (${c.school.code})` : 'Unassigned'}
        </span>
      )
    },
    {
      header: 'Role Scope',
      accessor: 'role',
      className: 'font-mono text-xs text-slate-400',
      render: () => (
        <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40 text-[10px]">
          SCHOOL-SCOPED
        </span>
      )
    },
    {
      header: 'Contact Phone',
      accessor: 'mobileNumber',
      className: 'text-xs text-slate-300 font-mono',
      render: (c) => c.mobileNumber || '—'
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (c) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
          c.isActive !== false
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {c.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Partner School Coordinators</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Liaison officers and school administrative coordinators managing local offline rosters.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Coordinator</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={coordinators}
        searchKey="name"
        searchPlaceholder="Search coordinators by name or email..."
        loading={loading}
      />

      {/* Modal: Create Coordinator */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-md p-6 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Provision School Coordinator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Credentials provide school-scoped access to <strong>PartnerSchool</strong> portal.
            </p>

            {createdCredential ? (
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs">
                  <p className="font-bold text-sm text-emerald-300">Coordinator Created!</p>
                  <p className="mt-1">Login credentials for the PartnerSchool portal:</p>
                </div>

                <div className="p-4 rounded-md bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Name:</span>
                    <span className="text-slate-200 font-sans font-semibold">{createdCredential.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">School:</span>
                    <span className="text-blue-400">{createdCredential.school}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Login Email:</span>
                    <span className="text-slate-200">{createdCredential.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Temporary Password:</span>
                    <span className="text-amber-300 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                      {createdCredential.temporaryPassword}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="btn-primary text-xs"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveCoordinator} className="space-y-4">
                {formError && (
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Partner School *</label>
                  <select
                    required
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select School...</option>
                    {schools.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Coordinator Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meenakshi Sundaram"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="coordinator@dps.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Custom Initial Password (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty to auto-generate"
                    value={formData.customPassword}
                    onChange={(e) => setFormData({ ...formData, customPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
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
                    {submitting ? 'Creating...' : 'Provision Coordinator'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
