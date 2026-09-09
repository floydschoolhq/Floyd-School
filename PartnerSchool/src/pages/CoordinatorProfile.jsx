import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Building2, UserCheck, Mail, Phone, Calendar, ShieldCheck, MapPin } from 'lucide-react';

const CoordinatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/partner-school/profile');
        setProfile(res.data.data);
      } catch (error) {
        console.error('Failed to load coordinator profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { user, school } = profile || {};

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
          <UserCheck size={16} />
          <span>Institutional Coordinator Credentials</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Coordinator Profile & School Authority
        </h1>
        <p className="text-slate-600 text-xs mt-0.5">
          Authorized administrative credentials for Floyd School STEM partnership management.
        </p>
      </div>

      {/* Coordinator Info */}
      <div className="card-modern rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
          Administrator Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Full Name</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{user?.name || 'Coordinator'}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Authorized Role</p>
            <span className="inline-flex items-center gap-1 mt-0.5 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
              <ShieldCheck size={11} />
              {user?.role || 'school_coordinator'}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Institutional Email</p>
            <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400" />
              <span>{user?.email}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Contact Mobile</p>
            <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 font-mono">
              <Phone size={13} className="text-slate-400" />
              <span>{user?.mobileNumber || '+91 98112 34567'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="card-modern rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
          Partner School Accreditation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">School Institution Name</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
              <Building2 size={14} className="text-slate-500" />
              <span>{school?.name || 'Partner School'}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Institutional School Code</p>
            <span className="inline-block mt-0.5 bg-slate-900 text-white font-mono font-bold px-2.5 py-0.5 rounded text-xs">
              {school?.code || 'SCH-001'}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">City / Location</p>
            <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span>{school?.city || 'Delhi NCR'}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Academic Session Year</p>
            <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 font-mono">
              <Calendar size={13} className="text-slate-400" />
              <span>{school?.academicYear || '2025-2026'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorProfile;
