import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import StudentProfileModal from '../components/Common/StudentProfileModal';
import {
  Layers,
  School,
  CalendarCheck,
  Award,
  BookOpen,
  ArrowLeft,
  Users,
  MapPin,
  Clock,
  FolderDown,
  Eye
} from 'lucide-react';

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchBatchDetails();
  }, [id]);

  const fetchBatchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/mentor/offline/batches/${id}`);
      setData(res.data?.data);
    } catch (err) {
      console.error('Error fetching batch detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading cohort operational details..." />;
  }

  const batch = data?.batch;
  const students = data?.students || [];
  const recentAttendance = data?.recentAttendance || [];

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/batches')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
        >
          <ArrowLeft size={14} />
          <span>Back to All Batches</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/attendance?batchId=${batch?._id}`)}
            className="btn-modern-primary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5"
          >
            <CalendarCheck size={13} />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* Batch Hero Card */}
      <div className="card-modern rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase font-bold text-slate-400">
                {batch?.code}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase">
                {batch?.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              {batch?.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
              <School size={13} className="text-slate-400" />
              <span>{batch?.school?.name || 'Partner School'} • {batch?.school?.city}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/quizzes?batchId=${batch?._id}`)}
              className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Award size={13} />
              <span>Quizzes ({batch?.quizzesCount || 0})</span>
            </button>
            <button
              onClick={() => navigate(`/homework?batchId=${batch?._id}`)}
              className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <BookOpen size={13} />
              <span>Tasks ({batch?.homeworkCount || 0})</span>
            </button>
            <button
              onClick={() => navigate(`/materials?batchId=${batch?._id}`)}
              className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <FolderDown size={13} />
              <span>Materials ({batch?.materialsCount || 0})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Curriculum</span>
            <p className="font-semibold text-slate-800">{batch?.subject}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Lab Venue</span>
            <p className="font-semibold text-slate-800">{batch?.roomVenue}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Schedule</span>
            <p className="font-semibold text-slate-800">
              {Array.isArray(batch?.scheduleDays) ? batch.scheduleDays.join(', ') : 'Mon, Wed'}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Timing</span>
            <p className="font-semibold text-slate-800">{batch?.scheduleTime}</p>
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="card-modern rounded-xl overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Enrolled Student Roster ({students.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click any candidate to inspect complete academic and attendance record.
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No students enrolled in this cohort yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Grade & Sec</th>
                  <th className="py-2.5 px-3">Guardian Mobile</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {s.offlineRollNo}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {s.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {s.grade} - {s.section}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {s.fatherMobile || s.studentMobile || 'N/A'}
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

export default BatchDetails;
