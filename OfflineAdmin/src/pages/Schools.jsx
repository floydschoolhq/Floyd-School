import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Archive, CheckCircle, XCircle, Eye, Users, Layers, MapPin, Mail, Phone, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [confirmArchiveOpen, setConfirmArchiveOpen] = useState(false);
  const [targetSchoolId, setTargetSchoolId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    studentQuota: 500,
    academicYear: '2025-2026'
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/schools');
      setSchools(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedSchool(null);
    setFormData({
      name: '',
      code: '',
      city: '',
      address: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      studentQuota: 500,
      academicYear: '2025-2026'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name || '',
      code: school.code || '',
      city: school.city || '',
      address: school.address || '',
      contactPerson: school.contactPerson || '',
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || '',
      studentQuota: school.studentQuota || 500,
      academicYear: school.academicYear || '2025-2026'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleViewDetails = async (school) => {
    try {
      const res = await api.get(`/offline-admin/schools/${school._id}`);
      setSchoolDetails(res.data.data);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Failed to load school details:', err);
    }
  };

  const handleSaveSchool = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (selectedSchool) {
        await api.put(`/offline-admin/schools/${selectedSchool._id}`, formData);
      } else {
        await api.post('/offline-admin/schools', formData);
      }
      setModalOpen(false);
      fetchSchools();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save school');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!targetSchoolId) return;
    try {
      await api.delete(`/offline-admin/schools/${targetSchoolId}/archive`);
      setConfirmArchiveOpen(false);
      fetchSchools();
    } catch (err) {
      console.error('Failed to archive school:', err);
    }
  };

  const columns = [
    {
      header: 'School Code',
      accessor: 'code',
      className: 'font-mono text-xs font-semibold text-blue-400',
      render: (s) => (
        <span className="bg-blue-950/60 text-blue-400 px-2 py-0.5 rounded border border-blue-800/40">
          {s.code}
        </span>
      )
    },
    {
      header: 'School Name',
      accessor: 'name',
      render: (s) => (
        <div>
          <p className="font-medium text-slate-100">{s.name}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{s.city || 'Location unspecified'}</span>
          </p>
        </div>
      )
    },
    {
      header: 'Batches',
      accessor: 'batchCount',
      className: 'text-center font-mono',
      render: (s) => (
        <span className="text-slate-300 font-semibold">{s.batchCount || 0}</span>
      )
    },
    {
      header: 'Students / Quota',
      accessor: 'studentCount',
      render: (s) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-200">{s.studentCount || 0}</span>
          <span className="text-slate-500"> / {s.studentQuota || 500}</span>
        </div>
      )
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      render: (s) => (
        <div className="text-xs">
          <p className="text-slate-300">{s.contactPerson || '—'}</p>
          {s.contactEmail && <p className="text-[10px] text-slate-500 font-mono">{s.contactEmail}</p>}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (s) => (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
          s.isActive !== false
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {s.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Partner Schools Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Directory of all affiliated institutions, operational codes, student quotas, and academic cohorts.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Partner School</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={schools}
        searchKey="name"
        searchPlaceholder="Search schools by name, code, or city..."
        loading={loading}
        onRowClick={handleViewDetails}
        actions={(school) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleViewDetails(school)}
              title="View Institutional Dossier"
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenEdit(school)}
              title="Edit Details"
              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setTargetSchoolId(school._id);
                setConfirmArchiveOpen(true);
              }}
              title="Archive / Deactivate"
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modal: Create / Edit School */}
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
              {selectedSchool ? 'Edit Partner School' : 'Onboard Partner School'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Specify institution identifiers, contact liaison, and student capacity quota.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveSchool} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">School Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="DPS001"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">School Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Delhi Public School, Sector 4"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Quota</label>
                  <input
                    type="number"
                    value={formData.studentQuota}
                    onChange={(e) => setFormData({ ...formData, studentQuota: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  placeholder="Plot 12, Knowledge Park III"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Liaison Name</label>
                  <input
                    type="text"
                    placeholder="Mr. Sharma"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Liaison Email</label>
                  <input
                    type="email"
                    placeholder="liaison@dps.edu"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                  {submitting ? 'Saving...' : (selectedSchool ? 'Update School' : 'Create School')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: School Detailed Dossier */}
      {detailModalOpen && schoolDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-3xl p-6 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <span className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold text-sm">
                {schoolDetails.code}
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">{schoolDetails.name}</h3>
                <p className="text-xs text-slate-400">{schoolDetails.city || 'City'} • {schoolDetails.academicYear || '2025-2026'}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Batches</p>
                <p className="text-lg font-bold text-slate-200">{schoolDetails.stats?.totalBatches || 0}</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Students</p>
                <p className="text-lg font-bold text-emerald-400">{schoolDetails.stats?.totalStudents || 0}</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Mentors</p>
                <p className="text-lg font-bold text-purple-400">{schoolDetails.stats?.totalMentors || 0}</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Attendance</p>
                <p className="text-lg font-bold text-blue-400">{schoolDetails.stats?.attendanceRate || 0}%</p>
              </div>
            </div>

            {/* Batches Roster */}
            <div className="space-y-3 mt-6">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Active Batches in this School
              </h4>
              <div className="space-y-2">
                {(schoolDetails.batches || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No cohorts provisioned yet.</p>
                ) : (
                  schoolDetails.batches.map(b => (
                    <div key={b._id} className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{b.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-blue-400">({b.code})</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{b.subject} • {b.roomVenue} • {b.scheduleTime}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        Instructor: {b.instructor?.name || 'Unassigned'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmArchiveOpen}
        title="Deactivate Partner School"
        message="Are you sure you want to deactivate this partner school? Offline student portal access will be paused for its cohorts."
        confirmText="Deactivate"
        isDanger={true}
        onConfirm={handleArchive}
        onCancel={() => setConfirmArchiveOpen(false)}
      />
    </div>
  );
}
