import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { User, Mail, Phone, Lock, School, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentor/offline/profile');
      const d = res.data?.data || res.data;
      if (d) {
        setName(d.name || '');
        setMobileNumber(d.mobileNumber || d.studentMobile || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: name.trim(), mobileNumber: mobileNumber.trim() };
      if (password) payload.password = password;

      const res = await api.put('/mentor/offline/profile', payload);
      addToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
      if (res.data?.data) {
        setUser((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching mentor credentials..." />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
          <User size={15} />
          <span>Account Settings</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Mentor Profile & Institutional Credentials
        </h1>
        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
          Manage your contact information and access passwords for offline laboratory operations.
        </p>
      </div>

      <div className="card-modern rounded-xl p-6 space-y-6">
        {/* Read-only Institutional ID */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-slate-900" />
            <span>Floyd School Verified Mentor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block font-semibold">Registered Email</span>
              <span className="font-semibold text-slate-800 font-mono truncate">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block font-semibold">Security Role</span>
              <span className="font-bold text-slate-900 uppercase font-mono">{user?.role}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block font-semibold">Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] inline-block border border-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={15} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-slate-400" size={15} />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Update Password (Leave blank to keep unchanged)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={15} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={15} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-modern-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5"
            >
              <CheckCircle2 size={14} />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
