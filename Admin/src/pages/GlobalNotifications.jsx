import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Bell,
    Send,
    Users,
    Shield,
    GraduationCap,
    CheckCircle2,
    FileText,
    X,
    UploadCloud
} from 'lucide-react';
import api from '../api/axios';

const GlobalNotifications = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetGroup: 'all',
        type: 'info'
    });

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [uploadingPdf, setUploadingPdf] = useState(false);

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

    const handlePdfChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are supported.');
            return;
        }

        setPdfFile(file);
        setUploadingPdf(true);

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await api.post('/assignments/upload', uploadData);
            const url = res.data.file?.url || res.data.fileUrl;
            if (url) {
                setPdfUrl(url);
                toast.success('PDF uploaded and linked successfully!');
            } else {
                throw new Error('Response did not contain file URL');
            }
        } catch (err) {
            console.error('PDF upload failed:', err);
            toast.error('Failed to upload PDF.');
            setPdfFile(null);
            setPdfUrl('');
        } finally {
            setUploadingPdf(false);
        }
    };

    const removePdf = () => {
        setPdfFile(null);
        setPdfUrl('');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/admin/broadcast', {
                ...formData,
                pdfUrl: pdfUrl || null
            });
            setSuccess(true);
            setFormData({ title: '', message: '', targetGroup: 'all', type: 'info' });
            setPdfFile(null);
            setPdfUrl('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to send broadcast');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Global <span className="text-blue-600">Broadcast</span>
                </h2>
                <p className="text-slate-500 font-medium mt-1 text-xs">
                    Send platform-wide alerts and announcements to students, mentors, or all users.
                </p>
            </header>

            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs relative overflow-hidden">
                {success && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-xs flex items-center justify-center z-10 animate-in fade-in">
                        <div className="text-center">
                            <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-slate-900">Broadcast Transmitted Successfully</h3>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSend} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Target Audience</label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {[
                                    { id: 'all', label: 'Global', icon: <Users size={16} /> },
                                    { id: 'students', label: 'Students', icon: <GraduationCap size={16} /> },
                                    { id: 'mentors', label: 'Mentors', icon: <Shield size={16} /> }
                                ].map(opt => (
                                    <button
                                        type="button"
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, targetGroup: opt.id })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${formData.targetGroup === opt.id
                                            ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-xs font-bold'
                                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white'
                                            }`}
                                    >
                                        {opt.icon}
                                        <span className="text-[10px] uppercase font-bold">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Alert Level</label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {['info', 'warning', 'success'].map(type => (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`p-3 rounded-xl border text-center transition-all uppercase text-[10px] font-bold cursor-pointer ${formData.type === type
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Broadcast Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium text-xs focus:bg-white focus:border-blue-500 outline-none transition-colors"
                            placeholder="e.g. Schedule Update for AI Workshop"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Message Content</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium text-xs focus:bg-white focus:border-blue-500 outline-none transition-colors resize-none"
                            placeholder="Enter the broadcast message..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-600">Attachment (Optional PDF)</label>
                        
                        {!pdfFile ? (
                            <div className="relative border border-dashed border-slate-300 rounded-xl p-5 hover:border-blue-500 transition-colors bg-slate-50 group cursor-pointer flex flex-col items-center justify-center text-center">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePdfChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    disabled={uploadingPdf}
                                />
                                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors mb-1" />
                                <span className="text-xs font-bold text-slate-600">
                                    {uploadingPdf ? 'Uploading attached file...' : 'Choose PDF attachment'}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">Supports PDF documents up to 10MB</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{pdfFile.name}</p>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Attached successfully</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={removePdf}
                                    className="p-1.5 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-all cursor-pointer border border-slate-200"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={sending || uploadingPdf}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={16} /> Send Broadcast
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GlobalNotifications;
