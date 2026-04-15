import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Bell,
    Send,
    Users,
    Shield,
    GraduationCap,
    CheckCircle2
} from 'lucide-react';
import api from '../api/axios';

const GlobalNotifications = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetGroup: 'all', // all, students, mentors
        type: 'info'
    });

    useEffect(() => {
        if (location.state) {
            setFormData(prev => ({
                ...prev,
                ...location.state
            }));
        }
    }, [location.state]);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/admin/broadcast', formData);
            setSuccess(true);
            setFormData({ title: '', message: '', targetGroup: 'all', type: 'info' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to send broadcast');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <header className="text-center">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Global <span className="text-sky-500 not-italic">Broadcast</span>
                </h2>
                <p className="text-slate-500 font-black mt-2 uppercase tracking-[0.3em] text-[10px]">
                    System-wide alert transmission protocol
                </p>
            </header>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] relative overflow-hidden">
                {success && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in">
                        <div className="text-center">
                            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-white uppercase italic">Transmission Complete</h3>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSend} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Target Frequency</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'all', label: 'Global', icon: <Users size={16} /> },
                                    { id: 'students', label: 'Students', icon: <GraduationCap size={16} /> },
                                    { id: 'mentors', label: 'Mentors', icon: <Shield size={16} /> }
                                ].map(opt => (
                                    <button
                                        type="button"
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, targetGroup: opt.id })}
                                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.targetGroup === opt.id
                                            ? 'bg-sky-500 text-slate-950 border-sky-500'
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                            }`}
                                    >
                                        {opt.icon}
                                        <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Alert Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['info', 'warning', 'success'].map(type => (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`p-4 rounded-2xl border text-center transition-all uppercase tracking-widest text-[9px] font-black ${formData.type === type
                                            ? 'bg-white text-slate-950 border-white'
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Transmission Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold focus:border-sky-500/50 outline-none transition-colors"
                            placeholder="e.g., System Maintenance Scheduled"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Payload Message</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-medium focus:border-sky-500/50 outline-none transition-colors resize-none"
                            placeholder="Enter the details of the broadcast..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3"
                    >
                        {sending ? (
                            <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={20} /> Initiate Broadcast
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GlobalNotifications;
