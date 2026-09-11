import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, Clock, Award, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batchId: '',
    timeLimitMinutes: 15,
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0
      }
    ]
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchQuizzes();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/offline-admin/batches');
      setBatches(res.data.data || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/quizzes');
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      batchId: batches[0]?._id || '',
      timeLimitMinutes: 15,
      questions: [
        {
          questionText: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    });
    setFormError('');
    setModalOpen(true);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: '', options: ['', '', '', ''], correctOption: 0 }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) return;
    const qList = [...formData.questions];
    qList.splice(index, 1);
    setFormData({ ...formData, questions: qList });
  };

  const updateQuestionText = (index, text) => {
    const qList = [...formData.questions];
    qList[index].questionText = text;
    setFormData({ ...formData, questions: qList });
  };

  const updateOptionText = (qIndex, oIndex, text) => {
    const qList = [...formData.questions];
    qList[qIndex].options[oIndex] = text;
    setFormData({ ...formData, questions: qList });
  };

  const updateCorrectOption = (qIndex, oIndex) => {
    const qList = [...formData.questions];
    qList[qIndex].correctOption = oIndex;
    setFormData({ ...formData, questions: qList });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic question validation
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.questionText.trim()) {
        setFormError(`Question #${i + 1} text is empty`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setFormError(`All 4 options for Question #${i + 1} must be filled`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await api.post('/offline-admin/quizzes', formData);
      setModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Quiz Assessment',
      accessor: 'title',
      render: (q) => (
        <div>
          <p className="font-semibold text-slate-100">{q.title}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{q.description || 'STEM Evaluation'}</p>
        </div>
      )
    },
    {
      header: 'Cohort / School',
      accessor: 'batch',
      render: (q) => (
        <div className="text-xs">
          <p className="text-slate-200 font-medium">{q.batch?.name || 'Batch'}</p>
          <p className="text-[11px] text-blue-400 font-mono">{q.school?.name || q.batch?.code || 'School'}</p>
        </div>
      )
    },
    {
      header: 'Questions',
      accessor: 'questionCount',
      className: 'text-center font-mono text-xs',
      render: (q) => `${q.questionCount || 0} MCQs`
    },
    {
      header: 'Time Limit',
      accessor: 'timeLimitMinutes',
      className: 'text-center font-mono text-xs text-slate-300',
      render: (q) => `${q.timeLimitMinutes || 15} min`
    },
    {
      header: 'Submissions & Avg Score',
      accessor: 'submissionCount',
      render: (q) => (
        <div className="text-xs font-mono">
          <span className="text-slate-200">{q.submissionCount || 0} taken</span>
          <span className="text-slate-500"> • </span>
          <span className="text-emerald-400 font-semibold">{q.averageScore || 0}% avg</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Laboratory Assessments & Quizzes</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            MCQ assessments, anti-cheating projection verification, score distributions, and real-time response telemetry.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Publish MCQ Assessment</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={quizzes}
        searchKey="title"
        searchPlaceholder="Search quizzes by title..."
        loading={loading}
      />

      {/* Modal: Create MCQ Assessment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-2xl p-6 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Publish MCQ Assessment
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Available instantly to students in the designated cohort on the <strong>SchoolStudent</strong> portal.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Cohort / Batch *</label>
                  <select
                    required
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Batch...</option>
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    value={formData.timeLimitMinutes}
                    onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MicroPython Basics & Sensor Pinout Quiz"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Dynamic Questions Builder */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                    Questions Builder ({formData.questions.length})
                  </span>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn-secondary text-xs py-1 px-2.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {formData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-md bg-slate-950 border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-blue-400">
                        Question #{qIdx + 1}
                      </span>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIdx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Enter question prompt..."
                      value={q.questionText}
                      onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctOption === oIdx}
                            onChange={() => updateCorrectOption(qIdx, oIdx)}
                            className="text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            value={opt}
                            onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                            className="w-full bg-transparent border-none text-xs text-slate-200 focus:outline-none placeholder-slate-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs"
                >
                  {submitting ? 'Publishing...' : 'Publish Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
