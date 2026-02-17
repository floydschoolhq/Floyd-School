import React, { useState, useEffect } from 'react';
import {
    Target,
    Phone,
    Mail,
    Calendar,
    Filter,
    CheckCircle2,
    XCircle,
    Trash2,
    Clock,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const LeadIntelligence = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'done'

    const fetchLeads = async () => {
        try {
            const res = await api.get('/admin/leads');
            setLeads(res.data.leads);
        } catch (err) {
            console.error('Failed to fetch leads', err);
            toast.error('Failed to sync lead intelligence');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/leads/${id}/status`, { status });
            toast.success(`Lead marked as ${status}`);
            fetchLeads();
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const handleTerminate = async (id) => {
        if (!window.confirm('Terminate this lead permanently? This action cannot be undone.')) return;
        try {
            await api.delete(`/admin/leads/${id}`);
            toast.success('Lead terminated');
            fetchLeads();
        } catch (err) {
            toast.error('Termination failed');
        }
    };

    const filteredLeads = leads.filter(lead => {
        if (activeTab === 'pending') return lead.status === 'new' || lead.status === 'contacted';
        return lead.status === 'converted' || lead.status === 'closed';
    });

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Lead <span className="text-sky-500 not-italic">Intelligence</span>
                    </h2>
                    <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px]">
                        Pipeline Monitoring & Conversion Analytics
                    </p>
                </div>

                <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'pending'
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Clock size={14} /> Pending Inquiry
                    </button>
                    <button
                        onClick={() => setActiveTab('done')}
                        className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'done'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <CheckCircle2 size={14} /> Done
                    </button>
                </div>
            </header>

            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Prospect</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Info</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Interest</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Tactical Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        <AnimatePresence mode='popLayout'>
                            {filteredLeads.map((lead, idx) => (
                                <motion.tr
                                    key={lead._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-sky-500/5 transition-all duration-300"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                                                <Target size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-sky-400 transition-colors">{lead.name}</p>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                    Source: {lead.source?.replace('_', ' ') || 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Mail size={12} className="text-sky-500/50" /> {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Phone size={12} className="text-sky-500/50" /> {lead.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                                            {lead.source === 'school_partnership' ? 'Partnership' : (lead.topic || lead.courseInterest || 'Inquiry')}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${lead.status === 'converted' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' :
                                            lead.status === 'contacted' ? 'bg-sky-500/20 text-sky-500 border-sky-500/20' :
                                                lead.status === 'closed' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                                                    'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                            {activeTab === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(lead._id, 'converted')}
                                                        className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                                                        title="Mark as Converted"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(lead._id, 'closed')}
                                                        className="p-2 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
                                                        title="Move to Done (Closed)"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            ) : null}
                                            <button
                                                onClick={() => handleTerminate(lead._id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                title="Safe Terminate (Delete)"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Clock size={48} className="text-slate-800" />
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                                            No {activeTab} inquiries in buffer
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadIntelligence;
