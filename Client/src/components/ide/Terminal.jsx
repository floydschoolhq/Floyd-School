import React from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Terminal = ({ output = [], onClear, isRunning }) => {
    return (
        <div className="h-full flex flex-col bg-surface-base border-t border-surface-el transition-colors duration-500">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-surface-soft border-b border-surface-el transition-colors duration-500">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm font-bold text-text-main uppercase tracking-wider">Output</span>
                    {isRunning && (
                        <div className="flex items-center gap-2 ml-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Running...</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={onClear}
                    className="p-1.5 hover:bg-surface-el rounded-lg transition-colors cursor-pointer text-text-muted hover:text-text-main"
                    title="Clear output"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-surface-base text-text-main transition-colors duration-500">
                {output.length === 0 ? (
                    <div className="text-text-muted italic">
                        Output will appear here...
                    </div>
                ) : (
                    output.map((line, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "mb-2 font-medium tracking-tight",
                                line.type === 'error' && "text-red-500 bg-red-500/5 px-2.5 py-1 rounded-xl border border-red-500/10 w-fit block",
                                line.type === 'success' && "text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-xl border border-emerald-500/10 w-fit block",
                                line.type === 'info' && "text-accent-primary bg-accent-primary/5 px-2.5 py-1 rounded-xl border border-accent-primary/10 w-fit block",
                                line.type === 'output' && "text-text-main pl-2 border-l-2 border-surface-el"
                            )}
                        >
                            {line.type === 'error' && '❌ '}
                            {line.type === 'success' && '✅ '}
                            {line.type === 'info' && 'ℹ️  '}
                            {line.content}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

