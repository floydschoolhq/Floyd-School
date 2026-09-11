import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Eye, Building2, Layers, CheckCircle2, AlertCircle, X, Shield, Phone, Mail } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [createdMentorCredential, setCreatedMentorCredential] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    assignedSchools: [],
    assignedBatches: [],
    customPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchMentors();
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

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/mentors');
      setMentors(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedMentor(null);
    setCreatedMentorCredential(null);
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      assignedSchools: [],
      assignedBatches: [],
      customPassword: ''
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (mentor) => {
    setSelectedMentor(mentor);
    setCreatedMentorCredential(null);
    setFormData({
      name: mentor.name || '',
      email: mentor.email || '',
      mobileNumber: mentor.mobileNumber || '',
      assignedSchools: (mentor.assignedSchools || []).map(s => s._id || s),
      assignedBatches: (mentor.assignedBatches || []).map(b => b._id || b),
      isActive: mentor.isActive !== false
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveMentor = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (selectedMentor) {
        await api.put(`/offline-admin/mentors/${selectedMentor._id}`, formData);
        setModalOpen(false);
      } else {
        const res = await api.post('/offline-admin/mentors', formData);
        setCreatedMentorCredential(res.data.data);
      }
      fetchMentors();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save mentor');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSchoolSelection = (schoolId) => {
    const list = [...formData.assignedSchools];
    const index = list.indexOf(schoolId);
    if (index > -1) list.splice(index, 1);
    else list.push(schoolId);
    setFormData({ ...formData, assignedSchools: list });
  };

  const toggleBatchSelection = (batchId) => {
    const list = [...formData.assignedBatches];
    const index = list.indexOf(batchId);
    if (index > -1) list.splice(index, 1);
    else list.push(batchId);
    setFormData({ ...formData, assignedBatches: list });
  };

  const columns = [
    {
      header: 'Mentor ID',
      accessor: 'mentorId',
      className: 'font-mono text-xs font-semibold text-purple-400',
      render: (m) => (
        <span className="bg-purple-950/70 text-purple-400 px-2 py-0.5 rounded border border-purple-800/40">
          {m.mentorId || 'MEN-LEGACY'}
        </span>
      )
    },
    {
      header: 'Mentor Name',
      accessor: 'name',
      render: (m) => (
        <div>
          <p className="font-semibold text-slate-100">{m.name}</p>
          <p className="text-[11px] text-slate-400 font-mono">{m.email}</p>
        </div>
      )
    },
    {
      header: 'Assigned Schools',
      accessor: 'assignedSchools',
      render: (m) => (
        <div className="flex flex-wrap gap-1">
          {(m.assignedSchools || []).length === 0 ? (
            <span className="text-xs text-slate-500 italic">None assigned</span>
          ) : (
            m.assignedSchools.map((s, idx) => (
              <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                {s.code || s.name}
              </span>
            ))
          )}
        </div>
      )
    },
    {
      header: 'Active Batches',
      accessor: 'workload',
      className: 'text-center font-mono',
      render: (m) => (
        <span className="text-slate-200 font-semibold">{m.workload?.batchesCount || 0}</span>
      )
    },
    {
      header: 'Student Load',
      accessor: 'workload',
      className: 'text-center font-mono',
      render: (m) => (
        <span className="text-emerald-400 font-semibold">{m.workload?.activeStudentsCount || 0}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (m) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
          m.isActive !== false
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {m.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Mentor Operations Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Teaching faculty directory, permanent Mentor IDs, school liaisons, and classroom cohort assignments.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Mentor Staff</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mentors}
        searchKey="name"
        searchPlaceholder="Search mentors by name, email, or mentorId..."
        loading={loading}
        actions={(mentor) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleOpenEdit(mentor)}
              title="Edit Mentor & Assignments"
              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modal: Create / Edit Mentor */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-lg p-6 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {selectedMentor ? 'Edit Mentor Profile' : 'Onboard Mentor Staff'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Assign institutions and laboratory batches for offline classroom teaching.
            </p>

            {createdMentorCredential ? (
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs">
                  <p className="font-bold text-sm text-emerald-300">Mentor Account Provisioned!</p>
                  <p className="mt-1">Provide these temporary credentials to the mentor to log into <strong>MentorSchool</strong>:</p>
                </div>

                <div className="p-4 rounded-md bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Mentor Name:</span>
                    <span className="text-slate-200 font-sans font-semibold">{createdMentorCredential.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Permanent Mentor ID:</span>
                    <span className="text-purple-400 font-bold">{createdMentorCredential.mentorId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Login ID / Email:</span>
                    <span className="text-slate-200">{createdMentorCredential.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Temporary Password:</span>
                    <span className="text-amber-300 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                      {createdMentorCredential.temporaryPassword}
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
              <form onSubmit={handleSaveMentor} className="space-y-4">
                {formError && (
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mentor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhay Mentor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="mentor@floydschool.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!!selectedMentor}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
                </div>

                {!selectedMentor && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Initial Password (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave empty to auto-generate secure password"
                      value={formData.customPassword}
                      onChange={(e) => setFormData({ ...formData, customPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Assigned Schools Multiselect */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Partner Schools</label>
                  <div className="max-h-28 overflow-y-auto bg-slate-950 border border-slate-800 rounded p-2 space-y-1">
                    {schools.map(s => (
                      <label key={s._id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={formData.assignedSchools.includes(s._id)}
                          onChange={() => toggleSchoolSelection(s._id)}
                          className="rounded border-slate-700 text-blue-600 focus:ring-0"
                        />
                        <span>{s.name} ({s.code})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Assigned Batches Multiselect */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Cohorts / Batches</label>
                  <div className="max-h-28 overflow-y-auto bg-slate-950 border border-slate-800 rounded p-2 space-y-1">
                    {batches.map(b => (
                      <label key={b._id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={formData.assignedBatches.includes(b._id)}
                          onChange={() => toggleBatchSelection(b._id)}
                          className="rounded border-slate-700 text-blue-600 focus:ring-0"
                        />
                        <span>{b.name} ({b.code}) — {b.school?.code || 'School'}</span>
                      </label>
                    ))}
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
                    {submitting ? 'Saving...' : (selectedMentor ? 'Update Mentor' : 'Provision Mentor')}
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
