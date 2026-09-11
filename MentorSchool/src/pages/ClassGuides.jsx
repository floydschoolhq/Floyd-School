import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import CreateGuideModal from '../components/ClassGuide/CreateGuideModal';
import {
  BookMarked,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers,
  Eye,
  Lock
} from 'lucide-react';

const ClassGuides = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId') || 'all';

  const { addToast } = useToast();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/mentor/offline/batches');
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error('Error loading batches:', err);
    }
  };

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBatchId !== 'all') params.batchId = selectedBatchId;

      const res = await api.get('/mentor/offline/class-guides', { params });
      setGuides(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching class guides:', err);
      addToast('Failed to load lesson plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuide = async (id) => {
    if (!window.confirm('Delete this lesson plan guide?')) return;
    try {
      await api.delete(`/mentor/offline/class-guides/${id}`);
      addToast('Lesson plan deleted', 'success');
      fetchGuides();
    } catch (err) {
      console.error('Delete error:', err);
      addToast('Failed to delete guide', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <BookMarked size={15} />
              <span>Standardized Offline Curricula</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Class Guides & Teaching Plans
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Standardized physical lesson outlines, pedagogical objectives, laboratory activities, and expected learning outcomes.
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
              <span>Create Lesson Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guides List */}
      {loading ? (
        <LoadingSpinner text="Fetching mentor lesson guides..." />
      ) : guides.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center space-y-3">
          <BookMarked size={36} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No lesson plans created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Prepare your teaching outline, experiment steps, and expected outcomes to standardize classroom delivery.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
          >
            <Plus size={14} />
            <span>Create Lesson Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guides.map((g) => (
            <div
              key={g._id}
              className="card-modern rounded-xl p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                      {g.batch?.code || 'OFFLINE'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {g.topic}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center space-x-1 ${
                    g.isStudentVisible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {g.isStudentVisible ? <Eye size={10} /> : <Lock size={10} />}
                    <span>{g.isStudentVisible ? 'Student Visible' : 'Mentor Only'}</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Objective</span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {g.objective}
                  </p>
                </div>

                {g.teachingPlan?.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Teaching Timeline</span>
                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                      {g.teachingPlan.map((step, idx) => (
                        <li key={idx} className="truncate">{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {g.activities?.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Lab Activities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {g.activities.map((act, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {g.practicalTask && (
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Experiment: </span>
                    <span>{g.practicalTask}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Batch: {g.batch?.name || 'Cohort'} • {new Date(g.sessionDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteGuide(g._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Guide"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateGuideModal
          batches={batches}
          selectedBatchId={selectedBatchId !== 'all' ? selectedBatchId : ''}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchGuides}
        />
      )}
    </div>
  );
};

export default ClassGuides;
