import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Calendar, TrendingUp, Search, Filter, Download,
    Eye, Edit3, Trash2, ChevronLeft, ChevronRight, RefreshCw, X, FileSpreadsheet
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import GuestDetailDrawer from '../components/modals/GuestDetailDrawer';

const CLASS_OPTIONS = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Other'];
const STATUS_OPTIONS = ['New', 'Active', 'Contacted', 'Converted'];

const statusColors = {
    'New': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Contacted': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Converted': 'bg-violet-500/10 text-violet-400 border-violet-500/20'
};

const GuestDetailsPage = () => {
    const [guests, setGuests] = useState([]);
    const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchGuests = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(classFilter && { classFilter }),
                ...(statusFilter && { status: statusFilter })
            });
            const res = await api.get(`/guest?${params}`);
            setGuests(res.data.guests);
            setTotalPages(res.data.totalPages);
            setTotal(res.data.total);
        } catch (err) {
            toast.error('Failed to fetch guest data');
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, classFilter, statusFilter]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/guest/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Stats fetch error:', err);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, [fetchGuests]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/guest/${id}`);
            toast.success('Guest deleted successfully');
            setDeleteConfirm(null);
            fetchGuests();
            fetchStats();
        } catch (err) {
            toast.error('Failed to delete guest');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/guest/${id}`, { status: newStatus });
            toast.success('Status updated');
            fetchGuests();
            fetchStats();
            if (selectedGuest?._id === id) {
                setSelectedGuest(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleViewGuest = async (guest) => {
        try {
            const res = await api.get(`/guest/${guest._id}`);
            setSelectedGuest(res.data);
            setDrawerOpen(true);
        } catch (err) {
            toast.error('Failed to load guest details');
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await api.get('/guest/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guest-details-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('CSV exported successfully');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    const handleExportExcel = async () => {
        // Excel export using CSV format with .xlsx extension hint
        // For true xlsx, the xlsx npm package would be needed
        try {
            const response = await api.get('/guest/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guest-details-${Date.now()}.xls`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Excel exported successfully');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    const handleRefresh = () => {
        fetchGuests();
        fetchStats();
        toast.success('Data refreshed');
    };

    const statCards = [
        { label: 'Total Guests', value: stats.total, icon: <Users size={20} />, color: 'sky' },
        { label: "Today's Guests", value: stats.today, icon: <UserPlus size={20} />, color: 'emerald' },
        { label: 'This Week', value: stats.thisWeek, icon: <Calendar size={20} />, color: 'violet' },
        { label: 'This Month', value: stats.thisMonth, icon: <TrendingUp size={20} />, color: 'amber' }
    ];

    const colorMap = {
        sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400', shadow: 'shadow-sky-500/5' },
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', shadow: 'shadow-emerald-500/5' },
        violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', shadow: 'shadow-violet-500/5' },
        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', shadow: 'shadow-amber-500/5' }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Guest <span className="text-sky-500 not-italic">Details</span>
                    </h2>
                    <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px]">
                        Monitor and manage guest login registrations
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-sky-500/20 transition-all"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => {
                    const colors = colorMap[card.color];
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className={`${colors.bg} border ${colors.border} rounded-[2rem] p-6 backdrop-blur-md ${colors.shadow} shadow-lg`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`${colors.text}`}>{card.icon}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {card.label}
                                </span>
                            </div>
                            <p className={`text-4xl font-black ${colors.text}`}>
                                {card.value}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by name, mobile, class..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 text-sm transition-colors"
                        />
                    </div>

                    {/* Class Filter */}
                    <select
                        value={classFilter}
                        onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-sky-500/50 cursor-pointer appearance-none min-w-[120px] transition-colors"
                    >
                        <option value="" className="bg-slate-900">All Classes</option>
                        {CLASS_OPTIONS.map(c => (
                            <option key={c} value={c} className="bg-slate-900">Class {c}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-sky-500/50 cursor-pointer appearance-none min-w-[130px] transition-colors"
                    >
                        <option value="" className="bg-slate-900">All Status</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-slate-900">{s}</option>
                        ))}
                    </select>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                        <Download size={14} />
                        CSV
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-violet-400 hover:bg-violet-500/20 transition-all"
                    >
                        <FileSpreadsheet size={14} />
                        Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mobile</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Class</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Section</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">School</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">City</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16">
                                        <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : guests.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-slate-500 text-sm">
                                        No guest records found
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {guests.map((guest, i) => (
                                        <motion.tr
                                            key={guest._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2, delay: i * 0.03 }}
                                            className="border-b border-slate-800/50 hover:bg-sky-500/5 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-white font-bold">{guest.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-300 font-mono">{guest.mobile}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300 font-bold">
                                                    {guest.class}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300">{guest.section}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">{guest.school || '—'}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">{guest.city || '—'}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {new Date(guest.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[guest.status] || statusColors['New']}`}>
                                                    {guest.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => handleViewGuest(guest)}
                                                        className="p-2 rounded-xl hover:bg-sky-500/10 text-slate-500 hover:text-sky-400 transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewGuest(guest)}
                                                        className="p-2 rounded-xl hover:bg-amber-500/10 text-slate-500 hover:text-amber-400 transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(guest._id)}
                                                        className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, total)} of {total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                                            page === pageNum
                                                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                                                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 mx-auto">
                                <Trash2 size={24} className="text-rose-400" />
                            </div>
                            <h3 className="text-xl font-black text-white text-center mb-2">Delete Guest?</h3>
                            <p className="text-slate-500 text-sm text-center mb-6">This action cannot be undone. The guest record will be permanently removed.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-bold text-sm hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Guest Detail Drawer */}
            <GuestDetailDrawer
                isOpen={drawerOpen}
                onClose={() => { setDrawerOpen(false); setSelectedGuest(null); }}
                guest={selectedGuest}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
};

export default GuestDetailsPage;
