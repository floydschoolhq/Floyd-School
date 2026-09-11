import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Lock, Globe, Building2, Layers, User } from 'lucide-react';
import api from '../api/axios';

export default function Permissions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offline-admin/permissions');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load permissions matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const roles = data?.roles || [];
  const permissions = data?.permissions || [];

  const scopeBadgeMap = {
    GLOBAL: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: Globe },
    SCHOOL: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Building2 },
    BATCH: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Layers },
    SELF: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: User }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Role-Based Access Control (RBAC)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Centralized permission matrix and cryptographic boundary scoping across all four offline portals.
          </p>
        </div>
      </div>

      {/* Scope Architecture Card */}
      <div className="admin-card p-5 bg-slate-900/60 border-slate-800">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase mb-3">
          Hierarchical Role Boundary Scopes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roles.map(r => {
            const ScopeBadge = scopeBadgeMap[r.scope] || scopeBadgeMap.GLOBAL;
            const Icon = ScopeBadge.icon;
            return (
              <div key={r.id} className="p-3.5 rounded-md bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-200">{r.name}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${ScopeBadge.color}`}>
                    <Icon className="w-3 h-3" />
                    {r.scope}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <span className="font-semibold text-xs text-slate-200">System Capability Entitlements Matrix</span>
          <span className="text-slate-400 font-mono text-xs">Enforced at Node / Express Middleware Layer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Operation / Capability</th>
                <th className="text-center">Super Admin (GLOBAL)</th>
                <th className="text-center">School Coordinator (SCHOOL)</th>
                <th className="text-center">Mentor (BATCH)</th>
                <th className="text-center">Student (SELF)</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, idx) => {
                const hasAdmin = p.scopes.includes('GLOBAL');
                const hasCoord = p.scopes.includes('SCHOOL');
                const hasMentor = p.scopes.includes('BATCH');
                const hasStudent = p.scopes.includes('SELF');

                return (
                  <tr key={idx}>
                    <td>
                      <p className="font-medium text-slate-200">{p.label}</p>
                      <p className="text-[11px] font-mono text-slate-500">{p.key}</p>
                    </td>
                    <td className="text-center">
                      {hasAdmin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="text-center">
                      {hasCoord ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="text-center">
                      {hasMentor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="text-center">
                      {hasStudent ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-700">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
