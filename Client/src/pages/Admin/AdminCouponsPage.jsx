import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Tag, 
    Plus, 
    Trash2, 
    Power, 
    Calendar, 
    Users, 
    Check, 
    X, 
    Loader, 
    AlertCircle,
    ChevronDown,
    Search
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const AdminCouponsPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'fixed',
        discountValue: '',
        expiryDate: '',
        usageLimit: '',
        minPurchaseAmount: '0',
        applicableCourses: []
    });

    useEffect(() => {
        fetchCoupons();
        fetchCourses();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await api.get('/coupons');
            setCoupons(res.data.coupons);
        } catch (err) {
            toast.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data.courses || []);
        } catch (err) {
            console.error('Failed to fetch courses');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.patch(`/coupons/${id}/toggle`);
            setCoupons(prev => prev.map(c => c._id === id ? res.data.coupon : c));
            toast.success(res.data.message);
        } catch (err) {
            toast.error('Failed to toggle status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(prev => prev.filter(c => c._id !== id));
            toast.success('Coupon deleted');
        } catch (err) {
            toast.error('Failed to delete coupon');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await api.post('/coupons', formData);
            setCoupons(prev => [res.data.coupon, ...prev]);
            setShowAddForm(false);
            setFormData({
                code: '',
                discountType: 'fixed',
                discountValue: '',
                expiryDate: '',
                usageLimit: '',
                minPurchaseAmount: '0',
                applicableCourses: []
            });
            toast.success('Coupon created successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create coupon');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredCoupons = coupons.filter(c => 
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Tag className="text-blue-500" size={32} />
                        Coupon Management
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Create and manage discount codes for your courses</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                    {showAddForm ? <X size={20} /> : <Plus size={20} />}
                    {showAddForm ? 'Cancel' : 'Create New Coupon'}
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-slate-900 border border-white/5 rounded-2xl p-6 md:p-8 mb-10 shadow-2xl"
                        >
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Coupon Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="SUMMER50"
                                        value={formData.code}
                                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all uppercase"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={e => setFormData({...formData, discountType: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="fixed">Fixed Amount (₹)</option>
                                        <option value="percentage">Percentage (%)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Discount Value</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="500"
                                        value={formData.discountValue}
                                        onChange={e => setFormData({...formData, discountValue: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Usage Limit (Optional)</label>
                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={formData.usageLimit}
                                        onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Purchase Amount (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="999"
                                        value={formData.minPurchaseAmount}
                                        onChange={e => setFormData({...formData, minPurchaseAmount: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="lg:col-span-3 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Applicable Courses (Empty = All)</label>
                                    <div className="flex flex-wrap gap-2 p-4 bg-black/30 rounded-xl border border-white/5 max-h-40 overflow-y-auto">
                                        {courses.map(course => (
                                            <label 
                                                key={course._id}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                                                    formData.applicableCourses.includes(course._id)
                                                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400'
                                                    : 'bg-white/5 border border-transparent text-slate-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.applicableCourses.includes(course._id)}
                                                    onChange={() => {
                                                        const current = formData.applicableCourses;
                                                        if (current.includes(course._id)) {
                                                            setFormData({...formData, applicableCourses: current.filter(id => id !== course._id)});
                                                        } else {
                                                            setFormData({...formData, applicableCourses: [...current, course._id]});
                                                        }
                                                    }}
                                                />
                                                <span className="text-xs font-bold">{course.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-3 flex justify-end pt-4">
                                    <button
                                        disabled={formLoading}
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
                                    >
                                        {formLoading ? <Loader className="animate-spin" size={20} /> : <Check size={20} />}
                                        Save Coupon
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table Section */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-white tracking-tight">Active Coupons</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by code..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all w-full md:w-64"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <Loader className="animate-spin text-blue-500" size={40} />
                            <p className="text-slate-400 font-medium">Decrypting coupons...</p>
                        </div>
                    ) : filteredCoupons.length === 0 ? (
                        <div className="p-20 text-center">
                            <Tag className="mx-auto text-slate-700 mb-4" size={48} />
                            <p className="text-slate-500 font-medium">No coupons found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-black/20">
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Code</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Discount</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Limit/Usage</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Expiry</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCoupons.map((coupon) => (
                                        <motion.tr 
                                            key={coupon._id}
                                            layout
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                        <Tag className="text-blue-500" size={18} />
                                                    </div>
                                                    <span className="font-bold text-white tracking-widest">{coupon.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-black uppercase">
                                                    {coupon.discountType === 'fixed' ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Users size={14} className="text-slate-500" />
                                                    <span className="text-sm font-medium">
                                                        {coupon.usageCount} / {coupon.usageLimit || '∞'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Calendar size={14} className="text-slate-500" />
                                                    <span className="text-sm font-medium">
                                                        {new Date(coupon.expiryDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(coupon._id)}
                                                        className={`p-2 rounded-lg transition-all ${
                                                            coupon.isActive 
                                                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                                                            : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                        }`}
                                                    >
                                                        <Power size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(coupon._id)}
                                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCouponsPage;
