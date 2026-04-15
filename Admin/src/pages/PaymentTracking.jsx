import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../api/axios';
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
    Calendar,
    ChevronDown,
    ChevronUp,
    XCircle,
    Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentGroup = ({ title, payments, icon: Icon, colorClass, bgClass, borderColor, isExpanded, onToggle, formatCurrency, formatDate }) => {
    if (payments.length === 0) return null;

    const groupRevenue = payments
        .filter(p => p.paymentStatus === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm ${borderColor}`}
        >
            <button
                onClick={onToggle}
                className={`w-full px-6 py-4 flex items-center justify-between ${bgClass} hover:opacity-90 transition-opacity`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center shadow-lg`}>
                        <Icon size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-lg">{title}</h3>
                        <p className="text-sm text-slate-500">
                            {payments.length} {payments.length === 1 ? 'record' : 'records'}
                            {groupRevenue > 0 && (
                                <span className="ml-2 font-bold text-green-600">
                                    (Revenue: {formatCurrency(groupRevenue)})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-900">{payments.length}</span>
                    {isExpanded ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Course</th>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Order ID</th>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Payment ID</th>
                                        <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence>
                                        {payments.map((payment, index) => (
                                            <motion.tr
                                                key={payment._id || index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
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
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                                                        payment.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-600 border-green-500/30' :
                                                        payment.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' :
                                                        payment.paymentStatus === 'cancelled' ? 'bg-orange-500/20 text-orange-600 border-orange-500/30' :
                                                        payment.paymentStatus === 'failed' ? 'bg-red-500/20 text-red-600 border-red-500/30' :
                                                        'bg-slate-500/20 text-slate-600 border-slate-500/30'
                                                    }`}>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const PaymentTracking = () => {
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        cancelled: 0,
        failed: 0,
        refunded: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGroups, setExpandedGroups] = useState({
        completed: true,
        cancelled: true,
        failed: false,
        refunded: false
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async (search = searchTerm) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            
            const res = await adminApi.get(`/admin/payments?${params.toString()}`);
            const enrollments = res.data.enrollments || [];
            setPayments(enrollments);
            
            const completed = enrollments.filter(p => p.paymentStatus === 'completed').length;
            const pending = enrollments.filter(p => p.paymentStatus === 'pending').length;
            const cancelled = enrollments.filter(p => p.paymentStatus === 'cancelled').length;
            const failed = enrollments.filter(p => p.paymentStatus === 'failed').length;
            const refunded = enrollments.filter(p => p.paymentStatus === 'refunded').length;
            
            setStats({
                total: enrollments.length,
                completed,
                cancelled: pending + cancelled,
                failed,
                refunded,
                totalRevenue: enrollments
                    .filter(p => p.paymentStatus === 'completed')
                    .reduce((sum, p) => sum + (p.amount || 0), 0)
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
        fetchPayments(searchTerm);
    };

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const expandAll = () => {
        setExpandedGroups({
            completed: true,
            cancelled: true,
            failed: true,
            refunded: true
        });
    };

    const collapseAll = () => {
        setExpandedGroups({
            completed: false,
            cancelled: false,
            failed: false,
            refunded: false
        });
    };

    const groupedPayments = {
        completed: payments.filter(p => p.paymentStatus === 'completed'),
        cancelled: payments.filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'cancelled'),
        failed: payments.filter(p => p.paymentStatus === 'failed'),
        refunded: payments.filter(p => p.paymentStatus === 'refunded')
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

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit']">
                        Payment <span className="text-blue-600">Tracking</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2 text-sm">
                        Monitor all course enrollments grouped by payment status.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={expandAll}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                    >
                        Expand All
                    </button>
                    <button 
                        onClick={collapseAll}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                    >
                        Collapse All
                    </button>
                    <button 
                        onClick={() => fetchPayments()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Ban size={20} className="text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Cancelled</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.cancelled}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <XCircle size={20} className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Failed</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.failed}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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

            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    Search
                </button>
            </form>

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

            <div className="space-y-4">
                <PaymentGroup
                    title="Completed Payments"
                    payments={groupedPayments.completed}
                    icon={CheckCircle}
                    colorClass="bg-green-500 text-white"
                    bgClass="bg-green-50"
                    borderColor="border-green-200"
                    isExpanded={expandedGroups.completed}
                    onToggle={() => toggleGroup('completed')}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />

                <PaymentGroup
                    title="Cancelled / Incomplete Payments"
                    payments={groupedPayments.cancelled}
                    icon={Ban}
                    colorClass="bg-orange-500 text-white"
                    bgClass="bg-orange-50"
                    borderColor="border-orange-200"
                    isExpanded={expandedGroups.cancelled}
                    onToggle={() => toggleGroup('cancelled')}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />

                <PaymentGroup
                    title="Failed Payments"
                    payments={groupedPayments.failed}
                    icon={XCircle}
                    colorClass="bg-red-500 text-white"
                    bgClass="bg-red-50"
                    borderColor="border-red-200"
                    isExpanded={expandedGroups.failed}
                    onToggle={() => toggleGroup('failed')}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />

                <PaymentGroup
                    title="Refunded Payments"
                    payments={groupedPayments.refunded}
                    icon={RefreshCw}
                    colorClass="bg-slate-500 text-white"
                    bgClass="bg-slate-100"
                    borderColor="border-slate-200"
                    isExpanded={expandedGroups.refunded}
                    onToggle={() => toggleGroup('refunded')}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />
            </div>

            {payments.length === 0 && !loading && !error && (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <DollarSign size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Payment Records</h3>
                    <p className="text-slate-500">No enrollment or payment data found in the system.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentTracking;
