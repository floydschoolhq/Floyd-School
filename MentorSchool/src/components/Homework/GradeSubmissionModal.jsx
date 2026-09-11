import React, { useState } from 'react';
import { X, CheckCircle2, Download, FileText, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const GradeSubmissionModal = ({ assignment, submission, onClose, onGraded }) => {
  const { addToast } = useToast();
  const [marks, setMarks] = useState(
    submission?.marksObtained !== undefined ? submission.marksObtained : ''
  );
  const [feedback, setFeedback] = useState(submission?.feedback || '');
  const [submitting, setSubmitting] = useState(false);

  if (!submission) return null;

  const maxMarks = assignment?.maxMarks || 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (marks === '' || Number(marks) < 0 || Number(marks) > maxMarks) {
      addToast(`Please enter valid marks between 0 and ${maxMarks}`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/mentor/offline/homework/${assignment._id}/grade`, {
        studentId: submission.student?._id,
        marksObtained: Number(marks),
        feedback: feedback.trim() || 'Well done on completing the offline lab assignment!'
      });

      addToast('Student submission evaluated and feedback sent!', 'success');
      onGraded();
      onClose();
    } catch (err) {
      console.error('Error grading submission:', err);
      addToast(err.response?.data?.message || 'Failed to record grade', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Grade Submission: {submission.student?.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              Roll: {submission.student?.offlineRollNo} • {assignment?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Submission content details */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Student Project Submission
            </span>

            {submission.content ? (
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {submission.content}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">No text description provided.</p>
            )}

            {submission.fileUrl && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-mono">
                  <FileText size={13} className="text-slate-500" />
                  <span className="truncate max-w-[200px]">Attached Project File</span>
                </div>
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modern-secondary px-2.5 py-1 rounded text-[11px] font-semibold flex items-center space-x-1"
                >
                  <Download size={11} />
                  <span>Download File</span>
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Marks Awarded (Out of {maxMarks}) *
            </label>
            <input
              type="number"
              min="0"
              max={maxMarks}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder={`e.g. 95`}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Constructive Feedback & Mentorship Advice
            </label>
            <textarea
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Excellent circuit wiring! Next time optimize your loop delay for smoother sensor readings."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
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
              className="btn-modern-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <CheckCircle2 size={13} />
              <span>{submitting ? 'Saving Grade...' : 'Save & Grade Submission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;
