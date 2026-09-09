import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { BookOpen, Upload, CheckCircle2, Clock } from 'lucide-react';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/school-student/assignments');
      setAssignments(res.data.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitModal) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('submissionText', submissionText);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await api.post(`/school-student/assignments/${submitModal._id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      addToast('Homework submitted successfully!', 'success');
      setSubmitModal(null);
      setSubmissionText('');
      setSelectedFile(null);
      fetchAssignments();
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
          <BookOpen size={20} className="text-slate-800" />
          Homework & Practical Projects
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Submit code solutions, circuit photos, and lab project files for mentor review.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="card-3d rounded-lg p-12 text-center text-slate-500 space-y-2">
          <BookOpen size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">No Pending Homework</h3>
          <p className="text-xs text-slate-500">Homework assignments uploaded by your mentor will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((item) => (
            <div key={item._id} className="card-3d rounded-lg p-5 space-y-3">
              <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  item.isSubmitted 
                    ? 'bg-slate-100 text-slate-900 border-slate-300' 
                    : 'bg-slate-200 text-slate-800 border-slate-400'
                }`}>
                  {item.isSubmitted ? 'SUBMITTED' : 'PENDING'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                <div className="space-y-1 text-slate-500 font-mono">
                  <p>Due Date: <strong className="text-slate-800">{new Date(item.dueDate).toLocaleDateString()}</strong> • Max Marks: {item.maxMarks}</p>
                  {item.submission?.marksObtained !== undefined && (
                    <p className="text-slate-900 font-bold">Marks Obtained: {item.submission.marksObtained} / {item.maxMarks} • Feedback: {item.submission.feedback || 'Good work'}</p>
                  )}
                </div>

                <button
                  onClick={() => setSubmitModal(item)}
                  className="btn-3d-dark py-1.5 px-3 rounded text-xs font-bold shrink-0 self-start sm:self-auto"
                >
                  {item.isSubmitted ? 'Resubmit Project File' : 'Submit Homework File'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {submitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md relative shadow-lg space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Submit Homework</h3>
              <p className="text-xs text-slate-500">{submitModal.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Code Explanation</label>
                <textarea
                  rows={3}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Describe your solution or hardware circuit implementation..."
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach Project File (ZIP / PDF / Code)</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  className="flex-1 py-2 btn-3d-light rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 btn-3d-dark rounded text-xs font-bold disabled:opacity-50"
                >
                  {submitting ? 'Uploading...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
