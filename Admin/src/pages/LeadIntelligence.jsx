import React, { useState, useEffect } from 'react';
import {
    Target,
    Phone,
    Mail,
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
            setLeads(res.data.leads || []);
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
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Lead <span className="text-blue-600">Intelligence</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        Pipeline Monitoring & Conversion Analytics
                    </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'pending'
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <Clock size={13} /> Pending Inquiries
                    </button>
                    <button
                        onClick={() => setActiveTab('done')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'done'
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <CheckCircle2 size={13} /> Completed
                    </button>
                </div>
            </header>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prospect</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            <AnimatePresence mode='popLayout'>
                                {filteredLeads.map((lead, idx) => (
                                    <motion.tr
                                        key={lead._id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-slate-50/70 transition-colors group"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 font-bold">
                                                    <Target size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{lead.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                                        Source: {lead.source?.replace('_', ' ') || 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <Mail size={12} className="text-slate-400" /> {lead.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <Phone size={12} className="text-slate-400" /> {lead.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                                {lead.source === 'school_partnership' ? 'Partnership' : (lead.topic || lead.courseInterest || 'Inquiry')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${lead.status === 'converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    lead.status === 'closed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(lead._id, 'converted')}
                                                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                                                            title="Mark as Converted"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(lead._id, 'closed')}
                                                            className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                                                            title="Close Inquiry"
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    </>
                                                ) : null}
                                                <button
                                                    onClick={() => handleTerminate(lead._id)}
                                                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-slate-400">
                                        <Clock size={36} className="mx-auto mb-2 text-slate-300" />
                                        <p className="font-medium text-xs">
                                            No {activeTab} inquiries found
                                        </p>
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

export default LeadIntelligence;
