import React from 'react';
import { AlertTriangle, TrendingUp, Users, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const AttendanceAnalytics = ({ analytics, batchName }) => {
  if (!analytics) return null;

  const {
    totalSessions = 0,
    totalRecords = 0,
    totalPresent = 0,
    totalLate = 0,
    totalAbsent = 0,
    overallPercentage = 0,
    lowAttendanceStudents = []
  } = analytics;

  return (
    <div className="space-y-4">
      {/* Low Attendance Warning Alert */}
      {lowAttendanceStudents.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-900">
              Attendance Alert: {lowAttendanceStudents.length} student(s) below 75% mandatory threshold
            </h4>
            <p className="text-amber-800 leading-relaxed">
              The following students may require offline mentoring intervention to maintain lab course completion standards:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {lowAttendanceStudents.map((s) => (
                <span
                  key={s.studentId}
                  className="px-2 py-0.5 rounded-full bg-white border border-amber-300 font-semibold text-amber-900 text-[11px]"
                >
                  {s.name} ({s.rollNo}): {s.percentage}%
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-modern rounded-xl p-3.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sessions</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{totalSessions}</p>
          <span className="text-[10px] text-slate-500">Offline Labs</span>
        </div>

        <div className="card-modern rounded-xl p-3.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Rate</span>
          <p className={`text-xl font-black mt-0.5 ${
            overallPercentage < 75 ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            {overallPercentage}%
          </p>
          <span className="text-[10px] text-slate-500">Cumulative Attendance</span>
        </div>

        <div className="card-modern rounded-xl p-3.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Present Marks</span>
          <p className="text-xl font-black text-emerald-700 mt-0.5">{totalPresent + totalLate}</p>
          <span className="text-[10px] text-slate-500">{totalPresent} present • {totalLate} late</span>
        </div>

        <div className="card-modern rounded-xl p-3.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Absent Marks</span>
          <p className="text-xl font-black text-rose-600 mt-0.5">{totalAbsent}</p>
          <span className="text-[10px] text-slate-500">Recorded Absences</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
