import React from 'react';
import { CheckCircle2, XCircle, Award, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

export const SubmissionModal = ({
  isOpen,
  onClose,
  submissionResult,
  problemTitle,
  onNextProblem
}) => {
  if (!isOpen || !submissionResult) return null;

  const isAccepted = submissionResult.status === 'Accepted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className={`p-6 text-center border-b ${isAccepted ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex justify-center mb-3">
            {isAccepted ? (
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <Sparkles size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                <XCircle size={32} />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {isAccepted ? 'Challenge Completed!' : 'Keep Trying!'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAccepted
              ? `Congratulations! You solved "${problemTitle || 'Challenge'}" flawlessly.`
              : `Your solution didn't pass all test cases for "${problemTitle || 'Challenge'}".`}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {submissionResult.score} pts
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Test Cases</div>
              <div className={`text-base font-bold mt-0.5 ${isAccepted ? 'text-emerald-600' : 'text-red-600'}`}>
                {submissionResult.passedTestCases}/{submissionResult.totalTestCases}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Runtime</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {submissionResult.executionTime}s
              </div>
            </div>
          </div>
        </div>

        {/* Test Case Breakdown */}
        <div className="p-5 max-h-60 overflow-y-auto space-y-2 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Test Case Evaluation Breakdown
          </div>
          {submissionResult.testCaseResults?.map((tc, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                tc.passed
                  ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                  : 'bg-red-50/40 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                {tc.passed ? (
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <XCircle size={14} className="text-red-500 shrink-0" />
                )}
                <span className="font-semibold">
                  Test Case #{tc.testCaseIndex} {tc.isHidden ? '(Hidden Test)' : '(Sample)'}
                </span>
              </div>
              <span className="font-mono text-[11px] opacity-75">
                {tc.executionTime ? `${tc.executionTime}s` : '0.05s'}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Review Solution
          </button>

          {isAccepted && onNextProblem && (
            <button
              type="button"
              onClick={onNextProblem}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <span>Next Challenge</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
