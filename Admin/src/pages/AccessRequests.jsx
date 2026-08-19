import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    CheckCircle2,
    XCircle,
    Clock,
    User,
    RefreshCw,
    ShieldAlert,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

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
            const res = await api.get('/admin/access-requests');
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
            await api.patch(`/admin/access-requests/${requestId}`, { status });

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
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
                        Access <span className="text-blue-600">Requests</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">
                        Manage and approve permissions for your students.
                    </p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2 font-bold text-xs shadow-xs cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
                </button>
            </header>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold">
                    <ShieldAlert size={18} />
                    <p>{error}</p>
                </div>
            )}

            {/* Pending Requests Queue */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Queue ({pendingRequests.length})</h3>
                </div>

                {pendingRequests.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                        <Clock className="mx-auto mb-3 text-slate-300" size={40} />
                        <p className="text-slate-500 font-medium text-xs">Everything is up to date. No pending access requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingRequests.map((request) => (
                            <motion.div
                                key={request._id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-lg text-blue-600 shadow-xs">
                                            {request.student?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2.5 mb-1">
                                                <h3 className="text-base font-bold text-slate-900">{request.student?.name}</h3>
                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Awaiting Review</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 mb-3">{request.student?.email}</p>

                                            <div className="flex flex-wrap gap-2.5">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Module:</span>
                                                    <span className="text-xs font-bold text-slate-800 uppercase">
                                                        {request.requestedPermission.replace('canAccess', '')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                                    <Clock size={11} className="text-slate-400" />
                                                    <span className="text-[10px] font-medium text-slate-500">
                                                        {new Date(request.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {request.message && (
                                                <div className="mt-4 p-3 bg-slate-50 border-l-4 border-blue-500 rounded-r-xl italic text-slate-600 text-xs">
                                                    "{request.message}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                                        <button
                                            onClick={() => handleReview(request._id, 'approved')}
                                            disabled={processing === request._id}
                                            className="flex-1 lg:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            {processing === request._id ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReview(request._id, 'rejected')}
                                            disabled={processing === request._id}
                                            className="flex-1 lg:flex-none px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-600 rounded-xl font-bold uppercase tracking-wider text-xs transition-all border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            {processing === request._id ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
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
                <section className="space-y-3 pt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Historical Logs</h3>
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {reviewedRequests.slice(0, 10).map((request) => (
                                    <tr key={request._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <span className="font-bold text-slate-900">{request.student?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Requested:</span>
                                            <span className="ml-1.5 font-bold text-blue-600 uppercase">
                                                {request.requestedPermission.replace('canAccess', '')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${request.status === 'approved'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${request.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-[10px] text-slate-400">
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
