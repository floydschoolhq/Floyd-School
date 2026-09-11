import React, { useState } from 'react';
import { X, Plus, Trash2, Award, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const CreateQuizModal = ({ batches, selectedBatchId, onClose, onCreated }) => {
  const { addToast } = useToast();
  const [batchId, setBatchId] = useState(selectedBatchId || (batches[0]?._id || ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [totalMarks, setTotalMarks] = useState(20);
  const [submitting, setSubmitting] = useState(false);

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0
    }
  ]);

  const handleAddQuestion = (type = 'mcq') => {
    if (type === 'tf') {
      setQuestions((prev) => [
        ...prev,
        {
          questionText: '',
          options: ['True', 'False'],
          correctOption: 0
        }
      ]);
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]);
    }
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) {
      addToast('Quiz must have at least one question', 'error');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].questionText = text;
      return copy;
    });
  };

  const handleOptionChange = (qIndex, optIndex, val) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options[optIndex] = val;
      return copy;
    });
  };

  const handleCorrectOptionChange = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].correctOption = optIndex;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !batchId) {
      addToast('Please enter title and select a batch', 'error');
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        addToast(`Question ${i + 1} text cannot be blank`, 'error');
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          addToast(`Option ${j + 1} of Question ${i + 1} cannot be blank`, 'error');
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      await api.post('/mentor/offline/quizzes', {
        title: title.trim(),
        description: description.trim(),
        batchId,
        timeLimitMinutes: Number(timeLimitMinutes),
        totalMarks: Number(totalMarks),
        questions,
        status: 'published'
      });

      addToast('Quiz created and published to students!', 'success');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Quiz creation error:', err);
      addToast(err.response?.data?.message || 'Failed to create quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Classroom Quiz</h3>
              <p className="text-[11px] text-slate-500">Design MCQ or True/False assessments for your offline batch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Batch *
              </label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                required
              >
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.school?.name || 'School'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Microcontroller Fundamentals Quiz"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Total Marks
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Instructions / Description
              </label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instructions for students taking this offline assessment..."
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          {/* Question Builder */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Questions ({questions.length})
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('mcq')}
                  className="btn-modern-secondary px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus size={12} />
                  <span>Add 4-Option MCQ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('tf')}
                  className="btn-modern-secondary px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus size={12} />
                  <span>Add True/False</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="card-modern rounded-xl p-4 bg-slate-50/50 space-y-3 relative border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Question {qIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Delete question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    placeholder={`e.g. Which pin delivers PWM output on an Arduino Uno?`}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Options & Correct Answer (Select radio for correct answer)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center space-x-2 p-2 rounded-lg border bg-white ${
                            q.correctOption === optIndex
                              ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                              : 'border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctOption === optIndex}
                            onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                            className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                            className="w-full text-xs font-medium text-slate-800 focus:outline-none bg-transparent"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-modern-secondary px-4 py-2 rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-modern-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
            >
              <span>{submitting ? 'Publishing...' : 'Publish Quiz'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;
