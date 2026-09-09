import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CalendarCheck, Calendar } from 'lucide-react';

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/school-student/attendance');
        setRecords(res.data.data || []);
      } catch (error) {
        console.error('Error fetching attendance history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const totalClasses = records.length;
  const attendedClasses = records.filter(r => r.status === 'present' || r.status === 'late').length;
  const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-3d rounded-lg p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck size={20} className="text-slate-800" />
            Class Attendance Record
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Your official lab session attendance history verified by mentors.</p>
        </div>

        <div className="bg-slate-50 border border-slate-300 rounded px-4 py-2 text-right shrink-0 shadow-2xs">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Overall Rate</p>
          <p className="text-xl font-bold text-slate-900 font-mono">{percentage}%</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="card-3d rounded-lg p-12 text-center text-slate-500 space-y-2">
          <Calendar size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">No Attendance Records Found</h3>
          <p className="text-xs text-slate-500">Attendance logs marked by your mentor during lab sessions will appear here.</p>
        </div>
      ) : (
        <div className="card-3d rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Batch / Class Section</th>
                  <th className="px-4 py-3">Topic Covered</th>
                  <th className="px-4 py-3">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                {records.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-mono">
                      {new Date(rec.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{rec.batchName}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{rec.topicCovered}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                        rec.status === 'present'
                          ? 'bg-slate-100 text-slate-900 border-slate-300'
                          : rec.status === 'late'
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-slate-200 text-slate-800 border-slate-400'
                      }`}>
                        {rec.status.toUpperCase()}
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

export default MyAttendance;
