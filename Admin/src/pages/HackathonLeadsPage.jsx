import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { 
  Calendar, 
  Users, 
  Target, 
  Check, 
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
        toast.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching hackathon leads:', error);
      toast.error('Error fetching leads');
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
        toast.success('Lead status updated');
        
        // Update local state if modal is open
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(prev => ({ ...prev, status: newStatus }));
        }

        fetchLeads();
        fetchStats();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const updateLeadNotes = async (leadId, notes) => {
    try {
      const endpoint = activeTab === 'schools'
        ? `/admin/hackathon/school-lead/${leadId}/status`
        : `/admin/hackathon/participant-lead/${leadId}/status`;

      const response = await api.put(endpoint, { notes });
      if (response.data.success) {
        toast.success('Notes saved');
        
        // Update local state if modal is open
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
      case 'new': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'in-progress': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'converted': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'closed': return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const activeLeads = activeTab === 'schools' ? schoolLeads : participantLeads;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-['Outfit']">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-xs mb-1">
              <Sparkles size={14} /> Floyd School Academics
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Hackathon Intelligence Hub</h1>
            <p className="text-slate-400 text-sm mt-0.5">Governance panel for school host requests and student teams</p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'schools'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              School Hosts
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'participants'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Participant Teams
            </button>
          </div>
        </div>

        {/* Unified Statistics Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Entries</div>
              <div className="text-3xl font-black text-white mt-2">
                {activeTab === 'schools' ? stats.schools.total : stats.participants.total}
              </div>
            </div>
            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest text-sky-400">New Actions</div>
              <div className="text-3xl font-black text-sky-400 mt-2">
                {activeTab === 'schools'
                  ? (stats.schools.statusBreakdown?.find(s => s._id === 'new')?.count || 0)
                  : (stats.participants.statusBreakdown?.find(s => s._id === 'new')?.count || 0)
                }
              </div>
            </div>
            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest text-emerald-400">Converted</div>
              <div className="text-3xl font-black text-emerald-400 mt-2">
                {activeTab === 'schools'
                  ? (stats.schools.statusBreakdown?.find(s => s._id === 'converted')?.count || 0)
                  : (stats.participants.statusBreakdown?.find(s => s._id === 'converted')?.count || 0)
                }
              </div>
            </div>
            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest text-orange-400">Today's Leads</div>
              <div className="text-3xl font-black text-orange-400 mt-2">
                {activeTab === 'schools' ? stats.schools.today : stats.participants.today}
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap flex-1">
              {/* Status Select */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-sky-500"
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
                  <Search size={16} className="text-slate-500" />
                  <select
                    value={classGroupFilter}
                    onChange={(e) => setClassGroupFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-sky-500"
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
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main List Box */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading && activeLeads.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500" />
            </div>
          ) : activeLeads.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white">No submissions found</h3>
              <p className="text-slate-500 text-xs mt-1">There are no records matching your current filter set.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#0b0f1a] border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                      {activeTab === 'schools' ? (
                        <>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">School</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contact Representative</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Preferred Month</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Students</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Team Details</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Team Leader</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">School & City</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Class Group</th>
                        </>
                      )}
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {activeLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-800/20 transition-all">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-bold">
                          {formatDate(lead.createdAt)}
                        </td>
                        {activeTab === 'schools' ? (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-bold text-white text-sm">{lead.schoolName}</div>
                              <div className="text-xs text-slate-500">{lead.city}, {lead.state}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-200 text-xs">{lead.yourName}</div>
                              <div className="text-[10px] text-slate-500">{lead.designation}</div>
                              <div className="text-[10px] text-sky-400 font-bold mt-0.5">{lead.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-300 font-bold">
                              {lead.preferredMonth}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                              {lead.expectedStudents}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-bold text-white text-sm">{lead.teamName}</div>
                              <div className="text-xs text-sky-400 font-bold">{lead.classGroup}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-200 text-xs">{lead.teamLeaderName}</div>
                              <div className="text-[10px] text-slate-500">{lead.teamLeaderEmail}</div>
                              <div className="text-[10px] text-sky-400 font-bold mt-0.5">{lead.teamLeaderWhatsapp}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-200 text-xs">{lead.schoolName}</div>
                              <div className="text-[10px] text-slate-500">{lead.city}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                              <span className="font-bold text-slate-300">{lead.teamLeaderClass}</span>
                              <span className="mx-2 text-slate-700">|</span>
                              <span>{lead.teamMembers} members</span>
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1"
                            >
                              <Eye size={12} /> Inspect
                            </button>
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in-progress">In Progress</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                            <button
                              onClick={() => deleteLead(lead._id)}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all"
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
                <div className="bg-[#0b0f1a] px-6 py-4 flex items-center justify-between border-t border-slate-800">
                  <div className="text-xs font-black text-slate-500">
                    PAGE {currentPage} OF {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-1.5 bg-slate-800 rounded-xl text-xs font-black text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      PREV
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-1.5 bg-slate-800 rounded-xl text-xs font-black text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Details Inspector Modal (Dark-themed overlay) */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-[#070913]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#111827] border border-slate-800/80 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-fadeIn my-8">
              
              {/* Modal Header */}
              <div className="bg-[#0b0f1a] px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className={`inline-flex px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider mb-2 ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {activeTab === 'schools' ? selectedLead.schoolName : selectedLead.teamName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Submitted on {formatDate(selectedLead.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 hover:bg-slate-700 transition-all text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                
                {/* School Host Details */}
                {activeTab === 'schools' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Address</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.schoolAddress}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City & State</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.city}, {selectedLead.state}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Principal</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.principalName}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Representative</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.yourName} ({selectedLead.designation})</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.email}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone / WhatsApp</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.phone} / {selectedLead.whatsappNumber}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preferred Month</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.preferredMonth}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Students</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.expectedStudents}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hall space available</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.hallAvailable}</p></div>
                    <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projector or screen</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.projectorAvailable}</p></div>
                  </div>
                ) : (
                  // Participant Team Details
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">School / City</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.schoolName} ({selectedLead.city})</p></div>
                      <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Class Group</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.classGroup}</p></div>
                      <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Team Size</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.teamMembers} members</p></div>
                      <div><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prior Experience</h4><p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.previousHackathon}</p></div>
                    </div>

                    {/* Team Members List */}
                    <div className="border-t border-slate-800 pt-6">
                      <h3 className="font-black text-white text-xs uppercase tracking-widest mb-4">Team Roster Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                          <span className="text-[9px] font-black uppercase tracking-wider text-sky-400">Leader (Member 1)</span>
                          <p className="font-bold text-white mt-1 text-sm">{selectedLead.teamLeaderName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teamLeaderClass}</p>
                          <p className="text-xs text-slate-500">WA: {selectedLead.teamLeaderWhatsapp}</p>
                          <p className="text-xs text-slate-500">Email: {selectedLead.teamLeaderEmail}</p>
                        </div>
                        {selectedLead.teammate2Name && (
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Teammate 2</span>
                            <p className="font-bold text-white mt-1 text-sm">{selectedLead.teammate2Name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teammate2Class}</p>
                          </div>
                        )}
                        {selectedLead.teammate3Name && (
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Teammate 3</span>
                            <p className="font-bold text-white mt-1 text-sm">{selectedLead.teammate3Name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teammate3Class}</p>
                          </div>
                        )}
                        {selectedLead.teammate4Name && (
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Teammate 4</span>
                            <p className="font-bold text-white mt-1 text-sm">{selectedLead.teammate4Name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teammate4Class}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Parents Details */}
                    <div className="border-t border-slate-800 pt-6">
                      <h3 className="font-black text-white text-xs uppercase tracking-widest mb-3">Parent / Guardian Reference</h3>
                      <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</h4>
                          <p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.parentName} ({selectedLead.parentRelationship})</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Details</h4>
                          <p className="text-sm font-semibold text-slate-200 mt-1">{selectedLead.parentWhatsapp} {selectedLead.parentEmail && `| ${selectedLead.parentEmail}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {selectedLead.additionalInfo && (
                  <div className="border-t border-slate-800 pt-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Additional Comments</h4>
                    <p className="text-xs text-slate-300 bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 leading-relaxed font-medium">
                      {selectedLead.additionalInfo}
                    </p>
                  </div>
                )}

                {/* Internal Action Notes */}
                <div className="border-t border-slate-800 pt-6">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Admin Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Enter private follow-up notes here..."
                    defaultValue={selectedLead.notes || ''}
                    onBlur={(e) => updateLeadNotes(selectedLead._id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500 text-xs font-medium text-white resize-none"
                  />
                  <span className="text-[9px] text-slate-500 font-bold mt-1 block">Saves automatically on clicking outside the input.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#0b0f1a] px-8 py-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Status:</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead._id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => deleteLead(selectedLead._id)}
                    className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs transition-colors border border-rose-500/20"
                  >
                    Delete Entry
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default HackathonLeadsPage;
