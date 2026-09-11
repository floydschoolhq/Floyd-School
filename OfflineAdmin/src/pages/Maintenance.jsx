import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Globe, Users, Building2, Briefcase, Eye } from 'lucide-react';
import api from '../api/axios';

export default function Maintenance() {
  const [settings, setSettings] = useState({
    entirePlatform: { isActive: false, message: 'Offline platform is undergoing scheduled maintenance.', startTime: '', endTime: '' },
    schoolStudent: { isActive: false, message: 'Student Portal is undergoing scheduled maintenance.', startTime: '', endTime: '' },
    partnerSchool: { isActive: false, message: 'Partner School Portal is undergoing scheduled maintenance.', startTime: '', endTime: '' },
    mentorSchool: { isActive: false, message: 'Mentor Portal is undergoing scheduled maintenance.', startTime: '', endTime: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/maintenance');
      if (res.data.data) {
        setSettings({
          entirePlatform: { ...settings.entirePlatform, ...res.data.data.entirePlatform },
          schoolStudent: { ...settings.schoolStudent, ...res.data.data.schoolStudent },
          partnerSchool: { ...settings.partnerSchool, ...res.data.data.partnerSchool },
          mentorSchool: { ...settings.mentorSchool, ...res.data.data.mentorSchool }
        });
      }
    } catch (err) {
      console.error('Failed to load maintenance settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await api.put('/offline-admin/maintenance', settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save maintenance settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Ecosystem Maintenance Control</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure selective downtime windows, emergency lockdown states, and user-facing outage notices.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{saving ? 'Applying Policies...' : 'Save & Propagate Policies'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Maintenance configuration saved and broadcasted across real-time sockets.</span>
        </div>
      )}

      {/* Global Master Switch */}
      <div className="admin-card p-6 bg-slate-900/80 border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Entire Offline Ecosystem Switch</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Puts SchoolStudent, PartnerSchool, and MentorSchool into maintenance simultaneously.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.entirePlatform.isActive}
              onChange={(e) => setSettings({
                ...settings,
                entirePlatform: { ...settings.entirePlatform, isActive: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {settings.entirePlatform.isActive && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Global Outage Message</label>
              <input
                type="text"
                value={settings.entirePlatform.message}
                onChange={(e) => setSettings({
                  ...settings,
                  entirePlatform: { ...settings.entirePlatform, message: e.target.value }
                })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Individual Portal Scopes */}
      <div>
        <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-400 mb-3 uppercase">
          Portal-Specific Downtime Windows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SchoolStudent Portal Switch */}
          <div className="admin-card p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200">SchoolStudent (Port 5178)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.schoolStudent.isActive}
                  onChange={(e) => setSettings({
                    ...settings,
                    schoolStudent: { ...settings.schoolStudent, isActive: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Notice Message</label>
              <input
                type="text"
                value={settings.schoolStudent.message}
                onChange={(e) => setSettings({
                  ...settings,
                  schoolStudent: { ...settings.schoolStudent, message: e.target.value }
                })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* PartnerSchool Portal Switch */}
          <div className="admin-card p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-200">PartnerSchool (Port 5179)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.partnerSchool.isActive}
                  onChange={(e) => setSettings({
                    ...settings,
                    partnerSchool: { ...settings.partnerSchool, isActive: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Notice Message</label>
              <input
                type="text"
                value={settings.partnerSchool.message}
                onChange={(e) => setSettings({
                  ...settings,
                  partnerSchool: { ...settings.partnerSchool, message: e.target.value }
                })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* MentorSchool Portal Switch */}
          <div className="admin-card p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200">MentorSchool (Port 5180)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.mentorSchool.isActive}
                  onChange={(e) => setSettings({
                    ...settings,
                    mentorSchool: { ...settings.mentorSchool, isActive: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Notice Message</label>
              <input
                type="text"
                value={settings.mentorSchool.message}
                onChange={(e) => setSettings({
                  ...settings,
                  mentorSchool: { ...settings.mentorSchool, message: e.target.value }
                })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live End-User Preview */}
      <div className="admin-card p-6 bg-slate-950 border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
          <Eye className="w-4 h-4 text-blue-400" />
          <span>User Interface Preview (What students & faculty see during maintenance)</span>
        </div>

        <div className="p-8 rounded-lg bg-[#0F172A] border border-slate-800 text-center max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Floyd School System Maintenance</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {settings.entirePlatform.isActive
              ? settings.entirePlatform.message
              : 'Scheduled maintenance is currently in progress. Please check back shortly.'}
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Expected Availability: Within Scheduled Window
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
