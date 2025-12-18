import React from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Terminal = ({ output = [], onClear, isRunning }) => {
    return (
        <div className="h-full flex flex-col bg-slate-950 border-t border-slate-800">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-slate-300">Output</span>
                    {isRunning && (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-400">Running...</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={onClear}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                    title="Clear output"
                >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {output.length === 0 ? (
                    <div className="text-slate-500 italic">
                        Output will appear here...
                    </div>
                ) : (
                    output.map((line, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "mb-1",
                                line.type === 'error' && "text-red-400",
                                line.type === 'success' && "text-green-400",
                                line.type === 'info' && "text-sky-400",
                                line.type === 'output' && "text-slate-300"
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
