import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import CreateQuizModal from '../components/Quiz/CreateQuizModal';
import QuizResponsesModal from '../components/Quiz/QuizResponsesModal';
import {
  Award,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  Trash2,
  HelpCircle,
  Layers
} from 'lucide-react';

const Quizzes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId') || 'all';

  const { addToast } = useToast();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inspectQuizId, setInspectQuizId] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/mentor/offline/batches');
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBatchId !== 'all') params.batchId = selectedBatchId;

      const res = await api.get('/mentor/offline/quizzes', { params });
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      addToast('Failed to load quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz and its recorded responses?')) {
      return;
    }
    try {
      await api.delete(`/mentor/offline/quizzes/${quizId}`);
      addToast('Quiz deleted successfully', 'success');
      fetchQuizzes();
    } catch (err) {
      console.error('Delete quiz error:', err);
      addToast(err.response?.data?.message || 'Failed to delete quiz', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Award size={15} />
              <span>Offline Laboratory Assessments</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Quizzes & Anti-Cheating Evaluations
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Design timed MCQ and True/False assessments with server-side validation and view instant student scores.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Batch Filter */}
            <select
              value={selectedBatchId}
              onChange={(e) => {
                setSelectedBatchId(e.target.value);
                setSearchParams({ batchId: e.target.value });
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 shadow-2xs"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Create Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes List Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching published classroom quizzes..." />
      ) : quizzes.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center space-y-3">
          <Award size={36} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No quizzes published yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create an offline quiz for your students to test microcontroller principles, circuit wiring, or Python scripts.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
          >
            <Plus size={14} />
            <span>Create First Quiz</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((q) => (
            <div
              key={q._id}
              className="card-modern rounded-xl p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                      {q.batch?.code || 'OFFLINE'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">
                    {q.status}
                  </span>
                </div>

                {q.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {q.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                    <span className="font-black text-slate-800">{q.questionsCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Marks</span>
                    <span className="font-black text-slate-800">{q.totalMarks}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                    <span className="font-black text-slate-800">{q.timeLimitMinutes}m</span>
                  </div>
                </div>

                {/* Submissions Indicator */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Student Attempts:</span>
                  <span className="text-slate-900 font-bold">
                    {q.totalSubmissions} / {q.totalEnrolled} Submitted
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => setInspectQuizId(q._id)}
                  className="flex-1 btn-modern-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Eye size={13} />
                  <span>Inspect Responses</span>
                </button>
                <button
                  onClick={() => handleDeleteQuiz(q._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Quiz"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateQuizModal
          batches={batches}
          selectedBatchId={selectedBatchId !== 'all' ? selectedBatchId : ''}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchQuizzes}
        />
      )}

      {inspectQuizId && (
        <QuizResponsesModal
          quizId={inspectQuizId}
          onClose={() => setInspectQuizId(null)}
        />
      )}
    </div>
  );
};

export default Quizzes;
