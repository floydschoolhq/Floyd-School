import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import CreateHomeworkModal from '../components/Homework/CreateHomeworkModal';
import GradeSubmissionModal from '../components/Homework/GradeSubmissionModal';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  Trash2,
  Users,
  Eye,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const Homework = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId') || 'all';

  const { addToast } = useToast();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inspectAssignment, setInspectAssignment] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/mentor/offline/batches');
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const fetchHomework = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBatchId !== 'all') params.batchId = selectedBatchId;

      const res = await api.get('/mentor/offline/homework', { params });
      setAssignments(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching homework:', err);
      addToast('Failed to load homework assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setInspectAssignment(assignment);
    setLoadingSubmissions(true);
    try {
      const res = await api.get(`/mentor/offline/homework/${assignment._id}/submissions`);
      setSubmissionsList(res.data?.data?.submissions || []);
    } catch (err) {
      console.error('Error loading submissions:', err);
      addToast('Failed to fetch submissions', 'error');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleDeleteHomework = async (id) => {
    if (!window.confirm('Are you sure you want to delete this homework assignment?')) return;
    try {
      await api.delete(`/mentor/offline/homework/${id}`);
      addToast('Homework assignment removed', 'success');
      fetchHomework();
    } catch (err) {
      console.error('Delete error:', err);
      addToast('Failed to delete assignment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen size={15} />
              <span>Offline Laboratory Challenges</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Homework & Hands-on Project Submissions
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Assign offline coding and circuit hardware tasks, review project files, and submit qualitative marks and feedback.
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
              <span>Assign Homework</span>
            </button>
          </div>
        </div>
      </div>

      {/* Homework List */}
      {loading ? (
        <LoadingSpinner text="Fetching offline homework tasks..." />
      ) : assignments.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center space-y-3">
          <BookOpen size={36} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No homework tasks assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Assign your first robotics challenge, circuit assembly homework, or Python coding task.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
          >
            <Plus size={14} />
            <span>Create Homework</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="card-modern rounded-xl p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                      {a.batch?.code || 'OFFLINE'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {a.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase border border-slate-200">
                    {a.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {a.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1">
                    <Clock size={13} className="text-slate-400" />
                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                  </div>
                  <span className="font-bold text-slate-800">Max {a.maxMarks} Pts</span>
                </div>

                {/* Submissions Badge */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Submissions:</span>
                  <span className="text-slate-900 font-bold">
                    {a.totalSubmissions} / {a.totalEnrolled} ({a.gradedSubmissions} Graded)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => handleOpenSubmissions(a)}
                  className="flex-1 btn-modern-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Eye size={13} />
                  <span>Review Submissions</span>
                </button>
                <button
                  onClick={() => handleDeleteHomework(a._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Homework"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions Review Modal */}
      {inspectAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Submissions: {inspectAssignment.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Batch: {inspectAssignment.batch?.name || 'Offline Cohort'} • Max Marks: {inspectAssignment.maxMarks}
                </p>
              </div>
              <button
                onClick={() => setInspectAssignment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
              {loadingSubmissions ? (
                <LoadingSpinner text="Fetching student project submissions..." />
              ) : submissionsList.length === 0 ? (
                <p className="text-xs text-slate-500 py-10 text-center">
                  No students have submitted project files for this task yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {submissionsList.map((s) => (
                    <div key={s._id} className="py-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900">{s.student?.name}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {s.student?.offlineRollNo || 'Pending'}
                          </span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                            s.status === 'Graded' || s.status === 'graded'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Submitted on {new Date(s.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right text-xs">
                          <span className="font-bold text-slate-900 block">
                            {s.marksObtained !== undefined ? `${s.marksObtained} / ${inspectAssignment.maxMarks}` : 'Not Graded'}
                          </span>
                        </div>
                        <button
                          onClick={() => setGradingSubmission(s)}
                          className="btn-modern-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          Grade / Feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInspectAssignment(null)}
                className="btn-modern-secondary px-4 py-1.5 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <GradeSubmissionModal
          assignment={inspectAssignment}
          submission={gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          onGraded={() => {
            handleOpenSubmissions(inspectAssignment);
            fetchHomework();
          }}
        />
      )}

      {/* Create Homework Modal */}
      {showCreateModal && (
        <CreateHomeworkModal
          batches={batches}
          selectedBatchId={selectedBatchId !== 'all' ? selectedBatchId : ''}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchHomework}
        />
      )}
    </div>
  );
};

export default Homework;
