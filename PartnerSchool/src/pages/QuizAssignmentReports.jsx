import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { FileSpreadsheet, Award, BookOpen, Check, ExternalLink } from 'lucide-react';

const QuizAssignmentReports = () => {
  const [data, setData] = useState({ quizzes: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [gradeModal, setGradeModal] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await api.get('/partner-school/assessments');
      setData(res.data.data || { quizzes: [], assignments: [] });
    } catch (error) {
      console.error('Error fetching assessment overview:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradeModal) return;
    setSubmitting(true);
    try {
      await api.post(`/partner-school/assignments/${gradeModal.assignmentId}/grade`, {
        studentId: gradeModal.studentId,
        marksObtained: Number(marks),
        feedback
      });

      addToast('Homework submission graded successfully!', 'success');
      setGradeModal(null);
      setMarks('');
      setFeedback('');
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Grading failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-3d rounded-lg p-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-slate-800" />
          Examinations & Homework Evaluation
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Review active quizzes, evaluate submitted student project files, and record marks.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quizzes Overview */}
          <div className="card-3d rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Award size={16} className="text-slate-800" />
              Published Quizzes & Exams ({data.quizzes.length})
            </h2>

            {data.quizzes.length === 0 ? (
              <p className="text-slate-500 text-xs py-6 text-center">No active quizzes published for this school yet.</p>
            ) : (
              <div className="space-y-2">
                {data.quizzes.map((q) => (
                  <div key={q._id} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{q.title}</span>
                      <span className="text-[10px] font-bold bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded">
                        Max Marks: {q.totalMarks}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{q.description}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Time Limit: {q.timeLimitMinutes} Mins • Questions: {q.questions?.length || 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments & Grading Queue */}
          <div className="card-3d rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <BookOpen size={16} className="text-slate-800" />
              Practical Homework & Submissions ({data.assignments.length})
            </h2>

            {data.assignments.length === 0 ? (
              <p className="text-slate-500 text-xs py-6 text-center">No homework assignments created yet.</p>
            ) : (
              <div className="space-y-3">
                {data.assignments.map((a) => (
                  <div key={a._id} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-xs font-bold text-slate-900">{a.title}</span>
                      <span className="text-[10px] font-bold text-slate-600 font-mono">
                        Submissions: {a.submissions?.length || 0}
                      </span>
                    </div>

                    {a.submissions && a.submissions.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-bold uppercase text-slate-500">Student Submission Queue</p>
                        {a.submissions.map((sub, sIdx) => {
                          const student = sub.studentId || {};
                          return (
                            <div key={sIdx} className="bg-white border border-slate-200 rounded p-2.5 flex items-center justify-between text-xs shadow-2xs">
                              <div>
                                <p className="font-bold text-slate-900">{student.name || 'Student'}</p>
                                <p className="text-[10px] text-slate-500 font-mono">Roll: {student.offlineRollNo} • Status: {sub.status}</p>
                                {sub.fileUrl && (
                                  <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-slate-800 underline flex items-center gap-1 mt-0.5">
                                    <ExternalLink size={11} /> View Uploaded Project File
                                  </a>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  setGradeModal({ assignmentId: a._id, studentId: student._id, studentName: student.name, assignmentTitle: a.title, maxMarks: a.maxMarks });
                                  setMarks(sub.marksObtained !== undefined ? String(sub.marksObtained) : '');
                                  setFeedback(sub.feedback || '');
                                }}
                                className="py-1 px-2.5 btn-3d-dark rounded text-xs font-bold shrink-0"
                              >
                                {sub.status === 'Graded' ? 'Edit Marks' : 'Evaluate & Grade'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">No student submissions received yet for this project.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md relative shadow-lg space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Grade Student Homework</h3>
              <p className="text-xs text-slate-500">Student: {gradeModal.studentName} • {gradeModal.assignmentTitle}</p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Marks Obtained (Max: {gradeModal.maxMarks})</label>
                <input
                  type="number"
                  required
                  max={gradeModal.maxMarks}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mentor Feedback / Remarks</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Good circuit layout and clean code logic."
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradeModal(null)}
                  className="flex-1 py-2 btn-3d-light rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 btn-3d-dark rounded text-xs font-bold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAssignmentReports;
