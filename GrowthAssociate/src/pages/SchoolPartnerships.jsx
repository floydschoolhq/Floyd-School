import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { School, Building2, Users, Mail, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

const SchoolPartnerships = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/school-partnership/leads');
        setLeads(res.data.data || res.data || []);
      } catch (error) {
        console.error('Error fetching school partnership leads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <School className="text-emerald-400" />
          Offline School Partnership Pipeline
        </h1>
        <p className="text-slate-400 text-xs mt-1">Manage institutional leads, offline batch sales, and school onboarding requests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <School size={48} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No School Partnership Inquiries Yet</h3>
          <p className="text-slate-500 text-xs mt-1">Inquiries submitted by schools on the website will be displayed here for conversion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    {lead.status || 'New Inquiry'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(lead.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight mb-1">{lead.schoolName || 'School Inquiry'}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                  <MapPin size={12} className="text-slate-500" /> {lead.city || 'Location N/A'}
                </p>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div className="flex items-center space-x-2">
                    <Building2 size={14} className="text-slate-500 shrink-0" />
                    <span>Contact: {lead.contactPersonName || 'Coordinator'} ({lead.designation || 'Principal'})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={14} className="text-slate-500 shrink-0" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-slate-500 shrink-0" />
                    <span>{lead.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={14} className="text-slate-500 shrink-0" />
                    <span>Expected Student Strength: {lead.expectedStudents || '200+'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolPartnerships;
