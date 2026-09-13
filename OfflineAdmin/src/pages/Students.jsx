import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, ArrowRightLeft, Shield, Eye, MapPin, Mail, Phone, Calendar, CheckCircle, XCircle, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [moveBatchModalOpen, setMoveBatchModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schoolId: '',
    batchId: '',
    grade: '',
    section: '',
    fatherName: '',
    fatherMobile: '',
    studentMobile: '',
    customPassword: ''
  });
  const [targetBatchId, setTargetBatchId] = useState('');
  const [createdCredential, setCreatedCredential] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFilters();
    fetchStudents();
  }, [selectedSchool, selectedBatch, selectedStatus]);

  const fetchFilters = async () => {
    try {
      const [schoolsRes, batchesRes] = await Promise.all([
        api.get('/offline-admin/schools'),
        api.get('/offline-admin/batches')
      ]);
      setSchools(schoolsRes.data.data || []);
      setBatches(batchesRes.data.data || []);
    } catch (err) {
      console.error('Failed to load filter metadata:', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSchool) params.school = selectedSchool;
      if (selectedBatch) params.batch = selectedBatch;
      if (selectedStatus) params.status = selectedStatus;

      const res = await api.get('/offline-admin/students', { params });
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      schoolId: schools[0]?._id || '',
      batchId: '',
      grade: '10',
      section: 'A',
      fatherName: '',
      fatherMobile: '',
      studentMobile: '',
      customPassword: ''
    });
    setFormError('');
    setCreatedCredential(null);
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      grade: student.grade || '',
      section: student.section || '',
      fatherName: student.fatherName || '',
      fatherMobile: student.fatherMobile || '',
      studentMobile: student.studentMobile || '',
      isActive: student.isActive !== false
    });
    setFormError('');
    setEditModalOpen(true);
  };

  const handleOpenMoveBatch = (student) => {
    setSelectedStudent(student);
    setTargetBatchId('');
    setFormError('');
    setMoveBatchModalOpen(true);
  };

  const handleViewDetails = async (student) => {
    try {
      const res = await api.get(`/offline-admin/students/${student._id}`);
      setStudentDetails(res.data.data);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Failed to load student details:', err);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await api.post('/offline-admin/students', formData);
      setCreatedCredential(res.data.data);
      fetchStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await api.put(`/offline-admin/students/${selectedStudent._id}`, formData);
      setEditModalOpen(false);
      fetchStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoveBatch = async (e) => {
    e.preventDefault();
    if (!targetBatchId) {
      setFormError('Please select a target batch');
      return;
    }
    setFormError('');
    setSubmitting(true);

    try {
      await api.put(`/offline-admin/students/${selectedStudent._id}/batch`, { targetBatchId });
      setMoveBatchModalOpen(false);
      fetchStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to move batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickApprove = async (student) => {
    if (!student.batch) {
      handleOpenMoveBatch(student);
      return;
    }
    try {
      setLoading(true);
      await api.put(`/offline-admin/students/${student._id}/status`, { approvalStatus: 'approved' });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve student');
      setLoading(false);
    }
  };

  const handleQuickDeny = async (student) => {
    if (!window.confirm(`Are you sure you want to deny registration request for ${student.name}?`)) {
      return;
    }
    try {
      setLoading(true);
      await api.put(`/offline-admin/students/${student._id}/status`, { approvalStatus: 'rejected' });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deny student request');
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Permanent ID',
      accessor: 'studentId',
      className: 'font-mono text-xs font-semibold text-blue-400',
      render: (s) => (
        <span className="bg-blue-950/70 text-blue-400 px-2 py-0.5 rounded border border-blue-800/40">
          {s.studentId || 'PENDING'}
        </span>
      )
    },
    {
      header: 'Student Name',
      accessor: 'name',
      render: (s) => (
        <div>
          <p className="font-semibold text-slate-100">{s.name}</p>
          <p className="text-[11px] text-slate-400 font-mono">{s.email}</p>
        </div>
      )
    },
    {
      header: 'Roll Number',
      accessor: 'offlineRollNo',
      className: 'font-mono text-xs text-slate-300',
      render: (s) => s.offlineRollNo || <span className="text-slate-500 italic">Unassigned</span>
    },
    {
      header: 'Institution & Batch',
      accessor: 'school',
      render: (s) => (
        <div className="text-xs">
          <p className="text-slate-200">{s.school?.name || 'School Unassigned'}</p>
          <p className="text-[11px] text-blue-400 font-medium">
            {s.batch ? `${s.batch.name} (${s.batch.code || 'B01'})` : 'No Batch Assigned'}
          </p>
        </div>
      )
    },
    {
      header: 'Grade / Sec',
      accessor: 'grade',
      className: 'text-xs text-slate-300 font-mono',
      render: (s) => s.grade ? `${s.grade} - ${s.section || 'A'}` : '—'
    },
    {
      header: 'Status',
      accessor: 'approvalStatus',
      render: (s) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
          s.approvalStatus === 'approved'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {s.approvalStatus || 'pending'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Student Master Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional student identities, permanent Floyd IDs, batch assignments, and academic tracking.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Individual Student</span>
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
          {schools.map(sc => (
            <option key={sc._id} value={sc._id}>{sc.name} ({sc.code})</option>
          ))}
        </select>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Cohorts / Batches</option>
          {batches.map(b => (
            <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved & Active</option>
          <option value="pending">Approval Quarantine (Self-Registered)</option>
        </select>

        {(selectedSchool || selectedBatch || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedSchool('');
              setSelectedBatch('');
              setSelectedStatus('');
            }}
            className="text-xs text-blue-400 hover:text-blue-300 ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={students}
        searchKey="name"
        searchPlaceholder="Search by name, studentId, rollNo, email, or mobile..."
        loading={loading}
        onRowClick={handleViewDetails}
        actions={(student) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {student.approvalStatus === 'pending' && (
              <>
                <button
                  onClick={() => handleQuickApprove(student)}
                  title={student.batch ? "Approve Student" : "Allot Batch & Approve"}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleQuickDeny(student)}
                  title="Deny / Reject Request"
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Deny</span>
                </button>
              </>
            )}
            <button
              onClick={() => handleViewDetails(student)}
              title="View Student File"
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenMoveBatch(student)}
              title="Reassign / Move Batch"
              className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenEdit(student)}
              title="Edit Profile"
              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modal: Create Student */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-lg p-6 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Provision Individual Student
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Generates a permanent Floyd Student ID and initial secure temporary password.
            </p>

            {createdCredential ? (
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs">
                  <p className="font-bold text-sm text-emerald-300">Student Created Successfully!</p>
                  <p className="mt-1">Provide these temporary credentials to the student or guardian:</p>
                </div>

                <div className="p-4 rounded-md bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="text-slate-200 font-sans font-semibold">{createdCredential.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Permanent Student ID:</span>
                    <span className="text-blue-400 font-bold">{createdCredential.studentId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Login ID / Email:</span>
                    <span className="text-slate-200">{createdCredential.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Temporary Password:</span>
                    <span className="text-amber-300 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                      {createdCredential.temporaryPassword}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Roll Number:</span>
                    <span className="text-slate-300">{createdCredential.offlineRollNo || 'Pending'}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCreateModalOpen(false)}
                    className="btn-primary text-xs"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateStudent} className="space-y-4">
                {formError && (
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

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
                    <label className="block text-xs font-medium text-slate-300 mb-1">Assign Batch</label>
                    <select
                      value={formData.batchId}
                      onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Batch (Optional)...</option>
                      {batches.filter(b => !formData.schoolId || b.school?._id === formData.schoolId || b.school === formData.schoolId).map(b => (
                        <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryan Verma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Class / Grade</label>
                    <input
                      type="text"
                      placeholder="10"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Section</label>
                    <input
                      type="text"
                      placeholder="A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Student Mobile</label>
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={formData.studentMobile}
                      onChange={(e) => setFormData({ ...formData, studentMobile: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Parent / Father Name</label>
                    <input
                      type="text"
                      placeholder="Mr. Verma"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Parent Mobile</label>
                    <input
                      type="text"
                      placeholder="9876543211"
                      value={formData.fatherMobile}
                      onChange={(e) => setFormData({ ...formData, fatherMobile: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Optional Custom Password</label>
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
                    onClick={() => setCreateModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs"
                  >
                    {submitting ? 'Creating...' : 'Provision Student'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Move Batch (Preserves Attendance History) */}
      {moveBatchModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-md p-6 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setMoveBatchModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedStudent.approvalStatus === 'pending' ? 'Allot Batch & Approve Student' : 'Reassign Student Batch'}
                </h3>
                <p className="text-xs text-slate-400">{selectedStudent.name} • {selectedStudent.studentId}</p>
              </div>
            </div>

            <div className="p-3 rounded bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs mb-4">
              <strong>Data Safety Guarantee:</strong> All historical attendance and homework records remain tied to previous batch sessions. No past records will be rewritten.
            </div>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleMoveBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Offline Batch *</label>
                <select
                  required
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Target Batch...</option>
                  {batches
                    .filter(b => !selectedStudent.school || b.school?._id === selectedStudent.school._id || b.school === selectedStudent.school._id)
                    .map(b => (
                      <option key={b._id} value={b._id}>{b.name} ({b.code}) — {b.subject}</option>
                    ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMoveBatchModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs"
                >
                  {submitting ? 'Processing...' : (selectedStudent.approvalStatus === 'pending' ? 'Confirm Allotment & Approve' : 'Confirm Cohort Transfer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Student Dossier */}
      {detailModalOpen && studentDetails && (
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
                {studentDetails.studentId}
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">{studentDetails.name}</h3>
                <p className="text-xs text-slate-400">
                  {studentDetails.school?.name} • Batch: {studentDetails.batch?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            {studentDetails.approvalStatus === 'pending' && (
              <div className="p-3 my-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Self-Registration Pending Approval</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    This candidate cannot log in until approved and assigned to an active cohort batch.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleQuickApprove(studentDetails);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{studentDetails.batch ? 'Approve Candidate' : 'Allot Batch & Approve'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleQuickDeny(studentDetails);
                    }}
                    className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Deny</span>
                  </button>
                </div>
              </div>
            )}

            {/* Attendance & Quiz Summary */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Attendance Rate</p>
                <p className="text-lg font-bold text-emerald-400">{studentDetails.attendanceStats?.attendancePercentage || 0}%</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Sessions Present</p>
                <p className="text-lg font-bold text-slate-200">
                  {studentDetails.attendanceStats?.attendedSessions || 0} / {studentDetails.attendanceStats?.totalSessions || 0}
                </p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] uppercase text-slate-500">Quizzes Taken</p>
                <p className="text-lg font-bold text-purple-400">{(studentDetails.quizSubmissions || []).length}</p>
              </div>
            </div>

            {/* Attendance Ledger */}
            <div className="space-y-3 mt-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Recent Attendance Sessions
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(studentDetails.attendanceStats?.history || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No attendance records logged yet.</p>
                ) : (
                  studentDetails.attendanceStats.history.map((h, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-[11px] text-slate-400">{new Date(h.date).toLocaleDateString()}</span>
                        <span className="text-slate-200 ml-2 font-medium">{h.topic || 'Classroom Lab'}</span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        h.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {h.status}
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
