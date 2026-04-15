import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../api/axios';

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

      const response = await adminApi.get(`/admin/school-partnership/leads?${queryParams}`);
      const data = response.data;

      if (data.success) {
        setLeads(data.data);
        setTotalPages(data.pagination.pages);
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
      const response = await adminApi.get('/admin/school-partnership/stats');
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
      const response = await adminApi.put(`/admin/school-partnership/lead/${leadId}/status`, { status: newStatus });
      
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
      const response = await adminApi.delete(`/admin/school-partnership/lead/${leadId}`);
      
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
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">School Partnership Leads</h1>
        <p className="text-slate-400 mb-8">Partnership requests from schools</p>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.total || 0}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.statusBreakdown?.find(s => s._id === 'new')?.count || 0}</div>
              <div className="text-xs text-slate-400">New</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{stats.statusBreakdown?.find(s => s._id === 'converted')?.count || 0}</div>
              <div className="text-xs text-slate-400">Converted</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400">{stats.todayLeads || 0}</div>
              <div className="text-xs text-slate-400">Today</div>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">School</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">City</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Domain</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-sm text-slate-300">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-white">{lead.schoolName}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      <div>{lead.contactPerson}</div>
                      <div className="text-xs text-slate-500">{lead.designation}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{lead.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{lead.city || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{lead.domain || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{lead.approxStudents || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        className="bg-slate-700 text-white text-xs px-2 py-1 rounded mr-2"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button onClick={() => deleteLead(lead._id)} className="text-red-400 text-xs ml-2 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-700 flex justify-between items-center">
              <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-slate-700 rounded text-sm disabled:opacity-50">Prev</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-slate-700 rounded text-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>

        {!loading && leads.length === 0 && (
          <div className="bg-slate-800 rounded-lg p-12 text-center">
            <p className="text-slate-400">No partnership requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolPartnershipLeadsPage;