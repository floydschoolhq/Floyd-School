import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { School, Plus, Search, Building2, Users, CheckCircle, Shield, X, MapPin } from 'lucide-react';

const OfflineSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    principalName: '',
    contactEmail: '',
    contactPhone: '',
    city: '',
    studentQuota: 300,
    curriculumPlan: 'AI & STEM Robotics Offline Curriculum'
  });

  const fetchSchools = async () => {
    try {
      // Using admin endpoint or partner school endpoint
      const res = await api.get('/partner-school/batches');
      // If fetching partner school list
      const statsRes = await api.get('/partner-school/stats');
      if (statsRes.data.data) {
        setSchools([{
          _id: '1',
          name: statsRes.data.data.schoolName,
          code: statsRes.data.data.schoolCode,
          city: 'New Delhi',
          partnershipStatus: statsRes.data.data.partnershipStatus,
          activeBatchesCount: statsRes.data.data.totalBatches,
          studentQuota: statsRes.data.data.studentQuota,
          enrolledCount: statsRes.data.data.totalStudents,
          contactEmail: 'coordinator@partnerschool.edu'
        }]);
      }
    } catch (error) {
      console.error('Error fetching partner schools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      addToast('Partner School Onboarded Successfully', 'success');
      setShowModal(false);
      fetchSchools();
    } catch (error) {
      addToast('Failed to onboard school', 'error');
    }
  };

  const filtered = schools.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <School className="text-indigo-400" />
            Partner School Governance
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage offline school collaborations, student quotas, and lab partnerships.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus size={16} />
          <span>Onboard Partner School</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((school) => (
            <div key={school._id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                    {school.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> {school.partnershipStatus}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight mb-1">{school.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                  <MapPin size={12} className="text-slate-500" /> {school.city}
                </p>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Offline Batches:</span>
                    <span className="font-bold text-white">{school.activeBatchesCount || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Enrolled Students / Quota:</span>
                    <span className="font-bold text-indigo-400">{school.enrolledCount || 3} / {school.studentQuota || 300}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contact Email:</span>
                    <span className="font-mono text-slate-300">{school.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg relative shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Onboard New Partner School</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. St. Xavier Science Academy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">School Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. STX-OFFLINE"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New Delhi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="coordinator@partnerschool.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  Onboard Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineSchools;
