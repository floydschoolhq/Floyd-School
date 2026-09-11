import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Sun, Save, AlertCircle } from 'lucide-react';

const AttendanceSheet = ({
  batch,
  students,
  date,
  setDate,
  topicCovered,
  setTopicCovered,
  records,
  setRecords,
  onSave,
  saving
}) => {
  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = {
        status,
        remarks: records[s._id]?.remarks || ''
      };
    });
    setRecords(updated);
  };

  // Calculate live stats
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let holidayCount = 0;

  students.forEach((s) => {
    const st = records[s._id]?.status || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'absent') absentCount++;
    else if (st === 'late') lateCount++;
    else if (st === 'holiday') holidayCount++;
  });

  const total = students.length;
  const livePercentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  return (
    <div className="space-y-5">
      {/* Session Metadata Controls */}
      <div className="card-modern rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Class Session Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Practical STEM Topic Covered
            </label>
            <input
              type="text"
              value={topicCovered}
              onChange={(e) => setTopicCovered(e.target.value)}
              placeholder="e.g., MicroPython PWM Servo Angle Control Lab 4"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Live Counters & Bulk Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
              Total: {total}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Present: {presentCount}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Absent: {absentCount}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Late: {lateCount}
            </span>
            <span className="text-xs font-bold text-slate-900">
              Attendance: {livePercentage}%
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => markAll('present')}
              className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => markAll('absent')}
              className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 text-rose-700 hover:bg-rose-50"
            >
              <XCircle size={13} className="text-rose-500" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Roster Rows */}
      <div className="card-modern rounded-xl overflow-hidden divide-y divide-slate-100">
        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <span>Student Candidate</span>
          <span>Attendance Status</span>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No students enrolled in this batch yet.
          </div>
        ) : (
          students.map((student) => {
            const currentStatus = records[student._id]?.status || 'present';
            const currentRemarks = records[student._id]?.remarks || '';

            return (
              <div
                key={student._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                {/* Student Info */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{student.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {student.offlineRollNo || 'Pending'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Grade {student.grade} - Sec {student.section} • Phone: {student.studentMobile || 'N/A'}
                  </p>
                </div>

                {/* Status Toggle Buttons - Tablet & Mobile Friendly */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student._id, 'present')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    <span>Present</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student._id, 'absent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle size={12} />
                    <span>Absent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student._id, 'late')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      currentStatus === 'late'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Clock size={12} />
                    <span className="hidden sm:inline">Late</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student._id, 'holiday')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      currentStatus === 'holiday'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sun size={12} />
                    <span className="hidden sm:inline">Holiday</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || students.length === 0}
          className="btn-modern-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
        >
          <Save size={15} />
          <span>{saving ? 'Recording Attendance...' : 'Save & Submit Attendance'}</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceSheet;
