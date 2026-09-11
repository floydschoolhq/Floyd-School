import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, CheckCircle2, Save, ShieldAlert } from 'lucide-react';
import api from '../api/axios';

export default function Settings() {
  const [formData, setFormData] = useState({
    platformName: 'Floyd School',
    currentAcademicYear: '2025-2026',
    lowAttendanceThreshold: 75,
    defaultBatchCapacity: 50,
    supportEmail: 'support@floydschool.in'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/settings');
      const s = res.data.data;
      if (s) {
        setFormData({
          platformName: s.platformName || 'Floyd School',
          currentAcademicYear: s.academicConfig?.currentAcademicYear || '2025-2026',
          lowAttendanceThreshold: s.academicConfig?.lowAttendanceThreshold || 75,
          defaultBatchCapacity: s.academicConfig?.defaultBatchCapacity || 50,
          supportEmail: s.globalConfig?.supportEmail || 'support@floydschool.in'
        });
      }
    } catch (err) {
      console.error('Failed to load platform settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');

    try {
      await api.put('/offline-admin/settings', {
        platformName: formData.platformName,
        academicConfig: {
          currentAcademicYear: formData.currentAcademicYear,
          lowAttendanceThreshold: parseInt(formData.lowAttendanceThreshold, 10),
          defaultBatchCapacity: parseInt(formData.defaultBatchCapacity, 10)
        },
        globalConfig: {
          supportEmail: formData.supportEmail
        }
      });
      setNotice('Settings updated successfully in database.');
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Platform System Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ecosystem academic cycles, alerting thresholds, and platform-wide defaults.
          </p>
        </div>
      </div>

      <div className="admin-card p-6 bg-slate-900/60 border-slate-800 max-w-xl">
        {notice && (
          <div className="mb-4 p-3 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Ecosystem Brand Title</label>
            <input
              type="text"
              required
              value={formData.platformName}
              onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Active Academic Year</label>
              <input
                type="text"
                required
                value={formData.currentAcademicYear}
                onChange={(e) => setFormData({ ...formData, currentAcademicYear: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Default Batch Capacity</label>
              <input
                type="number"
                required
                value={formData.defaultBatchCapacity}
                onChange={(e) => setFormData({ ...formData, defaultBatchCapacity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Low Attendance Warning Threshold (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={formData.lowAttendanceThreshold}
              onChange={(e) => setFormData({ ...formData, lowAttendanceThreshold: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Students falling below this attendance % trigger operational warnings on the dashboard.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">System Support Email</label>
            <input
              type="email"
              required
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2 px-5 text-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
