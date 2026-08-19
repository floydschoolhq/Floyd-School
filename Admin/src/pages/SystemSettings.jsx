import React, { useState, useEffect } from 'react';
import {
    Power,
    ShieldAlert,
    Globe,
    Mail,
    Lock,
    Unlock,
    Activity,
    ShieldCheck
} from 'lucide-react';
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
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!settings) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <ShieldAlert size={48} className="text-rose-500 opacity-20" />
            <h2 className="text-xl font-bold text-slate-900">System Link Error</h2>
            <p className="text-slate-500 text-xs">Failed to synchronize with system settings.</p>
            <button onClick={fetchSettings} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer">Retry Sync</button>
        </div>
    );

    return (
        <div className="space-y-6 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        System <span className="text-blue-600">Settings</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-xs mt-1">Core Architecture & Governance Control</p>
                </div>
                {saving && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <Activity size={14} className="text-emerald-600 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700">Syncing changes...</span>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Maintenance Mode & Module Locks */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Maintenance Mode Card */}
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs relative overflow-hidden">
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => handleUpdate({
                                    maintenanceMode: { isActive: !settings.maintenanceMode.isActive }
                                })}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${settings.maintenanceMode.isActive
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                <Power size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Maintenance Mode</h3>
                                <p className="text-xs text-slate-500 font-medium">Platform-wide Maintenance Access Gate</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">Maintenance Notice Message</label>
                                <textarea
                                    value={settings.maintenanceMode.message}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        maintenanceMode: { ...settings.maintenanceMode, message: e.target.value }
                                    })}
                                    onBlur={() => handleUpdate({ maintenanceMode: { message: settings.maintenanceMode.message } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Module Lifecycle Grid */}
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Modular Access Locks</h3>
                                <p className="text-xs text-slate-500 font-medium">Fine-grained Sector Access Control</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(settings.moduleLocks).map(([key, isLocked]) => (
                                <div key={key} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isLocked ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{key.replace(/([A-Z])/g, ' $1')}</p>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLocked ? 'text-amber-700' : 'text-emerald-700'}`}>
                                                {isLocked ? 'OFFLINE' : 'OPERATIONAL'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUpdate({ moduleLocks: { [key]: !isLocked } })}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${isLocked
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        {isLocked ? 'Activate' : 'Halt'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Virtual Control Terminal */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Diagnostic Terminal</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Activity size={11} className="text-emerald-400 animate-pulse" />
                                <span className="text-[9px] font-bold text-emerald-400 uppercase">Live</span>
                            </div>
                        </div>

                        <div className="p-6 h-64 overflow-y-auto font-mono text-xs space-y-1.5 bg-slate-900 text-slate-200">
                            <div className="text-emerald-400">[SYSTEM] Connection established. Floyd School Admin Shell.</div>
                            <div className="text-slate-500">Type 'help' for available system commands.</div>
                            {terminalOutput.map((line, idx) => (
                                <div key={idx} className={line.startsWith('>') ? 'text-blue-400' : 'text-slate-300'}>
                                    {line}
                                </div>
                            ))}
                            <div className="flex items-center gap-2 pt-1">
                                <span className="text-blue-400">admin@floydschool:~$</span>
                                <input
                                    type="text"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                                    className="bg-transparent border-none outline-none text-white w-full font-mono text-xs"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Identity & Global Metadata */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Platform Identity</h3>
                                <p className="text-xs text-slate-500 font-medium">Sync Site Metadata</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Platform Designation</label>
                                <input
                                    type="text"
                                    value={settings.platformName}
                                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                    onBlur={() => handleUpdate({ platformName: settings.platformName })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Support Email</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={settings.globalConfig.supportEmail}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            globalConfig: { ...settings.globalConfig, supportEmail: e.target.value }
                                        })}
                                        onBlur={() => handleUpdate({ globalConfig: { supportEmail: settings.globalConfig.supportEmail } })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-9 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                    <ShieldCheck size={18} className="text-blue-600" />
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 leading-none">Authority: Admin</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Root Permissions Active</p>
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
