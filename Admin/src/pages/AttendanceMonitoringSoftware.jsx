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
  RefreshCw
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
    <div className="space-y-6">
      {/* Software Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="text-blue-600" size={26} />
            Institutional Attendance Monitoring
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1">Real-time attendance analytics engine, low-attendance warnings, and log correction suite.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAnalytics}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Rate</p>
          <p className="text-2xl font-black text-slate-900">{summary.overallRate || 0}%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sessions</p>
          <p className="text-2xl font-black text-slate-900">{summary.totalSessions || 0}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present</p>
          <p className="text-2xl font-black text-emerald-600">{summary.presentCount || 0}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Late</p>
          <p className="text-2xl font-black text-amber-600">{summary.lateCount || 0}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent</p>
          <p className="text-2xl font-black text-rose-600">{summary.absentCount || 0}</p>
        </div>
      </div>

      {/* Low Attendance Risk Alert Warning Section (<75%) */}
      {lowAttendanceStudents.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-slate-900">
              <AlertTriangle size={18} className="text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Low Attendance Warnings — Below 75% ({lowAttendanceStudents.length} Students)
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
              Attention Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowAttendanceStudents.map((s, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Roll: <span className="text-slate-900 font-bold">{s.offlineRollNo}</span> • Batch: {s.batchName}
                  </p>
                  <p className="text-[11px] text-slate-400">Father: {s.fatherName} ({s.fatherMobile})</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                    {s.rate}%
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">{s.attended} / {s.totalMarked} Classes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, roll no, batch..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present Only</option>
            <option value="late">Late Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Attendance Logs Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium shadow-xs">
          No attendance records logged yet matching your filters.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Roll Number</th>
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Class & Section</th>
                  <th className="px-4 py-3.5">Batch Name</th>
                  <th className="px-4 py-3.5">Topic Covered</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500 font-mono">{r.dateStr}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600">{r.offlineRollNo}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{r.studentName}</td>
                    <td className="px-4 py-3.5 text-slate-500">{r.grade} (Sec {r.section})</td>
                    <td className="px-4 py-3.5 text-slate-700">{r.batchName}</td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">{r.topicCovered}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.status === 'late'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setEditLogModal(r);
                          setEditStatus(r.status);
                          setEditTopic(r.topicCovered);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center space-x-1 ml-auto cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md relative shadow-2xl space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Correct Attendance Log Record</h3>
              <p className="text-xs text-slate-500">Student: {editLogModal.studentName} ({editLogModal.offlineRollNo})</p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Attendance Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="present">PRESENT</option>
                  <option value="late">LATE</option>
                  <option value="absent">ABSENT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Session Topic Covered</label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditLogModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
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
