import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Users, Calendar, Clock, MapPin, Eye, CheckCircle, XCircle, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDetails, setBatchDetails] = useState(null);

  // Assign students state
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    schoolId: '',
    instructorId: '',
    subject: 'Robotics & STEM Lab',
    scheduleDays: ['Monday', 'Wednesday'],
    scheduleTime: '10:00 AM - 11:30 AM',
    roomVenue: 'Lab 101',
    capacity: 50,
    academicYear: '2025-2026'
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchBatches();
  }, [selectedSchool, selectedMentor]);

  const fetchMetadata = async () => {
    try {
      const [sRes, mRes] = await Promise.all([
        api.get('/offline-admin/schools'),
        api.get('/offline-admin/mentors')
      ]);
      setSchools(sRes.data.data || []);
      setMentors(mRes.data.data || []);
    } catch (err) {
      console.error('Failed to load batch metadata:', err);
    }
  };

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSchool) params.school = selectedSchool;
      if (selectedMentor) params.mentor = selectedMentor;

      const res = await api.get('/offline-admin/batches', { params });
      setBatches(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch batches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedBatch(null);
    setFormData({
      name: '',
      code: '',
      schoolId: schools[0]?._id || '',
      instructorId: mentors[0]?._id || '',
      subject: 'Robotics & STEM Lab',
      scheduleDays: ['Monday', 'Wednesday'],
      scheduleTime: '10:00 AM - 11:30 AM',
      roomVenue: 'Lab 101',
      capacity: 50,
      academicYear: '2025-2026'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      name: batch.name || '',
      code: batch.code || '',
      schoolId: batch.school?._id || batch.school || '',
      instructorId: batch.instructor?._id || batch.instructor || '',
      subject: batch.subject || 'Robotics & STEM Lab',
      scheduleDays: batch.scheduleDays || ['Monday', 'Wednesday'],
      scheduleTime: batch.scheduleTime || '10:00 AM - 11:30 AM',
      roomVenue: batch.roomVenue || 'Lab 101',
      capacity: batch.capacity || 50,
      academicYear: batch.academicYear || '2025-2026'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleViewDetails = async (batch) => {
    try {
      const res = await api.get(`/offline-admin/batches/${batch._id}`);
      setBatchDetails(res.data.data);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Failed to load batch details:', err);
    }
  };

  const handleOpenAssign = async (batch) => {
    setSelectedBatch(batch);
    setSelectedStudentIds([]);
    setFormError('');
    try {
      const schoolId = batch.school?._id || batch.school;
      const res = await api.get('/offline-admin/students', {
        params: { school: schoolId, limit: 100 }
      });
      setSchoolStudents(res.data.data || []);
      setAssignModalOpen(true);
    } catch (err) {
      console.error('Failed to load students for batch:', err);
    }
  };

  const handleSaveBatch = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (selectedBatch) {
        await api.put(`/offline-admin/batches/${selectedBatch._id}`, formData);
      } else {
        await api.post('/offline-admin/batches', formData);
      }
      setModalOpen(false);
      fetchBatches();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      setFormError('Please select at least one student to assign.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    try {
      await api.post(`/offline-admin/batches/${selectedBatch._id}/assign-students`, {
        studentIds: selectedStudentIds
      });
      setAssignModalOpen(false);
      fetchBatches();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to assign students');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Batch Code',
      accessor: 'code',
      className: 'font-mono text-xs font-semibold text-blue-400',
      render: (b) => (
        <span className="bg-blue-950/70 text-blue-400 px-2 py-0.5 rounded border border-blue-800/40">
          {b.code || 'B01'}
        </span>
      )
    },
    {
      header: 'Batch Name & Subject',
      accessor: 'name',
      render: (b) => (
        <div>
          <p className="font-semibold text-slate-100">{b.name}</p>
          <p className="text-[11px] text-slate-400">{b.subject || 'Robotics & STEM Lab'}</p>
        </div>
      )
    },
    {
      header: 'Partner School',
      accessor: 'school',
      render: (b) => (
        <span className="text-xs text-slate-300 font-medium">
          {b.school?.name || 'School Unassigned'}
        </span>
      )
    },
    {
      header: 'Instructor / Mentor',
      accessor: 'instructor',
      render: (b) => (
        <span className="text-xs text-purple-400 font-medium">
          {b.instructor?.name || <span className="text-slate-500 italic">Unassigned</span>}
        </span>
      )
    },
    {
      header: 'Roster / Capacity',
      accessor: 'studentCount',
      render: (b) => (
        <div className="text-xs font-mono">
          <span className="text-emerald-400 font-semibold">{b.studentCount || 0}</span>
          <span className="text-slate-500"> / {b.capacity || 50}</span>
        </div>
      )
    },
    {
      header: 'Schedule & Lab',
      accessor: 'scheduleTime',
      render: (b) => (
        <div className="text-[11px] text-slate-300">
          <p>{(b.scheduleDays || []).join(', ')}</p>
          <p className="text-slate-500 font-mono">{b.scheduleTime} • {b.roomVenue}</p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Offline Cohorts & Batches</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Classroom scheduling, student rosters, venue allocation, and mentor assignments.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Offline Batch</span>
        </button>
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
          value={selectedMentor}
          onChange={(e) => setSelectedMentor(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Mentors</option>
          {mentors.map(m => (
            <option key={m._id} value={m._id}>{m.name} ({m.mentorId})</option>
          ))}
        </select>

        {(selectedSchool || selectedMentor) && (
          <button
            onClick={() => { setSelectedSchool(''); setSelectedMentor(''); }}
            className="text-xs text-blue-400 hover:text-blue-300 ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={batches}
        searchKey="name"
        searchPlaceholder="Search batches by name, code, or subject..."
        loading={loading}
        onRowClick={handleViewDetails}
        actions={(batch) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleViewDetails(batch)}
              title="View Roster"
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenAssign(batch)}
              title="Bulk Assign Students"
              className="p-1.5 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenEdit(batch)}
              title="Edit Batch"
              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modal: Create / Edit Batch */}
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
              {selectedBatch ? 'Edit Offline Batch' : 'Create Offline Batch'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Set laboratory timetable, capacity, and assign instructor faculty.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Batch Code</label>
                  <input
                    type="text"
                    placeholder="DPS-ROB-B01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robotics Senior Batch 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Instructor / Mentor</label>
                  <select
                    value={formData.instructorId}
                    onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {mentors.map(m => (
                      <option key={m._id} value={m._id}>{m.name} ({m.mentorId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Track</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Lab Venue</label>
                  <input
                    type="text"
                    placeholder="STEM Lab 102"
                    value={formData.roomVenue}
                    onChange={(e) => setFormData({ ...formData, roomVenue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="10:00 - 11:30 AM"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
                  {submitting ? 'Saving...' : (selectedBatch ? 'Update Batch' : 'Create Batch')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Assign Students */}
      {assignModalOpen && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-lg p-6 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAssignModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Assign Students to Batch
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Adding to <strong>{selectedBatch.name}</strong> ({selectedBatch.school?.name})
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded p-2 space-y-1">
                {schoolStudents.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2">No students found in this school.</p>
                ) : (
                  schoolStudents.map(st => (
                    <label key={st._id} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-900 cursor-pointer text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(st._id)}
                          onChange={() => {
                            const list = [...selectedStudentIds];
                            const idx = list.indexOf(st._id);
                            if (idx > -1) list.splice(idx, 1);
                            else list.push(st._id);
                            setSelectedStudentIds(list);
                          }}
                          className="rounded border-slate-700 text-blue-600 focus:ring-0"
                        />
                        <span className="text-slate-200 font-medium">{st.name}</span>
                        <span className="font-mono text-[10px] text-blue-400">({st.studentId})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {st.batch?.name || 'Unassigned'}
                      </span>
                    </label>
                  ))
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Selected: <strong className="text-emerald-400">{selectedStudentIds.length}</strong> students
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || selectedStudentIds.length === 0}
                    className="btn-primary text-xs disabled:opacity-50"
                  >
                    {submitting ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Batch Details & Roster */}
      {detailModalOpen && batchDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-2xl p-6 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <span className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold text-xs">
                {batchDetails.code}
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">{batchDetails.name}</h3>
                <p className="text-xs text-slate-400">
                  {batchDetails.school?.name} • Mentor: {batchDetails.instructor?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            {/* Roster List */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Enrolled Students Roster ({ (batchDetails.students || []).length })
                </h4>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {(batchDetails.students || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No students assigned to this cohort yet.</p>
                ) : (
                  batchDetails.students.map(st => (
                    <div key={st._id} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{st.name}</span>
                        <span className="font-mono text-[10px] text-blue-400 ml-2">({st.studentId})</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{st.email} • {st.offlineRollNo}</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {st.approvalStatus}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
