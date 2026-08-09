import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Award, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const { addToast } = useToast();

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/school-student/quizzes');
      setQuizzes(res.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setUserAnswers({});
    setResult(null);
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const answersArr = Object.entries(userAnswers).map(([qIdx, optIdx]) => ({
        questionIndex: Number(qIdx),
        selectedOption: optIdx
      }));

      const res = await api.post(`/school-student/quizzes/${activeQuiz._id}/submit`, {
        answers: answersArr
      });

      setResult(res.data.data);
      addToast('Quiz submitted successfully!', 'success');
      fetchQuizzes();
    } catch (error) {
      addToast(error.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-3d rounded-lg p-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Award size={20} className="text-slate-800" />
          Quizzes & Practical Evaluations
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Interactive evaluation quizzes created by your offline mentors.</p>
      </div>

      {activeQuiz ? (
        result ? (
          /* Result Summary */
          <div className="card-3d rounded-lg p-6 text-center space-y-4 max-w-md mx-auto">
            <CheckCircle2 size={48} className="mx-auto text-slate-800" />
            <h2 className="text-lg font-bold text-slate-900">Quiz Completed!</h2>
            <div className="bg-slate-50 border border-slate-300 rounded p-4 space-y-1">
              <p className="text-xs text-slate-500 font-bold uppercase">Your Score</p>
              <p className="text-3xl font-bold text-slate-900 font-mono">{result.score} / {activeQuiz.totalMarks}</p>
              <p className="text-xs font-semibold text-slate-700 font-mono">Percentage: {result.percentage}%</p>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="w-full py-2 btn-3d-dark rounded text-xs font-bold"
            >
              Back to Quiz List
            </button>
          </div>
        ) : (
          /* Active Quiz Runner */
          <div className="card-3d rounded-lg p-6 space-y-5 max-w-2xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">{activeQuiz.title}</h2>
                <p className="text-xs text-slate-500">Total Marks: {activeQuiz.totalMarks} • Time Limit: {activeQuiz.timeLimitMinutes} Mins</p>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="text-xs font-bold text-slate-600 underline">
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-50 border border-slate-300 rounded p-4 space-y-2.5 shadow-2xs">
                  <p className="text-xs font-bold text-slate-900">
                    Q{qIdx + 1}. {q.questionText}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                        className={`w-full text-left p-2.5 rounded border text-xs font-medium transition-all ${
                          userAnswers[qIdx] === optIdx
                            ? 'bg-slate-900 text-white font-bold border-slate-900'
                            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="w-full py-2.5 btn-3d-dark rounded text-xs font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Submitting Answers...' : 'Submit Final Answers'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )
      ) : (
        /* Quiz List */
        loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card-3d rounded-lg p-12 text-center text-slate-500 space-y-2">
            <Award size={36} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">No Active Quizzes</h3>
            <p className="text-xs text-slate-500">Quizzes published by your mentor will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="card-3d rounded-lg p-5 space-y-3">
                <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{quiz.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{quiz.description}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    quiz.isCompleted
                      ? 'bg-slate-100 text-slate-900 border-slate-300'
                      : 'bg-slate-200 text-slate-800 border-slate-400'
                  }`}>
                    {quiz.isCompleted ? 'COMPLETED' : 'AVAILABLE'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-mono">Questions: {quiz.questions?.length || 0} • Max: {quiz.totalMarks} Marks</span>
                  {quiz.isCompleted ? (
                    <span className="font-bold text-slate-900 font-mono">Score: {quiz.score} / {quiz.totalMarks} ({quiz.percentage}%)</span>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="btn-3d-dark py-1.5 px-3 rounded text-xs font-bold"
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Quizzes;
