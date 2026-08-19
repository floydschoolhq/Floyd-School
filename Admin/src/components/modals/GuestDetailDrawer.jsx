import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Phone, BookOpen, Building2, MapPin, Globe,
    Monitor, Smartphone, Clock, Shield, ChevronDown
} from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Active', 'Contacted', 'Converted'];

const statusColors = {
    'New': 'bg-blue-50 text-blue-700 border-blue-200',
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Contacted': 'bg-amber-50 text-amber-700 border-amber-200',
    'Converted': 'bg-purple-50 text-purple-700 border-purple-200'
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
        <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
            <span className="text-slate-400 mt-0.5">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-xs text-slate-900 font-semibold truncate">{value || '—'}</p>
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
                        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Guest Profile</h3>
                                <p className="text-xs text-slate-400">Detailed Registration Information</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Name Header */}
                            <div className="text-center py-2">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">{guest.name}</h4>
                                <p className="text-slate-500 text-xs font-mono mt-0.5">{guest.mobileNumber || guest.mobile}</p>
                            </div>

                            {/* Status */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lead Status</p>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={statusLoading}
                                        className={`w-full px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all focus:outline-none ${statusColors[status] || statusColors['New']} bg-white disabled:opacity-50`}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Academic & Location</h5>
                                <InfoField icon={<BookOpen size={15} />} label="Class" value={`Class ${guest.studentClass || 'N/A'}`} />
                                <InfoField icon={<Building2 size={15} />} label="School Name" value={guest.schoolName} />
                                <InfoField icon={<MapPin size={15} />} label="City / Region" value={guest.city} />
                            </div>

                            {/* System Metadata */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Device & Telemetry</h5>
                                <InfoField icon={<Clock size={15} />} label="Registered Date" value={new Date(guest.createdAt).toLocaleString()} />
                                <InfoField icon={<Smartphone size={15} />} label="Platform" value={guest.deviceInfo?.platform} />
                                <InfoField icon={<Monitor size={15} />} label="Browser" value={guest.deviceInfo?.browser} />
                                <InfoField icon={<Globe size={15} />} label="IP Address" value={guest.ipAddress} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GuestDetailDrawer;
