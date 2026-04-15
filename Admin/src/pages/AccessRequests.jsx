import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../api/axios';
import {
    CheckCircle2,
    XCircle,
    Clock,
    User,
    RefreshCw,
    ShieldAlert,
    AlertCircle,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminApi.get('/admin/access-requests');
            setRequests(res.data.requests || []);
        } catch (error) {
            console.error("Failed to fetch requests", error);
            setError(error.response?.data?.message || 'Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (requestId, status) => {
        if (!requestId || !status) return;

        setProcessing(requestId);
        try {
            await adminApi.patch(`/admin/access-requests/${requestId}`, { status });

            // Optimistic update
            setRequests(requests.map(r =>
                r._id === requestId ? { ...r, status, reviewedAt: new Date() } : r
            ));
        } catch (error) {
            console.error("Update failed", error);
            alert(error.response?.data?.message || 'Failed to process request.');
            fetchRequests();
        } finally {
            setProcessing(null);
        }
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const reviewedRequests = requests.filter(r => r.status !== 'pending');

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit']">
                        Access <span className="text-blue-600">Requests</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2 text-sm">
                        Manage and approve permissions for your students.
                    </p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm text-slate-700 shadow-sm"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
                </button>
            </header>

            {error && (
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500">
                    <ShieldAlert size={24} />
                    <p className="font-bold uppercase tracking-widest text-xs">{error}</p>
                </div>
            )}

            {/* Pending Requests Queue */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Activity size={18} className="text-emerald-500" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Queue ({pendingRequests.length})</h3>
                </div>

                {pendingRequests.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-16 text-center shadow-sm">
                        <Clock className="mx-auto mb-4 text-slate-200" size={48} />
                        <p className="text-slate-500 font-medium text-sm">Everything is up to date. No pending access requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingRequests.map((request) => (
                            <motion.div
                                key={request._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl hover:border-emerald-500/20 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex items-start gap-6 flex-1">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-2xl text-blue-600 shadow-sm">
                                            {request.student?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-black text-slate-900 font-['Outfit'] tracking-tight">{request.student?.name}</h3>
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">AWAITING REVIEW</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mb-4">{request.student?.email}</p>

                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Requested Module:</span>
                                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                                        {request.requestedPermission.replace('canAccess', '').toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <Clock size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        {new Date(request.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {request.message && (
                                                <div className="mt-6 p-4 bg-slate-950 border-l-4 border-emerald-500 rounded-r-xl italic text-slate-400 text-sm">
                                                    "{request.message}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                        <button
                                            onClick={() => handleReview(request._id, 'approved')}
                                            disabled={processing === request._id}
                                            className="flex-1 lg:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
                                        >
                                            {processing === request._id ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                            Approve Access
                                        </button>
                                        <button
                                            onClick={() => handleReview(request._id, 'rejected')}
                                            disabled={processing === request._id}
                                            className="flex-1 lg:flex-none px-8 py-4 bg-white hover:bg-rose-50 text-rose-600 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border border-slate-200 flex items-center justify-center gap-2"
                                        >
                                            {processing === request._id ? <RefreshCw size={16} className="animate-spin" /> : <XCircle size={16} />}
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* History Logs */}
            {reviewedRequests.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <RefreshCw size={18} className="text-slate-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight opacity-50">Historical Logs</h3>
                    </div>
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] overflow-hidden">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-800/50">
                                {reviewedRequests.slice(0, 10).map((request) => (
                                    <tr key={request._id} className="hover:bg-slate-800/10 transition-colors opacity-60">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <User size={16} className="text-slate-600" />
                                                <span className="font-black text-white uppercase tracking-widest text-[11px]">{request.student?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">REQUESTED:</span>
                                            <span className="ml-2 font-black text-sky-400 text-[11px] uppercase tracking-widest">
                                                {request.requestedPermission.replace('canAccess', '')}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${request.status === 'approved'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${request.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                {request.status}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {new Date(request.reviewedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AccessRequests;
