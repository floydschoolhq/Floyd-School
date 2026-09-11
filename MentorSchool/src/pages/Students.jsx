import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import StudentProfileModal from '../components/Common/StudentProfileModal';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  School,
  Sparkles,
  UserCheck
} from 'lucide-react';

const Students = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'enrolled';

  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab); // 'enrolled' | 'pending'
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('all');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approval modal / allotment state
  const [allottingStudent, setAllottingStudent] = useState(null);
  const [allotBatchId, setAllotBatchId] = useState('');
  const [allotting, setAllotting] = useState(false);

  // Profile modal state
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (activeTab === 'enrolled') {
      fetchStudents();
    } else {
      fetchPendingStudents();
    }
  }, [activeTab, selectedBatchId, search]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/mentor/offline/batches');
      setBatches(res.data?.data || []);
      if (res.data?.data?.length > 0 && !allotBatchId) {
        setAllotBatchId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error loading batches:', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBatchId !== 'all') params.batchId = selectedBatchId;
      if (search.trim()) params.search = search.trim();
      params.approvalStatus = 'approved';

      const res = await api.get('/mentor/offline/students', { params });
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      addToast('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentor/offline/pending-students');
      setPendingStudents(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching pending students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudent = async (e) => {
    e.preventDefault();
    if (!allottingStudent || !allotBatchId) {
      addToast('Please select a batch for allotment', 'error');
      return;
    }

    setAllotting(true);
    try {
      const res = await api.post('/mentor/offline/approve-student', {
        studentId: allottingStudent._id,
        batchId: allotBatchId
      });

      addToast(res.data?.message || 'Candidate approved & roll number allotted!', 'success');
      setAllottingStudent(null);
      fetchPendingStudents();
      fetchStudents();
    } catch (err) {
      console.error('Approval failed:', err);
      addToast(err.response?.data?.message || 'Approval failed', 'error');
    } finally {
      setAllotting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Users size={15} />
              <span>Offline Laboratory Student Roster</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Student Directory & Approvals
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Manage enrolled students across your offline cohorts and review pending candidate allotments.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={() => {
                setActiveTab('enrolled');
                setSearchParams({ tab: 'enrolled' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'enrolled'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enrolled Roster
            </button>
            <button
              onClick={() => {
                setActiveTab('pending');
                setSearchParams({ tab: 'pending' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'pending'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Allotments</span>
              {pendingStudents.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingStudents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls (Enrolled view) */}
        {activeTab === 'enrolled' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students by name, roll number, or guardian mobile..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 font-medium"
              />
            </div>

            {/* Batch Filter */}
            <div>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              >
                <option value="all">All Assigned Batches</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: Enrolled Student Table */}
      {activeTab === 'enrolled' && (
        <div className="card-modern rounded-xl overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Enrolled Students ({students.length})
            </h3>
          </div>

          {loading ? (
            <LoadingSpinner text="Searching student database..." />
          ) : students.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              No students match your search or filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Batch & School</th>
                    <th className="py-2.5 px-3">Class / Sec</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {s.offlineRollNo}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px] block">{s.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">{s.batch?.name || 'N/A'}</span>
                        <span className="text-[10px] text-slate-400">{s.school?.name || 'Partner School'}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {s.grade} - {s.section}
                      </td>
                      <td className="py-3 px-3">
                        <span className="block text-slate-800">Std: {s.studentMobile || 'N/A'}</span>
                        <span className="text-[10px] text-slate-400 block">Father: {s.fatherMobile || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${
                          s.attendancePercentage < 75 ? 'text-rose-600' : 'text-slate-800'
                        }`}>
                          {s.attendancePercentage}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {s.attendedCount}/{s.totalSessions} sessions
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedStudentId(s._id)}
                          className="btn-modern-secondary px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye size={12} />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pending Approvals & Allotments */}
      {activeTab === 'pending' && (
        <div className="card-modern rounded-xl overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Self-Registered Candidates Awaiting Mentor Approval
              </h3>
              <p className="text-[11px] text-slate-500">
                Verify candidates and allocate them to a classroom batch to generate official Floyd School roll numbers.
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Checking pending registration queue..." />
          ) : pendingStudents.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <UserCheck size={36} className="mx-auto text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-800">All clear! No pending candidate approvals</h4>
              <p className="text-xs text-slate-500">
                Any self-registered students from partner schools will appear here for batch assignment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingStudents.map((s) => (
                <div key={s._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{s.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 uppercase">
                        Pending Allotment
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {s.school?.name || 'Partner School'} • Grade {s.grade} Sec {s.section}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Email: {s.email} • Student Phone: {s.studentMobile || 'N/A'} • Father: {s.fatherName} ({s.fatherMobile})
                    </p>
                  </div>

                  <button
                    onClick={() => setAllottingStudent(s)}
                    className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0"
                  >
                    <CheckCircle2 size={13} />
                    <span>Approve & Allot Batch</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Batch Allotment Modal */}
      {allottingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Approve & Allot Batch: {allottingStudent.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                School: {allottingStudent.school?.name || 'Partner School'}
              </p>
            </div>

            <form onSubmit={handleApproveStudent} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Classroom Cohort / Batch *
                </label>
                <select
                  value={allotBatchId}
                  onChange={(e) => setAllotBatchId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                  required
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.code}) - {b.roomVenue}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  A deterministic roll number (e.g. STXAV-ROB10A-002) will automatically be allocated.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAllottingStudent(null)}
                  className="btn-modern-secondary px-3.5 py-1.5 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allotting}
                  className="btn-modern-primary px-4 py-1.5 rounded-lg text-xs font-bold"
                >
                  {allotting ? 'Allocating...' : 'Confirm Allotment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudentId && (
        <StudentProfileModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default Students;
