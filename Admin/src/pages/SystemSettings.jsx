import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Lock,
    Unlock,
    Power,
    ShieldAlert,
    Globe,
    Mail,
    Phone,
    Share2,
    Save,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const SystemSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalOutput, setTerminalOutput] = useState([]);

    const handleTerminalCommand = async () => {
        if (!terminalInput.trim()) return;

        const cmd = terminalInput.trim().toLowerCase();
        setTerminalOutput([...terminalOutput, `> ${terminalInput}`]);
        setTerminalInput('');

        try {
            const res = await api.post('/admin/system/command', { command: cmd });
            if (res.data.success) {
                if (res.data.output.includes('__CLEAR__')) {
                    setTerminalOutput(['[SYSTEM] Terminal context refreshed.']);
                } else {
                    setTerminalOutput(prev => [...prev, ...res.data.output]);
                }
            } else {
                setTerminalOutput(prev => [...prev, `[ERROR] ${res.data.message}`]);
            }
        } catch (err) {
            setTerminalOutput(prev => [...prev, '[CRITICAL] Transmission failed. Connection reset.']);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings');
            setSettings(res.data.settings);
        } catch (err) {
            console.error('Failed to fetch settings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (updates) => {
        setSaving(true);
        try {
            const res = await api.patch('/admin/settings', updates);
            setSettings(res.data.settings);
        } catch (err) {
            alert('Failed to sync system configuration.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!settings) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <ShieldAlert size={48} className="text-rose-500 opacity-20" />
            <h2 className="text-xl font-black text-white uppercase italic">Nexus Link Severed</h2>
            <p className="text-slate-500 text-sm max-w-xs uppercase tracking-widest font-bold">Failed to synchronize with system core.</p>
            <button onClick={fetchSettings} className="px-6 py-2 bg-sky-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Retry Sync</button>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight italic uppercase">System <span className="text-sky-500">Settings</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-1">Core Architecture & Governance Control</p>
                </div>
                {saving && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <Activity size={14} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Syncing...</span>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Maintenance Mode & Module Locks */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Maintenance Mode Card */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <button
                                onClick={() => handleUpdate({
                                    maintenanceMode: { isActive: !settings.maintenanceMode.isActive }
                                })}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${settings.maintenanceMode.isActive
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'bg-slate-800 text-slate-500 hover:text-white'
                                    }`}
                            >
                                <Power size={24} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase italic">Critical Shutdown</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform-wide Maintenance Control</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Transmission Pulse (Message)</label>
                                <textarea
                                    value={settings.maintenanceMode.message}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        maintenanceMode: { ...settings.maintenanceMode, message: e.target.value }
                                    })}
                                    onBlur={() => handleUpdate({ maintenanceMode: { message: settings.maintenanceMode.message } })}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-300 font-medium focus:border-rose-500/30 outline-none transition-all resize-none"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Module Lifecycle Grid */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center border border-sky-500/20">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase italic">Modular Locks</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fine-grained Sector Access Control</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(settings.moduleLocks).map(([key, isLocked]) => (
                                <div key={key} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-sky-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${isLocked ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</p>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isLocked ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {isLocked ? 'OFFLINE' : 'OPERATIONAL'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUpdate({ moduleLocks: { [key]: !isLocked } })}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLocked
                                            ? 'bg-emerald-500 text-slate-950'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {isLocked ? 'Activate' : 'Halt'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Virtual Control Terminal (VCT) */}
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="bg-slate-900/80 px-8 py-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Terminal Context: vct-01</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-sky-500 animate-pulse" />
                                <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Network Active</span>
                            </div>
                        </div>

                        <div className="p-8 h-80 overflow-y-auto font-mono text-sm space-y-2 bg-slate-950/50 custom-scrollbar">
                            <div className="text-emerald-500/80">[SYSTEM] Connection established. Authorization: ROOT_ACCESS</div>
                            <div className="text-slate-500">Type 'help' for available system commands.</div>
                            {terminalOutput.map((line, idx) => (
                                <div key={idx} className={line.startsWith('>') ? 'text-sky-400' : 'text-slate-300'}>
                                    {line}
                                </div>
                            ))}
                            <div className="flex items-center gap-2 pt-2">
                                <span className="text-sky-500">vct@thinkos:~$</span>
                                <input
                                    type="text"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                                    className="bg-transparent border-none outline-none text-white w-full"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Identity & Global Metadata */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] sticky top-28">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase italic">Metadata</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sync Site Identity</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Platform Designation</label>
                                <input
                                    type="text"
                                    value={settings.platformName}
                                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                    onBlur={() => handleUpdate({ platformName: settings.platformName })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold text-white focus:border-sky-500/30 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Support Axis (Email)</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input
                                        type="email"
                                        value={settings.globalConfig.supportEmail}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            globalConfig: { ...settings.globalConfig, supportEmail: e.target.value }
                                        })}
                                        onBlur={() => handleUpdate({ globalConfig: { supportEmail: settings.globalConfig.supportEmail } })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pl-10 text-xs font-bold text-white focus:border-sky-500/30 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800">
                                <div className="flex items-center gap-4 p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
                                    <ShieldCheck size={20} className="text-sky-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest leading-none">Status Level: Admin</p>
                                        <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase">Root Authorization Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
