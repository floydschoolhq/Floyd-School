import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import UploadMaterialModal from '../components/Material/UploadMaterialModal';
import {
  FolderDown,
  Plus,
  FileText,
  FileCode,
  Presentation,
  Image,
  ExternalLink,
  Download,
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';

const Materials = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId') || 'all';

  const { addToast } = useToast();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/mentor/offline/batches');
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBatchId !== 'all') params.batchId = selectedBatchId;

      const res = await api.get('/mentor/offline/materials', { params });
      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
      addToast('Failed to load class materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Delete this classroom material?')) return;
    try {
      await api.delete(`/mentor/offline/materials/${id}`);
      addToast('Material removed from batch library', 'success');
      fetchMaterials();
    } catch (err) {
      console.error('Error deleting material:', err);
      addToast('Failed to delete material', 'error');
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'code': return <FileCode size={18} className="text-blue-500" />;
      case 'ppt': return <Presentation size={18} className="text-orange-500" />;
      case 'image': return <Image size={18} className="text-emerald-500" />;
      case 'link': return <ExternalLink size={18} className="text-purple-500" />;
      default: return <FileText size={18} className="text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <FolderDown size={15} />
              <span>Offline Laboratory Repository</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Class Materials & Lab Resources
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Upload circuit schematics, MicroPython scripts, lab PDF worksheets, and presentation slides for your cohorts.
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
              onClick={() => setShowUploadModal(true)}
              className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Upload Material</span>
            </button>
          </div>
        </div>
      </div>

      {/* Materials List */}
      {loading ? (
        <LoadingSpinner text="Fetching cohort lab materials..." />
      ) : materials.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center space-y-3">
          <FolderDown size={36} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No materials uploaded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Share pinout cheat-sheets, code examples, or PDF slides with your classroom batch.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
          >
            <Plus size={14} />
            <span>Upload First Resource</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((m) => (
            <div
              key={m._id}
              className="card-modern rounded-xl p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                      {getFileIcon(m.fileType)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block truncate">
                        {m.batch?.code || 'OFFLINE'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate leading-snug">
                        {m.title}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {m.fileType}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {m.moduleName || 'Classroom Lab Resource'}
                </p>

                {m.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Batch: {m.batch?.name || 'Offline Cohort'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-modern-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <Download size={12} />
                  <span>Access / Download</span>
                </a>
                <button
                  onClick={() => handleDeleteMaterial(m._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Material"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadMaterialModal
          batches={batches}
          selectedBatchId={selectedBatchId !== 'all' ? selectedBatchId : ''}
          onClose={() => setShowUploadModal(false)}
          onUploaded={fetchMaterials}
        />
      )}
    </div>
  );
};

export default Materials;
