import React, { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { HelpCircle, Send, CheckCircle2 } from 'lucide-react';

const HelpSupport = () => {
  const [subject, setSubject] = useState('');
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/partner-school/support', { subject, issue });
      addToast('Support ticket submitted successfully!', 'success');
      setSubmitted(true);
      setSubject('');
      setIssue('');
    } catch (error) {
      addToast(error.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="card-3d rounded-lg p-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle size={20} className="text-slate-800" />
          Institutional Helpdesk & Support
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Submit technical, hardware kit, or curriculum queries to FloydSchool STEM Coordinators.</p>
      </div>

      <div className="card-3d rounded-lg p-6">
        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 size={40} className="mx-auto text-slate-800" />
            <h3 className="text-base font-bold text-slate-900">Support Ticket Submitted</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Our STEM Lab Coordinators have received your support request and will follow up shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 py-1.5 px-4 btn-3d-dark rounded text-xs font-bold"
            >
              Submit Another Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Query Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Request extra robotics hardware kits for Grade 10 lab"
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Issue Details</label>
              <textarea
                rows={5}
                required
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe your query or assistance needed in detail..."
                className="w-full bg-white border border-slate-300 rounded p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 btn-3d-dark rounded text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send size={14} />
              <span>{loading ? 'Submitting Request...' : 'Send Support Query'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
