import React, { useState, useEffect } from 'react';
import {
    Target,
    Phone,
    Mail,
    Calendar,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const LeadIntelligence = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/admin/leads');
                setLeads(res.data.leads);
            } catch (err) {
                console.error('Failed to fetch leads', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Lead <span className="text-sky-500 not-italic">Intelligence</span>
                </h2>
                <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px]">
                    Pipeline Monitoring & Conversion Analytics
                </p>
            </header>

            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                            <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Prospect</th>
                            <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Contact Info</th>
                            <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Interest</th>
                            <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Source</th>
                            <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {leads.map((lead, idx) => (
                            <motion.tr
                                key={lead._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group hover:bg-sky-500/5 transition-colors"
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sky-400">
                                            <Target size={18} />
                                        </div>
                                        <p className="font-bold text-white">{lead.name}</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Mail size={12} /> {lead.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Phone size={12} /> {lead.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded">
                                        {lead.source === 'school_partnership' ? 'Partnership Request' : (lead.topic || lead.courseInterest || 'General Inquiry')}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${lead.source === 'school_partnership' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
                                        }`}>
                                        {lead.source?.replace('_', ' ') || 'Unknown'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${lead.status === 'Converted' ? 'bg-emerald-500/20 text-emerald-500' :
                                        lead.status === 'Contacted' ? 'bg-sky-500/20 text-sky-500' :
                                            'bg-slate-700 text-slate-300'
                                        }`}>
                                        {lead.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadIntelligence;
