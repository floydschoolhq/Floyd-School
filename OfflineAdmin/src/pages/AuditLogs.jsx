import React, { useState, useEffect } from 'react';
import { History, Shield, Filter, Search, CheckCircle, AlertOctagon, Terminal } from 'lucide-react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, targetFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      if (targetFilter) params.targetType = targetFilter;

      const res = await api.get('/offline-admin/audit-logs', { params });
      setLogs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      className: 'font-mono text-xs text-slate-400',
      render: (l) => (
        <span>{new Date(l.createdAt).toLocaleString()}</span>
      )
    },
    {
      header: 'Administrative Actor',
      accessor: 'actorName',
      render: (l) => (
        <div>
          <p className="font-semibold text-slate-200">{l.actorName || 'System'}</p>
          <span className="text-[10px] font-mono text-slate-500 uppercase">{l.actorRole || 'admin'}</span>
        </div>
      )
    },
    {
      header: 'Action Identifier',
      accessor: 'action',
      className: 'font-mono text-xs font-bold text-blue-400',
      render: (l) => (
        <span className="bg-blue-950/60 text-blue-400 px-2 py-0.5 rounded border border-blue-800/40">
          {l.action}
        </span>
      )
    },
    {
      header: 'Target Entity',
      accessor: 'targetName',
      render: (l) => (
        <div className="text-xs">
          <p className="text-slate-200 font-medium">{l.targetName || l.targetType}</p>
          <span className="text-[10px] text-slate-500 font-mono">{l.targetType}</span>
        </div>
      )
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      className: 'font-mono text-xs text-slate-400',
      render: (l) => l.ipAddress || '127.0.0.1'
    },
    {
      header: 'Outcome',
      accessor: 'status',
      render: (l) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
          l.status === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {l.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Cryptographic Audit Trail</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable, append-only operational event ledger tracking all administrative actions and security state transitions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card p-4 flex flex-wrap items-center gap-3 bg-slate-900/60 border-slate-800">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
        >
          <option value="">All Action Types</option>
          <option value="CREATE_STUDENT">CREATE_STUDENT</option>
          <option value="BULK_IMPORT_STUDENTS">BULK_IMPORT_STUDENTS</option>
          <option value="REASSIGN_BATCH">REASSIGN_BATCH</option>
          <option value="CREATE_SCHOOL">CREATE_SCHOOL</option>
          <option value="CREATE_BATCH">CREATE_BATCH</option>
          <option value="CREATE_MENTOR">CREATE_MENTOR</option>
          <option value="CREATE_COORDINATOR">CREATE_COORDINATOR</option>
          <option value="SET_MAINTENANCE">SET_MAINTENANCE</option>
          <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
        </select>

        <select
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Target Types</option>
          <option value="Student">Student</option>
          <option value="School">School</option>
          <option value="Batch">Batch</option>
          <option value="Mentor">Mentor</option>
          <option value="System">System</option>
        </select>

        {(actionFilter || targetFilter) && (
          <button
            onClick={() => { setActionFilter(''); setTargetFilter(''); }}
            className="text-xs text-blue-400 hover:text-blue-300 ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={logs}
        searchKey="action"
        searchPlaceholder="Filter audit records by action or actor..."
        loading={loading}
      />
    </div>
  );
}
