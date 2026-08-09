import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { CalendarCheck, Download, Printer, Search, Filter, RefreshCw, Calendar, FileText } from 'lucide-react';

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

  const { addToast } = useToast();

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
            onClick={handlePrint}
            className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="btn-modern-primary px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5"
          >
            <Download size={14} />
            <span>Export CSV Sheet</span>
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
    </div>
  );
};

export default AttendanceOverview;
