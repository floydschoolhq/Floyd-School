import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    MessageCircle,
    Phone,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StudentLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingLeadId, setUpdatingLeadId] = useState(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (err) {
            console.error('Failed to fetch leads', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingLeadId(id);
        try {
            await api.patch(`/leads/${id}/status`, { status: newStatus });
            fetchLeads();
        } catch (err) {
            alert('Failed to update lead status');
        } finally {
            setUpdatingLeadId(null);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-sky-500';
            case 'contacted': return 'bg-amber-500';
            case 'converted': return 'bg-emerald-500';
            case 'closed': return 'bg-slate-400';
            default: return 'bg-slate-200';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-sky-500 decoration-4 underline-offset-8">
                        Transmission <span className="text-sky-500 not-italic">Leads</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest text-xs">Incoming signals from potential student nodes.</p>
                </div>
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
                    <div className="flex flex-col items-end border-r border-slate-700 pr-4">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Growth Velocity</span>
                        <span className="text-sm font-black">+18.4%</span>
                    </div>
                    <Users size={20} className="text-sky-500" />
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, interest or neural hash..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 p-4 pl-12 rounded-[1.5rem] font-bold text-sm text-slate-900 outline-none focus:border-sky-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b-2 border-slate-100">
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Origin</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interested Sector</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Status</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredLeads.map((lead, idx) => (
                            <motion.tr
                                key={lead._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-sky-50/50 transition-all group"
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black ${getStatusColor(lead.status)} shadow-lg`}>
                                            {lead.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{lead.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lead.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-sm font-black text-slate-600 uppercase tracking-tighter">
                                    {lead.topic || 'General Inquiry'}
                                </td>
                                <td className="p-6">
                                    <select
                                        disabled={updatingLeadId === lead._id}
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                        className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-sky-500"
                                    >
                                        <option value="new">New Node</option>
                                        <option value="contacted">In Contact</option>
                                        <option value="converted">Encoded (Converted)</option>
                                        <option value="closed">Terminated (Closed)</option>
                                    </select>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2.5 rounded-xl bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                                            <MessageCircle size={16} />
                                        </button>
                                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                            <Phone size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentLeads;

