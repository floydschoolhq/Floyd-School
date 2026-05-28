import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

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
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeLeads = activeTab === 'schools' ? schoolLeads : participantLeads;

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Idea Hackathon Leads</h1>
            <p className="text-gray-500 mt-1">Manage school host requests and participant team registrations</p>
          </div>
          
          {/* Tab Selector */}
          <div className="flex bg-slate-200 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'schools'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              School Hosts
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'participants'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Participant Teams
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="text-3xl font-black text-slate-900">
                {activeTab === 'schools' ? stats.schools.total : stats.participants.total}
              </div>
              <div className="text-sm font-semibold text-slate-500 mt-1">
                {activeTab === 'schools' ? 'Total School Enquiries' : 'Total Teams Registered'}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="text-3xl font-black text-blue-600">
                {activeTab === 'schools'
                  ? (stats.schools.statusBreakdown?.find(s => s._id === 'new')?.count || 0)
                  : (stats.participants.statusBreakdown?.find(s => s._id === 'new')?.count || 0)
                }
              </div>
              <div className="text-sm font-semibold text-slate-500 mt-1">New Submissions</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="text-3xl font-black text-green-600">
                {activeTab === 'schools'
                  ? (stats.schools.statusBreakdown?.find(s => s._id === 'converted')?.count || 0)
                  : (stats.participants.statusBreakdown?.find(s => s._id === 'converted')?.count || 0)
                }
              </div>
              <div className="text-sm font-semibold text-slate-500 mt-1">Converted Leads</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="text-3xl font-black text-orange-600">
                {activeTab === 'schools' ? stats.schools.today : stats.participants.today}
              </div>
              <div className="text-sm font-semibold text-slate-500 mt-1">Today's Registrations</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In Progress</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {activeTab === 'participants' && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class Group</label>
                <select
                  value={classGroupFilter}
                  onChange={(e) => setClassGroupFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                >
                  <option value="">All Classes</option>
                  <option value="Class 7-8">Class 7-8</option>
                  <option value="Class 9-10">Class 9-10</option>
                  <option value="Class 11-12">Class 11-12</option>
                </select>
              </div>
            )}

            <div className="flex items-end self-stretch pt-6">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setClassGroupFilter('');
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table & Leads */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading && activeLeads.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
            </div>
          ) : activeLeads.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-4xl mb-3">📁</div>
              <h3 className="text-lg font-bold text-slate-700">No leads found</h3>
              <p className="text-slate-400 text-sm mt-1">There are no matching submissions at the moment.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      {activeTab === 'schools' ? (
                        <>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">School Details</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Month</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Students</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Team Name</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Leader Name</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">School / City</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class / Members</th>
                        </>
                      )}
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                          {formatDate(lead.createdAt)}
                        </td>
                        {activeTab === 'schools' ? (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{lead.schoolName}</div>
                              <div className="text-xs text-slate-500">{lead.city}, {lead.state}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-800">{lead.yourName}</div>
                              <div className="text-xs text-slate-500">{lead.designation}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{lead.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                              {lead.preferredMonth}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {lead.expectedStudents}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{lead.teamName}</div>
                              <div className="text-xs text-orange-600 font-bold">{lead.classGroup}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-800">{lead.teamLeaderName}</div>
                              <div className="text-xs text-slate-500">{lead.teamLeaderEmail}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{lead.teamLeaderWhatsapp}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-800">{lead.schoolName}</div>
                              <div className="text-xs text-slate-500">{lead.city}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              <span className="font-semibold text-slate-700">{lead.teamLeaderClass}</span>
                              <span className="mx-2 text-slate-300">|</span>
                              <span>{lead.teamMembers} members</span>
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                            >
                              Details
                            </button>
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in-progress">In Progress</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                            <button
                              onClick={() => deleteLead(lead._id)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1.5"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                  <div className="text-sm font-semibold text-slate-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-100 animate-fadeIn my-8">
              
              {/* Modal Header */}
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'schools' ? selectedLead.schoolName : selectedLead.teamName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Submitted on {formatDate(selectedLead.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                
                {/* School Host Details */}
                {activeTab === 'schools' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.schoolAddress}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">City & State</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.city}, {selectedLead.state}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Principal</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.principalName}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Representative</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.yourName} ({selectedLead.designation})</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.email}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone / WhatsApp</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.phone} / {selectedLead.whatsappNumber}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Month</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.preferredMonth}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Students</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.expectedStudents}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hall Space Available</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.hallAvailable}</p></div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projector Available</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.projectorAvailable}</p></div>
                  </div>
                ) : (
                  // Participant Team Details
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">School / City</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.schoolName} ({selectedLead.city})</p></div>
                      <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Group</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.classGroup}</p></div>
                      <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Size</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.teamMembers} members</p></div>
                      <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prior Hackathon Experience</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.previousHackathon}</p></div>
                    </div>

                    {/* Team Members List */}
                    <div className="border-t border-slate-100 pt-6">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Team Roster</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600">Leader (Member 1)</span>
                          <p className="font-bold text-slate-800 mt-1">{selectedLead.teamLeaderName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teamLeaderClass}</p>
                          <p className="text-xs text-slate-500">WA: {selectedLead.teamLeaderWhatsapp}</p>
                          <p className="text-xs text-slate-500">Email: {selectedLead.teamLeaderEmail}</p>
                        </div>
                        {selectedLead.teammate2Name && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Teammate 2</span>
                            <p className="font-bold text-slate-800 mt-1">{selectedLead.teammate2Name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teammate2Class}</p>
                          </div>
                        )}
                        {selectedLead.teammate3Name && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Teammate 3</span>
                            <p className="font-bold text-slate-800 mt-1">{selectedLead.teammate3Name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teammate3Class}</p>
                          </div>
                        )}
                        {selectedLead.teammate4Name && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Teammate 4</span>
                            <p className="font-bold text-slate-800 mt-1">{selectedLead.teammate4Name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Class: {selectedLead.teammate4Class}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Parents Details */}
                    <div className="border-t border-slate-100 pt-6">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">Parent / Guardian</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.parentName} ({selectedLead.parentRelationship})</p></div>
                        <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</h4><p className="text-sm font-semibold text-slate-800 mt-1">{selectedLead.parentWhatsapp} {selectedLead.parentEmail && `| ${selectedLead.parentEmail}`}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {selectedLead.additionalInfo && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Additional Comments</h4>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 rounded-2xl p-4 border border-slate-100 leading-relaxed">
                      {selectedLead.additionalInfo}
                    </p>
                  </div>
                )}

                {/* Internal Action Notes */}
                <div className="border-t border-slate-100 pt-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter private follow-up notes here..."
                    defaultValue={selectedLead.notes || ''}
                    onBlur={(e) => updateLeadNotes(selectedLead._id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium resize-none"
                  />
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Saves automatically on clicking outside input.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Change Status:</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead._id, e.target.value)}
                    className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20"
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
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors"
                  >
                    Delete Lead
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                  >
                    Close Modal
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
