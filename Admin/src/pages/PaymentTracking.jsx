import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    DollarSign,
    Users,
    CheckCircle,
    AlertCircle,
    Clock,
    RefreshCw,
    Search,
    Filter,
    CreditCard,
    TrendingUp,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentTracking = () => {
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        refunded: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async (status = filterStatus, search = searchTerm) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (status && status !== 'all') params.append('status', status);
            if (search) params.append('search', search);
            
            const res = await api.get(`/admin/payments?${params.toString()}`);
            setPayments(res.data.enrollments || []);
            setStats(res.data.stats || {
                total: 0,
                completed: 0,
                pending: 0,
                failed: 0,
                refunded: 0,
                totalRevenue: 0
            });
        } catch (error) {
            console.error("Failed to fetch payments", error);
            setError(error.response?.data?.message || 'Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPayments(filterStatus, searchTerm);
    };

    const handleStatusFilter = (status) => {
        setFilterStatus(status);
        fetchPayments(status, searchTerm);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'failed':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'refunded':
                return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default:
                return 'bg-slate-700 text-slate-400 border-slate-600';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'completed':
                return <CheckCircle size={16} className="text-green-400" />;
            case 'pending':
                return <Clock size={16} className="text-yellow-400" />;
            case 'failed':
                return <AlertCircle size={16} className="text-red-400" />;
            case 'refunded':
                return <RefreshCw size={16} className="text-slate-400" />;
            default:
                return <CreditCard size={16} className="text-slate-400" />;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit']">
                        Payment <span className="text-blue-600">Tracking</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2 text-sm">
                        Monitor all course enrollments and payment transactions in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fetchPayments()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <CreditCard size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Total</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Completed</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Clock size={20} className="text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Pending</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.pending}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Failed</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.failed}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
                            <RefreshCw size={20} className="text-slate-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Refunded</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.refunded}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/80">Revenue</span>
                    </div>
                    <p className="text-2xl font-black">{formatCurrency(stats.totalRevenue)}</p>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </form>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
                >
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-red-600 mb-2">Connection Failed</h3>
                    <p className="text-red-500/80">{error}</p>
                </motion.div>
            )}

            {/* Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Course</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Order ID</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Payment ID</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence>
                                {payments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id || index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Users size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{payment.userDetails?.fullName || payment.student?.name || 'N/A'}</p>
                                                    <p className="text-xs text-slate-500">{payment.userDetails?.email || payment.student?.email || 'N/A'}</p>
                                                    {payment.userDetails?.phone && (
                                                        <p className="text-xs text-slate-400">{payment.userDetails.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">
                                                {payment.course?.title || 'Unknown Course'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-900">
                                                {formatCurrency(payment.amount)}
                                            </span>
                                            <span className="text-xs text-slate-500 ml-1">{payment.currency || 'INR'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusBadge(payment.paymentStatus)}`}>
                                                {getStatusIcon(payment.paymentStatus)}
                                                {payment.paymentStatus || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                                                {payment.razorpayOrderId ? payment.razorpayOrderId.substring(0, 20) + '...' : 'N/A'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                                                {payment.razorpayPaymentId ? payment.razorpayPaymentId.substring(0, 20) + '...' : 'Pending'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={14} />
                                                <span className="text-sm">{formatDate(payment.createdAt || payment.enrollmentDate)}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {payments.length === 0 && !loading && !error && (
                    <div className="p-12 text-center">
                        <DollarSign size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Payment Records</h3>
                        <p className="text-slate-500">No enrollment or payment data found in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentTracking;
