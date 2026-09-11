import React, { useState } from 'react';
import { X, BookMarked, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const CreateGuideModal = ({ batches, selectedBatchId, onClose, onCreated }) => {
  const { addToast } = useToast();
  const [batchId, setBatchId] = useState(selectedBatchId || (batches[0]?._id || ''));
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [teachingPlanSteps, setTeachingPlanSteps] = useState(['Introduction & Theory (15 min)', 'Live Hardware Demonstration (20 min)']);
  const [activities, setActivities] = useState(['Breadboard wiring setup', 'MicroPython code testing']);
  const [practicalTask, setPracticalTask] = useState('');
  const [homework, setHomework] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [mentorNotes, setMentorNotes] = useState('');
  const [isStudentVisible, setIsStudentVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addStep = () => setTeachingPlanSteps((p) => [...p, '']);
  const removeStep = (idx) => setTeachingPlanSteps((p) => p.filter((_, i) => i !== idx));
  const updateStep = (idx, val) => setTeachingPlanSteps((p) => {
    const copy = [...p];
    copy[idx] = val;
    return copy;
  });

  const addActivity = () => setActivities((p) => [...p, '']);
  const removeActivity = (idx) => setActivities((p) => p.filter((_, i) => i !== idx));
  const updateActivity = (idx, val) => setActivities((p) => {
    const copy = [...p];
    copy[idx] = val;
    return copy;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !objective.trim() || !batchId) {
      addToast('Topic, objective, and batch selection are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/mentor/offline/class-guides', {
        batchId,
        topic: topic.trim(),
        objective: objective.trim(),
        teachingPlan: teachingPlanSteps.filter(s => s.trim()),
        activities: activities.filter(a => a.trim()),
        practicalTask: practicalTask.trim(),
        homework: homework.trim(),
        expectedOutcome: expectedOutcome.trim(),
        mentorNotes: mentorNotes.trim(),
        isStudentVisible
      });

      addToast('Lesson plan guide saved successfully!', 'success');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Error saving class guide:', err);
      addToast(err.response?.data?.message || 'Failed to save guide', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <BookMarked size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Lesson Plan & Teaching Guide</h3>
              <p className="text-[11px] text-slate-500">Standardized offline lesson objectives, activities, and tasks</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                Lesson Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Introduction to Machine Learning Classifiers"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Pedagogical Objective *
            </label>
            <textarea
              rows="2"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. Students should understand supervised vs unsupervised learning and wire an IR sensor to trigger classification."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              required
            />
          </div>

          {/* Teaching Plan Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Teaching Plan & Timeline
              </label>
              <button
                type="button"
                onClick={addStep}
                className="text-[11px] text-slate-700 hover:text-slate-900 font-bold flex items-center space-x-1"
              >
                <Plus size={12} />
                <span>Add Step</span>
              </button>
            </div>
            {teachingPlanSteps.map((step, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(idx, e.target.value)}
                  placeholder={`Step ${idx + 1}...`}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Classroom Activities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Hands-on Lab Activities
              </label>
              <button
                type="button"
                onClick={addActivity}
                className="text-[11px] text-slate-700 hover:text-slate-900 font-bold flex items-center space-x-1"
              >
                <Plus size={12} />
                <span>Add Activity</span>
              </button>
            </div>
            {activities.map((act, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={act}
                  onChange={(e) => updateActivity(idx, e.target.value)}
                  placeholder={`Activity ${idx + 1}...`}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => removeActivity(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Practical Experiment / Task
              </label>
              <input
                type="text"
                value={practicalTask}
                onChange={(e) => setPracticalTask(e.target.value)}
                placeholder="e.g. Build an obstacle-avoiding bot chassis"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Expected Learning Outcome
              </label>
              <input
                type="text"
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                placeholder="e.g. Students can write sensor read loops"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Private Mentor Notes / Tips
            </label>
            <textarea
              rows="2"
              value={mentorNotes}
              onChange={(e) => setMentorNotes(e.target.value)}
              placeholder="e.g. Ensure all students connect 5V to breadboard positive rail before switching on DC supply..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isStudentVisible}
                onChange={(e) => setIsStudentVisible(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
              />
              <span className="text-xs text-slate-700 font-semibold">
                Make overview visible to students in this batch
              </span>
            </label>
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
              {submitting ? 'Saving...' : 'Save Lesson Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuideModal;
