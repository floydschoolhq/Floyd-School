import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Home, BookOpen, Code, BarChart2,
    PlayCircle, FileText, HeadphonesIcon, X,
    ArrowRight, Zap, Sun, Moon, Monitor, Command
} from 'lucide-react';

const ALL_COMMANDS = [
    // Navigation
    { id: 'dashboard', label: 'Go to Dashboard', icon: Home, group: 'Navigate', view: 'Dashboard' },
    { id: 'classroom', label: 'Go to Classroom', icon: BookOpen, group: 'Navigate', view: 'Classroom' },
    { id: 'coding', label: 'Open Coding Lab', icon: Code, group: 'Navigate', view: 'CodingLab' },
    { id: 'recordings', label: 'Browse Recordings', icon: PlayCircle, group: 'Navigate', view: 'Recordings' },
    { id: 'progress', label: 'View Progress Tracking', icon: BarChart2, group: 'Navigate', view: 'ProgressTracking' },
    { id: 'report', label: 'Performance Report', icon: FileText, group: 'Navigate', view: 'PerformanceReport' },
    { id: 'support', label: 'Get Support', icon: HeadphonesIcon, group: 'Navigate', view: 'Support' },
    // Themes
    { id: 'theme-modern', label: 'Switch to Modern Theme', icon: Sun, group: 'Theme', theme: 'modern' },
    { id: 'theme-studio', label: 'Switch to Studio Theme', icon: Moon, group: 'Theme', theme: 'studio' },
    { id: 'theme-cyber', label: 'Switch to Cyber Theme', icon: Monitor, group: 'Theme', theme: 'cyber' },
];

const fuzzy = (query, str) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return str.toLowerCase().includes(q);
};

const CommandPalette = ({ isOpen, onClose, onNavigate, onTheme }) => {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelected(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const results = ALL_COMMANDS.filter(c => fuzzy(query, c.label));

    const run = useCallback((cmd) => {
        if (cmd.view) onNavigate?.(cmd.view);
        if (cmd.theme) onTheme?.(cmd.theme);
        onClose();
    }, [onNavigate, onTheme, onClose]);

    useEffect(() => {
        const handler = (e) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); if (results[selected]) run(results[selected]); }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, results, selected, run, onClose]);

    // Group results
    const grouped = results.reduce((acc, cmd) => {
        if (!acc[cmd.group]) acc[cmd.group] = [];
        acc[cmd.group].push(cmd);
        return acc;
    }, {});

    let globalIdx = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[9991] w-full max-w-[560px] px-4"
                    >
                        <div className="bg-[#0F172A] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden">

                            {/* Search Row */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                                <Search className="w-4 h-4 text-white/40 shrink-0" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setSelected(0); }}
                                    placeholder="Search commands…"
                                    className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm font-medium outline-none"
                                />
                                {query && (
                                    <button onClick={() => setQuery('')} className="text-white/30 hover:text-white/60 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-white/30 bg-white/5 rounded-md border border-white/10">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-[360px] overflow-y-auto py-2">
                                {results.length === 0 ? (
                                    <div className="text-center py-12 text-white/30 text-sm font-medium">
                                        No commands found for "<span className="text-white/50">{query}</span>"
                                    </div>
                                ) : (
                                    Object.entries(grouped).map(([group, cmds]) => (
                                        <div key={group}>
                                            <p className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
                                                {group}
                                            </p>
                                            {cmds.map((cmd) => {
                                                const idx = globalIdx++;
                                                const isSelected = idx === selected;
                                                const Icon = cmd.icon;
                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={() => run(cmd)}
                                                        onMouseEnter={() => setSelected(idx)}
                                                        className={`
                              w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-xl transition-all duration-100
                              ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
                            `}
                                                        style={{ width: 'calc(100% - 8px)' }}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#2563EB]' : 'bg-white/5'}`}>
                                                            <Icon className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="flex-1 text-left text-sm font-medium text-white/80">{cmd.label}</span>
                                                        {isSelected && (
                                                            <motion.div layoutId="cmd-arrow" className="text-white/40">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-white/10 flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><kbd className="bg-white/5 rounded px-1 py-0.5 text-white/30">↑↓</kbd> Navigate</span>
                                <span className="flex items-center gap-1"><kbd className="bg-white/5 rounded px-1 py-0.5 text-white/30">↵</kbd> Select</span>
                                <span className="ml-auto flex items-center gap-1">
                                    <Command className="w-3 h-3" />
                                    <span>ThinkSkool Command</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
