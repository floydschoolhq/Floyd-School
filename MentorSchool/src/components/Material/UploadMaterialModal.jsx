import React, { useState } from 'react';
import { X, FolderUp, UploadCloud, Link as LinkIcon } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const UploadMaterialModal = ({ batches, selectedBatchId, onClose, onUploaded }) => {
  const { addToast } = useToast();
  const [batchId, setBatchId] = useState(selectedBatchId || (batches[0]?._id || ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleName, setModuleName] = useState('General Lab Materials');
  const [uploadType, setUploadType] = useState('file'); // 'file' | 'link'
  const [file, setFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !batchId) {
      addToast('Please enter title and select a batch', 'error');
      return;
    }

    if (uploadType === 'file' && !file) {
      addToast('Please select a file to upload', 'error');
      return;
    }

    if (uploadType === 'link' && !linkUrl.trim()) {
      addToast('Please enter a valid URL link', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (uploadType === 'file') {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('batchId', batchId);
        formData.append('moduleName', moduleName.trim());
        formData.append('file', file);

        await api.post('/mentor/offline/materials', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/mentor/offline/materials', {
          title: title.trim(),
          description: description.trim(),
          batchId,
          moduleName: moduleName.trim(),
          linkUrl: linkUrl.trim(),
          fileType: 'link'
        });
      }

      addToast('Classroom material published for batch students!', 'success');
      onUploaded();
      onClose();
    } catch (err) {
      console.error('Error uploading material:', err);
      addToast(err.response?.data?.message || 'Failed to upload material', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <FolderUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Classroom Material</h3>
              <p className="text-[11px] text-slate-500">Publish PDFs, slides, schematics, or code files for your batch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              Material Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Servo Motor Wiring Schematic & Cheat Sheet"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Curriculum Module / Topic
            </label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="e.g. Module 3: Actuators and Motors"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                uploadType === 'file' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <UploadCloud size={13} />
              <span>Upload Document / Code</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadType('link')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                uploadType === 'link' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <LinkIcon size={13} />
              <span>Cloud Drive / Web Link</span>
            </button>
          </div>

          {uploadType === 'file' ? (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select File (PDF, PPT, DOC, Code, Images - Max 10MB)
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Resource URL *
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://drive.google.com/file/... or GitHub repo"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description / Mentor Notes
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes on how students should use this material during their offline lab..."
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
              className="btn-modern-primary px-5 py-2 rounded-xl text-xs font-bold"
            >
              {submitting ? 'Publishing...' : 'Publish Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterialModal;
