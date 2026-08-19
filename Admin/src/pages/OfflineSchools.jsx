import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { School, Plus, CheckCircle, X, MapPin } from 'lucide-react';

const OfflineSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState('');
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <School className="text-blue-600" />
            Partner School Governance
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1">Manage offline school collaborations, student quotas, and lab partnerships.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Onboard Partner School</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((school) => (
            <div key={school._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg">
                    {school.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={12} /> {school.partnershipStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">{school.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                  <MapPin size={12} className="text-slate-400" /> {school.city}
                </p>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Offline Batches:</span>
                    <span className="font-bold text-slate-900">{school.activeBatchesCount || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Enrolled Students / Quota:</span>
                    <span className="font-bold text-blue-600">{school.enrolledCount || 3} / {school.studentQuota || 300}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contact Email:</span>
                    <span className="font-mono text-slate-600 text-[11px]">{school.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg relative shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Onboard New Partner School</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                  placeholder="e.g. Modern International Public School"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">School Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none uppercase"
                    placeholder="MIPS-01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City / State</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    placeholder="New Delhi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Coordinator / Principal Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                  placeholder="principal@school.edu"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 text-xs uppercase tracking-wider cursor-pointer mt-2"
              >
                Register Partner School
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineSchools;
