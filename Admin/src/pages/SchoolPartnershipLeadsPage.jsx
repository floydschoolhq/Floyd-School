import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { Building2, Trash2 } from 'lucide-react';

const SchoolPartnershipLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [currentPage, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      });

      const response = await api.get(`/admin/school-partnership/leads?${queryParams}`);
      const data = response.data;

      if (data.success) {
        setLeads(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        toast.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/school-partnership/stats');
      const data = response.data;

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const response = await api.put(`/admin/school-partnership/lead/${leadId}/status`, { status: newStatus });
      
      if (response.data.success) {
        toast.success('Lead status updated');
        fetchLeads();
        fetchStats();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Error updating status');
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm('Delete this lead?')) return;
    
    try {
      const response = await api.delete(`/admin/school-partnership/lead/${leadId}`);
      
      if (response.data.success) {
        toast.success('Lead deleted');
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      toast.error('Error deleting lead');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-50 text-blue-700 border border-blue-200',
      contacted: 'bg-amber-50 text-amber-700 border border-amber-200',
      'in-progress': 'bg-purple-50 text-purple-700 border border-purple-200',
      converted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      closed: 'bg-slate-100 text-slate-700 border border-slate-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="text-blue-600" />
            School Partnership Leads
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">Partnership and institutional collaboration requests</p>
        </div>
      </header>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.total || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{stats.statusBreakdown?.find(s => s._id === 'new')?.count || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Converted</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{stats.statusBreakdown?.find(s => s._id === 'converted')?.count || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</div>
            <div className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">{stats.todayLeads || 0}</div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer outline-none"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in-progress">In Progress</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">School</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 text-slate-500">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-3.5 text-slate-900 font-bold">{lead.schoolName}</td>
                  <td className="px-4 py-3.5 text-slate-700">
                    <div>{lead.contactPerson}</div>
                    <div className="text-[10px] text-slate-400">{lead.designation}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">{lead.phone}</td>
                  <td className="px-4 py-3.5 text-slate-500">{lead.city}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No school partnership leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolPartnershipLeadsPage;