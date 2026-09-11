import React, { useEffect, useState } from 'react';
import { X, Award, CheckCircle2, XCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const QuizResponsesModal = ({ quizId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudentSubmission, setSelectedStudentSubmission] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchResponses();
  }, [quizId]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/mentor/offline/quizzes/${quizId}/responses`);
      setData(res.data?.data);
    } catch (err) {
      console.error('Error fetching quiz responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectStudent = async (studentId) => {
    setLoadingDetail(true);
    try {
      const res = await api.get(`/mentor/offline/quizzes/${quizId}/responses/${studentId}`);
      setSelectedStudentSubmission(res.data?.data);
    } catch (err) {
      console.error('Error fetching response detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const quiz = data?.quiz;
  const responses = data?.responses || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            {selectedStudentSubmission ? (
              <button
                onClick={() => setSelectedStudentSubmission(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Award size={18} />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedStudentSubmission
                  ? `Submission: ${selectedStudentSubmission.student?.name}`
                  : `Quiz Responses — ${quiz?.title || 'Classroom Quiz'}`}
              </h3>
              <p className="text-[11px] text-slate-500">
                {selectedStudentSubmission
                  ? `Roll: ${selectedStudentSubmission.student?.offlineRollNo || 'N/A'} • Score: ${selectedStudentSubmission.score}/${selectedStudentSubmission.totalMarks} (${selectedStudentSubmission.percentage}%)`
                  : `Batch: ${quiz?.batchName || 'Offline Batch'} • Total Submissions: ${responses.length}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {loading || loadingDetail ? (
            <LoadingSpinner text="Loading quiz submission data..." />
          ) : selectedStudentSubmission ? (
            /* Student Question-by-Question Detailed Review */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedStudentSubmission.student?.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Roll: {selectedStudentSubmission.student?.offlineRollNo} • Submitted {new Date(selectedStudentSubmission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">
                    {selectedStudentSubmission.score} / {selectedStudentSubmission.totalMarks}
                  </span>
                  <p className="text-xs font-semibold text-emerald-700">
                    {selectedStudentSubmission.percentage}% Score
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Questions Evaluation Breakdown
                </h5>
                {selectedStudentSubmission.review?.map((q, idx) => (
                  <div
                    key={idx}
                    className={`card-modern rounded-xl p-4 space-y-2 border ${
                      q.isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Q{idx + 1}. {q.questionText}
                      </span>
                      {q.isCorrect ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1 shrink-0">
                          <CheckCircle2 size={11} />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center space-x-1 shrink-0">
                          <XCircle size={11} />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = q.selectedOption === optIdx;
                        const isAnswerKey = q.correctOption === optIdx;

                        let style = 'bg-white border-slate-200 text-slate-700';
                        if (isAnswerKey) {
                          style = 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900';
                        } else if (isSelected && !q.isCorrect) {
                          style = 'bg-rose-50 border-rose-300 line-through text-rose-800 font-semibold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-xs flex items-center justify-between ${style}`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span className="text-[10px] uppercase font-bold text-slate-500">
                                Student Choice
                              </span>
                            )}
                            {isAnswerKey && !isSelected && (
                              <span className="text-[10px] uppercase font-bold text-emerald-700">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : responses.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No students have submitted responses for this quiz yet.
            </div>
          ) : (
            /* Submissions Table */
            <div className="space-y-2">
              <div className="bg-slate-50 px-4 py-2 rounded-lg flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>Student Roster</span>
                <span className="pr-6">Score & Performance</span>
              </div>

              <div className="divide-y divide-slate-100">
                {responses.map((r) => (
                  <div
                    key={r._id}
                    onClick={() => handleInspectStudent(r.student._id)}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{r.student?.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {r.student?.offlineRollNo || 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Submitted: {new Date(r.submittedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">
                          {r.score} / {r.totalMarks}
                        </span>
                        <p className={`text-[10px] font-semibold ${
                          r.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {r.percentage}%
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-medium">
            Evaluations recorded server-side
          </span>
          <button
            onClick={onClose}
            className="btn-modern-secondary px-4 py-1.5 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResponsesModal;
