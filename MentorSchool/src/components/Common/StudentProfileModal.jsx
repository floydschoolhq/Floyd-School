import React, { useEffect, useState } from 'react';
import { X, User, Phone, Mail, Award, BookOpen, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from './LoadingSpinner';

const StudentProfileModal = ({ studentId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'quizzes' | 'homework'

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/mentor/offline/students/${studentId}`);
        setData(res.data?.data);
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchProfile();
  }, [studentId]);

  if (!studentId) return null;

  const student = data?.student;
  const academics = data?.academics;
  const attendanceHistory = data?.attendanceHistory || [];
  const quizSubmissions = data?.quizSubmissions || [];
  const homeworkSubmissions = data?.homeworkSubmissions || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{student?.name || 'Student Profile'}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">
                  {student?.offlineRollNo || 'Pending'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {student?.school?.name || 'Partner School'} • {student?.batch?.name || 'Offline Cohort'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Fetching student academic profile..." />
          </div>
        ) : !student ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Student record could not be loaded.
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-200 gap-1 text-xs font-semibold">
              {[
                { key: 'overview', label: 'Overview & Info' },
                { key: 'attendance', label: `Attendance (${attendanceHistory.length})` },
                { key: 'quizzes', label: `Quizzes (${quizSubmissions.length})` },
                { key: 'homework', label: `Homework (${homeworkSubmissions.length})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`pb-2.5 px-3 transition-colors border-b-2 ${
                    activeTab === t.key
                      ? 'border-slate-900 text-slate-900 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Academic Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="card-modern rounded-xl p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Attendance</span>
                    <p className={`text-xl font-black mt-0.5 ${
                      (academics?.attendancePercentage || 0) < 75 ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {academics?.attendancePercentage || 0}%
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {academics?.attendedCount || 0} / {academics?.totalSessions || 0} classes
                    </span>
                  </div>

                  <div className="card-modern rounded-xl p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Quizzes</span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">
                      {academics?.quizzesTaken || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Completed</span>
                  </div>

                  <div className="card-modern rounded-xl p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Homework</span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">
                      {academics?.homeworkSubmitted || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Submissions</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="card-modern rounded-xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Academic Placement</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Grade & Section:</span>
                        <span className="font-semibold text-slate-800">{student.grade} - Sec {student.section}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Batch Code:</span>
                        <span className="font-semibold font-mono text-slate-800">{student.batch?.code || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Venue:</span>
                        <span className="font-semibold text-slate-800">{student.batch?.roomVenue || 'Lab 101'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Approval Status:</span>
                        <span className="capitalize font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          {student.approvalStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="card-modern rounded-xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact & Guardian</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[150px]">{student.email}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Student Mobile:</span>
                        <span className="font-semibold text-slate-800">{student.studentMobile || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Guardian / Father:</span>
                        <span className="font-semibold text-slate-800">{student.fatherName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Guardian Phone:</span>
                        <span className="font-semibold text-slate-800">{student.fatherMobile || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Attendance */}
            {activeTab === 'attendance' && (
              <div className="space-y-3">
                {attendanceHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No attendance records logged yet for this student.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {attendanceHistory.map((a) => (
                      <div key={a._id} className="card-modern rounded-lg p-3 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900">
                            {new Date(a.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <p className="text-[11px] text-slate-500">{a.topicCovered || 'Practical STEM Experiment'}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          a.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : a.status === 'late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : a.status === 'holiday'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Quizzes */}
            {activeTab === 'quizzes' && (
              <div className="space-y-3">
                {quizSubmissions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No quiz submissions recorded yet.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {quizSubmissions.map((q) => (
                      <div key={q._id} className="card-modern rounded-lg p-3 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-slate-900">{q.quizTitle}</h5>
                          <span className="text-[10px] text-slate-400">
                            Submitted on {new Date(q.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {q.score} / {q.totalMarks}
                          </span>
                          <p className="text-[10px] font-semibold text-slate-500">{q.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Homework */}
            {activeTab === 'homework' && (
              <div className="space-y-3">
                {homeworkSubmissions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No homework submitted yet.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {homeworkSubmissions.map((h) => (
                      <div key={h._id} className="card-modern rounded-lg p-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900">{h.assignmentTitle}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            h.status === 'graded'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>
                            {h.marksObtained !== undefined ? `Marks: ${h.marksObtained}/${h.maxMarks}` : 'Awaiting grading'}
                          </span>
                          <span>{new Date(h.submittedAt).toLocaleDateString()}</span>
                        </div>
                        {h.feedback && (
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                            "{h.feedback}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="btn-modern-secondary px-4 py-1.5 rounded-lg text-xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
