import React, { useState } from 'react';
import { X, BookOpen, Paperclip, Calendar } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const CreateHomeworkModal = ({ batches, selectedBatchId, onClose, onCreated }) => {
  const { addToast } = useToast();
  const [batchId, setBatchId] = useState(selectedBatchId || (batches[0]?._id || ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !batchId || !dueDate) {
      addToast('Please enter title, select a batch, and provide a deadline date.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const attachments = [];
      if (attachmentUrl.trim()) {
        attachments.push({
          filename: 'Lab Project Resource',
          url: attachmentUrl.trim()
        });
      }

      await api.post('/mentor/offline/homework', {
        title: title.trim(),
        description: description.trim(),
        batchId,
        dueDate,
        maxMarks: Number(maxMarks),
        attachments,
        status: 'published'
      });

      addToast('Homework assignment published successfully!', 'success');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Error creating homework:', err);
      addToast(err.response?.data?.message || 'Failed to create homework', 'error');
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
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assign Classroom Homework</h3>
              <p className="text-[11px] text-slate-500">Create practical challenges & homework for your offline students</p>
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
              Homework / Assignment Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ultrasonic Radar Obstacle Avoidance Script"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Submission Deadline *
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Max Marks / Points
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Task Instructions & Requirements
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the hardware setup, code expectations, or project submission guidelines..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Reference Schematic / Material Link (Optional)
            </label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://drive.google.com/... or resource URL"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Buttons */}
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
              {submitting ? 'Assigning...' : 'Assign Homework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHomeworkModal;
