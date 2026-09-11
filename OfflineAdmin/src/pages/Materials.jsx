import React, { useState, useEffect } from 'react';
import { FolderArchive, Plus, Trash2, ExternalLink, FileText, Code, FileCode, CheckCircle, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batchId: '',
    moduleName: 'Curriculum & Hardware Guides',
    fileUrl: '',
    fileType: 'pdf'
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchMaterials();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/offline-admin/batches');
      setBatches(res.data.data || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/materials');
      setMaterials(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      batchId: batches[0]?._id || '',
      moduleName: 'Curriculum & Hardware Guides',
      fileUrl: '',
      fileType: 'pdf'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await api.post('/offline-admin/materials', formData);
      setModalOpen(false);
      fetchMaterials();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to upload material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this learning resource?')) return;
    try {
      await api.delete(`/offline-admin/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error('Failed to delete material:', err);
    }
  };

  const columns = [
    {
      header: 'Resource Title',
      accessor: 'title',
      render: (m) => (
        <div>
          <p className="font-semibold text-slate-100">{m.title}</p>
          <p className="text-[11px] text-slate-400">{m.description || m.moduleName}</p>
        </div>
      )
    },
    {
      header: 'Target Cohort & School',
      accessor: 'batch',
      render: (m) => (
        <div className="text-xs">
          <p className="text-slate-200 font-medium">{m.batch?.name || 'Cohort'}</p>
          <p className="text-[11px] text-blue-400 font-mono">{m.school?.name || m.batch?.code}</p>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'fileType',
      className: 'font-mono text-xs uppercase',
      render: (m) => (
        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-[10px]">
          {m.fileType || 'PDF'}
        </span>
      )
    },
    {
      header: 'Uploaded By',
      accessor: 'uploadedBy',
      render: (m) => (
        <span className="text-xs text-purple-400">{m.uploadedBy?.name || 'Admin'}</span>
      )
    },
    {
      header: 'Link',
      accessor: 'fileUrl',
      render: (m) => (
        <a
          href={m.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          <span>Open</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Central Learning Materials Repository</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Class guides, circuit diagrams, lab manuals, code snippets, and firmware files distributed to student cohorts.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Learning Resource</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={materials}
        searchKey="title"
        searchPlaceholder="Search materials by title or description..."
        loading={loading}
        actions={(m) => (
          <button
            onClick={() => handleDeleteMaterial(m._id)}
            title="Delete Resource"
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />

      {/* Modal: Upload Material */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="admin-card w-full max-w-lg p-6 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Upload Learning Resource
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Instantly visible under Learning Modules on the <strong>SchoolStudent</strong> and <strong>MentorSchool</strong> portals.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateMaterial} className="space-y-4">
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">File Type</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="code">Source Code (.py, .ino, .c)</option>
                    <option value="ppt">Presentation Slides</option>
                    <option value="doc">Text Document</option>
                    <option value="image">Schematic / Diagram</option>
                    <option value="link">Cloud / Drive Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Manual: Motor Driver L298N Wiring"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Module / Unit Category</label>
                <input
                  type="text"
                  placeholder="e.g. Embedded Microcontrollers"
                  value={formData.moduleName}
                  onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resource URL / Hosted Path *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... or /uploads/..."
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
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
                  {submitting ? 'Uploading...' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
