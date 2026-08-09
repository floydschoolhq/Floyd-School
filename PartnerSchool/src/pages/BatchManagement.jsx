import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { BookOpen, Plus, Users, Calendar, MapPin, Clock, X } from 'lucide-react';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    subject: 'Robotics & STEM Lab',
    scheduleDays: 'Mon, Wed',
    scheduleTime: '10:00 AM - 11:30 AM',
    roomVenue: 'Lab 101'
  });

  const fetchBatches = async () => {
    try {
      const res = await api.get('/partner-school/batches');
      setBatches(res.data.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const daysArr = formData.scheduleDays.split(',').map(s => s.trim());
      await api.post('/partner-school/batches', {
        ...formData,
        scheduleDays: daysArr
      });

      addToast('Offline Batch configured successfully!', 'success');
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        subject: 'Robotics & STEM Lab',
        scheduleDays: 'Mon, Wed',
        scheduleTime: '10:00 AM - 11:30 AM',
        roomVenue: 'Lab 101'
      });
      fetchBatches();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create batch', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & New Batch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-3d rounded-lg p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen size={20} className="text-slate-800" />
            Offline Batch Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage active classroom sections, schedules, and mentor assignments.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-3d-dark px-3 py-2 rounded text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Configure New Batch</span>
        </button>
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : batches.length === 0 ? (
        <div className="card-3d rounded-lg p-12 text-center text-slate-500 text-xs">
          No offline classroom batches configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div key={batch._id} className="card-3d rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{batch.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Code: {batch.code}</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded">
                  {batch.enrolledCount || 0} Enrolled
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <BookOpen size={14} className="text-slate-500" />
                  <span>Subject: <strong className="text-slate-900">{batch.subject}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar size={14} className="text-slate-500" />
                  <span>Days: <strong className="text-slate-900">{batch.scheduleDays ? batch.scheduleDays.join(', ') : 'Mon, Wed'}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-slate-500" />
                  <span>Time: <strong className="text-slate-900">{batch.scheduleTime}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-slate-500" />
                  <span>Room / Venue: <strong className="text-slate-900">{batch.roomVenue}</strong></span>
                </div>

                <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                  <Users size={14} className="text-slate-500" />
                  <span>Mentor: <strong className="text-slate-900">{batch.mentorId?.name || 'Assigned Mentor'}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-lg relative shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Configure New Offline Batch</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Section Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Grade 10 AI & Robotics Section A"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="BATCH-101"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Robotics & STEM Lab"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Days</label>
                  <input
                    type="text"
                    value={formData.scheduleDays}
                    onChange={(e) => setFormData({ ...formData, scheduleDays: e.target.value })}
                    placeholder="Mon, Wed"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timing</label>
                  <input
                    type="text"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                    placeholder="10:00 AM - 11:30 AM"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room / Venue</label>
                  <input
                    type="text"
                    value={formData.roomVenue}
                    onChange={(e) => setFormData({ ...formData, roomVenue: e.target.value })}
                    placeholder="Lab 101"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 btn-3d-dark rounded text-xs font-bold transition-all disabled:opacity-50 mt-2"
              >
                {submitting ? 'Creating Batch...' : 'Create Batch Section'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;
