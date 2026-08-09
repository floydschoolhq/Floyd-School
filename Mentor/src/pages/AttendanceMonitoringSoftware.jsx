import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { 
  CalendarCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileSpreadsheet,
  Users
} from 'lucide-react';

const AttendanceMonitoringSoftware = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editLogModal, setEditLogModal] = useState(null);
  const [editStatus, setEditStatus] = useState('present');
  const [editTopic, setEditTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/mentor/offline/attendance/analytics');
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching attendance analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editLogModal) return;
    setSubmitting(true);
    try {
      await api.put(`/mentor/offline/attendance/${editLogModal.logId}`, {
        studentId: editLogModal.studentId,
        status: editStatus,
        topicCovered: editTopic
      });

      addToast('Attendance log record updated successfully!', 'success');
      setEditLogModal(null);
      fetchAnalytics();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update attendance log', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    if (!data || !data.attendanceLogs) return;

    const headers = ['Date', 'Roll Number', 'Student Name', 'Class & Section', 'Batch', 'Status', 'Topic Covered'];
    const rows = [headers.join(',')];

    data.attendanceLogs.forEach(log => {
      const dateStr = new Date(log.date).toLocaleDateString();
      log.records.forEach(rec => {
        const student = rec.studentId || {};
        rows.push([
          `"${dateStr}"`,
          `"${student.offlineRollNo || 'ST-GRA-001'}"`,
          `"${student.name || 'Unknown'}"`,
          `"${student.grade || 'Grade 10'} Sec ${student.section || 'A'}"`,
          `"${log.batchId?.name || 'Batch'}"`,
          `"${rec.status?.toUpperCase()}"`,
          `"${log.topicCovered?.replace(/"/g, '""') || ''}"`
        ].join(','));
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance_Monitoring_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Attendance spreadsheet exported successfully!', 'success');
  };

  const summary = data?.summary || {};
  const lowAttendanceStudents = data?.lowAttendanceStudents || [];
  const attendanceLogs = data?.attendanceLogs || [];

  // Flatten records for filtered table view
  const allRecords = [];
  attendanceLogs.forEach(log => {
    const dateStr = new Date(log.date).toLocaleDateString();
    log.records.forEach(rec => {
      const student = rec.studentId || {};
      allRecords.push({
        logId: log._id,
        studentId: student._id,
        dateStr,
        studentName: student.name || 'Student',
        offlineRollNo: student.offlineRollNo || 'ST-GRA-001',
        grade: student.grade || 'Grade 10',
        section: student.section || 'A',
        batchName: log.batchId?.name || 'Offline Batch',
        schoolName: log.schoolId?.name || 'Partner School',
        status: rec.status || 'present',
        topicCovered: log.topicCovered || 'STEM Practical Session'
      });
    });
  });

  const filteredRecords = allRecords.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.studentName.toLowerCase().includes(term) ||
        r.offlineRollNo.toLowerCase().includes(term) ||
        r.batchName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Software Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-modern rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="text-slate-800" size={20} />
            Institutional Attendance Monitoring Software
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Real-time attendance analytics engine, low-attendance warnings, and log correction suite.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAnalytics}
            className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <RefreshCw size={14} />
            <span>Refresh Engine</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="btn-modern-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <Download size={14} />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="card-modern rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Overall Rate</p>
          <p className="text-2xl font-bold text-slate-900 font-mono">{summary.overallRate || 0}%</p>
        </div>

        <div className="card-modern rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Class Sessions</p>
          <p className="text-2xl font-bold text-slate-900 font-mono">{summary.totalSessions || 0}</p>
        </div>

        <div className="card-modern rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Present Marks</p>
          <p className="text-2xl font-bold text-slate-900 font-mono">{summary.presentCount || 0}</p>
        </div>

        <div className="card-modern rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Late Marks</p>
          <p className="text-2xl font-bold text-slate-800 font-mono">{summary.lateCount || 0}</p>
        </div>

        <div className="card-modern rounded-xl p-4 space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Absent Marks</p>
          <p className="text-2xl font-bold text-slate-700 font-mono">{summary.absentCount || 0}</p>
        </div>
      </div>

      {/* Low Attendance Risk Alert Warning Section (<75%) */}
      {lowAttendanceStudents.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2 text-slate-900">
              <AlertTriangle size={18} className="text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">
                Low Attendance Warning List — Below 75% Threshold ({lowAttendanceStudents.length} Students)
              </h3>
            </div>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full">
              Attention Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowAttendanceStudents.map((s, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-slate-600 font-mono">
                    Roll: <span className="text-slate-900 font-bold">{s.offlineRollNo}</span> • Batch: {s.batchName}
                  </p>
                  <p className="text-[11px] text-slate-500">Father: {s.fatherName} ({s.fatherMobile})</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-slate-900 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                    {s.rate}%
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{s.attended} / {s.totalMarked} Classes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="card-modern rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, roll no, batch..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
          >
            <option value="all">All Attendance Statuses</option>
            <option value="present">Present Only</option>
            <option value="late">Late Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Attendance Logs Table with 1-Click Correction */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center text-slate-500 text-xs">
          No attendance records logged yet matching your filters.
        </div>
      ) : (
        <div className="card-modern rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3">Batch Name</th>
                  <th className="px-4 py-3">Topic Covered</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-slate-800 font-medium">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-mono">{r.dateStr}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{r.offlineRollNo}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.grade} (Sec {r.section})</td>
                    <td className="px-4 py-3 text-slate-700">{r.batchName}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{r.topicCovered}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.status === 'present'
                          ? 'bg-slate-100 text-slate-900 border-slate-200'
                          : r.status === 'late'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-slate-200 text-slate-800 border-slate-300'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditLogModal(r);
                          setEditStatus(r.status);
                          setEditTopic(r.topicCovered);
                        }}
                        className="btn-modern-secondary px-2 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 ml-auto"
                      >
                        <Edit3 size={12} />
                        <span>Edit Log</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Log Correction Modal */}
      {editLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md relative shadow-lg space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Correct Attendance Log Record</h3>
              <p className="text-xs text-slate-500">Student: {editLogModal.studentName} ({editLogModal.offlineRollNo})</p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attendance Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="present">PRESENT</option>
                  <option value="late">LATE</option>
                  <option value="absent">ABSENT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session Topic Covered</label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditLogModal(null)}
                  className="flex-1 py-2 btn-modern-secondary rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 btn-modern-primary rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceMonitoringSoftware;
