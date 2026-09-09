import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { CalendarCheck, Download, Printer, Search, Filter, RefreshCw, Calendar, FileText, CheckSquare, X, PlusCircle } from 'lucide-react';

const AttendanceOverview = () => {
  const [logs, setLogs] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mark Attendance Modal State (Requirement 15)
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markBatchId, setMarkBatchId] = useState('');
  const [markDate, setMarkDate] = useState(new Date().toISOString().slice(0, 10));
  const [markTopic, setMarkTopic] = useState('Practical STEM Experiment');
  const [markRoster, setMarkRoster] = useState([]);
  const [studentStatuses, setStudentStatuses] = useState({});
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  const { addToast } = useToast();

  const handleOpenMarkModal = async () => {
    const targetBatchId = markBatchId || batches[0]?._id;
    setMarkBatchId(targetBatchId);
    setShowMarkModal(true);
    if (targetBatchId) {
      await loadBatchStudents(targetBatchId);
    }
  };

  const loadBatchStudents = async (batchId) => {
    try {
      const res = await api.get(`/partner-school/students?batchId=${batchId}`);
      const students = res.data.data || [];
      setMarkRoster(students);
      const initial = {};
      students.forEach(s => { initial[s._id] = 'present'; });
      setStudentStatuses(initial);
    } catch (error) {
      console.error('Error loading batch students:', error);
    }
  };

  const handleMarkBatchChange = async (e) => {
    const bId = e.target.value;
    setMarkBatchId(bId);
    await loadBatchStudents(bId);
  };

  const handleStatusToggle = (studentId, status) => {
    setStudentStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    markRoster.forEach(s => { updated[s._id] = status; });
    setStudentStatuses(updated);
  };

  const submitAttendanceSession = async (e) => {
    e.preventDefault();
    if (!markBatchId) {
      addToast('Please select an offline batch section', 'error');
      return;
    }
    if (markRoster.length === 0) {
      addToast('No enrolled students in this batch section to mark', 'error');
      return;
    }

    setSubmittingAttendance(true);
    try {
      const records = markRoster.map(s => ({
        studentId: s._id,
        status: studentStatuses[s._id] || 'present'
      }));

      await api.post('/partner-school/attendance', {
        batchId: markBatchId,
        date: markDate,
        topicCovered: markTopic,
        records
      });

      addToast('Batch attendance recorded successfully!', 'success');
      setShowMarkModal(false);
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit attendance', 'error');
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const fetchData = async () => {
    try {
      const [logsRes, batchesRes] = await Promise.all([
        api.get(`/partner-school/attendance?batchId=${selectedBatch}`),
        api.get('/partner-school/batches')
      ]);
      setLogs(logsRes.data.data || []);
      setBatches(batchesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching attendance overview:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBatch]);

  // Flatten logs into records for filtering & display
  const allRecords = [];
  logs.forEach(log => {
    log.records.forEach(rec => {
      const student = rec.studentId || {};
      const batch = log.batchId || {};
      
      allRecords.push({
        id: `${log._id}-${student._id || Math.random()}`,
        logId: log._id,
        date: new Date(log.date),
        dateStr: new Date(log.date).toISOString().split('T')[0],
        formattedDate: new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        batchName: batch.name || 'Offline Batch',
        batchCode: batch.code || 'BATCH',
        studentName: student.name || 'Unknown Student',
        offlineRollNo: student.offlineRollNo || 'ST-GRA-001',
        grade: student.grade || 'Grade 10',
        section: student.section || 'A',
        status: rec.status || 'present',
        topicCovered: log.topicCovered || 'Practical STEM Experiment',
        remarks: rec.remarks || ''
      });
    });
  });

  // Apply filters
  const filteredRecords = allRecords.filter(r => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = r.studentName.toLowerCase().includes(term);
      const matchRoll = r.offlineRollNo.toLowerCase().includes(term);
      if (!matchName && !matchRoll) return false;
    }

    if (startDate && r.dateStr < startDate) return false;
    if (endDate && r.dateStr > endDate) return false;

    return true;
  });

  // Calculate stats
  const totalSessions = logs.length;
  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const lateCount = filteredRecords.filter(r => r.status === 'late').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const totalCount = filteredRecords.length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  const handleExportCsv = () => {
    if (filteredRecords.length === 0) {
      addToast('No attendance records available to export', 'error');
      return;
    }

    const headers = ['Date', 'Roll Number', 'Student Name', 'Class & Section', 'Batch Name', 'Attendance Status', 'Topic Covered', 'Remarks'];
    const csvRows = [headers.join(',')];

    filteredRecords.forEach(r => {
      csvRows.push([
        `"${r.formattedDate}"`,
        `"${r.offlineRollNo}"`,
        `"${r.studentName}"`,
        `"${r.grade} Sec ${r.section}"`,
        `"${r.batchName}"`,
        `"${r.status.toUpperCase()}"`,
        `"${r.topicCovered.replace(/"/g, '""')}"`,
        `"${r.remarks.replace(/"/g, '""')}"`
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Report_${selectedBatch}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Attendance CSV spreadsheet exported successfully!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print:space-y-2">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-modern rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck size={20} className="text-slate-800" />
            Class Attendance Logs & Reports
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Filter, inspect, and export multi-batch attendance logs for your partner school.</p>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <button
            onClick={handleOpenMarkModal}
            className="btn-modern-primary px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 font-bold"
          >
            <PlusCircle size={14} />
            <span>Mark Session Attendance</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Modern Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="card-modern rounded-xl p-3.5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Class Sessions</p>
          <p className="text-xl font-bold text-slate-900 font-mono">{totalSessions}</p>
        </div>

        <div className="card-modern rounded-xl p-3.5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Present</p>
          <p className="text-xl font-bold text-slate-900 font-mono">{presentCount}</p>
        </div>

        <div className="card-modern rounded-xl p-3.5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Late</p>
          <p className="text-xl font-bold text-slate-800 font-mono">{lateCount}</p>
        </div>

        <div className="card-modern rounded-xl p-3.5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Absent</p>
          <p className="text-xl font-bold text-slate-700 font-mono">{absentCount}</p>
        </div>

        <div className="card-modern rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</p>
          <p className="text-xl font-bold text-slate-900 font-mono">{attendanceRate}%</p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="card-modern rounded-xl p-4 space-y-3 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Filter size={14} className="text-slate-700" />
            Search & Filter Attendance Logs
          </h2>
          <button
            onClick={() => {
              setSelectedBatch('all');
              setSelectedStatus('all');
              setSearchTerm('');
              setStartDate('');
              setEndDate('');
            }}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Student or Roll No..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Batch Filter */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
          >
            <option value="all">All Offline Batches ({batches.length})</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
          >
            <option value="all">All Attendance Statuses</option>
            <option value="present">Present Only</option>
            <option value="late">Late Only</option>
            <option value="absent">Absent Only</option>
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
          />

          {/* End Date */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Attendance Records Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center text-slate-500 space-y-2">
          <Calendar size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">No Matching Attendance Records Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your batch, date range, or student search filters.</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-slate-800 font-medium">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-mono">{r.formattedDate}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal (Requirement 15) */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-2xl relative shadow-xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Mark Offline Classroom Attendance</h3>
                <p className="text-xs text-slate-500">Record session attendance directly into the verified institutional database.</p>
              </div>
              <button onClick={() => setShowMarkModal(false)} className="text-slate-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitAttendanceSession} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Batch Section</label>
                  <select
                    value={markBatchId}
                    onChange={handleMarkBatchChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                  >
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
                  <input
                    type="date"
                    required
                    value={markDate}
                    onChange={e => setMarkDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Lab Experiment Covered</label>
                <input
                  type="text"
                  required
                  value={markTopic}
                  onChange={e => setMarkTopic(e.target.value)}
                  placeholder="e.g. Ultrasonic Sensor Hardware Lab & MicroPython Scripting"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>

              {/* Roster Attendance Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Student Roster ({markRoster.length})
                  </span>
                  <div className="space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleMarkAll('present')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-800"
                    >
                      All Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAll('absent')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-800"
                    >
                      All Absent
                    </button>
                  </div>
                </div>

                {markRoster.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-lg border border-slate-200">
                    No approved students found in this batch section.
                  </p>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="px-3 py-2">Roll No</th>
                          <th className="px-3 py-2">Student Name</th>
                          <th className="px-3 py-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {markRoster.map(s => (
                          <tr key={s._id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{s.offlineRollNo}</td>
                            <td className="px-3 py-2 font-bold text-slate-900">{s.name}</td>
                            <td className="px-3 py-2 text-right">
                              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                                {['present', 'late', 'absent'].map(status => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusToggle(s._id, status)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                      studentStatuses[s._id] === status
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="flex-1 py-2 btn-modern-secondary rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAttendance || markRoster.length === 0}
                  className="flex-1 py-2 btn-modern-primary rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {submittingAttendance ? 'Saving Attendance...' : 'Save & Submit Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceOverview;
