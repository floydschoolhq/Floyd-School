import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StudentIDCard from '../components/StudentIDCard';
import { User, Shield, Lock, Phone, Save, CreditCard } from 'lucide-react';

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    offlineRollNo: '',
    schoolName: '',
    batchName: '',
    grade: '',
    section: '',
    studentMobile: '',
    fatherName: '',
    fatherMobile: '',
    password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/school-student/profile');
        const s = res.data.data;
        if (s) {
          setFormData({
            name: s.name || '',
            email: s.email || '',
            studentId: s.studentId || '',
            offlineRollNo: s.offlineRollNo || 'Pending Allotment',
            schoolName: s.school?.name || s.schoolNameManual || 'Partner School',
            batchName: s.batch?.name || 'Classroom Section',
            grade: s.grade || 'Grade 10',
            section: s.section || 'A',
            studentMobile: s.studentMobile || s.mobileNumber || '',
            fatherName: s.fatherName || '',
            fatherMobile: s.fatherMobile || '',
            password: ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        studentMobile: formData.studentMobile,
        fatherMobile: formData.fatherMobile,
        fatherName: formData.fatherName
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      await api.put('/school-student/profile', payload);
      addToast('Profile updated successfully!', 'success');
      setFormData(prev => ({ ...prev, password: '' }));
      if (setUser && user) {
        setUser({ ...user, ...payload });
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="card-modern rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User size={20} className="text-slate-800" />
            Student Academic Profile
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage your contact information and access your official student ID pass.</p>
        </div>

        <button
          onClick={() => setShowIdCard(true)}
          className="btn-modern-primary px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <CreditCard size={15} />
          <span>View Student ID Card</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="card-modern rounded-xl p-6 space-y-5">
        {/* Read-Only Academic Section (Protected by system) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Shield size={14} />
            <span>Institutional Academic Credentials (Locked)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {formData.studentId && (
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Floyd Student ID</p>
                <p className="font-mono font-bold text-blue-600 text-sm mt-0.5">{formData.studentId}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Primary Roll Number</p>
              <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{formData.offlineRollNo}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Partner School</p>
              <p className="font-bold text-slate-900 mt-0.5">{formData.schoolName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Class & Section</p>
              <p className="font-bold text-slate-900 mt-0.5">{formData.grade} (Section {formData.section})</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Allotted Batch</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{formData.batchName}</p>
            </div>
          </div>
        </div>

        {/* Editable Contact Section */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Student Contact & Guardian Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="tel"
                  value={formData.studentMobile}
                  onChange={e => setFormData({ ...formData, studentMobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Full Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="Father / Guardian Name"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="tel"
                  value={formData.fatherMobile}
                  onChange={e => setFormData({ ...formData, fatherMobile: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Update Password (Optional)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 btn-modern-primary rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>

      {/* Student ID Card Modal */}
      {showIdCard && (
        <StudentIDCard
          student={formData}
          onClose={() => setShowIdCard(false)}
        />
      )}
    </div>
  );
};

export default StudentProfile;
