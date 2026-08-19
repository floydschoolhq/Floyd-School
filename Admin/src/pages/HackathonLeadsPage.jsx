import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { 
  Trash2, 
  Eye, 
  Sparkles,
  Search,
  Filter,
  FileText
} from 'lucide-react';

const HackathonLeadsPage = () => {
  const [activeTab, setActiveTab] = useState('schools'); // 'schools' | 'participants'
  const [schoolLeads, setSchoolLeads] = useState([]);
  const [participantLeads, setParticipantLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [classGroupFilter, setClassGroupFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter, classGroupFilter]);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [activeTab, currentPage, statusFilter, classGroupFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(activeTab === 'participants' && classGroupFilter && { classGroup: classGroupFilter })
      });

      const endpoint = activeTab === 'schools' 
        ? `/admin/hackathon/school-leads?${queryParams}`
        : `/admin/hackathon/participant-leads?${queryParams}`;

      const response = await api.get(endpoint);
      const data = response.data;

      if (data.success) {
        if (activeTab === 'schools') {
          setSchoolLeads(data.data);
        } else {
          setParticipantLeads(data.data);
        }
        setTotalPages(data.pagination.pages);
      } else {
        toast.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Error loading submissions data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/hackathon/stats');
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
      const endpoint = activeTab === 'schools'
        ? `/admin/hackathon/school-lead/${leadId}/status`
        : `/admin/hackathon/participant-lead/${leadId}/status`;

      const response = await api.put(endpoint, { status: newStatus });
      if (response.data.success) {
        toast.success('Status updated');
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(prev => ({ ...prev, status: newStatus }));
        }
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const updateLeadNotes = async (leadId, notes) => {
    try {
      const endpoint = activeTab === 'schools'
        ? `/admin/hackathon/school-lead/${leadId}/notes`
        : `/admin/hackathon/participant-lead/${leadId}/notes`;

      const response = await api.put(endpoint, { notes });
      if (response.data.success) {
        toast.success('Notes saved');
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(prev => ({ ...prev, notes }));
        }
        fetchLeads();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Error saving notes');
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) {
      return;
    }

    try {
      const endpoint = activeTab === 'schools'
        ? `/admin/hackathon/school-lead/${leadId}`
        : `/admin/hackathon/participant-lead/${leadId}`;

      const response = await api.delete(endpoint);
      if (response.data.success) {
        toast.success('Lead deleted successfully');
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(null);
        }
        fetchLeads();
        fetchStats();
      } else {
        toast.error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Error deleting lead');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'contacted': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'in-progress': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'converted': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'closed': return 'bg-slate-100 text-slate-700 border border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const activeLeads = activeTab === 'schools' ? schoolLeads : participantLeads;

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-1">
            <Sparkles size={13} /> Floyd School Academics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hackathon Intelligence Hub</h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Governance panel for school host requests and student teams</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('schools')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schools'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            School Hosts
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'participants'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Participant Teams
          </button>
        </div>
      </div>

      {/* Unified Statistics Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Entries</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {activeTab === 'schools' ? stats.schools.total : stats.participants.total}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Actions</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {activeTab === 'schools'
                ? (stats.schools.statusBreakdown?.find(s => s._id === 'new')?.count || 0)
                : (stats.participants.statusBreakdown?.find(s => s._id === 'new')?.count || 0)
              }
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Converted</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {activeTab === 'schools'
                ? (stats.schools.statusBreakdown?.find(s => s._id === 'converted')?.count || 0)
                : (stats.participants.statusBreakdown?.find(s => s._id === 'converted')?.count || 0)
              }
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Leads</div>
            <div className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
              {activeTab === 'schools' ? stats.schools.today : stats.participants.today}
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {/* Status Select */}
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In Progress</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Class Group Select (Participants) */}
            {activeTab === 'participants' && (
              <div className="flex items-center gap-2">
                <Search size={15} className="text-slate-400" />
                <select
                  value={classGroupFilter}
                  onChange={(e) => setClassGroupFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value="">All Classes</option>
                  <option value="Class 7-8">Class 7-8</option>
                  <option value="Class 9-10">Class 9-10</option>
                  <option value="Class 11-12">Class 11-12</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setStatusFilter('');
              setClassGroupFilter('');
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {loading && activeLeads.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : activeLeads.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No submissions found</h3>
            <p className="text-slate-500 text-xs mt-1">There are no records matching your current filter set.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    {activeTab === 'schools' ? (
                      <>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">School</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Representative</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preferred Month</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Students</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Team Details</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Team Leader</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">School & City</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Class Group</th>
                      </>
                    )}
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activeLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/70 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      {activeTab === 'schools' ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{lead.schoolName}</div>
                            <div className="text-[11px] text-slate-500">{lead.city}, {lead.state}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800 text-xs">{lead.yourName}</div>
                            <div className="text-[10px] text-slate-400">{lead.designation}</div>
                            <div className="text-[10px] text-blue-600 font-bold mt-0.5">{lead.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-bold">
                            {lead.preferredMonth}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                            {lead.expectedStudents}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{lead.teamName}</div>
                            <div className="text-[11px] text-blue-600 font-bold">{lead.classGroup}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800 text-xs">{lead.teamLeaderName}</div>
                            <div className="text-[10px] text-slate-400">{lead.teamLeaderEmail}</div>
                            <div className="text-[10px] text-blue-600 font-bold mt-0.5">{lead.teamLeaderWhatsapp}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800 text-xs">{lead.schoolName}</div>
                            <div className="text-[10px] text-slate-500">{lead.city}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                            <span className="font-bold text-slate-800">{lead.teamLeaderClass}</span>
                            <span className="mx-1.5 text-slate-300">|</span>
                            <span>{lead.teamMembers} members</span>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> Inspect
                          </button>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg outline-none focus:border-blue-500"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            onClick={() => deleteLead(lead._id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination block */}
            {totalPages > 1 && (
              <div className="bg-slate-50 px-6 py-3.5 flex items-center justify-between border-t border-slate-200">
                <div className="text-xs font-bold text-slate-500">
                  PAGE {currentPage} OF {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    PREV
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Inspector Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-fadeIn my-8">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider mb-1.5 ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'schools' ? selectedLead.schoolName : selectedLead.teamName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Submitted on {formatDate(selectedLead.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-xl bg-slate-200/80 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-300 transition-all text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              {activeTab === 'schools' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.schoolAddress}</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City & State</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.city}, {selectedLead.state}</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Principal</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.principalName}</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Representative</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.yourName} ({selectedLead.designation})</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.email}</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone / WhatsApp</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.phone} / {selectedLead.whatsappNumber}</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Month</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.preferredMonth}</p></div>
                  <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Students</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.expectedStudents}</p></div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">School / City</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.schoolName} ({selectedLead.city})</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Group</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.classGroup}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Size</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.teamMembers} members</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prior Experience</h4><p className="text-xs font-bold text-slate-800 mt-1">{selectedLead.previousHackathon}</p></div>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-3">Team Roster</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">Leader (Member 1)</span>
                        <p className="font-bold text-slate-900 mt-0.5 text-xs">{selectedLead.teamLeaderName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Class: {selectedLead.teamLeaderClass}</p>
                        <p className="text-[11px] text-slate-500">WA: {selectedLead.teamLeaderWhatsapp}</p>
                        <p className="text-[11px] text-slate-500">Email: {selectedLead.teamLeaderEmail}</p>
                      </div>
                      {selectedLead.teammate2Name && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Teammate 2</span>
                          <p className="font-bold text-slate-900 mt-0.5 text-xs">{selectedLead.teammate2Name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Class: {selectedLead.teammate2Class}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Internal Remarks */}
              <div className="border-t border-slate-100 pt-5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Admin Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Enter private follow-up notes here..."
                  defaultValue={selectedLead.notes || ''}
                  onBlur={(e) => updateLeadNotes(selectedLead._id, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 text-xs font-medium text-slate-900 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500">Status:</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => updateLeadStatus(selectedLead._id, e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl outline-none focus:border-blue-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => deleteLead(selectedLead._id)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-colors border border-rose-200 cursor-pointer"
                >
                  Delete Entry
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonLeadsPage;
