import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Calendar, TrendingUp, Search, Download,
    Eye, Edit3, Trash2, ChevronLeft, ChevronRight, RefreshCw, X, FileSpreadsheet
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import GuestDetailDrawer from '../components/modals/GuestDetailDrawer';

const CLASS_OPTIONS = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Other'];
const STATUS_OPTIONS = ['New', 'Active', 'Contacted', 'Converted'];

const statusColors = {
    'New': 'bg-blue-50 text-blue-700 border-blue-200',
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Contacted': 'bg-amber-50 text-amber-700 border-amber-200',
    'Converted': 'bg-purple-50 text-purple-700 border-purple-200'
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
            setGuests(res.data.guests || []);
            setTotalPages(res.data.totalPages || 1);
            setTotal(res.data.total || 0);
        } catch (err) {
            toast.error('Failed to fetch guest data');
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, classFilter, statusFilter]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/guest/stats');
            setStats(res.data || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
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

    const handleRefresh = () => {
        fetchGuests();
        fetchStats();
        toast.success('Data refreshed');
    };

    const statCards = [
        { label: 'Total Guests', value: stats.total, icon: <Users size={18} />, color: 'blue' },
        { label: "Today's Guests", value: stats.today, icon: <UserPlus size={18} />, color: 'emerald' },
        { label: 'This Week', value: stats.thisWeek, icon: <Calendar size={18} />, color: 'purple' },
        { label: 'This Month', value: stats.thisMonth, icon: <TrendingUp size={18} />, color: 'amber' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Guest <span className="text-blue-600">Registrations</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        Monitor and manage guest logins and lead conversions
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-xs cursor-pointer"
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {card.label}
                            </span>
                            <span className="text-slate-400">{card.icon}</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900">
                            {card.value}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-2.5 flex-1 w-full">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by name, mobile, class..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs font-medium shadow-xs"
                        />
                    </div>

                    {/* Class Filter */}
                    <select
                        value={classFilter}
                        onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs min-w-[110px]"
                    >
                        <option value="">All Classes</option>
                        {CLASS_OPTIONS.map(c => (
                            <option key={c} value={c}>Class {c}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs min-w-[120px]"
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Guest Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Guest</th>
                                <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Mobile</th>
                                <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Class</th>
                                <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Status</th>
                                <th className="text-left py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Date</th>
                                <th className="text-right py-3.5 px-6 text-slate-500 font-bold uppercase tracking-wider text-[11px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Loading guests...
                                    </td>
                                </tr>
                            ) : guests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        No guests found matching criteria.
                                    </td>
                                </tr>
                            ) : (
                                guests.map((guest) => (
                                    <tr key={guest._id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 font-bold">{guest.name || 'Anonymous Guest'}</p>
                                            <p className="text-[11px] text-slate-400">{guest.email || 'No email'}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 font-medium">
                                            {guest.mobileNumber || 'N/A'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                                                Class {guest.studentClass || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <select
                                                value={guest.status || 'New'}
                                                onChange={(e) => handleStatusUpdate(guest._id, e.target.value)}
                                                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border cursor-pointer ${statusColors[guest.status] || statusColors['New']}`}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 text-[11px]">
                                            {new Date(guest.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-1.5">
                                            <button
                                                onClick={() => handleViewGuest(guest)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(guest._id)}
                                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-bold">
                            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} guests
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-xs font-bold px-2 text-slate-700">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Guest Drawer */}
            {selectedGuest && (
                <GuestDetailDrawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    guest={selectedGuest}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}

            {/* Delete Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4">
                        <h4 className="text-base font-bold text-slate-900">Delete Guest Record</h4>
                        <p className="text-xs text-slate-500">Are you sure you want to permanently delete this guest registration?</p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestDetailsPage;
