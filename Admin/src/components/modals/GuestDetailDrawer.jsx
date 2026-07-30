import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Phone, BookOpen, Building2, MapPin, Globe,
    Monitor, Smartphone, Clock, Shield, ChevronDown
} from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Active', 'Contacted', 'Converted'];

const statusColors = {
    'New': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Contacted': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Converted': 'bg-violet-500/10 text-violet-400 border-violet-500/20'
};

const GuestDetailDrawer = ({ isOpen, onClose, guest, onStatusUpdate }) => {
    const [status, setStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        if (guest) setStatus(guest.status);
    }, [guest]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleStatusChange = async (newStatus) => {
        setStatusLoading(true);
        setStatus(newStatus);
        try {
            await onStatusUpdate(guest._id, newStatus);
        } catch {
            setStatus(guest.status);
        } finally {
            setStatusLoading(false);
        }
    };

    const InfoField = ({ icon, label, value }) => (
        <div className="flex items-start gap-3 py-3 border-b border-slate-800/50 last:border-0">
            <span className="text-slate-500 mt-0.5">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm text-white font-bold truncate">{value || '—'}</p>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && guest && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-[#0f172a] border-l border-slate-800 shadow-2xl shadow-black/50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                            <div>
                                <h3 className="text-lg font-black text-white tracking-tight">Guest Profile</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
                                    Detailed Information
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Name Header */}
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
                                    <User size={28} className="text-sky-400" />
                                </div>
                                <h4 className="text-xl font-black text-white">{guest.name}</h4>
                                <p className="text-slate-500 text-sm font-mono mt-1">{guest.mobile}</p>
                            </div>

                            {/* Status */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Status</p>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={statusLoading}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-black uppercase tracking-widest appearance-none cursor-pointer transition-all focus:outline-none ${statusColors[status]} bg-transparent disabled:opacity-50`}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Personal Details</p>
                                <InfoField icon={<User size={16} />} label="Full Name" value={guest.name} />
                                <InfoField icon={<Phone size={16} />} label="Mobile" value={guest.mobile} />
                                <InfoField icon={<BookOpen size={16} />} label="Class" value={guest.class} />
                                <InfoField icon={<Shield size={16} />} label="Section" value={guest.section} />
                                <InfoField icon={<Building2 size={16} />} label="School" value={guest.school} />
                                <InfoField icon={<MapPin size={16} />} label="City" value={guest.city} />
                            </div>

                            {/* Technical Details */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Technical Details</p>
                                <InfoField
                                    icon={<Clock size={16} />}
                                    label="Created At"
                                    value={guest.createdAt ? new Date(guest.createdAt).toLocaleString('en-IN', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    }) : '—'}
                                />
                                <InfoField
                                    icon={<Clock size={16} />}
                                    label="Last Login"
                                    value={guest.lastLogin ? new Date(guest.lastLogin).toLocaleString('en-IN', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    }) : '—'}
                                />
                                <InfoField
                                    icon={guest.device === 'Mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                    label="Device"
                                    value={guest.device}
                                />
                                <InfoField icon={<Globe size={16} />} label="Browser" value={guest.browser} />
                                <InfoField icon={<Shield size={16} />} label="IP Address" value={guest.ipAddress} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GuestDetailDrawer;
