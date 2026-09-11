import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import AttendanceSheet from '../components/Attendance/AttendanceSheet';
import AttendanceAnalytics from '../components/Attendance/AttendanceAnalytics';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { CalendarCheck, History, Filter, BarChart3, RefreshCw } from 'lucide-react';

const Attendance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId') || '';

  const { addToast } = useToast();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topicCovered, setTopicCovered] = useState('');
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);

  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'history' | 'analytics'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load initial batches
  useEffect(() => {
    fetchBatches();
  }, []);

  // When selected batch changes or date changes
  useEffect(() => {
    if (selectedBatchId) {
      loadBatchStudents(selectedBatchId);
      loadAnalytics(selectedBatchId);
      loadHistory(selectedBatchId);
    }
  }, [selectedBatchId, date]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentor/offline/batches');
      const bList = res.data?.data || [];
      setBatches(bList);
      if (bList.length > 0 && !selectedBatchId) {
        setSelectedBatchId(initialBatchId || bList[0]._id);
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
      addToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBatchStudents = async (bId) => {
    try {
      const res = await api.get(`/mentor/offline/batches/${bId}`);
      const stdList = res.data?.data?.students || [];
      setStudents(stdList);

      // Check if attendance already exists for this date
      const logRes = await api.get(`/mentor/offline/attendance?batchId=${bId}&date=${date}`);
      const existingLogs = logRes.data?.data || [];

      const initialRecords = {};
      if (existingLogs.length > 0 && existingLogs[0].records) {
        const foundLog = existingLogs[0];
        setTopicCovered(foundLog.topicCovered || '');
        foundLog.records.forEach((r) => {
          if (r.studentId) {
            initialRecords[r.studentId._id] = {
              status: r.status,
              remarks: r.remarks || ''
            };
          }
        });
      }

      // Default missing students to 'present'
      stdList.forEach((s) => {
        if (!initialRecords[s._id]) {
          initialRecords[s._id] = {
            status: 'present',
            remarks: ''
          };
        }
      });

      setRecords(initialRecords);
    } catch (err) {
      console.error('Error loading batch students:', err);
    }
  };

  const loadAnalytics = async (bId) => {
    try {
      const res = await api.get(`/mentor/offline/attendance/analytics?batchId=${bId}`);
      setAnalytics(res.data?.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const loadHistory = async (bId) => {
    try {
      const res = await api.get(`/mentor/offline/attendance?batchId=${bId}`);
      setHistoryLogs(res.data?.data || []);
    } catch (err) {
      console.error('Error loading attendance history:', err);
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatchId) {
      addToast('Please select a batch', 'error');
      return;
    }

    const payloadRecords = students.map((s) => ({
      studentId: s._id,
      status: records[s._id]?.status || 'present',
      remarks: records[s._id]?.remarks || ''
    }));

    setSaving(true);
    try {
      await api.post('/mentor/offline/mark-attendance', {
        batchId: selectedBatchId,
        date,
        topicCovered: topicCovered.trim() || 'Practical STEM Experiment',
        records: payloadRecords
      });

      addToast('Session attendance recorded and synced across ecosystem!', 'success');
      loadAnalytics(selectedBatchId);
      loadHistory(selectedBatchId);
    } catch (err) {
      console.error('Error recording attendance:', err);
      addToast(err.response?.data?.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading classroom attendance roster..." />;
  }

  const selectedBatch = batches.find((b) => b._id === selectedBatchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarCheck size={15} />
              <span>Offline Laboratory Attendance</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Classroom Attendance Management
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Mark session attendance for your assigned cohorts. Synchronizes directly with student & school portals.
            </p>
          </div>

          {/* Batch Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Cohort:
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => {
                setSelectedBatchId(e.target.value);
                setSearchParams({ batchId: e.target.value });
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-800 shadow-2xs"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-1 text-xs font-semibold mt-5 pt-1">
          <button
            onClick={() => setActiveTab('mark')}
            className={`pb-2.5 px-3 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'mark'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck size={14} />
            <span>Mark Session</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2.5 px-3 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'analytics'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 size={14} />
            <span>Cohort Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History size={14} />
            <span>Session Logs ({historyLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'mark' && (
        <AttendanceSheet
          batch={selectedBatch}
          students={students}
          date={date}
          setDate={setDate}
          topicCovered={topicCovered}
          setTopicCovered={setTopicCovered}
          records={records}
          setRecords={setRecords}
          onSave={handleSaveAttendance}
          saving={saving}
        />
      )}

      {activeTab === 'analytics' && (
        <AttendanceAnalytics
          analytics={analytics}
          batchName={selectedBatch?.name}
        />
      )}

      {activeTab === 'history' && (
        <div className="card-modern rounded-xl overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Historical Attendance Sessions
            </h3>
            <button
              onClick={() => loadHistory(selectedBatchId)}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center space-x-1"
            >
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          {historyLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              No sessions have been recorded for this cohort yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {historyLogs.map((log) => (
                <div key={log._id} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">
                        {new Date(log.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {log.records.length} Students Logged
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{log.topicCovered}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">
                      {log.stats?.percentage || 0}%
                    </span>
                    <p className="text-[10px] text-slate-500">
                      {log.stats?.presentCount || 0} Present • {log.stats?.absentCount || 0} Absent
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
