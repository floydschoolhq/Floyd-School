import React, { useState } from 'react';
import { CheckCircle2, XCircle, Terminal, Edit3, Clock, AlertTriangle } from 'lucide-react';

export const TestCasesPanel = ({
  testCases = [],
  results = null,
  customInput = '',
  onCustomInputChange,
  isRunning = false,
  rawOutput = null
}) => {
  const [activeTab, setActiveTab] = useState(0); // 0..N-1 for sample cases, 'custom' for custom input, 'console' for raw output

  // Merge sample test case info with runtime results if available
  const mergedCases = testCases.map((tc, idx) => {
    const result = results?.find(r => r.testCaseIndex === idx + 1);
    return {
      ...tc,
      index: idx + 1,
      passed: result ? result.passed : null,
      actualOutput: result ? result.actualOutput : null,
      error: result ? result.error : null,
      executionTime: result ? result.executionTime : null
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center space-x-1 py-1">
          {mergedCases.map((tc, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tc.passed === true && <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />}
                {tc.passed === false && <XCircle size={13} className="text-red-500 shrink-0" />}
                {tc.passed === null && <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />}
                <span>Case {tc.index}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit3 size={13} />
            <span>Custom Input</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal size={13} />
            <span>Console</span>
            {rawOutput && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>
        </div>

        {isRunning && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold px-2 py-1 bg-emerald-50 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Running Code...</span>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      <div className="p-3.5 flex-1 min-h-[160px] text-xs">
        {/* Sample Test Case View */}
        {typeof activeTab === 'number' && mergedCases[activeTab] && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Sample Test Case {mergedCases[activeTab].index}
              </span>
              {mergedCases[activeTab].passed !== null && (
                <div className="flex items-center space-x-2">
                  {mergedCases[activeTab].passed ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                      <CheckCircle2 size={12} />
                      <span>Passed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[11px]">
                      <XCircle size={12} />
                      <span>Failed</span>
                    </span>
                  )}
                  {mergedCases[activeTab].executionTime && (
                    <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                      <Clock size={11} />
                      <span>{mergedCases[activeTab].executionTime}s</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error Message if failed */}
            {mergedCases[activeTab].error && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-[11px] whitespace-pre-wrap">
                <div className="flex items-center space-x-1.5 font-bold mb-1 text-red-800 font-sans">
                  <AlertTriangle size={13} />
                  <span>Execution Output / Error:</span>
                </div>
                {mergedCases[activeTab].error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Input
                </label>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800 min-h-[44px] whitespace-pre-wrap">
                  {mergedCases[activeTab].input || '<no input>'}
                </div>
              </div>

              {/* Expected Output */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Expected Output
                </label>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800 min-h-[44px] whitespace-pre-wrap">
                  {mergedCases[activeTab].expectedOutput}
                </div>
              </div>
            </div>

            {/* Actual Output if evaluated */}
            {mergedCases[activeTab].actualOutput !== null && (
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Your Output
                </label>
                <div className={`p-2.5 rounded-lg border font-mono min-h-[44px] whitespace-pre-wrap ${
                  mergedCases[activeTab].passed
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50/50 border-red-300 text-red-900'
                }`}>
                  {mergedCases[activeTab].actualOutput || '<empty output>'}
                </div>
              </div>
            )}

            {mergedCases[activeTab].explanation && (
              <p className="text-[11px] text-slate-500 italic">
                💡 Note: {mergedCases[activeTab].explanation}
              </p>
            )}
          </div>
        )}

        {/* Custom Input View */}
        {activeTab === 'custom' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">Custom Standard Input (stdin)</label>
              <span className="text-[11px] text-slate-400">Pass custom values to test your algorithm</span>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="Enter custom input here..."
              rows={4}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-xs"
            />
          </div>
        )}

        {/* Console / Raw Output View */}
        {activeTab === 'console' && (
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between font-sans">
              <span className="font-bold text-slate-800">Terminal Output</span>
              {rawOutput?.status && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
                  Status: {rawOutput.status.description || rawOutput.status}
                </span>
              )}
            </div>

            <div className="p-3 bg-slate-900 text-slate-200 rounded-lg min-h-[110px] max-h-[220px] overflow-y-auto text-xs whitespace-pre-wrap">
              {rawOutput ? (
                <>
                  {rawOutput.stdout && <div>{rawOutput.stdout}</div>}
                  {rawOutput.stderr && <div className="text-red-400 mt-1">{rawOutput.stderr}</div>}
                  {rawOutput.compile_output && <div className="text-red-400 mt-1">{rawOutput.compile_output}</div>}
                  {!rawOutput.stdout && !rawOutput.stderr && !rawOutput.compile_output && (
                    <span className="text-slate-500 italic">Program executed successfully with no console output.</span>
                  )}
                </>
              ) : (
                <span className="text-slate-500 italic">Run or submit your code to see terminal execution logs here.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCasesPanel;
